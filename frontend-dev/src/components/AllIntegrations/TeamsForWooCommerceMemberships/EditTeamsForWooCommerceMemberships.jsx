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
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './TeamsForWooCommerceMembershipsCommonFunc'
import TeamsForWooCommerceMembershipsIntegLayout from './TeamsForWooCommerceMembershipsIntegLayout'

function EditTeamsForWooCommerceMemberships({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()

  const [teamsForWcConf, setTeamsForWcConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={e => handleInput(e, teamsForWcConf, setTeamsForWcConf)}
          name="name"
          value={teamsForWcConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} />

      <TeamsForWooCommerceMembershipsIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formFields}
        teamsForWcConf={teamsForWcConf}
        setTeamsForWcConf={setTeamsForWcConf}
        setSnackbar={setSnackbar}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />

      <IntegrationStepThree
        edit
        saveConfig={() =>
          saveActionConf({
            flow,
            setFlow,
            allIntegURL,
            navigate,
            conf: teamsForWcConf,
            edit: 1,
            setIsLoading,
            setSnackbar
          })
        }
        disabled={!checkMappedFields(teamsForWcConf)}
        isLoading={isLoading}
        dataConf={teamsForWcConf}
        setDataConf={setTeamsForWcConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditTeamsForWooCommerceMemberships
