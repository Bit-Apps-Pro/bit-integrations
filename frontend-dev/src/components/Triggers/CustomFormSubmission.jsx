/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
import { create, rawReturn } from 'mutative'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { $flowStep, $formFields, $newFlow } from '../../GlobalStates'
import CloseIcn from '../../Icons/CloseIcn'
import GetLogo from '../../Utils/GetLogo'
import { extractValueFromPath } from '../../Utils/Helpers'
import hooklist from '../../Utils/StaticData/hooklist'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import ConfirmModal from '../Utilities/ConfirmModal'
import EyeIcn from '../Utilities/EyeIcn'
import EyeOffIcn from '../Utilities/EyeOffIcn'
import SnackMsg from '../Utilities/SnackMsg'
import TreeViewer from '../Utilities/treeViewer/TreeViewer'
import Note from '../Utilities/Note'
import WebhookDataTable from '../Utilities/WebhookDataTable'

const CustomFormSubmission = () => {
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const setFlowStep = useSetRecoilState($flowStep)
  const setFields = useSetRecoilState($formFields)
  const [primaryKey, setPrimaryKey] = useState()
  const [primaryKeyModal, setPrimaryKeyModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [showResponse, setShowResponse] = useState(false)
  const intervalRef = useRef(null)
  const fetchAction = newFlow?.triggerDetail?.fetch?.action || ''
  const fetchMethod = newFlow?.triggerDetail?.fetch?.method || ''
  const removeAction = newFlow?.triggerDetail?.fetch_remove?.action || ''
  const removeMethod = newFlow?.triggerDetail?.fetch_remove?.method || ''

  const setTriggerData = () => {
    if (!primaryKey) {
      toast.error('Please Select a Primary Key')
      return
    }

    const tmpNewFlow = { ...newFlow }
    tmpNewFlow.triggerData = {
      primaryKey: primaryKey,
      trigger_type: newFlow?.triggerDetail?.type,
      fields: tmpNewFlow.triggerDetail.data,
      fetch: newFlow?.triggerDetail?.fetch,
      fetch_remove: newFlow?.triggerDetail?.fetch_remove
    }

    tmpNewFlow.triggered_entity_id = newFlow?.triggerDetail?.triggered_entity_id
    setFields(tmpNewFlow.triggerDetail.data)
    setNewFlow(tmpNewFlow)
    setFlowStep(2)
  }

  const handleFetch = () => {
    if (isLoading) {
      clearInterval(intervalRef.current)
      removeTestData()
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setShowResponse(false)
    setPrimaryKey(undefined)
    setNewFlow(prevFlow => create(prevFlow, draftFlow => {
      delete draftFlow.triggerDetail.data
    }))
    intervalRef.current = setInterval(() => {
      bitsFetch(null, fetchAction, null, fetchMethod).then((resp) => {
        if (resp.success) {
          clearInterval(intervalRef.current)
          setNewFlow(prevFlow => create(prevFlow, draftFlow => {
            draftFlow.triggerDetail.data = resp.data?.formData
          }))
          setPrimaryKey(resp.data?.primaryKey || undefined)
          setIsLoading(false)
          setShowResponse(true)
          bitsFetch({ reset: true }, removeAction, null, removeMethod)
        }
      })
    }, 1500)
  }

  const showResponseTable = () => {
    setShowResponse((prevState) => !prevState)
  }

  const primaryKeySet = (key) => {
    setPrimaryKey(prev => create(prev, draft => {
      const keys = key?.split(',') || []
      const primaryKey = keys.map(k => (
        {
          key: k,
          value: newFlow.triggerDetail?.data?.find(item => item.name === k)?.value
        }
      ))

      const hasEmptyValues = primaryKey.some(item => !item.value);
      if (key && hasEmptyValues) {
        toast.error('Unique value not found!')
        return rawReturn(null)
      }

      return rawReturn(primaryKey)
    }))
  }

  const removeTestData = () => {
    bitsFetch(null, removeAction, null, removeMethod).then(
      (resp) => {
        intervalRef.current && clearInterval(intervalRef.current)
      },
    )
  }

  useEffect(() => {
    return () => {
      setFields()
      removeTestData()
    }
  }, [])

  const info = `<h4>Setup ${newFlow?.triggerDetail?.name}</h4>
            <a className="btcd-link" href=${newFlow?.triggerDetail?.documentation_url} target="_blank" rel="noreferrer">${__('More Details on Documentation', 'bit-integrations')}</a>
            <ul>
                <li>Click on the <b>Fetch</b> button then Submit your <b>Form</b> to get the form data</li>
            </ul>`

  return (
    <div className="trigger-custom-width">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className={`flx mt-2 flx-${newFlow.triggerDetail?.data ? 'between' : 'around'}`}>
        <button
          onClick={handleFetch}
          className={`btn btcd-btn-lg sh-sm flx ${isLoading ? 'red' : 'green'}`}
          type="button"
        >
          {isLoading
            ? __('Stop', 'bit-integrations')
            : newFlow.triggerDetail?.data
              ? __('Fetched ✔', 'bit-integrations')
              : __('Fetch', 'bit-integrations')
          }
          {isLoading && (
            <LoaderSm size="20" clr="#022217" className="ml-2" />
          )}
        </button>
        {newFlow.triggerDetail?.data?.length > 0 &&
          <button
            onClick={() => setPrimaryKeyModal(true)}
            className={`btn btcd-btn-lg sh-sm flx ${newFlow.triggerDetail?.data?.length > 0 && 'green'}`}
            type="button"
            disabled={!newFlow.triggerDetail?.data?.length > 0}
          >
            {primaryKey
              ? __('Unique Key ✔', 'bit-integrations')
              : __('Unique Key', 'bit-integrations')}
          </button>
        }
      </div>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={primaryKeyModal}
        close={() => setPrimaryKeyModal(false)}
        action={() => setPrimaryKeyModal(false)}
        title={__('Unique Key', 'bit-integrations')}
        cssTransStyle={{ zIndex: 99999 }}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Unique Key', 'bit-integrations')}
        </div>
        <div className="flx flx-between mt-2">
          <MultiSelect
            options={newFlow.triggerDetail?.data?.map(field => ({ label: field?.label, value: field?.name }))}
            className="msl-wrp-options"
            defaultValue={Array.isArray(primaryKey) ? primaryKey.map(item => item.key).join(',') : ''}
            onChange={primaryKeySet}
            closeOnSelect
          />
        </div>
      </ConfirmModal>

      {
        newFlow.triggerDetail?.data && showResponse && (
          <WebhookDataTable
            data={newFlow?.triggerDetail?.data}
            flow={newFlow}
            setFlow={setNewFlow}
          />
        )
      }
      {
        newFlow.triggerDetail?.data &&
        <div className="flx flx-between">
          <button
            onClick={showResponseTable}
            className="btn btcd-btn-lg sh-sm flx"
          >
            <span className="txt-essentialBlocks-resbtn font-inter-500">
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
          <button
            onClick={setTriggerData}
            className="btn btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={!newFlow.triggerDetail.data.length || !primaryKey}
          >
            Set Action
          </button>
        </div>
      }
      <div className="flx flx-center">
        <Note note={info} />
      </div>
    </div >
  )
}
export default CustomFormSubmission