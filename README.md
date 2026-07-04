<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e98cdc0f-2093-4b8b-82c5-2b7cf0915f2e

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend (Node.js + MySQL)

A minimal Express backend is provided in the `server/` folder. See [server/README.md](server/README.md#L1) for setup and SQL schema.

Start the backend (after creating `.env` and DB):

```bash
cd server
npm install
npm run dev
```
