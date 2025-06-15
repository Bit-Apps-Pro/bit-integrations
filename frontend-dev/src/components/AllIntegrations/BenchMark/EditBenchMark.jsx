/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import SnackMsg from '../../Utilities/SnackMsg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import { handleInput } from './BenchMarkCommonFunc'
import BenchMarkIntegLayout from './BenchMarkIntegLayout'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import EditWebhookInteg from '../EditWebhookInteg'

function EditBenchMark({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [benchMarkConf, setBenchMarkConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, benchMarkConf, setBenchMarkConf)} name="name" value={benchMarkConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <BenchMarkIntegLayout
        formID={formID}
        formFields={formFields}
        benchMarkConf={benchMarkConf}
        setBenchMarkConf={setBenchMarkConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: benchMarkConf, edit: 1, setIsLoading, setSnackbar })}
        disabled={benchMarkConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={benchMarkConf}
        setDataConf={setBenchMarkConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditBenchMark
