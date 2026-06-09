# Rules

Use font: GT Planar
Fallback font: DM Sans

Slide output rules:
- Output slides inside `slides/`
- Always create slides as `HTML/CSS` first
- Only convert/export to `PPTX` after the `HTML/CSS` version already exists
- Root `slides/index.html` is a hub, not a project deck
- Always update `slides/index.html` when a new slide project is added
- Each project deck must live in `slides/<project-slug>/index.html`
- Each project CSS must live beside it in `slides/<project-slug>/`
- Do not generate `PPTX` first or as the only output

Style rules:
- Use curved corners for all components and boundaries
- All slides must support responsive mobile view
- For flow and sequence slides, every arrow must anchor to a real source component and a real target component
- Never draw floating arrow endpoints that do not terminate on the interacted components
