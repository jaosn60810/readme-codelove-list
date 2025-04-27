# Codelove Blog Updater Action

This GitHub Action automatically fetches your latest blog posts from [Codelove](https://codelove.tw) and updates your repository's README.md file.

## How It Works

1. The action fetches blog posts from the Codelove API
2. It then updates a section in your README.md between specified comment tags
3. The tags are `<!-- UPDATE_CODELOVE:START -->` and `<!-- UPDATE_CODELOVE:END -->`

## Usage

### Step 1: Add the Comment Tags to Your README

Add the following comment tags to your README.md file where you want your blog posts to appear:

```markdown
## Latest Blog Posts

<!-- UPDATE_CODELOVE:START -->
<!-- UPDATE_CODELOVE:END -->
```

### Step 2: Create a Workflow

Create a new file in your repository at `.github/workflows/update-readme.yml`:

```yaml
name: Update Codelove Blog Posts

on:
  schedule:
    - cron: '0 0 * * *' # Runs daily at midnight
  workflow_dispatch: # Allows manual triggering

jobs:
  update-readme:
    runs-on: ubuntu-latest
    name: Update README with latest blog posts

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Update README with latest Codelove blog posts
        uses: yourusername/codelove-blog-updater-action@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          MAX_LINES: 5 # Fetch 5 latest posts

      - name: Commit and push if README changed
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git diff --quiet && git diff --staged --quiet || (git add README.md && git commit -m "docs: update README with latest blog posts" && git push)
```

## Inputs

| Input                | Description                           | Required | Default                                      |
| -------------------- | ------------------------------------- | -------- | -------------------------------------------- |
| `GITHUB_TOKEN`       | GitHub token for authentication       | Yes      | N/A                                          |
| `MAX_LINES`          | Maximum number of blog posts to fetch | No       | 5                                            |
| `COMMITTER_USERNAME` | Username for the commit               | No       | github-actions[bot]                          |
| `COMMITTER_EMAIL`    | Email for the commit                  | No       | github-actions[bot]@users.noreply.github.com |
| `COMMIT_MSG`         | Commit message                        | No       | docs: update README with latest blog posts   |

## Example

### Before:

```markdown
## Latest Blog Posts

<!-- UPDATE_CODELOVE:START -->
<!-- UPDATE_CODELOVE:END -->
```

### After:

```markdown
## Latest Blog Posts

<!-- UPDATE_CODELOVE:START -->

- [Title of Post 1](https://codelove.tw/post-1-link)
- [Title of Post 2](https://codelove.tw/post-2-link)
- [Title of Post 3](https://codelove.tw/post-3-link)
<!-- UPDATE_CODELOVE:END -->
```

## License

MIT
