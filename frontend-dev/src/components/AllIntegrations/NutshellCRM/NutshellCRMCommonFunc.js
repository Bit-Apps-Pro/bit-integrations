/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from "react-hot-toast";
import bitsFetch from "../../../Utils/bitsFetch";
import { __ } from "../../../Utils/i18nwrap";

export const handleInput = (e, nutshellCRMConf, setNutshellCRMConf) => {
  const newConf = { ...nutshellCRMConf };
  const { name } = e.target;
  if (e.target.value !== "") {
    newConf[name] = e.target.value;
  } else {
    delete newConf[name];
  }
  setNutshellCRMConf({ ...newConf });
};

export const generateMappedField = (nutshellCRMConf) => {
  const requiredFlds =
    nutshellCRMConf?.nutshellCRMFields &&
    nutshellCRMConf?.nutshellCRMFields.filter(
      (fld) =>
        fld.required === true && fld.key !== "owner" && fld.key !== "pipeline"
    );
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: "",
        nutshellCRMFormField: field.key,
      }))
    : [{ formField: "", nutshellCRMFormField: "" }];
};

export const checkMappedFields = (nutshellCRMConf) => {
  const mappedFields = nutshellCRMConf?.field_map
    ? nutshellCRMConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField ||
          !mappedField.nutshellCRMFormField ||
          (mappedField.formField === "custom" && !mappedField.customValue) ||
          (mappedField.nutshellCRMFormField === "customFieldKey" &&
            !mappedField.customFieldKey)
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};

export const nutshellCRMAuthentication = (
  confTmp,
  setConf,
  setError,
  setIsAuthorized,
  loading,
  setLoading
) => {
  if (!confTmp.user_name || !confTmp.api_token) {
    setError({
      user_name: !confTmp.user_name
        ? __("User Name can't be empty", "bit-integrations")
        : "",
      api_token: !confTmp.api_token
        ? __("API Token can't be empty", "bit-integrations")
        : "",
    });
    return;
  }

  setError({});
  setLoading({ ...loading, auth: true });

  const requestParams = {
    user_name: confTmp.user_name,
    api_token: confTmp.api_token,
  };

  bitsFetch(requestParams, "nutshellcrm_authentication").then((result) => {
    if (result && result.success) {
      setIsAuthorized(true);
      setLoading({ ...loading, auth: false });
      toast.success(__("Authorized successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...loading, auth: false });
    toast.error(
      __(
        "Authorized failed, Please enter valid User Name & Api Token",
        "bit-integrations"
      )
    );
  });
};


export const getAllCompanies = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, companies: true });

  const requestParams = {
    user_name: confTmp.user_name,
    api_token: confTmp.api_token,
  };

  bitsFetch(requestParams, "nutshellcrm_fetch_all_companies").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.companies = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, companies: false });

      toast.success(__("Companies fetched successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, companies: false });
    toast.error(__("Companies fetching failed", "bit-integrations"));
  });
};

export const getAllContacts = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, contacts: true });

  const requestParams = {
    user_name: confTmp.user_name,
    api_token: confTmp.api_token,
  };

  bitsFetch(requestParams, "nutshellcrm_fetch_all_contacts").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.contacts = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, contacts: false });

      toast.success(__("Contacts fetched successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, contacts: false });
    toast.error(__("Contacts fetching failed", "bit-integrations"));
  });
};

export const getAllSources = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, sources: true });

  const requestParams = {
    user_name: confTmp.user_name,
    api_token: confTmp.api_token,
  };

  bitsFetch(requestParams, "nutshellcrm_fetch_all_sources").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.sources = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, sources: false });

      toast.success(__("Sources fetched successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, sources: false });
    toast.error(__("Sources fetching failed", "bit-integrations"));
  });
};
export const getAllTags = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, tags: true });

  const requestParams = {
    user_name: confTmp.user_name,
    api_token: confTmp.api_token,
  };

  bitsFetch(requestParams, "nutshellcrm_fetch_all_tags").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.tags = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, tags: false });

      toast.success(__("Tags fetched successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, tags: false });
    toast.error(__("Tags fetching failed", "bit-integrations"));
  });
};

export const getAllProducts = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, products: true });

  const requestParams = {
    user_name: confTmp.user_name,
    api_token: confTmp.api_token,
  };

  bitsFetch(requestParams, "nutshellcrm_fetch_all_products").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.products = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, products: false });

      toast.success(__("Products fetched successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, products: false });
    toast.error(__("Products fetching failed", "bit-integrations"));
  });
};

export const getAllCompanyTypes = (confTmp, setConf, setLoading) => {
  setLoading({ ...setLoading, companyTypes: true });

  const requestParams = {
    user_name: confTmp.user_name,
    api_token: confTmp.api_token,
  };

  bitsFetch(requestParams, "nutshellcrm_fetch_all_companytypes").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.companyTypes = result.data;
      }
      setConf(newConf);
      setLoading({ ...setLoading, companyTypes: false });

      toast.success(__("CompanyTypes fetched successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...setLoading, companyTypes: false });
    toast.error(__("CompanyTypes fetching failed", "bit-integrations"));
  });
};
