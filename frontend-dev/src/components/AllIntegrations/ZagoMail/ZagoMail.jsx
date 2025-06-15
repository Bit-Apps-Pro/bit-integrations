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
import ZagoMailAuthorization from './ZagoMailAuthorization'
import { checkMappedFields } from './ZagoMailCommonFunc'
import ZagoMailIntegLayout from './ZagoMailIntegLayout'

function ZagoMail({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [zagoMailConf, setZagoMailConf] = useState({
    name: 'ZagoMail',
    type: 'ZagoMail',
    api_public_key: process.env.NODE_ENV === 'development' ? 'f6a347f07b4e7b4c434504a69b1a9f98b896cefd' : '',
    field_map: [
      { formField: '', zagoMailField: '' },
    ],
    // lists: [],
    selectedList: '',
    actions: {},
    // tags: [],
    selectedTags: [],
  })

  const nextPage = (val) => {
    // setIsLoading(true)
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (!checkMappedFields(zagoMailConf)) {
        setSnackbar({ show: true, msg: 'Please map all required fields to continue.' })
        return
      }
      if (!zagoMailConf?.listId) {
        setSnackbar({ show: true, msg: 'Please select list to continue.' })
        return
      }
      if (zagoMailConf.name !== '' && zagoMailConf.field_map.length > 0) {
        setstep(3)
      }
    }
  }
  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <ZagoMailAuthorization
        formID={formID}
        zagoMailConf={zagoMailConf}
        setZagoMailConf={setZagoMailConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />
      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>

        <ZagoMailIntegLayout
          formID={formID}
          formFields={formFields}
          zagoMailConf={zagoMailConf}
          setZagoMailConf={setZagoMailConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!zagoMailConf?.listId || zagoMailConf.field_map.length < 1}
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
        saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, zagoMailConf, navigate, '', '', setIsLoading)}
        isLoading={isLoading}
        dataConf={zagoMailConf}
        setDataConf={setZagoMailConf}
        formFields={formFields}
      />
    </div>
  )
}

export default ZagoMail
