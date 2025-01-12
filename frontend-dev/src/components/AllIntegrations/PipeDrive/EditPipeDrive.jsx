/* eslint-disable max-len */
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
import { checkMappedFields, checkRequired, handleInput } from './PipeDriveCommonFunc'
import PipeDriveIntegLayout from './PipeDriveIntegLayout'
import { create } from 'mutative'

function EditPipeDrive({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [pipeDriveConf, setPipeDriveConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [tab, settab] = useState(0)
  const formFields = useRecoilValue($formFields)
  const [name, setName] = useState(pipeDriveConf?.name || '')

  const saveConfig = () => {
    if (!checkMappedFields(pipeDriveConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    if (!checkRequired(pipeDriveConf)) {
      if (['Leads', 'Deals', 'Activities', 'Notes'].includes(pipeDriveConf.moduleData.module)) {
        setSnackbar({
          show: true,
          msg: __('Please select a organization or a person', 'bit-integrations')
        })
      }

      return
    }

    saveActionConf({
      flow,
      setFlow,
      allIntegURL,
      conf: pipeDriveConf,
      navigate,
      id,
      edit: 1,
      setIsLoading,
      setSnackbar
    })
  }

  const handleEditIntegName = (e) => {
    setName(e.target.value)
    setPipeDriveConf((prevConf) =>
      create(prevConf, (draftConF) => {
        draftConF.name = e.target.value
      })
    )
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 ">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={handleEditIntegName}
          name="name"
          value={name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <PipeDriveIntegLayout
        tab={tab}
        settab={settab}
        formID={flow.triggered_entity_id}
        formFields={formFields}
        handleInput={(e) =>
          handleInput(e, tab, pipeDriveConf, setPipeDriveConf, setIsLoading, setSnackbar)
        }
        pipeDriveConf={pipeDriveConf}
        setPipeDriveConf={setPipeDriveConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={pipeDriveConf.moduleData.module === '' || pipeDriveConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={pipeDriveConf}
        setDataConf={setPipeDriveConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditPipeDrive
