import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SendFoxAuthorization from './SendFoxAuthorization'
import {
  handleInput,
  checkMappedFields,
  checkMappedListFields,
  checkMappedSubscribeFields,
  isDisabled
} from './SendFoxCommonFunc'
import SendFoxIntegLayout from './SendFoxIntegLayout'

function SendFox({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const allActions = [
    { key: '1', label: __('Create List', 'bit-integrations') },
    { key: '2', label: __('Create Contact', 'bit-integrations') },
    { key: '3', label: __('Unsubscribe Contact', 'bit-integrations') }
  ]

  const contactFields = [
    { key: 'email', label: __('Email', 'bit-integrations'), required: true },
    { key: 'first_name', label: __('First Name', 'bit-integrations'), required: false },
    { key: 'last_name', label: __('Last Name', 'bit-integrations'), required: false }
  ]

  const listFields = [{ key: 'name', label: __('Name', 'bit-integrations'), required: true }]
  const unsubscribeFields = [{ key: 'email', label: __('Email', 'bit-integrations'), required: true }]

  const [sendFoxConf, setSendFoxConf] = useState({
    name: 'SendFox',
    type: 'SendFox',
    listId: '',
    access_token: '',
    field_map: [{ formField: '', sendFoxFormField: '' }],
    field_map_list: [{ formField: '', sendFoxListFormField: '' }],
    field_map_unsubscribe: [{ formField: '', sendFoxUnsubscribeFormField: '' }],
    allActions,
    contactFields,
    unsubscribeFields,
    listFields,
    actions: {}
  })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setstep(3)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <SendFoxAuthorization
        formID={formID}
        sendFoxConf={sendFoxConf}
        setSendFoxConf={setSendFoxConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>
        <SendFoxIntegLayout
          formFields={formFields}
          handleInput={e =>
            handleInput(e, sendFoxConf, setSendFoxConf, setIsLoading, setSnackbar, formID)
          }
          sendFoxConf={sendFoxConf}
          setSendFoxConf={setSendFoxConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          className="btn f-right btcd-btn-lg purple sh-sm flx"
          type="button"
          disabled={isDisabled(sendFoxConf)}>
          {__('Next', 'bit-integrations')} &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>
      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() =>
          saveActionConf({
            flow,
            setFlow,
            allIntegURL,
            navigate,
            conf: sendFoxConf,
            setIsLoading,
            setSnackbar
          })
        }
        isLoading={isLoading}
        dataConf={sendFoxConf}
        setDataConf={setSendFoxConf}
        formFields={formFields}
      />
    </div>
  )
}

export default SendFox
