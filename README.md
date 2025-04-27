# Codelove Blog Updater

This GitHub Action automatically fetches your latest blog posts from Codelove and updates your README.md file.

## Usage

1. Create a new file `.github/workflows/codelove-updater.yml` in your repository:

```yaml
name: Update Codelove Blog Posts

on:
  schedule:
    - cron: '0 0 * * *' # Runs daily at midnight
  workflow_dispatch: # Allows manual triggering

jobs:
  update-readme:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: your-username/codelove-blog-updater@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          CODELOVE_USERNAME: 'your-codelove-username'
          MAX_LINES: '5' # Optional: Number of posts to show (default: 5)
          CODELOVE_API_URL: 'https://codelove.tw/api/posts' # Optional: Custom API URL
          README_START_MARKER: '<!-- UPDATE_CODELOVE:START -->' # Optional: Custom start marker
          README_END_MARKER: '<!-- UPDATE_CODELOVE:END -->' # Optional: Custom end marker
```

2. Add the following markers to your README.md:

```markdown
## Latest Blog Posts

<!-- UPDATE_CODELOVE:START -->
<!-- UPDATE_CODELOVE:END -->
```

## Inputs

| Input                 | Description                           | Required | Default                                      |
| --------------------- | ------------------------------------- | -------- | -------------------------------------------- |
| `GITHUB_TOKEN`        | GitHub token for authentication       | Yes      | -                                            |
| `CODELOVE_USERNAME`   | Your Codelove username                | Yes      | -                                            |
| `MAX_LINES`           | Maximum number of blog posts to fetch | No       | 5                                            |
| `CODELOVE_API_URL`    | Codelove API URL                      | No       | https://codelove.tw/api/posts                |
| `README_START_MARKER` | Start marker for blog posts section   | No       | <!-- UPDATE_CODELOVE:START -->               |
| `README_END_MARKER`   | End marker for blog posts section     | No       | <!-- UPDATE_CODELOVE:END -->                 |
| `COMMITTER_USERNAME`  | Username for the commit               | No       | github-actions[bot]                          |
| `COMMITTER_EMAIL`     | Email for the commit                  | No       | github-actions[bot]@users.noreply.github.com |
| `COMMIT_MSG`          | Commit message                        | No       | docs: update README with latest blog posts   |

## License

MIT
