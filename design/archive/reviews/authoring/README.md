# Original document authoring source

The original Python sources used to produce the review PDFs, walkthrough cards,
card manifest and document-preview images are retained here without modification.

| Source | Output |
| --- | --- |
| [Review builder](create_heart_tree_review.py) | [Design review](../DESIGN-REVIEW.pdf) and its preview images |
| [Opening review builder](create_heart_tree_opening_review.py) | [Opening review](../OPENING-REVIEW.pdf) and its preview images |
| [Walkthrough builder](create_heart_tree_walkthrough.py) | [Walkthrough cards](../../../heart-tree/walkthrough-cards.pdf), [overview](../../../heart-tree/walkthrough-preview.pdf), reference images and [card manifest](../../../heart-tree/walkthrough-manifest.json) |

These source snapshots keep their original workspace input/output paths and
font paths. To rebuild elsewhere, adjust those constants to the local design
folder and font locations first. They use ReportLab and PyMuPDF; the walkthrough
also attempts a FontTools conversion of the app's bundled Andika fonts and has
a standard-PDF-font fallback. Generate the walkthrough before the full review,
which includes its overview image.

The committed PDFs and images can be viewed directly without running the scripts.
Their text describes the design stage at which each document was created.

[Design pack](../../../heart-tree/README.md) · [Design archive](../../../README.md)
