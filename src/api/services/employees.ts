import axios from 'axios'
import { compact, isEmpty, map, omit, toUpper, uniq } from 'lodash/fp'

import {
  IEmployeeCountryData,
  IEmployeeCountryMatchData,
  IEmployeeInputData,
} from '../interfaces/employees.intf'
import { constants } from '../lib/constants'
import OmnipresentError from '../lib/error'

const { COUNTRIES_BY_CODES_URL, REGIONS_WITH_ADDITIONAL_IDENTIFIER } = constants

const getEmployeeCountryMatch = (
  employee: IEmployeeInputData,
  countryInfo: IEmployeeCountryMatchData[]
): IEmployeeCountryMatchData => {
  if (!countryInfo.length) {
    throw new OmnipresentError('countryInfo can not be empty', 400)
  }
  return compact(
    countryInfo.filter((info: IEmployeeCountryMatchData) => {
      if (info.alphaCodes.includes(employee.country.toUpperCase())) {
        return info
      }
      return null
    })
  )[0]
}

const pullOutCountryInfoFromData = (data: any[]): IEmployeeCountryMatchData[] => {
  if (!data || isEmpty(data)) {
    throw new OmnipresentError('No data available to fetch country info from', 404)
  }

  return map(
    (country: any): IEmployeeCountryMatchData => {
      const languages = map(({ name }) => name)(country.languages)
      return {
        fullName: country.name,
        currency: country.currencies[0].code,
        timezones: country.timezones,
        languages,
        alphaCodes: map(toUpper)([country.alpha2Code, country.alpha3Code]),
        region: country.region,
      }
    }
  )(data)
}

const getCountriesData = async (countriesForQueryString: string) => {
  const { data } = await axios.get(COUNTRIES_BY_CODES_URL + countriesForQueryString)
  if (!data) {
    throw new OmnipresentError('No info available for employee countries', 404)
  }
  return data
}

const getUniqueCountriesFromEmployeeList = (employeeList: IEmployeeInputData[]) => {
  if (isEmpty(employeeList)) {
    throw new OmnipresentError('employeeList can not be empty', 400)
  }
  return uniq(map((employee: IEmployeeInputData) => employee.country)(employeeList))
}

const getEmployeeCountryDetails = async (employeeList: IEmployeeInputData[]) => {
  if (isEmpty(employeeList)) {
    throw new OmnipresentError('input array can not be empty', 400)
  }
  const countries = getUniqueCountriesFromEmployeeList(employeeList)
  const countriesForQueryString = countries.join(';')

  const data: any[] = await getCountriesData(countriesForQueryString)

  const countryInfo: IEmployeeCountryMatchData[] = pullOutCountryInfoFromData(data)

  const result = map((employee: IEmployeeInputData) => {
    let uid
    const matchCountryInfo: IEmployeeCountryMatchData = getEmployeeCountryMatch(
      employee,
      countryInfo
    )

    if (REGIONS_WITH_ADDITIONAL_IDENTIFIER.includes(matchCountryInfo.region.toLowerCase())) {
      uid = `${employee.firstName + employee.lastName + employee.dateOfBirth.split('/').join('')}`
    }

    const response = {
      ...employee,
      countryInfo: omit(['region', 'alphaCodes'])(matchCountryInfo) as IEmployeeCountryData,
    }

    if (uid) {
      ;(response as any).uid = uid
    }
    return response
  })(employeeList)

  return result
}

export {
  getEmployeeCountryDetails,
  getEmployeeCountryMatch,
  getUniqueCountriesFromEmployeeList,
  pullOutCountryInfoFromData,
}
