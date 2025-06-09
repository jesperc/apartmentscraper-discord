const parseDate = (str) => {
  const regex =
    /(\d{1,2})\s(jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)(?:\s+kl\s+(\d{1,2}):(\d{2}))?/i
  const months = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    maj: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    okt: 9,
    nov: 10,
    dec: 11,
  }

  const match = str.match(regex)
  if (!match) return null

  const [_, day, mon, hour = '0', min = '0'] = match
  const now = new Date()
  const year =
    now.getMonth() > months[mon.toLowerCase()]
      ? now.getFullYear() + 1
      : now.getFullYear()

  return new Date(
    year,
    months[mon.toLowerCase()],
    parseInt(day),
    parseInt(hour),
    parseInt(min)
  )
}

export const sortApartments = (apartments) => {
  const sorted = apartments.slice().sort((a, b) => {
    if (a.stickyMessage === 'Kommande') return -1
    if (b.stickyMessage === 'Kommande') return 1

    if (a.stickyMessage === 'Budgivning pågår') return -1
    if (b.stickyMessage === 'Budgivning pågår') return 1

    const aDate = parseDate(a.stickyMessage)
    const bDate = parseDate(b.stickyMessage)

    if (aDate && bDate) return aDate - bDate
    if (aDate) return -1
    if (bDate) return 1

    const aWalkTime = parseInt(a.walkTime)
    const bWalkTime = parseInt(b.walkTime)

    if (aWalkTime != 999 && bWalkTime != 999) {
      return aWalkTime < bWalkTime ? -1 : 1
    } else if (aWalkTime != 999 && bWalkTime == 999) {
      return -1
    } else if (aWalkTime == 999 && bWalkTime != 999) {
      return 1
    }

    return 0
  })

  return sorted
}
