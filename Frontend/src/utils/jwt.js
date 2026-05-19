export function parseToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload; // { sub, role, exp, iat }
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = parseToken(token);
  if (!payload?.exp) return true;
  return Date.now() / 1000 > payload.exp;
}
