/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
import toast from "react-hot-toast";
import { __, sprintf } from "../../../Utils/i18nwrap";
import bitsFetch from "../../../Utils/bitsFetch";

export const handleInput = (
  e,
  recordTab,
  freshSalesConf,
  setFreshSalesConf,
  formID,
  setIsLoading,
  setSnackbar,
  isNew,
  error,
  setError
) => {
  let newConf = { ...freshSalesConf };
  if (recordTab === 0) {
    if (isNew) {
      const rmError = { ...error };
      rmError[e.target.name] = "";
      setError({ ...rmError });
    }
    if (e.target.value !== "") {
      if (e.target.name !== "module") {
        newConf.moduleData[e.target.name] = parseInt(e.target.value);
      } else {
        newConf.moduleData = {};
        newConf.moduleData[e.target.name] = e.target.value;
      }
    } else {
      delete newConf.moduleData[e.target.name];
    }
  } else {
    if (!newConf.relatedlists) {
      newConf.relatedlists = [];
    }
    if (e.target.value !== "") {
      if (e.target.name !== "module") {
        newConf.relatedlists[recordTab - 1][e.target.name] = parseInt(
          e.target.value
        );
      } else {
        newConf.relatedlists[recordTab - 1].moduleData = {};
        newConf.relatedlists[recordTab - 1][e.target.name] = e.target.value;
      }
    } else {
      delete newConf.relatedlists[recordTab - 1][e.target.name];
    }
  }

  switch (e.target.name) {
    case "module":
      newConf = moduleChange(
        recordTab,
        formID,
        newConf,
        setFreshSalesConf,
        setIsLoading,
        setSnackbar
      );
      break;
    case "contact_view_id":
      newConf = contactViewChange(
        recordTab,
        formID,
        newConf,
        setFreshSalesConf,
        setIsLoading,
        setSnackbar
      );
      break;
    case "account_view_id":
      newConf = accountViewChange(
        recordTab,
        formID,
        newConf,
        setFreshSalesConf,
        setIsLoading,
        setSnackbar
      );
      break;
    default:
      break;
  }
  setFreshSalesConf({ ...newConf });
};

export const handleTabChange = (recordTab, settab) => {
  settab(recordTab);
};

export const moduleChange = (
  recordTab,
  formID,
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  const newConf = { ...freshSalesConf };

  if (!newConf.relatedlists[recordTab - 1])
    newConf.relatedlists[recordTab - 1] = {};
  const module =
    recordTab === 0
      ? newConf.moduleData.module
      : newConf.relatedlists[recordTab - 1].module;

  if (recordTab === 0) {
    newConf.actions = {};
    newConf.field_map = [{ formField: "", freshSalesFormField: "" }];
    newConf.relatedlists = [];
    if (["Contact"].includes(module)) {
      !newConf.default.views &&
        accountRefreshViews(
          newConf,
          setFreshSalesConf,
          setIsLoading,
          setSnackbar
        );
    }
    if (["Deal"].includes(module)) {
      !newConf.default.views &&
        contactRefreshViews(
          newConf,
          setFreshSalesConf,
          setIsLoading,
          setSnackbar
        );
    }
    if (module !== "" && module !== undefined) {
      setTimeout(() => {
        refreshFields(module, newConf, setFreshSalesConf, recordTab);
      }, 1000);
    } else {
      newConf.field_map = newConf.default.modules?.[module]?.requiredFields
        ? generateMappedField(recordTab, newConf)
        : [{ formField: "", freshSalesFormField: "" }];
    }
  } else {
    newConf.relatedlists[recordTab - 1].actions = {};
    newConf.relatedlists[recordTab - 1].field_map = [
      { formField: "", freshSalesFormField: "" },
    ];
    if (
      !newConf.default.modules?.[module]?.fields &&
      module !== "" &&
      module !== undefined
    ) {
      setTimeout(() => {
        refreshFields(module, newConf, setFreshSalesConf, recordTab);
      }, 1000);
    } else {
      newConf.relatedlists[recordTab - 1].field_map = newConf.default.modules?.[
        module
      ]?.requiredFields
        ? generateMappedField(recordTab, newConf)
        : [{ formField: "", freshSalesFormField: "" }];
    }
  }

  return newConf;
};

export const accountViewChange = (
  recordTab,
  formID,
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  const newConf = { ...freshSalesConf };
  if (!newConf.relatedlists[recordTab - 1])
    newConf.relatedlists[recordTab - 1] = {};
  const view =
    recordTab === 0
      ? newConf.moduleData.module
      : newConf.relatedlists[recordTab - 1].module;

  if (recordTab === 0) {
    newConf.actions = {};
    newConf.field_map = [{ formField: "", freshSalesFormField: "" }];
    newConf.relatedlists = [];
    if (["Deal", "Contact"].includes(view)) {
      refreshAccounts(newConf, setFreshSalesConf, setIsLoading, setSnackbar);
      if (
        !newConf.default.modules?.[view]?.fields &&
        view !== "" &&
        view !== undefined
      ) {
        setTimeout(() => {
          refreshFields(view, newConf, setFreshSalesConf, recordTab);
        }, 1000);
      } else {
        newConf.field_map = newConf.default.modules?.[view]?.requiredFields
          ? generateMappedField(recordTab, newConf)
          : [{ formField: "", freshSalesFormField: "" }];
      }
    }
  } else {
    newConf.relatedlists[recordTab - 1].actions = {};
    newConf.relatedlists[recordTab - 1].field_map = [
      { formField: "", freshSalesFormField: "" },
    ];
    if (
      !newConf.default.modules?.[view]?.fields &&
      view !== "" &&
      view !== undefined
    ) {
      setTimeout(() => {
        refreshFields(view, newConf, setFreshSalesConf, recordTab);
      }, 1000);
    } else {
      newConf.relatedlists[recordTab - 1].field_map = newConf.default.modules?.[
        view
      ]?.requiredFields
        ? generateMappedField(recordTab, newConf)
        : [{ formField: "", freshSalesFormField: "" }];
    }
  }
  return newConf;
};

export const contactViewChange = (
  recordTab,
  formID,
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  const newConf = { ...freshSalesConf };
  if (!newConf.relatedlists[recordTab - 1])
    newConf.relatedlists[recordTab - 1] = {};
  const view =
    recordTab === 0
      ? newConf.moduleData.module
      : newConf.relatedlists[recordTab - 1].module;
  if (recordTab === 0) {
    newConf.actions = {};
    newConf.field_map = [{ formField: "", freshSalesFormField: "" }];
    newConf.relatedlists = [];
    if (["Deal"].includes(view)) {
      !newConf.default.contacts &&
        refreshContacts(newConf, setFreshSalesConf, setIsLoading, setSnackbar);
      if (
        !newConf.default.modules?.[view]?.fields &&
        view !== "" &&
        view !== undefined
      ) {
        setTimeout(() => {
          refreshFields(view, newConf, setFreshSalesConf, recordTab);
        }, 1000);
      } else {
        newConf.field_map = newConf.default.modules?.[view]?.requiredFields
          ? generateMappedField(recordTab, newConf)
          : [{ formField: "", freshSalesFormField: "" }];
      }
    }
  } else {
    newConf.relatedlists[recordTab - 1].actions = {};
    newConf.relatedlists[recordTab - 1].field_map = [
      { formField: "", freshSalesFormField: "" },
    ];
    if (
      !newConf.default.modules?.[view]?.fields &&
      view !== "" &&
      view !== undefined
    ) {
      setTimeout(() => {
        refreshFields(view, newConf, setFreshSalesConf, recordTab);
      }, 1000);
    } else {
      newConf.relatedlists[recordTab - 1].field_map = newConf.default.modules?.[
        view
      ]?.requiredFields
        ? generateMappedField(recordTab, newConf)
        : [{ formField: "", freshSalesFormField: "" }];
    }
  }
  return newConf;
};

