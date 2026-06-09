Extract slide-worthy concepts from the source material.

Rules:

- Focus on ideas that deserve visual communication.
- Remove filler, repetition, and prose that does not help a slide.
- Preserve factual accuracy.
- Keep claims, entities, relationships, and quantitative facts separate.
- Return JSON only.

Required output shape:

```json
{
  "source_title": "",
  "audience": "",
  "core_claims": [],
  "concepts": [],
  "entities": [],
  "quantitative_facts": [],
  "relationships": [],
  "open_questions": []
}
```

Field guidance:

- `core_claims`: the main assertions worth presenting
- `concepts`: reusable slide concepts or topics
- `entities`: actors, systems, products, teams, documents, or components
- `quantitative_facts`: numbers, percentages, dates, benchmarks, or measured results
- `relationships`: structured statements such as "A depends on B" or "X sends Y to Z"
- `open_questions`: ambiguities that should be resolved before rendering
