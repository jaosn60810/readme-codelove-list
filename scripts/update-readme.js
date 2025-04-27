import { readFile, write } from 'bun';

// Read test.yml content
const testYml = await readFile('.github/workflows/test.yml', 'utf-8');

// Read README.md
const readmePath = 'README.md';
let readmeContent = await readFile(readmePath, 'utf-8');

// Find the test workflow section
const startMarker = '```yaml';
const endMarker = '```\n\n3. Add the following markers';

// Replace the content between markers
const regex = new RegExp(`${startMarker}[\s\S]*?${endMarker}`);
const newContent = `${startMarker}\n${testYml}${endMarker}`;

readmeContent = readmeContent.replace(regex, newContent);

// Write back to README.md
await write(readmePath, readmeContent);

console.log('Successfully updated README.md with test.yml content');
