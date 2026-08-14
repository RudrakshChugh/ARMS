// Using Node 18+ global FormData and global Blob/File built-in values natively.
import http from 'http';

const BASE_URL = 'http://localhost:5000/api';
const STATIC_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- STARTING PORTAL FILE INTEGRATION TESTS ---');

  try {
    // 1. Authenticate as Admin
    console.log('Authenticating as Admin...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@workspace.edu', password: 'admin123' })
    });

    if (!loginRes.ok) {
      throw new Error(`Login failed with status: ${loginRes.status}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful. JWT retrieved.');

    // Helper to perform multipart upload
    const uploadTestFile = async (fileName, mimeType, fileContent) => {
      console.log(`Uploading test file: ${fileName} (${mimeType})...`);
      
      const formData = new FormData();
      const blob = new Blob([fileContent], { type: mimeType });
      formData.append('file', blob, fileName);

      const uploadRes = await fetch(`${BASE_URL}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload failed with status: ${uploadRes.status}`);
      }

      const uploadData = await uploadRes.json();
      if (!uploadData.success || !uploadData.file || !uploadData.file.path) {
        throw new Error(`Upload response missing path payload: ${JSON.stringify(uploadData)}`);
      }

      console.log(`Upload successful. Path: ${uploadData.file.path}`);
      return uploadData.file;
    };

    // 2. Upload test files
    const pdfData = await uploadTestFile('test.pdf', 'application/pdf', '%PDF-1.4 dummy contents');
    const pngData = await uploadTestFile('test.png', 'image/png', 'dummy png content bytes');
    const pptxData = await uploadTestFile('test.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'dummy pptx slide package bytes');

    // 3. Verify static file serving and MIME types
    const verifyFileServing = async (fileData, expectedMime) => {
      const fileUrl = `${STATIC_URL}${fileData.path}`;
      console.log(`Verifying static retrieval: ${fileUrl}...`);
      
      const res = await fetch(fileUrl, { method: 'GET' });
      console.log(`HTTP Status: ${res.status}`);
      const contentType = res.headers.get('content-type');
      console.log(`Content-Type: ${contentType}`);

      if (res.status !== 200) {
        throw new Error(`Expected status 200 but received: ${res.status}`);
      }

      // Check if contentType contains the expected MIME type (ignoring charset parameter if any)
      if (!contentType || !contentType.toLowerCase().includes(expectedMime.toLowerCase())) {
        throw new Error(`MIME type mismatch. Expected: ${expectedMime}, Received: ${contentType}`);
      }

      console.log(`VERIFICATION PASS: ${fileData.name}`);
    };

    await verifyFileServing(pdfData, 'application/pdf');
    await verifyFileServing(pngData, 'image/png');
    await verifyFileServing(pptxData, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');

    console.log('--- ALL FILE INTEGRATION TESTS PASSED SUCCESSFULLY ---');
  } catch (err) {
    console.error('--- FILE INTEGRATION TEST FAILURE ---');
    console.error(err.message);
    process.exit(1);
  }
}

runTests();
