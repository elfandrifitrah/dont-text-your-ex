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
| `app/(tabs)/` | Today, Plan, SOS, Vault, Checklist — working, saved on device |
| `app/(auth)/` | Continue without an account. Email sign-in is not connected yet |
| `src/lib/analyzeDraft.ts` | On-device SOS verdict (draft is not stored unless saved to the vault) |
| `src/lib/progress.tsx` | Streak, mood, vault, checklist via AsyncStorage |
| `src/lib/firebase.ts` | Env-based Firebase init (no privileged keys) |
| `src/lib/crisis.ts` | 988 / Crisis Text Line copy |

Day 1 is today until you personalize the plan. Progress survives refresh. SOS stays unlimited and on-device — there is no paywall in this app.

```bash
npm test
npx tsc --noEmit
```

Legacy GitHub Pages demo remains at the repo root (`index.html`).

Firestore rules: `../../firebase/firestore.rules`.
