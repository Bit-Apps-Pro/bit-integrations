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
import { checkMappedFields, handleInput } from './SureMembersCommonFunc'
import SureMembersIntegLayout from './SureMembersIntegLayout'
import toast from 'react-hot-toast'

function EditSureMembers({ allIntegURL }) {
  const navigate = useNavigate()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [sureMembersConf, setSureMembersConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({
    auth: false,
    groups: false
  })
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!sureMembersConf.selectedTask) {
      toast.error('Please select a task!')
      return
    }

    if (!checkMappedFields(sureMembersConf)) {
      toast.error('Please map mandatory fields!')
      return
    }

    if (!sureMembersConf.selectedGroup) {
      toast.error('Please select a group!')
      return
    }

    saveActionConf({ flow, allIntegURL, conf: sureMembersConf, navigate, edit: 1, setLoading, setSnackbar })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, sureMembersConf, setSureMembersConf)} name="name" defaultValue={sureMembersConf.name || ''} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <SureMembersIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) => handleInput(e, sureMembersConf, setSureMembersConf, setLoading, setSnackbar)}
        sureMembersConf={sureMembersConf}
        setSureMembersConf={setSureMembersConf}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        // disabled={!sureMembersConf?.selectedLists}
        isLoading={isLoading}
        dataConf={sureMembersConf}
        setDataConf={setSureMembersConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditSureMembers
