import { createHmac, timingSafeEqual } from "crypto";

type PreviewPayload = {
  s: string;
  e: number;
};

const DEFAULT_TTL_HOURS = 72;

function toBase64Url(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64");
}

function getPreviewSecret() {
  return process.env.BLOG_PREVIEW_TOKEN_SECRET ?? "";
}

function getPreviewTtlHours() {
  const rawValue = process.env.BLOG_PREVIEW_TOKEN_TTL_HOURS;
  const parsed = rawValue ? Number(rawValue) : NaN;

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return DEFAULT_TTL_HOURS;
}

function signPayload(payloadBase64Url: string, secret: string) {
  return toBase64Url(createHmac("sha256", secret).update(payloadBase64Url).digest());
}

export function createBlogPreviewToken(slug: string) {
  const secret = getPreviewSecret();

  if (!secret) {
    return null;
  }

  const expiresAtUnixSeconds = Math.floor(Date.now() / 1000) + Math.floor(getPreviewTtlHours() * 3600);
  const payload: PreviewPayload = { s: slug, e: expiresAtUnixSeconds };
  const payloadBase64Url = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(payloadBase64Url, secret);

  return `${payloadBase64Url}.${signature}`;
}

export function verifyBlogPreviewToken(token: string, slug: string) {
  const secret = getPreviewSecret();

  if (!secret) {
    return false;
  }

  const [payloadBase64Url, signature] = token.split(".");

  if (!payloadBase64Url || !signature) {
    return false;
  }

  const expectedSignature = signPayload(payloadBase64Url, secret);

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  if (!timingSafeEqual(expectedBuffer, receivedBuffer)) {
    return false;
  }

  try {
    const payloadJson = fromBase64Url(payloadBase64Url).toString("utf8");
    const payload = JSON.parse(payloadJson) as PreviewPayload;

    if (!payload?.s || payload.s !== slug) {
      return false;
    }

    const nowUnixSeconds = Math.floor(Date.now() / 1000);
    return Number.isFinite(payload.e) && payload.e > nowUnixSeconds;
  } catch {
    return false;
  }
}
