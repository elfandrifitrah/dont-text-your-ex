# Firebase config (Don't Text Your Ex)

## Files

| File | Purpose |
|---|---|
| `firestore.rules` | Deny-by-default rules (users, vault, checklist, comments; `visits` locked) |
| `firestore.indexes.json` | Composite indexes |
| `firebase.json` | CLI entry |

## Deploy (after Phase 2 Pages cutover)

Legacy `index.html` now writes `uid` on comments and does **not** write `visits`. Once that HTML is live on GitHub Pages:

```bash
firebase login
firebase use dont-text-your-ex
firebase deploy --only firestore:rules,firestore:indexes
```

Also in Console: enable **Email/Password** Auth; keep **Anonymous** on.

## Safety

Never commit service-account JSON or Admin SDK keys here.
