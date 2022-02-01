import { NaiveDate } from './naive-date.js'

let assert
if (typeof window === 'undefined') {
  assert = await import('assert')
} else {
  assert = window.chai.assert
}


function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomDateComponents() {
  return {
    year: randomInt(10000),
    month: randomInt(12),
    day: randomInt(28) + 1,
    hours: randomInt(24),
    minutes: randomInt(60),
    seconds: randomInt(60),
    milliseconds: randomInt(1000)
  }
}

function incrementDateComponents(values) {
  return {
    year: (values.year + 1) % 10000,
    month: (values.month + 1) % 12,
    day: (values.day % 28) + 1,
    hours: (values.hours + 1) % 24,
    minutes: (values.minutes + 1) % 60,
    seconds: (values.seconds + 1) % 60,
    milliseconds: (values.milliseconds + 1) % 1000
  }
}

function naiveDateFromValues(values) {
  return new NaiveDate(values.year,
                       values.month,
                       values.day,
                       values.hours,
                       values.minutes,
                       values.seconds,
                       values.milliseconds)
}

function randomNaiveDate() {
  const values = randomDateComponents()
  return naiveDateFromValues(values)
}

describe('constructors', () => {
  it('time value constructor works correctly', () => {
    const values = randomDateComponents()
    const nd = naiveDateFromValues(values)
    const utc = Date.UTC(values.year, values.month, values.day,
                         values.hours, values.minutes, values.seconds, values.milliseconds)
    assert.equal(nd.getTime(), utc)
  })
  it('naive date can be duplicated', () => {
    const nd1 = randomNaiveDate()
    const nd2 = new NaiveDate(nd1)
    assert.equal(nd2.getTime(), nd1.getTime())
  })
  it('ymd constructor works correctly', () => {
    const values = randomDateComponents()
    const nd = new NaiveDate(values.year, values.month, values.day)
    assert.equal(nd.getFullYear(), values.year, 'year')
    assert.equal(nd.getMonth(), values.month, 'month')
    assert.equal(nd.getDate(), values.day, 'day')
    assert.equal(nd.getHours(), 0, 'hours')
    assert.equal(nd.getMinutes(), 0, 'minutes')
    assert.equal(nd.getSeconds(), 0, 'seconds')
    assert.equal(nd.getMilliseconds(), 0, 'milliseconds')
  })
  it('ymdhms constructor works correctly', () => {
    const values = randomDateComponents()
    const nd = new NaiveDate(values.year, values.month, values.day, 
                             values.hours, values.minutes, values.seconds, values.milliseconds)
    assert.equal(nd.getFullYear(), values.year, 'year')
    assert.equal(nd.getMonth(), values.month, 'month')
    assert.equal(nd.getDate(), values.day, 'day')
    assert.equal(nd.getHours(), values.hours, 'hours')
    assert.equal(nd.getMinutes(), values.minutes, 'minutes')
    assert.equal(nd.getSeconds(), values.seconds, 'seconds')
    assert.equal(nd.getMilliseconds(), values.milliseconds, 'milliseconds')
  })
})

