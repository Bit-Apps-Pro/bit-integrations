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
import BentoAuthorization from './BentoAuthorization'
import { checkMappedFields, generateMappedField } from './BentoCommonFunc'
import BentoIntegLayout from './BentoIntegLayout'

function Bento({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  // const bentoFields = [
  //   { label: __('First Name', 'bit-integrations'), key: 'name', required: true },
  //   { label: __('Email Address', 'bit-integrations'), key: 'email', required: true },
  //   { label: __('Last Name', 'bit-integrations'), key: 'last_name', required: false },
  //   { label: __('Phone Number', 'bit-integrations'), key: 'phone_number', required: false },
  //   { label: __('Company', 'bit-integrations'), key: 'company', required: false },
  //   { label: __('Website', 'bit-integrations'), key: 'website', required: false },
  //   { label: __('GDPR', 'bit-integrations'), key: 'gdpr', required: false },
  //   {
  //     label: __('Event Registration page URL', 'bit-integrations'),
  //     key: 'ref_url',
  //     required: false
  //   }
  // ]

  const [bentoConf, setBentoConf] = useState({
    name: 'Bento',
    type: 'Bento',
    publishable_key: process.env.NODE_ENV === 'development' ? 'p5a8bbc915c21ef10e61a360a91dbbcc6' : '',
    secret_key: process.env.NODE_ENV === 'development' ? 's157573fef647a67ee7855ee28d7356f0' : '',
    site_uuid: process.env.NODE_ENV === 'development' ? '2575b8ccda54062d1f022611916bb0a4' : '',
    field_map: [{ formField: '', bentoFormField: '' }],
    actionName: '',
    actions: {}
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, bentoConf, navigate, '', '', setIsLoading)
    resp.then(res => {
      if (res.success) {
        toast.success(res.data?.msg)
        navigate(allIntegURL)
      } else {
        toast.error(res.data || res)
      }
    })
  }

  const nextPage = pageNo => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!checkMappedFields(bentoConf)) {
      toast.error(__('Please map mandatory fields', 'bit-integrations'))
      return
    }

    if (!bentoConf.selectedEvent) {
      toast.error(__('Please select a Event', 'bit-integrations'))
      return
    }

    bentoConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <BentoAuthorization
        bentoConf={bentoConf}
        setBentoConf={setBentoConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>
        <BentoIntegLayout
          formFields={formFields}
          bentoConf={bentoConf}
          setBentoConf={setBentoConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {bentoConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!checkMappedFields(bentoConf)}
            className="btn f-right btcd-btn-lg purple sh-sm flx"
            type="button">
            {__('Next', 'bit-integrations')} &nbsp;
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        )}
      </div>

      {/* STEP 3 */}
      {bentoConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={bentoConf}
          setDataConf={setBentoConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default Bento
