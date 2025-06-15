import toast from "react-hot-toast";
import bitsFetch from "../../../../Utils/bitsFetch";
import { __ } from "../../../../Utils/i18nwrap";

export const getTopicByForum = (val, tmpNewFlow, setNewFlow, edit = false) => {
  const queryParams = { forum_id: val };
  const loadPostTypes = bitsFetch(
    null,
    "get_all_topic_by_forum",
    queryParams,
    "GET"
  ).then((result) => {
    if (result && result.success) {
      // const newConf = { ...tmpNewFlow }
      // if (!edit) {
      //   newConf.triggerData.topics = result.data
      // } else {
      //   if (newConf.flow_details === undefined) {
      //     newConf.flow_details = {}
      //   }
      //   newConf.flow_details.topics = result.data
      // }
      // setNewFlow({ ...newConf })

      // rubel vai code with prev state
      // setNewFlow(prevConf => {
      //   const newConf = { ...prevConf }
      //   if (!edit) {
      //     newConf.triggerData.topics = result.data
      //   } else {
      //     if (newConf.flow_details === undefined) {
      //       newConf.flow_details = {}
      //     }
      //     newConf.flow_details.topics = result.data
      //   }

      //   return newConf
      // })

      // rubel vai code with immer js
      setNewFlow(
        create(tmpNewFlow, (draftConf) => {
          if (!edit) {
            draftConf.triggerData.topics = result.data;
          } else {
            if (draftConf.flow_details === undefined) {
              draftConf.flow_details = {};
            }
            draftConf.flow_details.topics = result.data;
          }
        })
      );

      return "Fetched Topic successfully";
    }
    return "Topics fetching failed. please try again";
  });
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __("Error Occurred here", "bit-integrations"),
    loading: __("Loading Topic..."),
  });
};

export const getBuddybossTopicByForum = (data, setFlow) => {
  const queryParams = { forum_id: data.flow_details.selectedForum };

  const loadPostTypes = bitsFetch(
    null,
    "get_all_topic",
    queryParams,
    "GET"
  ).then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data };
      tmpFlow.flow_details.topics = result.data;

      setFlow({ ...tmpFlow });
      return "Fetched Topic successfully";
    }
    return "Topics fetching failed. please try again";
  });
  toast.promise(loadPostTypes, {
    success: (data) => data,
    error: __("Error Occurred", "bit-integrations"),
    loading: __("Loading Topic..."),
  });
};

export const getBuddybossForum = (data, setFlow) => {
  const loadQuizType = bitsFetch(null, "get_all_forum", null, "GET").then(
    (result) => {
      if (result && result.success) {
        const tmpFlow = { ...data };
        tmpFlow.flow_details.forums = result.data;
        setFlow({ ...tmpFlow });
        return "Fetched Forums successfully";
      }
      return "Forums fetching failed. please try again";
    }
  );
  toast.promise(loadQuizType, {
    success: (data) => data,
    error: __("Error Occurred", "bit-integrations"),
    loading: __("Loading Forums..."),
  });
};

export const getBuddybossGroup = (data, setFlow) => {
  const queryParams = { select_option_id: data.triggered_entity_id };

  const loadQuizType = bitsFetch(
    null,
    "get_all_group",
    queryParams,
    "GET"
  ).then((result) => {
    if (result && result.success) {
      const tmpFlow = { ...data };
      tmpFlow.flow_details.groups = result.data;
      setFlow({ ...tmpFlow });
      return "Fetched groups successfully";
    }
    return "groups fetching failed. please try again";
  });
  toast.promise(loadQuizType, {
    success: (data) => data,
    error: __("Error Occurred", "bit-integrations"),
    loading: __("Loading Groups..."),
  });
};
