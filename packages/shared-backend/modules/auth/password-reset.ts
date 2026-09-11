import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

type ResetUser = { id: string; email: string | null; password_hash: string };
const PREFIX = 'reset-v2';
function signature(body: string, user: ResetUser) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('reset_secret_not_configured');
  return createHmac('sha256', secret).update(JSON.stringify([PREFIX, body, user.password_hash, user.email])).digest();
}
export function createResetToken(user: ResetUser, now = Date.now()) {
  const body = Buffer.from(JSON.stringify({sub:user.id, exp:Math.floor(now/1000)+3600, nonce:randomBytes(24).toString('hex')})).toString('base64url');
  return `${PREFIX}.${body}.${signature(body,user).toString('base64url')}`;
}
export function resetSubject(token: string, now = Date.now()): string | null {
  try {
    if (token.length > 1024) return null;
    const parts=token.split('.');
    if(parts.length!==3 || parts[0]!==PREFIX || !/^[A-Za-z0-9_-]+$/.test(parts[1]) || !/^[A-Za-z0-9_-]{43}$/.test(parts[2])) return null;
    const p=JSON.parse(Buffer.from(parts[1],'base64url').toString());
    if(typeof p.sub!=='string' || !/^[a-f0-9-]{36}$/i.test(p.sub) || !Number.isSafeInteger(p.exp) || p.exp<=Math.floor(now/1000) || p.exp>Math.floor(now/1000)+3600) return null;
    return p.sub;
  } catch { return null; }
}
export function verifyResetToken(token: string, user: ResetUser, now = Date.now()) {
  if(resetSubject(token,now)!==user.id) return false;
  const parts=token.split('.'), actual=Buffer.from(parts[2],'base64url'), expected=signature(parts[1],user);
  return actual.length===expected.length && timingSafeEqual(actual,expected);
}
export function resetLink(token: string) {
  const origin=new URL(process.env.FRONTEND_URL || '');
  if(origin.protocol!=='https:' && !(process.env.NODE_ENV!=='production' && ['localhost','127.0.0.1','[::1]'].includes(origin.hostname))) throw new Error('reset_origin_invalid');
  return new URL('/api/auth/password-reset',origin.origin).href+'#token='+encodeURIComponent(token);
}
export const resetResponse = {success:true,message:'If an account exists, a password reset link will be sent. / Hesap varsa sıfırlama bağlantısı gönderilecektir. / Falls ein Konto existiert, wird ein Link gesendet.'};
