const { spawn } = require('child_process'); spawn('node', ['index.js', '1'], { stdio: 'inherit', env: { ...process.env, PORT: 3000, BOT_INDEX: '1' } });
