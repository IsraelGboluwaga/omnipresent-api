import { isUndefined, omitBy } from 'lodash/fp'
import { OmitByValue } from 'utility-types'

const omitUndefined = <T>(obj: T) => omitBy(isUndefined, obj) as OmitByValue<T, undefined>

export { omitUndefined }
