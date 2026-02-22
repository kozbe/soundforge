# SoundForge Roadmap

## Current State

SoundForge is an interactive, browser-based music production learning platform with a 16-step sequencer, 8 instruments, an interactive piano, genre presets, and educational content. Built with React 19 + TypeScript + Vite + Web Audio API.

---

## Priority 1: Save & Share + URL Encoding
**Status: DONE**

- Save patterns to localStorage with names
- Load saved patterns from a modal
- Delete saved patterns
- Share patterns via URL (compact hex-encoded grid state)
- Auto-load shared patterns from URL on page load
- Toast notifications for user feedback

---

## Priority 2: Guided Lessons with Challenges

Transform the static "Learn" tab into an interactive lesson system.

- **Step-by-step challenges**: "Create a basic kick pattern", "Add a hi-hat on the off-beat", "Build a full house beat" with pass/fail detection
- **Unlock system**: Complete Lesson 1 to unlock Lesson 2, giving a sense of progression
- **Ear training**: "Which pattern is playing?" or "Match this beat"
- **Progress persistence**: Save lesson progress to localStorage

---

## Priority 3: Effects (Reverb, Delay, Filter)

Add real mixing tools to make patterns sound professional and teach real production concepts.

- **Reverb**: Convolution reverb or algorithmic reverb per-track
- **Delay**: Tempo-synced delay with feedback control
- **Filter**: Low-pass / high-pass with cutoff knob per-track
- **Master effects**: Global reverb/delay send knobs
- Web Audio API natively supports all of these

---

## Priority 4: Pattern Chaining / Song Mode

Let users create multi-bar arrangements instead of a single loop.

- Create **multiple patterns** (A, B, C, D)
- **Arrangement timeline**: Chain patterns into a song (e.g., A-A-B-A-B-C-A)
- **Copy/paste patterns**: Duplicate and modify existing patterns
- Teach song structure concepts (intro, verse, chorus, bridge, outro)

---

## Priority 5: Better Samples / Sound Packs

Replace or supplement synth-generated sounds with real audio samples.

- **Sample-based drums**: Load real kick/snare/hat recordings via AudioBuffer
- **Genre packs**: Trap, Lo-fi, House, Techno, Drum & Bass
- More instrument variety: 808 bass, plucks, vocal chops, risers
- Allow users to upload their own samples

---

## Priority 6: Export Audio

Let users save and share their creations as audio files.

- **Render to WAV**: Offline rendering using OfflineAudioContext
- **MP3 export**: Client-side encoding
- **MIDI export**: For importing into DAWs
- Show render progress

---

## Priority 7: Gamification

Make the learning experience sticky with progression mechanics.

- **XP / points** for completing challenges
- **Achievements**: "First Beat", "Full Arrangement", "Used All 8 Scales", "Shared a Pattern"
- **Daily challenge**: "Make a beat using only 3 instruments"
- **Streak tracking**: Encourage daily use

---

## Priority 8: Community Features

Only worth building once there's an active user base.

- **Pattern gallery**: Browse what others have made
- **Remix**: Load someone else's pattern and modify it
- **Upvotes** on community patterns
- **User profiles**: Track creations and achievements

---

## Other Ideas

- **Genre breakdowns**: Interactive explainers for what makes a beat sound like hip-hop vs house vs techno
- **Glossary**: Searchable dictionary of music production terms
- **DAW bridge**: "Ready for the next step? Here's how this translates to Ableton/FL Studio"
- **Visual feedback**: Waveform display per instrument, animations on beat hits
- **Panning**: Left/right stereo placement per track
- **Dark/light theme toggle**
- **Mobile-optimized touch interface**
- **Undo/redo**: Step-by-step history for pattern editing
