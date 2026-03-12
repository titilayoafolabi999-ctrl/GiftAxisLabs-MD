const { spawn } = require('child_process'); spawn('node', ['index.js', '2'], { stdio: 'inherit', env: { ...process.env, PORT: 3001, BOT_INDEX: '2' } });
