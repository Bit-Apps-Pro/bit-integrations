import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import TrelloAuthorization from './TrelloAuthorization'
import { handleInput, setGrantTokenResponse, checkMappedFields } from './TrelloCommonFunc'
import TrelloIntegLayout from './TrelloIntegLayout'

function Trello({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const cardFields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'desc', label: 'Description', required: false },
    { key: 'due', label: 'Date', required: false },
  ]
  const [trelloConf, setTrelloConf] = useState({
    name: 'Trello',
    type: 'Trello',
    clientId: process.env.NODE_ENV === 'development' ? '' : '',
    listId: '',
    listName: '',
    tags: '',
    pos: '',
    field_map: [
      { formField: '', trelloFormField: '' },
    ],
    cardFields,
    address_field: [],
    actions: {},
  })

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    window.opener && setGrantTokenResponse('trello')
  }, [])
  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!checkMappedFields(trelloConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (trelloConf.listId !== '') {
      setstep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <TrelloAuthorization
        formID={formID}
        trelloConf={trelloConf}
        setTrelloConf={setTrelloConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <TrelloIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, trelloConf, setTrelloConf, setIsLoading, setSnackbar)}
          trelloConf={trelloConf}
          setTrelloConf={setTrelloConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={!trelloConf?.listId || !checkMappedFields(trelloConf)}
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
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: trelloConf, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={trelloConf}
        setDataConf={setTrelloConf}
        formFields={formFields}
      />

    </div>
  )
}

export default Trello
