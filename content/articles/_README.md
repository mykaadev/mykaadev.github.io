# Articles Workflow

## Add a new article
1. Copy `content/articles/_articleTemplate.md` into a new file in this folder.
2. Name it with a clear slug, for example: `my-new-tooling-note.md`.
3. Fill `title`, `date`, `summary`, and write the content.
4. Run `bundle exec jekyll serve` and open `/articles/`.

## Optional helper command
Use:

```powershell
./scripts/new-article.ps1 "My New Article"
```

This creates a dated file in `/content/articles` from the template.
