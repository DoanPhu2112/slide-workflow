# Slide Design Rules

## Philosophy

Slides communicate ideas visually.

Text is secondary.

Canonical deliverable is the web deck in `slides/<project-slug>/`.

Build `HTML/CSS` first.

Only export `PPTX` after the web deck exists.

Do not put a project deck directly at `slides/index.html`.

Every slide must contain:

- One core message
- One visual primitive
- Minimal text

---

## Text Rules

Title:

- max 8 words

Bullet:

- max 5 bullets

Bullet:

- max 8 words each

Avoid paragraphs.

---

## Layout Rules

20% title

60% visualization

20% notes

---

## Visual Rules

Prefer:

- Timeline
- Sequence
- Architecture
- Comparison

Sequence connector rules:

- Every message arrow must start on the source actor or component boundary
- Every message arrow must end on the target actor or component boundary
- No floating arrowheads
- No arrows that stop at labels instead of components
- If a component moves, its connected arrow endpoints must move with it

Avoid:

- Large text blocks
- Tables > 5 rows

---

## Theme Rules

Background:

- White

Primary:

- #2563EB

Font:

- GT Planar
- DM Sans

Title:

- 36px

Body:

- 20px
