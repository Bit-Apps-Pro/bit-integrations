/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ElasticEmailAuthorization from './ElasticEmailAuthorization'
import { checkMappedFields, handleInput } from './ElasticEmailCommonFunc'
import ElasticEmailIntegLayout from './ElasticEmailIntegLayout'

function ElasticEmail({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  // const [snack, setSnackbar] = useState({ show: false })
  const fields = [
    { key: 'Email', label: 'Email', required: true },
    { key: 'FirstName', label: 'FirstName', required: false },
    { key: 'LastName', label: 'LastName', required: false },
  ]
  const [elasticEmailConf, setElasticEmailConf] = useState({
    name: 'Elastic Email',
    type: 'ElasticEmail',
    api_key: process.env.NODE_ENV === 'development' ? 'FDDC2A0367E286CDC2A0A01000D46F040E2E602F3454F9DFB8576CE8F83BEAD391E270A8C6CB6A648A349EC72FCA11F2' : '',
    field_map: [
      { formField: '', elasticEmailField: '' },
    ],
    actions: {},
    elasticEmailFields: fields,
  })

  const saveConfig = () => {
    setIsLoading(true)
    saveActionConf({ flow, setFlow, allIntegURL, conf: elasticEmailConf, navigate, setIsLoading, setSnackbar })
  }
  const nextPage = (pageNo) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!checkMappedFields(elasticEmailConf)) {
      // setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      toast.error('Please map mandatory fields')
      return
    }
    elasticEmailConf.field_map.length > 0 && setstep(pageNo)
  }

  return (
    <div>
      {/* <SnackMsg snack={snack} setSnackbar={setSnackbar} /> */}
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}

      <ElasticEmailAuthorization
        elasticEmailConf={elasticEmailConf}
        setElasticEmailConf={setElasticEmailConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <ElasticEmailIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, elasticEmailConf, setElasticEmailConf, setIsLoading)}
          elasticEmailConf={elasticEmailConf}
          setElasticEmailConf={setElasticEmailConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <button
          onClick={() => nextPage(3)}
          // disabled={!getgistConf?.recipient_id}
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
        dataConf={elasticEmailConf}
        setDataConf={setElasticEmailConf}
        formFields={formFields}
      />
    </div>
  )
}

export default ElasticEmail
