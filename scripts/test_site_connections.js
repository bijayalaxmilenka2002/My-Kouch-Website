import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('server/.env') });

async function checkConnections() {
  console.log('===============================================================');
  console.log('   myKouch™ COMPLETE SITES & DATABASE CONNECTIONS AUDIT');
  console.log('===============================================================\n');

  const report = [];

  // 1. Local Server Health
  console.log('--- 1. Testing Local Backend (http://localhost:5000) ---');
  try {
    const res = await fetch('http://localhost:5000/api/health');
    const data = await res.json();
    const passed = res.ok && data.status === 'OK';
    report.push({ service: 'Local Server Health', url: 'http://localhost:5000/api/health', status: res.status, passed, data });
    console.log(`[Local Server] Status: ${res.status} | Passed: ${passed} | DB State: ${data.database}`);
  } catch (err) {
    report.push({ service: 'Local Server Health', url: 'http://localhost:5000/api/health', passed: false, error: err.message });
    console.error(`[Local Server Error]: ${err.message}`);
  }

  // 2. Local Products API
  try {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    const passed = res.ok && data.products && data.products.length > 0;
    report.push({ service: 'Local Products API', url: 'http://localhost:5000/api/products', status: res.status, count: data.products?.length, passed });
    console.log(`[Local Products] Status: ${res.status} | Product count in DB: ${data.products?.length}`);
  } catch (err) {
    report.push({ service: 'Local Products API', passed: false, error: err.message });
    console.error(`[Local Products Error]: ${err.message}`);
  }

  // 3. Local Owner Auth API
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@mykouch.in', password: 'MyKouch@2026' }),
    });
    const data = await res.json();
    const passed = res.ok && data.success && !!data.token;
    report.push({ service: 'Local Owner Auth API', url: 'http://localhost:5000/api/auth/login', status: res.status, passed });
    console.log(`[Local Owner Auth] Status: ${res.status} | Token received: ${!!data.token}`);
  } catch (err) {
    report.push({ service: 'Local Owner Auth API', passed: false, error: err.message });
    console.error(`[Local Owner Auth Error]: ${err.message}`);
  }

  // 4. MongoDB Atlas Direct Connection
  console.log('\n--- 2. Testing MongoDB Atlas Cloud Connection ---');
  try {
    const uri = process.env.MONGODB_URI;
    const start = Date.now();
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    const ping = Date.now() - start;
    const collections = await mongoose.connection.db.listCollections().toArray();
    report.push({ service: 'MongoDB Atlas', passed: true, latencyMs: ping, collectionsCount: collections.length });
    console.log(`[MongoDB Atlas] Connected in ${ping}ms | Collections: ${collections.map((c) => c.name).join(', ')}`);
    await mongoose.disconnect();
  } catch (err) {
    report.push({ service: 'MongoDB Atlas', passed: false, error: err.message });
    console.error(`[MongoDB Atlas Error]: ${err.message}`);
  }

  // 5. Local Frontend Dev Server (http://localhost:5173)
  console.log('\n--- 3. Testing Local Frontend Server (http://localhost:5173) ---');
  try {
    const res = await fetch('http://localhost:5173/');
    const passed = res.ok && res.status === 200;
    report.push({ service: 'Local Frontend Server', url: 'http://localhost:5173/', status: res.status, passed });
    console.log(`[Local Frontend] Status: ${res.status} | Passed: ${passed}`);
  } catch (err) {
    report.push({ service: 'Local Frontend Server', passed: false, error: err.message });
    console.error(`[Local Frontend Error]: ${err.message}`);
  }

  // 6. Production Vercel Frontend Site (https://my-kouch-website.vercel.app)
  console.log('\n--- 4. Testing Production Vercel Frontend Site (https://my-kouch-website.vercel.app) ---');
  try {
    const res = await fetch('https://my-kouch-website.vercel.app/');
    const passed = res.ok && res.status === 200;
    report.push({ service: 'Vercel Production Frontend', url: 'https://my-kouch-website.vercel.app/', status: res.status, passed });
    console.log(`[Vercel Frontend] Status: ${res.status} | Passed: ${passed}`);
  } catch (err) {
    report.push({ service: 'Vercel Production Frontend', passed: false, error: err.message });
    console.error(`[Vercel Frontend Error]: ${err.message}`);
  }

  // 7. Production Render Backend API (https://mykouch-backend.onrender.com)
  console.log('\n--- 5. Testing Production Render Backend API (https://mykouch-backend.onrender.com) ---');
  try {
    const start = Date.now();
    const res = await fetch('https://mykouch-backend.onrender.com/api/health', { signal: AbortSignal.timeout(15000) });
    const latency = Date.now() - start;
    const data = await res.json();
    const passed = res.ok && data.status === 'OK';
    report.push({ service: 'Render Backend Health', url: 'https://mykouch-backend.onrender.com/api/health', status: res.status, latencyMs: latency, passed, data });
    console.log(`[Render Backend Health] Status: ${res.status} | Latency: ${latency}ms | DB: ${data.database}`);
  } catch (err) {
    report.push({ service: 'Render Backend Health', passed: false, error: err.message });
    console.warn(`[Render Backend Health (Note: Free tier can take up to 50s to wake up)]: ${err.message}`);
  }

  console.log('\n===============================================================');
  console.log('                 CONNECTION AUDIT SUMMARY');
  console.log('===============================================================');
  report.forEach((r) => {
    const symbol = r.passed ? '✅' : '⚠️';
    console.log(`${symbol} ${r.service}: ${r.passed ? 'CONNECTED & HEALTHY' : 'FAILED (' + (r.error || r.status) + ')'}`);
  });
}

checkConnections().catch(console.error);
