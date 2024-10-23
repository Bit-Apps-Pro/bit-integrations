// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ActiveCampaignAuthorization from './ActiveCampaignAuthorization'
import { checkMappedFields } from './ActiveCampaignCommonFunc'
import ActiveCampaignIntegLayout from './ActiveCampaignIntegLayout'

function ActiveCampaign({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [activeCampaingConf, setActiveCampaingConf] = useState({
    name: 'Active Campaign',
    type: 'ActiveCampaign',
    api_url: process.env.NODE_ENV === 'development' ? 'https://furnato.activehosted.com' : '',
    api_key:
      process.env.NODE_ENV === 'development'
        ? 'b2b11fa4ba55b77e5d31bcc7f1ce36461efc523c3fe1536d0f37e05892c15a924e705a5f'
        : '',
    field_map: [{ formField: '', activeCampaignField: '' }],
    actions: {}
  })
  const nextPage = (val) => {
    // setIsLoading(true)
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (!checkMappedFields(activeCampaingConf)) {
        setSnackbar({
          show: true,
          msg: __('Please map all required fields to continue.', 'bit-integrations')
        })
        return
      }
      if (!activeCampaingConf?.listId) {
        setSnackbar({ show: true, msg: __('Please select list to continue.', 'bit-integrations') })
        return
      }
      if (activeCampaingConf.name !== '' && activeCampaingConf.field_map.length > 0) {
        setstep(3)
      }
    }
  }
  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <ActiveCampaignAuthorization
        formID={formID}
        activeCampaingConf={activeCampaingConf}
        setActiveCampaingConf={setActiveCampaingConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />
      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>
        <ActiveCampaignIntegLayout
          formID={formID}
          formFields={formFields}
          activeCampaingConf={activeCampaingConf}
          setActiveCampaingConf={setActiveCampaingConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!activeCampaingConf?.listId || activeCampaingConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg purple sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')} &nbsp;
          <BackIcn className="ml-1 rev-icn" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() =>
          saveIntegConfig(flow, setFlow, allIntegURL, activeCampaingConf, navigate, '', '', setIsLoading)
        }
        isLoading={isLoading}
        dataConf={activeCampaingConf}
        setDataConf={setActiveCampaingConf}
        formFields={formFields}
      />
    </div>
  )
}

export default ActiveCampaign
