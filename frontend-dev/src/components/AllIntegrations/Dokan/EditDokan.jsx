/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import DokanIntegLayout from './DokanIntegLayout'
import toast from 'react-hot-toast'
import { TASK_LIST_VALUES } from './dokanConstants'
import { checkMappedFields, handleInput } from './dokanCommonFunctions'

function EditDokan({ allIntegURL }) {
  const navigate = useNavigate()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [dokanConf, setDokanConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({
    auth: false,
    reputation: false,
    forums: false,
    topics: false,
    euFields: false
  })
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!dokanConf.selectedTask) {
      toast.error('Please select a task!')
      return
    }

    if (dokanConf.selectedTask !== TASK_LIST_VALUES.DELETE_TOPIC && !checkMappedFields(dokanConf)) {
      toast.error('Please map mandatory fields!')
      return
    }

    if (
      dokanConf.selectedTask === TASK_LIST_VALUES.USER_REPUTATION &&
      !dokanConf.selectedReputation
    ) {
      toast.error('Please select a reputation!')
      return
    }

    if (dokanConf.selectedTask === TASK_LIST_VALUES.ADD_TO_GROUP && !dokanConf.selectedGroup) {
      toast.error('Please select a group!')
      return
    }

    if (dokanConf.selectedTask === TASK_LIST_VALUES.REMOVE_FROM_GROUP && !dokanConf.selectedGroup) {
      toast.error('Please select a group!')
      return
    }

    if (dokanConf.selectedTask === TASK_LIST_VALUES.CREATE_TOPIC && !dokanConf.selectedForum) {
      toast.error('Please select a forum!')
      return
    }

    if (
      dokanConf.selectedTask === TASK_LIST_VALUES.DELETE_TOPIC &&
      !dokanConf.selectedTopic &&
      !checkMappedFields(dokanConf)
    ) {
      toast.error('Please select a topic or map fields!')
      return
    }

    saveActionConf({
      flow,
      allIntegURL,
      conf: dokanConf,
      navigate,
      edit: 1,
      setLoading,
      setSnackbar
    })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, dokanConf, setDokanConf)}
          name="name"
          defaultValue={dokanConf.name || ''}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <DokanIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) => handleInput(e, dokanConf, setDokanConf, setLoading, setSnackbar)}
        dokanConf={dokanConf}
        setDokanConf={setDokanConf}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        // disabled={!dokanConf?.selectedLists}
        isLoading={isLoading}
        dataConf={dokanConf}
        setDataConf={setDokanConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditDokan
