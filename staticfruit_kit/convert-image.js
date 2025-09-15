const fs = require('fs');
const path = require('path');

// Convert image to base64
const imagePath = path.join(__dirname, '../staticfruit_next_starter/public/static-fruit-logo.png');
const imageBuffer = fs.readFileSync(imagePath);
const base64Image = imageBuffer.toString('base64');

console.log('data:image/png;base64,' + base64Image);