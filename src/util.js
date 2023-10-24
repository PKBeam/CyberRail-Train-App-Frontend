export const BACKEND_URL = "https://api.mc.moguserver.space"

export function recalculateWorldTime(refTime, timestamp) {
  return parseInt(refTime + 72 * (Date.now()/1000 - timestamp)) % (24 * 60 * 60)
}
