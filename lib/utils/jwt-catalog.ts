import { SignJWT, errors, jwtVerify } from 'jose';

const getSecret = () => {
  const secret = process.env.CATALOG_TOKEN_SECRET;
  if (!secret) {
    throw new Error('CATALOG_TOKEN_SECRET não está definido');
  }
  return new TextEncoder().encode(secret);
};

export interface CatalogTokenPayload {
  email: string;
  name: string;
}

export async function signCatalogToken(
  payload: CatalogTokenPayload,
  exp: string = '7d'
): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(getSecret());
}

export type VerifyResult =
  | { ok: true; payload: CatalogTokenPayload }
  | { ok: false; reason: 'expired' | 'invalid' };

export async function verifyCatalogToken(
  token: string
): Promise<VerifyResult> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ['HS256']
    });
    return {
      ok: true,
      payload: {
        email: String(payload.email),
        name: String(payload.name)
      }
    };
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      return { ok: false, reason: 'expired' };
    }
    return { ok: false, reason: 'invalid' };
  }
}
