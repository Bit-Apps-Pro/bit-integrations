/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import EditWebhookInteg from '../EditWebhookInteg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './FabmanCommonFunc'
import FabmanIntegLayout from './FabmanIntegLayout'

function EditFabman({ allIntegURL }) {
  const navigate = useNavigate()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [fabmanConf, setFabmanConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({
    list: false,
    field: false,
    auth: false
  })
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!fabmanConf.actionName) {
      setSnackbar({ show: true, msg: __('Please select an action', 'bit-integrations') })
      return
    }
    const isDeleteAction = fabmanConf.actionName === 'delete_member'
    if (!isDeleteAction && !checkMappedFields(fabmanConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    const requiresWorkspaceSelection =
      fabmanConf.actionName === 'update_member' ||
      fabmanConf.actionName === 'delete_member' ||
      fabmanConf.actionName === 'update_spaces'

    if (requiresWorkspaceSelection && !fabmanConf.selectedWorkspace) {
      setSnackbar({ show: true, msg: __('Please select a workspace', 'bit-integrations') })
      return
    }

    const requiresMemberSelection =
      fabmanConf.actionName === 'update_member' || fabmanConf.actionName === 'delete_member'
    if (requiresMemberSelection && !fabmanConf.selectedMember) {
      setSnackbar({ show: true, msg: __('Please select a member', 'bit-integrations') })
      return
    }

    saveActionConf({
      flow,
      allIntegURL,
      conf: fabmanConf,
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
          onChange={e => handleInput(e, fabmanConf, setFabmanConf)}
          name="name"
          value={fabmanConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <FabmanIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={e => handleInput(e, fabmanConf, setFabmanConf, setLoading, setSnackbar)}
        fabmanConf={fabmanConf}
        setFabmanConf={setFabmanConf}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={
          !fabmanConf.actionName ||
          (fabmanConf.actionName !== 'delete_member' && !checkMappedFields(fabmanConf)) ||
          (['update_member', 'delete_member', 'update_spaces', 'delete_spaces'].includes(
            fabmanConf.actionName
          ) &&
            !fabmanConf.selectedWorkspace) ||
          (['update_member', 'delete_member'].includes(fabmanConf.actionName) &&
            !fabmanConf.selectedMember)
        }
        isLoading={isLoading}
        dataConf={fabmanConf}
        setDataConf={setFabmanConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditFabman
