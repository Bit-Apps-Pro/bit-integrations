/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from "react-hot-toast";
import bitsFetch from "../../../Utils/bitsFetch";
import { __ } from "../../../Utils/i18nwrap";

export const handleInput = (e, woodpeckerConf, setWoodpeckerConf) => {
  const newConf = { ...woodpeckerConf };
  const { name } = e.target;
  if (e.target.value !== "") {
    newConf[name] = e.target.value;
  } else {
    delete newConf[name];
  }
  setWoodpeckerConf({ ...newConf });
};

export const generateMappedField = (woodpeckerConf) => {
  const requiredFlds =
    woodpeckerConf?.woodpeckerAllFields &&
    woodpeckerConf?.woodpeckerAllFields.filter(
      (fld) =>
        fld.required === true && fld.key !== "owner" && fld.key !== "pipeline"
    );
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
      formField: "",
      woodpeckerFormField: field.key,
    }))
    : [{ formField: "", woodpeckerFormField: "" }];
};

export const checkMappedFields = (woodpeckerConf) => {
  const mappedFields = woodpeckerConf?.field_map
    ? woodpeckerConf.field_map.filter(
      (mappedField) =>
        !mappedField.formField ||
        !mappedField.woodpeckerFormField ||
        (mappedField.formField === "custom" && !mappedField.customValue) ||
        (mappedField.woodpeckerFormField === "customFieldKey" &&
          !mappedField.customFieldKey)
    )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};

export const woodpeckerAuthentication = (
  confTmp,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.api_key) {
    setError({
      api_key: !confTmp.api_key
        ? __("Api Key can't be empty", "bit-integrations")
        : "",
    });
    return;
  }

  setError({});
  setLoading({ ...loading, auth: true });

  const requestParams = {
    api_key: confTmp.api_key,
  };

  bitsFetch(requestParams, "woodpecker_authentication").then((result) => {
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

export const getAllCampaign = (woodpeckerConf, setWoodpeckerConf, loading, setLoading) => {
  setLoading({ ...loading, campaign: true });
  const requestParams = {
    api_key: woodpeckerConf.api_key,
  };

  bitsFetch(requestParams, "woodpecker_fetch_all_campaigns").then((result) => {
    if (result && result.success) {
      setWoodpeckerConf((prevConf) => {
        const draftConf = { ...prevConf };
        draftConf.campaigns = result.data;
        return draftConf;
      });

      toast.success(__("Campaigns fetched successfully", "bit-integrations"));
      setLoading({ ...loading, campaign: false });
      return;
    }
    setLoading({ ...loading, campaign: false });
    toast.error(__("Campaigns fetching failed", "bit-integrations"));
  });
};