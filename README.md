# naive-date

Use a `NaiveDate` as opposed to [`Date`][Date] when you want a Date like object,
but one that's not a timestamp. For example,

1. You want a YMD date and a time, but these are not linked to any time zone
2. You want to perform timezone conversions i.e. given a timestamp, what is the
   local time in Asia/Kolkata v/s America/New_York?
3. You want to perform calendrical calculations without worrying about the
   impact of DST transitions (e.g. would adding 86400 seconds always add one
   whole day?)

`NaiveDate`'s API is very similar to that of `Date` and includes all of its
warts, like month indexes starting from 0. Use `NaiveDate` when you want to work
with a `Date` like object and don't want to bring in a full fledged date/time
handling library in your code.

The term *naive* is inspired by its usage in the [Python datetime module][],
which categorizes date and time objects as "aware" or "naive" depending on
whether they include time zone information or not.

## Usage

### Installation

Install using npm:

```
npm install naive-date
```

Or include it directly in your HTML page

```html
<script src="https://unpkg.com/naive-date@0.2.0/dist/naive-date.js"></script>
```

### Creation

To create a NaiveDate, you can use the constructor.

```js
import NaiveDate from 'naive-date'

// date only
// since we use 0 based indexes, the month below is Feb, not Jan
const x = new NaiveDate(2022, 1, 1)

// date and time
const y = new NaiveDate(2022, 1, 1, 10, 0, 0)
```

Since a `NaiveDate` is not linked to any time zone (and it's not a timestamp),
when you print it you won't see any zone info:

```js
x.toString()
// => '2022-02-01T00:00:00.000'

y.toString()
// => '2022-02-01T10:00:00.000'
```

### Getters and Setters

Just like `Date`, `NaiveDate` exposes the following getters and setters:

```js
import NaiveDate from 'naive-date'

const x = new NaiveDate(2022, 1, 1, 10, 0, 0)

x.getFullYear()     // 2022
x.getMonth()        // 1
x.getDate()         // 1
x.getHours()        // 10
x.getMinutes()      // 0
x.getSeconds()      // 0
x.getMilliseconds() // 0
x.getDay()          // 2

x.setFullYear()
x.setMonth()
x.setDate()
x.setHours()
x.setMinutes()
x.setSeconds()
x.setMilliseconds()
```

There's no equivalent for `getUTC...` and `setUTC...` methods since they don't
make sense (`NaiveDate` is not a timestamp).

There's no equivalent for `getTimezoneOffset()` either, since a NaiveDate, by
definition, is not linked to any time zone.

### Timezone converstions

Given a timestamp (i.e. a `Date`), use the static method `from()` to get the
local time in a given time zone.

```js
import NaiveDate from 'naive-date'

const x = new Date(Date.UTC(2022, 1, 1, 10, 0, 0))
// => 2022-02-01T10:00:00.000Z

const y = NaiveDate.from(x, 'Asia/Kolkata')
y.toString()
// => '2022-02-01T15:30:00.000'

const z = NaiveDate.from(x, 'America/New_York')
z.toString()
// => '2022-02-01T05:00:00.000'
```

And to do the opposite i.e. to get a timestamp given a `NaiveDate` and a
timezone, use the instance method `.toDate()`. This method returns a `Date`.

```js
import NaiveDate from 'naive-date'

const x = new NaiveDate(2022, 1, 1, 10, 0, 0)
x.toString()
// => '2022-02-01T10:00:00.000'

x.toDate('Asia/Kolkata')
// => 2022-02-01T04:30:00.000Z

x.toDate('America/New_York')
// => 2022-02-01T15:00:00.000Z
```

[Date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[Python datetime module]: https://docs.python.org/3/library/datetime.html

## Tests

To run tests on the command line using node.js, run `npm test`.

To run them in the browser, open [mocha.html](mocha.html).
