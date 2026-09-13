# Abbey
## Founding game design

**Document revision:** 0.1  
**Date:** 13 September 2026  
**Status:** Design proposal for discussion; no game or visual prototype has been implemented.  
**Working title:** Abbey  
**Creative premise:** Grow a small woodland religious house into a flourishing community around a monumental church, while the people who build it live, work, worship, disagree, age, and leave their mark.

> The bell calls the brothers to Vespers. Beyond the chapel, rain darkens the unfinished stonework. The cellarer counts the grain. A mason studies the arch he hopes will outlive him. Somewhere in the cloister, an old disagreement has become a new friendship.

## 1. The game we want to make

Abbey is a single-player, pausable settlement and character simulation. Its defining experience is caring about both a building and the people whose lives make that building possible.

The player begins with a few monks, a modest timber or partly ruined chapel, a grant of land, limited supplies, and an uncertain relationship with nearby inhabitants. There is no empty wilderness waiting without history: even wooded land can carry customary rights, paths, grazing, and obligations.

Over time, the religious house develops gardens, food stores, workshops, hospitality, scholarship, and a growing settlement. Its church becomes the great shared undertaking. Timber gives way to stone; scaffolding occupies the skyline; individual chapels and bays open while other sections remain unfinished. Prosperity, generosity, ambition, compromise, and personal rivalries all leave architectural traces.

The emotional range is **bright, humane, and sometimes melancholy**. A beautiful garden, an unexpectedly excellent meal, and a reconciled friendship matter alongside fires, debt, illness, and bereavement. Difficulty should give the community a history without turning every season into catastrophe.

The main influences are:

| Inspiration | What Abbey takes from it |
| --- | --- |
| The Pillars of the Earth | Construction as a human story; craft, patronage, institutions, and a community changing around a church |
| Dwarf Fortress | Visible individual lives, material dependencies, remembered incidents, and stories emerging from interacting systems |
| Crusader Kings II and Paradox strategy games | Readable personalities, relationships, institutional conflict, and illustrated events with meaningful consequences |
| Settlement builders | Legible logistics, spatial planning, resource chains, and satisfying visible growth |
| Monastic history | A distinctive rhythm of worship, work, reading, hospitality, and communal obligation |

These are design influences. Abbey needs its own setting, characters, writing, interfaces, assets, and rules.

### What comes from the brief, and what is proposed

**Requested foundations:** woodland abbey to grand church and surrounding community; individually simulated monks with stats, skills, and traits; monastic daily life adapted for play; short days and compressed seasons; illustrated character events; bright, somewhat cartoonish SVG art; document first, several narrow animated art studies second, playable prototype third.

**Proposed defaults:** a fictional English valley influenced by the twelfth and thirteenth centuries; a Benedictine-inspired community; fixed isometric presentation; twelve-minute days; twenty-four-day seasons; an institution-level player role; three art-study candidates; a small first playable focused on one stone chapel bay.

**Still open:** final title, exact date and customs, preferred art direction, final rendering stack, long-campaign time compression, and whether cathedral status becomes an implemented campaign route. Proposed defaults let development proceed; they are not claims of decisions already made by the owner.

## 2. Five design pillars

1. **A church built through lives.** Every completed section should suggest the labor, resources, choices, and people behind it.
2. **A community with a recognizable rhythm.** Bells, processions, shared meals, work, reading, and rest make the settlement feel inhabited.
3. **People who explain themselves.** Personality shapes action, but the player can inspect the reasons. Surprise should arise from understandable motives.
4. **An economy visible on the ground.** Grain is stored, timber is carried, roads become busy, and construction waits for identifiable missing inputs.
5. **A world worth watching.** Warm colors, readable silhouettes, changing light, weather, and modest animation should make observing a quiet day rewarding.

A feature belongs early only if it supports at least one pillar and strengthens the central relationship between community and construction.

## 3. Historical frame and the cathedral question

### Recommended setting

Start in a fictional valley in medieval England, initially drawing on approximately 1130–1250. Choose a narrower opening date before producing detailed historical content. The initial architectural vocabulary is Romanesque; later pointed arches and other Gothic developments should emerge through available expertise and changing practice, not arrive as an interchangeable day-one style collection.

The community is Benedictine-inspired. That gives us a strong foundation in a written rule while leaving room to define the house's own customs. We must not silently combine Benedictine, Cistercian, mendicant, and modern monastic practices into one supposedly universal routine.

The monks' faith should be present as lived conviction, community, obligation, consolation, doubt, and disagreement. It should not be reduced to a meter that establishes who is objectively righteous. Religious characters can be sincere and difficult, generous and ambitious, scholarly and impractical.

### Abbey church versus cathedral

An abbey is a monastic institution. A cathedral is the church containing a bishop's seat. Size and architectural grandeur do not by themselves make a church a cathedral.

Our main construction ambition can therefore be a **great abbey church**, with all the monumental qualities the brief calls for. Medieval England also had monastic cathedral communities. A later story could involve becoming a bishop's seat, but that would require a historically researched institutional change, potentially including different governance and a changed relationship with the bishop. It is not a cosmetic upgrade.

This preserves two possible long-term stories:

| Route | Central question |
| --- | --- |
| Great abbey church | Can an independent monastic community sustain its ambitious building and obligations? |
| Monastic cathedral, if developed later | What does the community gain and surrender when its church becomes an episcopal center? |

The prototype needs neither route implemented. It needs to establish why building the next bay matters.

### Authenticity policy

Separate **historical practice**, **local variation**, and **gameplay adaptation** in design notes. Compress time openly. Retain material constraints and institutional logic where they create interesting decisions.

The settlement includes lay workers, tradespeople, visitors, and eventually households, including women with economic and social agency. Monks do not personally perform every trade. Female religious communities and other playable institutions are potential later subjects, each requiring their own research rather than a simple reskin.

Historical hardship can appear without making cruelty the default source of spectacle. Supernatural effects are outside the proposed historical baseline; beliefs about miracles can shape events without the simulation confirming magic.

## 4. The player, the loop, and the community's ambitions

The player acts as the continuing steward of the institution, making decisions through its leadership and offices. The player is not an immortal monk and does not disappear when an abbot dies.

The player controls building plans, budgets, work priorities, appointments, supply policies, hospitality policies, and important responses to events. Monks handle their routines. Direct reassignment is available, but requiring the player to drag every person to every service would defeat the point of a living community.

A normal cycle is:

1. Observe stores, needs, relationships, the building site, and the next scheduled obligations.
2. Choose a limited set of priorities: harvest, repair a roof, train a carpenter, receive guests, or advance construction.
3. Allocate people and materials; reserve what must be protected for food, warmth, and maintenance.
4. Watch work and daily life generate useful outputs, friction, opportunities, and memories.
5. Resolve consequential decisions and revise plans.
6. Complete a visible improvement that changes what the community can do.

Different timescales support different decisions:

| Timescale | Typical decisions |
| --- | --- |
| Minutes | Who covers for an ill cook? Which delivery unblocks the worksite? |
| A day | Which work can fit around services, meals, and rest? |
| A season | What is planted, sold, preserved, or committed to building? |
| A chapter of the campaign | Which benefactor is accepted? What part of the church is worth the cost? |
| A generation | What kind of institution has this become, and who inherits its work? |

Progress is expressed through capabilities and community history. Church capacity, safe stores, skilled labor, hospitality, books, trade connections, and trustworthy leadership all matter. Avoid a single prestige number that makes every decision serve the same objective.

Campaign goals may include completing and dedicating a chosen church plan, surviving a succession, or fulfilling a founding charter. Sandbox continuation remains possible. A dedication recognizes a milestone; it does not imply that a church can never be expanded again.

## 5. Time, the monastic day, and generational scale

### Initial tuning hypothesis

| Setting | Proposed default |
| --- | --- |
| Full visible day at normal speed | 12 real minutes |
| Typical daylight / darkness | About 9 / 3 real minutes, with seasonal variation |
| Season | 24 representative days; keep 20- and 30-day alternatives configurable |
| Year | Four seasons, or 96 representative days |
| Controls | Pause, 1×, 2×, 4×; faster simulation considered only after profiling |
| Decisions | Important events pause by default; pausing and slower play carry no penalty |

These are representative game days, not a literal medieval calendar. Feast days, agricultural timing, aging, and historical dates must be mapped deliberately rather than assuming ninety-six real days constitute a historical year.

The arithmetic matters: one game year takes **19.2 hours at 1×**, or **4.8 hours at uninterrupted 4×**, before pauses. A fifty-year project would still take 240 hours at uninterrupted 4×. Short days alone do not solve generational pacing.

For the first playable, use continuous short seasons and no aging system. For the full game, prototype **optional chronicle interludes** between stable campaign chapters: the player may advance a proposed one to three years through a summarized simulation, then return to detailed daily life.

An interlude must forecast its assumptions, preserve resource accounting, process aging and relationships, and stop at events that demand a decision. It must not conjure a finished church, erase a shortage, or kill an important character without explaining what happened. Keep a pre-interlude save and a readable account of changes. This is a significant later feature, not a cheap skip-time button.

Construction work units are also deliberately compressed for play. We will describe that choice honestly rather than claim that a small handful of workers can literally build a medieval church in a few afternoons.

### A recognizable daily rhythm

The canonical hours traditionally include a night office, Lauds, Prime, Terce, Sext, None, Vespers, and Compline. Names, schedules, and the relationship between worship, work, sleep, and seasons require period-specific verification. Mass and the chapter meeting are distinct from the canonical hours.

The following is a **gameplay arrangement**, not a historical timetable:

| Game window | Visible routine | Gameplay purpose |
| --- | --- | --- |
| Late night / predawn | Brief night-office observance; most darkness remains accelerated rest | Candlelit life without a long period of player inactivity |
| Dawn | Lauds and Prime represented as a compact dawn sequence; breakfast where the chosen custom allows it | Community gathers and the day becomes legible |
| Early day | Chapter meeting, assignments, worship, and first work period | Surface concerns and set priorities |
| Middle day | Terce, Sext, and None distributed as short observances around work, reading, and the meal | Preserve the pattern without making every bell an interruption |
| Evening | Vespers, supper where appropriate, conversation or reading | A strong visual and emotional daily anchor |
| Nightfall | Compline and quiet | Resolve the day and restore energy |

In the prototype, fully stage **one morning gathering, Vespers, a shared meal, work, and sleep**. The other observances can appear as schedule entries and modest transitions until their animation is warranted. Label this as a reduced routine.

Travel time matters. Schedule jobs in blocks, allow work to be left safely, and use grace windows for gatherings. A brother should not spend the day walking repeatedly between a distant field and the chapel without accomplishing anything.

Policy determines reasonable exceptions for sickness, essential care, guests, and urgent work. Missing a service can create a meaningful personal or institutional consequence, but should not trigger an arbitrary punishment every time an animation finishes late.

## 6. Monks as people

### Character model

Every monk needs a name, age or life stage, appearance, role, personal background, current activity, needs, attributes, learned skills, traits, relationships, and remembered experiences.

The character panel must answer: **What is he doing? Why? What is troubling him? What is he good at? What could the player change?**

Keep the full data model expandable, but introduce complexity in layers.

| Layer | Proposed design | Example |
| --- | --- | --- |
| Attributes | Broad aptitudes, provisionally 0–20 | Body, Perception, Reason, Presence, Resolve |
| Skills | Learned competence, provisionally 0–10 | Husbandry, Carpentry, Masonry, Provisioning, Letters, Medicine, Administration |
| Traits | Two to four defining tendencies at first | Patient, ambitious, sociable, exacting, generous, cautious |
| Needs and condition | Concrete pressures with visible causes | Hunger, fatigue, warmth, illness, stress, need for companionship or quiet |
| Values | Priorities and personal commitments | Observance, learning, hospitality, beautiful craftsmanship, institutional independence |
| Relationships | Directed ties, with a few readable dimensions | Affection, trust, and a major unresolved grievance |
| Memories | Bounded records of significant experiences | Was helped during illness; was blamed unfairly; completed his first stone arch |

Do not display every field as a bar on the main screen. Expose useful summaries and optional detail. No hidden universal piety score should claim to measure the truth of someone's faith.

Attributes and skills are different. A clever novice is not automatically a trained physician. A skilled but physically frail mason might become an excellent supervisor or teacher.

Traits should influence both possibilities and difficulties:

| Trait | Helpful tendency | Potential friction |
| --- | --- | --- |
| Exacting | Good inspection and careful craft | Resents rushed work and repeated compromises |
| Generous | Comforts others; supports hospitality | May argue against strict rationing or surplus sales |
| Ambitious | Seeks training and responsibility | Dislikes being overlooked for office |
| Sociable | Builds relationships and welcomes guests | Finds prolonged solitary tasks draining |
| Cautious | Notices exposure and reserves supplies | Resists ventures with uncertain returns |
| Patient | Teaches steadily and tolerates setbacks | May postpone a confrontation that needs resolution |

These are tendencies, not guaranteed behavior. Skills, current needs, relationships, values, and policy can outweigh a trait.

### Offices and institutional life

Begin with an abbot or acting superior, a cellarer, and ordinary brothers. Later offices may include prior, infirmarer, guestmaster, sacrist, and responsibility for the library or scriptorium; exact titles and powers depend on the selected period and customs.

Appointment creates responsibilities and social consequences. The most skilled administrator may have poor trust among the brothers. An excellent craftsperson may resent being moved away from meaningful work. Offices should change behavior and access to decisions, not simply add numerical bonuses.

Later governance can include chapter deliberation, visitation, patron pressure, and succession. It does not need a full grand-strategy political map.

### Action selection and explanation

A practical decision order is: immediate safety and essential needs; protected scheduled obligations or permitted exceptions; assigned role and current job; then personal preferences and available opportunities. Interruptions need rules, so characters neither abandon a heavy lift halfway through nor ignore hunger indefinitely.

Inspection might show:

> Brother Martin is preparing supper. He is the assigned cook, the meal is due soon, and the stores are nearby. He would prefer copying manuscripts, but has agreed to cover for the sick brother.

Relationships change through shared work, kindness, disappointment, competition, and authored events. Memories have provenance and duration. Some feelings fade; a few formative experiences become durable history. Keep routine memory bounded so a long save does not store every ordinary footstep and meal.

### A possible founding cast

These are original illustrative characters, not a locked roster. Their tensions should emerge through work and choices before they appear in event cards.

| Person | Place in the community | Strength and personal tension |
| --- | --- | --- |
| Brother Anselm, acting superior | Tries to hold the founding group together | Patient and cautious; wants a lasting house but fears accepting obligations it cannot meet |
| Brother Oswin, cellarer | Manages stores and daily provisions | Exacting and capable; his insistence on reserves can sound like indifference to people in need |
| Brother Martin, cook | Feeds the community and notices who is struggling | Generous and sociable; privately longs for more time to learn manuscript work |
| Brother Thomas, aspiring mason | Assists the hired mason and dreams of the new church | Ambitious and exacting; mistakes criticism of his work for a judgment of his worth |
| Brother Hugh, gardener | Knows the ground and quietly teaches others | Patient and cautious; finds abrupt changes to the working routine difficult |
| Peter, novice | Learns carpentry and the house's customs | Curious and restless; forms attachments quickly and struggles with stillness |
| Walter, hired mason | Brings expertise the founders do not possess | Proud of sound work; must earn a living and will challenge an unsafe or unpaid commission |
| Agnes, hired carter | Moves supplies between the house and the neighboring settlement | Practical and well connected; has obligations beyond the abbey and expects its promises to be kept |

For this scenario, Peter follows a simplified novice routine; the historical distinctions in status and training need research before expansion. Agnes and Walter are lay people with paid work and their own schedules, not monks in different clothing.

A useful starting tension is already present: Thomas wants to advance the church, Oswin protects provisions, Martin notices hungry visitors, and Anselm must decide what the house can promise. Hugh and Peter can develop a quieter mentoring relationship. Avoid scripting every relationship into hostility.


### Population and performance

The first playable has six monks and two named lay workers. Later, all monks and important recurring townspeople remain individually detailed. Larger civilian populations can use household or workplace simulation, with representative activity on the map. We should not promise Dwarf Fortress-level detail for thousands of townspeople before measuring cost.

Novices, training, retirement, death, and succession belong after the daily character loop works. The institution continues when an individual dies.

## 7. The abbey economy and its neighbors

Construction depends on a community that can feed, warm, house, and organize itself. Building materials compete with ordinary needs: timber can become a roof, scaffolding, or fuel; money can pay a mason or buy grain.

Suggested eventual chains include:

| Chain | Representative stages | Meaningful constraints |
| --- | --- | --- |
| Food | Grain → flour → bread; vegetables and other foods alongside it | Seasons, storage, milling access, fuel, labor |
| Timber | Trees → logs → prepared timber | Woodland rights, hauling, seasoning abstraction, competing uses |
| Stone | Extraction or purchase → transport → dressed stone → installed masonry | Access, cost, skilled labor, heavy transport |
| Mortar | Purchased lime or a later local kiln + sand + water → mortar | Fuel, handling, batching, weather; simplify honestly |
| Cloth | Purchased wool or local livestock → prepared fiber → cloth | Workspace, labor, trade |
| Writing | Purchased writing materials + trained labor → manuscripts | Expensive inputs, time, scholarship and patronage |

The prototype uses a deliberately smaller set: grain, meals, firewood, timber, stone, prepared mortar, and coin. Mortar is purchased; grain is cooked into simple meals. Full bread production, livestock, kilns, and manuscript production are deferred. Generic meals and simplified mortar are transparent abstractions.

### Logistics rules

Materials live in identifiable stores. Workers reserve inputs for a task, fetch or receive them, and commit them as construction advances. Cancellation releases reservations and returns only physically recoverable materials. Do not let the same pile pay for two buildings.

Jobs expose their blocking reason: missing stone, no available mason, inaccessible work area, insufficient funds, or unsuitable weather. A reserve policy can protect food and winter fuel before the building site claims surplus labor and money.

Use understandable abstractions: stack limits and hauling capacity matter before a detailed simulation of every sack or wheelbarrow. Do not simulate groundwater, individual tree roots, or mortar chemistry in the first playable.

### A settlement around the abbey

Growth should follow concrete opportunities: reliable employment, food, safety, transport, services, and market rights. A new workshop should have a reason to exist. Lay workers earn wages; traders need routes and terms; tenants and neighbors have interests.

Potential relationships include customary woodland use, flood protection, access to a mill, fair wages, relief in a poor harvest, and disputes about land or markets. A grant does not make all neighboring people passive subjects.

Start with an abstract off-map village and a periodic trader. Add on-map households and civic growth once the abbey loop works. A grand-strategy map, military conquest, and fully simulated regional prices are outside the initial scope.

## 8. Building the great church

The church must be an evolving place, not a construction progress bar that disappears to reveal a finished prefab.

### Modular architectural plan

Use a fixed isometric grid with compatible modules: bays, aisles, choir or chancel sections, transepts, chapels, towers, and cloister ranges as the game expands. Research terminology and architectural compatibility for the chosen setting.

Players select a site and a plan, reserve future extensions, and commission sections in a sequence they can afford. Keep partially completed buildings recognizable. Let an old chapel continue serving the community while a new church grows beside it or around a planned replacement.

Suggested visible stages:

| Stage | Visible evidence | Dependency |
| --- | --- | --- |
| Survey and preparation | Pegs, ropes, cleared ground, a plan board | Accessible site and approved footprint |
| Foundations | Excavated outlines and low masonry | Labor and foundational materials |
| Walls and piers | Rising courses, supports, incomplete openings | Foundations and skilled masonry |
| Arches and upper work | Timber centering and scaffolds | Required supports and temporary works |
| Roof and enclosure | Rafters, partial covering, doors and glazing as appropriate | Stable supporting structure and carpentry |
| Fit-out and dedication | Furnishings, finished surfaces, a gathering | Usable enclosure and required fittings |

The early chapel bay uses a timber roof. Vaults, complex towers, and ambitious structural systems are later work.

Each module carries a bill of materials, skill requirements, work units, dependencies, and a visible state. Construction safety should initially use authored dependency checks, not finite-element engineering. Quality, rain exposure, and repairs can matter through comprehensible rules.

The player can inspect a section and see why it has stopped. Warnings should precede predictable damage; a routine random roll should not destroy hours of work without useful warning or mitigation.

### Choices worth making

A larger plan demands resources and can burden later generations. Imported stone can speed progress but increase debt. Training local workers takes time but leaves skills in the community. A donor may finance a chapel while asking for privileges or commemoration.

Completed spaces unlock uses: more room for worship, shelter for guests, a quieter library, or a suitable infirmary. Architecture should change daily life, not merely increase prestige.

In the full game, construction records can name supervisors, benefactors, interruptions, and dedications. The church becomes a readable archive of the campaign.

## 9. Events, illustrations, and emergent narrative

Events should draw attention to tensions the simulation has already created. Purely external events also have a place, but most cards should involve recognizable people and circumstances.

Each authored event needs:

- Eligibility conditions and valid roles for its participants.
- A trigger or weighted selection rule, a cooldown, and repetition limits.
- A title, illustration reference, short scene, and two or three distinct responses.
- Requirements and immediate effects, plus clearly signaled uncertainty.
- Memories or relationships to change and any later follow-up.
- Fallback behavior if a participant has left, died, or become unavailable.

An event should not claim a friendship, fire, shortage, or betrayal that does not exist in game state. Randomness can select among plausible outcomes; it must not make personality irrelevant.

### Example: The Last Dry Timber

**Situation:** A wet spell is approaching; the guesthouse roof is damaged; prepared timber is reserved for the new chapel; the guestmaster and building supervisor disagree.

| Response | Immediate tradeoff | Possible longer consequence |
| --- | --- | --- |
| Repair the guesthouse first | Divert timber and delay the chapel | Guests are sheltered; the supervisor remembers the interruption |
| Preserve the building allocation | Continue the chapel | Close unsafe guest beds or accept a clearly forecast exposure risk; hospitality suffers |
| Purchase an extra load, if available | Spend coin and wait for delivery | Keep both plans possible, with dependence on the trader |

If the trader has no timber or the treasury cannot pay, the purchase option is unavailable with an explanation. An emergency task should consume actual materials. An illustration can show two brothers beneath a dripping eave while scaffolding rises behind them.

### Example: An Error in the Margin

A novice copying a text discovers that a respected elder made an error. Their relationship and dispositions shape how the issue reaches the player. Private correction, public discussion, and assigning a mentor trade dignity, learning, and time. Letters must exist as a system before this event can be interactive; until then it belongs in the later content backlog.

### Example: The Bell and the Storm

A vulnerable worksite and an approaching service conflict. The player can authorize a short exception, secure the site earlier by sacrificing progress, or accept an explicit risk. The event must respect the standing policy; a preexisting emergency exemption should not be forgotten merely to force a dramatic card.

### Narrative pacing and art

For the fuller game, test a density of one substantial decision every five to eight real minutes during an eventful period, with quieter entries in the chronicle. This is a tuning target, not a quota; long peaceful stretches are welcome. The first playable contains only its three authored decision beats and does not attempt this full content density. Do not manufacture crises to fill silence.

Use a small library of carefully composed event illustrations. Reusable backgrounds and props can reduce cost; close-up named characters must match their portraits or stay visually nonspecific. Every event requires a stable art key, a fallback composition, and appropriate alt text.

SVG suits recurring environments, frames, and modular portraits. More expressive hand-drawn or generated raster illustrations may suit major events if their style remains coherent. Concept images do not prove that a scene will animate or that assets can be used directly in the renderer.

The first playable needs three functioning events: a supply-versus-construction dispute, a conflict between actual characters, and a milestone or act of reconciliation. At least one should be hopeful.

## 10. Visual direction and the three art studies

### Shared direction

Bright color, clear shapes, expressive small figures, and architecture that remains legible as it grows. The world should feel inviting in sunshine and still readable at night.

Use **editable SVG source art** where it offers practical advantages: buildings, props, vegetation, portraits, and interface ornament. SVG is an asset format, not a guarantee of good art or unlimited rendering performance.

Propose a fixed 2:1 isometric camera with pan and zoom, consistent ground anchors, and no free rotation. Author enough entrances and wall variants to support useful layouts. Solve occlusion through roof fading or cutaways and selection outlines before adding decorative density.

### Three candidates

| Candidate | Appearance | Strength | Principal risk |
| --- | --- | --- | --- |
| Orchard Cloister | Clean contours, rounded trees, warm stone, restrained gradients, fresh greens and ochres | Strong readability and a manageable modular asset pipeline | Can look too generic unless silhouettes, gardens, and architecture have character |
| Living Manuscript | Modernized manuscript shapes, lively linework, jewel accents, parchment-informed event frames | Distinctive identity with a natural connection to monastic books | Ornament and flattened perspective may compete with construction readability |
| Sunlit Storybook | Softer forms, gentle shadow shapes, richer greenery, expressive figures | Warm atmosphere and appealing illustrated events | Greater asset complexity and a risk of drifting into a raster look that is difficult to maintain in SVG |

The initial recommendation is **Orchard Cloister for the moving world, with restrained Living Manuscript influence in event art and the chronicle**. Test all three before choosing. This is a hypothesis, not a selected style.

