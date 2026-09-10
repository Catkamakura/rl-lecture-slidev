# RL lecture in Slidev

**79 slides: 48 main lecture slides and 31 optional appendix/reference slides.**

The lecture defines the MDP and objective, introduces policy representations, demonstrates REINFORCE, and builds a short bridge through baselines and critics to PPO. REINFORCE remains the main worked algorithm.

## Hosted presentation

- [Open the lecture](https://catkamakura.github.io/rl-lecture-slidev/)
- [Course map](https://catkamakura.github.io/rl-lecture-slidev/#/2)
- [Private source repository](https://github.com/Catkamakura/rl-lecture-slidev)

The repository is private. The GitHub Pages presentation is public and excludes presenter notes. Notes remain in the private source and the local presentation build.

GitHub Pages publishes the prebuilt `docs/` directory on `main`. To publish an edit:

```sh
npm ci
npm run build:pages
git add slides.md components lib styles scripts global-bottom.vue docs
git commit -m "Update RL lecture"
git push origin main
```

Stage other edited source/configuration files too, if applicable. GitHub republishes after the push. `build:pages` excludes notes, uses `/rl-lecture-slidev/` as the base path, and uses hash routing so direct slide links work on a static host. The local `npm run build` still creates `dist/` with presenter notes for `node serve.mjs`.

For a fresh Git clone, run `npm ci && npm run build` before using the local server. The downloadable ZIP includes that local build already.

## Present

Extract the ZIP. With Node.js installed, double-click **START-PRESENTATION.cmd** on Windows, or run:

```sh
node serve.mjs
```

Open the URL printed in the terminal. The included `dist/` build runs locally without package installation or internet access. The server tries ports 3030–3040. Keep the terminal open while presenting; stop with Ctrl+C.

- Arrow keys advance slides.
- The footer jumps to each section and shows progress within it.
- **Map** opens the clickable course roadmap.
- The appendix index links directly to each proof topic.
- Hover at the upper right for Slidev's own presentation controls.
- Add `/presenter/` to the URL for speaker notes.

## Verification and claim audit

[REVISION_NOTES.md](REVISION_NOTES.md) maps the latest requested edits to their new pages and sources. [MDP_SOURCE_MAP.md](MDP_SOURCE_MAP.md) documents the current CS443-based MDP section. [CLAIM_AUDIT.md](CLAIM_AUDIT.md) preserves the earlier claim corrections. Run `node scripts/verify-lecture.mjs` to recompute the examples. This audit and presenter notes stay in the private source; the public build contains the lecture only.

## Interactive teaching material

| Slide | Interaction |
|---:|---|
| 2 | Course roadmap with section links |
| 8 | Navigate the discounted grid, including the absorbing goal |
| 10 | Vary a specified policy and calculate its expected return |
| 14 | Change gamma and inspect weighted route rewards |
| 18 | Select a grid state; inspect and edit its policy row with shaded action arrows |
| 22 | Follow state features, scores, and softmax probabilities with the same arrow display |
| 23 | Compare model-based, value-based, and policy-gradient routes |
| 27 | Change theta and see expected action counts for exploration |
| 31 | Calculate three possible sampled REINFORCE updates |
| 33 | Run actual sampled REINFORCE training |
| 48 | Compare clipping with positive and negative advantages |

## Edit

Edit `slides.md`; its HTML comments contain speaker notes. The Vue components and `lib/` modules are editable. `lib/course-map.mjs` stores section boundaries and links; update it if inserting or moving slides.

```sh
npm ci
npm run dev
```

After editing, refresh the included site:

```sh
npm run build
```

Node.js 24 was used for this build. `INSTRUCTOR_GUIDE.md` explains the teaching sequence and demo results. `SLIDE_MAP.md` lists all slides. No PDF is required or included.

## Attribution

The lecture draws on the supplied Lecture 14, Nan Jiang's CS 443 materials, Sutton and Barto, Williams's REINFORCE paper, and the TRPO/PPO papers. Sources and original lecture credits appear in the deck and notes. The supplied lecture is marked CC BY-NC-SA 4.0; that license is retained for its adaptation where applicable. External sources retain their own terms.
