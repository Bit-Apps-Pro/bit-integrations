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

export const refreshSuiteDashFields = (
  suiteDashConf,
  setSuiteDashConf,
  setIsLoading,
  setSnackbar,
) => {
  setIsLoading(true)
  const requestParams = {
    public_id: suiteDashConf.public_id,
    secret_key: suiteDashConf.secret_key,
    action_name: suiteDashConf.actionName,
  }

  bitsFetch(requestParams, "suite_dash_fetch_all_fields")
    .then((result) => {
      if (result && result.success) {
        setSuiteDashConf(prevSuiteDashConf => {
          const draftConf = { ...prevSuiteDashConf }
          draftConf.field_map = [
            { formField: '', suiteDashFormField: '' },
          ]

          if (result.data) {
            draftConf.suiteDashFields = result.data
            draftConf.field_map = generateMappedField(draftConf)
          }
          return draftConf
        })
        setSnackbar({
          show: true,
          msg: __("SuiteDash fields refreshed", "bit-integrations"),
        })
      } else {
        setSnackbar({
          show: true,
          msg: __(
            "SuiteDash fields refresh failed. please try again",
            "bit-integrations"
          ),
        })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const generateMappedField = (suiteDashConf) => {
  const requiredFlds = suiteDashConf?.suiteDashFields && suiteDashConf?.suiteDashFields.filter(
    (fld) => fld.required === true && fld.key !== 'owner' && fld.key !== 'pipeline'
  )
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
      formField: "",
      suiteDashFormField: field.key,
    }))
    : [{ formField: "", suiteDashFormField: "" }]
}

export const checkMappedFields = (suiteDashConf) => {
  const mappedFields = suiteDashConf?.field_map
    ? suiteDashConf.field_map.filter(
      (mappedField) =>
        !mappedField.formField ||
        !mappedField.suiteDashFormField ||
        (mappedField.formField === "custom" && !mappedField.customValue) ||
        (mappedField.suiteDashFormField === "customFieldKey" &&
          !mappedField.customFieldKey)
    )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const suiteDashAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.public_id || !confTmp.secret_key) {
    setError({
      public_id: !confTmp.public_id
        ? __("Public Id can't be empty", "bit-integrations")
        : "",
      secret_key: !confTmp.secret_key
        ? __("Secret Key can't be empty", "bit-integrations")
        : "",
    })
    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = {
    public_id: confTmp.public_id,
    secret_key: confTmp.secret_key
  }

  bitsFetch(requestParams, "suite_dash_authentication").then((result) => {
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

export const getAllCompanies = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, companies: true })

  const requestParams = {
    public_id: confTmp.public_id,
    secret_key: confTmp.secret_key
  }

  bitsFetch(requestParams, "suite_dash_fetch_all_companies").then(
    (result) => {
      if (result && result.success) {
        if (result.data) {
          setConf(prevConf => {
            prevConf.companies = result.data
            return prevConf
          })

          setLoading({ ...setLoading, companies: false })
          toast.success(
            __("Companies fetched successfully", "bit-integrations")
          )
          return
        }
        setLoading({ ...setLoading, companies: false })
        toast.error(
          __("Companies Not Found!", "bit-integrations")
        )
        return
      }
      setLoading({ ...setLoading, companies: false })
      toast.error(
        __("Companies fetching failed", "bit-integrations")
      )
    }
  )
}
