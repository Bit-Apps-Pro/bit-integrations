// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import DirectIqAuthorization from './DirectIqAuthorization'
import { checkMappedFields } from './DirectIqCommonFunc'
import DirectIqIntegLayout from './DirectIqIntegLayout'

function DirectIq({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [directIqConf, setDirectIqConf] = useState({
    name: 'DirectIq',
    type: 'DirectIq',
    client_id: process.env.NODE_ENV === 'development' ? 'c75b61369cf340a08225622b110db619' : '',
    client_secret: process.env.NODE_ENV === 'development' ? 'd524fac91a354e0c9bcb872448bbcb7433490478228b40eba298ec89f98c46dd' : '',
    field_map: [
      { formField: '', directIqField: '' },
    ],
    actions: {},
  })

  const nextPage = (val) => {
    // setIsLoading(true)
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (!checkMappedFields(directIqConf)) {
        setSnackbar({ show: true, msg: 'Please map all required fields to continue.' })
        return
      }
      if (!directIqConf?.listId) {
        setSnackbar({ show: true, msg: 'Please select list to continue.' })
        return
      }
      if (directIqConf.name !== '' && directIqConf.field_map.length > 0) {
        setstep(3)
      }
    }
  }
  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <DirectIqAuthorization
        formID={formID}
        directIqConf={directIqConf}
        setDirectIqConf={setDirectIqConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />
      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>

        <DirectIqIntegLayout
          formID={formID}
          formFields={formFields}
          directIqConf={directIqConf}
          setDirectIqConf={setDirectIqConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!directIqConf?.listId || directIqConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          &nbsp;
          <BackIcn className="ml-1 rev-icn" />
        </button>

      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, directIqConf, navigate, '', '', setIsLoading)}
        isLoading={isLoading}
        dataConf={directIqConf}
        setDataConf={setDirectIqConf}
        formFields={formFields}
      />
    </div>
  )
}

export default DirectIq
