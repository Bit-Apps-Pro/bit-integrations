/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
import { create } from 'mutative'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { $btcbi, $flowStep, $formFields, $newFlow } from '../../GlobalStates'
import CloseIcn from '../../Icons/CloseIcn'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import CopyTextTrigger from '../Utilities/CopyTextTrigger'
import EyeIcn from '../Utilities/EyeIcn'
import EyeOffIcn from '../Utilities/EyeOffIcn'
import Note from '../Utilities/Note'
import SnackMsg from '../Utilities/SnackMsg'
import TreeViewer from '../Utilities/treeViewer/TreeViewer'
import FieldContainer from '../Utilities/FieldContainer'

const CustomTrigger = () => {
  const [selectedFields, setSelectedFields] = useState([])
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const setFlowStep = useSetRecoilState($flowStep)
  const setFields = useSetRecoilState($formFields)
  const [hookID, setHookID] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const { api } = useRecoilValue($btcbi)
  const [showResponse, setShowResponse] = useState(false)
  const fetchIntervalRef = useRef(0)
  let controller = new AbortController()
  const signal = controller.signal

  const triggerAbeleHook = `do_action(
    'bit_integrations_custom_trigger',
    '${hookID}',
     array()
     );`

  const setTriggerData = () => {
    if (!selectedFields.length) {
      toast.error(__('Please Select Fields', 'bit-integrations'))
      return
    }

    const tmpNewFlow = { ...newFlow }
    tmpNewFlow.triggerData = {
      formID: hookID,
      fields: selectedFields,
      rawData: newFlow.triggerDetail?.data
    }
    tmpNewFlow.triggered_entity_id = hookID
    setFields(selectedFields)
    setNewFlow(tmpNewFlow)
    setFlowStep(2)
  }

  const setSelectedFieldsData = (value = null, remove = false, index = null) => {
    if (remove) {
      index = index ? index : selectedFields.findIndex((field) => field.name === value)

      if (index !== -1) {
        removeSelectedField(index)
      }
      return
    }
    addSelectedField(value)
  }

  const addSelectedField = (value) => {
    setSelectedFields((prevFields) =>
      create(prevFields, (draftFields) => {
        draftFields.push({ label: value, name: value })
      })
    )
  }

  const onUpdateField = (value, index, key) => {
    setSelectedFields((prevFields) =>
      create(prevFields, (draftFields) => {
        draftFields[index][key] = value
      })
    )
  }

  const removeSelectedField = (index) => {
    setSelectedFields((prevFields) =>
      create(prevFields, (draftFields) => {
        draftFields.splice(index, 1)
      })
    )
  }

  useEffect(() => {
    if (newFlow.triggerDetail?.data?.length > 0 && newFlow.triggerDetail?.hook_id) {
      setHookID(newFlow.triggerDetail?.hook_id)
      window.hook_id = newFlow.triggerDetail?.hook_id
    } else {
      bitsFetch({ hook_id: hookID }, 'custom_trigger/new', null, 'get').then((resp) => {
        if (resp.success) {
          setHookID(resp.data.hook_id)
          window.hook_id = resp.data.hook_id
        }
      })
    }

    return () => {
      removeTestData(delete window.hook_id)
    }
  }, [])

  const removeTestData = (hookID) => {
    bitsFetch({ hook_id: hookID }, 'custom_trigger/test/remove').then((resp) => {
      delete window.hook_id
      fetchIntervalRef.current && clearInterval(fetchIntervalRef.current)
    })
  }

  const handleFetch = () => {
    if (isLoading) {
      fetchIntervalRef.current && clearInterval(fetchIntervalRef.current)
      controller.abort()
      removeTestData(hookID)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setShowResponse(false)
    setNewFlow((prevFlow) =>
      create(prevFlow, (draftFlow) => {
        delete draftFlow.triggerDetail?.tmp
        delete draftFlow.triggerDetail?.data
      })
    )
    fetchIntervalRef.current = setInterval(() => {
      bitsFetch({ hook_id: hookID }, 'custom_trigger/test', null, 'post', signal)
        .then((resp) => {
          if (resp.success) {
            controller.abort()
            clearInterval(fetchIntervalRef.current)
            const tmpNewFlow = { ...newFlow }
            tmpNewFlow.triggerDetail.tmp = resp.data.custom_trigger
            tmpNewFlow.triggerDetail.data = resp.data.custom_trigger
            tmpNewFlow.triggerDetail.hook_id = hookID
            setNewFlow(tmpNewFlow)
            setIsLoading(false)
            setShowResponse(true)
            setSelectedFields([])
            bitsFetch({ hook_id: window.hook_id, reset: true }, 'custom_trigger/test/remove')
          }
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            console.log(__('AbortError: Fetch request aborted', 'bit-integrations'))
          }
        })
    }, 1500)
  }

  const showResponseTable = () => {
    setShowResponse((prevState) => !prevState)
  }

  const info = `<h4>${sprintf(__('Follow these simple steps to set up the %s', 'bit-integrations'), 'Action Hook')}</h4>
            <ul>
            <li>${__('Copy <b>do action hook</b> & past in your form submiting function', 'bit-integrations')}</li>
              <li>${__('Click <b>Fetch</b>', 'bit-integrations')}</li>
              <li>${__('Submit <b>The Form</b>', 'bit-integrations')}</li>
              <li>${__('Click <b>Next</b> and <b>Go</b></b>', 'bit-integrations')}</li>
            </ul>
            <h5>
              <a className="btcd-link" href="https://bitapps.pro/docs/bit-integrations/trigger-hooks" target="_blank" rel="noreferrer">${__('Bit Integrations Trigger Hooks', 'bit-integrations')}</a>
              <br />            
              ${__('More Details on', 'bit-integrations')} 
              <a className="btcd-link" href="" target="_blank" rel="noreferrer">${__('Documentation', 'bit-integrations')}</a>
              ${__('or', 'bit-integrations')}
              <a className="btcd-link" href="#" target="_blank" rel="noreferrer" disabled>${__('Youtube Tutorials', 'bit-integrations')}</a>
            </h5>`

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

      {newFlow.triggerDetail?.data && (
        <>
          <div className="my-3">
            <b>{__('Selected Fields:', 'bit-integrations')}</b>
          </div>
          <FieldContainer
            data={selectedFields}
            onUpdateField={onUpdateField}
            onRemoveField={removeSelectedField}
          />
        </>
      )}

      <div className="flx flx-between">
        <button
          onClick={handleFetch}
          className={`btn btcd-btn-lg sh-sm flx ${isLoading ? 'red' : newFlow.triggerDetail?.data ? 'gray': 'purple'}`}
          type="button"
          disabled={!hookID}>
          {isLoading
            ? __('Stop', 'bit-integrations')
            : newFlow.triggerDetail?.data
              ? __('Fetched ✔', 'bit-integrations')
              : __('Fetch', 'bit-integrations')}
          {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
        </button>
      </div>

      {newFlow.triggerDetail?.data && showResponse && (
        <>
          <div className="mt-3">
            <b>{__('Select Fields:', 'bit-integrations')}</b>
          </div>
          <TreeViewer data={newFlow?.triggerDetail?.data} onChange={setSelectedFieldsData} />
        </>
      )}

      {newFlow.triggerDetail?.data && (
        <div className="flx flx-between">
          <button onClick={showResponseTable} className="btn btcd-btn-lg sh-sm flx gray">
            <span className="txt-actionHook-resbtn font-inter-500">
              {showResponse
                ? __('Hide Response', 'bit-integrations')
                : __('View Response', 'bit-integrations')}
            </span>
            {!showResponse ? (
              <EyeIcn width="20" height="20" strokeColor="#222" />
            ) : (
              <EyeOffIcn width="20" height="20" strokeColor="#222" />
            )}
          </button>
          <button
            onClick={setTriggerData}
            className="btn btcd-btn-lg purple sh-sm flx"
            type="button"
            disabled={!selectedFields.length}>
            {__('Set Action', 'bit-integrations')}
          </button>
        </div>
      )}
      <Note note={info} />
    </div>
  )
}
export default CustomTrigger
