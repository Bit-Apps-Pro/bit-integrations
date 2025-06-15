import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './GiveWpCommonFunc'
import GiveWpIntegLayout from './GiveWpIntegLayout'
import GiveWpAuthorization from './GiveWpAuthorization'

function GiveWp({ formFields, setFlow, flow, allIntegURL, isInfo, edit }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const allActions = [
    { key: '1', label: 'Create a donar' },
  ]

  // for action 1
  const giveWpFields = [
    { key: 'email', label: 'Email', required: true },
    { key: 'name', label: 'Name', required: false },
    { key: 'first_name', label: 'First Name', required: false },
    { key: 'last_name', label: 'Last Name', required: false },
    // { key: 'company_name', label: 'Company Name', required: false },
    { key: 'purchase_value', label: 'Purchase Value', required: false },
    { key: 'purchase_count', label: 'Purchase Count', required: false },
  ]

  const [giveWpConf, setGiveWpConf] = useState({
    name: 'GiveWp',
    type: 'GiveWp',
    mainAction: '',
    field_map: [
      { formField: '', giveWpFormField: '' },
    ],
    allActions,
    giveWpFields,
    actions: {},
  })
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!checkMappedFields(giveWpConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    if (giveWpConf.mainAction !== '') {
      setStep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <GiveWpAuthorization
        formID={formID}
        giveWpConf={giveWpConf}
        setGiveWpConf={setGiveWpConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <GiveWpIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, giveWpConf, setGiveWpConf, setIsLoading, setSnackbar, formID)}
          giveWpConf={giveWpConf}
          setGiveWpConf={setGiveWpConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          allIntegURL={allIntegURL}
          isInfo={isInfo}
          edit={edit}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={!giveWpConf.mainAction || isLoading}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>

      </div>
      {/* STEP 3 */}

      <IntegrationStepThree
        step={step}
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: giveWpConf, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={giveWpConf}
        setDataConf={setGiveWpConf}
        formFields={formFields}
      />

    </div>
  )
}

export default GiveWp
