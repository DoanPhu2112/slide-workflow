# SSL/DNS slide editor

## Start

```bash
npm run ssl-dns-editor
```

Open:

```text
http://127.0.0.1:4312
```

## Edit flow

1. Click `Edit` on the top-right panel.
2. Click directly on slide text to edit it.
3. Use `Select image` to place an image into the current slide.
4. Use `Image width` to resize the media frame.
5. Use `Table width` on slides that contain tables.
6. Click `Save` to persist everything.

## Which files matter

- `index.html`
  - Slide structure and editor UI.
  - Change this only when you want new slide layout or new editor capability.

- `deck.css`
  - Visual styling for the deck and editor.
  - Change this when you want a different look.

- `editor-config.json`
  - Main content/state file.
  - Stores edited text, image HTML, media widths, and table widths.
  - This is the file that changes when you click `Save`.

- `assets/`
  - Stores uploaded images from the editor.
  - When you add or replace an image, the file is copied here.

- `editor-server.mjs`
  - Local save API used by the browser editor.
  - Needed if you want `Save` to write back into the repo.

## Recommended usage

- Treat `index.html` and `deck.css` as the template.
- Treat `editor-config.json` as the editable content source.
- Treat `assets/` as the image library for this deck.

In normal use, you should mostly change:

- `editor-config.json`
- files inside `assets/`

## Version control

When you finish a content edit, commit:

- `slides/ssl-dns-foundations/editor-config.json`
- any new files inside `slides/ssl-dns-foundations/assets/`

Only commit `index.html` or `deck.css` when you intentionally changed the slide system itself.
