import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { handleInput, validateRequiredFields } from './WCAffiliateCommonFunc'
import WCAffiliateIntegLayout from './WCAffiliateIntegLayout'

export default function EditWCAffiliate({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [wcAffiliateConf, setWCAffiliateConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const validation = validateRequiredFields(wcAffiliateConf)

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={e => handleInput(e, wcAffiliateConf, setWCAffiliateConf)}
          name="name"
          value={wcAffiliateConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <WCAffiliateIntegLayout
        formID={formID}
        formFields={formFields}
        wcAffiliateConf={wcAffiliateConf}
        setWCAffiliateConf={setWCAffiliateConf}
        setSnackbar={setSnackbar}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => {
          if (!validation.isValid) {
            setSnackbar({
              show: true,
              msg: validation.message
            })
            return
          }

          saveActionConf({
            flow,
            setFlow,
            allIntegURL,
            conf: wcAffiliateConf,
            navigate,
            id,
            edit: 1,
            setIsLoading,
            setSnackbar
          })
        }}
        disabled={!validation.isValid}
        isLoading={isLoading}
        dataConf={wcAffiliateConf}
        setDataConf={setWCAffiliateConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}
