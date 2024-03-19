/* eslint-disable no-console */
/* eslint-disable no-else-return */
import toast from "react-hot-toast";
import bitsFetch from "../../../Utils/bitsFetch";
import { __ } from "../../../Utils/i18nwrap";

export const handleInput = (e, zohoSheetConf, setZohoSheetConf) => {
  const newConf = { ...zohoSheetConf };
  const { name } = e.target;
  if (e.target.value !== "") {
    newConf[name] = e.target.value;
  } else {
    delete newConf[name];
  }
  setZohoSheetConf({ ...newConf });
};

export const generateMappedField = (zohoSheetConf) => {
  const requiredFlds = zohoSheetConf?.workSheetHeaders.filter(
    (fld) => fld.required === true
  );
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: "",
        zohoSheetFormField: field.key,
      }))
    : [{ formField: "", zohoSheetFormField: "" }];
};

export const checkMappedFields = (zohoSheetConf) => {
  const mappedFields = zohoSheetConf?.field_map
    ? zohoSheetConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField ||
          !mappedField.zohoSheetFormField ||
          (mappedField.formField === "custom" && !mappedField.customValue)
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};

export const getAllWorkbooks = (confTmp, setConf, loading, setLoading) => {
  setLoading({ ...loading, workbooks: true });
  const requestParams = {
    tokenDetails: confTmp.tokenDetails,
    clientId: confTmp.clientId,
    clientSecret: confTmp.clientSecret,
    dataCenter: confTmp.dataCenter,
  };

  bitsFetch(requestParams, "zohoSheet_fetch_all_work_books").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.workbooks = result.data;
      }
      setConf(newConf);
      setLoading({ ...loading, workbooks: false });
      toast.success(__("Workbooks fetched successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...loading, workbooks: false });
    toast.error(__("Workbooks fetching failed", "bit-integrations"));
  });
};

export const getAllWorksheets = (confTmp, setConf, loading, setLoading) => {
  setLoading({ ...loading, worksheets: true });
  const requestParams = {
    tokenDetails: confTmp.tokenDetails,
    clientId: confTmp.clientId,
    clientSecret: confTmp.clientSecret,
    dataCenter: confTmp.dataCenter,
    workbook: confTmp.selectedWorkbook,
  };

  bitsFetch(requestParams, "zohoSheet_fetch_all_work_sheets").then((result) => {
    if (result && result.success) {
      const newConf = { ...confTmp };
      if (result.data) {
        newConf.worksheets = result.data;
      }
      setConf(newConf);
      setLoading({ ...loading, worksheets: false });
      toast.success(__("Worksheets fetched successfully", "bit-integrations"));
      return;
    }
    setLoading({ ...loading, worksheets: false });
    toast.error(__("Worksheets fetching failed", "bit-integrations"));
  });
};

export const getWorksheetHeader = (confTmp, setConf, loading, setLoading) => {
  setLoading({ ...loading, header: true, workSheetHeaders: false });
  const requestParams = {
    tokenDetails: confTmp.tokenDetails,
    clientId: confTmp.clientId,
    clientSecret: confTmp.clientSecret,
    dataCenter: confTmp.dataCenter,
    workbook: confTmp.selectedWorkbook,
    worksheet: confTmp.selectedWorksheet,
    headerRow: confTmp.headerRow,
  };

  bitsFetch(requestParams, "zohoSheet_fetch_all_work_sheet_header").then(
    (result) => {
      if (result && result.success) {
        const newConf = { ...confTmp };
        if (result.data) {
          newConf.workSheetHeaders = result.data;
        }
        setConf(newConf);
        setLoading({ ...loading, header: false, workSheetHeaders: true });
        toast.success(
          __("Worksheet headers fetched successfully", "bit-integrations")
        );
        return;
      }
      setLoading({ ...loading, header: false, workSheetHeaders: false });
      toast.error(__(`${result.data}`, "bit-integrations"));
    }
  );
};

export const setGrantTokenResponse = (integ) => {
  const grantTokenResponse = {};
  const authWindowLocation = window.location.href;
  const queryParams = authWindowLocation
    .replace(`${window.opener.location.href}/redirect`, "")
    .split("&");
  if (queryParams) {
    queryParams.forEach((element) => {
      const gtKeyValue = element.split("=");
      if (gtKeyValue[1]) {
        // eslint-disable-next-line prefer-destructuring
        grantTokenResponse[gtKeyValue[0]] = gtKeyValue[1];
      }
    });
  }
  localStorage.setItem(`__${integ}`, JSON.stringify(grantTokenResponse));
  window.close();
};
