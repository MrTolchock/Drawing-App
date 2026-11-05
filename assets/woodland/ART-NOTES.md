# Painted woodland artwork

Original generated production artwork, developed from the selected **original A,
Painted woodland** reference. Warm ivory light, olive and yellow-sage foliage,
honey timber, blue water and an orange fox with a green neckerchief connect the
world, picture-led guidance, puzzle pieces, book and return scenes.

- `characters-nature.png`: 4 × 4 atlas. Four fox directions; Beaver, Brown Hare,
  Hedgehog and Tawny Owl; Kingfisher, oak, a spare tree and hazel; leaf, hazelnut,
  feather and a spare strawberry plant.
- `forest-props.png`: 4 × 2 atlas. Reeds, mossy stones, grass/fern and brown
  mushrooms; wild strawberry, beech, alder and a fallen log.
- `places.png`: 3 × 2 painted scenes. Heart Tree, brook bridge, garden, moss
  resting place, owl hollow and reed pond. Wide views crop a square painting
  without stretching it.
- `ground.png`: original painted grass/earth surface, repeated on the ground.

`js/ui/woodland.js` is the shared atlas manifest. The Three.js renderer samples
those same cells, rather than maintaining another character or object set.
Image files remain unmodified generation outputs. Rendering rejects faint alpha
matte pixels; alpha-aware raycasting ignores transparent tree corners and all
decorative shadows. No remote artwork requests are made at runtime.

The fox is quadrupedal with a cream muzzle/chest and white tail tip. The hare
has long dark-tipped ears; the tawny owl has a round head and no ear tufts; the
kingfisher has a blue back, orange breast and long bill. The plants and residents
depict the established Swiss woodland cast. These are stylised illustrations.
