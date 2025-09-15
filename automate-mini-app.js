import { spawn } from 'child_process';
import { exec } from 'child_process';

// Use exec instead of spawn for better compatibility with Windows
exec('npx create-onchain --mini', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
  }
  
  console.log(`Stdout: ${stdout}`);
});

// We can't easily automate the interactive prompts with exec
// Let's just run the command and let the user handle the prompts
console.log('Running create-onchain --mini...');
console.log('Please follow the prompts to create your mini app.');
console.log('Use "staticfruit-mini-app" as both the project name and package name when prompted.');