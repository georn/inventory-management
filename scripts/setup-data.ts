import * as fs from 'fs/promises';
import * as path from 'path';

async function setupData() {
  const dataDir = path.join(process.cwd(), 'data');
  const boxesFile = path.join(dataDir, 'boxes.json');

  try {
    // Create data directory if it doesn't exist
    await fs.mkdir(dataDir, { recursive: true });

    // Create boxes.json with an empty array if it doesn't exist
    try {
      await fs.access(boxesFile);
    } catch {
      await fs.writeFile(boxesFile, '[]');
    }

    console.log('Data setup completed successfully.');
  } catch (error) {
    console.error('Error setting up data:', error);
  }
}

setupData();