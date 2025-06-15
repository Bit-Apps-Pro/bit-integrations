import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import FluentSupportAuthorization from './FluentSupportAuthorization'
import { handleInput, checkMappedFields } from './FluentSupportCommonFunc'
import FluentSupportIntegLayout from './FluentSupportIntegLayout'

function FluentSupport({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const fluentSupportFields = [
    { key: 'title', label: 'Title', required: true },
    { key: 'content', label: 'Content', required: true },
    { key: 'first_name', label: 'First Name', required: true },
    { key: 'last_name', label: 'Last Name', required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'city', label: 'City', required: false },
    { key: 'zip', label: 'Zip', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'note', label: 'Note', required: false },
    { key: 'description', label: 'Description', required: false },
  ]
  const [fluentSupportConf, setFluentSupportConf] = useState({
    name: 'Fluent Support',
    type: 'Fluent Support',
    field_map: [
      { formField: '', fluentSupportFormField: '' },
    ],
    fluentSupportFields,
    address_field: [],
    actions: {},
  })
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (!checkMappedFields(fluentSupportConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (!fluentSupportConf.actions.support_staff) {
      setSnackbar({ show: true, msg: 'Support Staff is required!' })
      return
    }
    if (fluentSupportConf.listId !== '') {
      setstep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <FluentSupportAuthorization
        formID={formID}
        fluentSupportConf={fluentSupportConf}
        setFluentSupportConf={setFluentSupportConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <FluentSupportIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, fluentSupportConf, setFluentSupportConf, formID, setIsLoading, setSnackbar)}
          fluentSupportConf={fluentSupportConf}
          setFluentSupportConf={setFluentSupportConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={isLoading || fluentSupportConf.field_map.length < 1 || !checkMappedFields(fluentSupportConf)}
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
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: fluentSupportConf, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={fluentSupportConf}
        setDataConf={setFluentSupportConf}
        formFields={formFields}
      />

    </div>
  )
}

export default FluentSupport
