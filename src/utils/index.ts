import * as toolApi from './normal'
import * as promisify from './promisify'

const utils={
  ...toolApi,
  ...promisify,
}

export default utils