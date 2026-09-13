# ⚖️ LexiGuard AI — Intelligent Legal Document Intelligence & Access Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests: 12 Passed](https://img.shields.io/badge/Tests-12%20Passed-emerald.svg)](tests/)
[![Bundle Size](https://img.shields.io/badge/Bundle%20Size-%3C310%20KB-indigo.svg)](dist/)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-purple.svg)](#accessibility--inclusive-design)

> **Submission for the GenAI Challenge: AI for Legal Assistance & Access**  
> *Empowering citizens, tenants, freelancers, consumers, and small businesses with accessible, transparent, and actionable legal document intelligence.*

---

## 📌 1. Chosen Vertical & Problem Statement

### **Vertical**: AI for Legal Assistance & Access
Legal documents, tenancy agreements, software contracts, terms of service, and nondisclosure agreements are notoriously opaque, intimidating, and skewed in favor of enterprise drafting parties. Everyday citizens, renters, and independent contractors routinely sign agreements containing unconscionable "gotcha" clauses—such as uncapped liabilities, hidden auto-renewals, unilateral inspection rights, and total IP forfeiture—simply because hiring legal counsel is cost-prohibitive.

### **The Solution**: LexiGuard AI
LexiGuard AI bridges the legal justice gap. It combines **Google Gemini GenAI models** with a **deterministic legal heuristic rule engine** and a **client-side privacy sanitizer** to help users:
1. **Translate Legalese**: Convert dense paragraphs into 3 reading tiers (Executive TL;DR, Plain English, and ELI5).
2. **Scan for Predatory Traps**: Real-time Risk Radar (0–100 index) identifying asymmetric liabilities, auto-renewal traps, and unannounced entry riders.
3. **Compare Contracts**: Side-by-side comparative diff matrix highlighting shifted risks between baseline and revised versions.
4. **Grounded Document Q&A**: Context-grounded assistant with exact verbatim section citations to eliminate hallucinations.
5. **Actionable Negotiation**: Dynamic counter-proposal generator and polite negotiation email drafter to push back on unfair terms.
6. **Save Legal Costs**: Generate a structured **Attorney Consultation Brief** with high-priority issues and tailored questions for an attorney.

---

## 🏛️ 2. Approach & Architecture

LexiGuard AI is engineered around a **Security-First Dual-Engine Architecture**:

```
+--------------------------------------------------------------------------+
|                       LexiGuard AI Architecture                          |
+--------------------------------------------------------------------------+
                                     │
                 [User Contract / Sample Document / Upload]
                                     │
                                     ▼
                     [Client-Side PII Scrubber Engine]
          (Masks emails, phone numbers, addresses, SSNs, names)
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
       [Live Google Gemini API]        [Offline Legal Expert Engine]
      (Gemini 1.5 Flash / 2.0 Flash)    (Heuristic AST Clause Matcher)
                     └───────────────┬───────────────┘
                                     │
                                     ▼
        ┌────────────────────────────────────────────────────────┐
        │                 Core Intelligence Suite                 │
        │ • Multi-Tier Simplifier (TL;DR, Plain English, ELI5)   │
        │ • Predatory Risk Radar & Vulnerability Score (0-100)   │
        │ • Side-by-Side Clause Diff & Risk Shift Matrix         │
        │ • Grounded Q&A with Verbatim Clause Citations          │
        │ • Negotiation Email Drafter & Counter-Offer Generator  │
        │ • Obligation Tracker & Deadline Calendar               │
        │ • 1-Click Structured Attorney Consultation Brief       │
        └────────────────────────────────────────────────────────┘
                                     │
                                     ▼
        ┌────────────────────────────────────────────────────────┐
        │             Accessible & Modern User Interface          │
        │  WCAG AA Contrast | Dyslexia Font | Text-to-Speech     │
        └────────────────────────────────────────────────────────┘
```

### **Dual-Engine Reliability Principle**
- **Live Gemini AI Mode**: Connects directly to Google's official Gemini REST API (`gemini-1.5-flash`, `gemini-2.0-flash`). The user's API key is stored strictly client-side in private `localStorage` and never touches any proxy or third-party server.
- **Offline Simulation / Heuristic Mode**: If no API key is supplied, LexiGuard AI falls back automatically to its embedded expert legal knowledge base and pattern recognition engine. **Reviewers and judges can immediately test all features without needing an API key.**

---

## ⚡ 3. Key Features & How the Solution Works

### 1. Multi-Tier Legalese Simplifier
Translates any clause or entire contract into three calibrated reading levels:
- **⚡ Executive TL;DR**: 30-second bulleted executive summary of rights and liabilities.
- **🎓 Plain English**: Everyday conversational English breaking down obligations without jargon.
- **🧒 Explain Like I'm 5 (ELI5)**: Real-world playground and daily life analogies making legal concepts intuitive.
- **🔊 Integrated Text-to-Speech (Web Speech API)**: Reads complex clauses aloud with a single click.
- **📚 Interactive Legal Glossary**: Hoverable explanations of terms like *Liquidated Damages*, *Indemnification*, *Quiet Enjoyment*, *Arbitration*, and *Evergreen Clauses*.

### 2. Risk Radar & Predatory Clause Scanner (Score 0–100)
- Quantifies exposure with a 0–100 risk dial, letter grade (A, B, C, D, F), and verdict.
- Automatically flags high-liability provisions:
  - Unannounced landlord entry (breach of quiet enjoyment)
  - Evergreen auto-renewal with 30% discretionary rent hikes
  - Personal project IP seizures outside work hours
  - Global 2-year non-competes in restraint of trade
  - Uncapped consequential damages and lost profits
- Each flag provides:
  - **Why this hurts you** (real-world consequences)
  - **Strategic recommendation** (how to negotiate)
  - **Ready-to-use counter-clause wording** with 1-click copy.

### 3. Side-by-Side Contract Comparison Matrix
- Compare Document A vs Document B (e.g. Standard Lease vs Landlord's Custom Rider; Client Contract vs Freelancer Counter-Proposal).
- Calculates the **Net Risk Shift** (e.g., `+18 points risk escalation`).
- Categorizes added liabilities, removed protections, and displays an interactive diff matrix.

### 4. Grounded Document Q&A (Anti-Hallucination)
- Eliminates AI hallucination by enforcing strict quote citations.
- Answers are accompanied by the **exact verbatim text quote**, **section number**, and practical explanation.
- Includes pre-populated quick-prompt chips tailored to the active contract.

### 5. Negotiation Drafter & Action Navigator
- Select any unfavorable clause and state your desired outcome.
- Generates a **polite, professional, collaborative counter-proposal email** and alternative redline wording.
- Tracks contractual deadlines (e.g. 90-day certified mail notice deadline to prevent 2-year auto-renewals).

### 6. 1-Click Attorney Consultation Brief
- For matters requiring formal legal advice, LexiGuard AI synthesizes an organized 1-page dossier.
- Summarizes the transaction, lists critical red flags, details specific targeted questions to ask the lawyer, and provides a meeting preparation checklist.
- Saves users hundreds of dollars in billable consultation time.

---

## 🔒 4. Security & Privacy Implementation

1. **Client-Side PII Scrubber**:
   - Before any text is dispatched to external AI models, LexiGuard scans and redacts personal identifiers:
     - Emails (`[CONFIDENTIAL_EMAIL_1]`)
     - Phone numbers (`[CONFIDENTIAL_PHONE_1]`)
     - Social Security & Tax IDs (`[CONFIDENTIAL_TAX_ID_1]`)
     - Street addresses (`[CONFIDENTIAL_PROPERTY_ADDRESS_1]`)
     - Credit card numbers (`[CONFIDENTIAL_PAYMENT_INFO_1]`)
     - Party names (`[CONFIDENTIAL_PARTY_NAME_1]`)
   - Users can toggle PII masking on/off and review the redacted entity count.
2. **Zero Backend Data Retention**:
   - 100% client-side architecture. Documents are parsed and stored in volatile browser memory.
3. **Bring-Your-Own-Key (BYOK) Security**:
   - API keys are stored solely in `window.localStorage` and used directly in client-to-Google HTTPS requests. No intermediary servers or databases.
4. **Mandatory Legal Disclaimer Banner**:
   - Prominently notifies users that the tool provides legal information and educational assistance, not formal licensed attorney representation.

---

## ♿ 5. Accessibility & Inclusive Design (WCAG 2.1 AA)

- **Dyslexia-Friendly Font Mode**: Increases letter-spacing, line height, and switches to high-legibility character geometry to aid readers with dyslexia or reading difficulties.
- **High-Contrast Mode**: Black-and-white high-contrast visual theme for visually impaired users.
- **Theme Switcher**: Dark mode and Light mode tailored to reduced eye strain.
- **Screen Reader Accessible**: Full semantic HTML5 (`<header>`, `<main>`, `<article>`, `<nav>`, `<aside>`), ARIA roles, and accessible focus states.
- **Text-to-Speech (TTS)**: Built-in speech synthesis allows users to listen to clauses spoken aloud.

---

## 🚀 6. Efficiency & Performance Metrics

- **Repository Size**: Strictly under **3 MB** (excluding `node_modules` via `.gitignore`), well below the 10 MB competition limit.
- **Production Bundle**:
  - `dist/index.html`: 1.22 kB
  - `dist/assets/index.css`: 13.67 kB (gzip: 3.34 kB)
  - `dist/assets/index.js`: 292.68 kB (gzip: 88.38 kB)
  - **Total Production Footprint**: ~307 kB (< 95 kB gzipped).
- **Compilation Speed**: Full production build in **< 2 seconds**.
- **Test Duration**: All 12 automated unit tests execute in **< 600ms**.

---

## 🧪 7. Automated Testing & Validation

The project includes an automated test suite powered by **Vitest**:

```bash
npm test
```

### Test Coverage Summary:
- `tests/piiScrubber.test.ts`:
  - ✓ Email address masking and token generation
  - ✓ Phone number redaction
  - ✓ Social Security and Tax ID redaction
  - ✓ Street address masking
  - ✓ 100% faithful restoration of redacted entities
- `tests/legalAnalyzer.test.ts`:
  - ✓ Parsing unstructured contract text into numbered clauses
  - ✓ Detecting predatory unannounced landlord entry clauses
  - ✓ Detecting overbroad personal project IP seizures
  - ✓ Risk score calculation and letter grade bounds (0–100)
  - ✓ Grounded Q&A matching with verbatim clause citations
  - ✓ Dual document comparative diffing and risk shift delta
  - ✓ Attorney consultation brief generation

---

## 💡 8. Assumptions Made

1. **Information vs. Legal Advice**: The tool assists non-lawyers in understanding their rights and preparing for professional consultations; it assumes the user will seek formal counsel for high-stakes litigation.
2. **Jurisdiction Nuances**: While statutory defaults (e.g. 24-hour entry notice, security deposit escrow) are modeled on common law standards, local municipal codes may vary.
3. **Format**: Supports pasted text, markdown files, and raw contract exports.

---

## 🛠️ 9. Local Development & Deployment

### Prerequisites:
- Node.js v18+ (tested on Node v22)
- npm v9+

### Run Locally:
```bash
# 1. Clone the repository
git clone https://github.com/Xsayushn/hack2skillchalangeexclusive400.git
cd hack2skillchalangeexclusive400

# 2. Install dependencies
npm install

# 3. Run unit tests
npm test

# 4. Start local dev server
npm run dev
```

### Production Build:
```bash
npm run build
npm run preview
```

### Deploy to Vercel / Netlify / GitHub Pages:
The app compiles to a static single-page application in `/dist`. It can be deployed in 30 seconds:
- **Vercel**: `npx vercel --prod`
- **Netlify**: Drag-and-drop the `dist/` folder or link the GitHub repo.
- **GitHub Pages**: Build output directly hostable via GitHub Actions.

---

## 📋 GenAI Services Utilized

| Service / Model | Role in Solution | Where Utilized |
| :--- | :--- | :--- |
| **Google Gemini 1.5 Flash** | Primary Fast Inference Engine | Plain-English translation, Grounded Q&A citations, Counter-proposal drafting, Risk analysis |
| **Google Gemini 2.0 Flash** | Next-Generation Reasoning Engine | Deep clause analysis and comparative diffing |
| **Client-Side Legal Rule Engine** | Offline & Fallback Intelligence | Grounded clause citation matcher, predatory pattern detection, PII scrubber, attorney brief generator |

---

*LexiGuard AI — Democratizing Legal Intelligence.*
