const { spawn } = require('child_process');

const next = spawn('npm', ['start'], { stdio: 'inherit' });

setTimeout(() => {
  const lt = spawn('npx', ['lt', '--port', '3000', '--subdomain', 'tiraj-enterprise'], { stdio: 'pipe' });
  lt.stdout.on('data', (data) => {
    console.log(`LOCALTUNNEL: ${data.toString()}`);
  });
  lt.stderr.on('data', (data) => {
    console.error(`LOCALTUNNEL ERROR: ${data.toString()}`);
  });
}, 3000);
