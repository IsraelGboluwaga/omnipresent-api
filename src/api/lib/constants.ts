export const corsWhitelist: string[] = ['*']

export const { JWT_SECRET, NODE_ENV, PORT } = process.env

export const constants = {
  SUCCESSFUL: 'successful',
  COUNTRIES_BY_CODES_URL: 'https://restcountries.eu/rest/v2/alpha?codes=',
  REGIONS_WITH_ADDITIONAL_IDENTIFIER: ['asia', 'europe'],
}
