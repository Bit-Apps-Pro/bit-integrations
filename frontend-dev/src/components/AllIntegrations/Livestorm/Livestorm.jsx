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
import LivestormAuthorization from './LivestormAuthorization'
import { checkMappedFields } from './LivestormCommonFunc'
import LivestormIntegLayout from './LivestormIntegLayout'

function Livestorm({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [livestormConf, setLivestormConf] = useState({
    name: 'Livestorm',
    type: 'Livestorm',
    api_key: process.env.NODE_ENV === 'development' ? 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhcGkubGl2ZXN0b3JtLmNvIiwianRpIjoiZTVkMzUwZTEtZjQyZi00ODM3LWExZjctMDhjZDJkNGQ0MmFjIiwiaWF0IjoxNjg4MzYwMDg4LCJvcmciOiJhOWEwYTdjNy1jNzMzLTRjMzEtOTc0Yi1mODI3NzM4OTVjYTcifQ.rejNMN0nQ3rT-32Yy0WGOIpzoc4T5EE6KiEe4IDXpF8' : '',
    field_map: [{ formField: "", livestormFormField: "" }],
    actionName: 'addPeopletoEventSession',
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, livestormConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(livestormConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (!livestormConf.selectedEvent) {
      toast.error('Please select an Event')
      return
    }
    if (!livestormConf.selectedSession) {
      toast.error('Please select a Session')
      return
    }

    livestormConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <LivestormAuthorization
        livestormConf={livestormConf}
        setLivestormConf={setLivestormConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <LivestormIntegLayout
          formFields={formFields}
          livestormConf={livestormConf}
          setLivestormConf={setLivestormConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {livestormConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(livestormConf))}
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
      {livestormConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={livestormConf}
          setDataConf={setLivestormConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default Livestorm
