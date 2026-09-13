import { RedactedEntity, RedactionResult } from '../types/legal';

/**
 * Client-side PII Scrubber & Privacy Guardian
 * Ensures confidential personal, financial, and contact information is 
 * masked BEFORE any text is submitted to external AI inference models.
 */

// Regex patterns for sensitive legal and personal identifiers
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g;
const SSN_TAX_REGEX = /\b\d{3}-\d{2}-\d{4}\b|\b\d{2}-\d{7}\b/g;
const CREDIT_CARD_REGEX = /\b(?:\d{4}[- ]?){3}\d{4}\b/g;
const ADDRESS_REGEX = /\b\d{1,5}\s+([A-Za-z0-9.\s]{3,30})\s+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Way|Suite|Apt|Unit)\b[^\n,.]*/gi;
const PARTY_NAME_REGEX = /(?:Between|Tenant|Landlord|Employee|Employer|Client|Contractor|Provider|Recipient|Disclosing Party|Receiving Party):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g;

export class PiiScrubber {
  /**
   * Scans text, replaces sensitive entities with tokens, and stores reversal mapping.
   */
  static scrub(text: string): RedactionResult {
    let sanitized = text;
    const entities: RedactedEntity[] = [];
    let counter = 1;

    // 1. Scrub Emails
    sanitized = sanitized.replace(EMAIL_REGEX, (match, offset) => {
      const token = `[CONFIDENTIAL_EMAIL_${counter}]`;
      entities.push({
        id: `email-${counter}`,
        type: 'EMAIL',
        originalText: match,
        redactedText: token,
        index: offset,
      });
      counter++;
      return token;
    });

    // 2. Scrub SSN / Tax IDs
    sanitized = sanitized.replace(SSN_TAX_REGEX, (match, offset) => {
      const token = `[CONFIDENTIAL_TAX_ID_${counter}]`;
      entities.push({
        id: `ssn-${counter}`,
        type: 'IDENTIFIER',
        originalText: match,
        redactedText: token,
        index: offset,
      });
      counter++;
      return token;
    });

    // 3. Scrub Credit Cards / Financial
    sanitized = sanitized.replace(CREDIT_CARD_REGEX, (match, offset) => {
      const token = `[CONFIDENTIAL_PAYMENT_INFO_${counter}]`;
      entities.push({
        id: `card-${counter}`,
        type: 'FINANCIAL',
        originalText: match,
        redactedText: token,
        index: offset,
      });
      counter++;
      return token;
    });

    // 4. Scrub Phone Numbers
    sanitized = sanitized.replace(PHONE_REGEX, (match, offset) => {
      // Avoid false positive on simple 4-digit years or clause numbers like 1.2
      if (match.length < 8) return match;
      const token = `[CONFIDENTIAL_PHONE_${counter}]`;
      entities.push({
        id: `phone-${counter}`,
        type: 'PHONE',
        originalText: match,
        redactedText: token,
        index: offset,
      });
      counter++;
      return token;
    });

    // 5. Scrub Physical Addresses
    sanitized = sanitized.replace(ADDRESS_REGEX, (match, _p1, offset) => {
      const token = `[CONFIDENTIAL_PROPERTY_ADDRESS_${counter}]`;
      entities.push({
        id: `addr-${counter}`,
        type: 'ADDRESS',
        originalText: match,
        redactedText: token,
        index: offset,
      });
      counter++;
      return token;
    });

    // 6. Scrub Party Names
    sanitized = sanitized.replace(PARTY_NAME_REGEX, (match, p1, offset) => {
      const token = `[CONFIDENTIAL_PARTY_NAME_${counter}]`;
      entities.push({
        id: `party-${counter}`,
        type: 'NAME',
        originalText: p1,
        redactedText: token,
        index: offset,
      });
      counter++;
      return match.replace(p1, token);
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
