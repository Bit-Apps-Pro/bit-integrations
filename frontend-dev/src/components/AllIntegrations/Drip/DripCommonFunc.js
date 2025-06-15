// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from "@wordpress/i18n";
import bitsFetch from "../../../Utils/bitsFetch";

export const handleInput = (e, dripConf, setDripConf) => {
  const newConf = { ...dripConf };
  newConf.name = e.target.value;
  setDripConf({ ...newConf });
};

// refreshMappedCampaigns
export const refreshDripCampaign = (
  dripConf,
  setDripConf,
  setIsLoading,
  setSnackbar
) => {
  const refreshCampaignsRequestParams = {
    api_token: dripConf.api_token,
    account_id: dripConf.account_id,
  };
  bitsFetch(refreshCampaignsRequestParams, "drip_campaigns")
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...dripConf };
        if (result.data.dripCampaigns) {
          if (!newConf.default) {
            newConf.default = {};
          }
          newConf.default.dripCampaigns = result.data.dripCampaigns;
          setSnackbar({
            show: true,
            msg: __("Drip campaigns refreshed", "bit-integrations"),
          });
        } else {
          setSnackbar({
            show: true,
            msg: __(
              "No Drip campaigns found. Try changing the header row number or try again",
              "bit-integrations"
            ),
          });
        }

        setDripConf({ ...newConf });
      } else {
        setSnackbar({
          show: true,
          msg: __(
            "Drip campaigns refresh failed. please try again",
            "bit-integrations"
          ),
        });
      }
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
};

// refreshMappedFields
export const refreshDripHeader = (
  dripConf,
  setDripConf,
  setIsLoading,
  setSnackbar
) => {
  const refreshCampaignsRequestParams = {
    api_token: dripConf.api_token,
    campaign_id: dripConf.campaignId,
  };

  bitsFetch(refreshCampaignsRequestParams, "drip_headers")
    .then((result) => {
      if (result && result.success) {
        const newConf = { ...dripConf };
        if (result.data.dripField) {
          if (!newConf.default) {
            newConf.default = {};
          }

          newConf.default.fields = result.data.dripField;
          const { fields } = newConf.default;
          newConf.field_map = Object.values(fields)
            .filter((f) => f.required)
            .map((f) => ({
              formField: "",
              dripField: f.fieldValue,
              required: true,
            }));
          setSnackbar({
            show: true,
            msg: __("Drip fields refreshed", "bit-integrations"),
          });
        } else {
          setSnackbar({
            show: true,
            msg: __(
              "No Drip fields found. Try changing the header row number or try again",
              "bit-integrations"
            ),
          });
        }

        setDripConf({ ...newConf });
      } else {
        setSnackbar({
          show: true,
          msg: __(
            "Drip fields refresh failed. please try again",
            "bit-integrations"
          ),
        });
      }
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
};

export const checkMappedFields = (dripConf) => {
  const mappedFields = dripConf?.field_map
    ? dripConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField &&
          mappedField.dripField &&
          mappedField.required
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};
