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
import LMFWCAuthorization from './LMFWCAuthorization'
import { checkMappedFields, generateMappedField } from './LMFWCCommonFunc'
import LMFWCIntegLayout from './LMFWCIntegLayout'

function LMFWC({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const licenseFields = [
    { label: __('License key', 'bit-integrations'), key: 'license_key', required: true },
    { label: __('Valid for (days)', 'bit-integrations'), key: 'valid_for', required: false },
    { label: __('Expires at', 'bit-integrations'), key: 'expires_at', required: false },
    { label: __('Maximum activation count', 'bit-integrations'), key: 'times_activated_max', required: false },
  ]

  const modules = [
    { name: 'create_license', label: __('Create a license', 'bit-integrations'), is_pro: false },
    { name: 'update_license', label: __('Update a license', 'bit-integrations'), is_pro: true },
    { name: 'activate_license', label: __('Activate a license', 'bit-integrations'), is_pro: true },
    { name: 'delete_license', label: __('Delete a License', 'bit-integrations'), is_pro: true },
    { name: 'reactivate_license', label: __('Reactivate a License', 'bit-integrations'), is_pro: true },
    { name: 'create_generator', label: __('Create a generator', 'bit-integrations'), is_pro: true },
    { name: 'update_generator', label: __('Delete a Generator', 'bit-integrations'), is_pro: true }
  ]

  const [licenseManagerConf, setLicenseManagerConf] = useState({
    name: 'License Manager For WooCommerce',
    type: 'License Manager For WooCommerce',
    base_url: window.location.origin,
    api_key: process.env.NODE_ENV === 'development' ? 'ck_5782ba9801de81aa84d9e38745fae2f30b3a2eed' : '',
    api_secret: process.env.NODE_ENV === 'development' ? 'cs_2f075d046a3cc5b698481aeed618841bf3e9ccb3' : '',
    field_map: [{ formField: '', lmfwcFormField: '' }],
    lmfwcFields: [],
    module: '',
    licenseFields,
    modules
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(
      flow,
      setFlow,
      allIntegURL,
      licenseManagerConf,
      navigate,
      '',
      '',
      setIsLoading
    )
    resp.then((res) => {
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

    if (!checkMappedFields(licenseManagerConf)) {
      toast.error(__('Please map mandatory fields', 'bit-integrations'))
      return
    }

    // if (!licenseManagerConf.selectedEvent) {
    //   toast.error(__('Please select a Event', 'bit-integrations'))
    //   return
    // }

    licenseManagerConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <LMFWCAuthorization
        licenseManagerConf={licenseManagerConf}
        setLicenseManagerConf={setLicenseManagerConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{ ...(step === 2 && { width: 900, minHeight: '400px', height: 'auto', overflow: 'visible' }) }}>
        <LMFWCIntegLayout
          formFields={formFields}
          licenseManagerConf={licenseManagerConf}
          setLicenseManagerConf={setLicenseManagerConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {licenseManagerConf?.module && (
          <button
            onClick={() => nextPage(3)}
            disabled={!checkMappedFields(licenseManagerConf)}
            className="btn f-right btcd-btn-lg purple sh-sm flx"
            type="button">
            {__('Next', 'bit-integrations')} &nbsp;
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        )}
      </div>

      {/* STEP 3 */}
      {licenseManagerConf?.module && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={licenseManagerConf}
          setDataConf={setLicenseManagerConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default LMFWC
