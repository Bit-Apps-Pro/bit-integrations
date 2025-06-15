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
import ClickupAuthorization from './ClickupAuthorization'
import { checkMappedFields, handleInput } from './ClickupCommonFunc'
import ClickupIntegLayout from './ClickupIntegLayout'

function Clickup({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const taskFields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'description', label: 'Description', required: false },
    { key: 'start_date', label: 'Start Date', required: false },
    { key: 'due_date', label: 'Due Date', required: false },
  ]

  const [clickupConf, setClickupConf] = useState({
    name: 'Clickup',
    type: 'Clickup',
    api_key: process.env.NODE_ENV === 'development' ? 'pk_49397980_G19CDMAFLTV8V04UR5PNAYN29QB8UG5H' : '',
    field_map: [
      { formField: '', clickupFormField: '' },
    ],
    actionName: '',
    taskFields,
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, clickupConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(clickupConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (clickupConf.actionName === 'task') {
      if (!clickupConf.selectedTeam) {
        toast.error('Please select a team')
        return
      }
      if (!clickupConf.selectedSpace) {
        toast.error('Please select a space')
        return
      }
      if (!clickupConf.selectedFolder) {
        toast.error('Please select a folder')
        return
      }
      if (!clickupConf.selectedList) {
        toast.error('Please select a list')
        return
      }
    }

    clickupConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <ClickupAuthorization
        clickupConf={clickupConf}
        setClickupConf={setClickupConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <ClickupIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, clickupConf, setClickupConf, setLoading, setSnackbar)}
          clickupConf={clickupConf}
          setClickupConf={setClickupConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />

        {clickupConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(clickupConf))}
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
      {clickupConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={clickupConf}
          setDataConf={setClickupConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default Clickup
