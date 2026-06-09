## Slide Workflow

This repository follows a content-first slide pipeline.

The goal is to separate:

- understanding the source material
- choosing the right visual form
- generating structured slide data
- rendering presentation output

### 1. Document / Paper

Input:

- PDF
- DOCX
- notes
- research paper
- transcript

Output:

- raw source material for analysis

### 2. Extract Concepts

Purpose:

- identify the ideas that are worth turning into slides
- strip away filler text
- keep evidence, numbers, actors, and relationships

Output artifact:

- `concepts.json`

Recommended fields:

- `source_title`
- `audience`
- `core_claims`
- `concepts`
- `entities`
- `quantitative_facts`
- `relationships`
- `open_questions`

Checkpoint:

- remove weak or redundant concepts before continuing

### 3. Classify Visual Type

Purpose:

- map each concept to the most appropriate visual form

There are two levels of classification:

- `visual_type`: the conceptual form of the slide
- `primitive`: the renderer-compatible primitive used to implement it

Current renderer primitives:

- `timeline`
- `architecture`
- `sequence`
- `comparison`
- `actor-map`
- `network`
- `lifecycle`
- `line-chart`
- `kpi`

Output artifact:

- `classification.json`

Checkpoint:

- confirm that the chosen `primitive` can be rendered by the current system

### 4. Create Human Version

Purpose:

- create a manually reasoned version of the slide
- establish a quality baseline

Output artifact:

- `slide-human.json`

This version should optimize for:

- accuracy
- narrative clarity
- sensible simplification

### 5. Create AI Version

Purpose:

- create an alternative version automatically
- generate faster variants and phrasing options

Output artifact:

- `slide-ai.json`

This version should optimize for:

- speed
- breadth of alternatives
- structural consistency

### 6. Review & Merge

Purpose:

- compare the human and AI versions
- keep the strongest parts of both

Output artifact:

- `slide-merged.json`

Checkpoint:

- human review is the final authority before schema validation

### 7. Structured Slide Data

Purpose:

- convert the merged content into the canonical schema

Output artifact:

- `slide-data.json`

Required characteristics:

- no CSS
- no HTML
- no layout coordinates
- exactly one renderer primitive
- concise content suitable for a presentation slide

### 8. Theme + Renderer

Purpose:

- apply theme tokens
- map structured data to visual templates

Inputs:

- `slide-data.json`
- theme files
- primitive registry

Output:

- rendered `HTML/CSS` slide markup inside `slides/<project-slug>/`
- optional slide objects only after the web version exists

### 9. PPTX / PDF

Purpose:

- export final presentation assets

Outputs:

- `.pptx`
- `.pdf`

Rule:

- do this only after the canonical `slides/` HTML/CSS deck already exists

### 10. Optional Canva Polish

Purpose:

- perform final manual visual polish when needed

Use this step only after the structured slide data and renderer output are already correct.

## Operating Rules

- Every slide must have one core message.
- Every slide must map to exactly one `visual_type`.
- Every slide must resolve to exactly one renderable `primitive`.
- Human review happens before rendering, not after export.
- Canonical output root is `slides/`.
- Each deck must have its own subfolder under `slides/`.
- Canonical first-pass format is `HTML/CSS`, not `PPTX`.
- Renderer input must stay structured and presentation-safe.

## Suggested File Flow

```text
source document
  -> concepts.json
  -> classification.json
  -> slide-human.json
  -> slide-ai.json
  -> slide-merged.json
  -> slide-data.json
  -> slides/<project-slug>/index.html
  -> slides/<project-slug>/*.css
  -> pptx / pdf
```
