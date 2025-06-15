/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from "react-hot-toast";
import bitsFetch from "../../../Utils/bitsFetch";
import { __ } from "../../../Utils/i18nwrap";

export const handleInput = (e, clickupConf, setClickupConf) => {
  const newConf = { ...clickupConf };
  const { name } = e.target;
  if (e.target.value !== "") {
    newConf[name] = e.target.value;
  } else {
    delete newConf[name];
  }
  setClickupConf({ ...newConf });
};

export const generateMappedField = (clickupConf) => {
  let allRequiredFields = [];
  if (clickupConf.actionName === "task") {
    allRequiredFields = clickupConf?.taskFields;
  }
  const requiredFlds = allRequiredFields?.filter(
    (fld) => fld.required === true
  );
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: "",
        clickupFormField: field.key,
      }))
    : [{ formField: "", clickupFormField: "" }];
};

export const checkMappedFields = (clickupConf) => {
  const mappedFields = clickupConf?.field_map
    ? clickupConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField ||
          !mappedField.clickupFormField ||
          (mappedField.formField === "custom" && !mappedField.customValue) ||
          (mappedField.clickupFormField === "customFieldKey" &&
            !mappedField.customFieldKey)
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};

export const clickupAuthentication = (
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
        ? __("Api Key can't be empty", "bit-integrations")
        : "",
    });
    return;
  }

  setError({});
  setLoading({ ...loading, auth: true });

  const requestParams = { api_key: confTmp.api_key };

  bitsFetch(requestParams, "clickup_authentication").then((result) => {
    if (result && result.success) {
      setIsAuthorized(true);
      setLoading({ ...loading, auth: false });
      toast.success(__("Authorized successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...loading, auth: false });
    toast.error(
      __("Authorized failed, Please enter valid API key", "bit-integrations")
    );
  });
};

export const getCustomFields = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, customFields: true });

  const requestParams = {
    api_key: confTmp.api_key,
    action: confTmp.actionName,
    list_id: confTmp.selectedList,
  };

  bitsFetch(requestParams, "clickup_fetch_custom_fields").then((result) => {
    if (result && result.success) {
      // const newConf = { ...confTmp };
      // if (result.data) {
      //   newConf.customFields = result.data;
      // }
      // setConf(newConf);
      setConf((oldConf) => {
        const newConf = { ...oldConf };
        if (!newConf.default) {
          newConf.default = {};
        }
        if (result.data) {
          newConf.customFields = result.data;
        }
        return newConf;
      });
      setLoading({ ...setLoading, customFields: false });
      if (!result.data) {
        toast.error(__("No custom fields found", "bit-integrations"));
      } else {
        toast.success(
          __("Custom fields also fetched successfully", "bit-integrations")
        );
      }
      return;
    }
    setLoading({ ...setLoading, customFields: false });
    toast.error(__("Custom fields fetching failed", "bit-integrations"));
  });
};

export const getAllTeams = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, Teams: true });

  const requestParams = {
    api_key: confTmp.api_key,
    action_name: confTmp.actionName,
  };

  bitsFetch(requestParams, "clickup_fetch_all_Teams").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.Teams = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, Teams: false });
      if (confTmp.actionName === "task") {
        toast.success(__("Teams fetched successfully", "bit-integrations"));
      }

      return;
    }
    setLoading({ ...setLoading, Teams: false });
    if (confTmp.actionName === "task") {
      toast.error(__("Teams fetching failed", "bit-integrations"));
    }
  });
};

export const getAllSpaces = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, Spaces: true });

  const requestParams = {
    api_key: confTmp.api_key,
    action_name: confTmp.actionName,
    team_id: confTmp.selectedTeam,
  };

  bitsFetch(requestParams, "clickup_fetch_all_Spaces").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.Spaces = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, Spaces: false });
      if (confTmp.actionName === "task") {
        toast.success(__("Spaces fetched successfully", "bit-integrations"));
      }

      return;
    }
    setLoading({ ...setLoading, Spaces: false });
    if (confTmp.actionName === "task") {
      toast.error(__("Spaces fetching failed", "bit-integrations"));
    }
  });
};

export const getAllFolders = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, Folders: true });

  const requestParams = {
    api_key: confTmp.api_key,
    action_name: confTmp.actionName,
    space_id: confTmp.selectedSpace,
  };

  bitsFetch(requestParams, "clickup_fetch_all_Folders").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.Folders = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, Folders: false });
      if (confTmp.actionName === "task") {
        toast.success(__("Folders fetched successfully", "bit-integrations"));
      }

      return;
    }
    setLoading({ ...setLoading, Folders: false });
    if (confTmp.actionName === "task") {
      toast.error(__("Folders fetching failed", "bit-integrations"));
    }
  });
};

export const getAllLists = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, Lists: true });

  const requestParams = {
    api_key: confTmp.api_key,
    action_name: confTmp.actionName,
    folder_id: confTmp.selectedFolder,
  };

  bitsFetch(requestParams, "clickup_fetch_all_Lists").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.Lists = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, Lists: false });
      if (confTmp.actionName === "task") {
        toast.success(__("Lists fetched successfully", "bit-integrations"));
      }

      return;
    }
    setLoading({ ...setLoading, Lists: false });
    if (confTmp.actionName === "task") {
      toast.error(__("Lists fetching failed", "bit-integrations"));
    }
  });
};

export const getAllTags = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, Tags: true });

  const requestParams = {
    api_key: confTmp.api_key,
    action_name: confTmp.actionName,
    space_id: confTmp.selectedSpace,
  };

  bitsFetch(requestParams, "clickup_fetch_all_Tags").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.Tags = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, Tags: false });
      if (confTmp.actionName === "task") {
        toast.success(__("Tags fetched successfully", "bit-integrations"));
      }

      return;
    }
    setLoading({ ...setLoading, Tags: false });
    if (confTmp.actionName === "task") {
      toast.error(__("Tags fetching failed", "bit-integrations"));
    }
  });
};
