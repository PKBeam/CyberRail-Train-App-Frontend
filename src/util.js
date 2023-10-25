export const BACKEND_URL = "https://api.mc.moguserver.space"
//export const BACKEND_URL = "http://localhost:8080"

export function recalculateWorldTime(refTime, timestamp) {
  return parseInt(refTime + 72 * (Date.now()/1000 - timestamp)) % (24 * 60 * 60)
}

export function convert24hTo12h(time) {
  let [hr, min] = time.split(":")
  let hrs = ((parseInt(hr)) % 24) % 12
  return ((hrs === 0) ? 12 : hrs) + ":" + min
}
export function addHoursToTime(hours, time, use12Hour) {
  let [hr, min] = time.split(":")
  return (parseInt(hr) + hours) % 24 + ":" + min
}

export function timeSecsFromString(time) {
  let [hr, min] = time.split(":")
  return parseInt(hr) * 60 * 60 + parseInt(min) * 60
}
