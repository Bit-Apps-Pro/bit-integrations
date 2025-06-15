/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import EditWebhookInteg from '../EditWebhookInteg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './ZohoRecruitCommonFunc'
import ZohoRecruitIntegLayout from './ZohoRecruitIntegLayout'

function EditZohoRecruit({ allIntegURL }) {
  const navigate = useNavigate()
  const { id, formID } = useParams()
  const [recruitConf, setRecruitConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [tab, settab] = useState(0)
  const formFields = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(recruitConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    saveActionConf({
      flow,
      setFlow,
      allIntegURL,
      conf: recruitConf,
      navigate,
      edit: 1,
      setIsLoading,
      setSnackbar
    })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(event) => handleInput(event, tab, recruitConf, setRecruitConf)}
          name="name"
          value={recruitConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <ZohoRecruitIntegLayout
        tab={tab}
        settab={settab}
        formID={formID}
        formFields={formFields}
        handleInput={(e) =>
          handleInput(e, tab, recruitConf, setRecruitConf, formID, setIsLoading, setSnackbar)
        }
        recruitConf={recruitConf}
        setRecruitConf={setRecruitConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={recruitConf.module === '' || recruitConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={recruitConf}
        setDataConf={setRecruitConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditZohoRecruit
