# Living Foundations: architecture and scope

## The engine boundary

Abbey's world state belongs to `core/`, a C++20 library with no Godot, SDL, display, audio or UI dependencies. A command changes the core; a snapshot reports its state. The headless test and benchmark executables use exactly that library.

`native/abbey_bridge.cpp` exposes a small Godot GDExtension class. It advances the core, returns one packed position array, provides summaries and a selected-person dictionary, and forwards validated commands and save/load requests. `godot/` owns presentation, input, sound and camera behavior. It does not own resource balances, schedules or construction progress.

Godot is therefore replaceable at the presentation boundary. An SDL3 client would still require substantial rendering, input, audio and UI work, but would not require rewriting the current simulation or save schema. This reduces migration scope; it does not guarantee that future features need no refactoring. There is no SDL implementation in this milestone.

## Simulation

| Area | Current implementation |
| --- | --- |
| Time | Fixed 100 ms logical ticks; 9,000 ticks per day; one thread |
| People | Persistent indexed IDs, seeded starting data, integer movement progress, ordinary duty and scheduled intention |
| Decisions | Reconsider routines at schedule boundaries and explicit duty changes |
| Navigation | Three tile planes; reverse breadth-first route fields cached by destination; stair links only at the stair tile |
| Rendering transfer | Six floats per person: ID, x, y, floor, monk flag, activity; interpolated and depth-sorted by the client |
| Saves | Versioned text schema, random state, complete people and movement state, resources, closed tiles, construction and bounded chronicle |
| Failure handling | Candidate save validated before replacing live state; unknown versions and corrupt/truncated records fail clearly |
| Save replacement | Temporary file plus previous-file backup; rename on Linux, replace on Windows; no power-loss durability guarantee |
| Construction | One fixed site; cost paid on commissioning, work advances only while masons are on site |

The map is 40 × 32 tiles on each of three floors. Walls, doorway and pond affect core navigation. Some decorative objects and cottages do not block movement. Stairs connect the refectory, upper rooms and cellar; floor visibility changes presentation only. A cathedral's galleries, roofs, vaults and larger vertical circulation are not implemented.

The client updates the selected information pane a few times per second instead of constructing dictionaries for every resident every rendered frame. People share a draw node; they are not thousands of independent Godot character bodies. UI state and camera position are not saved in this milestone.

## The implemented office schedule

These are offsets from the start of the compressed game day, at 1×. They are gameplay timings, not claims about a historical monastery's clock.

| Office | Bell offset | Scheduled window |
| --- | --- | --- |
| Lauds | 0:00 | 22 seconds |
| Prime | 0:45 | 18 seconds |
| Terce | 2:50 | 14 seconds |
| Sext | 5:40 | 16 seconds |
| None | 8:00 | 14 seconds |
| Vespers | 10:40 | 32 seconds |
| Compline | 12:00 | 20 seconds |
| Matins | 14:15 | 28 seconds |

The main meal runs from 6:00 to 6:55. Night rest begins at 12:25; monks interrupt it for Matins and Lauds. The scenario starts at 10:00. Bells make monks set out for the chapel; only a monk physically at prayer when the window ends receives the attendance counter. Travel can consume short office windows. Grace periods, early calls, essential-duty exceptions, adaptive seasonal scheduling and richer prayer animation remain to be designed. Villagers have their own fixed work/meal/rest routine and do not inherit all the monastic obligations.

## Art pipeline

The crest, people, trees and shared portrait are original SVG source assets. Godot imports them as raster textures; buildings and terrain are drawn with polygons. Runtime art is therefore SVG-authored and vector-like, not a live infinite-resolution SVG renderer. Godot documents its SVG import limitations in the [4.4 image-import guide](https://docs.godotengine.org/en/4.4/tutorials/assets_pipeline/importing_images.html). Test final assets at the supported zoom range before expanding the art library. A future atlas and directional animations should be evaluated alongside the chosen style.

UI uses local system serif fonts with fallback plus the engine's bundled default font. Exact typography may differ by system. The bell is an original synthesized sound. No source text, cover or illustration from The Pillars of the Earth is bundled.

## Scope and next decisions

The existing benchmark exercises movement, scheduled changes, simple needs, production and construction on the fixed map. It omits collisions, reservations, per-item inventories, physical hauling, dynamic building placement, complex social decisions and a genuine larger town map. Increasing population primarily duplicates simple agents and shared destinations; overlap and unrealistic throughput are expected.

The next meaningful workload should add **finite workstations and hauling with reservations** to the six-monk scene, then profile again. That creates the first real contention and route changes. Follow with meaningful personality decisions and an inspectable incident/history model before treating the rich character vision as achieved.

Modular church building, changing topology, useful upper-level occlusion, persistent households, events, relationships, weather, farming seasons, deaths and succession remain future milestones. No concurrency framework or generalized ECS is justified by the current measurements alone.
