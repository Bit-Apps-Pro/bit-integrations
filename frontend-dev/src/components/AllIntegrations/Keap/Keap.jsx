import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { setGrantTokenResponse } from './KeapIntegrationHelpers'
import KeapAuthorization from './KeapAuthorization'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput, checkMappedFields } from './KeapCommonFunc'
import KeapIntegLayout from './KeapIntegLayout'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'

function Keap({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const contactFields = [
    { key: 'given_name', label: __('First Name', 'bit-integrations'), required: true },
    { key: 'middle_name', label: __('Last Name', 'bit-integrations'), required: false },
    { key: 'job_title', label: __('Job Title', 'bit-integrations'), required: false },
    { key: 'email_addresses', label: __('Email Addresses', 'bit-integrations'), required: true },
    { key: 'phone_numbers', label: __('Phone Numbers', 'bit-integrations'), required: false },
    {
      key: 'billing_country_code',
      label: __('Billing Country Code', 'bit-integrations'),
      required: false
    },
    { key: 'billing_locality', label: __('Billing Country', 'bit-integrations'), required: false },
    {
      key: 'billing_first_address_street',
      label: __('Billing Address Street (Line 1)', 'bit-integrations'),
      required: false
    },
    {
      key: 'billing_second_address_street',
      label: __('Billing Address Street (Line 2)', 'bit-integrations'),
      required: false
    },
    { key: 'billing_zip_code', label: __('Billing Zip Code', 'bit-integrations'), required: false },
    {
      key: 'shipping_country_code',
      label: __('Shipping Country Code', 'bit-integrations'),
      required: false
    },
    {
      key: 'shipping_locality',
      label: __('Shipping Country', 'bit-integrations'),
      required: false
    },
    {
      key: 'shipping_first_address_street',
      label: __('Shipping Address Street (Line 1)', 'bit-integrations'),
      required: false
    },
    {
      key: 'shipping_second_address_street',
      label: __('Shipping Address Street (Line 2)', 'bit-integrations'),
      required: false
    },
    {
      key: 'shipping_zip_code',
      label: __('Shipping Zip Code', 'bit-integrations'),
      required: false
    },
    { key: 'anniversary', label: __('Anniversary', 'bit-integrations'), required: false },
    { key: 'birthday', label: __('Birthday', 'bit-integrations'), required: false },
    { key: 'fax_numbers', label: __('Fax Numbers', 'bit-integrations'), required: false }
  ]
  const [keapConf, setKeapConf] = useState({
    name: 'Keap',
    type: 'Keap',
    clientId: '',
    clientSecret: '',
    keapId: '',
    field_map: [{ formField: '', keapField: '' }],
    contactFields,
    customFields: [],
    actions: {}
  })

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    window.opener && setGrantTokenResponse('keap')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (!checkMappedFields(keapConf)) {
      setSnackbar({ show: true, msg: __('Please map fields to continue.', 'bit-integrations') })
      return
    }
    if (keapConf.field_map.length > 0) {
      setstep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <KeapAuthorization
        formID={formID}
        keapConf={keapConf}
        setKeapConf={setKeapConf}
        step={step}
        setstep={setstep}
        setSnackbar={setSnackbar}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>
        <KeapIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={e => handleInput(e, keapConf, setKeapConf, formID, setIsLoading, setSnackbar)}
          keapConf={keapConf}
          setKeapConf={setKeapConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={keapConf.field_map.length < 2}
          className="btn f-right btcd-btn-lg purple sh-sm flx"
          type="button">
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
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
            conf: keapConf,
            setIsLoading,
            setSnackbar
          })
        }
        isLoading={isLoading}
        dataConf={keapConf}
        setDataConf={setKeapConf}
        formFields={formFields}
      />
    </div>
  )
}

export default Keap
