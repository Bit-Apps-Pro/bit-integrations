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
import MailRelayAuthorization from './MailRelayAuthorization'
import { checkMappedFields, handleInput } from './MailRelayCommonFunc'
import MailRelayIntegLayout from './MailRelayIntegLayout'

function MailRelay({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({
    auth: false,
    groups: false,
    customFields: false,
  })

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const staticFields = [
    { key: 'email', label: 'Email', required: true },
    { key: 'name', label: 'Name', required: false },
    { key: 'address', label: 'Address', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'birthday', label: 'Birthday', required: false },
    { key: 'website', label: 'Website', required: false },
    { key: 'locale', label: 'Locale', required: false },
    { key: 'time_zone', label: 'Time Zone', required: false },
  ]

  const [mailRelayConf, setMailRelayConf] = useState({
    name: 'MailRelay',
    type: 'MailRelay',
    auth_token: process.env.NODE_ENV === 'development' ? 'hQyMgwXg9iqNdS_1F6hHfKZhrPsxnTnyfxhGYkBy' : '',
    domain: process.env.NODE_ENV === 'development' ? 'bitcode' : '',
    field_map: [
      { formField: '', mailRelayFormField: '' },
    ],
    staticFields,
    status: '',
    customFields: [],
    groups: [],
    selectedGroups: [],
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, mailRelayConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(mailRelayConf)) {
      toast.error('Please map mandatory fields')
      return
    }
    mailRelayConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <MailRelayAuthorization
        mailRelayConf={mailRelayConf}
        setMailRelayConf={setMailRelayConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <MailRelayIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, mailRelayConf, setMailRelayConf, setLoading, setSnackbar)}
          mailRelayConf={mailRelayConf}
          setMailRelayConf={setMailRelayConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />

        {mailRelayConf?.status && (
          <button
            onClick={() => nextPage(3)}
            disabled={!mailRelayConf?.status}
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
      {mailRelayConf?.status && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={mailRelayConf}
          setDataConf={setMailRelayConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default MailRelay
