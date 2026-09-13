import { describe, it, expect } from 'vitest';
import { PiiScrubber } from '../src/services/piiScrubber';

describe('PiiScrubber - Client-Side Confidentiality Engine', () => {
  it('should scrub email addresses and generate redaction tokens', () => {
    const raw = 'Please contact tenant at jane.doe@example.com or landlord at legal@realty-corp.org.';
    const result = PiiScrubber.scrub(raw);

    expect(result.sanitizedText).not.toContain('jane.doe@example.com');
    expect(result.sanitizedText).not.toContain('legal@realty-corp.org');
    expect(result.sanitizedText).toContain('[CONFIDENTIAL_EMAIL_1]');
    expect(result.sanitizedText).toContain('[CONFIDENTIAL_EMAIL_2]');
    expect(result.count).toBe(2);
  });

  it('should scrub phone numbers accurately', () => {
    const raw = 'Call us at +1 (555) 234-5678 or 555-987-6543 immediately.';
    const result = PiiScrubber.scrub(raw);

    expect(result.sanitizedText).not.toContain('555) 234-5678');
    expect(result.sanitizedText).toContain('[CONFIDENTIAL_PHONE_');
  });

  it('should scrub SSNs and Tax IDs', () => {
    const raw = 'Employee SSN is 123-45-6789 and Employer EIN is 12-3456789.';
    const result = PiiScrubber.scrub(raw);

    expect(result.sanitizedText).not.toContain('123-45-6789');
    expect(result.sanitizedText).toContain('[CONFIDENTIAL_TAX_ID_');
  });

  it('should scrub physical street addresses', () => {
    const raw = 'The property is at 450 Maple Avenue, Apt 4B, and headquarters at 100 Main Street, Suite 500.';
    const result = PiiScrubber.scrub(raw);

    expect(result.sanitizedText).toContain('[CONFIDENTIAL_PROPERTY_ADDRESS_');
  });

  it('should faithfully restore scrubbed tokens back to original values', () => {
    const original = 'Contract between Tenant: John Doe and Landlord: Alice Smith. Email: alice@smith.com.';
    const scrubbed = PiiScrubber.scrub(original);

    expect(scrubbed.sanitizedText).not.toContain('alice@smith.com');

    const restored = PiiScrubber.restore(scrubbed.sanitizedText, scrubbed.entitiesFound);
    expect(restored).toBe(original);
  });
});
