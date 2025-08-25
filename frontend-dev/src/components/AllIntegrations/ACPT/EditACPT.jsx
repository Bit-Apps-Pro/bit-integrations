/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { checkMappedFields, handleInput } from './ACPTCommonFunc'
import ACPTIntegLayout from './ACPTIntegLayout'

function EditACPT({ allIntegURL }) {
  const navigate = useNavigate()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [acptConf, setAcptConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(acptConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    if (acptConf.module != 'update_license' && !checkMappedFields(acptConf)) {
      toast.error(__('Please map mandatory fields', 'bit-integrations'))
      return
    }

    if (acptConf.module === 'create_license' && !acptConf?.selectedStatus) {
      toast.error(__('Please select Status', 'bit-integrations'))
      return
    }

    if (acptConf.module === 'update_license' && !acptConf?.selectedLicense) {
      toast.error(__('Please select Status', 'bit-integrations'))
      return
    }

    saveActionConf({
      flow,
      allIntegURL,
      conf: acptConf,
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
          onChange={e => handleInput(e, acptConf, setAcptConf)}
          name="name"
          value={acptConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <ACPTIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        acptConf={acptConf}
        setAcptConf={setAcptConf}
        loading={loading}
        setLoading={setLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(acptConf)}
        isLoading={isLoading}
        dataConf={acptConf}
        setDataConf={setAcptConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditACPT
