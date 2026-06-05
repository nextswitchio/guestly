export function clearAllCookies() {
  document.cookie.split(";").forEach(c => {
    const eq = c.indexOf("=");
    const name = eq > -1 ? c.substring(0, eq).trim() : c.trim();
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`;
  });
}
