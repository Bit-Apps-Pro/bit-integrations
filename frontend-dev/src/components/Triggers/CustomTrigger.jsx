/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { $btcbi, $flowStep, $formFields, $newFlow } from '../../GlobalStates'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import SnackMsg from '../Utilities/SnackMsg'
import WebhookDataTable from '../Utilities/WebhookDataTable'
import EyeIcn from '../Utilities/EyeIcn'
import EyeOffIcn from '../Utilities/EyeOffIcn'
import CopyTextTrigger from '../Utilities/CopyTextTrigger'
import Note from '../Utilities/Note'

const CustomTrigger = () => {
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const setFlowStep = useSetRecoilState($flowStep)
  const setFields = useSetRecoilState($formFields)
  const [hookID, setHookID] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const { api } = useRecoilValue($btcbi)
  const [showResponse, setShowResponse] = useState(false)
  const fetchIntervalRef = useRef(0)


  const triggerAbeleHook = `do_action(
    'bit_integrations_custom_trigger',
    '${hookID}',
     array()
     );`
  const setTriggerData = () => {
    const tmpNewFlow = { ...newFlow }
    tmpNewFlow.triggerData = {
      formID: hookID,
      fields: tmpNewFlow.triggerDetail.data,
    }
    tmpNewFlow.triggered_entity_id = hookID
    setFields(tmpNewFlow.triggerDetail.data)
    setNewFlow(tmpNewFlow)
    setFlowStep(2)
  }
  useEffect(() => {
    if (newFlow.triggerDetail?.data?.length > 0 && newFlow.triggerDetail?.hook_id) {
      setHookID(newFlow.triggerDetail?.hook_id)
      window.hook_id = newFlow.triggerDetail?.hook_id
    } else {
      bitsFetch({ hook_id: hookID }, 'custom_trigger/new', null, 'get').then(
        (resp) => {
          if (resp.success) {
            setHookID(resp.data.hook_id)
            window.hook_id = resp.data.hook_id
          }
        },
      )
    }
    return () => {
      bitsFetch({ hook_id: window.hook_id }, 'custom_trigger/test/remove').then(
        (resp) => {
          delete window.hook_id
        },
      )
      clearInterval(fetchIntervalRef.current)
    }
  }, [])


  const handleFetch = () => {
    setIsLoading(true)
    fetchIntervalRef.current = setInterval(() => {
      bitsFetch({ hook_id: hookID }, 'custom_trigger/test').then((resp) => {
        if (resp.success) {
          clearInterval(fetchIntervalRef.current)
          const tmpNewFlow = { ...newFlow }
          const data = resp.data.custom_trigger

          let convertedData = data && Object.entries(data).reduce(
            (outObj, item) => {
              const [name, obj] = item
              if (typeof obj === 'object' && obj !== null && obj !== undefined) {
                const objArr = Object.entries(obj)
                const inObj = objArr.reduce((out, [n, v]) => {
                  const propName = `${name}_${n}`

                  return { ...out, [propName]: v }
                }, {})
                return { ...outObj, ...inObj }
              }
              return data
            },
            {},
          )

          if (typeof resp.data.custom_trigger === 'object') {
            convertedData = Object.keys(convertedData).map(fld => (
              { name: fld, label: `${convertedData[fld]}-${fld}`, type: 'text' }
            ))
          }

          tmpNewFlow.triggerDetail.tmp = resp.data.custom_trigger
          tmpNewFlow.triggerDetail.data = convertedData
          tmpNewFlow.triggerDetail.hook_id = hookID
          setNewFlow(tmpNewFlow)
          setIsLoading(false)
          setShowResponse(true)
          bitsFetch(
            { hook_id: window.hook_id, reset: true },
            'custom_trigger/test/remove',
          )
        }
      })
    }, 1500)
  }

  const showResponseTable = () => {
    setShowResponse((prevState) => !prevState)
  }

  const info = `<h4>Setup Custom Trigger</h4>
            <a className="btcd-link" href="https://bitapps.pro/docs/bit-integrations/trigger/custom-trigger-integrations" target="_blank" rel="noreferrer">${__('Details on Documentation', 'bit-integrations')}</a>
            <ul>
                <li>Copy <b>do action hook</b> & past in your form submiting function</li>
                <li>Click on the <b>Fetch</b> button & Submit your <b>Form</b> to get the form data</li>
            </ul>
  `

  return (
    <div className="trigger-custom-width">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="mt-3">
        <b>{__('Custom action trigger:', 'bit-integrations')}</b>
      </div>
      <CopyTextTrigger
        value={triggerAbeleHook}
        className="flx mt-2"
        setSnackbar={setSnackbar}
        readOnly


      />
      <div className="flx flx-between">
        <button
          onClick={handleFetch}
          className="btn btcd-btn-lg green sh-sm flx"
          type="button"
          disabled={!hookID}
        >
          {newFlow.triggerDetail?.data
            ? __('Fetched ✔', 'bit-integrations')
            : __('Fetch', 'bit-integrations')}
          {isLoading && (
            <LoaderSm size="20" clr="#022217" className="ml-2" />
          )}
        </button>
        {newFlow.triggerDetail?.data && (
          <button
            onClick={showResponseTable}
            className="btn btcd-btn-lg sh-sm flx"
          >
            <span className="txt-webhook-resbtn font-inter-500">
              {showResponse ? 'Hide Response' : 'View Response'}
            </span>
            {!showResponse ? (
              <EyeIcn
                width="20"
                height="20"
                strokeColor="#000000"
              />
            ) : (
              <EyeOffIcn
                width="20"
                height="20"
                strokeColor="#000000"
              />
            )}
          </button>
        )}
      </div>
      {showResponse && newFlow?.triggerDetail?.data && (
        <WebhookDataTable
          data={newFlow?.triggerDetail?.data}
          flow={newFlow}
          setFlow={setNewFlow}
        />
      )}
      <button
        onClick={setTriggerData}
        className="btn btcd-btn-lg green sh-sm flx"
        type="button"
        disabled={!newFlow.triggerDetail?.data}
      >
        Set Action
      </button>
      <Note note={info} />
    </div>
  )
}
export default CustomTrigger
