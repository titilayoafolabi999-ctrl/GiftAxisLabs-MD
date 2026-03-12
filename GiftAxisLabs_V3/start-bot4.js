const { spawn } = require('child_process'); spawn('node', ['index.js', '4'], { stdio: 'inherit', env: { ...process.env, PORT: 3003, BOT_INDEX: '4' } });
