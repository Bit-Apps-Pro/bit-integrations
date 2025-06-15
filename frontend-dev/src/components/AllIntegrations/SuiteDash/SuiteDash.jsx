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
import SuiteDashAuthorization from './SuiteDashAuthorization'
import { checkMappedFields } from './SuiteDashCommonFunc'
import SuiteDashIntegLayout from './SuiteDashIntegLayout'

function SuiteDash({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [suiteDashConf, setSuiteDashConf] = useState({
    name: 'SuiteDash',
    type: 'SuiteDash',
    public_id: process.env.NODE_ENV === 'development' ? '994665df-dd08-4e9d-9d40-fa510ef31ac8' : '',
    secret_key: process.env.NODE_ENV === 'development' ? '$2y$13$WZy9preZCG5DO3Vhj3..N.hiyHnRn2QHkEkQClwrYYeYzsYPx0JPG' : '',
    field_map: [
      { formField: '', suiteDashFormField: '' },
    ],
    actionName: '',
    suiteDashFields: [],
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, suiteDashConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(suiteDashConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (!suiteDashConf.selectedRole) {
      toast.error('Please select a Role')
      return
    }

    suiteDashConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <SuiteDashAuthorization
        suiteDashConf={suiteDashConf}
        setSuiteDashConf={setSuiteDashConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <SuiteDashIntegLayout
          formFields={formFields}
          suiteDashConf={suiteDashConf}
          setSuiteDashConf={setSuiteDashConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {suiteDashConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(suiteDashConf))}
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
      {suiteDashConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={suiteDashConf}
          setDataConf={setSuiteDashConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default SuiteDash
