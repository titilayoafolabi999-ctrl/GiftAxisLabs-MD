const { spawn } = require('child_process'); spawn('node', ['index.js', '5'], { stdio: 'inherit', env: { ...process.env, PORT: 3004, BOT_INDEX: '5' } });
