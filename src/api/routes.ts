import '../../setup/envConfig'

import * as express from 'express'

import { handleGetEmployeesCountryDetails } from './contollers/employees.ctrl'
import { validateEmployeesListInput } from './validators/employees.vld'

const routes = (app: express.Router) => {
  app.get('/', (req: express.Request, res: express.Response) =>
    res.status(200).json({ message: 'ok' })
  )

  app.post('/employees/country', validateEmployeesListInput, handleGetEmployeesCountryDetails)

  return app
}

export { routes }
