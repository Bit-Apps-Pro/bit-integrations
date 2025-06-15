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
import AgiledAuthorization from './AgiledAuthorization'
import { checkMappedFields, handleInput } from './AgiledCommonFunc'
import AgiledIntegLayout from './AgiledIntegLayout'

function Agiled({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const accountFields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'description', label: 'Description', required: false },
    { key: 'size', label: 'Size', required: false },
    { key: 'email', label: 'Email', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'website', label: 'Website', required: false },
    { key: 'facebook', label: 'Facebook', required: false },
    { key: 'linkedin', label: 'Linkedin', required: false },
    { key: 'twitter', label: 'Twitter', required: false },
    { key: 'skype', label: 'Skype', required: false },
    { key: 'note', label: 'Note', required: false },
    { key: 'tax_no', label: 'Tax No', required: false },
  ]

  const contactFields = [
    { key: 'first_name', label: 'First Name', required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'last_name', label: 'Last Name', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'job_title', label: 'Job Title', required: false },
    { key: 'facebook', label: 'Facebook', required: false },
    { key: 'linkedin', label: 'Linkedin', required: false },
    { key: 'twitter', label: 'Twitter', required: false },
    { key: 'skype', label: 'Skype', required: false },
    { key: 'note', label: 'Note', required: false },
    { key: 'tax_no', label: 'Tax No', required: false },
    { key: 'last_contacted', label: 'Last Contacted', required: false },
  ]

  const dealFields = [
    { key: 'deal_name', label: 'Deal Name', required: true },
    { key: 'amount', label: 'Amount', required: false },
    { key: 'close_date', label: 'Close Date', required: false },
  ]

  const [agiledConf, setAgiledConf] = useState({
    name: 'Agiled CRM',
    type: 'Agiled CRM',
    auth_token: process.env.NODE_ENV === 'development' ? 'ABaDKRfMUrSUda3yBToLWSHWXwDNFo' : '',
    brand: process.env.NODE_ENV === 'development' ? 'fahim.agiled.app' : '',
    field_map: [
      { formField: '', agiledFormField: '' },
    ],
    actionName: '',
    accountFields,
    contactFields,
    dealFields,
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, agiledConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(agiledConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (agiledConf.actionName === 'deal') {
      if (!agiledConf.selectedCRMPipeline) {
        toast.error('Please select a pipeline')
        return
      }
      if (!agiledConf.selectedCRMPipelineStages) {
        toast.error('Please select a pipeline stage')
        return
      }
    }

    agiledConf.field_map.length > 0 && setStep(pageNo)
  }


  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <AgiledAuthorization
        agiledConf={agiledConf}
        setAgiledConf={setAgiledConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <AgiledIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, agiledConf, setAgiledConf, setLoading, setSnackbar)}
          agiledConf={agiledConf}
          setAgiledConf={setAgiledConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />

        {agiledConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!checkMappedFields(agiledConf)}
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
      {agiledConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={agiledConf}
          setDataConf={setAgiledConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default Agiled
