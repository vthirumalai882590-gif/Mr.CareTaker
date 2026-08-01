# Agents & Build Process

## Overview
SpashtCare is a clinical safety and medication reconciliation platform designed to resolve drug interactions, therapeutic duplications, and handwriting ambiguities for chronic care patients.

## Build Process
The repository was built through collaborative interaction. The core Express server schema, JSON-compatible database module, Gemini vision OCR integration, safety reasoning routes, and React interface screens were scaffolded and implemented during developer pairing sessions. Pre-submission audits, CORS configuration audits, and workspace build tests were verified using Antigravity, while specific fixes and documentation changes were structured and committed as Codex operations.

## Codex Contributions
- f84faa1 - fix: configure custom CORS allowlist and Render cold-start ping routes
- 42bb594 - fix: implement automatic database self-seeding on empty boot
- 8117ca3 - fix: wrap relative client API routes with getApiUrl to allow cross-origin Vercel deployment
- 0ae5f11 - fix: implement image loader states and errors on Emergency Card preview
- ee292e2 - docs: add MIT LICENSE and align README env instructions with .env.example

## Verification
- Compilation check: Ran npm run build across all workspaces. The server tsc and client tsc compiled cleanly with zero errors.
- Database seeding: Deleted the local spashtcare.json file and booted the server index entry. The console confirmed detection of an empty database and executed the seeder successfully.
- CORS: Confirmed the allowedOrigins array in server index.ts explicitly lists the Vercel production origin.
- Routing: Wrapped relative paths with getApiUrl in App.tsx, WhatsAppSim, Settings, Governance, CaseOverview, and AdherenceTracker.
- Emergency Card preview: Added state tracking hooks for image loading and error fallbacks in EmergencyCard/index.tsx.
