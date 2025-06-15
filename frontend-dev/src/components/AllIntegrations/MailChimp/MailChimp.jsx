import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import MailChimpAuthorization from './MailChimpAuthorization'
import { checkAddressFieldMapRequired, handleInput, setGrantTokenResponse, checkMappedFields } from './MailChimpCommonFunc'
import MailChimpIntegLayout from './MailChimpIntegLayout'

function MailChimp({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [sheetConf, setSheetConf] = useState({
    name: 'Mail Chimp',
    type: 'Mail Chimp',
    clientId: process.env.NODE_ENV === 'development' ? '125452420804' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '471dd71ee208e3cdc60e4bb91b4c29bb791832ab49946d396c' : '',
    listId: '',
    listName: '',
    tags: '',
    field_map: [
      { formField: '', mailChimpField: '' },
    ],
    address_field: [],
    actions: {},
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('mailChimp')
  }, [])
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (sheetConf.actions?.address && !checkAddressFieldMapRequired(sheetConf)) {
      setSnackbar({ show: true, msg: 'Please map address required fields to continue.' })
      return
    }
    if (!checkMappedFields(sheetConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (sheetConf.listId !== '') {
      setstep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <MailChimpAuthorization
        formID={formID}
        sheetConf={sheetConf}
        setSheetConf={setSheetConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>

        <MailChimpIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, sheetConf, setSheetConf, formID, setIsLoading, setSnackbar)}
          sheetConf={sheetConf}
          setSheetConf={setSheetConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!sheetConf.listId || sheetConf.field_map.length < 1}
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
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: sheetConf, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={sheetConf}
        setDataConf={setSheetConf}
        formFields={formFields}
      />
    </div>
  )
}

export default MailChimp