export const refreshFields = (
  module,
  freshSalesConf,
  setFreshSalesConf,
  recordTab
) => {
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    module,
  };
  bitsFetch(requestParams, "FreshSales_refresh_fields").then((result) => {
    if (result && result.success) {
      const newConf = { ...freshSalesConf };
      if (!newConf.default.modules[module].fields)
        newConf.default.modules[module].fields = {};
      if (result.data) {
        newConf.default.modules[module].fields = result.data;
        if (recordTab === 0) {
          newConf.field_map = newConf.default.modules?.[module]?.requiredFields
            ? generateMappedField(recordTab, newConf)
            : [{ formField: "", freshSalesFormField: "" }];
        } else {
          newConf.relatedlists[recordTab - 1].field_map = newConf.default
            .modules?.[module]?.requiredFields
            ? generateMappedField(recordTab, newConf)
            : [{ formField: "", freshSalesFormField: "" }];
        }
      }
      setFreshSalesConf({ ...newConf });
    }
  });
};

export const accountRefreshViews = (
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true);
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    module: "filters",
    type: "sales_accounts",
  };

  bitsFetch(requestParams, "FreshSales_fetch_meta_data")
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...freshSalesConf };
        if (!newConf.default.accountViews) newConf.default.accountViews = {};
        if (result.data) {
          newConf.default.accountViews = result.data;
        }
        setFreshSalesConf({ ...newConf });
        setSnackbar({
          show: true,
          msg: __("Account views refreshed", "bit-integrations"),
        });
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === "string")
      ) {
        setSnackbar({
          show: true,
          msg: sprintf(
            __(
              "Account views refresh failed Cause: %s. please try again",
              "bit-integrations"
            ),
            result.data.data || result.data
          ),
        });
      } else {
        setSnackbar({
          show: true,
          msg: __(
            "Account views refresh failed. please try again",
            "bit-integrations"
          ),
        });
      }
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
};

export const contactRefreshViews = (
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true);
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    module: "filters",
    type: "contacts",
  };

  bitsFetch(requestParams, "FreshSales_fetch_meta_data")
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...freshSalesConf };
        if (!newConf.default.contactViews) newConf.default.contactViews = {};
        if (result.data) {
          newConf.default.contactViews = result.data;
        }
        setFreshSalesConf({ ...newConf });
        setSnackbar({
          show: true,
          msg: __("Contact views refreshed", "bit-integrations"),
        });
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === "string")
      ) {
        setSnackbar({
          show: true,
          msg: sprintf(
            __(
              "Contact views refresh failed Cause: %s. please try again",
              "bit-integrations"
            ),
            result.data.data || result.data
          ),
        });
      } else {
        setSnackbar({
          show: true,
          msg: __(
            "Contact views refresh failed. please try again",
            "bit-integrations"
          ),
        });
      }
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
};

export const refreshAccounts = (
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true);
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    account_view_id: freshSalesConf.moduleData.account_view_id,
    contact_view_id: freshSalesConf.moduleData.contact_view_id,
    module: "sales_accounts",
  };

  bitsFetch(requestParams, "FreshSales_fetch_meta_data")
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...freshSalesConf };
        if (!newConf.default.accounts) newConf.default.accounts = {};
        if (result.data) {
          newConf.default.accounts = result.data;
        }
        setFreshSalesConf({ ...newConf });
        setSnackbar({
          show: true,
          msg: __("Accounts refreshed", "bit-integrations"),
        });
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === "string")
      ) {
        setSnackbar({
          show: true,
          msg: sprintf(
            __(
              "Accounts refresh failed Cause: %s. please try again",
              "bit-integrations"
            ),
            result.data.data || result.data
          ),
        });
      } else {
        setSnackbar({
          show: true,
          msg: __(
            "Accounts refresh failed. please try again",
            "bit-integrations"
          ),
        });
      }
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
};

