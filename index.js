const core = require('@actions/core');
const { Toolkit } = require('actions-toolkit');
const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

// Get inputs from action.yml
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
const MAX_LINES = core.getInput('MAX_LINES');
const CODELOVE_USERNAME = core.getInput('CODELOVE_USERNAME');
const CODELOVE_API_URL = core.getInput('CODELOVE_API_URL');
const README_START_MARKER = core.getInput('README_START_MARKER');
const README_END_MARKER = core.getInput('README_END_MARKER');

core.setSecret(GITHUB_TOKEN);

// Fetch blog posts from Codelove
async function getBlogOutline() {
  try {
    const { data } = await axios.get(
      `${CODELOVE_API_URL}?username=${CODELOVE_USERNAME}`
    );

    const outlineFilter = data.slice(0, MAX_LINES).map((blog) => ({
      title: blog.title,
      link: blog.canonical_url,
    }));

    return outlineFilter;
  } catch (error) {
    core.setFailed(`Error fetching blog posts: ${error.message}`);
    return [];
  }
}

Toolkit.run(async (tools) => {
  try {
    tools.log.debug('Edit README.md Start...');

    // Read the README.md file
    const readmeContent = fs.readFileSync('./README.md', 'utf-8').split('\n');

    // Find the START tag
    let startIndex = readmeContent.findIndex(
      (content) => content.trim() === README_START_MARKER
    );

    // START tag doesn't exist
    if (startIndex === -1) {
      return tools.exit.failure('Not Found Start Update Comments');
    }

    // Find the END tag
    let endIndex = readmeContent.findIndex(
      (content) => content.trim() === README_END_MARKER
    );

    // Fetch blog posts
    const outline = await getBlogOutline();

    if (outline.length === 0) {
      return tools.exit.failure('No blog posts fetched');
    }

    // Only has START tag, no END tag
    if (startIndex !== -1 && endIndex === -1) {
      startIndex++; // Move to next line

      // Add blog posts
      outline.forEach((o, index) => {
        readmeContent.splice(
          startIndex + index,
          0,
          `- [${o.title}](${o.link})`
        );
      });

      // Add END tag
      readmeContent.splice(startIndex + outline.length, 0, README_END_MARKER);

      // Write to README.md
      fs.writeFileSync('./README.md', readmeContent.join('\n'));

      tools.log.success('Successfully updated README.md');
      return tools.exit.success('Success');
    }

    // Has both START and END tags
    const oldContent = readmeContent.slice(startIndex + 1, endIndex).join('\n');
    const newContent = outline
      .map((o) => `- [${o.title}](${o.link})`)
      .join('\n');

    // Compare old and new content (remove line breaks for comparison)
    const compareOldContent = oldContent.replace(/(?:\\[rn]|[\r\n]+)+/g, '');
    const compareNewContent = newContent.replace(/(?:\\[rn]|[\r\n]+)+/g, '');

    // Content is the same, exit
    if (compareOldContent === compareNewContent) {
      return tools.exit.success('Content is unchanged');
    }

    startIndex++; // Move to next line

    // Remove content between START and END tags
    let gap = endIndex - startIndex;
    readmeContent.splice(startIndex, gap);

    // Add new blog posts
    outline.forEach((o, index) => {
      readmeContent.splice(startIndex + index, 0, `- [${o.title}](${o.link})`);
    });

    // Write to README.md
    fs.writeFileSync('./README.md', readmeContent.join('\n'));

    tools.log.success('Updated README with the recent blog posts');
    return tools.exit.success('Success');
  } catch (error) {
    tools.log.error(`Error updating README: ${error.message}`);
    return tools.exit.failure(`Error updating README: ${error.message}`);
  }
});
