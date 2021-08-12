class OmnipresentError extends Error {
  readonly name: string
  public status: number
  public message: string

  constructor(message: string, code = 500) {
    super(message)
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.message = message
    this.status = code
  }
}

export default OmnipresentError
