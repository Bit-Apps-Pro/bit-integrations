/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from "react-hot-toast";
import bitsFetch from "../../../Utils/bitsFetch";
import { __ } from "../../../Utils/i18nwrap";

export const handleInput = (e, salesmateConf, setSalesmateConf) => {
  const newConf = { ...salesmateConf };
  const { name } = e.target;
  if (e.target.value !== "") {
    newConf[name] = e.target.value;
  } else {
    delete newConf[name];
  }
  setSalesmateConf({ ...newConf });
};

export const generateMappedField = (nimbleFields) => {
  const requiredFlds = nimbleFields?.filter((fld) => fld.required === true);
  return requiredFlds?.length > 0
    ? requiredFlds?.map((field) => ({
        formField: "",
        nimbleFormField: field.key,
      }))
    : [{ formField: "", nimbleFormField: "" }];
};

export const checkMappedFields = (nimbleConf) => {
  const mappedFields = nimbleConf?.field_map
    ? nimbleConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField ||
          !mappedField.nimbleFormField ||
          (mappedField.formField === "custom" && !mappedField.customValue) ||
          (mappedField.nimbleFormField === "customFieldKey" &&
            !mappedField.customFieldKey)
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};

export const nimbleAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.api_key) {
    setError({
      api_key: !confTmp.api_key
        ? __("API Key can't be empty", "bit-integrations")
        : "",
    });
    return;
  }

  setError({});
  setLoading({ ...loading, auth: true });
  const requestParams = { api_key: confTmp.api_key };

  bitsFetch(requestParams, "nimble_authentication").then((result) => {
    if (result && result.success) {
      setIsAuthorized(true);
      setLoading({ ...loading, auth: false });
      toast.success(__("Authorized successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...loading, auth: false });
    toast.error(
      __("Authorized failed, Please enter valid API Key", "bit-integrations")
    );
  });
};

export const getAllFields = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, allFields: true });
  const requestParams = { api_key: confTmp.api_key };

  bitsFetch(requestParams, "nimble_fetch_all_fields").then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.peopleFields = result.data.person;
          prevConf.companyFields = result.data.company;
          prevConf.xofEmployees = result.data.xofEmployees;
          prevConf.ratings = result.data.ratings;
          prevConf.leadStatus = result.data.leadStatus;
          prevConf.leadSource = result.data.leadSource;
          prevConf.leadTypes = result.data.leadTypes;
          return prevConf;
        });

        setLoading({ ...setLoading, event: false });
        toast.success(__("Fields fetched successfully", "bit-integrations"));
        return;
      }
      setLoading({ ...setLoading, event: false });
      toast.error(__("Fields Not Found!", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, event: false });
    toast.error(__("Fields fetching failed", "bit-integrations"));
  });
};
