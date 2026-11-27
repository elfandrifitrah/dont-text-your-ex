<p align="center">
  <img src="assets/letting-go.webp" alt="A person walking toward the sunrise while chat bubbles dissolve behind them — letting go" width="100%">
</p>

<h1 align="center">Don't Text Your Ex</h1>

<p align="center"><strong>A 30-day no-contact coach. The urge fades in 90 seconds — this helps you wait it out.</strong></p>

<p align="center">
  <a href="https://elfandrifitrah.github.io/dont-text-your-ex/"><img src="https://img.shields.io/badge/live_demo-try_it_now-success?style=for-the-badge" alt="Live demo"></a>
  <img src="https://img.shields.io/badge/Firebase-Spark_free-orange?style=for-the-badge&logo=firebase" alt="Firebase Spark free plan">
  <img src="https://img.shields.io/badge/hosted_on-GitHub_Pages-blue?style=for-the-badge&logo=github" alt="Hosted on GitHub Pages">
  <img src="https://img.shields.io/badge/build-none-lightgrey?style=for-the-badge" alt="No build step">
</p>

<p align="center">
  <a href="https://elfandrifitrah.github.io/dont-text-your-ex/">✦ Try the live demo ✦</a>
</p>

---

## What it is

The first days after a breakup are the hardest — usually around 2am, when the urge to text your ex hits hardest. **Don't Text Your Ex** is a 30-day no-contact coach that meets you in that moment instead of lecturing you the next morning.

- **SOS — "Should I send this?"** Paste a draft message and get a verdict, the exact signals it spotted (longing, apology bid, late-night, …), and a rewritten *unsent* letter — plus a 90-second breathing reset, because that's how long the urge takes to fade.
- **Today** — your no-contact streak, a daily focus, and a mood check-in.
- **Plan** — the 30 days in four phases: Wilt, Root, Bud, Bloom.
- **Vault** — unsent letters, saved instead of sent.
- **Checklist** — breakup admin: mute/unfollow, shared subscriptions, a stuff-return script, shared passwords.

## The idea in three pictures

| | | |
|---|---|---|
| <img src="assets/letting-go.webp" alt="Person walking toward sunrise" width="100%"> | <img src="assets/growth-phases.webp" alt="Plant in four stages" width="100%"> | <img src="assets/kintsugi-heart.webp" alt="Kintsugi heart" width="100%"> |
| **Letting go** — walking toward the sunrise while the chat bubbles dissolve behind you. | **Growing back** — wilted in cracked earth, then sprout, bud, bloom. The plan follows the same four phases. | **Mended, not erased** — a heart repaired with gold seams. That's what the unsent letters are. |

## 💬 Leave feedback — right in the demo

Anyone can leave critique, advice or ideas on the live demo. No account UI: the page signs in anonymously, you pick a nickname, and posts include your Firebase `uid` for ownership. Every commenter gets their own colour and initials; your own posts show up marked as you. Comments appear live for everyone.

Powered by Firebase (Firestore + anonymous auth) on the free Spark plan. The API key in the page is a public web key by design — protect the project with Firestore rules, Auth settings, and API key restrictions (not secrecy).

## Price concept

**$29 one-time** ($19 founding offer for the first 50). First SOS check free. This demo is a prototype — it takes no payments and stores nothing except the comments above.

## How it's built

**Live demo (unchanged):** one static HTML file on GitHub Pages. No build step for that path.

| Piece | Service | Cost |
|---|---|---|
| The page | GitHub Pages (`index.html`) | $0 |
| Live comments | Firebase (Firestore + anonymous auth) | $0 — Spark plan |
| Code | This repo | $0 |

Open `index.html` in a browser, or visit the live demo linked above.

### Multiplatform upgrade (in progress)

Expo (React Native) app for **web + iOS + Android** lives in `apps/mobile/` (email/password + guest auth, comments with `uid`). Firestore rules live in `firebase/`. Root `index.html` remains the GitHub Pages demo.

```bash
cd apps/mobile
cp .env.example .env   # optional override; public demo config is already in app.json
npm install
npx expo start
```

End-to-end plan: `/cursor/stores/self/docs/end-to-end-plan.md`

### Firebase Console deploy (manual — not done by CI)

After this repo’s Phase 2 changes are live on GitHub Pages (so `index.html` already writes `comments.uid` and no longer writes `visits`):

1. **Authentication → Sign-in method:** enable **Email/Password**; keep **Anonymous** enabled.
2. **Authorized domains:** add any Expo web / custom domains you use.
3. Deploy rules + indexes from the repo:

```bash
cd firebase
firebase use dont-text-your-ex
firebase deploy --only firestore:rules,firestore:indexes
```

Until step 3 runs, the cloud project may still be on older/looser rules. Do **not** deploy the new rules before Pages is serving the updated `index.html`, or comment posts from the live demo will fail.

## A note

This is not therapy. If you are in crisis, call or text **988** (US Suicide and Crisis Lifeline) or text **HOME** to **741741** (Crisis Text Line).
