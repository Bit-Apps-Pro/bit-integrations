import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { handleInput, saveUpdateConfig } from './NotionCommonFunc'
import NotionIntegLayout from './NotionIntegLayout'

function EditNotion({ allIntegURL }) {
  const navigate = useNavigate()
  const [snack, setSnackbar] = useState({ show: false })
  const flow = useRecoilValue($newFlow)
  const [notionConf, setNotionConf] = useRecoilState($actionConf)
  const [error, setError] = useState({ name: '', authKey: '' })
  const formFields = useRecoilValue($formFields)
  const [loading, setLoading] = useState({
    auth: false,
    list: false,
    page: false,
    field: false,
    update: false
  })

  const setUpdateLoading = (value) => {
    setLoading({ ...loading, update: value })
  }
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          name="name"
          onChange={(e) => handleInput(e, notionConf, setNotionConf, error, setError)}
          value={notionConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <div className="my-3">
        <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      </div>

      <NotionIntegLayout
        notionConf={notionConf}
        setNotionConf={setNotionConf}
        formFields={formFields}
        loading={loading}
        setLoading={setLoading}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => {
          saveUpdateConfig(flow, allIntegURL, notionConf, navigate, { edit: 1 }, setUpdateLoading)
        }}
        isLoading={loading.update}
        disabled={notionConf.field_map.length < 1}
        dataConf={notionConf}
        setDataConf={setNotionConf}
        formFields={formFields}
      />
    </div>
  )
}

export default EditNotion
