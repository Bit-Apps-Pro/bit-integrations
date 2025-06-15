/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from "react-hot-toast";
import bitsFetch from "../../../Utils/bitsFetch";
import { __ } from "../../../Utils/i18nwrap";

export const handleInput = (e, oneHashCRMConf, setOneHashCRMConf) => {
  const newConf = { ...oneHashCRMConf };
  const { name } = e.target;
  if (e.target.value !== "") {
    newConf[name] = e.target.value;
  } else {
    delete newConf[name];
  }
  setOneHashCRMConf({ ...newConf });
};

export const generateMappedField = (oneHashCRMConf) => {
  const requiredFlds =
    oneHashCRMConf?.oneHashCRMFields &&
    oneHashCRMConf?.oneHashCRMFields.filter(
      (fld) =>
        fld.required === true && fld.key !== "owner" && fld.key !== "pipeline"
    );
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: "",
        oneHashCRMFormField: field.key,
      }))
    : [{ formField: "", oneHashCRMFormField: "" }];
};

export const checkMappedFields = (oneHashCRMConf) => {
  const mappedFields = oneHashCRMConf?.field_map
    ? oneHashCRMConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField ||
          !mappedField.oneHashCRMFormField ||
          (mappedField.formField === "custom" && !mappedField.customValue) ||
          (mappedField.oneHashCRMFormField === "customFieldKey" &&
            !mappedField.customFieldKey)
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};

export const oneHashCRMAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.api_key || !confTmp.api_secret || !confTmp.domain) {
    setError({
      api_key: !confTmp.api_key
        ? __("Api Key can't be empty", "bit-integrations")
        : "",
      api_secret: !confTmp.api_secret
        ? __("Api Secret can't be empty", "bit-integrations")
        : "",
      domain: !confTmp.domain
        ? __("Access API URL can't be empty", "bit-integrations")
        : "",
    });
    return;
  }

  setError({});
  setLoading({ ...loading, auth: true });

  const requestParams = {
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret,
    domain: confTmp.domain,
  };

  bitsFetch(requestParams, "onehashcrm_authentication").then((result) => {
    if (result && result.success) {
      setIsAuthorized(true);
      setLoading({ ...loading, auth: false });
      toast.success(__("Authorized successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...loading, auth: false });
    toast.error(
      __(
        "Authorized failed, Please enter valid API Key & Secret or Access Api URL",
        "bit-integrations"
      )
    );
  });
};
