async function check() {
  try {
    const res = await fetch('https://mykouch.com/');
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Length:', text.length);
    const scripts = text.match(/src="[^"]+"/g);
    console.log('Scripts:', scripts);
    const css = text.match(/href="[^"]+\.css"/g);
    console.log('CSS:', css);

    // Test asset fetches
    const paths = ['/temp/index.html', '/build/index.html', '/mykouch_frontend_build/index.html'];
    for (const p of paths) {
      const res = await fetch('https://mykouch.com' + p);
      console.log('Path', p, '->', res.status);
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

check();
