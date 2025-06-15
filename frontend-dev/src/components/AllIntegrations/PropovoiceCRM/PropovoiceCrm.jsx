/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './PropovoiceCrmCommonFunc'
import BackIcn from '../../../Icons/BackIcn'
import PropovoiceCrmAuthorization from './PropovoiceCrmAuthorization'
import PropovoiceCrmIntegLayout from './PropovoiceCrmIntegLayout'

function PropovoiceCrm({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const leadFields = [
    { key: 'first_name', label: 'First Name', required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'mobile', label: 'Mobile', required: false },
    { key: 'org_name', label: 'Organization Name', required: false },
    { key: 'person_id', label: 'Person Id ', required: false },
    { key: 'org_id', label: 'Organization Id', required: false },
    { key: 'budget', label: 'Budget', required: false },
    { key: 'currency', label: 'Currency', required: false },
    { key: 'note', label: 'Note', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'region', label: 'State / Province / Region', required: false },
    { key: 'address', label: 'Address', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'zip', label: 'ZIP Code', required: false },
    { key: 'desc', label: 'Description', required: false },
    { key: 'img', label: 'Contact Image', required: false },
  ]

  const allActions = [
    { key: '1', label: 'Create lead' },
  ]

  const [propovoiceCrmConf, setPropovoiceCrmConf] = useState({
    name: 'Propovoice CRM',
    type: 'Propovoice CRM',
    mainAction: '',
    field_map: [{ formField: '', propovoiceCrmFormField: '' }],
    leadFields,
    allActions,
    actions: {},
  })
  const nextPage = (val) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    setStep(3)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <PropovoiceCrmAuthorization
        formID={formID}
        propovoiceCrmConf={propovoiceCrmConf}
        setPropovoiceCrmConf={setPropovoiceCrmConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}

      <div
        className="btcd-stp-page"
        style={{
          ...(step === 2 && {
            width: 900,
            height: 'auto',
            overflow: 'visible',
          }),
        }}
      >
        <PropovoiceCrmIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, propovoiceCrmConf, setPropovoiceCrmConf, setIsLoading, setSnackbar)}
          propovoiceCrmConf={propovoiceCrmConf}
          setPropovoiceCrmConf={setPropovoiceCrmConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!checkMappedFields(propovoiceCrmConf)}
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
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: propovoiceCrmConf, navigate, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={propovoiceCrmConf}
        setDataConf={setPropovoiceCrmConf}
        formFields={formFields}
      />
    </div>
  )
}

export default PropovoiceCrm
