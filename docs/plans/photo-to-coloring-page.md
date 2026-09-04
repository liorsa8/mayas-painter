# Feature Plan: Turn a Photo Into a Coloring Page

**Status:** Not implemented. This is a design plan for future work, written up per user request so it isn't lost between sessions.

## Idea

Let someone upload a personal photo (e.g. a family picture). The backend runs it through an image-generation model with a prompt that converts it into black-and-white coloring-book line art, matching the style already used for the hand-picked "Family" category templates (see `family_mom_kids.png`, `family_girl.png`, `family_siblings.png` in `public/templates/` — those were generated externally with Gemini and dropped in manually; this feature would automate that step).

## Why this needs new infrastructure

The app today ([App.tsx](../../src/App.tsx)) is a 100% static, client-only Vite/React SPA — no server, no API keys, no user accounts. Calling an image-generation API requires a secret API key, which can never be shipped to the browser. So this feature needs, at minimum, a small backend endpoint.

**Recommendation:** a single serverless function (e.g. Vercel/Cloudflare function), not a full backend service. It receives the uploaded photo, calls the image model server-side (key stays server-side), and returns the generated line-art image to the client. Keeps hosting/complexity minimal for what's currently a personal single-user app.

## Where generated images get saved

**Recommendation for v1: nowhere on the server.** The function is stateless — it converts and returns the image in the response; the browser then stores it exactly like everything else in this app already works (client-side, e.g. `IndexedDB`, alongside the existing template list / undo history in `App.tsx`). No photo or generated image is retained server-side after the request completes.

- Pro: simplest possible backend (no storage/database to run or pay for), best privacy story (family photos aren't sitting on a server), no accounts needed.
- Con: the result only lives on the one device/browser that generated it — clearing site data or switching devices loses it, and it can't be shared to another device automatically.

**If cross-device / shared access is wanted later:** upgrade path is a cheap blob store (Cloudflare R2 or Supabase Storage) plus some lightweight way to identify "this family" (even just a simple shared passcode/device-link, not necessarily full auth). This is a meaningfully bigger step (introduces accounts) — only worth it if v1's client-only storage turns out to be too limiting in practice.

## Other things to decide before building

- **Cost & rate limiting:** every conversion is a paid API call. Need some cap (e.g. N conversions per day) to avoid surprise bills, since there's no auth to hang per-user limits off of yet — likely IP-based or a simple client-side counter to start.
- **Latency/UX:** image generation takes several seconds; needs a loading state (the app already has a confetti/animation pattern to build on).
- **Content moderation:** since this accepts arbitrary user-uploaded photos, the backend call should include basic safety filtering (most image APIs offer this as a flag) before returning results — this is a kids' app.
- **Prompt:** start from the prompt template already worked out in this project's conversation history (coloring-book line art, no shading, thick outlines) adapted for image-to-image rather than text-to-image use.

## Rough implementation steps (for whenever this is picked up)

1. Pick the image API/model (Gemini image generation, same family that produced the existing Family templates, is the natural first choice since we already have working prompt language for it).
2. Stand up one serverless function: accepts an uploaded image, calls the model with the conversion prompt, returns the resulting image (base64 or a short-lived URL).
3. Add an "upload your photo" entry point in the UI (likely in `TemplateModal.tsx`, as a new option alongside picking an existing template).
4. Store the returned image client-side and let the user color it exactly like any other template — the rendering/export pipeline (`App.tsx`'s `saveImage`) already works with any raster image, no changes needed there (confirmed when the Family category PNGs were added).
5. Add basic rate limiting and a loading indicator.
6. Decide later, based on real usage, whether client-only storage is enough or cross-device persistence is worth the added accounts/storage complexity.
