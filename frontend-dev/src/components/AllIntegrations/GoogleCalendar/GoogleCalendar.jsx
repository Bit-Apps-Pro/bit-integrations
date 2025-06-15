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
import GoogleCalendarAuthorization from './GoogleCalendarAuthorization'
import { checkMappedFields } from './GoogleCalendarCommonFunc'
import GoogleCalendarIntegLayout from './GoogleCalendarIntegLayout'

function GoogleCalendar({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { flowID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const defaultCalendarFields = [
    { key: 'start', label: 'Start Date Time', required: true },
    { key: 'end', label: 'End Date Time', required: true },
    { key: 'summary', label: 'Title', required: false },
    { key: 'location', label: 'Location', required: false },
    { key: 'description', label: 'Description', required: false },
  ]

  const [googleCalendarConf, setGoogleCalendarConf] = useState({
    name: 'Google Calendar',
    type: 'Google Calendar',
    clientId: process.env.NODE_ENV === 'development' ? '169745940494-ambvaatv48bcnoebo0cqqg6u4427mbcf.apps.googleusercontent.com' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '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' : '',
    field_map: [{ formField: '', googleCalendarFormField: '' }],
    reminder_field_map: [{ method: 'popup', minutes: '30' }],
    default: defaultCalendarFields,
    calendarLists: [],
    actions: {},
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('googleCalendar')
  }, [])

  const saveConfig = () => {
    saveActionConf({ flow, setFlow, allIntegURL, conf: googleCalendarConf, navigate, setIsLoading, setSnackbar })
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <GoogleCalendarAuthorization
        flowID={flowID}
        googleCalendarConf={googleCalendarConf}
        setGoogleCalendarConf={setGoogleCalendarConf}
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
        <GoogleCalendarIntegLayout
          flowID={flowID}
          formFields={formFields}
          googleCalendarConf={googleCalendarConf}
          setGoogleCalendarConf={setGoogleCalendarConf}
        />
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
        isLoading={isLoading}
        dataConf={googleCalendarConf}
        setDataConf={setGoogleCalendarConf}
        formFields={formFields}
      />

      <div
        className="btcd-stp-page"
        style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}
      >
        <button
          onClick={() => setStep(3)}
          disabled={
            !googleCalendarConf?.calendarId
            || !googleCalendarConf?.timeZone
            || !checkMappedFields(googleCalendarConf?.field_map)
          }
          className="btn ml-auto btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>
    </div>
  )
}

export default GoogleCalendar
