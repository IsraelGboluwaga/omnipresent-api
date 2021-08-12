import { NextFunction, Request, Response } from 'express'
import { isEmpty, map } from 'lodash/fp'

import { failure } from '../lib/response'

const validateEmployeesListInput = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = []
  if (isEmpty(req.body)) {
    errors.push('Empty request body')
  }
  if (!req.body.list || !Array.isArray(req.body.list)) {
    errors.push('invalid type for "list"')
  } else if (req.body.list.length < 1) {
    errors.push('"list" array can not be empty')
  }

  map((element: any, index: number) => {
    if (
      !(
        element.firstName ||
        element.lastName ||
        element.dateOfBirth ||
        element.jobTitle ||
        element.company ||
        element.country
      )
    ) {
      errors.push(`missing element attribute in list index ${index}`)
    }

    for (const [key, value] of Object.entries(element)) {
      if (typeof value !== 'string') {
        errors.push(`Invalid value for ${key} in list index ${index}`)
      }
    }
  })(req.body.list)

  if (errors.length) {
    return failure({
      res,
      message: errors.join(','),
      httpCode: 400,
    })
  }

  return next()
}

export { validateEmployeesListInput }