### One identical scene per candidate

Build only a small clearing with a timber chapel, one partially built stone bay, a short path, a garden, several trees, a bell, two material stacks, and twelve representative monks. All candidates use the same layout, timing, camera positions, and weather seed.

No settlement simulation is required. Scripted paths and construction transitions are enough to test the visual questions.

| Test state | What it must demonstrate |
| --- | --- |
| Clear day | Building shape, terrain separation, readable people and work |
| Dusk | Smooth palette transition and warm windows |
| Night | Candle or lantern pools, visible paths, selectable figures |
| Rain | Visible precipitation and wet-surface cues without obscuring jobs |
| Fog | Depth cues with preserved foreground and selection clarity |
| Snow | Snow on ground and roofs, recognizable silhouettes, readable paths |
| Construction | Foundations, rising walls, scaffold/centering, partial roof, completion |
| Communal routine | Walking to Vespers, gathering, standing or kneeling, then dispersing |

A study needs real movement: walk cycles or articulated motion, carrying a load, an idle gesture, one work action, bell movement, a restrained tree sway, and a smoke or steam effect. Avoid compensating for static figures by making the entire scene bob.

Provide controls for style, weather, light, construction stage, animation speed, zoom, and reduced motion. Add a single monk inspection card and one event-card composition to judge world/interface compatibility.

### Evaluation and selection gate

Judge the same screenshots and short recordings side by side. Score readability at normal zoom, attractiveness in motion, night/weather clarity, character expressiveness, construction clarity, editability, and production effort.

At 1920×1080, the proposed performance target is 60 frames per second on a documented representative desktop. Record actual hardware, renderer, scene size, frame timing, and asset memory. Do not claim performance from a static mockup.

After the basic comparison, stress the leading candidate with approximately 200 animated figures, 1,000 visible ground tiles, and 300 props. These are test loads, not population promises. Keep quality and density adjustable.

Select a style only after checking both the images and the effort required to add a new compatible building. A beautiful scene that cannot economically produce the next fifty assets is not yet a production pipeline.

## 11. Asset production and audio

### SVG asset contract

Before producing many assets, define:

| Requirement | Purpose |
| --- | --- |
| Shared viewBox conventions and scale | Buildings and people agree on size |
| Named ground anchor and footprint metadata | Art, selection, placement, and navigation line up |
| Logical layers for roof, walls, shadows, snow, and construction | Weather and progress can change independently |
| Restricted fills, strokes, gradients, and effects | Browser and native rendering remain compatible |
| Semantic palette tokens | Coordinated light, material, and seasonal variants |
| Stable asset IDs and source provenance | Save references remain durable and asset rights remain clear |
| Export bounds and padding checks | Avoid clipped shadows, overlapping atlas regions, and visible seams |

Do not use SVG filters that the intended native importer cannot support. Avoid duplicating full artwork for every weather state when a shared overlay or palette change will work.

Buildings use construction overlays and selected intermediate forms; characters use reusable body parts or exported animation frames. Portraits have a shared grammar for face, hair, age, clothing, and expression. Track assets in a manifest with source file, authoring history, rights, anchor, bounds, variants, and export settings.

The pipeline should make a small change, export it, and display it in the study reliably. Generated concept artwork can guide an artist or vector implementation; it should not be described as automatically production-ready SVG.

### Sound as part of the rhythm

Bells communicate time, but also need visual captions. Footsteps, saws, rain, wind, birds, kitchens, and low communal voices establish activity without constant music.

Reserve fuller musical moments for meaningful milestones. Use appropriately licensed or original recordings and compositions; do not assume a modern recording is freely usable because its underlying chant is old.

Provide independent volume controls and a calm audio mode. Night should be restful rather than silent and lifeless.

## 12. Interface and accessibility

The main view should support watching, planning, and understanding causes.

Proposed layout:

- A compact header for time, weather, food runway, fuel, treasury, and high-priority alerts.
- A collapsible planning panel for construction, assignments, and policies.
- An inspection panel for a person, stockpile, building section, or relationship.
- A chronicle with meaningful events and links back to involved people and places.
- Optional overlays for routes, construction dependencies, room use, and weather exposure.

Make panels resizable where practical and prevent them from covering the selected subject. Keep the world usable while inspecting an ordinary character; reserve modal interruption for consequential decisions.

Tooltips explain terms such as Vespers, cellarer, nave, and lime mortar in plain language. The historical note belongs behind an optional information control; routine gameplay should not require reading an encyclopedia.

Provide readable UI scaling, keyboard navigation, color-independent status indicators, reduced motion, subtitle/caption support, and high-contrast selection. Warnings should name their cause and a plausible response.

Trust is central: show who has reserved materials, why a task is blocked, why a monk changed activity, and what a policy applies to. Do not expose internal variable names to the player.

## 13. Technical direction

### Recommended approach, not yet an engine commitment

Use a small local browser harness for the SVG visual studies because it makes art, weather, and animation easy to inspect. This harness contains scripted scenes, not a second implementation of the economy.

For the eventual persistent simulation, the recommended candidate is **C++20 with SDL3 presentation**, subject to the art/import/performance study. Its benefits are control over long-running simulation, clear save ownership, and a desktop application that can run locally. Its costs include a more deliberate UI, asset, build, and packaging pipeline.

