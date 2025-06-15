/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import MailBlusterAuthorization from './MailBlusterAuthorization'
import { checkMappedFields, handleInput } from './MailBlusterCommonFunc'
import MailBlusterIntegLayout from './MailBlusterIntegLayout'

function MailBluster({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({
    auth: false,
    customFields: false,
  })

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const staticFields = [
    { key: 'email', label: 'Email', required: true },
    { key: 'firstName', label: 'First Name', required: false },
    { key: 'lastName', label: 'Last Name', required: false },
    { key: 'timezone', label: 'Timezone', required: false },
    { key: 'ipAddress', label: 'Ip Address', required: false },
  ]

  const [mailBlusterConf, setMailBlusterConf] = useState({
    name: 'MailBluster',
    type: 'MailBluster',
    auth_token: process.env.NODE_ENV === 'development' ? '394bebe6-e8dc-4070-a028-d3fd36eacf9e' : '',
    field_map: [
      { formField: '', mailBlusterFormField: '' },
    ],
    staticFields,
    subscribed: '',
    customFields: [],
    selectedTags: [],
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, mailBlusterConf, navigate, '', '', setIsLoading)
    resp.then(res => {
      if (res.success) {
        toast.success(res.data?.msg)
        navigate(allIntegURL)
      } else {
        toast.error(res.data || res)
      }
    })
  }

  const nextPage = (pageNo) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!checkMappedFields(mailBlusterConf)) {
      toast.error('Please map mandatory fields')
      return
    }
    mailBlusterConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <MailBlusterAuthorization
        mailBlusterConf={mailBlusterConf}
        setMailBlusterConf={setMailBlusterConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <MailBlusterIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, mailBlusterConf, setMailBlusterConf, setLoading, setSnackbar)}
          mailBlusterConf={mailBlusterConf}
          setMailBlusterConf={setMailBlusterConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />

        {mailBlusterConf?.subscribed && (
          <button
            onClick={() => nextPage(3)}
            disabled={!mailBlusterConf?.subscribed}
            className="btn f-right btcd-btn-lg green sh-sm flx"
            type="button"
          >
            {__('Next', 'bit-integrations')}
            {' '}
            &nbsp;
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        )}
      </div>

      {/* STEP 3 */}
      {mailBlusterConf?.subscribed && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={mailBlusterConf}
          setDataConf={setMailBlusterConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default MailBluster
