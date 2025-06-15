/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './ZohoCreatorCommonFunc'
import ZohoCreatorIntegLayout from './ZohoCreatorIntegLayout'

function EditZohoCreator({ allIntegURL, formFields, flow, setFlow }) {
  const { id, formID } = useParams()
  const navigate = useNavigate()
  const [creatorConf, setCreatorConf] = useState({ ...flow.flow_details })
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const saveConfig = () => {
    if (!checkMappedFields(creatorConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    saveIntegConfig(flow, setFlow, allIntegURL, creatorConf, navigate, id, 1, setIsLoading)
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-100 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-7" onChange={e => handleInput(e, creatorConf, setCreatorConf)} name="name" value={creatorConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>

      <ZohoCreatorIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, creatorConf, setCreatorConf, formID, setIsLoading, setSnackbar)}
        creatorConf={creatorConf}
        setCreatorConf={setCreatorConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!creatorConf.applicationId || !creatorConf.formId || creatorConf.field_map.length < 1}
      />
    </div>
  )
}

export default EditZohoCreator
