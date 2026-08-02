# 📋 SpashtCare Submission Readiness Verification Plans (PLANS.md)

This document tracks verification plans and acceptance criteria for all 10 key audit items required for a successful deployed presentation.

## 🏁 Verification Milestones & Status

---

### Milestone 1: CORS / Cross-Origin Integrity
- **Acceptance Criteria**: Express CORS policy must explicitly allowlist the production Vercel domain (`https://mr-care-taker-client.vercel.app`), Vercel review previews (`*.vercel.app`), and local development ports (`http://localhost:5173`, `http://localhost:3000`). Wildcard/empty default CORS must not be used in production.
- **Status**: **Completed** (Implemented custom CORS validator in [packages/server/src/index.ts](file:///c:/Users/WELCOME/Mr.CareTaker/packages/server/src/index.ts#L23-L38)).

---

### Milestone 2: Render Cold-Start Exposure
- **Acceptance Criteria**: Backend must have lightweight health checks (`/healthz` and `/api/ping`). The client must handle slow response timeouts and loading/error states gracefully.
- **Status**: **Completed** (Added health check endpoints and loading spinner/error fallbacks to [EmergencyCard/index.tsx](file:///c:/Users/WELCOME/Mr.CareTaker/packages/client/src/screens/EmergencyCard/index.tsx#L59-L88)).

---

### Milestone 3: DB Resiliency & Auto-Seeding
- **Acceptance Criteria**: If the database file `spashtcare.json` is missing or has no patient entries on boot, the system must trigger auto-seeding to prevent clinical demo data loss on ephemeral web-service redeploys.
- **Status**: **Completed** (Integrated auto-seeding in [packages/server/src/db/index.ts](file:///c:/Users/WELCOME/Mr.CareTaker/packages/server/src/db/index.ts#L49-L62)).

---

### Milestone 4: Licensing
- **Acceptance Criteria**: Standard MIT License file exists at the root and is linked in the README.
- **Status**: **Completed** (Standard [LICENSE](file:///c:/Users/WELCOME/Mr.CareTaker/LICENSE) file added at repository root).

---

### Milestone 5: Config & Environment Variable Alignment
- **Acceptance Criteria**: All `process.env.X` references must match the variables listed in the README and `.env.example`.
- **Status**: **Completed** (Aligned `.env.example` and `README.md` and added `WHATSAPP_RECIPIENT_PHONE`).

---

### Milestone 6: Secrets Hygiene
- **Acceptance Criteria**: No private keys or `.env` files with active API credentials committed in the repository git history.
- **Status**: **Completed** (Verified `.env` is omitted and has never been committed).

---

### Milestone 7: Codex-Usage Evidence
- **Acceptance Criteria**: Detailed agent/human pairing narrative documentation (`AGENTS.md`) is available at the root.
- **Status**: **Completed** (Created [AGENTS.md](file:///c:/Users/WELCOME/Mr.CareTaker/AGENTS.md) detailing project milestones).

---

### Milestone 8: Tunnel & Local Webhook Cleanliness
- **Acceptance Criteria**: ngrok/tunnel scripts (`start_ngrok.js`, `start_tunnel.js`) must not be referenced or run in the production workspace lifecycle.
- **Status**: **Completed** (Verified to be dev-only and documented in the README).

---

### Milestone 9: Clean Compilation Build Check
- **Acceptance Criteria**: Fresh `npm run build` compilation across client and server workspaces succeeds with zero compilation errors.
- **Status**: **Completed** (Verified that `npm run build` succeeds).

---

### Milestone 10: Client Endpoint URL & Error wrapping
- **Acceptance Criteria**: All client fetch calls must be wrapped with `getApiUrl` to prevent 404 router failures on static hosting. All calls must have error catch blocks.
- **Status**: **Completed** (Wrapped all client screens in `getApiUrl` and verified backend controller catches).
