/* eslint-disable no-unused-expressions */
import toast from "react-hot-toast";
import bitsFetch from "../../../Utils/bitsFetch";
import { __ } from "../../../Utils/i18nwrap";
import {
  saveActionConf,
  saveIntegConfig,
} from "../IntegrationHelpers/IntegrationHelpers";

export const handleInput = (e, conf, setConf, error, setError) => {
  const newConf = { ...conf };
  const inputError = { ...error };
  inputError[e.target.name] = "";
  newConf[e.target.name] = e.target.value;
  setError(inputError);
  setConf(newConf);
};

export const handleAuthorize = (
  conf,
  setError,
  setAuthorized,
  loading,
  setLoading
) => {
  if (!conf.authKey) {
    setError({ authKey: !conf.authKey ? __("API key can't be empty") : "" });
    return;
  }
  setError({});
  setLoading({ ...loading, auth: true });

  const requestParams = { authKey: conf.authKey };

  bitsFetch(requestParams, "moosend_handle_authorize").then((result) => {
    if (result.data.Code === 0) {
      setAuthorized(true);
      setLoading({ ...loading, auth: false });
      toast.success(__("Authorized successfully"));
      return;
    }
    setLoading({ ...loading, auth: false });
    toast.error(__("Authorized failed"));
  });
};

export const getAllLists = async (conf, setConf, loading, setLoading) => {
  setLoading && setLoading({ ...loading, list: true });
  const requestParams = { authKey: conf.authKey };
  const result = await bitsFetch(requestParams, "moosend_handle_authorize");
  if (result.success && result.data.Code === 0) {
    const { MailingLists } = result.data.Context;
    const newConf = { ...conf };
    if (MailingLists) {
      if (!newConf.default) {
        newConf.default = {};
      }
      newConf.default.lists = MailingLists;
      setConf(newConf);
      if (setLoading) {
        setLoading({ ...loading, list: false });
        toast.success(__("List refresh successfully"));
      }
    }
    return true;
  }
  if (setLoading) {
    setLoading({ ...loading, list: false });
    toast.success(__("List refresh failed"));
  }
  return false;
};

export const generateMappedField = (moosendConf) => {
  const requiredFlds = moosendConf?.moosendFields.filter(
    (fld) => fld.required === true
  );
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formFields: "",
        moosendFormFields: field.key,
      }))
    : [{ formFields: "", moosendFormFields: "" }];
};

export const checkMappedFields = (moosendConf) => {
  const mappedFields = moosendConf?.field_map
    ? moosendConf.field_map.filter(
        (mappedField) =>
          !mappedField.formFields ||
          !mappedField.moosendFormFields ||
          (!mappedField.formFields === "custom" && !mappedField.customValue)
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};

export const nextPage = (conf, setStep, pageNo) => {
  setTimeout(() => {
    document.getElementById("btcd-settings-wrp").scrollTop = 0;
  }, 300);

  if (!conf.listId && conf.method !== "0") {
    toast.error("Please select list");
  }
  if (!checkMappedFields(conf)) {
    toast.error("Please map mandatory fields");
    return;
  }
  conf.field_map.length > 0 && setStep(pageNo);
};

export const saveConfig = (
  flow,
  setFlow,
  allIntegURL,
  conf,
  navigate,
  setLoading
) => {
  setLoading(true);
  const resp = saveIntegConfig(
    flow,
    setFlow,
    allIntegURL,
    conf,
    navigate,
    "",
    "",
    setLoading
  );
  resp.then((res) => {
    if (res.success) {
      toast.success(res.data?.msg);
      navigate(allIntegURL);
    } else {
      toast.error(res.data || res);
    }
  });
};

export const saveUpdateConfig = (
  flow,
  allIntegURL,
  conf,
  navigate,
  edit,
  setIsLoading
) => {
  if (!checkMappedFields(conf)) {
    toast.error("Please map mandatory fields");
    return;
  }
  saveActionConf({ flow, allIntegURL, conf, navigate, edit, setIsLoading });
};
