/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { setGrantTokenResponse } from '../IntegrationHelpers/GoogleIntegrationHelpers'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import GoogleContactsAuthorization from './GoogleContactsAuthorization'
import { checkMappedFields } from './GoogleContactsCommonFunc'
import GoogleContactsIntegLayout from './GoogleContactsIntegLayout'

function GoogleContacts({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { flowID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const allActions = [
    { key: '1', label: 'Create a contact' },
    { key: '2', label: 'Update a contact' },
  ]

  const defaultContactsFields = [
    { key: 'phoneNumber', label: 'Phone Number', required: true },
    { key: 'name', label: 'Name', required: true },
    { key: 'biographies', label: 'Biographies', required: false },
    { key: 'nickname', label: 'Nickname', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'locations', label: 'Locations', required: false },
    { key: 'email', label: 'email', required: false },
    { key: 'occupation', label: 'Occupation', required: false },
    { key: 'organization', label: 'Organization', required: false },
  ]

  const [googleContactsConf, setGoogleContactsConf] = useState({
    name: 'Google Contacts',
    type: 'Google Contacts',
    mainAction: '',
    clientId: process.env.NODE_ENV === 'development' ? '266670391931-688o26jcfb8iqqos8fvlusqifmjtv2on.apps.googleusercontent.com' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '1M7oVG0Y_4kjvnNnxe2b0Xyi' : '',
    field_map: [{ formField: '', googleContactsFormField: '' }],
    default: defaultContactsFields,
    allActions,
    actions: {},
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('googleContacts')
  }, [])

  const saveConfig = () => {
    saveActionConf({ flow, setFlow, allIntegURL, conf: googleContactsConf, navigate, setIsLoading, setSnackbar })
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <GoogleContactsAuthorization
        flowID={flowID}
        googleContactsConf={googleContactsConf}
        setGoogleContactsConf={setGoogleContactsConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}
      >
        <GoogleContactsIntegLayout
          flowID={flowID}
          formFields={formFields}
          googleContactsConf={googleContactsConf}
          setGoogleContactsConf={setGoogleContactsConf}
        />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
        isLoading={isLoading}
        dataConf={googleContactsConf}
        setDataConf={setGoogleContactsConf}
        formFields={formFields}
      />

      <div
        className="btcd-stp-page"
        style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}
      >
        <button
          onClick={() => setStep(3)}
          disabled={!checkMappedFields(googleContactsConf?.field_map) || googleContactsConf.mainAction === '' || isLoading}
          className="btn ml-auto btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>
    </div>
  )
}

export default GoogleContacts
