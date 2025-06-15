import toast from "react-hot-toast";
import bitsFetch from "../../../../Utils/bitsFetch";
import { __ } from "../../../../Utils/i18nwrap";
import { create } from "mutative";

export const getAllOrderStatus = (data, setFlow) => {
  const loadPostTypes = bitsFetch(
    null,
    "get_all_order_status",
    null,
    "GET"
  ).then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data };
      tmpFlow.flow_details.orderStatus = result.data;
      setFlow({ ...tmpFlow });
      return "Fetched order status successfully";
    }
    return "Order status fetching failed. please try again";
  });
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __("Error Occurred", "bit-integrations"),
    loading: __("Loading order status..."),
  });
};

export const getAllSubscriptionProduct = (data, setFlow) => {
  const loadQuizType = bitsFetch(
    null,
    "get_all_subscription_product",
    null,
    "GET"
  ).then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data };
      tmpFlow.flow_details.subscriptions = result.data;
      setFlow({ ...tmpFlow });
      return "Fetched subscription product successfully";
    }
    return "Subscription product fetching failed. please try again";
  });
  toast.promise(loadQuizType, {
    success: (data) => data,
    error: __("Error Occurred", "bit-integrations"),
    loading: __("Loading subscription product..."),
  });
};

export const getAllSubscriptionStatus = (data, setFlow) => {
  const loadQuizType = bitsFetch(
    null,
    "get_all_subscription_status",
    null,
    "GET"
  ).then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data };
      tmpFlow.flow_details.subscriptionStatus = result.data;
      setFlow({ ...tmpFlow });
      return "Fetched subscription status successfully";
    }
    return "Subscription status fetching failed. please try again";
  });
  toast.promise(loadQuizType, {
    success: (data) => data,
    error: __("Error Occurred", "bit-integrations"),
    loading: __("Loading subscription status product..."),
  });
};

export const getAllWCProducts = (data, setFlow) => {
  const loadQuizType = bitsFetch(
    null,
    "get_all_woocommerce_product",
    null,
    "GET"
  ).then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data };
      tmpFlow.flow_details.products = result.data;
      setFlow({ ...tmpFlow });
      return "Fetched all product successfully";
    }
    return "All product fetching failed. please try again";
  });
  toast.promise(loadQuizType, {
    success: (data) => data,
    error: __("Error Occurred", "bit-integrations"),
    loading: __("Loading all product..."),
  });
};

export const getAllWCProductCategory = (data, setFlow) => {
  const loadQuizType = bitsFetch(
    null,
    "get_all_product_category",
    null,
    "GET"
  ).then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data };
      tmpFlow.flow_details.allProductCategories = result.data;
      setFlow({ ...tmpFlow });
      return "All product categories fetched successfully";
    }
    return "Product categories fetching failed. please try again";
  });
  toast.promise(loadQuizType, {
    success: (data) => data,
    error: __("Error Occurred", "bit-integrations"),
    loading: __("Loading categories product..."),
  });
};

export const getVariationsByProduct = (
  val,
  tmpNewFlow,
  setNewFlow,
  edit = false
) => {
  const queryParams = { product_id: val };
  const loadPostTypes = bitsFetch(
    null,
    "get_all_variation_by_product",
    queryParams,
    "GET"
  ).then((result) => {
    if (result && result.success) {
      // rubel vai code with immer js
      setNewFlow(
        create(tmpNewFlow, (draftConf) => {
          if (!edit) {
            draftConf.triggerData.allVariation = result.data;
          } else {
            if (draftConf.flow_details === undefined) {
              draftConf.flow_details = {};
            }
            draftConf.flow_details.allVariation = result.data;
          }
        })
      );

      return "Fetched all variation successfully";
    }
    return "Variation fetching failed. please try again";
  });
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __("Error Occurred here", "bit-integrations"),
    loading: __("Loading variation..."),
  });
};
