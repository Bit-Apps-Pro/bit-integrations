/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
import { create, rawReturn } from 'mutative'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { $flowStep, $formFields, $newFlow } from '../../GlobalStates'
import { TriggerDocLink } from '../../Utils/Helpers'
import bitsFetch from '../../Utils/bitsFetch'
import { startFetching, stopFetching } from '../../Utils/customFormHelper'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import ConfirmModal from '../Utilities/ConfirmModal'
import EyeIcn from '../Utilities/EyeIcn'
import EyeOffIcn from '../Utilities/EyeOffIcn'
import Note from '../Utilities/Note'
import SnackMsg from '../Utilities/SnackMsg'
import WebhookDataTable from '../Utilities/WebhookDataTable'

const CustomFormSubmission = () => {
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const setFlowStep = useSetRecoilState($flowStep)
  const setFormFields = useSetRecoilState($formFields)
  const [primaryKey, setPrimaryKey] = useState()
  const [skipPrimaryKey, setSkipPrimaryKey] = useState(false)
  const [primaryKeyModal, setPrimaryKeyModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [showResponse, setShowResponse] = useState(false)
  const isLoadingRef = useRef(false)

  let controller = new AbortController()
  const signal = controller.signal
  const fetchAction = newFlow?.triggerDetail?.fetch?.action || ''
  const fetchMethod = newFlow?.triggerDetail?.fetch?.method || ''
  const removeAction = newFlow?.triggerDetail?.fetch_remove?.action || ''
  const removeMethod = newFlow?.triggerDetail?.fetch_remove?.method || ''

  const setTriggerData = () => {
    if (!primaryKey && !skipPrimaryKey) {
      toast.error(__('Please Select a Primary Key', 'bit-integrations'))
      return
    }
    if (!newFlow?.triggerDetail?.triggered_entity_id) {
      toast.error(__('Triggered Entity Id not found!', 'bit-integrations'))
      return
    }

    const tmpNewFlow = { ...newFlow }
    tmpNewFlow.triggerData = {
      primaryKey: skipPrimaryKey ? false : primaryKey,
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

  const handleFetch = async () => {
    if (isLoadingRef.current) {
      stopFetching(
        controller,
        newFlow?.triggerDetail?.triggered_entity_id,
        isLoadingRef,
        removeAction,
        removeMethod,
        setIsLoading
      )

      return
    }

    startFetching(isLoadingRef, setShowResponse, setPrimaryKey, setNewFlow, setIsLoading)
    fetchSequentially()
  }

  const fetchSequentially = () => {
    const entityId = newFlow?.triggerDetail?.triggered_entity_id

    try {
      if (!isLoadingRef.current || !entityId) {
        stopFetching()
        return
      }

      bitsFetch({ triggered_entity_id: entityId }, fetchAction, null, fetchMethod, signal).then(resp => {
        if (!resp.success && isLoadingRef.current) {
          fetchSequentially()

          return
        }

        if (resp.success) {
          setNewFlow(prevFlow =>
            create(prevFlow, draftFlow => {
              draftFlow.triggerDetail.data = Array.isArray(resp.data?.formData)
                ? resp.data.formData
                : Object.values(resp.data?.formData)
            })
          )

          setPrimaryKey(resp.data?.primaryKey || undefined)
          setShowResponse(true)
        }

        stopFetching(controller, entityId, isLoadingRef, removeAction, removeMethod, setIsLoading)
      })
    } catch (err) {
      console.log(
        err.name === 'AbortError' ? __('AbortError: Fetch request aborted', 'bit-integrations') : err
      )
    }
  }

  const showResponseTable = () => {
    setShowResponse(prevState => !prevState)
  }

  const primaryKeySet = key => {
    setPrimaryKey(prev =>
      create(prev, draft => {
        if (key === '' || key === null) {
          return rawReturn(undefined)
        }

        const keys = key?.split(',') || []
        const primaryKey = keys.map(k => ({
          key: k,
          value: newFlow.triggerDetail?.data?.find(item => item.name === k)?.value
        }))

        const hasEmptyValues = primaryKey.some(item => !item.value)
        if (key && hasEmptyValues) {
          toast.error('Unique value not found!')
          return rawReturn(null)
        }

        return rawReturn(primaryKey)
      })
    )
  }

  useEffect(() => {
    return () => {
      stopFetching(
        controller,
        newFlow.triggerDetail.triggered_entity_id,
        isLoadingRef,
        removeAction,
        removeMethod,
        setIsLoading
      )
    }
  }, [])

  const setTriggerEntityId = entityId => {
    if (isLoading || isLoadingRef.current) {
      stopFetching(
        controller,
        newFlow.triggerDetail.triggered_entity_id,
        isLoadingRef,
        removeAction,
        removeMethod,
        setIsLoading
      )
      return
    }

    setNewFlow(prevFlow =>
      create(prevFlow, draftFlow => {
        draftFlow.triggerDetail.triggered_entity_id = entityId
        delete draftFlow.triggerDetail.data
      })
    )

    const multiForm = newFlow?.triggerDetail?.multi_form
    const requiresPrimaryKey = multiForm?.some(
      ({ triggered_entity_id, skipPrimaryKey: isSkipPrimaryKey }) =>
        triggered_entity_id === entityId && isSkipPrimaryKey
    )

    setSkipPrimaryKey(requiresPrimaryKey)
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
            options={newFlow.triggerDetail?.multi_form?.map(field => ({
              label: field?.form_name,
              value: field?.triggered_entity_id
            }))}
            style={{ width: '100%', minWidth: 400, maxWidth: 450 }}
            onChange={val => setTriggerEntityId(val)}
            singleSelect
            selectOnClose
          />
        </div>
      )}
      {newFlow?.triggerDetail?.triggered_entity_id && (
        <>
          <SnackMsg snack={snack} setSnackbar={setSnackbar} />
          <div
            className={`flx mt-2 flx-${newFlow.triggerDetail?.data && !skipPrimaryKey ? 'between' : 'around'}`}>
            <button
              onClick={handleFetch}
              className={`btn btcd-btn-lg sh-sm flx ${isLoading ? 'red' : newFlow.triggerDetail?.data ? 'gray' : 'purple'}`}
              type="button">
              {isLoading
                ? __('Waiting for form submission...', 'bit-integrations')
                : newFlow.triggerDetail?.data
                  ? __('Fetched ✔', 'bit-integrations')
                  : __('Fetch', 'bit-integrations')}
              {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
            </button>
            {newFlow.triggerDetail?.data?.length > 0 && !skipPrimaryKey && (
              <button
                onClick={() => setPrimaryKeyModal(true)}
                className={`btn btcd-btn-lg sh-sm flx ${newFlow.triggerDetail?.data?.length > 0 && 'gray'}`}
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
                options={newFlow.triggerDetail?.data?.map(field => ({
                  label: field?.label,
                  value: field?.name
                }))}
                className="msl-wrp-options"
                defaultValue={
                  Array.isArray(primaryKey) ? primaryKey.map(item => item.key).join(',') : ''
                }
                onChange={primaryKeySet}
                closeOnSelect
              />
            </div>
          </ConfirmModal>

          {newFlow.triggerDetail?.data && showResponse && (
            <WebhookDataTable data={newFlow?.triggerDetail?.data} flow={newFlow} setFlow={setNewFlow} />
          )}
          {newFlow.triggerDetail?.data && (
            <div className="flx flx-between">
              <button onClick={showResponseTable} className="btn btcd-btn-lg sh-sm gray flx">
                <span className="txt-essentialBlocks-resbtn font-inter-500">
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
                disabled={!newFlow.triggerDetail.data.length || (!primaryKey && !skipPrimaryKey)}>
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