export const refreshContacts = (
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true);
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    contact_view_id: freshSalesConf.moduleData.contact_view_id,
    account_view_id: freshSalesConf.moduleData.account_view_id,
    module: "contacts",
  };

  bitsFetch(requestParams, "FreshSales_fetch_meta_data")
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...freshSalesConf };
        if (!newConf.default.contacts) newConf.default.contacts = {};
        if (result.data) {
          newConf.default.contacts = result.data;
        }
        setFreshSalesConf({ ...newConf });
        setSnackbar({
          show: true,
          msg: __("Contacts refreshed", "bit-integrations"),
        });
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === "string")
      ) {
        setSnackbar({
          show: true,
          msg: sprintf(
            __(
              "Contacts refresh failed Cause: %s. please try again",
              "bit-integrations"
            ),
            result.data.data || result.data
          ),
        });
      } else {
        setSnackbar({
          show: true,
          msg: __(
            "Contacts refresh failed. please try again",
            "bit-integrations"
          ),
        });
      }
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
};

export const getAllOwners = (
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true);
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    module: "users",
  };

  bitsFetch(requestParams, "FreshSales_fetch_meta_data")
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...freshSalesConf };
        if (!newConf.default.owners) newConf.default.owners = {};
        if (result.data) {
          newConf.default.owners = result.data;
        }
        setFreshSalesConf({ ...newConf });
        setSnackbar({
          show: true,
          msg: __("Owners fetched successfully", "bit-integrations"),
        });
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === "string")
      ) {
        setSnackbar({
          show: true,
          msg: sprintf(
            __(
              "Owners fetch failed Cause: %s. please try again",
              "bit-integrations"
            ),
            result.data.data || result.data
          ),
        });
      } else {
        setSnackbar({
          show: true,
          msg: __("Owners fetch failed. please try again", "bit-integrations"),
        });
      }
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
};

export const getAllLeadLabels = (
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true);
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    module: "leadLabels",
  };

  bitsFetch(requestParams, "FreshSales_fetch_meta_data")
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...freshSalesConf };
        if (!newConf.default.leadLabels) newConf.default.leadLabels = {};
        if (result.data) {
          newConf.default.leadLabels = result.data;
        }
        setFreshSalesConf({ ...newConf });
        setSnackbar({
          show: true,
          msg: __("Labels fetched successfully", "bit-integrations"),
        });
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === "string")
      ) {
        setSnackbar({
          show: true,
          msg: sprintf(
            __(
              "Labels fetch failed Cause: %s. please try again",
              "bit-integrations"
            ),
            result.data.data || result.data
          ),
        });
      } else {
        setSnackbar({
          show: true,
          msg: __("Labels fetch failed. please try again", "bit-integrations"),
        });
      }
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
};
export const getAllCurrencies = (
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true);
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    module: "currencies",
  };

  bitsFetch(requestParams, "FreshSales_fetch_meta_data")
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...freshSalesConf };
        if (!newConf.default.currencies) newConf.default.currencies = {};
        if (result.data) {
          newConf.default.currencies = result.data;
        }
        setFreshSalesConf({ ...newConf });
        setSnackbar({
          show: true,
          msg: __("Currencies fetched successfully", "bit-integrations"),
        });
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === "string")
      ) {
        setSnackbar({
          show: true,
          msg: sprintf(
            __(
              "Currencies fetch failed Cause: %s. please try again",
              "bit-integrations"
            ),
            result.data.data || result.data
          ),
        });
      } else {
        setSnackbar({
          show: true,
          msg: __(
            "Currencies fetch failed. please try again",
            "bit-integrations"
          ),
        });
      }
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
};

