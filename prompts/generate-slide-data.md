Convert the approved content into structured slide data.

Rules:

- Follow `schemas/slide.schema.json`.
- Return JSON only.
- No layout instructions.
- No CSS.
- No HTML.
- Keep the slide focused on one takeaway.
- Use concise presentation language, not document prose.
- The `visual` payload must match the selected `primitive`.

Required output shape:

```json
{
  "id": "",
  "title": "",
  "subtitle": "",
  "takeaway": "",
  "visual_type": "",
  "primitive": "",
  "content": {
    "summary": "",
    "key_points": [],
    "evidence": []
  },
  "visual": {},
  "source": {
    "document_title": "",
    "section": "",
    "page_refs": []
  },
  "speaker_notes": [],
  "review": {
    "human_version": "",
    "ai_version": "",
    "merge_notes": "",
    "approved": true
  }
}
```

Primitive-specific requirements:

- `timeline` -> `visual.steps`
- `sequence` -> `visual.actors` and `visual.messages`
- `architecture` -> `visual.layers`
- `comparison` -> `visual.columns` and `visual.rows`
- `actor-map` -> `visual.center` and `visual.actors`
- `network` -> `visual.nodes` and `visual.edges`
- `lifecycle` -> `visual.steps` and optional `visual.center`
- `line-chart` -> `visual.x` and `visual.series`
- `kpi` -> `visual.metrics`

Additional sequence rule:

- For `sequence`, every item in `visual.messages` must describe a real interaction from one named actor to another named actor.
- Do not imply floating connectors or label-only arrows.
- The renderer should be able to anchor each arrow endpoint directly to the `from` and `to` components.
