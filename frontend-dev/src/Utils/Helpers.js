import { __ } from './i18nwrap'

export const deepCopy = (target, map = new WeakMap()) => {
  if (typeof target !== 'object' || target === null) {
    return target
  }
  const forEach = (array, iteratee) => {
    let index = -1
    const { length } = array
    // eslint-disable-next-line no-plusplus
    while (++index < length) {
      iteratee(array[index], index)
    }
    return array
  }

  const isArray = Array.isArray(target)
  const cloneTarget = isArray ? [] : {}

  if (map.get(target)) {
    return map.get(target)
  }
  map.set(target, cloneTarget)

  if (isArray) {
    forEach(target, (value, index) => {
      cloneTarget[index] = deepCopy(value, map)
    })
  } else {
    forEach(Object.keys(target), (key, index) => {
      cloneTarget[key] = deepCopy(target[key], map)
    })
  }
  return cloneTarget
}

export const sortArrOfObj = (data, sortLabel) =>
  data.sort((a, b) => {
    if (a?.[sortLabel]?.toLowerCase() < b?.[sortLabel]?.toLowerCase()) return -1
    if (a?.[sortLabel]?.toLowerCase() > b?.[sortLabel]?.toLowerCase()) return 1
    return 0
  })

export const checkValidEmail = email => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true
  }
  return false
}

export const sortByField = (array, fieldKey, typ) =>
  array.sort((a, b) => {
    const x = a[fieldKey]
    const y = b[fieldKey]
    if (typ === 'ASC') {
      return x < y ? -1 : x > y ? 1 : 0
    }
    return y < x ? -1 : y > x ? 1 : 0
  })

export const sortObj = obj =>
  Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key]
      return result
    }, {})

export const sortFreeProd = obj => {
  const newData = deepCopy(obj)
  const sortedTriggers = sortObj(newData)
  const freeProd = []
  Object.keys(obj).forEach(key => {
    if (!obj[key].isPro) {
      freeProd.push(key)
    }
  })

  const freeProductData = freeProd.reduce((accr, curr) => {
    const tempAccr = { ...accr }
    if (newData[curr]) {
      tempAccr[curr] = newData[curr]
      delete newData[curr]
    }
    return tempAccr
  }, {})

  return { ...freeProductData, ...sortedTriggers }
}

export const extractValueFromPath = (json, path) => {
  const parts = Array.isArray(path) ? path : path.split('.')
  if (parts.length === 0) {
    return json
  }

  const currentPart = parts.shift()
  if (Array.isArray(json)) {
    const index = parseInt(currentPart, 10)
    if (isNaN(index) || index >= json.length) {
      toast.error(__('Index out of bounds or invalid', 'bit-integrations'))
      return
    }

    return extractValueFromPath(json[index], parts)
  }

  if (json && typeof json === 'object') {
    if (!(currentPart in json)) {
      toast.error(__('Invalid path', 'bit-integrations'))
      retrun
    }

    return extractValueFromPath(json[currentPart], parts)
  }

  toast.error(__('Invalid path', 'bit-integrations'))
  return
}

const isLinkEmpty = link => {
  return link === '' || link === '#'
}

export const TriggerDocLink = (doc, youtube) => {
  return !isLinkEmpty(doc) || !isLinkEmpty(youtube)
    ? `<h5>
          ${__('More Details on', 'bit-integrations')} 
          ${!isLinkEmpty(doc) ? `<a className="btcd-link" href=${doc} target="_blank" rel="noreferrer">${__('Documentation', 'bit-integrations')}</a>` : ''}
          ${!isLinkEmpty(doc) && !isLinkEmpty(youtube) ? __('or', 'bit-integrations') : ''}
          ${!isLinkEmpty(youtube) ? `<a className="btcd-link" href=${youtube} target="_blank" rel="noreferrer">${__('Youtube Tutorials', 'bit-integrations')}</a>` : ''}
        </h5 > `
    : ''
}
