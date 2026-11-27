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
| `app/(auth)/` | Welcome, sign-in, sign-up stubs |
| `src/lib/firebase.ts` | Env-based Firebase init (no privileged keys) |
| `src/lib/crisis.ts` | 988 / Crisis Text Line copy |

Legacy GitHub Pages demo remains at the repo root (`index.html`). Do not remove it in Phase 1.

Firestore rules: `../../firebase/firestore.rules`.
