import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ZohoAuthorization from '../ZohoAuthorization'
import { checkMappedFields, handleInput, refreshLists } from './ZohoCampaignsCommonFunc'
import ZohoCampaignsIntegLayout from './ZohoCampaignsIntegLayout'

function ZohoCampaigns({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const scopes = 'ZohoCampaigns.contact.READ,ZohoCampaigns.contact.CREATE,ZohoCampaigns.contact.UPDATE'
  const { zohoCampaigns } = tutorialLinks
  const [campaignsConf, setCampaignsConf] = useState({
    name: 'Zoho Campaigns',
    type: 'Zoho Campaigns',
    clientId: '',
    clientSecret: '',
    list: '',
    field_map: [{ formField: '', zohoFormField: '' }]
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoCampaigns')
  }, [])

  const nextPage = (pageNo) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (pageNo === 2) {
      setstep(pageNo)
      refreshLists(formID, campaignsConf, setCampaignsConf, setIsLoading, setSnackbar)
      return
    }

    if (!checkMappedFields(campaignsConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (campaignsConf.list !== '' && campaignsConf.table !== '' && campaignsConf.field_map.length > 0) {
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
      <ZohoAuthorization
        integ="zohoCampaigns"
        tutorialLink={zohoCampaigns}
        scopes={scopes}
        config={campaignsConf}
        setConfig={setCampaignsConf}
        step={step}
        nextPage={nextPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>
        <ZohoCampaignsIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={e =>
            handleInput(e, formID, campaignsConf, setCampaignsConf, setIsLoading, setSnackbar)
          }
          campaignsConf={campaignsConf}
          setCampaignsConf={setCampaignsConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={
            campaignsConf.list === '' || campaignsConf.table === '' || campaignsConf.field_map.length < 1
          }
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
          saveIntegConfig(flow, setFlow, allIntegURL, campaignsConf, navigate, '', '', setIsLoading)
        }
        isLoading={isLoading}
        dataConf={campaignsConf}
        setDataConf={setCampaignsConf}
        formFields={formFields}
      />
    </div>
  )
}

export default ZohoCampaigns
