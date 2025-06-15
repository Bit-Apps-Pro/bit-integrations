/* eslint-disable no-console */
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
import ZendeskAuthorization from './ZendeskAuthorization'
import { checkMappedFields, handleInput } from './ZendeskCommonFunc'
import ZendeskIntegLayout from './ZendeskIntegLayout'

function Zendesk({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const organizationFields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'mobile', label: 'Mobile', required: false },
    { key: 'email', label: 'Email', required: false },
    { key: 'description', label: 'Description', required: false },
    { key: 'line1', label: 'Street', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'postal_code', label: 'Postal Code', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'fax', label: 'Fax', required: false },
    { key: 'facebook', label: 'Facebook', required: false },
    { key: 'skype', label: 'Skype', required: false },
    { key: 'linkedin', label: 'LinkedIn', required: false },
    { key: 'twitter', label: 'Twitter', required: false },
  ]

  const contactFields = [
    { key: 'first_name', label: 'First Name', required: false },
    { key: 'last_name', label: 'Last Name', required: true },
    { key: 'title', label: 'Title', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'mobile', label: 'Mobile', required: false },
    { key: 'email', label: 'Email', required: false },
    { key: 'description', label: 'Description', required: false },
    { key: 'line1', label: 'Street', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'postal_code', label: 'Postal Code', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'fax', label: 'Fax', required: false },
    { key: 'facebook', label: 'Facebook', required: false },
    { key: 'skype', label: 'Skype', required: false },
    { key: 'linkedin', label: 'LinkedIn', required: false },
    { key: 'twitter', label: 'Twitter', required: false },
  ]

  const leadFields = [
    { key: 'first_name', label: 'First Name', required: false },
    { key: 'last_name', label: 'Last Name', required: true },
    { key: 'title', label: 'Title', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'mobile', label: 'Mobile', required: false },
    { key: 'fax', label: 'Fax', required: false },
    { key: 'website', label: 'Website', required: false },
    { key: 'email', label: 'Email', required: false },
    { key: 'description', label: 'Description', required: false },
    { key: 'line1', label: 'Street', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'postal_code', label: 'Postal Code', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'facebook', label: 'Facebook', required: false },
    { key: 'skype', label: 'Skype', required: false },
    { key: 'linkedin', label: 'LinkedIn', required: false },
    { key: 'twitter', label: 'Twitter', required: false },
  ]

  const dealFields = [
    { key: 'name', label: 'Deal Name', required: true },
    { key: 'value', label: 'Value', required: false },
    { key: 'estimated_close_date', label: 'Estimated Close Date', required: false },
    { key: 'added_at', label: 'Added On', required: false },
    { key: 'last_stage_change_at', label: 'Last Moved Stage On', required: false },
  ]

  const [zendeskConf, setZendeskConf] = useState({
    name: 'Zendesk',
    type: 'Zendesk',
    api_key: process.env.NODE_ENV === 'development' ? '8259c4ba5798d7005e5d2f2a3ea8e57de2013439ed4a0720f0cfcaf4bc4095a5' : '',
    field_map: [
      { formField: '', zendeskFormField: '' },
    ],
    actionName: '',
    organizationFields,
    contactFields,
    leadFields,
    dealFields,
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, zendeskConf, navigate, '', '', setIsLoading)
    resp.then(res => {
      if (res.success) {
        toast.success(res.data?.msg)
        navigate(allIntegURL)
      } else {
        toast.error(res.data || res)
      }
    })
  }

  const nextPage = (pageNo) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!checkMappedFields(zendeskConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (zendeskConf.actionName === 'lead' || zendeskConf.actionName === 'deal') {
      if (!zendeskConf.selectedCRMCompany) {
        toast.error('Please select a company')
        return
      }
      if (!zendeskConf.selectedCRMContact) {
        toast.error('Please select a contact')
        return
      }
      if (!zendeskConf.selectedCRMSources && zendeskConf.actionName === 'lead') {
        toast.error('Please select a Source')
        return
      }
    }

    zendeskConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <ZendeskAuthorization
        zendeskConf={zendeskConf}
        setZendeskConf={setZendeskConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <ZendeskIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, zendeskConf, setZendeskConf, setLoading, setSnackbar)}
          zendeskConf={zendeskConf}
          setZendeskConf={setZendeskConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />

        {zendeskConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(zendeskConf))}
            className="btn f-right btcd-btn-lg green sh-sm flx"
            type="button"
          >
            {__('Next', 'bit-integrations')}
            {' '}
            &nbsp;
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        )}
      </div>

      {/* STEP 3 */}
      {zendeskConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={zendeskConf}
          setDataConf={setZendeskConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default Zendesk
