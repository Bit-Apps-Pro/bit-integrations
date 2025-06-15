/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import EditWebhookInteg from '../EditWebhookInteg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './ClickupCommonFunc'
import ClickupIntegLayout from './ClickupIntegLayout'

function EditClickup({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [clickupConf, setClickupConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(clickupConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (clickupConf.actionName === 'task') {
      if (!clickupConf.selectedTeam) {
        toast.error(__('Please select a team', 'bit-integrations'))
        return
      }
      if (!clickupConf.selectedSpace) {
        toast.error(__('Please select a space', 'bit-integrations'))
        return
      }
      if (!clickupConf.selectedFolder) {
        toast.error(__('Please select a folder', 'bit-integrations'))
        return
      }
      if (!clickupConf.selectedList) {
        toast.error(__('Please select a list', 'bit-integrations'))
        return
      }
    }

    saveActionConf({
      flow,
      allIntegURL,
      conf: clickupConf,
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
          onChange={(e) => handleInput(e, clickupConf, setClickupConf)}
          name="name"
          value={clickupConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <ClickupIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) => handleInput(e, clickupConf, setClickupConf, setLoading, setSnackbar)}
        clickupConf={clickupConf}
        setClickupConf={setClickupConf}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(clickupConf)}
        isLoading={isLoading}
        dataConf={clickupConf}
        setDataConf={setClickupConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditClickup
