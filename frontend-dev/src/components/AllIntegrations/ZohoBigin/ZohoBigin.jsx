import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import BackIcn from '../../../Icons/BackIcn'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ZohoAuthorization from '../ZohoAuthorization'
import { checkMappedFields, handleInput, refreshModules } from './ZohoBiginCommonFunc'
import ZohoBiginIntegLayout from './ZohoBiginIntegLayout'

function ZohoBigin({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [tab, settab] = useState(0)
  const [biginConf, setBiginConf] = useRecoilState($actionConf)
  const formFields = useRecoilValue($formFields)
  const scopes = 'ZohoBigin.settings.modules.READ,ZohoBigin.settings.fields.READ,ZohoBigin.settings.tags.READ,ZohoBigin.users.READ,ZohoBigin.modules.ALL,ZohoBigin.settings.layouts.READ'
  const { zohoBigin } = tutorialLinks

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoBigin')
    setBiginConf({
      name: 'Zoho Bigin',
      type: 'Zoho Bigin',
      clientId: process.env.NODE_ENV === 'development' ? '1000.TUNG7UIFO7DNSI1BNATM0SXJ2KRFKF' : '',
      clientSecret: process.env.NODE_ENV === 'development' ? '946ab847ed5e6d6426adea379a4c51c24a4e92d47d' : '',
      module: '',
      field_map: [
        { formField: '', zohoFormField: '' },
      ],
      relatedlists: [],
      actions: {},
    })
  }, [])

  const nextPage = (pageNo) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (pageNo === 2) {
      setstep(pageNo)
      refreshModules(formID, biginConf, setBiginConf, setIsLoading, setSnackbar)
      return
    }
    if (!checkMappedFields(biginConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    if (biginConf?.module === 'Deals' && !biginConf?.pLayout) {
      setSnackbar({ show: true, msg: __('Please select a layout', 'bit-integrations') })
      return
    }
    if (biginConf.module !== '' && biginConf.field_map.length > 0) {
      setstep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <ZohoAuthorization
        integ="zohoBigin"
        tutorialLink={zohoBigin}
        scopes={scopes}
        config={biginConf}
        setConfig={setBiginConf}
        step={step}
        nextPage={nextPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>

        <ZohoBiginIntegLayout
          tab={tab}
          settab={settab}
          formID={formID}
          handleInput={(e) => handleInput(e, tab, biginConf, setBiginConf, formID, setIsLoading, setSnackbar)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          // disabled={biginConf.module === '' || biginConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
        </button>

      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: biginConf, navigate, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={biginConf}
        setDataConf={setBiginConf}
        formFields={formFields}
      />
    </div>
  )
}

export default ZohoBigin
