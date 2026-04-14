import { create } from 'mutative'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import { asgarosForumActionFields } from './staticData'

export const handleInput = (e, asgarosForumConf, setAsgarosForumConf) => {
  const newConf = create(asgarosForumConf, draftConf => {
    draftConf[e.target.name] = e.target.value
  })
  setAsgarosForumConf(newConf)
}

export const getActionFields = action => asgarosForumActionFields[action] || []

export const generateMappedField = allFields => {
  if (!allFields?.length) {
    return []
  }

  const requiredFlds = allFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map(field => ({ formField: '', asgarosForumField: field.key }))
    : [{ formField: '', asgarosForumField: '' }]
}

export const checkMappedFields = asgarosForumConf => {
  const { mainAction, field_map: fieldMap = [] } = asgarosForumConf || {}

  if (!mainAction) {
    return false
  }

  const requiredFields = getActionFields(mainAction).filter(field => field.required)

  if (!requiredFields.length) {
    return true
  }

  return requiredFields.every(requiredField =>
    fieldMap.some(
      mappedField =>
        mappedField?.asgarosForumField === requiredField.key &&
        mappedField?.formField &&
        (mappedField.formField !== 'custom' || mappedField?.customValue)
    )
  )
}

export const asgarosForumAuthentication = (
  confTmp,
  setAsgarosForumConf,
  setError,
  setIsAuthorized,
  setIsLoading
) => {
  if (!confTmp?.name) {
    setError({
      name: __("Integration name can't be empty", 'bit-integrations')
    })
    return
  }

  setError({})
  setIsLoading(true)

  bitsFetch({ name: confTmp.name }, 'asgaros_forum_authorize')
    .then(result => {
      if (result?.success) {
        setIsAuthorized(true)
        setAsgarosForumConf(prevConf =>
          create(prevConf, draftConf => {
            draftConf.name = confTmp.name
          })
        )
      } else {
        setError({
          name: result?.data || __('Authorization failed', 'bit-integrations')
        })
      }
    })
    .catch(() => {
      setError({
        name: __('Authorization failed', 'bit-integrations')
      })
    })
    .finally(() => {
      setIsLoading(false)
    })
}
