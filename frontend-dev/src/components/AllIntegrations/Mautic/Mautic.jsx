/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import MauticAuthorization from './MauticAuthorization'
import { setGrantTokenResponse, checkMappedFields, handleInput } from './MauticCommonFunc'
import MauticIntegLayout from './MauticIntegLayout'

function Mautic({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [mauticConf, setMauticConf] = useState({
    name: 'Mautic',
    type: 'Mautic',
    clientId: process.env.NODE_ENV === 'development' ? '1_30g9s9iz2ugw40og8gwcoow0sskksgwgkw4kk8gw0os0w44kk0' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '61ie9cvvhcw0oo4osgc0sssg4s04osws8kgggsoskss4k4w8c4' : '',
    baseUrl: process.env.NODE_ENV === 'development' ? 'https://mautic.dev.bitcode.pro' : '',
    field_map: [
      { formField: '', mauticField: '' },
    ],
    actions: {},
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('mautic')
  }, [])
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (!checkMappedFields(mauticConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (mauticConf.listId !== '') {
      setstep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <MauticAuthorization
        mauticConf={mauticConf}
        setMauticConf={setMauticConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>

        <MauticIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, mauticConf, setMauticConf, setIsLoading, setSnackbar)}
          mauticConf={mauticConf}
          setMauticConf={setMauticConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={mauticConf.field_map.length < 1}
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
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: mauticConf, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={mauticConf}
        setDataConf={setMauticConf}
        formFields={formFields}
      />
    </div>
  )
}

export default Mautic
