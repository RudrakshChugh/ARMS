import db from '../config/db.js';
import storageService from '../services/storage/index.js';

// A release is addressed by three different ids depending on which page issued the
// request: a stage id ('stage-1786824663626'), a prefixed publication id ('pub-4'),
// or a raw numeric publication id. Resolve any of them to the publication row and
// the version string that ties the five tables together.
// Returns null when nothing matches, so callers can answer 404.
const resolvePublication = async (client, id) => {
  let version = id;
  let projectId = 1;
  let pubId = null;

  if (id.startsWith('stage-')) {
    const stageRes = await client.query('SELECT version, project_id FROM stages WHERE id = $1', [id]);
    if (stageRes.rows.length === 0) return null;
    version = stageRes.rows[0].version;
    projectId = stageRes.rows[0].project_id;
  } else {
    const rawId = id.replace('pub-', '');
    if (/^\d+$/.test(rawId)) {
      const pubRes = await client.query('SELECT id, version, project_id FROM publications WHERE id = $1', [rawId]);
      if (pubRes.rows.length > 0) {
        version = pubRes.rows[0].version;
        projectId = pubRes.rows[0].project_id || 1;
        pubId = pubRes.rows[0].id;
      }
    }
  }

  if (!pubId) {
    const pubRes = await client.query('SELECT id, project_id FROM publications WHERE version = $1', [version]);
    if (pubRes.rows.length === 0) return null;
    pubId = pubRes.rows[0].id;
    projectId = pubRes.rows[0].project_id || 1;
  }

  return { version, projectId, pubId };
};

const cleanupUploadedFiles = async (assets) => {
  if (assets && assets.length > 0) {
    for (const asset of assets) {
      if (asset.path) {
        try {
          await storageService.deleteFile(asset.path);
        } catch (delErr) {
          console.error(`Failed to clean up uploaded file ${asset.path}:`, delErr);
        }
      }
    }
  }
};

