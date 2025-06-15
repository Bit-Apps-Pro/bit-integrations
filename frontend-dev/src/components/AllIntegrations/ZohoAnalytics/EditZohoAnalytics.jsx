/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput } from './ZohoAnalyticsCommonFunc'
import ZohoAnalyticsIntegLayout from './ZohoAnalyticsIntegLayout'

function EditZohoRecruit({ allIntegURL, formFields, flow, setFlow }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [analyticsConf, setAnalyticsConf] = useState({ ...flow.flow_details })
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-100 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-7" onChange={e => handleInput(e, analyticsConf, setAnalyticsConf)} name="name" value={analyticsConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />
      <br />

      <ZohoAnalyticsIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, analyticsConf, setAnalyticsConf, formID, setIsLoading, setSnackbar)}
        analyticsConf={analyticsConf}
        setAnalyticsConf={setAnalyticsConf}
        isLoading={isLoading}
        step={2}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, analyticsConf, navigate, id, 1, setIsLoading)}
        disabled={analyticsConf.workspace === '' || analyticsConf.table === '' || analyticsConf.field_map.length < 1}
      />
      <br />
    </div>
  )
}

export default EditZohoRecruit
