/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ as i18n_, sprintf as i18nsprintf } from '@wordpress/i18n'
import { APP_CONFIG } from '../config/app'

const __ = (text, domain = 'bit-integrations') => {
  if (APP_CONFIG?.translations && APP_CONFIG.translations[`${text}`]) {
    return APP_CONFIG.translations[`${text}`]
  }

  if (!wp?.i18n) {
    return text
  }
  return i18n_(text, domain)
}

const sprintf = (text, ...vars) => {
  if (!wp?.i18n) {
    const matches = text.match(/%[s d u c o x X bg G e E f F]/g)
    let str = text
    vars.map((val, idx) => {
      str = str.replace(matches[idx], val)
    })
    return str
  }

  return i18nsprintf(text, ...vars)
}

export { __, sprintf }
