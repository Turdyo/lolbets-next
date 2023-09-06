const fs = require('fs');
const { join } = require('path');

// Define the filename and dirname lines to be added
const addedLines = [
  'const __filename = fileURLToPath(import.meta.url);',
  'const __dirname = dirname(__filename);',
];

// Specify the path to the server.js file
const filePath = join(__dirname, './dist/server.js');

// Read the existing content of server.js
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }

  // Split the content into lines
  const lines = data.split('\n');

  // Find the index where the imports end
  const importEndIndex = lines.findIndex((line) => !line.trim().startsWith('import '));

  if (importEndIndex !== -1) {
    // Insert the added lines just after the imports
    lines.splice(importEndIndex + 1, 0, ...addedLines);

    // Join the lines back into a single string
    const modifiedContent = lines.join('\n');

    // Write the modified content back to the file
    fs.writeFile(filePath, modifiedContent, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error(`Error writing file: ${writeErr}`);
      } else {
        console.log('File "server.js" has been updated successfully.');
      }
    });
  } else {
    console.error('Could not find the end of imports in "server.js".');
  }
});