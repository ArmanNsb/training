TRAINING — ONE-OWNER CLOUD SYNC (NO WEBSITE ACCOUNT)

This ZIP is configured for https://armannsb.github.io/training/ and the Supabase project already created.

BEFORE UPLOADING:
1. Add a Supabase secret API key named exactly training_sync in Project Settings → API Keys. Keep its sb_secret value private.
2. Make sure Edge Function Secrets OWNER_SYNC_KEY is a private random code at least 32 characters long, and ALLOWED_ORIGIN is exactly https://armannsb.github.io.
3. Back up current workouts from Settings → Back up before first sync.

UPLOAD:
Extract this ZIP, open the Training-Owner-Sync folder, and upload its contents to the root of the existing GitHub repository. Do not upload the ZIP itself or the parent folder.

NEVER put OWNER_SYNC_KEY or any sb_secret/service_role key in GitHub or browser files. The included cloud-config.js contains only the public Project URL and Publishable key.
