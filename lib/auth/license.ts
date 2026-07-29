import { LICENSE_CODES } from "./license-codes";

const STORAGE_KEY = "persona-license";

export interface LicenseSession {
  code: string;
  authorizedAt: number;
}

const licenseCodeSet = new Set<string>(LICENSE_CODES);

export function normalizeLicenseCode(value: string) {
  return value.trim().toUpperCase();
}

export function isValidLicenseCode(value: string) {
  return licenseCodeSet.has(normalizeLicenseCode(value));
}

export function saveLicenseSession(code: string) {
  const session: LicenseSession = {
    code: normalizeLicenseCode(code),
    authorizedAt: Date.now(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function readLicenseSession() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as Partial<LicenseSession>;
    if (!session.code || !isValidLicenseCode(session.code)) return null;
    return {
      code: normalizeLicenseCode(session.code),
      authorizedAt:
        typeof session.authorizedAt === "number" ? session.authorizedAt : 0,
    };
  } catch {
    return null;
  }
}

export function hasLicenseSession() {
  return readLicenseSession() !== null;
}