describe('setters', () => {
  function withContext(fn) {
    const values = randomDateComponents()
    return () => {
      fn(values, naiveDateFromValues(values), incrementDateComponents(values))
    }
  }
  it('setFullYear(year)', withContext((values, nd, newValues) => {
    nd.setFullYear(newValues.year)
    assert.equal(nd.getFullYear(), newValues.year, 'year')
    assert.equal(nd.getMonth(), values.month, 'month')
    assert.equal(nd.getDate(), values.day, 'day')
  }))
  it('setFullYear(year, month)', withContext((values, nd, newValues) => {
    nd.setFullYear(newValues.year, newValues.month)
    assert.equal(nd.getFullYear(), newValues.year, 'year')
    assert.equal(nd.getMonth(), newValues.month, 'month')
    assert.equal(nd.getDate(), values.day, 'day')
  }))
  it('setFullYear(year, month, day)', withContext((values, nd, newValues) => {
    nd.setFullYear(newValues.year, newValues.month, newValues.day)
    assert.equal(nd.getFullYear(), newValues.year, 'year')
    assert.equal(nd.getMonth(), newValues.month, 'month')
    assert.equal(nd.getDate(), newValues.day, 'day')
  }))
  it('setMonth(month)', withContext((values, nd, newValues) => {
    nd.setMonth(newValues.month)
    assert.equal(nd.getMonth(), newValues.month, 'month')
    assert.equal(nd.getDate(), values.day, 'day')
  }))
  it('setMonth(month, day)', withContext((values, nd, newValues) => {
    nd.setMonth(newValues.month, newValues.day)
    assert.equal(nd.getMonth(), newValues.month, 'month')
    assert.equal(nd.getDate(), newValues.day, 'day')
  }))
  it('setDate(day)', withContext((values, nd, newValues) => {
    nd.setDate(newValues.day)
    assert.equal(nd.getDate(), newValues.day, 'day')
  }))
  it('setHours(hours)', withContext((values, nd, newValues) => {
    nd.setHours(newValues.hours)
    assert.equal(nd.getHours(), newValues.hours, 'hours')
    assert.equal(nd.getMinutes(), values.minutes, 'minutes')
    assert.equal(nd.getSeconds(), values.seconds, 'seconds')
    assert.equal(nd.getMilliseconds(), values.milliseconds, 'milliseconds')
  }))
  it('setHours(hours, minutes)', withContext((values, nd, newValues) => {
    nd.setHours(newValues.hours, newValues.minutes)
    assert.equal(nd.getHours(), newValues.hours, 'hours')
    assert.equal(nd.getMinutes(), newValues.minutes, 'minutes')
    assert.equal(nd.getSeconds(), values.seconds, 'seconds')
    assert.equal(nd.getMilliseconds(), values.milliseconds, 'milliseconds')
  }))
  it('setHours(hours, minutes, seconds)', withContext((values, nd, newValues) => {
    nd.setHours(newValues.hours, newValues.minutes, newValues.seconds)
    assert.equal(nd.getHours(), newValues.hours, 'hours')
    assert.equal(nd.getMinutes(), newValues.minutes, 'minutes')
    assert.equal(nd.getSeconds(), newValues.seconds, 'seconds')
    assert.equal(nd.getMilliseconds(), values.milliseconds, 'milliseconds')
  }))
  it('setHours(hours, minutes, seconds, milliseconds)', withContext((values, nd, newValues) => {
    nd.setHours(newValues.hours, newValues.minutes, newValues.seconds, newValues.milliseconds)
    assert.equal(nd.getHours(), newValues.hours, 'hours')
    assert.equal(nd.getMinutes(), newValues.minutes, 'minutes')
    assert.equal(nd.getSeconds(), newValues.seconds, 'seconds')
    assert.equal(nd.getMilliseconds(), newValues.milliseconds, 'milliseconds')
  }))
  it('setMinutes(minutes)', withContext((values, nd, newValues) => {
    nd.setMinutes(newValues.minutes)
    assert.equal(nd.getMinutes(), newValues.minutes, 'minutes')
    assert.equal(nd.getSeconds(), values.seconds, 'seconds')
    assert.equal(nd.getMilliseconds(), values.milliseconds, 'milliseconds')
  }))
  it('setMinutes(minutes, seconds)', withContext((values, nd, newValues) => {
    nd.setMinutes(newValues.minutes, newValues.seconds)
    assert.equal(nd.getMinutes(), newValues.minutes, 'minutes')
    assert.equal(nd.getSeconds(), newValues.seconds, 'seconds')
    assert.equal(nd.getMilliseconds(), values.milliseconds, 'milliseconds')
  }))
  it('setMinutes(minutes, seconds, milliseconds)', withContext((values, nd, newValues) => {
    nd.setMinutes(newValues.minutes, newValues.seconds, newValues.milliseconds)
    assert.equal(nd.getMinutes(), newValues.minutes, 'minutes')
    assert.equal(nd.getSeconds(), newValues.seconds, 'seconds')
    assert.equal(nd.getMilliseconds(), newValues.milliseconds, 'milliseconds')
  }))
  it('setSeconds(seconds)', withContext((values, nd, newValues) => {
    nd.setSeconds(newValues.seconds)
    assert.equal(nd.getSeconds(), newValues.seconds, 'seconds')
    assert.equal(nd.getMilliseconds(), values.milliseconds, 'milliseconds')
  }))
  it('setSeconds(seconds, milliseconds)', withContext((values, nd, newValues) => {
    nd.setSeconds(newValues.seconds, newValues.milliseconds)
    assert.equal(nd.getSeconds(), newValues.seconds, 'seconds')
    assert.equal(nd.getMilliseconds(), newValues.milliseconds, 'milliseconds')
  }))
  it('setMilliseconds(milliseconds)', withContext((values, nd, newValues) => {
    nd.setMilliseconds(newValues.milliseconds)
    assert.equal(nd.getMilliseconds(), newValues.milliseconds, 'milliseconds')
  }))
})

