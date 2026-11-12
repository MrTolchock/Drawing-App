> Retained Heart Tree experience: open `?screen=forest`. Forest friends is now the default runtime; see [implementation status](../../docs/FOREST-FRIENDS.md). These Heart Tree records and original saves remain intact.

# Farbtupf — Der Herzbaum

This is the current design baseline, reviewed against the implemented game. It describes shipped behaviour. [The design review](REVIEW.md) records what should be improved next; proposals there are not implemented features.

## The experience

**Explore a welcoming forest, help its neighbours find each other again, and watch the Heart Tree come back to life.**

The player is a small orange fox with a green neckerchief. The Heart Tree once sheltered the animals' shared meeting place. Its branches are bare, routes and gathering places need care, and friends miss one another. Practical acts of help restore connections. Each of nine completed projects wakes one bough; the final gathering brings everyone home.

The game is for children aged 6–7 in Zürich. Its interface uses Swiss Standard German. Assume a child can recognise pictures and manipulate objects before they can read instructions. Reading activities explicitly practise reading; finding friends and understanding ordinary play should rely on pictures, demonstration and repeatable speech.

The tone is warm, curious and expressive. Neighbours have feelings and reasons to want help. Their thanks should acknowledge a relationship and a visible change in the world.

## Play loop

1. Walk freely, follow a pictured invitation or choose a destination on the map.
2. Meet a neighbour and see a short acted request.
3. Choose to help, or keep exploring.
4. Learn the puzzle rule through a separate example, then solve a five-task story round.
5. Return to the same place, see the repair and hear what it means to the friends.
6. Follow the friendship's heartlight to a newly living bough.
7. Visit another friend, explore, choose a game from the book, or stop.

Mistakes are recoverable. There is no required timer, lost life or penalty for asking for help. Leaving a story puzzle preserves its exact question and interaction state.

## World and cast

The forest has a central meeting clearing and a loop through brook, garden, moss grove, story hollow and reed pond. Sandy paths indicate useful routes while clearings and hills allow free walking. Water, trunks, rocks and the forest edge bound movement. Repairs create usable crossings and visible improvements.

| Place | Neighbour | Character and relationship |
| --- | --- | --- |
| Brook | Biber, a Eurasian beaver | Practical and affectionate; misses his old friend Hase across the broken bridge |
| Meadow garden | Hase, a brown hare | Energetic and welcoming; wants to visit neighbours and invite everyone together |
| Moss grove | Igel, a European hedgehog | Gentle and observant; needs a comfortable resting place and company |
| Story hollow | Waldkauz, a tawny owl | Thoughtful storyteller; wants friends to find the way and share stories |
| Reed pond | Eisvogel, a common kingfisher | Curious and attentive; wants to share the water's view and connect its paths |

The visual identity combines warm ivory, woodland greens, honey timber, blue water and the orange fox. Exploration and films share articulated, upright 3D animals. Solid tree crowns, wind, sloping terrain, water, flowers and wildlife create depth. Original painted portraits and objects connect navigation and flat puzzles to the same cast. The environment draws on Swiss lowland woodland species; stylised scenery is not a botanical simulation.

## Storyline and progression

The opening shows the bare oak, empty meeting circle and missing friendships. The first episode makes Beaver's longing concrete: Hare is nearby, but the timber bridge is broken. A pictured plank links his request to a pattern puzzle. Completing it restores the crossing, sends the first heartlight home and leads to the reunion with Hare. Greeting Hare adds no extra bough.

| Chapter | Project | Owner and partner | Puzzle | Lasting result |
| --- | --- | --- | --- | --- |
| Meet | Die kleine Brücke | Biber + Hase | Pattern | Timber bridge becomes usable |
| Meet | Ein Platz zum Ausruhen | Igel | Memory | Leaf-and-moss resting place |
| Meet | Der alte Wegweiser | Waldkauz | Route | Heart-picture sign points home |
| Meet | Ein Blick aufs Wasser | Eisvogel | Memory | Viewing deck and cleared waterside place |
| Reconnect | Der Gartenweg | Hase + Igel | Pattern | Restored garden shortcut |
| Reconnect | Geschichten am Wasser | Waldkauz + Eisvogel | Route | Walkable waterside link and story bench |
| Reconnect | Unser alter Treffpunkt | Biber | Memory | Renewed meeting clearing |
| Gather | Ein Platz für alle | Igel + Biber | Pattern | Bench, moss seats and bird perch |
| Gather | Die Einladung | Eisvogel + Hase | Route | Pictured invitations at the Heart Tree |

