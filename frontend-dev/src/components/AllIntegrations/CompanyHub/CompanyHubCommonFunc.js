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

export const generateMappedField = (companyHubFields) => {
  const requiredFlds = companyHubFields.filter((fld) => fld.required === true)
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
      formField: "",
      companyHubFormField: field.key,
    }))
    : [{ formField: "", companyHubFormField: "" }]
}

export const checkMappedFields = (companyHubConf) => {
  const mappedFields = companyHubConf?.field_map
    ? companyHubConf.field_map.filter(
      (mappedField) =>
        !mappedField.formField ||
        !mappedField.companyHubFormField ||
        (mappedField.formField === "custom" && !mappedField.customValue) ||
        (mappedField.companyHubFormField === "customFieldKey" &&
          !mappedField.customFieldKey)
    )
    : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const companyHubAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.sub_domain || !confTmp.api_key) {
    setError({
      sub_domain: !confTmp.sub_domain
        ? __("Sub Domain can't be empty", "bit-integrations")
        : "",
      api_key: !confTmp.api_key
        ? __("API Key can't be empty", "bit-integrations")
        : "",
    })
    return
  }

  setError({})
  setLoading({ ...loading, auth: true })

  const requestParams = {
    sub_domain: confTmp.sub_domain,
    api_key: confTmp.api_key
  }

  bitsFetch(requestParams, "company_hub_authentication").then((result) => {
    if (result && result.success) {
      setIsAuthorized(true)
      setLoading({ ...loading, auth: false })
      toast.success(__("Authorized successfully", "bit-integrations"))
      return
    }
    setLoading({ ...loading, auth: false })
    toast.error(
      __("Authorized failed, Please enter valid Sub Domain & API Key", "bit-integrations")
    )
  })
}

export const getAllCompanies = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, companies: true })

  const requestParams = {
    sub_domain: confTmp.sub_domain,
    api_key: confTmp.api_key
  }

  bitsFetch(requestParams, "company_hub_fetch_all_companies").then(
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

export const getAllContacts = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, contact: true })

  const requestParams = {
    sub_domain: confTmp.sub_domain,
    api_key: confTmp.api_key
  }

  bitsFetch(requestParams, "company_hub_fetch_all_contacts").then(
    (result) => {
      if (result && result.success) {
        if (result.data) {
          setConf(prevConf => {
            prevConf.contacts = result.data
            return prevConf
          })

          setLoading({ ...setLoading, contact: false })
          toast.success(
            __("Contacts fetched successfully", "bit-integrations")
          )
          return
        }
        setLoading({ ...setLoading, contact: false })
        toast.error(
          __("Contacts Not Found!", "bit-integrations")
        )
        return
      }
      setLoading({ ...setLoading, contact: false })
      toast.error(
        __("Contacts fetching failed", "bit-integrations")
      )
    }
  )
}
