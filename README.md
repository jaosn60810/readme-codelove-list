# Codelove Blog Updater

This GitHub Action automatically fetches your latest blog posts from Codelove and updates your README.md file.

## Usage

1. Create a new file `.github/workflows/codelove-updater.yml` in your repository:

```yaml

name: Test Codelove Blog Updater

on:
  workflow_dispatch: # Allows manual triggering

permissions:
  contents: write

jobs:
  test-action:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Test Codelove Blog Updater
        uses: ./
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          CODELOVE_USERNAME: 'jasonmoney'
          MAX_LINES: '3'
          README_START_MARKER: '<!-- UPDATE_CODELOVE:START -->'
          README_END_MARKER: '<!-- UPDATE_CODELOVE:END -->'

      - name: Commit changes
        uses: EndBug/add-and-commit@v9
        with:
          message: 'test: update README with latest blog posts'
          add: 'README.md'
```

3. Add the following markers to your README.md:

```markdown
## Latest Blog Posts

<!-- UPDATE_CODELOVE:START -->
<!-- UPDATE_CODELOVE:END -->
```

## Inputs

| Input                 | Description                           | Required | Default                        |
| --------------------- | ------------------------------------- | -------- | ------------------------------ |
| `GITHUB_TOKEN`        | GitHub token for authentication       | Yes      | -                              |
| `CODELOVE_USERNAME`   | Your Codelove username                | Yes      | -                              |
| `MAX_LINES`           | Maximum number of blog posts to fetch | No       | 5                              |
| `CODELOVE_API_URL`    | Codelove API URL                      | No       | https://codelove.tw/api/posts  |
| `README_START_MARKER` | Start marker for blog posts section   | No       | <!-- UPDATE_CODELOVE:START --> |
| `README_END_MARKER`   | End marker for blog posts section     | No       | <!-- UPDATE_CODELOVE:END -->   |

## License

MIT
