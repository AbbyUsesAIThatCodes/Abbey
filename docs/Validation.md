# Validation record — 0.0.2

Recorded 18 September 2026. These measurements describe this source milestone, not the eventual full game.

## Native core benchmark

Release build, GCC 13.3, CMake, Linux x86_64, virtualized Intel Xeon Platinum 8370C @ 2.80 GHz. One simulation thread. Each population starts with seed 1135, commissions the bay and runs 18,000 ticks (two compressed days). Timings include per-tick clock instrumentation. One run is recorded in [benchmark-linux.csv](benchmark-linux.csv); small differences and maximum-tick outliers are expected on a shared host.

| Residents | Mean tick | 95th percentile | Maximum tick | Two days, wall time |
| --- | --- | --- | --- | --- |
| 500 | 0.002928 ms | 0.003610 ms | 2.695211 ms | 0.052699 s |
| 2,000 | 0.010791 ms | 0.012399 ms | 2.543510 ms | 0.194231 s |
| 5,000 | 0.026831 ms | 0.041583 ms | 2.397106 ms | 0.482952 s |

At 1× the simulation requests ten ticks per real second. These results leave ample room for the **current simplified core**. They do not establish a population ceiling or guarantee a frame rate for the future game.

Measured work: per-person movement, cached route lookup and occasional route-field construction, schedule transitions, basic hunger/fatigue, simple recipe counters, prayer attendance and construction. Excluded: Godot rendering, GDExtension conversion, collision, crowd queues, workstation contention, hauling, object inventories, changing buildings and social AI. Positions are packed once separately; that CSV column measures core-side packing only. The fixed map and shared destinations favor cached routing. Five thousand residents do not represent five thousand detailed medieval lives yet.

No production desktop GPU frame-rate claim is made. The rendered layout is inspected using Godot's real OpenGL compatibility renderer under Xvfb with Mesa llvmpipe, a software renderer. The screenshot in `captures/` comes from the running game, not a concept image.

## Automated checks

`core/tests/simulation_tests.cpp` covers matching seeded runs, complete save/restore and continued-state equality, invalid/truncated saves preserving the live world, stairs, inaccessible routes and recovery, all eight daily bells, food accounting, one-time construction costs, on-site construction, invalid commands and previous-save backups.

`godot/scripts/test_native.gd` checks native class registration, packed position batches, command validation, save/load and subsequent simulation through GDExtension.

`godot/scripts/test_ui.gd` instantiates the actual scene and checks pane/button bounds, floor views preserving simulation state, character selection, duty changes, following, roof controls, commissioning, bridge save/load, zoom limits, picking, villager command restrictions and ending a drag over the interface, and pausing while a button has keyboard focus. Headless font metrics differ from the graphical renderer; the scrollable character content and fixed construction controls also receive an actual rendered inspection.

The build script imports the Godot project, runs both integration scripts and starts the game headlessly. The packaging step exports an independent native executable and accompanying extension. The standalone Linux package was also rendered at 96 and 5,000 residents, with cellar and upper-floor views inspected. CI runs the core and desktop checks separately on Windows and Linux and uploads the packages with its own benchmark CSV. A successful job is required before treating a platform's artifact as available; see the linked run for current results.

An AddressSanitizer/UndefinedBehaviorSanitizer build is also exercised. Locally, the host's tracing environment prevents LeakSanitizer from operating, so the local run uses `ASAN_OPTIONS=detect_leaks=0`. CI retains default leak checking. This is a host limitation, not a clean local leak-check result.

## Reproduce

```sh
python scripts/build.py --desktop --package
./build/abbey_benchmark --population 5000 --ticks 18000
cmake -S . -B build-sanitize -DABBEY_SANITIZE=ON -DCMAKE_BUILD_TYPE=Debug
cmake --build build-sanitize --parallel 4
ctest --test-dir build-sanitize --output-on-failure
```

For a capture, run the graphical game with user arguments such as `-- --fresh --vespers --capture=/absolute/path/abbey.png --capture-frame=30 --quit-frame=90`. The `--capture` option requires a graphical renderer; headless rendering cannot produce the screenshot. The capture and quit arguments are development aids and bypass normal exit autosaving.

## Remaining gates

- Profile a real hauling/reservation workload and dynamic route invalidation before extrapolating town size.
- Test sustained frame time and input responsiveness on representative Windows/Linux machines and GPUs; a successful headless package test is not that test.
- Play-test pacing, shortages, crowd readability and prayer travel times.
- Verify sound on a physical audio device. A generated bell asset and headless playback calls are not an auditory hardware test.
- Improve world-object/character occlusion, individual poses/portraits, scalable layout and keyboard accessibility.