export const publishRelease = async (req, res) => {
  const { title, version, author, stageName, changeSummary, commit, assets } = req.body;
  const userId = req.user.id;

  // 1. Backend Validations
  if (!title || !version || !author || !stageName || !changeSummary) {
    return res.status(400).json({ error: 'All fields (title, version, author, stageName, changeSummary) are required.' });
  }

  const trimmedStageName = stageName.trim();
  if (!trimmedStageName) {
    return res.status(400).json({ error: 'Milestone stage target name cannot be empty.' });
  }

  // Standard version validation format check
  const versionRegex = /^v\d+\.\d+(\.\d+)?$/;
  if (!versionRegex.test(version.trim())) {
    return res.status(400).json({ error: 'Version tag must follow standard format (e.g. v1.0, v1.2, or v1.2.3).' });
  }

  // Optional commit SHA validation (exactly 7 hexadecimal characters)
  if (commit && commit.trim() !== '') {
    const commitRegex = /^[0-9a-fA-F]{7}$/;
    if (!commitRegex.test(commit.trim())) {
      return res.status(400).json({ error: 'Commit SHA must be exactly 7 hexadecimal characters.' });
    }
  }

  const client = await db.pool.connect();
  try {
    // Start Transaction
    await client.query('BEGIN');

    // Fetch user database profile to secure author parameter from JWT credentials
    const userRes = await client.query('SELECT name FROM users WHERE id = $1', [userId]);
    const dbAuthorName = userRes.rows[0]?.name || 'Admin';

    // 2. Check for duplicate versions (globally unique version)
    const dupRes = await client.query('SELECT id FROM publications WHERE version = $1', [version.trim()]);
    if (dupRes.rows.length > 0) {
      await client.query('ROLLBACK');
      await cleanupUploadedFiles(assets);
      return res.status(409).json({ error: `Version tag "${version.trim()}" has already been published.` });
    }

    // 2.2. Prevent duplicate stage names (case-insensitive and whitespace trimmed)
    const stageCheck = await client.query('SELECT id FROM stages WHERE LOWER(TRIM(name)) = LOWER($1)', [trimmedStageName]);
    if (stageCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      await cleanupUploadedFiles(assets);
      return res.status(400).json({ error: `Milestone stage "${trimmedStageName}" already exists in the Project Journey.` });
    }

    const getFormattedDate = () => {
      const options = { month: 'short', day: '2-digit', year: 'numeric' };
      return new Date().toLocaleDateString('en-US', options);
    };

    const getFormattedTimestamp = () => {
      const dateStr = getFormattedDate();
      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      return `${dateStr} ${timeStr}`;
    };

    const pubDate = getFormattedDate();
    const pubTimestamp = getFormattedTimestamp();

    // Default animation pipeline JSON steps
    const defaultPipeline = [
      { name: "Validation", status: "Success", timestamp: pubTimestamp },
      { name: "Metadata Verification", status: "Success", timestamp: pubTimestamp },
      { name: "File Registration", status: "Success", timestamp: pubTimestamp },
      { name: "Version Creation", status: "Success", timestamp: pubTimestamp },
      { name: "Journey Update", status: "Success", timestamp: pubTimestamp },
      { name: "Homepage Update", status: "Success", timestamp: pubTimestamp },
      { name: "Activity Update", status: "Success", timestamp: pubTimestamp },
      { name: "Release History Update", status: "Success", timestamp: pubTimestamp },
      { name: "Publication Complete", status: "Success", timestamp: pubTimestamp }
    ];

    // Primary project ID fallback
    let projRes = await client.query('SELECT id FROM projects LIMIT 1');
    let projectId = projRes.rows[0]?.id;

    if (!projectId) {
      // Auto-create a default project to satisfy the foreign key constraint
      const newProj = await client.query(
        'INSERT INTO projects (name, description, created_by, is_primary) VALUES ($1, $2, $3, $4) RETURNING id',
        ['Default Project', 'Auto-generated primary project', userId, true]
      );
      projectId = newProj.rows[0].id;
    }

    const pubRes = await client.query(
      `INSERT INTO publications (project_id, version, date, author, title, changes, assets_count, pipeline, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [projectId, version.trim(), pubDate, dbAuthorName, title.trim(), changeSummary.trim(), assets?.length || 0, JSON.stringify(defaultPipeline), userId]
    );

    const publicationId = pubRes.rows[0].id;

    // 4. Insert files into publication_files
    if (assets && assets.length > 0) {
      for (const asset of assets) {
        const fileRes = await client.query(
          `INSERT INTO publication_files (publication_id, name, type, size, path)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [publicationId, asset.name, asset.type, asset.size || '1.0 MB', asset.path]
        );
        asset.id = fileRes.rows[0].id;
      }
    }

    // 5. Create a version record in project_versions
    const filesChangedList = assets ? assets.map(a => `docs/${a.name}`) : [];
    
    await client.query(
      `INSERT INTO project_versions (project_id, version, date, author, change_summary, commit_sha, files_changed, added, modified, removed)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        projectId, 
        version.trim(), 
        pubDate, 
        dbAuthorName, 
        changeSummary.trim(), 
        commit ? commit.trim() : 'a82fc21', 
        JSON.stringify(filesChangedList),
        JSON.stringify([`Initial publication of: ${title.trim()}`]),
        JSON.stringify([]),
        JSON.stringify([])
      ]
    );

    // 6. Create a NEW milestone stage target in stages (sequential order)
    const maxOrderRes = await client.query('SELECT COALESCE(MAX(order_number), 0) as max_order FROM stages');
    const nextOrder = maxOrderRes.rows[0].max_order + 1;
    
    // Add random suffix so concurrent publishes within the same millisecond cannot collide on PK
    const newStageId = `stage-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const formattedAssetsJSON = JSON.stringify(assets ? assets.map(a => ({ id: a.id, type: a.type, name: a.name, path: a.path, size: a.size })) : []);

    await client.query(
      `INSERT INTO stages (id, project_id, name, date, status, owner, version, summary, changes, commit_sha, details, assets, order_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        newStageId, 
        projectId, 
        trimmedStageName, 
        pubDate, 
        'In Progress', 
        dbAuthorName, 
        version.trim(), 
        changeSummary.trim(), 
        changeSummary.trim(), 
        commit ? commit.trim() : 'a82fc21', 
        JSON.stringify([`Published release document: ${title.trim()}`]),
        formattedAssetsJSON,
        nextOrder
      ]
    );

    // 7. Create activity log
    await client.query(
      `INSERT INTO activities (action, person, timestamp, version, user_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [`Published release ${version.trim()}: ${title.trim()}`, dbAuthorName, pubTimestamp, version.trim(), userId]
    );

    // Commit Transaction
    await client.query('COMMIT');

    res.status(201).json({ success: true, version: version.trim(), stageId: newStageId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Publication transaction error:', err);
    await cleanupUploadedFiles(assets);
    // Do not leak DB internals (err.message/err.detail) to the client
    res.status(500).json({ error: 'Database transaction failed.' });
  } finally {
    client.release();
  }
};

export const getPublications = async (req, res) => {
  try {
    const pubRes = await db.query('SELECT * FROM publications ORDER BY id DESC');
    
    const publications = [];
    for (const pub of pubRes.rows) {
      const fileRes = await db.query('SELECT id, name, type, size, path FROM publication_files WHERE publication_id = $1', [pub.id]);
      
      // Standardize model naming for the frontend
      publications.push({
        id: `pub-${pub.id}`,
        version: pub.version,
        date: pub.date,
        author: pub.author,
        title: pub.title,
        changes: pub.changes,
        assetsCount: pub.assets_count,
        pipeline: pub.pipeline,
        assets: fileRes.rows
      });
    }

    res.json(publications);
  } catch (err) {
    console.error('Get publications error:', err);
    res.status(500).json({ error: 'Database query failed.' });
  }
};

export const deleteRelease = async (req, res) => {
  const { id } = req.params;

  const client = await db.pool.connect();
  try {
    // Start Transaction
    await client.query('BEGIN');

    // 1. The id may be a stage id, a pub- id, or a raw numeric id.
    const resolved = await resolvePublication(client, id);
    if (!resolved) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Publication record not found for this version.' });
    }
    const { version: versionToDelete, projectId, pubId } = resolved;

    // 2. Fetch publication_files paths to clean up filesystem files after commit
    const fileRes = await client.query('SELECT path FROM publication_files WHERE publication_id = $1', [pubId]);
    const filesToCleanup = fileRes.rows;

    // 3. Delete version record matching version
    await client.query('DELETE FROM project_versions WHERE version = $1 AND project_id = $2', [versionToDelete, projectId]);

    // 4. Delete Project Journey stages matching version
    await client.query('DELETE FROM stages WHERE version = $1 AND project_id = $2', [versionToDelete, projectId]);

    // 5. Delete activity log entries matching version
    await client.query('DELETE FROM activities WHERE version = $1', [versionToDelete]);

    // 6. Delete publication (this cascades to publication_files in DB)
    await client.query('DELETE FROM publications WHERE id = $1', [pubId]);

    // 7. Recalculate order_number for remaining stages to preserve sequential order
    const remainingStagesRes = await client.query('SELECT id FROM stages ORDER BY order_number ASC');
    let currentOrder = 1;
    for (const stageRow of remainingStagesRes.rows) {
      await client.query('UPDATE stages SET order_number = $1 WHERE id = $2', [currentOrder, stageRow.id]);
      currentOrder++;
    }

    // Commit Transaction
    await client.query('COMMIT');

    // 8. Physical files deletion from storage provider. This runs after COMMIT, so a
    // storage failure must not reach the catch below: rolling back a committed
    // transaction is a no-op and would report a successful deletion as a 500.
    // cleanupUploadedFiles logs and swallows per-file errors, leaving at worst an
    // orphaned object in the bucket.
    await cleanupUploadedFiles(filesToCleanup);

    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete publication transaction error:', err);
    res.status(500).json({ error: 'Database transaction failed, deletion rolled back.' });
  } finally {
    client.release();
  }
};

// Edit an already-published release. Publishing denormalises the same facts across
// publications, project_versions, stages and activities, so an edit has to update
// every copy inside one transaction or the pages disagree with each other.
// The version tag is deliberately NOT editable: it is the key joining those tables.

// Edit an already-published release. Publishing denormalises the same facts across
// publications, project_versions, stages and activities, so an edit has to update
// every copy inside one transaction or the pages disagree with each other.
//
// The version tag is editable, but it is the key joining those four tables, so a
// rename has to be applied to all of them together.
//
// `assets` is the desired FINAL list of files: entries carrying an `id` are kept,
// existing rows absent from the list are deleted (and their objects removed from
// storage after COMMIT), and entries without an `id` are inserted. Omit the field
// entirely to leave the attached files untouched.
export const updateRelease = async (req, res) => {
  const { id } = req.params;
  const { title, version, stageName, changeSummary, commit, assets } = req.body;

  // 1. Validation mirrors publishRelease, minus author
  if (!title || !stageName || !changeSummary) {
    return res.status(400).json({ error: 'Fields (title, stageName, changeSummary) are required.' });
  }

  const trimmedStageName = stageName.trim();
  if (!trimmedStageName) {
    return res.status(400).json({ error: 'Milestone stage target name cannot be empty.' });
  }

  const wantsVersionChange = version !== undefined && version !== null && String(version).trim() !== '';
  const newVersionTag = wantsVersionChange ? String(version).trim() : null;
  if (wantsVersionChange) {
    const versionRegex = /^v\d+\.\d+(\.\d+)?$/;
    if (!versionRegex.test(newVersionTag)) {
      return res.status(400).json({ error: 'Version tag must follow standard format (e.g. v1.0, v1.2, or v1.2.3).' });
    }
  }

  if (commit && commit.trim() !== '') {
    const commitRegex = /^[0-9a-fA-F]{7}$/;
    if (!commitRegex.test(commit.trim())) {
      return res.status(400).json({ error: 'Commit SHA must be exactly 7 hexadecimal characters.' });
    }
  }

  const incomingAssets = Array.isArray(assets) ? assets : null;

  const client = await db.pool.connect();
  let filesToPurge = [];
  try {
    await client.query('BEGIN');

    const resolved = await resolvePublication(client, id);
    if (!resolved) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Publication record not found for this version.' });
    }
    const { version: oldVersion, projectId, pubId } = resolved;
    const targetVersion = newVersionTag || oldVersion;

    // 2. A rename must not collide with a different milestone. Stages belonging to
    // this same release are excluded so saving without renaming is allowed.
    const stageCheck = await client.query(
      'SELECT id FROM stages WHERE LOWER(TRIM(name)) = LOWER($1) AND version IS DISTINCT FROM $2',
      [trimmedStageName, oldVersion]
    );
    if (stageCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Milestone stage "${trimmedStageName}" already exists in the Project Journey.` });
    }

    // 3. The version tag is globally unique across publications and changelogs
    if (targetVersion !== oldVersion) {
      const dupPub = await client.query(
        'SELECT id FROM publications WHERE version = $1 AND id <> $2',
        [targetVersion, pubId]
      );
      const dupVer = await client.query(
        'SELECT id FROM project_versions WHERE version = $1 AND version <> $2',
        [targetVersion, oldVersion]
      );
      if (dupPub.rows.length > 0 || dupVer.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: `Version tag "${targetVersion}" has already been published.` });
      }
    }

    const newTitle = title.trim();
    const newSummary = changeSummary.trim();
    const newCommit = commit && commit.trim() !== '' ? commit.trim() : null;

    // 4. Reconcile attached files when the caller sent a list
    let finalAssets = null;
    if (incomingAssets) {
      const existingRes = await client.query(
        'SELECT id, path FROM publication_files WHERE publication_id = $1',
        [pubId]
      );

      const keepIds = new Set(
        incomingAssets
          .filter(a => a && a.id !== undefined && a.id !== null)
          .map(a => Number(a.id))
      );

      const removed = existingRes.rows.filter(row => !keepIds.has(Number(row.id)));
      if (removed.length > 0) {
        await client.query(
          'DELETE FROM publication_files WHERE id = ANY($1::int[])',
          [removed.map(row => Number(row.id))]
        );
        // Only purge from storage once the transaction actually commits
        filesToPurge = removed;
      }

      for (const asset of incomingAssets) {
        if (asset.id === undefined || asset.id === null) {
          const insertRes = await client.query(
            `INSERT INTO publication_files (publication_id, name, type, size, path)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [pubId, asset.name, asset.type, asset.size || '1.0 MB', asset.path]
          );
          asset.id = insertRes.rows[0].id;
        }
      }

      finalAssets = incomingAssets.map(a => ({
        id: a.id, type: a.type, name: a.name, path: a.path, size: a.size
      }));
    }

    // 5. Publication record
    await client.query(
      'UPDATE publications SET title = $1, changes = $2, version = $3 WHERE id = $4',
      [newTitle, newSummary, targetVersion, pubId]
    );
    if (finalAssets) {
      await client.query('UPDATE publications SET assets_count = $1 WHERE id = $2', [finalAssets.length, pubId]);
    }

    // 6. Changelog record
    await client.query(
      `UPDATE project_versions
       SET change_summary = $1, commit_sha = COALESCE($2, commit_sha), version = $3
       WHERE version = $4 AND project_id = $5`,
      [newSummary, newCommit, targetVersion, oldVersion, projectId]
    );
    if (finalAssets) {
      await client.query(
        'UPDATE project_versions SET files_changed = $1 WHERE version = $2 AND project_id = $3',
        [JSON.stringify(finalAssets.map(a => `docs/${a.name}`)), targetVersion, projectId]
      );
    }

    // 7. Journey milestone
    await client.query(
      `UPDATE stages
       SET name = $1, summary = $2, changes = $3, commit_sha = COALESCE($4, commit_sha),
           details = $5, version = $6
       WHERE version = $7 AND project_id = $8`,
      [
        trimmedStageName,
        newSummary,
        newSummary,
        newCommit,
        JSON.stringify([`Published release document: ${newTitle}`]),
        targetVersion,
        oldVersion,
        projectId
      ]
    );
    if (finalAssets) {
      await client.query(
        'UPDATE stages SET assets = $1 WHERE version = $2 AND project_id = $3',
        [JSON.stringify(finalAssets), targetVersion, projectId]
      );
    }

    // 8. Keep the activity feed from showing a title or version that no longer exists
    await client.query(
      'UPDATE activities SET action = $1, version = $2 WHERE version = $3',
      [`Published release ${targetVersion}: ${newTitle}`, targetVersion, oldVersion]
    );

    await client.query('COMMIT');

    // 9. Remove detached objects from storage only after the rows are gone for good
    await cleanupUploadedFiles(filesToPurge);

    res.json({ success: true, version: targetVersion });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update publication transaction error:', err);
    res.status(500).json({ error: 'Database transaction failed, update rolled back.' });
  } finally {
    client.release();
  }
};
