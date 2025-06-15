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
import { checkMappedFields, handleInput } from './OneHashCRMCommonFunc'
import OneHashCRMIntegLayout from './OneHashCRMIntegLayout'

function EditOneHashCRM({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [oneHashCRMConf, setOneHashCRMConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(oneHashCRMConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (oneHashCRMConf.actionName === 'customer' && !oneHashCRMConf.selectedCustomerType) {
      toast.error(__('Please select Customer Type', 'bit-integrations'))
      return
    }
    if (oneHashCRMConf.actionName === 'lead' && !oneHashCRMConf.selectedLeadStatus) {
      toast.error(__('Please select Lead Status', 'bit-integrations'))
      return
    }

    saveActionConf({
      flow,
      allIntegURL,
      conf: oneHashCRMConf,
      navigate,
      edit: 1,
      setIsLoading,
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
          onChange={(e) => handleInput(e, oneHashCRMConf, setOneHashCRMConf)}
          name="name"
          value={oneHashCRMConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <OneHashCRMIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) =>
          handleInput(e, oneHashCRMConf, setOneHashCRMConf, setLoading, setSnackbar)
        }
        oneHashCRMConf={oneHashCRMConf}
        setOneHashCRMConf={setOneHashCRMConf}
        loading={loading}
        setLoading={setLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(oneHashCRMConf)}
        isLoading={isLoading}
        dataConf={oneHashCRMConf}
        setDataConf={setOneHashCRMConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditOneHashCRM
