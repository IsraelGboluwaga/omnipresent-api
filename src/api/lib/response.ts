import { Response } from 'express'

const SUCCESSFUL = 'successful'

interface IData {
  data?: any
  message: string
  errStack?: any
}

interface IRespond {
  res: Response
  status: boolean
  data: IData
  httpCode: number
}

function respond({ res, status, httpCode, data }: IRespond) {
  const response = {
    status,
    data: data.data,
    message: data.message,
  }
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Method', '*')
  return res.status(httpCode).send(response)
}

interface ISuccess {
  res: Response
  data: any
  httpCode: number
  message?: string
}

export const success = ({ res, data, message, httpCode }: ISuccess) => {
  const dataToSend: IData = {
    data,
    message: message || SUCCESSFUL,
  }
  return respond({ res, status: true, httpCode, data: dataToSend })
}

interface IFail {
  res: Response
  message: string
  errStack?: any
  httpCode: number
}

export const failure = ({ res, message, errStack, httpCode }: IFail) => {
  const dataToSend: IData = {
    message,
    errStack,
  }
  return respond({ res, status: false, httpCode, data: dataToSend })
}
