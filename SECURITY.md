# Security & Privacy Policy — LexiGuard AI

**LexiGuard AI** is engineered from the ground up as a privacy-first, accessible legal document intelligence platform. This document outlines our threat model, security posture, data protection mechanisms, and vulnerability reporting procedures.

---

## 1. Core Security Architecture & Guarantees

### Zero-Backend Telemetry & Client-Side Processing
- **100% Client-Side Execution**: Document parsing, heuristic risk analysis, clause comparison, and PII masking execute entirely in the user's browser runtime.
- **Zero Server-Side Retention**: LexiGuard AI maintains no central servers, databases, or third-party analytical trackers. Uploaded contracts never touch intermediate storage.
- **Zero-Trust AI Gatekeeper**: Text is never forwarded directly to external AI providers (Google Gemini) without passing through our mandatory client-side PII Scrubber and prompt injection sanitizer.

---

## 2. Threat Model & Mitigation Matrix

| Threat Vector | Potential Impact | LexiGuard AI Defense | Implementation |
| :--- | :--- | :--- | :--- |
| **PII & Confidential Data Leakage** | Exposure of personal names, emails, phones, SSNs, financial accounts to third-party LLMs | Client-Side Pre-Flight PII Scrubber | Mandatory regex-based tokenization replacing sensitive entities with non-identifying tokens (`[CONFIDENTIAL_EMAIL_1]`) before dispatch. |
| **Adversarial Prompt Injection** | Attackers embed directives (`[INST]`, `<system>`) inside contract clauses to hijack AI behavior | Adversarial Input Neutralizer | Strips and neutralizes known delimiter tokens and system overrides (`ignore previous instructions`, `DAN Mode`) prior to LLM reasoning. |
| **Cross-Site Scripting (XSS)** | Injection of malicious scripts via contract text rendering | Strict Content Security Policy (CSP) & React JSX Escaping | CSP header forbidding unauthorized script sources (`object-src 'none'`, `base-uri 'self'`); React auto-escapes all rendered text strings. |
| **Cleartext Secret Exposure (CWE-312)** | API keys stored in plain web storage accessible via browser inspection | Key Masking & Dual Storage Strategy | Keys are never logged in cleartext, masked in the UI (`AIzaSy...****`), and support ephemeral `sessionStorage` alongside offline heuristic fallback. |
| **Denial of Service / Quota Burn** | Repeated expensive API calls on identical questions | In-Memory LRU/TTL Response Caching | Queries and document parsing are memoized with an in-memory cache, responding in 0ms without redundant network egress. |

---

## 3. Supported PII Redaction Categories

The `PiiScrubber` pipeline actively identifies, tokenizes, and masks:
1. **Personal Names**: Parties identified by contract role (`Tenant:`, `Client:`, `Disclosing Party:`).
2. **Email Addresses**: Standard RFC 5322 compliant regex patterns.
3. **Phone Numbers**: International (`+1`, `+44`, `+91`) and domestic formats with area codes.
4. **Tax IDs & SSNs**: Social Security Numbers (`XXX-XX-XXXX`) and EINs (`XX-XXXXXXX`).
5. **Financial Data**: Credit/Debit card numbers (`XXXX-XXXX-XXXX-XXXX`), IBAN accounts, and bank routing numbers.
6. **Physical Addresses**: Street numbers, avenues, suites, zip codes, and property designations.
7. **Government Identifiers**: Passports, Driver's Licenses, and Date of Birth (DOB) markers.
8. **Network Identifiers**: IPv4 and IPv6 addresses embedded in SaaS contracts or logs.

---

## 4. Content Security Policy (CSP)

LexiGuard AI enforces a strict Content Security Policy meta directive:
```http
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com data:;
connect-src 'self' https://generativelanguage.googleapis.com;
img-src 'self' data: https:;
object-src 'none';
base-uri 'self';
form-action 'self';
```

---

## 5. Offline & Privacy-First Heuristic Fallback

If an API key is omitted, or if the user is operating in a sensitive air-gapped environment:
- The platform automatically switches to its internal **Deterministic Legal Rule Engine**.
- All question answering, clause-level comparison, and predatory risk scoring operate **100% offline** without any network connectivity.

---

## 6. Vulnerability Reporting

If you discover a security vulnerability or PII leakage bug in LexiGuard AI:
1. Do not file a public GitHub issue.
2. Please submit details via responsible disclosure to the maintainer or project repository administrators.
3. We acknowledge reports within 24 hours and provide remediation patches promptly.
