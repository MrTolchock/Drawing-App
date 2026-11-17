# An explorable woodland — 6.6

The forest is a place to walk through freely. Sandy paths remain useful landmarks, but they no longer constrain movement. The fox and five neighbours use the same articulated 3D animals as the story films. Trees have trunks, branches and solid crowns. Gently sloping hills, riverbanks, mossy rocks, flowers, hollow timber and a distant tree line give the world depth. The Heart Tree's trunk, branches and crowns move with the breeze, along with neighbouring trees, reeds and instanced grass. Water flows, butterflies flutter and fish move between lily pads.

## Controls and orientation

- Hold or drag the pictured touch stick. Its four direction buttons also support held Space/Enter. Pointer cancellation, loss of focus and leaving the forest release movement.
- Arrow keys or WASD walk in the direction shown on screen, including after turning the camera. E or Enter on the focused world greets a nearby neighbour or observes a nearby discovery.
- Tap terrain to walk there. The ray meets the actual sloping surface. Routes avoid water, trunks and rocks; large frame steps cannot tunnel through them. Walking into an obstacle slides along its edge.
- Tap a friend, the current story invitation or the pictured direction control to walk to a neighbour. Pawprints and a raised arrow follow safe turns rather than directing the fox straight across water.
- The two circular look controls rotate the perspective camera. Portrait play stays close to the fox. Foreground crowns fade when they hide the fox.
- Open the map to choose an available friend, the Heart Tree or an exploration place. The fox's position and found places appear on the map. Escape, the close button and focus trapping support keyboard use. Rendering pauses while the map covers the world.

## Places to discover

The Weitblickhügel and Wolkenhügel provide elevated woodland destinations. The Schmetterlingswiese has flowers and butterflies that gather near a quiet fox. The Leuchtpilzstamm has an open, hollow log and glowing mushrooms. The Bachquelle spills over rocky shelves. Fish swim in the Stiller Teich. Observing a place gives a short pictured caption, spoken fox dialogue and a reaction in the world; the fox can continue moving while the observation is open.

These are optional discoveries. They do not award learning stars, complete repairs or grow the Heart Tree. Their journal lives in `farbtupf.exploration.v1`. The story retains exactly nine authored tree contributions, all original puzzle sessions, the reunion and ending. Later residents and crossings retain their existing story gates. The broken bridge still requires the old ford detour until repaired; the later story bridge provides another genuine water crossing.

The existing forest save key and version remain compatible. Free coordinates are stored exactly rather than snapped back onto a path during save or reload. On entering the rendered world, an unsafe old coordinate is relocated only as far as needed to reach nearby safe terrain. Discoveries and the added scenery are included in the 6.6 service-worker cache.

## Rendering and motion

Exploration uses a perspective camera; the authored story films retain their framed orthographic shots. Solid animals replace world billboards while original painted illustrations remain in navigation and puzzles. Shared geometry and instancing batch tree crowns, distant woodland, grass and flower beds. World rendering is capped at 30 fps. Reduced motion stops decorative wind, cloud drift, butterfly flutter and fish jumps while allowing deliberate walking and camera controls. Story time advances in capped steps so a slow device still shows a travelling heartlight rather than jumping directly to its endpoint.

## Verification

`tests/world-navigation.test.cjs` checks free movement away from the old graph, continuous collision checks, bank-safe water taps, both bridge gates, safe routes to all discoveries and neighbours, genuine elevation, exact off-path save recovery and offline assets. Existing model, story, cinema and learning tests continue to protect the nine repairs, all 72 supported chapter orders and earlier saves.

`tests/world-browser.cjs` exercises held keys and actual touch start/cancel input, the picture map, all six discoveries through the real obstacle-filled scene, visible 3D wind and reduced motion, camera rotation, four touch viewport sizes, offline free-position recovery and navigation back to Beaver. Cinema and full-story browser suites cover the existing films, puzzles, companions, all repairs and saved ending. The painted-art regression suite now checks solid world geometry and real oak picking while retaining its puzzle-art and save assertions.

These are Chromium tests with touch emulation and software rendering, not physical iPhone/Safari measurements. Speech still depends on installed device voices.
