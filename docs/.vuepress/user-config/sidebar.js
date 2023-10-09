import * as modules from './sidebar/index'

export default Object.keys(modules).reduce((initState, key) => {
  Object.assign(initState, modules[key])
  return initState
}, {})