A native feasibility test should import the selected SVG assets, render the shared study scene, and exercise interaction before substantial game code is written. SDL3 does not itself provide a complete SVG authoring or scene system. We must select and validate an importer or a rasterization/export step.

Prefer SVG as source with cached textures or atlases at tested resolutions for runtime use if that meets quality and zoom needs. Keep rendering decisions separate from simulation data. Do not promise infinite sharpness from a single raster export.

If the native workflow proves too costly for iteration, reconsider the client before building the simulation twice. Final implementation choice remains open until the feasibility gate.

### Simulation boundaries

Use a fixed logical simulation timestep, separate from rendering. Begin with one understandable simulation thread and profile before adding parallelism.

Useful system boundaries are world/navigation, characters and schedules, jobs and reservations, stores/production/trade, construction, relationships/memories, events, and the calendar. UI commands request changes; they do not directly mutate arbitrary state.

A reproducible save needs stable IDs, a schema version, simulation time, random-generator state, characters, relationships, jobs, reservations, stocks, construction, active events, cooldowns, and relevant world changes. Save atomically, retain rotating backups, and handle version mismatch clearly. Do not promise that every development save will remain compatible before migration support exists.

Keep event definitions, traits, recipes, and building modules data-driven and validated. Save schema and content version are separate concerns.

Prototype pathfinding can operate on a small grid. Inaccessible destinations, occupied work locations, canceled jobs, and queues at doors need explicit resolution so the community cannot silently deadlock.

Meaningful validation later includes resource conservation, no duplicated reservations, schedule interruptions, construction dependencies, unreachable jobs, event eligibility, and save/load equivalence. Performance and durability claims require actual measurements. This document alone validates none of them.

## 14. First playable: 0.1.0 — First Bell

**Release name is proposed; this release does not exist yet.**

### The question it must answer

Is it enjoyable to understand a small community, organize its day, resolve a personal disagreement, and complete a visible piece of its church?

### Bounded contents

| Area | First playable |
| --- | --- |
| World | One small fixed valley map; no procedural generation |
| People | Six named monks and two named lay workers |
| Existing spaces | Timber chapel, shared sleeping space, kitchen/refectory, store, garden or field, woodlot |
| Construction | One stone chapel bay with visible foundations, walls, timber roof, and completion |
| Resources | Grain, meals, firewood, timber, stone, prepared mortar, coin |
| Routine | Morning gathering, work, shared meal, Vespers, sleep |
| Character detail | A small attribute subset, four active skills, two traits per person, basic needs, relationships, and a few meaningful memories |
| Skills in active use | Provisioning, Husbandry, Carpentry, Masonry |
| Economy | Hauling, storage, simple food preparation, gathered fuel/timber, one trader |
| Events | Three state-aware illustrated events with actual consequences |
| Environment | Day/night and rain with gameplay effects; other weather proven visually in the studies |
| Interface | Selection, inspection with reasons, work priorities, building status, event choices, short chronicle |
| Persistence | Save/load and rotating local backups |
| Session target | A satisfying 45–90-minute scenario at mixed speeds, with continuation afterward |

Begin with enough supplies to avoid an immediate irreversible shortage, a mature patch available for harvest, and a dependable initial trader visit. A new crop does not grow to maturity in a single twelve-minute day. Lay specialists have clear wages and duties. Assignments and construction choices should create pressure gradually.

The playable scenario uses a shortened, explicitly labeled scenario calendar as needed; it does not claim to cover a full normal twenty-four-day season within an hour. Reaching the first completed bay is the scenario milestone. Exact starting quantities and labor rates are tuning work.

Suggested introduction:

1. Meet the small community and inspect a brother to learn what he is doing and why.
2. Set food and fuel reserves, then assign ordinary work.
3. Observe a communal gathering and resume work without manual rescheduling.
4. Commission the chapel bay and see real inputs arrive.
5. Respond to a disagreement involving people already encountered.
6. Adapt to a wet spell and a supply constraint.
7. Complete the bay and gather for a modest milestone.

### Acceptance criteria

The first playable succeeds when a player can:

- Follow a complete day and identify a monk's work, need, and motivation.
- Observe two different personalities produce an understandable difference in response.
- Inspect a delayed job and discover its actual blocker.
- Change priorities and see a causal effect without manually directing every movement.
- Watch materials become visible construction through multiple stages.
- Make an event choice whose practical and personal effects remain visible afterward.
- Save during work, reload, and continue without duplicating or losing stocks, jobs, or relationships.
- Reach the chapel milestone in the intended session range without opaque failure or a forced exact solution.

### Explicitly deferred

Full cathedral planning; complex vaults; regional politics; warfare; detailed theology systems; on-map civilian households; births and generational succession; chronicle interludes; livestock; complete crop rotation; deep manufacturing; procedural geography; multiplayer; mod distribution; and a comprehensive historical encyclopedia.

Snow and fog belong in the visual studies first. Their agricultural, transport, and health effects can come later.

## 15. Development sequence and decision gates

