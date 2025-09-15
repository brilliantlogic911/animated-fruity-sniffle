import { spawn } from 'child_process';

// Spawn the create-onchain process
const child = spawn('npx', ['create-onchain', '--mini'], {
  stdio: ['pipe', 'inherit', 'inherit']
});

// Send the project name when prompted
child.stdin.write('staticfruit-mini-app\n');

// Send the package name when prompted (usually the same as project name)
child.stdin.write('staticfruit-mini-app\n');

// Handle process exit
child.on('close', (code) => {
  console.log(`create-onchain process exited with code ${code}`);
  
  if (code === 0) {
    console.log('Mini app created successfully!');
    console.log('You can now navigate to the staticfruit-mini-app directory and start the development server.');
  } else {
    console.log('There was an error creating the mini app.');
  }
});

// Handle errors
child.on('error', (error) => {
  console.error('Failed to start create-onchain process:', error);
});