export const getDealStages = (
  freshSalesConf,
  setFreshSalesConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true);
  const requestParams = {
    api_key: freshSalesConf.api_key,
    bundle_alias: freshSalesConf.bundle_alias,
    module: "stages",
  };

  bitsFetch(requestParams, "FreshSales_fetch_meta_data")
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...freshSalesConf };
        if (!newConf.default.stages) newConf.default.stages = {};
        if (result.data) {
          newConf.default.stages = result.data;
        }
        setFreshSalesConf({ ...newConf });
        setSnackbar({
          show: true,
          msg: __("Stages fetched successfully", "bit-integrations"),
        });
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === "string")
      ) {
        setSnackbar({
          show: true,
          msg: sprintf(
            __(
              "Stages fetch failed Cause: %s. please try again",
              "bit-integrations"
            ),
            result.data.data || result.data
          ),
        });
      } else {
        setSnackbar({
          show: true,
          msg: __("Stages fetch failed. please try again", "bit-integrations"),
        });
      }
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
};

export const generateMappedField = (recordTab, freshSalesConf) => {
  const module =
    recordTab === 0
      ? freshSalesConf.moduleData.module
      : freshSalesConf.relatedlists[recordTab - 1].module;

  const requiredFlds = freshSalesConf?.default?.modules?.[
    module
  ]?.fields?.filter((fld) => fld.required === true);
  return requiredFlds?.length > 0
    ? requiredFlds.map((field) => ({
        formField: "",
        freshSalesFormField: field.key,
      }))
    : [{ formField: "", freshSalesFormField: "" }];
};

export const checkMappedFields = (freshSalesConf) => {
  const mappedFields = freshSalesConf?.field_map
    ? freshSalesConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField &&
          mappedField.freshSalesFormField &&
          freshSalesConf?.default?.modules?.[
            freshSalesConf.moduleData.module
          ]?.requiredFields?.indexOf(mappedField.freshSalesFormField) !== -1
      )
    : [];
  const mappedRelatedFields = freshSalesConf.relatedlists.map((relatedlist) =>
    relatedlist.field_map.filter(
      (mappedField) => !mappedField.formField && mappedField.freshSalesFormField
    )
  );
  if (
    mappedFields.length > 0 ||
    mappedRelatedFields.some((relatedField) => relatedField.length)
  ) {
    return false;
  }

  return true;
};

export const checkRequired = (freshSalesConf) => {
  if (
    freshSalesConf.moduleData?.module !== "" &&
    freshSalesConf.default.modules?.[freshSalesConf?.moduleData?.module]
      ?.required
  ) {
    if (
      ["Leads", "Deal", "Activities", "Notes"].includes(
        freshSalesConf.moduleData.module
      ) &&
      freshSalesConf.moduleData.account_id === undefined &&
      freshSalesConf.moduleData?.contact_id === undefined
    ) {
      return false;
    }

    if (
      freshSalesConf.moduleData.module === "Contacts" &&
      freshSalesConf.moduleData.account_id === undefined
    ) {
      return false;
    }
  }
  return true;
};

export const handleAuthorize = (
  confTmp,
  setError,
  setisAuthorized,
  setIsLoading
) => {
  if (!confTmp.bundle_alias || !confTmp.api_key) {
    setError({
      bundle_alias: !confTmp.bundle_alias
        ? __("Bundle Alias (Account URL) can't be empty", "bit-integrations")
        : "",
      api_key: !confTmp.api_key
        ? __("Api Key can't be empty", "bit-integrations")
        : "",
    });
    return;
  }
  setError({});
  setIsLoading(true);
  const requestParams = {
    api_key: confTmp.api_key,
    bundle_alias: confTmp.bundle_alias,
    module: "filters",
  };

  bitsFetch(requestParams, "FreshSales_authorization").then((result) => {
    if (result && result.success) {
      setisAuthorized(true);
      setIsLoading(false);
      toast.success(__("Authorized successfully", "bit-integrations"));
      return;
    }
    setIsLoading(false);
    toast.error(__("Authorized failed", "bit-integrations"));
  });
};
