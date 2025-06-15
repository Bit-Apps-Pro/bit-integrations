import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import StepPage from '../../Utilities/StepPage'
import Steps from '../../Utilities/Steps'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import MoosendAuthorization from './MoosendAuthorization'
import { nextPage, saveConfig } from './MoosendCommonFunc'
import MoosendIntegLayout from './MoosendIntegLayout'

function Moosend({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState({
    auth: false,
    list: false,
    page: false,
  })
  const [moosendConf, setMoosendConf] = useState({
    name: 'Moosend',
    type: 'Moosend',
    authKey: process.env.NODE_ENV === 'development' ? '066846f2-debb-4d09-8615-9849f5b15d3a' : '',
    field_map: [
      { formFields: '', moosendFormFields: '' },
    ],
    listId: '',
    method: '',
    actions: {},
    moosendFields: [
      { key: 'Email', label: 'Email', required: true },
      { key: 'Name', label: 'Name', required: false },
      { key: 'Mobile', label: 'Mobile', required: false },
    ],

  })

  const setSavePageLoad = (value) => {
    setLoading({ ...loading, page: value })
  }

  return (
    <div>
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* --- STEP 1 --- */}

      <MoosendAuthorization
        moosendConf={moosendConf}
        setMoosendConf={setMoosendConf}
        loading={loading}
        setLoading={setLoading}
        step={step}
        setStep={setStep}
      />

      {/* --- STEP 2 --- */}

      <StepPage
        step={step}
        stepNo={2}
        style={{ width: 900, height: 'auto', overflow: 'visible' }}
      >
        <MoosendIntegLayout
          moosendConf={moosendConf}
          setMoosendConf={setMoosendConf}
          formFields={formFields}
          loading={loading}
          setLoading={setLoading}
        />
        {moosendConf?.method && (
          <button
            onClick={() => nextPage(moosendConf, setStep, 3)}
            disabled={moosendConf.field_map.length < 1}
            className="btn f-right btcd-btn-lg green sh-sm flx"
            type="button"
          >
            {__('Next')}
            &nbsp;
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        )}

      </StepPage>

      {/* --- STEP 3 --- */}

      {moosendConf.method && (

        <IntegrationStepThree
          step={step}
          saveConfig={() => saveConfig(flow, setFlow, allIntegURL, moosendConf, navigate, setSavePageLoad)}
          isLoading={loading.page}
          dataConf={moosendConf}
          setDataConf={setMoosendConf}
          formFields={formFields}
        />

      )}
    </div>
  )
}

export default Moosend
