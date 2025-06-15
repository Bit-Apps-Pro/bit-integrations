import { __ } from "../../../Utils/i18nwrap";
import bitsFetch from "../../../Utils/bitsFetch";
import { create } from "mutative";

export const refreshCrmList = (
  formID,
  fluentCrmConf,
  setFluentCrmConf,
  loading,
  setLoading,
  setSnackbar
) => {
  setLoading({ ...loading, fluentCrmList: true });
  bitsFetch({}, "refresh_fluent_crm_lists")
    .then((result) => {
      if (result && result.success) {
        setFluentCrmConf((prevConf) =>
          create(prevConf, (newConf) => {
            newConf.fluentCrmList = result.data.fluentCrmList;
            newConf.fluentCrmTags = result.data.fluentCrmTags;
          })
        );
        setSnackbar({
          show: true,
          msg: __("FluentCRM list refreshed", "bit-integrations"),
        });
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === "string")
      ) {
        setSnackbar({
          show: true,
          msg: `${__(
            "FluentCRM list refresh failed Cause:",
            "bit-integrations"
          )}${result.data.data || result.data}. ${__(
            "please try again",
            "bit-integrations"
          )}`,
        });
      } else {
        setSnackbar({
          show: true,
          msg: __(
            "FluentCRM list refresh failed. please try again",
            "bit-integrations"
          ),
        });
      }
      setLoading({ ...loading, fluentCrmList: false });
    })
    .catch(() => setLoading({ ...loading, fluentCrmTags: true }));
};

export const refreshCrmTag = (
  formID,
  fluentCrmConf,
  setFluentCrmConf,
  loading,
  setLoading,
  setSnackbar
) => {
  setLoading({ ...loading, fluentCrmTags: true });
  bitsFetch({}, "refresh_fluent_crm_tags")
    .then((result) => {
      if (result && result.success) {
        setFluentCrmConf((prevConf) =>
          create(prevConf, (newConf) => {
            if (!newConf.default) {
              newConf.default = {};
            }
            if (result.data.fluentCrmTags) {
              newConf.fluentCrmTags = result.data.fluentCrmTags;
            }
          })
        );
        setSnackbar({
          show: true,
          msg: __("FluentCRM Tags refreshed", "bit-integrations"),
        });
      } else if (
        (result && result.data && result.data.data) ||
        (!result.success && typeof result.data === "string")
      ) {
        setSnackbar({
          show: true,
          msg: `${__(
            "FluentCRM tags refresh failed Cause:",
            "bit-integrations"
          )}${result.data.data || result.data}. ${__(
            "please try again",
            "bit-integrations"
          )}`,
        });
      } else {
        setSnackbar({
          show: true,
          msg: __(
            "FluentCRM tags refresh failed. please try again",
            "bit-integrations"
          ),
        });
      }
      setLoading({ ...loading, fluentCrmTags: false });
    })
    .catch(() => setLoading({ ...loading, fluentCrmTags: false }));
};

export const refreshfluentCrmHeader = (
  fluentCrmConf,
  setFluentCrmConf,
  setIsLoading,
  setSnackbar
) => {
  setIsLoading(true);
  bitsFetch({}, "fluent_crm_headers")
    .then((result) => {
      if (result && result.success) {
        if (result.data.fluentCrmFlelds) {
          setFluentCrmConf((prevConf) =>
            create(prevConf, (newConf) => {
              newConf.fluentCrmFlelds = result.data.fluentCrmFlelds;
              newConf.field_map = mapNewRequiredFields(newConf);
            })
          );
          setSnackbar({
            show: true,
            msg: __("Fluent CRM fields refreshed", "bit-integrations"),
          });
        } else {
          setSnackbar({
            show: true,
            msg: __(
              "No Fluent CRM fields found. Try changing the header row number or try again",
              "bit-integrations"
            ),
          });
        }
      } else {
        setSnackbar({
          show: true,
          msg: __(
            "Fluent CRM fields refresh failed. please try again",
            "bit-integrations"
          ),
        });
      }
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
};

export const mapNewRequiredFields = (fluentCrmConf) => {
  const { field_map } = fluentCrmConf;
  const { fluentCrmFlelds } = fluentCrmConf;
  const required = Object.values(fluentCrmFlelds)
    .filter((f) => f.required)
    .map((f) => ({ formField: "", fluentCRMField: f.key, required: true }));
  const requiredFieldNotInFieldMap = required.filter(
    (f) => !field_map.find((m) => m.fluentCRMField === f.fluentCRMField)
  );
  const notEmptyFieldMap = field_map.filter(
    (f) => f.fluentCRMField || f.formField
  );
  const newFieldMap = notEmptyFieldMap.map((f) => {
    const field = fluentCrmFlelds[f.fluentCRMField];
    if (field) {
      return { ...f, formField: field.label };
    }
    return f;
  });
  return [...requiredFieldNotInFieldMap, ...newFieldMap];
};

export const handleInput = (e, fluentCrmConf, setFluentCrmConf) => {
  const newConf = { ...fluentCrmConf };
  newConf.name = e.target.value;
  setFluentCrmConf({ ...newConf });
};
export const checkMappedFields = (fluentCrmConf) => {
  const mappedFields = fluentCrmConf?.field_map
    ? fluentCrmConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField &&
          mappedField.fluentCRMField &&
          mappedField.required
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};
