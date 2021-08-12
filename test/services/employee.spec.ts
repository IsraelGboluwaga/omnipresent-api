import axios from 'axios'
import { assert, expect } from 'chai'
import uniq from 'lodash/fp/uniq'

import OmnipresentError from '../../src/api/lib/error'
import {
  getEmployeeCountryDetails,
  getEmployeeCountryMatch,
  getUniqueCountriesFromEmployeeList,
  pullOutCountryInfoFromData,
} from '../../src/api/services/employees'

let testCountryData: any[]
const list = [
  {
    firstName: 'Lisa',
    lastName: 'Testora',
    dateOfBirth: '11/07/1984',
    jobTitle: 'CTO',
    company: 'Test co',
    country: 'GBR',
  },
  {
    firstName: 'Selina',
    lastName: 'Testo',
    dateOfBirth: '23/11/1972',
    jobTitle: 'Software developer',
    company: 'Mock industries',
    country: 'IND',
  },
  {
    firstName: 'Tim',
    lastName: 'Mockman',
    dateOfBirth: '12/11/1972',
    jobTitle: 'Software developer',
    company: 'Mock industries',
    country: 'IND',
  },
  {
    firstName: 'Melissa',
    lastName: 'Mocker',
    dateOfBirth: '10/01/1982',
    jobTitle: 'Software developer',
    company: 'Mock industries',
    country: 'US',
  },
]

before(async () => {
  const { data } = await axios.get('https://restcountries.eu/rest/v2/all')
  testCountryData = data
})

describe('pullOutCountryInfoFromData', () => {
  it('should pull out relevant country info from the data passed in', () => {
    const countryInfo: any[] = pullOutCountryInfoFromData(testCountryData)
    expect(countryInfo).to.be.an('array')
    expect(countryInfo).to.have.lengthOf(testCountryData.length)
    expect(countryInfo[0].fullName).to.be.a('string')
    expect(countryInfo[0].currency).to.be.a('string')
    expect(countryInfo[0].timezones).to.be.an('array')
    expect(countryInfo[0].timezones[0]).to.be.a('string')
    expect(countryInfo[0].languages).to.be.an('array')
    for (const lang of countryInfo[0].languages) {
      expect(lang).to.be.a('string')
    }
    expect(countryInfo[0].alphaCodes).to.be.an('array')
    expect(countryInfo[0].alphaCodes[0]).to.be.a('string')
    expect(countryInfo[0].alphaCodes[1]).to.be.a('string')
    expect(countryInfo[0].region).to.be.a('string')
  })

  it('should throw an error if data is an empty array', () => {
    try {
      pullOutCountryInfoFromData([])
    } catch (error) {
      expect((error as OmnipresentError).message).to.be.a('string')
      expect((error as OmnipresentError).message).to.equal(
        'No data available to fetch country info from'
      )
      expect((error as OmnipresentError).status).to.be.a('number')
      expect((error as OmnipresentError).status).to.equal(404)
    }
  })
})

describe('getEmployeeCountryMatch', () => {
  it('should return match country info correctly', () => {
    const countryInfo = pullOutCountryInfoFromData(testCountryData)
    const match = getEmployeeCountryMatch(list[0], countryInfo)
    assert(match.alphaCodes.includes(list[0].country))
  })

  it('should throw an error if countryInfo is an empty array', () => {
    try {
      getEmployeeCountryMatch(list[0], [])
    } catch (error) {
      assert(typeof error === 'object')
      expect((error as OmnipresentError).message).to.be.equal('countryInfo can not be empty')
      expect((error as OmnipresentError).status).to.be.equal(400)
    }
  })
})

describe('getUniqueCountriesFromEmployeeList', () => {
  it('should get correct unique countries from employee list', () => {
    const uniqueCountries = getUniqueCountriesFromEmployeeList(list)
    expect(uniqueCountries).to.not.be.lengthOf(list.length) //there's a repitition in the original list
    assert(uniq(uniqueCountries).length === uniqueCountries.length)
  })

  it('should throw an error if the input array is empty', () => {
    try {
      getUniqueCountriesFromEmployeeList([])
    } catch (error) {
      assert(typeof error === 'object')
      expect((error as OmnipresentError).message).to.be.equal('employeeList can not be empty')
      expect((error as OmnipresentError).status).to.be.equal(400)
    }
  })
})

describe('getEmployeeCountryDetails', () => {
  it('should get employee country details correctly', async () => {
    const result = await getEmployeeCountryDetails(list)
    expect(result).to.have.lengthOf(list.length)
    for (const employee of result) {
      expect(employee.firstName).to.exist
      expect(employee.lastName).to.exist
      expect(employee.dateOfBirth).to.exist
      expect(employee.jobTitle).to.exist
      expect(employee.company).to.exist
      expect(employee.country).to.exist
      expect(employee.countryInfo).to.exist
      expect(employee.countryInfo.fullName).to.be.a('string')
      expect(employee.countryInfo.currency).to.be.a('string')
      expect(employee.countryInfo.timezones).to.be.an('array')
      expect(employee.countryInfo.languages).to.be.an('array')
      for (const lang of [...employee.countryInfo.languages, ...employee.countryInfo.timezones]) {
        expect(lang).to.be.a('string')
      }
    }
  })

  it('should throw an error if the input array is empty', async () => {
    try {
      await getEmployeeCountryDetails([])
    } catch (error) {
      assert(typeof error === 'object')
      expect((error as OmnipresentError).message).to.be.equal('input array can not be empty')
      expect((error as OmnipresentError).status).to.be.equal(400)
    }
  })
})
