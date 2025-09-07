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
import FabmanAuthorization from './FabmanAuthorization'
import { checkMappedFields, fetchFabmanMembers } from './FabmanCommonFunc'
import FabmanIntegLayout from './FabmanIntegLayout'

export default function Fabman({ formFields, formID, setSnackbar }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({ auth: false, workspaces: false, members: false })
  const [step, setStep] = useState(1)
  const [snack, setSnack] = useState({ show: false })
  const [fabmanConf, setFabmanConf] = useState({
    name: 'Fabman',
    type: 'Fabman',
    field_map: [{ formField: '', fabmanFormField: '' }],
    staticFields: [
      { key: 'emailAddress', label: 'Email Address', required: 1 },
      { key: 'firstName', label: 'First Name', required: '' },
      { key: 'lastName', label: 'Last Name', required: '' },
      { key: 'memberNumber', label: 'Member Number', required: '' },
      { key: 'gender', label: 'Gender', required: '' },
      { key: 'dateOfBirth', label: 'Date of Birth', required: '' },
      { key: 'company', label: 'Company', required: '' },
      { key: 'phone', label: 'Phone', required: '' },
      { key: 'address', label: 'Address', required: '' },
      { key: 'address2', label: 'Address 2', required: '' },
      { key: 'city', label: 'City', required: '' },
      { key: 'zip', label: 'ZIP Code', required: '' },
      { key: 'countryCode', label: 'Country Code', required: '' },
      { key: 'region', label: 'Region', required: '' },
      { key: 'notes', label: 'Notes', required: '' },
      { key: 'billingFirstName', label: 'Billing First Name', required: '' },
      { key: 'billingLastName', label: 'Billing Last Name', required: '' },
      { key: 'billingCompany', label: 'Billing Company', required: '' },
      { key: 'billingAddress', label: 'Billing Address', required: '' },
      { key: 'billingAddress2', label: 'Billing Address 2', required: '' },
      { key: 'billingCity', label: 'Billing City', required: '' },
      { key: 'billingZip', label: 'Billing ZIP Code', required: '' },
      { key: 'billingCountryCode', label: 'Billing Country Code', required: '' },
      { key: 'billingRegion', label: 'Billing Region', required: '' },
      { key: 'billingInvoiceText', label: 'Billing Invoice Text', required: '' },
      { key: 'billingEmailAddress', label: 'Billing Email Address', required: '' },
      { key: 'language', label: 'Language', required: '' },
      { key: 'state', label: 'State', required: '' },
      { key: 'taxExempt', label: 'Tax Exempt', required: '' },
      { key: 'hasBillingAddress', label: 'Has Billing Address', required: '' },
      { key: 'requireUpfrontPayment', label: 'Require Upfront Payment', required: '' },
      { key: 'upfrontMinimumBalance', label: 'Upfront Minimum Balance', required: '' }
    ],
    customFields: [],
    actions: {},
    condition: {
      action_behavior: '',
      actions: [{ field: '', action: 'value' }],
      logics: [{ field: '', logic: '', val: '' }, 'or', { field: '', logic: '', val: '' }]
    },
    trigger_type: '',
    pro_integ_v: '2.5.4',
    fields: []
  })

  const saveConfig = () => {
    if (!checkMappedFields(fabmanConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (!fabmanConf.actionName) {
      setSnackbar({ show: true, msg: __('Please select an action', 'bit-integrations') })
      return
    }

    if (!fabmanConf.selectedWorkspace) {
      setSnackbar({ show: true, msg: __('Please select a workspace', 'bit-integrations') })
      return
    }

    const requiresMemberSelection =
      fabmanConf.actionName === 'update_member' || fabmanConf.actionName === 'delete_member'
    if (requiresMemberSelection && !fabmanConf.selectedMember) {
      setSnackbar({ show: true, msg: __('Please select a member', 'bit-integrations') })
      return
    }

    setIsLoading(true)
    const integConfig = {
      apiKey: fabmanConf.apiKey,
      selectedWorkspace: fabmanConf.selectedWorkspace,
      selectedMember: fabmanConf.selectedMember,
      actionName: fabmanConf.actionName,
      field_map: fabmanConf.field_map,
      staticFields: fabmanConf.staticFields,
      customFields: fabmanConf.customFields,
      actions: fabmanConf.actions,
      condition: fabmanConf.condition,
      trigger_type: fabmanConf.trigger_type,
      pro_integ_v: fabmanConf.pro_integ_v,
      fields: fabmanConf.fields
    }

    saveIntegConfig(integConfig, formID)
      .then(() => {
        setSnackbar({ show: true, msg: __('Fabman integration saved successfully', 'bit-integrations') })
        setStep(3)
      })
      .catch(() => {
        setSnackbar({ show: true, msg: __('Something went wrong', 'bit-integrations') })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const nextPage = () => {
    if (!checkMappedFields(fabmanConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (!fabmanConf.actionName) {
      setSnackbar({ show: true, msg: __('Please select an action', 'bit-integrations') })
      return
    }

    if (!fabmanConf.selectedWorkspace) {
      setSnackbar({ show: true, msg: __('Please select a workspace', 'bit-integrations') })
      return
    }

    const requiresMemberSelection =
      fabmanConf.actionName === 'update_member' || fabmanConf.actionName === 'delete_member'
    if (requiresMemberSelection && !fabmanConf.selectedMember) {
      setSnackbar({ show: true, msg: __('Please select a member', 'bit-integrations') })
      return
    }

    setStep(3)
  }

  const handleWorkspaceChange = e => {
    const newConf = { ...fabmanConf }
    newConf.selectedWorkspace = e.target.value
    setFabmanConf(newConf)

    const requiresMemberSelection =
      fabmanConf.actionName === 'update_member' || fabmanConf.actionName === 'delete_member'
    if (requiresMemberSelection && e.target.value) {
      fetchFabmanMembers(newConf, setFabmanConf, loading, setLoading, 'fetch')
    }
  }

  const handleActionChange = e => {
    const newConf = { ...fabmanConf }
    newConf.actionName = e.target.value
    setFabmanConf(newConf)

    const requiresMemberSelection =
      e.target.value === 'update_member' || e.target.value === 'delete_member'
    if (requiresMemberSelection && fabmanConf.selectedWorkspace) {
      fetchFabmanMembers(newConf, setFabmanConf, loading, setLoading, 'fetch')
    }
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnack} />
      <div className="mt-3">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <FabmanAuthorization
        fabmanConf={fabmanConf}
        setFabmanConf={setFabmanConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
      />

      {/* STEP 2 */}
      {step === 2 && (
        <FabmanIntegLayout
          formFields={formFields}
          fabmanConf={fabmanConf}
          setFabmanConf={setFabmanConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <IntegrationStepThree
          step={step}
          saveConfig={saveConfig}
          isLoading={isLoading}
          dataConf={fabmanConf}
          setDataConf={setFabmanConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}
