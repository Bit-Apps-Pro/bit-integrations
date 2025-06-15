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
import MoxieCRMAuthorization from './MoxieCRMAuthorization'
import { checkMappedFields, handleInput } from './MoxieCRMCommonFunc'
import MoxieCRMIntegLayout from './MoxieCRMIntegLayout'

function MoxieCRM({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const clientFields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'address1', label: 'Address1', required: false },
    { key: 'address2', label: 'Address2', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'locality', label: 'Locality', required: false },
    { key: 'postal', label: 'Postal', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'website', label: 'Website', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'leadSource', label: 'Lead Source', required: false },
    { key: 'hourlyAmount', label: 'Hourly Amount', required: false },
    { key: 'currency', label: 'Currency', required: false },
    { key: 'notes', label: 'Notes', required: false },
    { key: 'firstName', label: 'Contact First Name', required: false },
    { key: 'lastName', label: 'Contact Last Name', required: false },
    { key: 'email', label: 'Contact Email', required: false },
  ]

  const contactFields = [
    { key: 'email', label: 'Email Address', required: true },
    { key: 'first', label: 'First Name', required: false },
    { key: 'last', label: 'Last Name', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'notes', label: 'Notes', required: false },

  ]

  const opportunityFields = [
    { key: 'name', label: 'Opportunity Name', required: true },
    { key: 'description', label: 'Description', required: false },
    { key: 'value', label: 'Value', required: false },
    { key: 'firstName', label: 'Lead First Name', required: false },
    { key: 'lastName', label: 'Lead Last Name', required: false },
    { key: 'email', label: 'Lead Email', required: false },
    { key: 'phone', label: 'Lead Phone', required: false },
    { key: 'role', label: 'Lead Role', required: false },
    { key: 'businessName', label: 'Lead Business Name', required: false },
    { key: 'website', label: 'Lead Website', required: false },
    { key: 'address1', label: 'Lead Address 1', required: false },
    { key: 'address2', label: 'Lead Address 2', required: false },
    { key: 'city', label: 'Lead City', required: false },
    { key: 'locality', label: 'Lead Locality', required: false },
    { key: 'postal', label: 'Lead Postal', required: false },
    { key: 'country', label: 'Lead Country', required: false },
    { key: 'sourceUrl', label: 'Lead Source Url', required: false },
    { key: 'leadSource', label: 'Lead Source', required: false },
  ]


  const [moxiecrmConf, setMoxieCRMConf] = useState({
    name: 'MoxieCRM',
    type: 'MoxieCRM',
    api_key: process.env.NODE_ENV === 'development' ? '650812eea4abf602e48784f4.bb61de27cab66b7943d78f039cb108ea1a53e7b6c839754a3b4f7c824d4c5d45' : '',
    api_url: process.env.NODE_ENV === 'development' ? 'pod01.withmoxie.com' : '',
    field_map: [
      { formField: '', moxiecrmFormField: '' },
    ],
    actionName: '',
    clientFields,
    contactFields,
    opportunityFields,
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, moxiecrmConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(moxiecrmConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    moxiecrmConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <MoxieCRMAuthorization
        moxiecrmConf={moxiecrmConf}
        setMoxieCRMConf={setMoxieCRMConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <MoxieCRMIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, moxiecrmConf, setMoxieCRMConf, setLoading, setSnackbar)}
          moxiecrmConf={moxiecrmConf}
          setMoxieCRMConf={setMoxieCRMConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />

        {moxiecrmConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(moxiecrmConf))}
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
      {moxiecrmConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={moxiecrmConf}
          setDataConf={setMoxieCRMConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default MoxieCRM
