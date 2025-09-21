/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { useState, useEffect } from 'react'
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
  const [loading, setLoading] = useState({
    list: false,
    field: false,
    auth: false
  })
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const [localName, setLocalName] = useState(fabmanConf.name || '')
  useEffect(() => {
    setLocalName(fabmanConf.name || '')
  }, [fabmanConf.name])

  const isConfigInvalid = () => {
    if (!fabmanConf.actionName) return true
    const isDeleteAction = fabmanConf.actionName === 'delete_member'
    if (!isDeleteAction && !checkMappedFields(fabmanConf)) return true
    if (
      ['update_member', 'delete_member', 'update_spaces', 'delete_spaces'].includes(
        fabmanConf.actionName
      ) &&
      !fabmanConf.selectedWorkspace
    )
      return true
    if (['update_member', 'delete_member'].includes(fabmanConf.actionName) && !fabmanConf.selectedMember)
      return true
    return false
  }

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
      fabmanConf.actionName === 'update_spaces' ||
      fabmanConf.actionName === 'delete_spaces'
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

  const handleNameChange = e => {
    setLocalName(e.target.value)
  }
  const handleNameBlur = () => {
    if (localName !== fabmanConf.name) {
      setFabmanConf(prev => ({ ...prev, name: localName }))
    }
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          name="name"
          value={localName}
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
        disabled={isConfigInvalid()}
        isLoading={loading.list || loading.field || loading.auth}
        dataConf={fabmanConf}
        setDataConf={setFabmanConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditFabman
