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
import { checkMappedFields, handleInput, refreshModules } from './ZohoRecruitCommonFunc'
import ZohoRecruitIntegLayout from './ZohoRecruitIntegLayout'

function ZohoRecruit({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [tab, settab] = useState(0)
  const scopes = 'ZohoRecruit.users.ALL,ZohoRecruit.modules.all'
  const { zohoRecruit } = tutorialLinks
  const [recruitConf, setRecruitConf] = useState({
    name: 'Zoho Recruit',
    type: 'Zoho Recruit',
    clientId: '',
    clientSecret: '',
    module: '',
    field_map: [{ formField: '', zohoFormField: '' }],
    relatedlists: [],
    actions: {}
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoRecruit')
  }, [])

  const nextPage = (pageNo) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (pageNo === 2) {
      setstep(pageNo)
      refreshModules(formID, recruitConf, setRecruitConf, setIsLoading, setSnackbar)
      return
    }

    if (!checkMappedFields(recruitConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    if (recruitConf.module !== '' && recruitConf.field_map.length > 0) {
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
        integ="zohoRecruit"
        tutorialLink={zohoRecruit}
        scopes={scopes}
        config={recruitConf}
        setConfig={setRecruitConf}
        step={step}
        nextPage={nextPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>
        <ZohoRecruitIntegLayout
          tab={tab}
          settab={settab}
          formID={formID}
          formFields={formFields}
          handleInput={e =>
            handleInput(e, tab, recruitConf, setRecruitConf, formID, setIsLoading, setSnackbar)
          }
          recruitConf={recruitConf}
          setRecruitConf={setRecruitConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={recruitConf.module === '' || recruitConf.field_map.length < 1}
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
          saveIntegConfig(flow, setFlow, allIntegURL, recruitConf, navigate, '', '', setIsLoading)
        }
        isLoading={isLoading}
        dataConf={recruitConf}
        setDataConf={setRecruitConf}
        formFields={formFields}
      />
    </div>
  )
}

export default ZohoRecruit
