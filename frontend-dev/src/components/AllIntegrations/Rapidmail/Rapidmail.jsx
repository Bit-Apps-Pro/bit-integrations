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
import RapidmailAuthorization from './RapidmailAuthorization'
import { checkMappedFields, handleInput } from './RapidmailCommonFunc'
import RapidmailIntegLayout from './RapidmailIntegLayout'

function Rapidmail({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const recipientsFields = [
    { key: 'email', label: 'Email', required: true },
    { key: 'firstname', label: 'First name', required: false },
    { key: 'lastname', label: 'Last name', required: false },
    { key: 'gender', label: 'Gender', required: false },
    { key: 'title', label: 'Title', required: false },
    { key: 'zip', label: 'Zip', required: false },
    { key: 'birthdate', label: 'Birthdate', required: false },
    { key: 'extra1', label: 'Extra field 1', required: false },
    { key: 'extra2', label: 'Extra field 2', required: false },
    { key: 'extra3', label: 'Extra field 3', required: false },
    { key: 'extra4', label: 'Extra field 4', required: false },
    { key: 'extra5', label: 'Extra field 5', required: false },
    { key: 'extra6', label: 'Extra field 6', required: false },
    { key: 'extra7', label: 'Extra field 7', required: false },
    { key: 'extra8', label: 'Extra field 8', required: false },
    { key: 'extra9', label: 'Extra field 9', required: false },
    { key: 'extra10', label: 'Extra field 10', required: false },
  ]

  const [rapidmailConf, setRapidmailConf] = useState({
    name: 'Rapidmail',
    type: 'Rapidmail',
    username: process.env.NODE_ENV === 'development' ? '3794a7c6ad7cc48871b97c2b68f328e374a089d2' : '',
    password: process.env.NODE_ENV === 'development' ? 'd7db58d60026707dc677fd5b240e9de4b5bd7841' : '',
    field_map: [
      { formField: '', rapidmailFormField: '' },
    ],
    recipientsFields,
    actions: {
      send_activationmail: false
    },
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, rapidmailConf, navigate, '', '', setIsLoading)
    resp.then(res => {
      if (res.success) {
        // setSnackbar({ show: true, msg: res.data?.msg })
        toast.success(res.data?.msg)
        navigate(allIntegURL)
      } else {
        // setSnackbar({ show: true, msg: res.data || res })
        toast.error(res.data || res)
      }
    })
  }
  const nextPage = (pageNo) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!checkMappedFields(rapidmailConf)) {
      // setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      toast.error('Please map mandatory fields')
      return
    }
    rapidmailConf.field_map.length > 0 && setstep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}

      <RapidmailAuthorization
        rapidmailConf={rapidmailConf}
        setRapidmailConf={setRapidmailConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <RapidmailIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, rapidmailConf, setRapidmailConf, setIsLoading, setSnackbar)}
          rapidmailConf={rapidmailConf}
          setRapidmailConf={setRapidmailConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={!rapidmailConf?.recipient_id}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
        isLoading={isLoading}
        dataConf={rapidmailConf}
        setDataConf={setRapidmailConf}
        formFields={formFields}
      />
    </div>
  )
}

export default Rapidmail
