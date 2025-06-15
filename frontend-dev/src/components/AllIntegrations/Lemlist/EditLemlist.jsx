/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import SnackMsg from '../../Utilities/SnackMsg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import { handleInput } from './LemlistCommonFunc'
import LemlistIntegLayout from './LemlistIntegLayout'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import EditWebhookInteg from '../EditWebhookInteg'

function EditLemlist({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [lemlistConf, setLemlistConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, lemlistConf, setLemlistConf)} name="name" value={lemlistConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <LemlistIntegLayout
        formID={formID}
        formFields={formFields}
        lemlistConf={lemlistConf}
        setLemlistConf={setLemlistConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: lemlistConf, edit: 1, setIsLoading, setSnackbar })}
        disabled={lemlistConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={lemlistConf}
        setDataConf={setLemlistConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditLemlist
