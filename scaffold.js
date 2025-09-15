import { spawn } from 'child_process';

const child = spawn('npx', ['create-onchain', '--mini'], { stdio: ['pipe', 'inherit', 'inherit'], shell: true });

child.stdin.write('my-minikit-app\n');
child.stdin.write('lp3s5LREFSdF4XayyCAwA3BmfIiTkEkV\n'); // for the CDP key
child.stdin.end();