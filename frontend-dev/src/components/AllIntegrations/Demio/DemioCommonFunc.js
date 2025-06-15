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

export const generateMappedField = (demioFields) => {
  const requiredFlds = demioFields.filter((fld) => fld.required === true);
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: "",
        demioFormField: field.key,
      }))
    : [{ formField: "", demioFormField: "" }];
};

export const checkMappedFields = (demioConf) => {
  const mappedFields = demioConf?.field_map
    ? demioConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField ||
          !mappedField.demioFormField ||
          (mappedField.formField === "custom" && !mappedField.customValue) ||
          (mappedField.demioFormField === "customFieldKey" &&
            !mappedField.customFieldKey)
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};

export const demioAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.api_key || !confTmp.api_secret) {
    setError({
      api_key: !confTmp.api_key
        ? __("API Key can't be empty", "bit-integrations")
        : "",
      api_secret: !confTmp.api_secret
        ? __("API Secret can't be empty", "bit-integrations")
        : "",
    });
    return;
  }

  setError({});
  setLoading({ ...loading, auth: true });

  const requestParams = {
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret,
  };

  bitsFetch(requestParams, "demio_authentication").then((result) => {
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

export const getAllEvents = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, event: true });

  const requestParams = {
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret,
  };

  bitsFetch(requestParams, "demio_fetch_all_events").then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.events = result.data;
          return prevConf;
        });

        setLoading({ ...setLoading, event: false });
        toast.success(__("Events fetched successfully", "bit-integrations"));
        return;
      }
      setLoading({ ...setLoading, event: false });
      toast.error(__("Events Not Found!", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, event: false });
    toast.error(__("Events fetching failed", "bit-integrations"));
  });
};

export const getAllSessions = (confTmp, setConf, event_id, setLoading) => {
  setLoading({ ...setLoading, session: true });

  const requestParams = {
    api_key: confTmp.api_key,
    api_secret: confTmp.api_secret,
    event_id: event_id,
  };

  bitsFetch(requestParams, "demio_fetch_all_sessions").then((result) => {
    if (result && result.success) {
      if (result.data) {
        setConf((prevConf) => {
          prevConf.sessions = result.data;
          return prevConf;
        });

        setLoading({ ...setLoading, session: false });
        toast.success(__("Sessions fetched successfully", "bit-integrations"));
        return;
      }
      setLoading({ ...setLoading, session: false });
      toast.error(__("Sessions Not Found!", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, session: false });
    toast.error(__("Sessions fetching failed", "bit-integrations"));
  });
};
