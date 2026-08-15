-- Increase the length limits for publication_files columns
-- This is necessary to support long MIME types (like .pptx) and long file paths.

ALTER TABLE publication_files ALTER COLUMN type TYPE VARCHAR(255);
ALTER TABLE publication_files ALTER COLUMN size TYPE VARCHAR(255);
ALTER TABLE publication_files ALTER COLUMN path TYPE TEXT;
