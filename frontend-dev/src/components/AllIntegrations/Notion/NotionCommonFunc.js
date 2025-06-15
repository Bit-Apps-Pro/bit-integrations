/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
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
  const { name, value } = e.target;
  inputError[name] = "";
  newConf[name] = value;
  setError(inputError);
  setConf(newConf);
};

export const handleAuthorize = (
  conf,
  setConf,
  error,
  setError,
  setAuthorized,
  loading,
  setLoading
) => {
  if (!conf.clientId || !conf.clientSecret) {
    setError({
      clientId: !conf.clientId ? __("Client Id can't be empty") : "",
      clientSecret: !conf.clientSecret
        ? __("Client Secret can't be empty")
        : "",
    });
    return;
  }
  setError({});
  setLoading({ ...loading, auth: true });
  const apiEndpoint = `https://api.notion.com/v1/oauth/authorize?client_id=${
    conf.clientId
  }&response_type=code&owner=user&state=${encodeURIComponent(
    window.location.href
  )}/redirect&redirect_uri=${encodeURIComponent(`${btcbi.api.base}`)}/redirect`;
  const authWindow = window.open(
    apiEndpoint,
    "Notion",
    "width=400,height=609,toolbar=off"
  );
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer);
      let grantTokenResponse = {};
      let isAuthRedirectLocation = false;
      const notionStoreValue = localStorage.getItem("__notion");
      if (notionStoreValue) {
        isAuthRedirectLocation = true;
        grantTokenResponse = JSON.parse(notionStoreValue);
        localStorage.removeItem("__notion");
      }
      if (
        !grantTokenResponse.code ||
        grantTokenResponse.error ||
        !grantTokenResponse ||
        !isAuthRedirectLocation
      ) {
        const errorCause = grantTokenResponse.error
          ? `Cause: ${grantTokenResponse.error}`
          : "";
        toast.error(
          `${__(
            "Authorization failed",
            "bit-integrations"
          )} ${errorCause}. ${__("please try again", "bit-integrations")}`
        );
        setLoading({ ...loading, auth: false });
      } else {
        tokenHelper(
          grantTokenResponse,
          conf,
          setConf,
          setAuthorized,
          loading,
          setLoading
        );
      }
    }
  }, 500);
};

const tokenHelper = (
  grantToken,
  conf,
  setConf,
  setAuthorized,
  loading,
  setLoading
) => {
  const tokenRequestParams = { ...grantToken };
  tokenRequestParams.clientId = conf.clientId;
  tokenRequestParams.clientSecret = conf.clientSecret;
  // eslint-disable-next-line no-undef
  tokenRequestParams.redirectURI = `${btcbi.api.base}/redirect`;
  bitsFetch(tokenRequestParams, "notion_authorization").then((result) => {
    if (result && result.success) {
      const newConf = { ...conf };
      newConf.tokenDetails = result.data;
      setConf(newConf);
      setAuthorized(true);
      toast.success(__("Authorized Successfully"));
    } else if (
      (result && result.data && result.data.data) ||
      (!result.success && typeof result.data === "string")
    ) {
      toast.error(
        `${__("Authorization failed Cause:")}${
          result.data.data || result.data
        }. ${__("please try again")}`
      );
    } else {
      toast.error(__("Authorization failed. please try again"));
    }
    setLoading({ ...loading, auth: false });
  });
};

export const getAllDatabaseLists = async (
  conf,
  setConf,
  loading,
  setLoading
) => {
  setLoading && setLoading({ ...loading, list: true });
  const requestParams = { accessToken: conf.tokenDetails.access_token };
  const result = await bitsFetch(requestParams, "notion_database_lists");
  if (result.success && result.data.results) {
    const data = result?.data.results
      .filter((e) => e.object === "database")
      .map((e) => ({ id: e.id, name: e.title[0].text.content }));
    const newConf = { ...conf };
    if (data) {
      if (!newConf.default) {
        newConf.default = {};
      }
      newConf.default.databaseLists = data;
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

export const getFieldsProperties = async (
  conf,
  setConf,
  loading,
  setLoading
) => {
  setLoading && setLoading({ ...loading, field: true });
  const requestParams = {
    accessToken: conf.tokenDetails.access_token,
    databaseId: conf.databaseId,
  };
  const result = await bitsFetch(requestParams, "notion_database_properties");

  if (result.success && result.data.properties) {
    const data = result?.data.properties;
    const field = [];
    const sanitizeField = [
      "formula",
      "people",
      "Rollup",
      "Relation",
      "created_by",
      "created_time",
      "last_edited_by",
      "last_edited_time",
    ];
    for (const key in data) {
      const obb = {};
      let value = data[key];
      const typeName = value.type;
      if (!sanitizeField.includes(typeName)) {
        obb.label = key;
        obb.key = typeName;
        if (typeName == "title") {
          obb.required = true;
        } else {
          obb.required = false;
        }
        field.push(obb);
      }
    }

    const newConf = { ...conf };
    if (data) {
      newConf.notionFields = field;
      setConf({ ...newConf });
      if (setLoading) {
        setLoading({ ...loading, field: false });
        toast.success(__("field refresh successfully"));
      }
    }
    return field;
  }
  if (setLoading) {
    setLoading({ ...loading, field: false });
    toast.success(__("field refresh failed"));
  }
  return false;
};

export const generateMappedField = (notionConf) => {
  const requiredFlds = notionConf?.notionFields.filter(
    (fld) => fld.required === true
  );
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formFields: "",
        notionFormFields: field.label,
      }))
    : [{ formFields: "", notionFormFields: "" }];
};

export const checkMappedFields = (notionConf) => {
  const mappedFields = notionConf?.field_map
    ? notionConf.field_map.filter(
        (mappedField) =>
          !mappedField.formFields ||
          !mappedField.notionFormFields ||
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
