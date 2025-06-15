/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import LionDeskAuthorization from './LionDeskAuthorization'
import { checkMappedFields, handleInput, setGrantTokenResponse } from './LionDeskCommonFunc'
import LionDeskIntegLayout from './LionDeskIntegLayout'

function LionDesk({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const campaignFields = [
    { key: 'name', label: 'Name', required: true },
  ]
  const contactFields = [
    { key: 'first_name', label: 'First Name', required: false },
    { key: 'last_name', label: 'Last Name', required: false },
    { key: 'email', label: 'Email', required: true },
    { key: 'mobile_phone', label: 'Mobile Phone', required: false },
    { key: 'home_phone', label: 'Home Phone', required: false },
    { key: 'office_phone', label: 'Office Phone', required: false },
    { key: 'fax', label: 'Fax', required: false },
    { key: 'company', label: 'Company', required: false },
    { key: 'birthday', label: 'Birthday', required: false },
    { key: 'anniversary', label: 'Anniversary', required: false },
    { key: 'spouse_name', label: 'Spouse Name', required: false },
    { key: 'spouse_email', label: 'Spouse Email', required: false },
    { key: 'spouse_phone', label: 'Spouse Phone', required: false },
    { key: 'spouse_birthday', label: 'Spouse Birthday', required: false },
    { key: 'type', label: 'Address type', required: false },
    { key: 'street_address_1', label: 'Street Address 1', required: false },
    { key: 'street_address_2', label: 'Street Address 2', required: false },
    { key: 'zip', label: 'Zip', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
  ]

  const [lionDeskConf, setLionDeskConf] = useState({
    name: 'LionDesk',
    type: 'LionDesk',
    clientId: process.env.NODE_ENV === 'development' ? '6a245650854440d0dada1f57df066852a0bc3cef' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '6109fe54a44160eb8ded60a94d7d74c725622fb5' : '',
    field_map: [
      { formField: '', lionDeskFormField: '' },
    ],
    actionName: '',
    actionId: '',
    campaignFields,
    contactFields,
    actions: {},
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('lionDesk')
  }, [])

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, lionDeskConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(lionDeskConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    lionDeskConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <LionDeskAuthorization
        lionDeskConf={lionDeskConf}
        setLionDeskConf={setLionDeskConf}
        step={step}
        setStep={setStep}
        setSnackbar={setSnackbar}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <LionDeskIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, lionDeskConf, setLionDeskConf, setLoading, setSnackbar)}
          lionDeskConf={lionDeskConf}
          setLionDeskConf={setLionDeskConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {lionDeskConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(lionDeskConf))}
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
      {lionDeskConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={lionDeskConf}
          setDataConf={setLionDeskConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default LionDesk
