## Slide Schema

The canonical slide payload is a single JSON object.

It captures:

- the message of the slide
- the conceptual visual classification
- the renderer primitive
- primitive-specific visual data
- review metadata

### Core Fields

`id`

- optional slug for stable references

`title`

- short slide title
- should usually stay under 8 words

`subtitle`

- optional secondary framing

`takeaway`

- the single sentence the audience should remember

`visual_type`

- conceptual classification of the slide
- examples: `timeline`, `lifecycle`, `sequence`, `architecture`, `comparison`

`primitive`

- renderer-compatible primitive
- current supported values:
  - `timeline`
  - `architecture`
  - `sequence`
  - `comparison`
  - `actor-map`
  - `network`
  - `lifecycle`
  - `line-chart`
  - `kpi`

### Content Block

`content.summary`

- one short summary sentence

`content.key_points`

- 2 to 5 short bullets

`content.evidence`

- optional quantitative or factual support lines

### Visual Block

`visual` is primitive-specific.

#### `timeline`

Use `visual.steps`:

- `title`
- `subtitle`
- `description`
- `icon`

#### `sequence`

Use:

- `visual.actors`
- `visual.messages`

Each message contains:

- `from`
- `to`
- `label`
- `note`

Rendering rule:

- every message arrow must anchor to the actor or component named by `from`
- every message arrow must anchor to the actor or component named by `to`
- labels describe the interaction, but arrow endpoints must terminate on components, not labels

#### `architecture`

Use `visual.layers`.

Each layer contains:

- `label`
- `items`
- `note`

#### `comparison`

Use:

- `visual.columns`
- `visual.rows`

Each row contains:

- `label`
- `values`

#### `actor-map`

Use:

- `visual.center`
- `visual.actors`

#### `network`

Use:

- `visual.nodes`
- `visual.edges`

#### `lifecycle`

Use:

- `visual.steps`
- optional `visual.center`

#### `line-chart`

Use:

- `visual.x`
- `visual.series`

#### `kpi`

Use:

- `visual.metrics`

### Source Block

`source` stores provenance:

- `document_title`
- `section`
- `page_refs`

### Review Block

`review` stores merge history:

- `human_version`
- `ai_version`
- `merge_notes`
- `approved`

### Notes

`speaker_notes` is an optional array of presenter notes.

## Validation Principles

- No HTML.
- No CSS.
- No layout coordinates.
- No multi-primitive slides.
- Visual payload must match the selected `primitive`.
