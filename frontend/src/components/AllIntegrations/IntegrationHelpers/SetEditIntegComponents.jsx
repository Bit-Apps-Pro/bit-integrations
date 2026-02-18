import {
  actionHookIntegrations,
  customFormIntegrations,
  customTriggerIntegrations,
  webhookIntegrations
} from '../../../Utils/StaticData/webhookIntegrations'
import EditCustomFormSubmissionInteg from '../EditCustomFormSubmissionInteg'
import EditFormInteg from '../EditFormInteg'
import EditWebhookInteg from '../EditWebhookInteg'
import EditActionHook from '../EditActionHook'
import EditCustomTrigger from '../EditCustomTrigger'

export default function SetEditIntegComponents({ entity, setSnackbar }) {
  if (customFormIntegrations.includes(entity)) {
    return <EditCustomFormSubmissionInteg setSnackbar={setSnackbar} />
  } else if (actionHookIntegrations.includes(entity)) {
    return <EditActionHook setSnackbar={setSnackbar} />
  } else if (customTriggerIntegrations.includes(entity)) {
    return <EditCustomTrigger setSnackbar={setSnackbar} />
  } else if (webhookIntegrations.includes(entity)) {
    return <EditWebhookInteg setSnackbar={setSnackbar} />
  } else {
    return <EditFormInteg setSnackbar={setSnackbar} />
  }
}
