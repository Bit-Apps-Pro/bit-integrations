import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { deepCopy } from '../../../Utils/Helpers'
import { sprintf, __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, gamiPressConf, setGamiPressConf, setIsLoading, setSnackbar, formID) => {
  const newConf = { ...gamiPressConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }

  newConf[e.target.name] = e.target.value
  setGamiPressConf({ ...newConf })
}

export const fetchAllRankType = (gamiPressConf, setGamiPressConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { domainName: gamiPressConf.domainName }
  bitsFetch(requestParams, 'gamiPress_fetch_all_rank_type')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...gamiPressConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allRankTypes = result.data
        }
        setGamiPressConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('Rank Type fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('Rank Type fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const fetchAllAchievementType = (gamiPressConf, setGamiPressConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  bitsFetch(null, 'gamiPress_fetch_all_achievement_type')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...gamiPressConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allAchievementTypes = result.data
        }
        setGamiPressConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('All achievement Type fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('All achievement fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}
export const fetchAllAchievementByType = (gamiPressConf, setGamiPressConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { achievementType: gamiPressConf.selectedAchievementType }
  bitsFetch(requestParams, 'gamiPress_fetch_all_achievement_by_type')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...gamiPressConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allAchievements = result.data
        }
        setGamiPressConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('All achievements fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('All achievements fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const fetchAllRankByType = (gamiPressConf, setGamiPressConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { domainName: gamiPressConf.rankType }
  bitsFetch(requestParams, 'gamiPress_fetch_all_rank_by_type')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...gamiPressConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allRanks = result.data
        }
        setGamiPressConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('All rank fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('All rank type fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const fetchAllPointType = (gamiPressConf, setGamiPressConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const requestParams = { domainName: gamiPressConf.rankType }
  bitsFetch(requestParams, 'gamiPress_fetch_all_point_type')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...gamiPressConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data) {
          newConf.default.allPointTypes = result.data
        }
        setGamiPressConf({ ...newConf })
        setIsLoading(false)
        toast.success(__('All point type fetched successfully', 'bit-integrations'))
        return
      }
      setIsLoading(false)
      toast.error(__('All point type fetch failed. please try again', 'bit-integrations'))
    })

    .catch(() => setIsLoading(false))
}

export const generateMappedField = (gamiPressConf) => {
  const requiredFlds = gamiPressConf?.pointFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', gamiPressFormField: field.key })) : [{ formField: '', gamiPressFormField: '' }]
}

export const checkMappedFields = (gamiPressConf) => {
  const mappedFleld = gamiPressConf.field_map ? gamiPressConf.field_map.filter(mapped => (!mapped.formField && !mapped.gamiPressFormField)) : []
  if (mappedFleld.length > 0) {
    return false
  }
  return true
}
