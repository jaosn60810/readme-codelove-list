import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read test.yml content
const testYml = fs.readFileSync(
  path.join(__dirname, '../.github/workflows/test.yml'),
  'utf-8'
);

// Read README.md
const readmePath = path.join(__dirname, '../README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf-8');

// Find the test workflow section
const startMarker = '```yaml';
const endMarker = '```\n\n3. Add the following markers';

// Replace the content between markers
const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);
const newContent = `${startMarker}\n${testYml}${endMarker}`;

readmeContent = readmeContent.replace(regex, newContent);

// Write back to README.md
fs.writeFileSync(readmePath, readmeContent);

console.log('Successfully updated README.md with test.yml content');
