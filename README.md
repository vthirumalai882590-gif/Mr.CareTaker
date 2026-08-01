# 🏥 SpashtCare — AI-Powered Multi-Doctor Medication Reconciliation & Clinical Safety Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.19-000000.svg)](https://expressjs.com/)
[![Groq AI](https://img.shields.io/badge/LLM-Groq%20Llama%203.3%2070B-orange.svg)](https://groq.com/)
[![Google Gemini](https://img.shields.io/badge/Vision%20OCR-Gemini%20Flash-4285F4.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **SpashtCare** (meaning *Clear Care*) is an enterprise-grade, multimodal clinical safety and AI medication reconciliation platform designed to eliminate polypharmacy risks, therapeutic duplications, adverse drug-drug interactions (DDI), and illegible handwritten prescription errors for chronic patients across India.

---

## 🌟 Executive Summary & Clinical Mission

In multi-doctor healthcare environments, elderly chronic patients frequently receive overlapping prescriptions from independent specialists (e.g., Cardiologist, Diabetologist, Neurologist). Without centralized reconciliation, patients face severe clinical hazards:
- **Therapeutic Duplications** (e.g., dual ACE inhibitors prescribed under different brand names).
- **Adverse Drug-Drug Interactions (DDI)** (e.g., NSAID + ARB causing acute kidney injury).
- **Illegible Handwritten Prescriptions** causing dosage misinterpretations.
- **Refill Stock-Outs & Non-Adherence** leading to preventable hospital readmissions.

**SpashtCare** solves these critical hazards by combining **Multimodal AI Vision OCR (Google Gemini Flash)**, **Clinical Intelligence Reasoning (Groq Llama 3.3 70B)**, and **Interactive Caregiver Automation (Meta WhatsApp Cloud API)** into an intuitive, senior-friendly platform.

---

## 🔥 Key Architectural Features

### 1. 🔍 Quantified Trust Receipt & XAI Audit Trail
- **Multimodal OCR Extraction**: Scans handwritten or printed prescriptions (`.jpg`, `.png`, `.pdf`) in real time.
- **Verbatim vs. Normalized Parsing**: Side-by-side comparison of verbatim raw OCR text vs. standardized INN drug names and normalized frequencies.
- **XAI Step-by-Step Reasoning**: Full explainable AI audit logs displaying confidence metrics, database cross-checks, and safety boundary thresholds.

### 2. 🎞️ Extraction Replay & 4-Step FSM Retry Inspector
- **Interactive Scrubber**: Step-by-step playback of the AI extraction pipeline.
- **Targeted Re-Prompting FSM**: Automatically triggers zoom/crop retry loops when OCR confidence drops below 80% (e.g., resolving ambiguous handwritten text like *"Tab Telm???tan 40mg"* to *"Telmisartan 40mg"*).

### 3. 🧬 Predictive Pathophysiology & Organ Risk Engine
- **Organ System Vulnerability Scoring**: Evaluates patient biomarkers (e.g., eGFR, Serum Creatinine, HbA1c, LFT) to predict organ-specific risks:
  - **Renal & Microvascular Risk** (Hyperkalemia & Nephrotoxicity checks).
  - **Cardiovascular Risk** (Orthostatic hypotension & Bradycardia auditing).
  - **Metformin-Induced B12 Deficiency** (Long-term Metformin neuropathy screening).
- **Preventative Action Plans**: Automated recommendations for lab screening schedules and dosage adjustments.

### 4. 💬 WhatsApp Multi-Doctor Studio & Meta Cloud API
- **Multilingual Support**: Real-time translation across 5 Indian languages (**English, Hindi, Tamil, Telugu, Kannada**).
- **Interactive Messaging**: Caregivers and patients can send prescription photos directly over WhatsApp for instant AI analysis.
- **Automated Refill Nudges**: Scheduled alerts sent to caregivers before medication stock runs out.

### 5. 💊 Jan Aushadhi Generic Substitute Finder
- **Cost Savings Calculator**: Matches expensive branded medications with quality-certified PMBJP Jan Aushadhi generic equivalents, showing instant percentage cost reductions.

### 6. 🎴 Emergency Medical Card Generator
- **Auto-Generated Lock Screen (1080×1920)**: High-visibility emergency graphics displaying primary conditions, baseline vitals, emergency contacts, and ABHA ID.
- **Printable Wallet Card Layout**: Standard 3.375" × 2.125" ID card format ready for single-click PDF/SVG download.

### 7. 👴 Senior-Friendly Patient Simple Mode
- **High-Contrast Typography**: Ultra-legible interfaces with voice-over audio synthesis via browser SpeechSynthesis API.
- **1-Tap Caregiver Escalation**: Direct WhatsApp emergency trigger for missed doses or acute symptoms.

---

## 🛠️ Technology Stack & Architecture

### **Frontend (`packages/client`)**
- **Framework**: React 18 + TypeScript 5 + Vite 5
- **Styling**: Vanilla CSS Design Tokens + TailwindCSS 3 + Dark/Light Theme System
- **Icons**: Lucide React
- **Audio & Accessibility**: Web Speech API (`SpeechSynthesisUtterance`)

### **Backend (`packages/server`)**
- **Runtime**: Node.js + Express.js + TypeScript
- **Database**: SQLite (`better-sqlite3`) with schema migrations & seed data
- **File Processing**: Multer (Encrypted local file upload handler)
- **Fuzzy Search & Matching**: Fuse.js (Drug dictionary matching)
- **Scheduler**: Node-Cron (Automated refill alerts & cron schedules)

### **AI & Third-Party APIs**
- **LLM Engine**: Groq API (`llama-3.3-70b-versatile`)
- **Vision OCR Engine**: Google Generative AI (`gemini-1.5-flash`)
- **Messaging**: Meta WhatsApp Cloud API Webhook Protocol
- **Health Standards**: Ayushman Bharat Digital Mission (ABDM / ABHA Health ID)

---

## 📁 Repository Structure

```
Mr.CareTaker/
├── packages/
│   ├── client/                      # React 18 + Vite Frontend App
│   │   ├── src/
│   │   │   ├── components/          # Reusable UI Components (NavBar, Modals, Banners)
│   │   │   ├── context/             # ThemeContext & Application State Providers
│   │   │   ├── screens/             # 12 Core Clinical Feature Screens
│   │   │   │   ├── CaseOverview/    # Patient Clinical Profile & Vitals
│   │   │   │   ├── TrustReceipt/    # Quantified Trust Receipt & XAI Audit
│   │   │   │   ├── ExtractionReplay/# 4-Step FSM OCR Retry Inspector
│   │   │   │   ├── PredictiveRisk/  # Future Disease & Pathophysiology Risk Predictor
│   │   │   │   ├── AdherenceTracker/# Relative 7-Day Adherence & Stock Burndown
│   │   │   │   ├── MedicationHistory/# Multi-Doctor Reconciliation Log & Uploader
│   │   │   │   ├── WhatsAppSim/     # Meta Cloud WhatsApp Multi-Doctor Studio
│   │   │   │   ├── EmergencyCard/   # Lock Screen & Wallet SVG Card Generator
│   │   │   │   ├── GenericSubstitute/# Jan Aushadhi Cost Savings Finder
│   │   │   │   ├── PatientSimpleMode/# Senior-Friendly Voice Mode
│   │   │   │   ├── SafetyFlags/     # DDI & Allergy Flag Management
│   │   │   │   └── TimelineView/    # Longitudinal Health Timeline
│   │   │   ├── patientDataMap.ts    # Comprehensive Multi-Patient Clinical Cases
│   │   │   ├── translations.ts      # Multi-Lingual Dictionary (5 Languages)
│   │   │   └── App.tsx              # Main Shell with Navigation & Patient State
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── server/                      # Express.js + TypeScript API Backend
│       ├── src/
│       │   ├── db/                  # SQLite Database Initialization & Seed Scripts
│       │   ├── routes/              # Express API Route Controllers
│       │   │   ├── ai.ts            # Groq Llama 3.3 Clinical Reasoning Endpoint
│       │   │   ├── documents.ts     # Gemini Vision OCR Extraction Pipeline
│       │   │   ├── cases.ts         # Patient Case Management & Emergency SVG Generator
│       │   │   └── whatsapp.ts      # Meta WhatsApp Cloud API Webhook Handlers
│       │   ├── services/            # LLM & Vision Service Wrappers
│       │   └── index.ts             # API Server Entry Point
│       └── package.json
│
├── .gitignore                       # Production Security Exclusions
├── package.json                     # Monorepo Workspace Configuration
└── README.md                        # Project Documentation
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/SpashtCare.git
cd SpashtCare

# Install all monorepo dependencies (client & server)
npm run install:all
```

### 2. Configure Environment Variables
Create a `.env` file in the **repository root** (SpashtCare/.env):
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
WHATSAPP_VERIFY_TOKEN=spashtcare_webhook_verify_token
WHATSAPP_API_TOKEN=your_whatsapp_cloud_api_token_here
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id_here
WHATSAPP_RECIPIENT_PHONE=your_whatsapp_recipient_phone_number_here
FIREBASE_PROJECT_ID=spashtcare-firebase-project
FIREBASE_CLIENT_EMAIL=your_firebase_client_email@spashtcare.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
```
> [!NOTE]
> The backend server loads the `.env` configuration from the workspace root. The default ports are **3001** for the Express API server and **5173** for the Vite React frontend.

### 3. Seed Database
```bash
# Populate local JSON database with clinical cases and drug registries
npm run seed
```
> [!TIP]
> **Database Self-Seeding**: The backend automatically self-seeds itself with demo data on startup if the database file `spashtcare.json` is missing or empty. Manual seeding is optional.

### 4. Run Development Server
```bash
# Launches Express API Server (Port 3001) & Vite React Client (Port 5173) concurrently
npm run dev
```
Open your browser and navigate to **`http://localhost:5173`**.

---

### 🌐 Local WhatsApp Webhook Testing
`start_ngrok.js`, `start_tunnel.js`, and `ngrok_url.txt` are developer utility scripts used exclusively for establishing tunnels to local webhooks during WhatsApp API testing. They are dev-only and have no role in the production deployment pipeline.

### 🚀 Render Free-Tier Production Notice
The production backend is hosted on Render's free tier (`mr-caretaker.onrender.com`). Render automatically spins down the service after 15 minutes of inactivity. When visiting the live demo for the first time, please allow 30–60 seconds for the backend container to wake up. We recommend pinging the server's health check endpoints (`/healthz` or `/api/ping`) a few minutes before starting a live presentation.

---

## 🛡️ API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/documents/upload` | Uploads prescription photo & executes Gemini Vision OCR extraction. |
| `POST` | `/api/ai/chat` | Executes Groq Llama 3.3 clinical reasoning query with patient context. |
| `POST` | `/api/ai/discharge-summary` | Generates official AI discharge summary & reconciliation note. |
| `GET` | `/api/cases` | Retrieves list of all active patient profiles. |
| `POST` | `/api/cases` | Creates a new patient clinical profile. |
| `GET` | `/api/cases/:id/emergency-card-svg` | Renders dynamic SVG Emergency Medical Card (`mode=lockscreen\|wallet`). |
| `POST` | `/api/whatsapp/webhook` | Receives incoming WhatsApp messages & prescription photos. |

---

## 🧪 Verification & Build Commands

```bash
# Run TypeScript compilation check across packages
npm run build --workspace=packages/client
npm run build --workspace=packages/server
```

---

## ⚖️ Clinical Safety Boundary & Governance Notice

> **IMPORTANT DISCLAIMER**: SpashtCare is an artificial intelligence-assisted clinical decision support tool designed to assist doctors, pharmacists, and caregivers. **It does not provide independent medical advice or diagnostic prescriptions.** All AI-extracted fields, drug interaction flags, and dosage normalization recommendations MUST be confirmed with a licensed medical practitioner or registered pharmacist.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
