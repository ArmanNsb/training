# Training — one-owner cloud sync (no website account)

This package is configured for the existing GitHub Pages site:
https://armannsb.github.io/training/

Supabase project URL and the public publishable key are already set in `cloud-config.js`. The publishable key is intended for browser code. No owner code or secret API key is included in this package.

## Already completed in Supabase
- Project `Training` exists.
- Table `public.training_owner_records` exists with RLS enabled.
- Edge Function `training-sync` is deployed.
- Edge Function custom secrets should include:
  - `OWNER_SYNC_KEY`: a private random code of at least 32 characters. Save it privately; you'll enter the same code on your phone and computer.
  - `ALLOWED_ORIGIN`: exactly `https://armannsb.github.io` (no `/training/`).

## Next required step: add the server-side database key
The function code expects a Supabase **secret API key** named exactly `training_sync`.
1. In Supabase, open **Project Settings → API Keys**.
2. In the Publishable and secret API keys area, create a new **secret** key named `training_sync`.
3. Keep its `sb_secret_...` value private. Do not send it in chat and do not put it in GitHub. Supabase injects named secret keys into the Edge Function environment under `SUPABASE_SECRET_KEYS`.

Do not create an Edge Function custom Secret named `SUPABASE_SECRET_KEYS`; Supabase manages that environment variable automatically.

## Publish the website files
1. Before the first sync, open your current site and use Settings → Back up to download a JSON backup of existing workouts.
2. Download and extract this ZIP.
3. Open the `Training-Owner-Sync` folder and upload **the contents of that folder**, not the folder itself and not the ZIP, to the root of `https://github.com/ArmanNsb/training`.
4. Replace the existing files when GitHub asks, then commit the changes.
5. Wait for GitHub Pages to deploy. The service worker cache version was bumped for this release.

The public `cloud-config.js` contains only the project URL and Publishable key. Never add `OWNER_SYNC_KEY`, any `sb_secret_...` key, or a `service_role` key to browser files or GitHub.

## Connect your devices
1. Open https://armannsb.github.io/training/ on your current device.
2. Open Settings → Cloud sync, paste the private `OWNER_SYNC_KEY` value and choose **Connect this device**.
3. Repeat on the other device with the exact same private code.
4. Test with a harmless change and confirm it appears on both devices. Keep the JSON backup until sync is verified.

This is a single-owner convenience setup, not a multi-user account system. Anyone who obtains the private owner code can access the sync API, so keep it private. Browser storage remains a local copy; the cloud copy helps recover if a device's browser data is cleared. Keep regular JSON backups too.
