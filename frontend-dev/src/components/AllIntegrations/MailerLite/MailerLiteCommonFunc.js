/* eslint-disable no-else-return */
import toast from "react-hot-toast";
import { __ } from "../../../Utils/i18nwrap";
import bitsFetch from "../../../Utils/bitsFetch";

export const handleInput = (
  e,
  mailerLiteConf,
  setMailerLiteConf,
  setLoading,
  setSnackbar,
  isNew,
  error,
  setError
) => {
  const newConf = { ...mailerLiteConf };
  const { name } = e.target;
  if (e.target.value !== "") {
    newConf[name] = e.target.value;
  } else {
    delete newConf[name];
  }
  setMailerLiteConf({ ...newConf });
};

export const generateMappedField = (mailerLiteConf) => {
  const requiredFlds = mailerLiteConf?.mailerLiteFields.filter(
    (fld) => fld.required === true
  );
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: "",
        mailerLiteFormField: field.key,
      }))
    : [{ formField: "", mailerLiteFormField: "" }];
};

export const checkMappedFields = (mailerLiteConf) => {
  const mappedFields = mailerLiteConf?.field_map
    ? mailerLiteConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField ||
          !mappedField.mailerLiteFormField ||
          (!mappedField.formField === "custom" && !mappedField.customValue)
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};
export const mailerliteRefreshFields = (
  confTmp,
  setConf,
  setError,
  setisAuthorized,
  loading,
  setLoading,
  type
) => {
  if (!confTmp.auth_token) {
    setError({
      auth_token: !confTmp.auth_token
        ? __("Api Key can't be empty", "bit-integrations")
        : "",
    });
    return;
  }
  setError({});
  if (type === "authorization") {
    setLoading({ ...loading, auth: true });
  } else {
    setLoading({ ...loading, field: true });
  }

  const requestParams = {
    auth_token: confTmp.auth_token,
    version: confTmp.version,
  };

  bitsFetch(requestParams, "mailerlite_refresh_fields").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.mailerLiteFields = result.data;
      }
      setConf(newConf);
      setisAuthorized(true);
      if (type === "authorization") {
        setLoading({ ...loading, auth: false });
        toast.success(__("Authorized successfully", "bit-integrations"));
      } else {
        setLoading({ ...loading, field: false });
        toast.success(__("Fields refresh successfully", "bit-integrations"));
      }
      return;
    }
    if (type === "authorization") {
      setLoading({ ...loading, auth: false });
      toast.error(__("Authorized failed", "bit-integrations"));
    } else {
      setLoading({ ...loading, field: false });
      toast.error(__("Fields refresh failed", "bit-integrations"));
    }
  });
};

export const getAllGroups = (confTmp, setConf, loding, setLoading) => {
  setLoading({ ...setLoading, group: true });

  const requestParams = {
    auth_token: confTmp.auth_token,
    version: confTmp.version,
  };

  bitsFetch(requestParams, "mailerlite_fetch_all_groups").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.groups = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, group: false });

      toast.success(__("Group fetch successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, group: false });
    toast.error(__("Group fetch failed", "bit-integrations"));
  });
};
