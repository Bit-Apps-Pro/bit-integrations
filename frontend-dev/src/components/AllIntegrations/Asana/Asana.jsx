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
import AsanaAuthorization from './AsanaAuthorization'
import { checkMappedFields, handleInput } from './AsanaCommonFunc'
import AsanaIntegLayout from './AsanaIntegLayout'

function Asana({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const taskFields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'due_at', label: 'Due At', required: false },
    { key: 'due_on', label: 'Due On', required: false },
    { key: 'notes', label: 'Notes', required: false },
  ]

  const [asanaConf, setAsanaConf] = useState({
    name: 'Asana',
    type: 'Asana',
    api_key: process.env.NODE_ENV === 'development' ? '1/1204059769132541:4f2eba544ecafbc29df397dec56c457c' : '',
    field_map: [
      { formField: '', asanaFormField: '' },
    ],
    actionName: '',
    taskFields,
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, asanaConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(asanaConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (asanaConf.actionName === 'task') {
      if (!asanaConf.selectedProject) {
        toast.error('Please select a project')
        return
      }
      if (!asanaConf.selectedSections && asanaConf.actionName === 'task') {
        toast.error('Please select a Section')
        return
      }
    }

    asanaConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <AsanaAuthorization
        asanaConf={asanaConf}
        setAsanaConf={setAsanaConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <AsanaIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, asanaConf, setAsanaConf, setLoading, setSnackbar)}
          asanaConf={asanaConf}
          setAsanaConf={setAsanaConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />

        {asanaConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(asanaConf))}
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
      {asanaConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={asanaConf}
          setDataConf={setAsanaConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default Asana
