/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */

export default async function bitsFetch(data, action, queryParam = null, method = 'POST', signal) {
  const uri = new URL(typeof btcbi === 'undefined' ? bitFromsFront?.ajaxURL : btcbi.ajaxURL)

  if (method.toLowerCase() === 'get') {
    uri.searchParams.append('action', `btcbi_${action}`)
    uri.searchParams.append('_ajax_nonce', typeof btcbi === 'undefined' ? '' : btcbi.nonce)
  }
  // append query params in url
  if (queryParam) {
    for (const key in queryParam) {
      if (key) {
        uri.searchParams.append(key, queryParam[key])
      }
    }
  }

  const options = {
    method,
    headers: {},
    signal
  }

  if (method.toLowerCase() === 'post') {
    /**
     * @type FormData
     */
    let formData
    if (!(data instanceof FormData)) {
      formData = new FormData()
      formData.set('data', JSON.stringify(data))
    } else {
      formData = data
    }

    formData.set('action', `btcbi_${action}`)
    formData.set('_ajax_nonce', typeof btcbi === 'undefined' ? '' : btcbi.nonce)

    options.body = formData
  }
  const response = await fetch(uri, options)
    .then((res) => res.text())
    .then((res) => {
      try {
        return JSON.parse(res)
      } catch (error) {
        const parsedRes = res.match(/{"success":(?:[^{}]*)*}/)
        return parsedRes ? JSON.parse(parsedRes[0]) : { success: false, data: res }
      }
    })

  return response
}
