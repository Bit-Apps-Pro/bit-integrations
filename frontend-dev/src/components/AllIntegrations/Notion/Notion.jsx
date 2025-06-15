/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import StepPage from '../../Utilities/StepPage'
import Steps from '../../Utilities/Steps'
import { setGrantTokenResponse } from '../IntegrationHelpers/GoogleIntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import NotionAuthorization from './NotionAuthorization'
import { nextPage, saveConfig } from './NotionCommonFunc'
import NotionIntegLayout from './NotionIntegLayout'

function Notion({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  useEffect(() => {
    window.opener && setGrantTokenResponse('notion')
  }, [])

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState({
    auth: false,
    list: false,
    page: false,
    field: false,
  })
  const [notionConf, setNotionConf] = useState({
    name: 'Notion',
    type: 'Notion',
    clientId: process.env.NODE_ENV === 'development' ? '3666dc6d-8e41-4e04-b0d7-c652b0fccfaa' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? 'secret_hU4uEb602cEHr8F9r612UBcNfSDJBcn6uXod7F262c8' : '',
    databaseId: '',
    field_map: [{ formFields: '', notionFormFields: '' }],
    notionFields: '',
  })
  const setSavePageLoad = (value) => {
    setLoading({ ...loading, page: value })
  }

  return (
    <div>
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>
      <NotionAuthorization
        step={step}
        setStep={setStep}
        notionConf={notionConf}
        setNotionConf={setNotionConf}
        loading={loading}
        setLoading={setLoading}
      />

      {/* --- STEP 2 --- */}

      <StepPage
        step={step}
        stepNo={2}
        style={{ width: 900, height: 'auto', overflow: 'visible' }}
      >
        <NotionIntegLayout
          notionConf={notionConf}
          setNotionConf={setNotionConf}
          formFields={formFields}
          loading={loading}
          setLoading={setLoading}
        />
        {notionConf?.databaseId && (
          <button
            onClick={() => nextPage(notionConf, setStep, 3)}
            disabled={!notionConf.databaseId || notionConf.field_map.length < 1}
            className="btn f-right btcd-btn-lg green sh-sm flx"
            type="button"
          >
            {__('Next')}
            &nbsp;
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        )}
      </StepPage>

      {notionConf.databaseId && (

        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig(flow, setFlow, allIntegURL, notionConf, navigate, setSavePageLoad)}
          isLoading={loading.page}
          dataConf={notionConf}
          setDataConf={setNotionConf}
          formFields={formFields}
        />

      )}
    </div>
  )
}

export default Notion
