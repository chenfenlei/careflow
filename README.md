# CareFlow MVP (upgraded vertical slice)

This version upgrades the original trustworthy UI demo into a more realistic post-discharge workflow:

- richer task cards with direct action metadata (portal, phone, directions, prep list, call script)
- document ingestion flow from pasted text or `.txt` upload
- backend summarize route with two modes:
  - **real LLM mode** if `OPENAI_API_KEY` is set
  - **deterministic fallback mode** if no API key is set
- local persistence in the browser via `localStorage`
- medication change status (`new`, `continued`, `changed`, `needs_review`)

## Important note

This is still an MVP. It does **not** yet include:

- PDF OCR
- user auth
- a production database
- HIPAA-compliant infrastructure
- verified provider directory integrations

## Run locally

```bash
npm install
npm run dev
```

## Optional: enable real LLM extraction

Create `.env.local`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Then the `/api/summarize` route will call OpenAI. Without these variables, the route still works using a fallback parser.

## Suggested next production steps

1. Add auth + database (Supabase/Postgres is a good first setup)
2. Add OCR for PDFs/images
3. Add document review/approval state backed by DB
4. Add provider directory lookup or saved provider records
5. Add mobile notifications / React Native or Expo app
