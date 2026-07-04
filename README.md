<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Indian Calorie Tracker (AaharSutra)

Track calories for Indian foods, calculate daily calorie needs, log meals + weight, and view summaries/analytics.

This repo contains everything you need to run the app locally.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
   (Not required for this version) If you add an AI backend later, you can set keys in [.env.local](.env.local).
2. Run the app:
   `npm run dev`

## Backend (Node.js + MySQL)

A minimal Express backend is provided in the `server/` folder. See [server/README.md](server/README.md#L1) for setup and SQL schema.

Start the backend (after creating `.env` and DB):

```bash
cd server
npm install
npm run dev
```
