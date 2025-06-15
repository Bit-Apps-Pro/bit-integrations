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

export const generateMappedField = (systemeIOFields) => {
  const requiredFlds = systemeIOFields.filter((fld) => fld.required === true);
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: "",
        systemeIOFormField: field.key,
      }))
    : [{ formField: "", systemeIOFormField: "" }];
};

export const checkMappedFields = (systemeIOConf) => {
  const mappedFields = systemeIOConf?.field_map
    ? systemeIOConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField ||
          !mappedField.systemeIOFormField ||
          (mappedField.formField === "custom" && !mappedField.customValue) ||
          (mappedField.systemeIOFormField === "customFieldKey" &&
            !mappedField.customFieldKey)
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};

export const systemeIOAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.api_key ) {
    setError({
      api_key: !confTmp.api_key
        ? __("API Key can't be empty", "bit-integrations")
        : "",
    });
    return;
  }

  setError({});
  setLoading({ ...loading, auth: true });

  const requestParams = {
    api_key: confTmp.api_key,
  };

  bitsFetch(requestParams, "systemeIO_authentication").then((result) => {
    if (result && result.success) {
      setIsAuthorized(true);
      setLoading({ ...loading, auth: false });
      toast.success(__("Authorized successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...loading, auth: false });
    toast.error(
      __(
        "Authorized failed, Please enter valid Sub Domain & API Key",
        "bit-integrations"
      )
    );
  });
};

export const getAllTags = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, tag: true });

  const requestParams = {
    api_key: confTmp.api_key,
  };

  bitsFetch(requestParams, "systemeIO_fetch_all_tags").then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.tags = result.data;
          return prevConf;
        });

        setLoading({ ...setLoading, tag: false });
        toast.success(__("Tags fetched successfully", "bit-integrations"));
        return;
      }
      setLoading({ ...setLoading, tag: false });
      toast.error(__("Tags Not Found!", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, tag: false });
    toast.error(__("Tags fetching failed", "bit-integrations"));
  });
};
