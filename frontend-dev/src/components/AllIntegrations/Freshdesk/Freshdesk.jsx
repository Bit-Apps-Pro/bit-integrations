/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, checkMappedFieldsContact, handleInput } from './FreshdeskCommonFunc'
import BackIcn from '../../../Icons/BackIcn'
import FreshdeskAuthorization from './FreshdeskAuthorization'
import FreshdeskIntegLayout from './FreshdeskIntegLayout'

function Freshdesk({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const ticketFields = [
    { key: 'email', label: 'email ', required: true },
    { key: 'subject', label: 'subject', required: true },
    { key: 'description', label: 'description', required: true },
    { key: 'name', label: 'name', required: false },
    { key: 'phone', label: 'phone ', required: false },
  ]

  const contactFields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'email', label: 'Email ', required: true },
    { key: 'phone', label: 'Phone ', required: false },
    { key: 'address', label: 'Address', required: false },
    { key: 'description', label: 'Description', required: false },
    { key: 'job_title', label: 'Job_title', required: false },
  ]

  const [freshdeskConf, setFreshdeskConf] = useState({
    name: 'Freshdesk',
    type: 'Freshdesk',
    app_domain: '',
    api_key: process.env.NODE_ENV === 'development' ? 'RfPqlzHcProz1o9kjGj' : '',
    field_map: [{ formField: '', freshdeskFormField: '' }],
    field_map_contact: [{ formField: '', contactFreshdeskFormField: '' }],
    freshdesk_id: '',
    ticketFields,
    contactFields,
    contactShow: '',
    status: '',
    priority: '',
    updateContact: '',
    actions: {},
  })
  // checkMappedFields(freshdeskConf?.field_map_contact)
  const nextPage = (val) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (val === 3) {
      if (freshdeskConf.name !== '') {
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
      <FreshdeskAuthorization
        formID={formID}
        freshdeskConf={freshdeskConf}
        setFreshdeskConf={setFreshdeskConf}
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
        <FreshdeskIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, freshdeskConf, setFreshdeskConf, setIsLoading, setSnackbar)}
          freshdeskConf={freshdeskConf}
          setFreshdeskConf={setFreshdeskConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        {checkMappedFields(freshdeskConf?.field_map_contact)}
        <button
          onClick={() => nextPage(3)}
          // disabled={!freshdeskConf.priority || !freshdeskConf.status || !checkMappedFields(freshdeskConf?.field_map)}
          disabled={!freshdeskConf.priority || !freshdeskConf.status || !checkMappedFields(freshdeskConf?.field_map) || (freshdeskConf.contactShow && !checkMappedFieldsContact(freshdeskConf?.field_map_contact))}
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
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: freshdeskConf, navigate, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={freshdeskConf}
        setDataConf={setFreshdeskConf}
        formFields={formFields}
      />
    </div>
  )
}

export default Freshdesk