After the bridge and reunion, the other Meet projects can be completed in any order. The three Reconnect projects and two Gather projects are also independent within their chapters. Chapter returns acknowledge completed projects and their payoffs before moving onward.

Exactly these nine projects grow the tree. Practice, discoveries, replay and greeting scenes do not add boughs or become chapter requirements. The finale gathers all five neighbours with Fox beneath the awakened oak. Its ending cursor survives interruption. Replaying the opening or finale leaves earned progress intact.

## Movement and orientation

- Hold or drag the touch stick; arrows/WASD also move the fox freely in screen-relative directions.
- Tap the actual ground to walk there, including slopes. Choosing a friend follows a safe route around obstacles and through available crossings.
- Pawprints and a raised arrow indicate the walking route. The pictured direction control leads to the tracked friend or discovery.
- The map shows the fox, available friends, Heart Tree and six discovery places. Selecting a destination starts walking. The header and tree direction control lead home.
- A close perspective camera follows exploration. Look controls rotate it. Foreground crowns fade when they hide the fox.
- Story films use authored camera shots and articulated performances. Children choose when to advance, repeat narration or skip to the action.
- Reduced motion stops decorative movement while keeping deliberate walking and controls available.

The old ford provides a safe detour before the bridge repair. Later residents and crossings retain story gates. Freedom to explore and story progression are separate systems.

## Optional exploration

Six destinations are implemented: Weitblickhügel, Schmetterlingswiese, Leuchtpilzstamm, Bachquelle, Stiller Teich and Wolkenhügel. They offer views, butterflies, glowing mushrooms, falling water, fish and clouds. Observing gives a short pictured caption, spoken fox response and a world reaction. Viewpoint cameras face the relevant scenery.

Found places are recorded on the map in a separate journal. These encounters award no learning stars and do not alter repairs. They are optional observations, not creative assignments or extra learning gates.

## Learning and the games book

**Waldspiele is the single activity library.** It offers pictured neighbour filters, all games, freely selectable stages and an optional saved three-stop Entdeckertour. The forest provides story purpose; the book provides direct practice and creative tools.

Story rounds use three established families: pattern completion, remembering a missing object and finding a route. Library activities broaden counting, arithmetic, spatial thinking, nature, language, reading and writing. The Malatelier menu offers colouring, saved pictures and the sticker album; the free editor remains accessible by its direct route, without a Waldspiele card. Menu pictures use the painted Waldatelier family, including matching berry, house, mirror and wand illustrations. Creative missions are absent. [Current activity inventory](../../docs/GAMEPLAY.md).

Picture cues and reversible manipulation teach ordinary rules. Demonstrations use separate examples and never reveal a live answer. Reading exercises retain their reading purpose. Device speech supports guidance; recorded voices are not currently included and offline speech is device-dependent.

Short game rounds share five-leaf progress, retry feedback, celebration and pictured return choices. Stars support the album and follow existing replay-safe reward rules. Tree growth expresses authored friendships; exploration marks record places found. These purposes must remain distinct and understandable.

## Persistence and access

Repairs, chapter acknowledgements, unfinished story puzzles, ending position, discovery journal, optional tour, pictures, settings and stars are local to the device and browser origin. Free world positions are saved without snapping back onto paths. Reload resumes meaningful progress; a new browser profile has its own opening.

The app is a static PWA with locally bundled Three.js and artwork, no account, tracking or runtime CDN. Offline play follows an initial successful download. Parent settings use the adult gate. The optional play-time clock is off by default and does not gate learning.

This documentation reset does not reset saves, rename persistent identifiers, remove games or migrate the deployed app to another host.

## Rules for the next step

1. Keep this document factual; put proposed changes and priorities in the review.
2. Give each story action a visible consequence and a relationship worth caring about.
3. Keep ordinary goals usable before reading, with repeatable guidance and editable mistakes.
4. Keep one games book and clear routes home. Avoid competing menus and excessive markers.
5. Preserve nine authored tree contributions and exact interrupted puzzle recovery unless a deliberate migration is designed.
6. Assess play, comprehension and performance on physical target devices and with children. Automated checks do not establish those outcomes.
7. Archive superseded design material when changing direction; update active documentation in the same change.

[Review and next priorities](REVIEW.md) · [Development and verification](../../docs/DEVELOPMENT.md)
