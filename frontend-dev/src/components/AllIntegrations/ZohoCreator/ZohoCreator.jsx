import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ZohoCreatorAuthorization from './ZohoCreatorAuthorization'
import { checkMappedFields, handleInput } from './ZohoCreatorCommonFunc'
import ZohoCreatorIntegLayout from './ZohoCreatorIntegLayout'

function ZohoCreator({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [creatorConf, setCreatorConf] = useState({
    name: 'Zoho Creator',
    type: 'Zoho Creator',
    clientId: process.env.NODE_ENV === 'development' ? '1000.YN34H0SNYOASNVTOYPKPO158PD8VTD' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '04e7b570f25f7702d93a84a3ab8121880788782464' : '',
    accountOwner: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
    actions: {},
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoCreator')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (!checkMappedFields(creatorConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    setStep(2)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <ZohoCreatorAuthorization
        formID={formID}
        creatorConf={creatorConf}
        setCreatorConf={setCreatorConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>
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

        <button
          onClick={() => nextPage(3)}
          // disabled={creatorConf.department === '' || creatorConf.table === '' || creatorConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
        </button>

      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, creatorConf, navigate)}
      />
    </div>
  )
}

export default ZohoCreator
