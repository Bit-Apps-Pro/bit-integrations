/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import LineAuthorization from './LineAuthorization'
import { handleInput } from './LineCommonFunc'
import LineIntegLayout from './LineIntegLayout'
import BackIcn from '../../../Icons/BackIcn'

function Line({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [lineConf, setLineConf] = useState({
    name: 'Line',
    type: 'Line',
    parse_mode: 'HTML',
    field_map: [{ formField: '', lineFormField: '' }],
    channel_id: '',
    body: '',
    actions: {},
  })

  const nextPage = (val) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (lineConf.name !== '' && lineConf.channel_id) {
        setstep(val)
      }
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <LineAuthorization
        formID={formID}
        lineConf={lineConf}
        setLineConf={setLineConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}

      <div
        className="btcd-stp-page"
        style={{
          ...(step === 2 && {
            width: 900,
            height: 'auto',
            overflow: 'visible',
          }),
        }}
      >
        <LineIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, lineConf, setLineConf, setIsLoading, setSnackbar)}
          lineConf={lineConf}
          setLineConf={setLineConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={lineConf.channel_id === ''}
          className="btn f-right btcd-btn-lg purple sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: lineConf, navigate, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={lineConf}
        setDataConf={setLineConf}
        formFields={formFields}
      />
    </div>
  )
}

export default Line
