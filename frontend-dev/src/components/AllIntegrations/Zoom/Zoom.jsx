import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import ZoomAuthorization from './ZoomAuthorization'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput, checkMappedFields } from './ZoomCommonFunc'
import { setGrantTokenResponse } from './ZoomIntegrationHelpers'
import ZoomIntegLayout from './ZoomIntegLayout'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'

function Zoom({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [zoomConf, setZoomConf] = useState({
    name: 'Zoom',
    type: 'Zoom',
    clientId: process.env.NODE_ENV === 'development' ? 'xjnkttIRUONUAlObRmZIQ' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? 'h0GkOp58bi64nPsEkS8ZGLpszBbAtR6n' : '',
    zoomId: '',
    field_map: [
      { formField: '', zoomField: '' },
    ],
    zoomFields: [],
    allActions: [
      { value: 'Create Attendee', key: 1 },
      { value: 'Delete Attendee', key: 2 },
      { value: 'Create User', key: 3 },
      { value: 'Delete User', key: 4 },
    ],
    selectedActions: null,
    actions: {},
  })

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    window.opener && setGrantTokenResponse('zoom')
  }, [])
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (!checkMappedFields(zoomConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (zoomConf.field_map.length > 0) {
      setStep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <ZoomAuthorization
        formID={formID}
        zoomConf={zoomConf}
        setZoomConf={setZoomConf}
        step={step}
        setStep={setStep}
        setSnackbar={setSnackbar}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && `${100}%` }}>

        <ZoomIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, zoomConf, setZoomConf, formID, setIsLoading, setSnackbar)}
          zoomConf={zoomConf}
          setZoomConf={setZoomConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={zoomConf.field_map.length < 2 || isLoading || !zoomConf.id || !checkMappedFields(zoomConf) || zoomConf.selectedActions == null}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
        </button>

      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: zoomConf, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={zoomConf}
        setDataConf={setZoomConf}
        formFields={formFields}
      />

    </div>
  )
}

export default Zoom
