// ⚠️ PROTOTYPE STUB — NOT SECURE. NOT FOR REAL USER DATA.
// This module simulates behavior for the prototype only. A qualified security
// engineer must own the real implementation before any real user data.
// Spec: see SECURITY_HANDOFF.md
//
// Every security-critical subsystem of The Will lives here behind a clearly
// marked interface. NONE of this is real security. It exists so the prototype
// can demonstrate the *experience* on synthetic data. See CLAUDE.md §2.

// ---------------------------------------------------------------------------
// EncryptionService — real requirement: content encrypted at rest, architected
// for end-to-end (browser-side encrypt, server stores ciphertext only).
// Prototype: returns obvious stub markers. Never real cryptography.
// ---------------------------------------------------------------------------
export const EncryptionService = {
  encrypt(plaintext: string): { ciphertext: string; contentHash: string } {
    return {
      ciphertext: `STUB-CIPHERTEXT(${plaintext.length} bytes)`,
      contentHash: `stub-sha256-${stubHash(plaintext)}`,
    };
  },
  // In the prototype, "decrypt" simply returns the synthetic preview we stored.
  decrypt(_ciphertext: string, preview: string): string {
    return preview;
  },
  describe(): string {
    return "STUB — no real encryption. Real build: at-rest + E2E target.";
  },
};

// ---------------------------------------------------------------------------
// KeyService — real requirement: KMS/HSM-backed keys released only after a
// verified trigger; rotation, escrow, loss-recovery policy.
// ---------------------------------------------------------------------------
export const KeyService = {
  issueKeyPackage(messageId: string): string {
    return `STUB-KEYPKG-${messageId}`;
  },
  releaseKey(_messageId: string): boolean {
    return true; // simulated release only
  },
  destroyKey(messageId: string): boolean {
    // Real build must destroy/revoke the key so content is unrecoverable.
    return Boolean(messageId);
  },
};

// ---------------------------------------------------------------------------
// AuthService — real requirement: real authentication, recipient OTP, tiered
// identity, session & recovery security. Prototype: in-memory persona switch +
// fake OTP that always accepts 000000 (and reports it for the demo).
// ---------------------------------------------------------------------------
export const AuthService = {
  DEMO_OTP: "000000",
  sendOtp(recipientContact: string): { sent: true; demoCode: string } {
    // NotificationService is also a stub — nothing is actually delivered.
    return { sent: true, demoCode: this.DEMO_OTP };
  },
  verifyOtp(input: string): boolean {
    return input.trim() === this.DEMO_OTP;
  },
};

// ---------------------------------------------------------------------------
// ReleaseEngine — real requirement: trigger + release pipeline with cooling
// periods, confirmations, admin hold. Highest-risk subsystem. Prototype:
// pure functions the time-machine panel drives. No real time, no real release.
// ---------------------------------------------------------------------------
export const ReleaseEngine = {
  // Is a date trigger satisfied given the simulated "now"?
  isDateSatisfied(releaseISO: string | null, nowISO: string): boolean {
    if (!releaseISO) return false;
    return new Date(nowISO).getTime() >= new Date(releaseISO).getTime();
  },
  // Has an inactivity window elapsed since the last check-in response?
  isInactivityElapsed(
    lastResponseISO: string | null,
    inactivityDays: number | null,
    nowISO: string,
  ): boolean {
    if (!lastResponseISO || !inactivityDays) return false;
    const elapsedDays =
      (new Date(nowISO).getTime() - new Date(lastResponseISO).getTime()) /
      86_400_000;
    return elapsedDays >= inactivityDays;
  },
  describe(): string {
    return "STUB — simulated triggers only. Real build: confirmations + cooling + admin hold.";
  },
};

// ---------------------------------------------------------------------------
// AuditService — real requirement: tamper-evident hash chain. Prototype: append
// to the mock store and log to console. NOT tamper-proof — do not claim it is.
// ---------------------------------------------------------------------------
export const AuditService = {
  // Returns a fake "chained" hash for display only.
  chainHash(prevHash: string, payload: string): string {
    return `stub-chain-${stubHash(prevHash + payload)}`;
  },
  describe(): string {
    return "STUB — mock log, NOT tamper-proof. Real build: append-only hash chain.";
  },
};

// ---------------------------------------------------------------------------
// NotificationService — real requirement: real email/SMS, deliverability,
// anti-spoofing, rate limits. Prototype: NEVER sends. Records intent only.
// ---------------------------------------------------------------------------
export const NotificationService = {
  send(channel: string, to: string, template: string): { delivered: false } {
    // Intentionally never delivers to a real address.
    if (typeof console !== "undefined") {
      console.info(`[STUB notify] ${channel} → ${to} :: ${template} (not sent)`);
    }
    return { delivered: false };
  },
};

// ---------------------------------------------------------------------------
// BillingService — real requirement: payments, subscriptions, limits, renewal.
// Prototype: returns the package limits already seeded in the mock store.
// ---------------------------------------------------------------------------
export const BillingService = {
  describe(): string {
    return "STUB — no payment processing. Real build: subscription + package limits.";
  },
};

// Deterministic, non-cryptographic hash for display-only stub identifiers.
function stubHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}
