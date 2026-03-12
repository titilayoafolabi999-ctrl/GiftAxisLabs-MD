const { spawn } = require('child_process'); spawn('node', ['index.js', '3'], { stdio: 'inherit', env: { ...process.env, PORT: 3002, BOT_INDEX: '3' } });
