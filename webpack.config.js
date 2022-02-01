import path from 'path'
const __dirname = path.resolve()

export default {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    'naive-date': {
      import: './naive-date.js',
      library: {
        name: 'NaiveDate',
        type: 'var',
        export: 'default'
      }
    },
    'naive-date.test': {
      import: './naive-date.test.js'
    }
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
}
