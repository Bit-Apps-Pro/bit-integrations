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
import SystemeIOAuthorization from './SystemeIOAuthorization'
import { checkMappedFields, generateMappedField } from './SystemeIOCommonFunc'
import SystemeIOIntegLayout from './SystemeIOIntegLayout'

function SystemeIO({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const systemeIOFields = [
    { label: 'Email Address', key: 'email', required: true },
  ]

  const [systemeIOConf, setSystemeIOConf] = useState({
    name: 'SystemeIO',
    type: 'SystemeIO',
    api_key: process.env.NODE_ENV === 'development' ? '649rpkoa4945nrj36ilr4jswz2f1k6mzc50f22y527jvnlihb73s3td555h3u28i' : '',
    field_map: generateMappedField(systemeIOFields),
    actionName: 'registerPeopletoWabinar',
    systemeIOFields,
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, systemeIOConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(systemeIOConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (!systemeIOConf.selectedTag) {
      toast.error('Please select a Tag')
      return
    }

    systemeIOConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <SystemeIOAuthorization
        systemeIOConf={systemeIOConf}
        setSystemeIOConf={setSystemeIOConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <SystemeIOIntegLayout
          formFields={formFields}
          systemeIOConf={systemeIOConf}
          setSystemeIOConf={setSystemeIOConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {systemeIOConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(systemeIOConf))}
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
      {systemeIOConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={systemeIOConf}
          setDataConf={setSystemeIOConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default SystemeIO
