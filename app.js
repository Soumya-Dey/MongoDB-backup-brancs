const { spawn } = require('child_process');
const path = require('path');
const cron = require('node-cron');

/* 
Basic mongo dump and restore commands, they contain more options you can have a look at man page for both of them.
1. mongodump --db=brancs --archive=./brancs.gzip --gzip
2. mongorestore --db=brancs --archive=./brancs.gzip --gzip
*/

const DB_NAME = 'brancs';
const ARCHIVE_PATH = path.join(__dirname, 'backup', `${DB_NAME}.gzip`);

// 1. Cron expression for every 5 seconds - */5 * * * * *
// 2. Cron expression for every night at 00:00 hours (0 0 * * * )
// Scheduling the backup every day at 00:00
cron.schedule('0 0 * * *', () => createMongoDump(DB_NAME, ARCHIVE_PATH));

const createMongoDump = (db = 'brancs', archivePath) => {
  const child = spawn('mongodump', [
    `--db=${db}`,
    `--archive=${archivePath}`,
    '--gzip',
  ]);

  child.stdout.on('data', (data) => {
    console.log('stdout:\n', data);
  });
  child.stderr.on('data', (data) => {
    console.log('stderr:\n', Buffer.from(data).toString());
  });
  child.on('error', (error) => {
    console.log('error:\n', error);
  });
  child.on('exit', (code, signal) => {
    if (code) console.log('Process exit with code:', code);
    else if (signal) console.log('Process killed with signal:', signal);
    else console.log('Backup is successfull ✅');
  });
};
