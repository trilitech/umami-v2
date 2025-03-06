
/**
 * Human-readable title for your website
 */
export const rpName = 'SimpleWebAuthn Example';
/**
 * A unique identifier for your website. 'localhost' is okay for
 * local dev
 */
// export const rpID = 'simplewebauthn.dev';
/**
 * The URL at which registrations and authentications should occur.
 * 'http://localhost' and 'http://localhost:PORT' are also valid.
 * Do NOT include any trailing /
 */
// export const origin = `https://${rpID}`;

// for localhost
export const rpID = 'localhost';
export const origin = `http://${rpID}:5173`;
