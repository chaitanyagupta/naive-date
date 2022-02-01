export default function NaiveDate(value) {
  if (this === undefined) {
    throw new Error('Must be called as a constructor')
  }

  let utc = null

  const args = arguments
  if (args.length === 1) {
    if (Number.isInteger(value)) {
      utc = value
    } else if (value instanceof NaiveDate) {
      utc = value.getTime()
    } else {
      throw new Error('Unrecognized single argument value')
    }
  } else if (args.length > 1) {
    const year = args[0]
    const month = args[1]
    const day = args[2] === undefined ? 1 : args[2]
    const hours = args[3] === undefined ? 0 : args[3]
    const minutes = args[4] === undefined ? 0 : args[4]
    const seconds = args[5] === undefined ? 0: args[5]
    const milliseconds = args[6] === undefined ? 0 : args[6]
    utc = Date.UTC(year, month, day, hours, minutes, seconds, milliseconds)
  } else { 
    throw new Error('Constructor expects at least one value')
  }

  const date = new Date(utc)
  if (isNaN(date.getTime())) {
    throw new Error('Could not initialize native date')
  }

  // Same as an ISO string, except for the UTC indicator "Z"
  this.toString = () => date.toISOString().slice(0, -1)

  this.getTime = () => date.getTime()

  this.valueOf = () => date.valueOf()

  this.toDate = timeZone => {
    // take the UTC date and compute the plain date for the given timezone for it
    // this will give us the offset of the timezone at this particular date
    const other = NaiveDate.from(date, timeZone)
    const offset = date.getTime() - other.getTime()

    return new Date(date.getTime() + offset)
  }

  // component getters
  this.getTime = () => date.getTime()
  this.getFullYear = () => date.getUTCFullYear()
  this.getMonth = () => date.getUTCMonth()
  this.getDate = () => date.getUTCDate()
  this.getHours = () => date.getUTCHours()
  this.getMinutes = () => date.getUTCMinutes()
  this.getSeconds = () => date.getUTCSeconds()
  this.getMilliseconds = () => date.getUTCMilliseconds()
  this.getDay = () => date.getUTCDay()

  // component setters
  this.setFullYear = (year, month, day) => {
    month = month === undefined ? this.getMonth() : month
    day = day === undefined ? this.getDate() : day
    return date.setUTCFullYear(year, month, day)
  }

  this.setMonth = (month, day) => {
    day = day === undefined ? this.getDate() : day
    return date.setUTCMonth(month, day)
  }

  this.setDate = day => date.setUTCDate(day)

  this.setHours = (hours, minutes, seconds, milliseconds) => {
    minutes = minutes === undefined ? this.getMinutes() : minutes
    seconds = seconds === undefined ? this.getSeconds() : seconds
    milliseconds = milliseconds === undefined ? this.getMilliseconds() : milliseconds
    return date.setUTCHours(hours, minutes, seconds, milliseconds)
  }

  this.setMinutes = (minutes, seconds, milliseconds) => {
    seconds = seconds === undefined ? this.getSeconds() : seconds
    milliseconds = milliseconds === undefined ? this.getMilliseconds() : milliseconds
    return date.setUTCMinutes(minutes, seconds, milliseconds)
  }

  this.setSeconds = (seconds, milliseconds) => {
    milliseconds = milliseconds === undefined ? this.getMilliseconds() : milliseconds
    return date.setUTCSeconds(seconds, milliseconds)
  }

  this.setMilliseconds = milliseconds => date.setUTCMilliseconds(milliseconds)
}

NaiveDate.from = (date, timeZone) => {
  const fmt = new Intl.DateTimeFormat('en-us', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    fractionalSecondDigits: 3,
    hourCycle: 'h23',
    timeZone: timeZone
  })
  const parts = fmt.formatToParts(date)
  const partValue = type => {
    const part = parts.find(part => part.type === type)
    return part ? parseInt(part.value) : 0
  }
  return new NaiveDate(
    partValue('year'),
    partValue('month') - 1,
    partValue('day'),
    partValue('hour'),
    partValue('minute'),
    partValue('second'),
    partValue('fractionalSecond')
  )
}
