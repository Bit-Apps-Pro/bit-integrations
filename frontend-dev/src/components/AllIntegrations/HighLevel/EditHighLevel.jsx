/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import SnackMsg from '../../Utilities/SnackMsg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import { checkMappedFields, handleInput } from './HighLevelCommonFunc'
import HighLevelIntegLayout from './HighLevelIntegLayout'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import EditWebhookInteg from '../EditWebhookInteg'
import toast from 'react-hot-toast'
import { OPTIONAL_FIELD_MAP_ARRAY, TASK_LIST_VALUES } from './highlevelConstants'

function EditHighLevel({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [highLevelConf, setHighLevelConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [loading, setLoading] = useState({
    auth: false,
    customFields: false,
    options: false,
    contacts: false,
    users: false,
    hlTasks: false,
    pipelines: false,
    opportunities: false
  })

  const saveConfig = () => {
    if (!OPTIONAL_FIELD_MAP_ARRAY.includes(highLevelConf.selectedTask)) {
      if (!checkMappedFields(highLevelConf)) {
        toast.error('Please map all required fields to continue!')
        return
      }
    }

    if (!highLevelConf?.selectedTask) {
      toast.error('Please select task to continue!')
      return
    }

    if (highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_CONTACT) {
      if (!highLevelConf.selectedContact && !checkMappedFields(highLevelConf)) {
        toast.error('Please select a contact or map fields!')
        return
      }
    }

    if (
      highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_TASK ||
      highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_TASK
    ) {
      if (!highLevelConf.selectedContact && !checkMappedFields(highLevelConf)) {
        toast.error('Please select a contact or map fields!')
        return
      }
    }

    if (highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_TASK) {
      if (!highLevelConf.updateTaskId && !checkMappedFields(highLevelConf)) {
        toast.error('Please select a task or map fields!')
        return
      }
    }

    if (
      highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_OPPORTUNITY ||
      highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_OPPORTUNITY
    ) {
      if (!highLevelConf.selectedPipeline) {
        toast.error('Please select a pipeline!')
        return
      }

      if (!highLevelConf.selectedStage) {
        toast.error('Please select a stage!')
        return
      }

      if (!highLevelConf.selectedTaskStatus) {
        toast.error('Please select a status!')
        return
      }
    }

    if (highLevelConf.field_map.length > 0) {
      saveActionConf({
        flow,
        setFlow,
        allIntegURL,
        navigate,
        conf: highLevelConf,
        edit: 1,
        setIsLoading,
        setSnackbar
      })
    }
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, highLevelConf, setHighLevelConf)}
          name="name"
          value={highLevelConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <HighLevelIntegLayout
        formID={formID}
        formFields={formFields}
        highLevelConf={highLevelConf}
        setHighLevelConf={setHighLevelConf}
        loading={loading}
        setLoading={setLoading}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!highLevelConf.selectedTask}
        isLoading={isLoading}
        dataConf={highLevelConf}
        setDataConf={setHighLevelConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditHighLevel
