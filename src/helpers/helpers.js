export const getNextMondayAsDateString = () => {
  const today = new Date()
  const dayOfWeek = today.getDay() // Sunday = 0, Monday = 1, ..., Saturday = 6

  // Calculate how many days to add to get to next week's Monday
  const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7

  const nextMonday = new Date(today)
  nextMonday.setDate(today.getDate() + daysUntilNextMonday)

  const yyyy = nextMonday.getFullYear()
  const mm = String(nextMonday.getMonth() + 1).padStart(2, '0')
  const dd = String(nextMonday.getDate()).padStart(2, '0')

  const formattedDate = `${yyyy}-${mm}-${dd}`
  return formattedDate
}

export const loadDb = (fs) => {
  const file = fs.readFileSync('./db.js')
  const str = file.toString('utf8')
  const json = JSON.parse(str)
  return json
}

export const saveDb = (db, fs) => {
  fs.writeFileSync('./db.js', JSON.stringify(db, null, 2))
}

export const getItemFromDb = (db, key) => {
  for (let item of db) {
    if (item.key == key) {
      return item
    }
  }
  return null
}

export const loadHtml = (fs) => {
  const file = fs.readFileSync('./template.html')
  return file.toString('utf8')
}

export const saveHtml = (str, fs) => {
  fs.writeFileSync('../index.html', str)
}

export const getLogFilePath = () => {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `logs/log-${year}${month}${day}${hours}${seconds}.txt`
}
