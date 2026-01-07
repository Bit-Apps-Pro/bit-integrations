import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import EditWebhookInteg from '../EditWebhookInteg'
import { checkMappedFields, handleInput } from './WPCafeCommonFunc'
import WPCafeIntegLayout from './WPCafeIntegLayout'

export default function EditWPCafe({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()

  const [wpcafeConf, setWpcafeConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  useEffect(() => {
    if (!wpcafeConf?.wpcafeFields) {
      const { ReservationFields, ReservationIdField, UpdateReservationFields } = require('./staticData')

      setWpcafeConf(prevConf => {
        const newConf = { ...prevConf }

        switch (newConf.mainAction) {
          case 'create_reservation':
            newConf.wpcafeFields = ReservationFields
            break
          case 'update_reservation':
            newConf.wpcafeFields = UpdateReservationFields
            break
          case 'get_reservation':
            newConf.wpcafeFields = ReservationIdField
            break
          default:
            newConf.wpcafeFields = []
        }

        return newConf
      })
    }
  }, [])

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={e => handleInput(e, wpcafeConf, setWpcafeConf, formID)}
          name="name"
          value={wpcafeConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} />

      <WPCafeIntegLayout
        formID={formID}
        formFields={formFields}
        wpcafeConf={wpcafeConf}
        setWpcafeConf={setWpcafeConf}
        setSnackbar={setSnackbar}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />

      <br />
      <br />

      {flow.triggered_entity === 'webhook' && <EditWebhookInteg />}
      {flow.triggered_entity !== 'webhook' && <EditFormInteg allIntegURL={allIntegURL} />}
    </div>
  )
}

