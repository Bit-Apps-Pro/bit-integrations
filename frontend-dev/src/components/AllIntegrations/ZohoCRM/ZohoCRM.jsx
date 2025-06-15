/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ZohoAuthorization from '../ZohoAuthorization'
import { checkMappedFields, handleInput, refreshModules } from './ZohoCRMCommonFunc'
import ZohoCRMIntegLayout from './ZohoCRMIntegLayout'

function ZohoCRM({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [tab, settab] = useState(0)
  const { zohoCRM } = tutorialLinks
  const scopes = 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.Read,zohocrm.files.CREATE'


  const [crmConf, setCrmConf] = useState({
    name: 'Zoho CRM',
    type: 'Zoho CRM',
    clientId: process.env.NODE_ENV === 'development' ? '1000.K74DBY9N0MEW6C4G0153AIXOIVW0ME' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '27daa2acedc21c988641d079a16ed7fab9135dcf0f' : '',
    module: '',
    layout: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
    relatedlists: [],
    actions: {},
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoCRM')
  }, [])

  const saveConfig = () => {
    saveActionConf({ flow, setFlow, allIntegURL, conf: crmConf, navigate, setIsLoading, setSnackbar })
  }
  const nextPage = (pageNo) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (pageNo === 2) {
      setstep(pageNo)
      !crmConf.module && refreshModules(formID, crmConf, setCrmConf, setIsLoading, setSnackbar)
      return
    }

    if (!checkMappedFields(crmConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    crmConf.module && crmConf.layout && crmConf.field_map.length > 0 && setstep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <ZohoAuthorization
        integ="zohoCRM"
        tutorialLink={zohoCRM}
        scopes={scopes}
        config={crmConf}
        setConfig={setCrmConf}
        step={step}
        nextPage={nextPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <ZohoCRMIntegLayout
          tab={tab}
          settab={settab}
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, tab, crmConf, setCrmConf, formID, setIsLoading, setSnackbar)}
          crmConf={crmConf}
          setCrmConf={setCrmConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={crmConf.module === '' || crmConf.layout === '' || crmConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
        isLoading={isLoading}
        dataConf={crmConf}
        setDataConf={setCrmConf}
        formFields={formFields}
      />
    </div>
  )
}

export default ZohoCRM
