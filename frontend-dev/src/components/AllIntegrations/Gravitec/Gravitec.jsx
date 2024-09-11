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
import GravitecAuthorization from './GravitecAuthorization'
import { checkMappedFields, generateMappedField } from './GravitecCommonFunc'
import GravitecIntegLayout from './GravitecIntegLayout'

function Gravitec({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const notificationFields = [
    { key: 'send_date', label: __('Send Date', 'bit-integrations'), required: false },
    { key: 'ttl', label: __('Time to Live', 'bit-integrations'), required: false },
    { key: 'push_tag', label: __('Push Tag', 'bit-integrations'), required: false },
    { key: 'display_time', label: __('Display Time', 'bit-integrations'), required: false },
    { key: 'is_transactional', label: __('Is Transactional', 'bit-integrations'), required: false },
    { key: 'segments', label: __('Segments', 'bit-integrations'), required: false },
    { key: 'message', label: __('Message', 'bit-integrations'), required: true },
    { key: 'title', label: __('Title', 'bit-integrations'), required: false },
    { key: 'icon', label: __('Icon', 'bit-integrations'), required: true },
    { key: 'image', label: __('Image', 'bit-integrations'), required: false },
    { key: 'redirect_url', label: __('Redirect URL', 'bit-integrations'), required: true }
  ]

  const [gravitecConf, setGravitecConf] = useState({
    name: 'Gravitec',
    type: 'Gravitec',
    app_key: process.env.NODE_ENV === 'development' ? '9db98604d370a87a92b6250de50e11e2' : '',
    app_secret: process.env.NODE_ENV === 'development' ? '966cab74622780699086601dc0b9478f' : '',
    site_url: process.env.NODE_ENV === 'development' ? 'https://bit-integrations.org/' : '',
    field_map: generateMappedField(notificationFields),
    actionName: '',
    notificationFields,
    actions: {}
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(
      flow,
      setFlow,
      allIntegURL,
      gravitecConf,
      navigate,
      '',
      '',
      setIsLoading
    )
    resp.then((res) => {
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

    if (!checkMappedFields(gravitecConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    gravitecConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <GravitecAuthorization
        gravitecConf={gravitecConf}
        setGravitecConf={setGravitecConf}
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
        <GravitecIntegLayout
          formFields={formFields}
          gravitecConf={gravitecConf}
          setGravitecConf={setGravitecConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {gravitecConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!checkMappedFields(gravitecConf)}
            className="btn f-right btcd-btn-lg purple sh-sm flx"
            type="button">
            {__('Next', 'bit-integrations')} &nbsp;
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        )}
      </div>

      {/* STEP 3 */}
      {gravitecConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={gravitecConf}
          setDataConf={setGravitecConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default Gravitec
