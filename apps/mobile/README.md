# Don't Text Your Ex — Expo app

Shared **web / iOS / Android** shell (Expo SDK 58 + Expo Router).

## Run

```bash
cp .env.example .env   # add restricted Firebase web config
npm install
npx expo start
```

Then press `w` for web, or scan with Expo Go for device.

## Layout

| Path | Purpose |
|---|---|
| `app/(tabs)/` | Today, Plan, SOS, Vault, Checklist |
| `app/(auth)/` | Welcome, sign-in, sign-up, guest upgrade |
| `app/comments.tsx` | Live feedback feed (writes `uid`) |
| `src/lib/auth.ts` | Email/password, anonymous, link/upgrade, reset |
| `src/lib/firebase.ts` | Public Firebase config (no privileged keys) |
| `src/lib/crisis.ts` | 988 / Crisis Text Line copy |

Legacy GitHub Pages demo remains at the repo root (`index.html`).

Firestore rules: `../../firebase/firestore.rules` — deploy from Console/CLI after Pages serves the Phase 2 HTML (see root README).
