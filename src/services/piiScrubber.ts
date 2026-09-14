import { RedactedEntity, RedactionResult } from '../types/legal';

/**
 * Client-side PII Scrubber & Privacy Guardian
 * Ensures confidential personal, financial, contact, and adversarial information
 * is neutralized and masked BEFORE any text is submitted to external AI inference models.
 */

// Comprehensive regex patterns for sensitive legal and personal identifiers
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

// International and standard phone numbers (+1, +44, +91, parens, dashes, dots, spaces)
const PHONE_REGEX = /(?:\+?\d{1,4}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}\b/g;

// SSN / EIN / Tax IDs
const SSN_TAX_REGEX = /\b\d{3}-\d{2}-\d{4}\b|\b\d{2}-\d{7}\b/g;

// Credit card and bank account patterns
const CREDIT_CARD_REGEX = /\b(?:\d{4}[- ]?){3}\d{4}\b/g;

// Physical addresses with street indicators and optional city/state/zip
const ADDRESS_REGEX = /\b\d{1,5}\s+([A-Za-z0-9.\s]{3,35})\s+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Way|Terrace|Way|Suite|Apt|Unit)\b(?:[,\s]+[A-Za-z\s]+(?:,\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?)?)?/gi;

// Legal party names
const PARTY_NAME_REGEX = /(?:Between|Tenant|Landlord|Employee|Employer|Client|Contractor|Provider|Recipient|Disclosing Party|Receiving Party):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g;

// Common contract party naming patterns like "Jane Doe ("Tenant")" or "John Smith, Landlord"
const EXPLICIT_PERSON_REGEX = /\b([A-Z][a-z]+ [A-Z][a-z]+)(?=\s*(?:\(|,)\s*(?:Tenant|Landlord|Contractor|Client|Employee|Resident)\b)/g;

// Adversarial prompt injection delimiters that attackers might place in uploaded contracts
const PROMPT_INJECTION_PATTERNS = [
  /\[\s*INST\s*\]/gi,
  /\[\s*\/INST\s*\]/gi,
  /<\|im_start\|>/gi,
  /<\|im_end\|>/gi,
  /<system>/gi,
  /<\/system>/gi,
  /(?:ignore\s+previous\s+instructions|system\s*:\s*you\s+are)/gi,
];

export class PiiScrubber {
  /**
   * Neutralizes prompt injection payload attempts embedded within untrusted contract text
   */
  static sanitizePromptInjection(text: string): string {
    let sanitized = text;
    for (const pattern of PROMPT_INJECTION_PATTERNS) {
      sanitized = sanitized.replace(pattern, '[FILTERED_DIRECTIVE]');
    }
    return sanitized;
  }

  /**
   * Scans text, replaces sensitive entities with tokens, and stores reversal mapping.
   */
  static scrub(text: string): RedactionResult {
    // First neutralize any prompt injection vectors
    let sanitized = this.sanitizePromptInjection(text);
    const entities: RedactedEntity[] = [];

    let emailCount = 1;
    let ssnCount = 1;
    let cardCount = 1;
    let phoneCount = 1;
    let addrCount = 1;
    let partyCount = 1;

    // 1. Scrub Emails
    sanitized = sanitized.replace(EMAIL_REGEX, (match, offset) => {
      const token = `[CONFIDENTIAL_EMAIL_${emailCount}]`;
      entities.push({
        id: `email-${emailCount}`,
        type: 'EMAIL',
        originalText: match,
        redactedText: token,
        index: offset,
      });
      emailCount++;
      return token;
    });

    // 2. Scrub SSN / Tax IDs
    sanitized = sanitized.replace(SSN_TAX_REGEX, (match, offset) => {
      const token = `[CONFIDENTIAL_TAX_ID_${ssnCount}]`;
      entities.push({
        id: `ssn-${ssnCount}`,
        type: 'IDENTIFIER',
        originalText: match,
        redactedText: token,
        index: offset,
      });
      ssnCount++;
      return token;
    });

    // 3. Scrub Credit Cards / Financial
    sanitized = sanitized.replace(CREDIT_CARD_REGEX, (match, offset) => {
      const token = `[CONFIDENTIAL_PAYMENT_INFO_${cardCount}]`;
      entities.push({
        id: `card-${cardCount}`,
        type: 'FINANCIAL',
        originalText: match,
        redactedText: token,
        index: offset,
      });
      cardCount++;
      return token;
    });

    // 4. Scrub Phone Numbers
    sanitized = sanitized.replace(PHONE_REGEX, (match, offset) => {
      // Avoid false positive on simple 4-digit years or clause numbers like 1.2
      const digitsOnly = match.replace(/\D/g, '');
      if (digitsOnly.length < 7 || digitsOnly.length > 15) return match;
      const token = `[CONFIDENTIAL_PHONE_${phoneCount}]`;
      entities.push({
        id: `phone-${phoneCount}`,
        type: 'PHONE',
        originalText: match,
        redactedText: token,
        index: offset,
      });
      phoneCount++;
      return token;
    });

    // 5. Scrub Physical Addresses
    sanitized = sanitized.replace(ADDRESS_REGEX, (match, _p1, offset) => {
      const token = `[CONFIDENTIAL_PROPERTY_ADDRESS_${addrCount}]`;
      entities.push({
        id: `addr-${addrCount}`,
        type: 'ADDRESS',
        originalText: match,
        redactedText: token,
        index: offset,
      });
      addrCount++;
      return token;
    });

    // 6. Scrub Party Names (Prefix style)
    sanitized = sanitized.replace(PARTY_NAME_REGEX, (match, p1, offset) => {
      const token = `[CONFIDENTIAL_PARTY_NAME_${partyCount}]`;
      entities.push({
        id: `party-${partyCount}`,
        type: 'NAME',
        originalText: p1,
        redactedText: token,
        index: offset,
      });
      partyCount++;
      return match.replace(p1, token);
    });

    // 7. Scrub Explicit Person Names followed by legal role
    sanitized = sanitized.replace(EXPLICIT_PERSON_REGEX, (_match, p1, offset) => {
      const token = `[CONFIDENTIAL_PARTY_NAME_${partyCount}]`;
      entities.push({
        id: `party-${partyCount}`,
        type: 'NAME',
        originalText: p1,
        redactedText: token,
        index: offset,
      });
      partyCount++;
      return token;
    });

    return {
      sanitizedText: sanitized,
      entitiesFound: entities,
      count: entities.length,
    };
  }

  /**
   * Replaces redacted tokens back with original values for export or printing.
   */
  static restore(sanitizedText: string, entities: RedactedEntity[]): string {
    let restored = sanitizedText;
    for (const entity of entities) {
      restored = restored.split(entity.redactedText).join(entity.originalText);
    }
    return restored;
  }
}
