// Read test.yml content
const testYml = await Bun.file('.github/workflows/test.yml').text();

// Read README.md
const readmePath = 'README.md';
let readmeContent = await Bun.file(readmePath).text();

// Find the test workflow section
const startMarker = '```yaml';
const endMarker = '```\n\n3. Add the following markers';

// Replace the content between markers
const regex = new RegExp(`${startMarker}[\s\S]*?${endMarker}`);
const newContent = `${startMarker}\n${testYml}${endMarker}`;

readmeContent = readmeContent.replace(regex, newContent);

// Write back to README.md
await Bun.write(readmePath, readmeContent);

console.log('Successfully updated README.md with test.yml content');