| Stage | Deliverable | Gate before proceeding |
| --- | --- | --- |
| 0. Founding design | This single document | Discuss proposed defaults and revise the premise where needed |
| 1. Visual studies — proposed 0.0.1 “Candlelight” | Three tiny animated versions of the same clearing, with weather/light/construction controls and captured comparisons | Choose a visual direction based on readability, atmosphere, editability, and measured rendering cost |
| 2. Native feasibility | Selected assets and scene exercised in the proposed desktop rendering pipeline | Confirm SVG handling, zoom, animation, occlusion, UI scaling, and a reproducible build |
| 3. First playable — proposed 0.1.0 “First Bell” | The small community and chapel-bay scenario | Establish that daily life, character conflict, logistics, building, and saving work together |
| 4. Seasonal settlement | Longer food planning, weather consequences, hospitality, and a modest surrounding community | Confirm that expanding population and economy adds decisions the player can understand |
| 5. Generational church | Larger modular church plans, patronage, succession, and tested campaign time compression | Sustain attachment across leadership changes without excessive waiting or opaque simulation |

Do not turn the art studies into a city-builder before choosing their style. Do not implement the full cathedral or political system merely because the document describes its eventual possibility.

This first repository contribution is documentation only. No release tag, executable, approved engine selection, measured performance result, or completed art study is implied.

## 16. Risks that should shape the work

| Risk | Early response |
| --- | --- |
| The game becomes several enormous simulations at once | Finish the six-monk scenario before adding systems beyond its acceptance criteria |
| Historical routine consumes the whole workday | Tune travel, grouped observances, safe interruption, and grace periods |
| Characters look different but behave alike | Test observable trait-driven choices and retain the reasons in inspection |
| Events feel detached from play | Bind participants and effects to actual state, with cooldowns and follow-ups |
| Construction is beautiful but strategically empty | Require logistics, skilled work, staged usability, and competing obligations |
| A compressed calendar destroys generational pacing | Measure session lengths; prototype explicit interludes later |
| SVG art is attractive but difficult to animate or import | Limit the asset vocabulary and test the native pipeline early |
| Weather hides the game | Preserve silhouettes, selection, paths, and job indicators in every study |
| A long save becomes slow or fragile | Bound routine memory, profile scale, version saves, and test recovery |
| The setting becomes generic medieval decoration | Research one house tradition and period; distinguish evidence from adaptation |

## 17. Research foundations and open decisions

This is a creative and technical design proposal, not a completed historical research report. The sources below are starting points for the next historical pass; they have not been freshly checked for this document.

Recommended source work:

- **The Rule of Saint Benedict:** chapters 8–20 for the Divine Office; 31–32 for the cellarer and material care; 35–41 for kitchens, illness, and food; 42 and 48 for silence and daily work; 53 for guests; 57 for artisans; 64 for the abbot. Treat a prescriptive rule as evidence of ideals, not proof that every house always behaved accordingly.
- **A period- and order-specific customary:** select one after choosing the setting, to understand local practice and variation.
- **David Knowles, The Monastic Order in England:** institutional context, read critically alongside more recent scholarship.
- **Glyn Coppack, English Heritage Book of Abbeys and Priories:** buildings and archaeology as a starting point.
- **Nicola Coldstream, Medieval Architecture:** an architectural starting point, supplemented by evidence for specific construction methods.
- **Site plans and interpretation from English Heritage and comparable heritage institutions:** compare examples such as Rievaulx and Fountains while keeping their Cistercian setting distinct from our proposed Benedictine baseline; seek monastic cathedral evidence separately.
- **Building accounts, estate records, and archaeological studies:** verify wages, material movement, diets, work organization, and rights before converting them into detailed mechanics.

The next historical pass should produce short notes tied to actual design decisions: what a cellarer controls, which activities interrupt work, how a given roof is built, who lives outside the cloister, and what is owed to neighboring people. It should not delay the small visual tests.

Questions to resolve through discussion and prototypes:

| Question | Current recommendation | How to decide |
| --- | --- | --- |
| Which visual direction best carries the game? | Orchard Cloister world; restrained manuscript influence for narrative | Compare the three animated studies |
| What exactly is the opening institution? | Small Benedictine-inspired house in a fictional English valley | Choose a date and historical reference tradition |
| Is becoming a cathedral essential? | Great abbey church first; cathedral status a possible later institutional story | Clarify the desired campaign fantasy and research governance |
| How much personal detail remains enjoyable? | Deep monks, selected recurring lay characters, household-level civilians later | Observe inspection and attachment in the first playable |
| How do decades pass? | Continuous daily life plus optional, accountable chapter interludes later | Measure pacing and build a separate interlude experiment |
| Which runtime should ship? | C++20 / SDL3 candidate; SVG authored and exported through a tested pipeline | Complete the native feasibility gate |
| How severe should setbacks be? | Recoverable hardship by default, with transparent consequences | Playtest the first wet spell and supply dispute |

## 18. The experience to protect

The cathedral-scale ambition gives the campaign its horizon. The daily community gives the player a reason to care about reaching it.

A successful session might end with very little completed masonry. The brothers have enough food. A novice has learned something. An argument has softened. Rain is passing over the roof, and the bell is calling everyone inside.

Tomorrow, the wall will be a little higher.
