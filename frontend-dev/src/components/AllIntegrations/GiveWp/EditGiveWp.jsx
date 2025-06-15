/* eslint-disable no-param-reassign */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import EditWebhookInteg from '../EditWebhookInteg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput } from './GiveWpCommonFunc'
import GiveWpIntegLayout from './GiveWpIntegLayout'

function EditGiveWp({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [giveWpConf, setGiveWpConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, giveWpConf, setGiveWpConf)} name="name" value={giveWpConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <GiveWpIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, giveWpConf, setGiveWpConf, setIsLoading, setSnackbar)}
        giveWpConf={giveWpConf}
        setGiveWpConf={setGiveWpConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveActionConf({ flow, allIntegURL, conf: giveWpConf, navigate, edit: 1, setIsLoading, setSnackbar })}
        disabled={!giveWpConf.mainAction || isLoading}
        isLoading={isLoading}
        dataConf={giveWpConf}
        setDataConf={setGiveWpConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditGiveWp
