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
import SendGridAuthorization from './SendGridAuthorization'
import { checkMappedFields } from './SendGridCommonFunc'
import SendGridIntegLayout from './SendGridIntegLayout'

function SendGrid({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({
    auth: false,
    customFields: false,
    lists: false,
  })

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const staticFields = [
    { key: 'email', label: 'Email', required: true },
    { key: 'first_name', label: 'First Name', required: false },
    { key: 'last_name', label: 'Last Name', required: false },
    { key: 'alternate_emails', label: 'Alternate Emails', required: false },
    { key: 'address_line_1', label: 'Address Line 1', required: false },
    { key: 'address_line_2', label: 'Address Line 2', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state_province_region', label: 'State Province Region', required: false },
    { key: 'postal_code', label: 'Postal Code', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'phone_number', label: 'Phone Number', required: false },
    { key: 'whatsapp', label: 'Whatsapp', required: false },
    { key: 'line', label: 'Line', required: false },
    { key: 'facebook', label: 'Facebook', required: false },
    { key: 'unique_name', label: 'Unique Name', required: false },
  ]

  const [sendGridConf, setSendGridConf] = useState({
    name: 'SendGrid',
    type: 'SendGrid',
    apiKey: process.env.NODE_ENV === 'development' ? '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' : '',
    field_map: [
      { formField: '', sendGridFormField: '' },
    ],
    staticFields,
    lists: [],
    customFields: [],
    selectedLists: '',
    groups: [],
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, sendGridConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(sendGridConf)) {
      toast.error('Please map mandatory fields')
      return
    }
    sendGridConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <SendGridAuthorization
        sendGridConf={sendGridConf}
        setSendGridConf={setSendGridConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <SendGridIntegLayout
          formFields={formFields}
          sendGridConf={sendGridConf}
          setSendGridConf={setSendGridConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!checkMappedFields(sendGridConf)}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
        isLoading={isLoading}
        dataConf={sendGridConf}
        setDataConf={setSendGridConf}
        formFields={formFields}
      />
    </div>
  )
}

export default SendGrid
