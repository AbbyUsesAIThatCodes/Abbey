# Welcome to Abbey

**Living Foundations · 0.0.2**

This early desktop prototype lets you watch a small community work, pray, eat and rest while exploring the foundations of our eventual abbey-building game.

## Start playing

Unzip the entire package. On Windows, open **Abbey.exe**. On Linux (Ubuntu 24.04 or compatible), run **Start-Abbey.sh**, or make `Abbey.x86_64` executable and launch it. Keep the native library beside the executable. No browser or game editor is required. Press **F11** if you prefer a window.

You begin in the afternoon, shortly before Vespers. There are 96 residents in the default village, including six monks. The population menu can start a smaller founding community or a larger stress scene; confirming replaces the current unsaved world.

1. Click a monk. Read what he is doing and why in the parchment pane.
2. Try **Follow this person**. Brother Oswin's stewardship takes him to the cellar; the brothers doing letters use the upper rooms.
3. Use **Cellar / Ground / Upper rooms** and **Show roofs / Reveal interiors** to explore the building.
4. Click **Commission chapel bay**. Its materials and coin are committed immediately. Brother Thomas and the other assigned masons make progress while physically at the building site.
5. Watch the community respond to the next bell. Ordinary work pauses for prayer, meals and sleep.

## Controls

| Action | Control |
| --- | --- |
| Select a person | Left click; arrows in the character pane cycle through everyone |
| Pan | WASD, right drag or middle drag |
| Zoom | Mouse wheel or − / + buttons |
| Reset camera | Home button |
| Change floor | Floor menu; Page Up / Page Down |
| Reveal interiors | Roof button |
| Pause / resume | Space or pause button |
| Pause and show exit reminder | Escape |
| Simulation speed | 1×, 2× or 4× buttons |
| Manual save / load | F5 / F9, or Save / Load buttons |
| Full screen / window | F11 |
| Mute / unmute bell | Bell on / off |
| Exit | Quit button or operating-system window close |

Changing a brother's assigned work does not cancel scheduled prayer or sleep. Residents' duties cannot be changed by the player. **Work cycles** count time spent at a workstation, including cycles waiting for inputs; they do not imply a successful recipe or delivered material.

## The day and the bells

A complete day takes **15 minutes at 1×**, with a nominal 12-minute daytime and 3-minute night. The eight offices are Lauds, Prime, Terce, Sext, None, Vespers, Compline and Matins. The bell starts travel to the chapel; there is no teleportation. At larger populations, residents may visibly overlap.

This is a compressed gameplay schedule. Mass, chapter meetings, feast days, seasonal timetables, processional choreography and exceptions for essential duties are future work. The “Early autumn” label is scenery for this milestone; seasons and aging do not yet advance.

## Saving and continuing

**Save / F5** writes a manual save; **Load / F9** restores it. A separate autosave is written every 90 real seconds and on normal exit. Opening Abbey normally resumes that autosave when present. A new population scene will eventually replace the autosave; make a manual save before experimenting if you want to return to your earlier settlement.

Each save retains the previous file as `.bak`. Saves live in Godot's user-data folder:

- Windows: `%APPDATA%\Godot\app_userdata\Abbey — Living Foundations\`
- Linux: `$XDG_DATA_HOME/godot/app_userdata/Abbey — Living Foundations/`, normally `~/.local/share/godot/app_userdata/Abbey — Living Foundations/`

The files are `abbey.save` and `abbey-autosave.save`. To recover a backup, close the game, preserve the current file, and copy the appropriate `.bak` file back to its original name. Loading an invalid save reports an error and preserves the current running world. Compatibility with later development milestones is not guaranteed.

Advanced launch options include `-- --fresh`, `-- --population=5000`, `-- --floor=-1` and `-- --vespers`. A launch with custom options starts a fresh session rather than automatically resuming.

## What to expect

This is a working foundation, with simple art and a fixed map. Its six work types, shared supplies, one bay and basic character data are deliberately small. Physical hauling, detailed relationships, unique portraits, illness, crowd queues and a cathedral designer are not present yet. Hunger and fatigue are displayed and updated but do not yet cause illness or death. Most traits are descriptive; Energetic changes walking speed.

A bell sound is included. Audio output and performance depend on your machine. If the native library is missing, restore the complete package. If graphics initialization fails, check your OpenGL driver. See THIRD_PARTY.md and the included licenses for engine notices.
