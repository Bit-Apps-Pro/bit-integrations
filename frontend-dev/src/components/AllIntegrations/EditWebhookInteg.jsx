/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { $btcbi, $formFields, $newFlow } from '../../GlobalStates'
import bitsFetch from '../../Utils/bitsFetch'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import CopyText from '../Utilities/CopyText'

function EditWebhookInteg({ setSnackbar }) {
  const [flow, setFlow] = useRecoilState($newFlow)
  const setFormFields = useSetRecoilState($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const { api } = useRecoilValue($btcbi)
  const hookID = flow.triggered_entity_id

  const handleFetch = () => {
    setIsLoading(true)
    const fetchCheckTimer = setInterval(() => {
      bitsFetch({ hook_id: hookID }, 'webhook/test').then(resp => {
        if (resp.success) {
          clearInterval(fetchCheckTimer)
          let data = resp.data.webhook
          if (typeof resp.data.webhook === 'object') {
            data = Object.keys(resp.data.webhook).map(fld => ({ name: fld, label: `${resp.data.webhook[fld]}-${fld}`, type: 'text' }))
          }
          setFormFields(data)
          const newConf = deepCopy(flow)
          newConf.flow_details.fields = data

          setFlow(newConf)
          bitsFetch({ hook_id: hookID }, 'webhook/test/remove')
          setIsLoading(false)
        }
      })
    }, 1500)
  }
  return (
    <div className="flx mt-3">
      <b className="wdt-200 d-in-b">{__('Webhook URL:', 'bit-integrations')}</b>
      <div className="w-5">
        <CopyText value={`${api.base}/callback/${hookID}`} className="field-key-cpy w-10 ml-0" setSnackbar={setSnackbar} readOnly />
        <button onClick={handleFetch} className="btn btcd-btn-lg green sh-sm flx mt-1 ml-1" type="button">
          {flow.triggerDetail?.data ? __('Fetched ✔', 'bit-integrations') : __('Fetch', 'bit-integrations')}
          {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
        </button>
      </div>
    </div>
  )
}

export default EditWebhookInteg
