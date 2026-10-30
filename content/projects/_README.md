# Projects Workflow

Software, games, translations, and anything else that is not an Unreal plugin.
Each file in this folder is one project page at `/projects/<file-name>/`, and one card on `/projects`.

## Add a new project
1. Copy an existing project file and rename it with a clear slug, for example `my-tool.md`.
2. Fill the front matter:

```yaml
---
title: My Tool
date: 2026-01-01            # used for sorting, newest first
type: Software              # Software / Translation / Game / ... (each type becomes a filter chip)
status: Active              # optional: Active / WIP / Released / Archived
summary: "One line shown on the card."
thumbnail: /resources/images/projects/MyTool/Cover.png
tech: [C++, Lua]            # optional
links:                      # optional, shown as buttons on the project page
  - label: GitHub
    url: https://github.com/mykaadev/MyTool
  - label: Read the write-up
    url: /articles/MyArticle/
---
```

3. Write a short pitch with a few screenshots below the front matter.

## Linking an article back to a project
Add `project: /projects/<file-name>/` to the article front matter. The article shows a card pointing to the project page.
