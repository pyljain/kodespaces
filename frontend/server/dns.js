const request = require('request-promise')
const DOMAIN = process.env.DOMAIN_NAME
const DOMAIN_FRAGMENT = DOMAIN.split('.').slice(1).join('.')
const PROXY_SERVICE_IP = process.env.PROXY_SERVICE_IP
const GODADDY_KEY = process.env.GD_KEY
const GODADDY_SECRET = process.env.GD_SECRET

const GO_DADDY_API_ENDPOINT = `https://api.godaddy.com/v1/domains/${DOMAIN_FRAGMENT}/records`

const createRecord = async (serviceName) => {

  const body = [
    {
      "data": PROXY_SERVICE_IP,
      "name": `${serviceName}.${DOMAIN.split('.')[0]}`,
      "type": "A"
    }
  ]

  await request.patch(GO_DADDY_API_ENDPOINT,
    {
      json: body,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `sso-key ${GODADDY_KEY}:${GODADDY_SECRET}`
      }
    })
}

module.exports = {
  createRecord
}
