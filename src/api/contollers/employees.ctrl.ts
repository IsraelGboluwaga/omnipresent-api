import { Request, Response } from 'express'

import { IEmployeeInputData } from '../interfaces/employees.intf'
import { constants } from '../lib/constants'
import { failure, success } from '../lib/response'
import { getEmployeeCountryDetails } from '../services/employees'

const { SUCCESSFUL } = constants

const handleGetEmployeesCountryDetails = async (req: Request, res: Response) => {
  try {
    const { list } = req.body
    const data = await getEmployeeCountryDetails(list as IEmployeeInputData[])
    return success({ res, data, message: SUCCESSFUL, httpCode: 200 })
  } catch (error) {
    return failure({
      res,
      message: error.message || 'Error fetching country details',
      errStack: error.stack,
      httpCode: error.code || 500,
    })
  }
}

export { handleGetEmployeesCountryDetails }
