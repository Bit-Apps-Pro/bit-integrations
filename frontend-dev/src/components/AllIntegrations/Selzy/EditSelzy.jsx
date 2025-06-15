import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { handleInput, saveUpdateConfig } from './SelzyCommonFunc'
import SelzyIntegLayout from './SelzyIntegLayout'

function EditSelzy({ allIntegURL }) {
  const navigate = useNavigate()
  const [snack, setSnackbar] = useState({ show: false })
  const flow = useRecoilValue($newFlow)
  const [selzyConf, setSelzyConf] = useRecoilState($actionConf)
  const [error, setError] = useState({ name: '', authKey: '' })
  const formFields = useRecoilValue($formFields)
  const [loading, setLoading] = useState({
    auth: false,
    list: false,
    tag: false,
    page: false,
    update: false,
  })

  const setUpdateLoading = (value) => {
    setLoading({ ...loading, update: value })
  }
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" name="name" onChange={(e) => handleInput(e, selzyConf, setSelzyConf, error, setError)} value={selzyConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <div className="my-3">
        <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      </div>

      <SelzyIntegLayout
        selzyConf={selzyConf}
        setSelzyConf={setSelzyConf}
        formFields={formFields}
        loading={loading}
        setLoading={setLoading}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => { saveUpdateConfig(flow, allIntegURL, selzyConf, navigate, { edit: 1 }, setUpdateLoading) }}
        isLoading={loading.update}
        disabled={selzyConf.field_map.length < 1}
        dataConf={selzyConf}
        setDataConf={setSelzyConf}
        formFields={formFields}
      />

    </div>
  )
}

export default EditSelzy
