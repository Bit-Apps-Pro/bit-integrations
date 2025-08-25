/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import toast from 'react-hot-toast'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ACPTAuthorization from './ACPTAuthorization'
import { checkMappedFields, generateMappedField } from './ACPTCommonFunc'
import ACPTIntegLayout from './ACPTIntegLayout'

function ACPT({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const licenseFields = [
    { label: __('License key', 'bit-integrations'), key: 'license_key', required: true }
  ]
  const generalFields = [
    { label: __('Valid for (days)', 'bit-integrations'), key: 'valid_for', required: false },
    { label: __('Expires at', 'bit-integrations'), key: 'expires_at', required: false },
    {
      label: __('Maximum activation count', 'bit-integrations'),
      key: 'times_activated_max',
      required: false
    }
  ]
  const generatorFields = [
    { label: __('Name', 'bit-integrations'), key: 'name', required: true },
    { label: __('Character map', 'bit-integrations'), key: 'charset', required: true },
    { label: __('Number of chunks', 'bit-integrations'), key: 'chunks', required: true },
    { label: __('Chunk length', 'bit-integrations'), key: 'chunk_length', required: true },
    {
      label: __('Maximum activation count', 'bit-integrations'),
      key: 'times_activated_max',
      required: false
    },
    { label: __('Separator', 'bit-integrations'), key: 'separator', required: false },
    { label: __('Prefix', 'bit-integrations'), key: 'prefix', required: false },
    { label: __('Suffix', 'bit-integrations'), key: 'suffix', required: false },
    { label: __('Expires in	(days)', 'bit-integrations'), key: 'expires_in', required: false }
  ]

  const modules = [
    { name: 'create_license', label: __('Create a license', 'bit-integrations'), is_pro: false },
    { name: 'update_license', label: __('Update a license', 'bit-integrations'), is_pro: true },
    { name: 'activate_license', label: __('Activate a license', 'bit-integrations'), is_pro: true },
    { name: 'deactivate_license', label: __('Deactivate a license', 'bit-integrations'), is_pro: true },
    { name: 'delete_license', label: __('Delete a License', 'bit-integrations'), is_pro: true },
    { name: 'reactivate_license', label: __('Reactivate a License', 'bit-integrations'), is_pro: true },
    { name: 'create_generator', label: __('Create a generator', 'bit-integrations'), is_pro: true },
    { name: 'update_generator', label: __('Update a Generator', 'bit-integrations'), is_pro: true }
  ]

  const [acptConf, setAcptConf] = useState({
    name: 'ACPT',
    type: 'ACPT',
    base_url: window.location.origin,
    api_key: '',
    field_map: [{ formField: '', acptFormField: '' }],
    acptFields: [],
    module: '',
    licenseFields,
    generalFields,
    generatorFields,
    modules
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, acptConf, navigate, '', '', setIsLoading)
    resp.then(res => {
      if (res.success) {
        toast.success(res.data?.msg)
        navigate(allIntegURL)
      } else {
        toast.error(res.data || res)
      }
    })
  }

  const nextPage = pageNo => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (acptConf.module != 'update_license' && !checkMappedFields(acptConf)) {
      toast.error(__('Please map mandatory fields', 'bit-integrations'))
      return
    }

    if (acptConf.module === 'create_license' && !acptConf?.selectedStatus) {
      toast.error(__('Please select Status', 'bit-integrations'))
      return
    }

    if (acptConf.module === 'update_license' && !acptConf?.selectedLicense) {
      toast.error(__('Please select Status', 'bit-integrations'))
      return
    }

    acptConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <ACPTAuthorization
        acptConf={acptConf}
        setAcptConf={setAcptConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{
          ...(step === 2 && { width: 900, minHeight: '400px', height: 'auto', overflow: 'visible' })
        }}>
        <ACPTIntegLayout
          formFields={formFields}
          acptConf={acptConf}
          setAcptConf={setAcptConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {acptConf?.module && (
          <button
            onClick={() => nextPage(3)}
            disabled={!checkMappedFields(acptConf)}
            className="btn f-right btcd-btn-lg purple sh-sm flx"
            type="button">
            {__('Next', 'bit-integrations')} &nbsp;
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        )}
      </div>

      {/* STEP 3 */}
      {acptConf?.module && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={acptConf}
          setDataConf={setAcptConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default ACPT