describe('Date to NaiveDate', () => {
  it('Date to NaiveDate in UTC', () => {
    const nd = NaiveDate.from(new Date(Date.UTC(2022, 2, 1, 10, 20, 30, 400)), 'UTC')
    assert.equal(nd.getFullYear(), 2022, 'year')
    assert.equal(nd.getMonth(), 2, 'month')
    assert.equal(nd.getDate(), 1, 'day')
    assert.equal(nd.getHours(), 10, 'hours')
    assert.equal(nd.getMinutes(), 20, 'minutes')
    assert.equal(nd.getSeconds(), 30, 'seconds')
    assert.equal(nd.getMilliseconds(), 400, 'milliseconds')
  })
  it('Date to NaiveDate in IST (+530)', () => {
    const nd = NaiveDate.from(new Date(Date.UTC(2022, 2, 1, 10, 20, 30, 400)), 'Asia/Kolkata')
    assert.equal(nd.getFullYear(), 2022, 'year')
    assert.equal(nd.getMonth(), 2, 'month')
    assert.equal(nd.getDate(), 1, 'day')
    assert.equal(nd.getHours(), 15, 'hours')
    assert.equal(nd.getMinutes(), 50, 'minutes')
    assert.equal(nd.getSeconds(), 30, 'seconds')
    assert.equal(nd.getMilliseconds(), 400, 'milliseconds')
  })
  it('Date to NaiveDate in EST (-5)', () => {
    const nd = NaiveDate.from(new Date(Date.UTC(2022, 2, 1, 10, 20, 30, 400)), 'America/New_York')
    assert.equal(nd.getFullYear(), 2022, 'year')
    assert.equal(nd.getMonth(), 2, 'month')
    assert.equal(nd.getDate(), 1, 'day')
    assert.equal(nd.getHours(), 5, 'hours')
    assert.equal(nd.getMinutes(), 20, 'minutes')
    assert.equal(nd.getSeconds(), 30, 'seconds')
    assert.equal(nd.getMilliseconds(), 400, 'milliseconds')
  })
  it('Date to NaiveDate in EDT (-4)', () => {
    const nd = NaiveDate.from(new Date(Date.UTC(2022, 8, 1, 10, 20, 30, 400)), 'America/New_York')
    assert.equal(nd.getFullYear(), 2022, 'year')
    assert.equal(nd.getMonth(), 8, 'month')
    assert.equal(nd.getDate(), 1, 'day')
    assert.equal(nd.getHours(), 6, 'hours')
    assert.equal(nd.getMinutes(), 20, 'minutes')
    assert.equal(nd.getSeconds(), 30, 'seconds')
    assert.equal(nd.getMilliseconds(), 400, 'milliseconds')
  })
})

describe('NaiveDate to Date', () => {
  it('NaiveDate to Date in UTC', () => {
    const nd = new NaiveDate(2022, 2, 1, 10, 20, 30, 400)
    const date = nd.toDate('UTC')
    assert.equal(date.getUTCFullYear(), 2022, 'year')
    assert.equal(date.getUTCMonth(), 2, 'month')
    assert.equal(date.getUTCDate(), 1, 'day')
    assert.equal(date.getUTCHours(), 10, 'hours')
    assert.equal(date.getUTCMinutes(), 20, 'minutes')
    assert.equal(date.getUTCSeconds(), 30, 'seconds')
    assert.equal(date.getUTCMilliseconds(), 400, 'milliseconds')
  })
  it('NativeDate to Date in IST (+530)', () => {
    const nd = new NaiveDate(2022, 2, 1, 10, 20, 30, 400)
    const date = nd.toDate('Asia/Kolkata')
    assert.equal(date.getUTCFullYear(), 2022, 'year')
    assert.equal(date.getUTCMonth(), 2, 'month')
    assert.equal(date.getUTCDate(), 1, 'day')
    assert.equal(date.getUTCHours(), 4, 'hours')
    assert.equal(date.getUTCMinutes(), 50, 'minutes')
    assert.equal(date.getUTCSeconds(), 30, 'seconds')
    assert.equal(date.getUTCMilliseconds(), 400, 'milliseconds')
  })
  it('NativeDate to Date in EST (-5)', () => {
    const nd = new NaiveDate(2022, 2, 1, 10, 20, 30, 400)
    const date = nd.toDate('America/New_York')
    assert.equal(date.getUTCFullYear(), 2022, 'year')
    assert.equal(date.getUTCMonth(), 2, 'month')
    assert.equal(date.getUTCDate(), 1, 'day')
    assert.equal(date.getUTCHours(), 15, 'hours')
    assert.equal(date.getUTCMinutes(), 20, 'minutes')
    assert.equal(date.getUTCSeconds(), 30, 'seconds')
    assert.equal(date.getUTCMilliseconds(), 400, 'milliseconds')
  })
  it('NativeDate to Date in EDT (-4)', () => {
    const nd = new NaiveDate(2022, 8, 1, 10, 20, 30, 400)
    const date = nd.toDate('America/New_York')
    assert.equal(date.getUTCFullYear(), 2022, 'year')
    assert.equal(date.getUTCMonth(), 8, 'month')
    assert.equal(date.getUTCDate(), 1, 'day')
    assert.equal(date.getUTCHours(), 14, 'hours')
    assert.equal(date.getUTCMinutes(), 20, 'minutes')
    assert.equal(date.getUTCSeconds(), 30, 'seconds')
    assert.equal(date.getUTCMilliseconds(), 400, 'milliseconds')
  })
})
