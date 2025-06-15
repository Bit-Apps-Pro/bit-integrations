/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import toast from 'react-hot-toast'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import DemioAuthorization from './DemioAuthorization'
import { checkMappedFields, generateMappedField } from './DemioCommonFunc'
import DemioIntegLayout from './DemioIntegLayout'

function Demio({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const demioFields = [
    { label: 'First Name', key: 'name', required: true },
    { label: 'Email Address', key: 'email', required: true },
    { label: 'Last Name', key: 'last_name', required: false },
    { label: 'Phone Number', key: 'phone_number', required: false },
    { label: 'Company', key: 'company', required: false },
    { label: 'Website', key: 'website', required: false },
    { label: 'GDPR', key: 'gdpr', required: false },
    { label: 'Event Registration page URL', key: 'ref_url', required: false },
  ]

  const [demioConf, setDemioConf] = useState({
    name: 'Demio',
    type: 'Demio',
    api_key: process.env.NODE_ENV === 'development' ? 'XZcHMyLh6zlobOkZU92ZQ83N9qs6bri3' : '',
    api_secret: process.env.NODE_ENV === 'development' ? 'r4VzkWc4K7My7' : '',
    field_map: generateMappedField(demioFields),
    actionName: 'registerPeopletoWabinar',
    demioFields,
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, demioConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(demioConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (!demioConf.selectedEvent) {
      toast.error('Please select a Event')
      return
    }

    demioConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <DemioAuthorization
        demioConf={demioConf}
        setDemioConf={setDemioConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <DemioIntegLayout
          formFields={formFields}
          demioConf={demioConf}
          setDemioConf={setDemioConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {demioConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(demioConf))}
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
      {demioConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={demioConf}
          setDataConf={setDemioConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default Demio
