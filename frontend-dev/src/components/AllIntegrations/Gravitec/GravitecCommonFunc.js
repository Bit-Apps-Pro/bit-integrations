/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from "react-hot-toast"
import bitsFetch from "../../../Utils/bitsFetch"
import { __ } from "../../../Utils/i18nwrap"

export const handleInput = (e, salesmateConf, setSalesmateConf) => {
  const newConf = { ...salesmateConf }
  const { name } = e.target
  if (e.target.value !== "") {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setSalesmateConf({ ...newConf })
}

export const generateMappedField = (notificationFields) => {
  const requiredFlds = notificationFields.filter((fld) => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
      formField: "",
      gravitecFormField: field.key,
    }))
    : [{ formField: "", gravitecFormField: "" }]
}

export const checkMappedFields = (gravitecConf) => {
  const mappedFields = gravitecConf?.field_map
    ? gravitecConf.field_map.filter(
      (mappedField) =>
        !mappedField.formField ||
        !mappedField.gravitecFormField ||
        (mappedField.formField === "custom" && !mappedField.customValue) ||
        (mappedField.gravitecFormField === "customFieldKey" &&
          !mappedField.customFieldKey)
    )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const gravitecAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.site_url ||!confTmp.app_key || !confTmp.app_secret) {
    setError({
      site_url: !confTmp.site_url
        ? __("Site Url can't be empty", "bit-integrations")
        : "",
      app_key: !confTmp.app_key
        ? __("App Key can't be empty", "bit-integrations")
        : "",
      app_secret: !confTmp.app_secret
        ? __("App Secret can't be empty", "bit-integrations")
        : "",
    })
    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = {
    site_url: confTmp.site_url,
    app_key: confTmp.app_key,
    app_secret: confTmp.app_secret
  }

  bitsFetch(requestParams, "gravitec_authentication").then((result) => {
    if (result && result.success) {
      setIsAuthorized(true)
      setLoading({ ...loading, auth: false })
      toast.success(__("Authorized successfully", "bit-integrations"))
      return
    }
    setLoading({ ...loading, auth: false })
    toast.error(
      __("Authorized failed, Please enter valid Public Id & Secret Key", "bit-integrations")
    )
  })
}
