import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyApiFiles() {
  try {
    const srcDir = path.join(__dirname, '../api');
    const destDir = path.join(__dirname, '../dist/public/api');
    
    // Ensure destination directory exists
    await fs.ensureDir(destDir);
    
    // Copy files
    await fs.copy(srcDir, destDir, {
      overwrite: true,
      preserveTimestamps: true,
    });
    
    console.log('API files copied successfully!');
  } catch (error) {
    console.error('Error copying API files:', error);
    process.exit(1);
  }
}

// Run the function
copyApiFiles();
