# Typography and input

The authoritative [visual style](../design/VISUAL-STYLE.md#typography) defines fonts and sizes: Andika for controls, prose and all learning text; Baloo 2 for menu/section headings; authored paths for tracing. Implement the roles in `css/typography.css` and keep font files bundled for offline use.

Use complete 48 px button hit areas, accessible names, visible focus, native editable parent controls and one shared gesture delegate (`js/ui/gestures.js`). A touch invokes a button once; a scroll does not invoke it. Mouse, touch, pen and keyboard use the same action. Honour safe areas, responsive wrapping/scrolling and reduced motion. Exact handwriting pointer coordinates use the SVG screen transform.

See the [puzzle blueprint](../design/PUZZLE-BLUEPRINT.md) for page and progress anatomy and [consistency audit](../design/STYLE-AUDIT.md) for current evidence.
