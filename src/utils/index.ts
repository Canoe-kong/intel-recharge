import * as toolApi from './normal'
import * as promisify from './promisify'
import * as logic from './logic'

const utils={
  ...toolApi,
  ...promisify,
  ...logic,
}

export default utils