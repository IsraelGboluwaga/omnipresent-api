export interface IEmployeeInputData {
  firstName: string
  lastName: string
  dateOfBirth: string
  jobTitle: string
  company: string
  country: string
}

export interface IEmployeeCountryData {
  fullName: string
  currency: string
  timezones: string[]
  languages: string[]
}

export interface IEmployeeCountryMatchData extends IEmployeeCountryData {
  alphaCodes: string[]
  region: string
}
