/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { toast } from 'react-hot-toast'
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
import { checkMappedFields, handleInput } from './LMFWCCommonFunc'
import LMFWCIntegLayout from './LMFWCIntegLayout'

function EditLMFWC({ allIntegURL }) {
  const navigate = useNavigate()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [licenseManagerConf, setLicenseManagerConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(licenseManagerConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    if (licenseManagerConf.module != 'update_license' && !checkMappedFields(licenseManagerConf)) {
      toast.error(__('Please map mandatory fields', 'bit-integrations'))
      return
    }

    if (licenseManagerConf.module === 'create_license' && !licenseManagerConf?.selectedStatus) {
      toast.error(__('Please select Status', 'bit-integrations'))
      return
    }

    if (licenseManagerConf.module === 'update_license' && !licenseManagerConf?.selectedLicense) {
      toast.error(__('Please select Status', 'bit-integrations'))
      return
    }

    saveActionConf({
      flow,
      allIntegURL,
      conf: licenseManagerConf,
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
          onChange={(e) => handleInput(e, licenseManagerConf, setLicenseManagerConf)}
          name="name"
          value={licenseManagerConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <LMFWCIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        licenseManagerConf={licenseManagerConf}
        setLicenseManagerConf={setLicenseManagerConf}
        loading={loading}
        setLoading={setLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(licenseManagerConf)}
        isLoading={isLoading}
        dataConf={licenseManagerConf}
        setDataConf={setLicenseManagerConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditLMFWC
