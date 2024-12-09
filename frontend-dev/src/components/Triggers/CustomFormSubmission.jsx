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
import { extractValueFromPath, isLinkEmpty, TriggerDocLink } from '../../Utils/Helpers'
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
  const setFormFields = useSetRecoilState($formFields)
  const [primaryKey, setPrimaryKey] = useState()
  const [primaryKeyModal, setPrimaryKeyModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [showResponse, setShowResponse] = useState(false)
  const intervalRef = useRef(null)
  let controller = new AbortController()
  const signal = controller.signal
  const fetchAction = newFlow?.triggerDetail?.fetch?.action || ''
  const fetchMethod = newFlow?.triggerDetail?.fetch?.method || ''
  const removeAction = newFlow?.triggerDetail?.fetch_remove?.action || ''
  const removeMethod = newFlow?.triggerDetail?.fetch_remove?.method || ''

  const setTriggerData = () => {
    if (!primaryKey) {
      toast.error(__('Please Select a Primary Key', 'bit-integrations'))
      return
    }
    if (!newFlow?.triggerDetail?.triggered_entity_id) {
      toast.error(__('Triggered Entity Id not found!', 'bit-integrations'))
      return
    }

    const tmpNewFlow = { ...newFlow }
    tmpNewFlow.triggerData = {
      primaryKey: primaryKey,
      trigger_type: newFlow?.triggerDetail?.type || 'custom_form_submission',
      fields: tmpNewFlow.triggerDetail.data,
      fetch: newFlow?.triggerDetail?.fetch,
      fetch_remove: newFlow?.triggerDetail?.fetch_remove,
      multi_form: newFlow.triggerDetail?.multi_form
    }

    tmpNewFlow.triggered_entity_id = newFlow?.triggerDetail?.triggered_entity_id
    setFormFields(tmpNewFlow.triggerDetail.data)
    setNewFlow(tmpNewFlow)
    setFlowStep(2)
  }

  const handleFetch = () => {
    if (isLoading) {
      clearInterval(intervalRef.current)
      controller.abort()
      removeTestData()
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setShowResponse(false)
    setPrimaryKey(undefined)
    setNewFlow((prevFlow) =>
      create(prevFlow, (draftFlow) => {
        delete draftFlow.triggerDetail.data
      })
    )
    intervalRef.current = setInterval(() => {
      bitsFetch({ triggered_entity_id: newFlow.triggerDetail.triggered_entity_id }, fetchAction, null, fetchMethod, signal)
        .then((resp) => {
          if (resp.success) {
            clearInterval(intervalRef.current)
            controller.abort()
            setNewFlow((prevFlow) =>
              create(prevFlow, (draftFlow) => {
                draftFlow.triggerDetail.data = Array.isArray(resp.data?.formData) ? resp.data?.formData : Object.values(resp.data?.formData)
              })
            )
            setPrimaryKey(resp.data?.primaryKey || undefined)
            setIsLoading(false)
            setShowResponse(true)
            bitsFetch({ triggered_entity_id: newFlow.triggerDetail.triggered_entity_id }, removeAction, null, removeMethod)
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

  const primaryKeySet = (key) => {
    setPrimaryKey((prev) =>
      create(prev, (draft) => {
        const keys = key?.split(',') || []
        const primaryKey = keys.map((k) => ({
          key: k,
          value: newFlow.triggerDetail?.data?.find((item) => item.name === k)?.value
        }))

        const hasEmptyValues = primaryKey.some((item) => !item.value)
        if (key && hasEmptyValues) {
          toast.error('Unique value not found!')
          return rawReturn(null)
        }

        return rawReturn(primaryKey)
      })
    )
  }

  const removeTestData = () => {
    bitsFetch({ triggered_entity_id: newFlow.triggerDetail.triggered_entity_id }, removeAction, null, removeMethod).then((resp) => {
      intervalRef.current && clearInterval(intervalRef.current)
    })
  }

  useEffect(() => {
    return () => {
      intervalRef.current && clearInterval(intervalRef.current)
      controller.abort()
      removeTestData()
    }
  }, [])

  const setTriggerEntityId = (val) => {
    if (isLoading) {
      clearInterval(intervalRef.current)
      controller.abort()
      removeTestData()
      setIsLoading(false)
      return
    }

    setNewFlow((prevFlow) =>
      create(prevFlow, (draftFlow) => {
        draftFlow.triggerDetail.triggered_entity_id = val
      })
    )
  }

  const info = `<h4>${sprintf(__('Follow these simple steps to set up the %s', 'bit-integrations'), newFlow?.triggerDetail?.name)}</h4>
            <ul>
              <li>${__('Click the <b>Fetch</b> button.', 'bit-integrations')}</li>
              <li>${__('Submit <b>The Form</b> while the Fetch button is <b>spinning</b>.', 'bit-integrations')}</li>
              <li>${__('After submitting the form, Click <b>Next</b> and then <b>Go</b></b>', 'bit-integrations')}</li>
            </ul>
            <p><b>${__('Important', 'bit-integrations')}:</b> ${__('The Fetch button will keep spinning until you submit the form.', 'bit-integrations')}</p>
            <p><b>${__('Important', 'bit-integrations')}:</b> ${__('Choose a consistent unique identifier like <b>Form ID</b> (default) or <b>Post ID</b> for each form entry, or create a hidden custom field if unavailable.', 'bit-integrations')}</p>
            ${newFlow?.triggerDetail?.note ? `<h4 className="mt-0">Note</h4>${newFlow?.triggerDetail?.note}` : ''}
            ${TriggerDocLink(newFlow?.triggerDetail?.documentation_url, newFlow?.triggerDetail?.tutorial_url)}`

  return !newFlow?.triggerDetail?.is_active ? (
    <span className="mt-3">
      {sprintf(
        __('%s is not installed or activated.', 'bit-integrations'),
        newFlow?.triggerDetail?.name
      )}
    </span>
  ) : (
    <div className="trigger-custom-width">
      {newFlow?.triggerDetail?.multi_form && newFlow?.triggerDetail?.multi_form.length > 0 && (
        <div className="w-8 m-a">
          <h4>{__('Select a Form/Task Name', 'bit-integrations')}</h4>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={newFlow?.triggerDetail?.triggered_entity_id}
            options={newFlow.triggerDetail?.multi_form?.map((field) => ({
              label: field?.form_name,
              value: field?.triggered_entity_id
            }))}
            style={{ width: '100%', minWidth: 400, maxWidth: 450 }}
            onChange={(val) => setTriggerEntityId(val)}
            singleSelect
            selectOnClose
          />
        </div>
      )}
      {newFlow?.triggerDetail?.triggered_entity_id && (
        <>
          <SnackMsg snack={snack} setSnackbar={setSnackbar} />
          <div className={`flx mt-2 flx-${newFlow.triggerDetail?.data ? 'between' : 'around'}`}>
            <button
              onClick={handleFetch}
              className={`btn btcd-btn-lg sh-sm flx ${isLoading ? 'red' : 'purple'}`}
              type="button">
              {isLoading
                ? __('Waiting for form submission...', 'bit-integrations')
                : newFlow.triggerDetail?.data
                  ? __('Fetched ✔', 'bit-integrations')
                  : __('Fetch', 'bit-integrations')}
              {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
            </button>
            {newFlow.triggerDetail?.data?.length > 0 && (
              <button
                onClick={() => setPrimaryKeyModal(true)}
                className={`btn btcd-btn-lg sh-sm flx ${newFlow.triggerDetail?.data?.length > 0 && 'purple'}`}
                type="button"
                disabled={!newFlow.triggerDetail?.data?.length > 0}>
                {primaryKey
                  ? __('Unique Key ✔', 'bit-integrations')
                  : __('Unique Key', 'bit-integrations')}
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
                options={newFlow.triggerDetail?.data?.map((field) => ({
                  label: field?.label,
                  value: field?.name
                }))}
                className="msl-wrp-options"
                defaultValue={
                  Array.isArray(primaryKey) ? primaryKey.map((item) => item.key).join(',') : ''
                }
                onChange={primaryKeySet}
                closeOnSelect
              />
            </div>
          </ConfirmModal>

          {newFlow.triggerDetail?.data && showResponse && (
            <WebhookDataTable
              data={newFlow?.triggerDetail?.data}
              flow={newFlow}
              setFlow={setNewFlow}
            />
          )}
          {newFlow.triggerDetail?.data && (
            <div className="flx flx-between">
              <button onClick={showResponseTable} className="btn btcd-btn-lg sh-sm purple flx">
                <span className="txt-essentialBlocks-resbtn font-inter-500">
                  {showResponse
                    ? __('Hide Response', 'bit-integrations')
                    : __('View Response', 'bit-integrations')}
                </span>
                &nbsp;
                {!showResponse ? (
                  <EyeIcn width="20" height="20" strokeColor="#fff" />
                ) : (
                  <EyeOffIcn width="20" height="20" strokeColor="#fff" />
                )}
              </button>
              <button
                onClick={setTriggerData}
                className="btn btcd-btn-lg purple sh-sm flx"
                type="button"
                disabled={!newFlow.triggerDetail.data.length || !primaryKey}>
                {__('Set Action', 'bit-integrations')}
              </button>
            </div>
          )}
        </>
      )}
      <div className="flx flx-center">
        <Note note={info} isInstruction={true} />
      </div>
    </div>
  )
}
export default CustomFormSubmission
