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

export default function Fabman({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({ auth: false, workspaces: false, members: false })
  const [step, setStep] = useState(1)
  const [snack, setSnack] = useState({ show: false })
  const [fabmanConf, setFabmanConf] = useState({
    name: 'Fabman',
    type: 'Fabman',
    field_map: [{ formField: '', fabmanFormField: '' }],

    memberStaticFields: [
      { key: 'emailAddress', label: __('Email Address', 'bit-integrations'), required: false },
      { key: 'firstName', label: __('First Name', 'bit-integrations'), required: true },
      { key: 'lastName', label: __('Last Name', 'bit-integrations'), required: false },
      { key: 'memberNumber', label: __('Member Number', 'bit-integrations'), required: false },
      { key: 'gender', label: __('Gender', 'bit-integrations'), required: false },
      { key: 'dateOfBirth', label: __('Date of Birth', 'bit-integrations'), required: false },
      { key: 'company', label: __('Company', 'bit-integrations'), required: false },
      { key: 'phone', label: __('Phone', 'bit-integrations'), required: false },
      { key: 'address', label: __('Address', 'bit-integrations'), required: false },
      { key: 'address2', label: __('Address 2', 'bit-integrations'), required: false },
      { key: 'city', label: __('City', 'bit-integrations'), required: false },
      { key: 'zip', label: __('ZIP Code', 'bit-integrations'), required: false },
      { key: 'countryCode', label: __('Country Code', 'bit-integrations'), required: false },
      { key: 'region', label: __('Region', 'bit-integrations'), required: false },
      { key: 'notes', label: __('Notes', 'bit-integrations'), required: false },
      { key: 'billingFirstName', label: __('Billing First Name', 'bit-integrations'), required: false },
      { key: 'billingLastName', label: __('Billing Last Name', 'bit-integrations'), required: false },
      { key: 'billingCompany', label: __('Billing Company', 'bit-integrations'), required: false },
      { key: 'billingAddress', label: __('Billing Address', 'bit-integrations'), required: false },
      { key: 'billingAddress2', label: __('Billing Address 2', 'bit-integrations'), required: false },
      { key: 'billingCity', label: __('Billing City', 'bit-integrations'), required: false },
      { key: 'billingZip', label: __('Billing ZIP Code', 'bit-integrations'), required: false },
      {
        key: 'billingCountryCode',
        label: __('Billing Country Code', 'bit-integrations'),
        required: false
      },
      { key: 'billingRegion', label: __('Billing Region', 'bit-integrations'), required: false },
      {
        key: 'billingInvoiceText',
        label: __('Billing Invoice Text', 'bit-integrations'),
        required: false
      },
      {
        key: 'billingEmailAddress',
        label: __('Billing Email Address', 'bit-integrations'),
        required: false
      },
      { key: 'language', label: __('Language', 'bit-integrations'), required: false },
      { key: 'state', label: __('State', 'bit-integrations'), required: false },
      { key: 'taxExempt', label: __('Tax Exempt', 'bit-integrations'), required: false },
      {
        key: 'hasBillingAddress',
        label: __('Has Billing Address', 'bit-integrations'),
        required: false
      },
      {
        key: 'requireUpfrontPayment',
        label: __('Require Upfront Payment', 'bit-integrations'),
        required: false
      },
      {
        key: 'upfrontMinimumBalance',
        label: __('Upfront Minimum Balance', 'bit-integrations'),
        required: false
      }
    ],

    spacesStaticFields: [
      { key: 'name', label: __('Name', 'bit-integrations'), required: true },
      { key: 'shortName', label: __('Short Name', 'bit-integrations'), required: false },
      { key: 'timezone', label: __('Timezone', 'bit-integrations'), required: true },
      { key: 'emailAddress', label: __('Email Address', 'bit-integrations'), required: false },
      { key: 'website', label: __('Website', 'bit-integrations'), required: false },
      { key: 'phone', label: __('Phone', 'bit-integrations'), required: false },
      { key: 'infoText', label: __('Info Text', 'bit-integrations'), required: false },
      {
        key: 'bookingTermsOfService',
        label: __('Booking Terms Of Service', 'bit-integrations'),
        required: false
      },
      {
        key: 'bookingSlotsPerHour',
        label: __('Booking Slots Per Hour', 'bit-integrations'),
        required: false
      },
      {
        key: 'bookingWindowMinHours',
        label: __('Booking Window Min Hours', 'bit-integrations'),
        required: false
      },
      {
        key: 'bookingWindowMaxDays',
        label: __('Booking Window Max Days', 'bit-integrations'),
        required: false
      },
      {
        key: 'bookingLockInHours',
        label: __('Booking Lock-in Hours', 'bit-integrations'),
        required: false
      },
      {
        key: 'bookingMaxMinutesPerMemberDay',
        label: __('Booking Max Minutes Per Member/Day', 'bit-integrations'),
        required: false
      },
      {
        key: 'bookingMaxMinutesPerMemberWeek',
        label: __('Booking Max Minutes Per Member/Week', 'bit-integrations'),
        required: false
      },
      {
        key: 'bookingExclusiveMinutes',
        label: __('Booking Exclusive Minutes', 'bit-integrations'),
        required: false
      },
      {
        key: 'bookingOpeningHours',
        label: __('Booking Opening Hours', 'bit-integrations'),
        required: false
      },
      { key: 'bookingRefundable', label: __('Booking Refundable', 'bit-integrations'), required: false },
      {
        key: 'bookingNamesPublic',
        label: __('Booking Names Public', 'bit-integrations'),
        required: false
      }
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
    fields: [],
    accountId: '',
    selectedLockVersion: ''
  })

  // Extracted validation logic
  const isConfigInvalid = () => {
    if (!fabmanConf.actionName) return true
    if (
      !['delete_member', 'delete_spaces'].includes(fabmanConf.actionName) &&
      !checkMappedFields(fabmanConf)
    )
      return true
    if (
      ['create_member', 'update_member', 'delete_member', 'update_spaces', 'delete_spaces'].includes(
        fabmanConf.actionName
      ) &&
      !fabmanConf.selectedWorkspace
    )
      return true
    if (['update_member', 'delete_member'].includes(fabmanConf.actionName) && !fabmanConf.selectedMember)
      return true
    return false
  }

  const saveConfig = () => {
    if (isConfigInvalid()) {
      if (!fabmanConf.actionName) {
        setSnack({ show: true, msg: __('Please select an action', 'bit-integrations') })
      } else if (
        !['delete_member', 'delete_spaces'].includes(fabmanConf.actionName) &&
        !checkMappedFields(fabmanConf)
      ) {
        setSnack({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      } else if (
        ['create_member', 'update_member', 'delete_member', 'update_spaces', 'delete_spaces'].includes(
          fabmanConf.actionName
        ) &&
        !fabmanConf.selectedWorkspace
      ) {
        setSnack({ show: true, msg: __('Please select a workspace', 'bit-integrations') })
      } else if (
        ['update_member', 'delete_member'].includes(fabmanConf.actionName) &&
        !fabmanConf.selectedMember
      ) {
        setSnack({ show: true, msg: __('Please select a member', 'bit-integrations') })
      }
      return
    }
    saveIntegConfig(flow, setFlow, allIntegURL, fabmanConf, navigate, '', '', setIsLoading)
  }

  const nextPage = () => {
    if (isConfigInvalid()) {
      if (!fabmanConf.actionName) {
        setSnack({ show: true, msg: __('Please select an action', 'bit-integrations') })
      } else if (
        !['delete_member', 'delete_spaces'].includes(fabmanConf.actionName) &&
        !checkMappedFields(fabmanConf)
      ) {
        setSnack({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      } else if (
        ['create_member', 'update_member', 'delete_member', 'update_spaces', 'delete_spaces'].includes(
          fabmanConf.actionName
        ) &&
        !fabmanConf.selectedWorkspace
      ) {
        setSnack({ show: true, msg: __('Please select a workspace', 'bit-integrations') })
      } else if (
        ['update_member', 'delete_member'].includes(fabmanConf.actionName) &&
        !fabmanConf.selectedMember
      ) {
        setSnack({ show: true, msg: __('Please select a member', 'bit-integrations') })
      }
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
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnack} />
      <div className="mt-3 txt-center">
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
        <div
          className="btcd-stp-page"
          style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>
          <FabmanIntegLayout
            formFields={formFields}
            fabmanConf={fabmanConf}
            setFabmanConf={setFabmanConf}
            loading={loading}
            setLoading={setLoading}
            setSnackbar={setSnack}
          />

          <button
            onClick={nextPage}
            disabled={isConfigInvalid()}
            className="btn f-right btcd-btn-lg purple sh-sm flx"
            type="button">
            {__('Next', 'bit-integrations')}
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        </div>
      )}

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() =>
          saveIntegConfig(flow, setFlow, allIntegURL, fabmanConf, navigate, '', '', setIsLoading)
        }
        isLoading={isLoading}
        dataConf={fabmanConf}
        setDataConf={setFabmanConf}
        formFields={formFields}
      />
    </div>
  )
}
