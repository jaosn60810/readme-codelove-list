import core from '@actions/core';
import { Toolkit } from 'actions-toolkit';
import fs from 'fs';

// Get inputs from action.yml
const {
  GITHUB_TOKEN,
  MAX_LINES,
  CODELOVE_USERNAME,
  CODELOVE_API_URL,
  README_START_MARKER,
  README_END_MARKER,
} = {
  GITHUB_TOKEN: core.getInput('GITHUB_TOKEN'),
  MAX_LINES: core.getInput('MAX_LINES'),
  CODELOVE_USERNAME: core.getInput('CODELOVE_USERNAME'),
  CODELOVE_API_URL: core.getInput('CODELOVE_API_URL'),
  README_START_MARKER: core.getInput('README_START_MARKER'),
  README_END_MARKER: core.getInput('README_END_MARKER'),
};

core.setSecret(GITHUB_TOKEN);

const getBlogOutline = async () => {
  try {
    const response = await fetch(
      `${CODELOVE_API_URL}?username=${CODELOVE_USERNAME}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data
      .slice(0, MAX_LINES)
      .map(({ title, canonical_url: link }) => ({ title, link }));
  } catch (error) {
    core.setFailed(`Error fetching blog posts: ${error.message}`);
    return [];
  }
};

Toolkit.run(async (tools) => {
  try {
    tools.log.debug('Edit README.md Start...');

    const readmeContent = fs.readFileSync('./README.md', 'utf-8').split('\n');
    const startIndex = readmeContent.findIndex(
      (content) => content.trim() === README_START_MARKER
    );

    if (startIndex === -1) {
      return tools.exit.failure('Not Found Start Update Comments');
    }

    const endIndex = readmeContent.findIndex(
      (content) => content.trim() === README_END_MARKER
    );

    const outline = await getBlogOutline();

    if (!outline.length) {
      return tools.exit.failure('No blog posts fetched');
    }

    if (startIndex !== -1 && endIndex === -1) {
      const newContent = outline
        .map(({ title, link }) => `- [${title}](${link})`)
        .join('\n');

      readmeContent.splice(
        startIndex + 1,
        0,
        ...newContent.split('\n'),
        README_END_MARKER
      );

      fs.writeFileSync('./README.md', readmeContent.join('\n'));
      tools.log.success('Successfully updated README.md');
      return tools.exit.success('Success');
    }

    const oldContent = readmeContent
      .slice(startIndex + 1, endIndex)
      .join('\n')
      .replace(/(?:\\[rn]|[\r\n]+)+/g, '');

    const newContent = outline
      .map(({ title, link }) => `- [${title}](${link})`)
      .join('\n')
      .replace(/(?:\\[rn]|[\r\n]+)+/g, '');

    if (oldContent === newContent) {
      return tools.exit.success('Content is unchanged');
    }

    const blogPosts = outline
      .map(({ title, link }) => `- [${title}](${link})`)
      .join('\n');

    readmeContent.splice(
      startIndex + 1,
      endIndex - startIndex - 1,
      ...blogPosts.split('\n')
    );

    fs.writeFileSync('./README.md', readmeContent.join('\n'));
    tools.log.success('Updated README with the recent blog posts');
    return tools.exit.success('Success');
  } catch (error) {
    tools.log.error(`Error updating README: ${error.message}`);
    return tools.exit.failure(`Error updating README: ${error.message}`);
  }
});
