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
import WoodpeckerAuthorization from './WoodpeckerAuthorization'
import { checkMappedFields, handleInput } from './WoodpeckerCommonFunc'
import WoodpeckerIntegLayout from './WoodpeckerIntegLayout'

function Woodpecker({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const prospectsFields = [
    { key: 'first_name', label: 'First name', required: false },
    { key: 'last_name', label: 'Last name', required: false },
    { key: 'company', label: 'Company', required: false },
    { key: 'industry', label: 'Industry', required: false },
    { key: 'website', label: 'Website', required: false },
    { key: 'email', label: 'Email', required: true },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'linkedin_url', label: 'Linkedin URL', required: false },
    { key: 'tags', label: 'Tags', required: false },
    { key: 'title', label: 'Title', required: false },
    { key: 'address', label: 'Address', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'snipet1', label: 'snipet1', required: false },
    { key: 'snipet2', label: 'snipet2', required: false },
    { key: 'snipet3', label: 'snipet3', required: false },
    { key: 'snipet4', label: 'snipet4', required: false },
    { key: 'snippet1', label: 'snippet1', required: false },
    { key: 'snippet2', label: 'snippet2', required: false },
    { key: 'snippet3', label: 'snippet3', required: false },
    { key: 'snippet4', label: 'snippet4', required: false },
    { key: 'snippet5', label: 'snippet5', required: false },
    { key: 'snippet6', label: 'snippet6', required: false },
    { key: 'snippet7', label: 'snippet7', required: false },
    { key: 'snippet8', label: 'snippet8', required: false },
    { key: 'snippet9', label: 'snippet9', required: false },
    { key: 'snippet10', label: 'snippet10', required: false },
    { key: 'snippet11', label: 'snippet11', required: false },
    { key: 'snippet12', label: 'snippet12', required: false },
    { key: 'snippet13', label: 'snippet13', required: false },
    { key: 'snippet14', label: 'snippet14', required: false },
    { key: 'snippet15', label: 'snippet15', required: false },
  ]

  const companyFields = [
    { key: 'name', label: 'Company Name', required: true }
  ]

  const [woodpeckerConf, setWoodpeckerConf] = useState({
    name: 'Woodpecker',
    type: 'Woodpecker',
    api_key: process.env.NODE_ENV === 'development' ? '411340.5e782bcaf07998f5344948482d2e862630f438756971599d0c95f76c5b7098f7' : '',
    field_map: [
      { formField: '', woodpeckerFormField: '' },
    ],
    actionName: '',
    actionId: '',
    prospectsFields,
    companyFields,
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, woodpeckerConf, navigate, '', '', setIsLoading)
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

    if (!checkMappedFields(woodpeckerConf)) {
      toast.error('Please map mandatory fields')
      return
    }

    if (woodpeckerConf.actionName === 'adding_prospects_to_the_campaign' && !woodpeckerConf.selectedCampaign) {
      toast.error('Please select a Campaign')
      return
    }

    woodpeckerConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <WoodpeckerAuthorization
        woodpeckerConf={woodpeckerConf}
        setWoodpeckerConf={setWoodpeckerConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <WoodpeckerIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, woodpeckerConf, setWoodpeckerConf, setLoading, setSnackbar)}
          woodpeckerConf={woodpeckerConf}
          setWoodpeckerConf={setWoodpeckerConf}
          loading={loading}
          setLoading={setLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        {woodpeckerConf?.actionName && (
          <button
            onClick={() => nextPage(3)}
            disabled={!(checkMappedFields(woodpeckerConf))}
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
      {woodpeckerConf?.actionName && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig()}
          isLoading={isLoading}
          dataConf={woodpeckerConf}
          setDataConf={setWoodpeckerConf}
          formFields={formFields}
        />
      )}
    </div>
  )
}

export default Woodpecker
