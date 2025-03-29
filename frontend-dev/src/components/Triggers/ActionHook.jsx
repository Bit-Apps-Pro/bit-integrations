/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
import { create } from 'mutative'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { $flowStep, $formFields, $newFlow } from '../../GlobalStates'
import bitsFetch from '../../Utils/bitsFetch'
import CustomFetcherHelper, { resetActionHookFlowData } from '../../Utils/CustomFetcherHelper'
import GetLogo from '../../Utils/GetLogo'
import { extractValueFromPath } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import hooklist from '../../Utils/StaticData/hooklist'
import LoaderSm from '../Loaders/LoaderSm'
import ConfirmModal from '../Utilities/ConfirmModal'
import EyeIcn from '../Utilities/EyeIcn'
import EyeOffIcn from '../Utilities/EyeOffIcn'
import FieldContainer from '../Utilities/FieldContainer'
import Note from '../Utilities/Note'
import SnackMsg from '../Utilities/SnackMsg'
import TreeViewer from '../Utilities/treeViewer/TreeViewer'

const ActionHook = () => {
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const setFlowStep = useSetRecoilState($flowStep)
  const setFields = useSetRecoilState($formFields)
  const [hookID, setHookID] = useState('')
  const [selectedHook, setSelectedHook] = useState('custom')
  const [customHook, setCustomHook] = useState(true)
  const [primaryKey, setPrimaryKey] = useState()
  const [primaryKeyModal, setPrimaryKeyModal] = useState(false)
  const [selectedFields, setSelectedFields] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [showResponse, setShowResponse] = useState(false)
  const isFetchingRef = useRef(false)

  let controller = new AbortController()
  const signal = controller.signal
  const { stopFetching } = CustomFetcherHelper(
    isFetchingRef,
    hookID,
    controller,
    setIsLoading,
    'action_hook/test/remove',
    'POST',
    'hook_id'
  )

  const setTriggerData = () => {
    if (!selectedFields.length) {
      toast.error(__('Please Select Fields', 'bit-integrations'))
      return
    }
    if (!primaryKey) {
      toast.error(__('Please Select a Primary Key', 'bit-integrations'))
      return
    }

    const tmpNewFlow = { ...newFlow }
    tmpNewFlow.triggerData = {
      formID: hookID,
      primaryKey: primaryKey,
      trigger_type: newFlow?.triggerDetail?.type ?? 'action_hook',
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
      index = index ? index : selectedFields.findIndex(field => field.name === value)

      if (index !== -1) {
        removeSelectedField(index)
      }
      return
    }
    addSelectedField(value)
  }

  const addSelectedField = value => {
    setSelectedFields(prevFields =>
      create(prevFields, draftFields => {
        draftFields.push({ label: value, name: value })
      })
    )
  }

  const onUpdateField = (value, index, key) => {
    setSelectedFields(prevFields =>
      create(prevFields, draftFields => {
        draftFields[index][key] = value
      })
    )
  }

  const removeSelectedField = index => {
    setSelectedFields(prevFields =>
      create(prevFields, draftFields => {
        draftFields.splice(index, 1)
      })
    )
  }

  useEffect(() => {
    if (newFlow.triggerDetail?.data?.length > 0 && newFlow.triggerDetail?.hook_id !== '') {
      setHookID(newFlow.triggerDetail?.hook_id)
    }

    return () => {
      stopFetching()
    }
  }, [])

  const startFetching = () => {
    isFetchingRef.current = true
    setIsLoading(true)
    setShowResponse(false)
    setPrimaryKey(undefined)
    setSelectedFields([])
    resetActionHookFlowData(setNewFlow)
  }

  const handleFetch = () => {
    if (isFetchingRef.current) {
      stopFetching()
      return
    }

    startFetching()
    fetchSequentially()
  }

  const fetchSequentially = () => {
    try {
      if (!isFetchingRef.current || !hookID) {
        stopFetching()
        return
      }

      bitsFetch({ hook_id: hookID }, 'action_hook/test', null, 'POST', signal).then(resp => {
        if (!resp.success && isFetchingRef.current) {
          fetchSequentially()
          return
        }

        if (resp.success) {
          setNewFlow(prevFlow =>
            create(prevFlow, draftFlow => {
              draftFlow.triggerDetail['tmp'] = resp.data.actionHook
              draftFlow.triggerDetail['data'] = resp.data.actionHook
              draftFlow.triggerDetail['hook_id'] = hookID
            })
          )

          setPrimaryKey(undefined)
          setShowResponse(true)
        }

        stopFetching()
      })
    } catch (err) {
      console.log(
        err.name === 'AbortError' ? __('AbortError: Fetch request aborted', 'bit-integrations') : err
      )
    }
  }

  const primaryKeySet = val => {
    setPrimaryKey(
      !val
        ? undefined
        : {
            key: val,
            value: extractValueFromPath(newFlow.triggerDetail?.data, val)
          }
    )
  }

  const setHook = (val, name) => {
    const isCustom = name === 'custom'
    const isHook = name === 'hook'

    if (hookID) {
      stopFetching()
    }

    if (isCustom || (isHook && val === 'custom')) {
      setHookID(isCustom ? val : '')
      setCustomHook(isHook || isCustom)
    }

    if (isHook) {
      setSelectedHook(val)
      if (val !== 'custom') {
        setHookID(val)
        setCustomHook(false)
      }
    }

    if (isCustom || isHook) {
      setSelectedFields([])
      resetActionHookFlowData(setNewFlow)
    }
  }

  const info = `<h4>${sprintf(__('Follow these simple steps to set up the %s', 'bit-integrations'), 'Action Hook')}</h4>
            <ul>
              <li>${__('Click <b>Fetch</b>', 'bit-integrations')}</li>
              <li>${__('Submit <b>Integrable Form</b>', 'bit-integrations')}</li>
              <li>${__('Click <b>Next</b> and <b>Go</b></b>', 'bit-integrations')}</li>
            </ul>
            <p><b>${__('Important', 'bit-integrations')}:</b> ${__('Choose a consistent and unique identifier for each form entry, like a <b>Form ID</b> or <b>PostID</b>. If unavailable, create and hide a custom field to serve as the unique key.', 'bit-integrations')}</p>
            <h5>
              <a className="btcd-link" href="https://bitapps.pro/docs/bit-integrations/trigger-hooks" target="_blank" rel="noreferrer">${__('Bit Integrations Trigger Hooks', 'bit-integrations')}</a>
              <br />            
              ${__('More Details on', 'bit-integrations')} 
              <a className="btcd-link" href="https://bitapps.pro/docs/bit-integrations/trigger/action-hook-integrations" target="_blank" rel="noreferrer">${__('Documentation', 'bit-integrations')}</a>
              ${__('or', 'bit-integrations')}
              <a className="btcd-link" href="https://youtu.be/pZ-8JuZfIco?si=Xxv857hJjv6p5Tcu" target="_blank" rel="noreferrer">${__('Youtube Tutorials', 'bit-integrations')}</a>
            </h5>`

  return (
    <div className="trigger-custom-width">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="mt-3">
        <b>{__('Hook:', 'bit-integrations')}</b>
      </div>
      <div className="flx mt-2">
        <MultiSelect
          style={{ width: '100%' }}
          options={hooklist.map(hook => ({ label: hook.label, value: hook.value }))}
          className="msl-wrp-options"
          defaultValue={selectedHook}
          onChange={val => setHook(val, 'hook')}
          singleSelect
          closeOnSelect
          disabled={isLoading}
        />
      </div>
      {customHook && (
        <>
          <div className="mt-3">
            <b>{__('Custom Hook: (use add_action hook only)', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-100 mt-1"
            onChange={e => setHook(e.target.value?.trim(), 'custom')}
            name="custom"
            value={hookID}
            type="text"
            placeholder={__('Enter Hook...', 'bit-integrations')}
            disabled={isLoading}
          />
        </>
      )}
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
          className={`btn btcd-btn-lg sh-sm flx ${isLoading ? 'red' : newFlow.triggerDetail?.data ? 'gray' : 'purple'}`}
          type="button"
          disabled={!hookID}>
          {isLoading
            ? __('Stop', 'bit-integrations')
            : newFlow.triggerDetail?.data
              ? __('Fetched ✔', 'bit-integrations')
              : __('Fetch', 'bit-integrations')}
          {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
        </button>
        {selectedFields.length > 0 && (
          <button
            onClick={() => setPrimaryKeyModal(true)}
            className={`btn btcd-btn-lg sh-sm flx ${selectedFields.length && 'gray'}`}
            type="button"
            disabled={!selectedFields.length}>
            {primaryKey
              ? __('Unique Key ✔', 'bit-integrations')
              : __('Set Unique Key', 'bit-integrations')}
          </button>
        )}
      </div>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={primaryKeyModal}
        close={() => setPrimaryKeyModal(false)}
        action={() => setPrimaryKeyModal(false)}
        title={__('Unique Key', 'bit-integrations')}
        cssTransStyle={{ zIndex: 99999 }}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select Unique Key', 'bit-integrations')}</div>
        <div className="flx flx-between mt-2">
          <MultiSelect
            options={selectedFields.map(field => ({ label: field.label, value: field.name }))}
            className="msl-wrp-options"
            defaultValue={primaryKey?.key}
            onChange={primaryKeySet}
            singleSelect
            closeOnSelect
          />
        </div>
      </ConfirmModal>

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
          <button
            onClick={() => setShowResponse(prevState => !prevState)}
            className="btn btcd-btn-lg sh-sm gray flx">
            <span className="txt-actionHook-resbtn font-inter-500">
              {showResponse
                ? __('Hide Response', 'bit-integrations')
                : __('View Response', 'bit-integrations')}
            </span>
            &nbsp;
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
            disabled={!selectedFields.length || !primaryKey}>
            {__('Set Action', 'bit-integrations')}
          </button>
        </div>
      )}
      <Note note={info} />
    </div>
  )
}
export default ActionHook

const hookLabel = (logo, label) => (
  <div className="flx" style={{ alignItems: 'center' }}>
    <GetLogo name={logo} style={{ width: '25px' }} extension="webp" /> <span>&nbsp; {label}</span>
  </div>
)
