/* eslint-disable no-param-reassign */

import { useEffect, useState } from 'react'
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
import { checkMappedFields, handleInput } from './MailerLiteCommonFunc'
import MailerLiteIntegLayout from './MailerLiteIntegLayout'
import { create } from 'mutative'

function EditMailerLite({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [mailerLiteConf, setMailerLiteConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({
    list: false,
    field: false,
    auth: false,
    group: false
  })
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(mailerLiteConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    saveActionConf({
      flow,
      allIntegURL,
      conf: mailerLiteConf,
      navigate,
      edit: 1,
      setLoading,
      setSnackbar
    })
  }

  useEffect(() => {
    if (!mailerLiteConf?.action) {
      setMailerLiteConf(prev =>
        create(prev, draftConf => {
          draftConf.action = 'add_subscriber'
        })
      )
    }
  }, [])

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={e => handleInput(e, mailerLiteConf, setMailerLiteConf, loading, setLoading)}
          name="name"
          value={mailerLiteConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <MailerLiteIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={e => handleInput(e, mailerLiteConf, setMailerLiteConf, loading, setLoading)}
        mailerLiteConf={mailerLiteConf}
        setMailerLiteConf={setMailerLiteConf}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={mailerLiteConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={mailerLiteConf}
        setDataConf={setMailerLiteConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditMailerLite
