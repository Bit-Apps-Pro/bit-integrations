/* eslint-disable no-param-reassign */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import LineIntegLayout from './LineIntegLayout'
import { handleInput, validateLineConfiguration } from './LineCommonFunc'

function EditLine({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [lineConf, setLineConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  const [localName, setLocalName] = useState(lineConf.name || '')

  useEffect(() => {
    setLocalName(lineConf.name || '')
  }, [lineConf.name])

  const isNextButtonEnabled = () => {
    return validateLineConfiguration(lineConf)
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          name="name"
          type="text"
          value={localName}
          placeholder={__('Integration Name...', 'bit-integrations')}
          onChange={e => setLocalName(e.target.value)}
          onBlur={() => setLineConf(prev => ({ ...prev, name: localName }))}
        />
      </div>
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <LineIntegLayout
        formID={formID}
        formFields={formFields}
        lineConf={lineConf}
        setLineConf={setLineConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() =>
          saveActionConf({
            flow,
            allIntegURL,
            conf: lineConf,
            navigate,
            edit: 1,
            setIsLoading,
            setSnackbar
          })
        }
        disabled={!isNextButtonEnabled() || isLoading}
        isLoading={isLoading}
        dataConf={lineConf}
        setDataConf={setLineConf}
        formFields={formFields}
      />
    </div>
  )
}

export default EditLine
