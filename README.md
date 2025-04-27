# Codelove Blog Updater

This GitHub Action automatically fetches your latest blog posts from Codelove and updates your README.md file.

## Usage

1. Create a new file `.github/workflows/codelove-updater.yml` in your repository:

```yaml
name: Test Codelove Blog Updater

# You can modify the workflow to run on different events
on:
  workflow_run:
    workflows: ['Build Action']
    types:
      - completed
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  test-action:
    runs-on: ubuntu-latest
    steps:
      # - uses: actions/checkout@v3
      - name: Test Codelove Blog Updater
        uses: jaosn60810/readme-codelove-list@main
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          CODELOVE_USERNAME: 'jason60810'
          MAX_LINES: '10'
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

<!-- The content between these markers will be automatically updated -->
<!-- UPDATE_CODELOVE:START -->

- [Conditional Rendering 常見錯誤](http://codelove.tw/@jason60810/post/vx8M53)
- [useContext 常犯錯誤與如何在 TS 使用](http://codelove.tw/@jason60810/post/n3V0kq)
<!-- UPDATE_CODELOVE:END -->
```

## Inputs

| Input                 | Description                           | Required | Default                        |
| --------------------- | ------------------------------------- | -------- | ------------------------------ |
| `GITHUB_TOKEN`        | GitHub token for authentication       | Yes      | -                              |
| `CODELOVE_USERNAME`   | Your Codelove username                | Yes      | -                              |
| `MAX_LINES`           | Maximum number of blog posts to fetch | No       | 10                             |
| `CODELOVE_API_URL`    | Codelove API URL                      | No       | https://codelove.tw/api/posts  |
| `README_START_MARKER` | Start marker for blog posts section   | No       | <!-- UPDATE_CODELOVE:START --> |
| `README_END_MARKER`   | End marker for blog posts section     | No       | <!-- UPDATE_CODELOVE:END -->   |

## License

MIT
