/* eslint-disable no-param-reassign */

import { create } from 'mutative'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { $formFields, $newFlow } from '../../GlobalStates'
import bitsFetch from '../../Utils/bitsFetch'
import { stopFetching } from '../../Utils/customFormHelper'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'

const shouldSkipPrimaryKey = flow =>
  flow?.flow_details?.multi_form &&
  flow?.flow_details?.multi_form?.some(
    ({ triggered_entity_id, skipPrimaryKey }) =>
      triggered_entity_id === flow?.triggered_entity_id && skipPrimaryKey
  )

function EditCustomFormSubmissionInteg({ setSnackbar }) {
  const [flow, setFlow] = useRecoilState($newFlow)
  const setFormFields = useSetRecoilState($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [skipPrimaryKey, setSkipPrimaryKey] = useState(shouldSkipPrimaryKey(flow) || false)
  const isFetchingRef = useRef(false)

  let controller = new AbortController()
  const signal = controller.signal
  const fetchAction = flow?.flow_details?.fetch?.action || ''
  const fetchMethod = flow?.flow_details?.fetch?.method || ''
  const removeAction = flow?.flow_details?.fetch_remove?.action || ''
  const removeMethod = flow?.flow_details?.fetch_remove?.method || ''

  const callStopFetching = () => {
    stopFetching(
      controller,
      flow.triggered_entity_id,
      isFetchingRef,
      removeAction,
      removeMethod,
      setIsLoading
    )
  }

  const handleFetch = async () => {
    if (isFetchingRef.current) {
      callStopFetching()
      return
    }

    isFetchingRef.current = true
    setIsLoading(true)
    fetchSequentially()
  }

  const fetchSequentially = () => {
    const entityId = flow.triggered_entity_id

    try {
      if (!isFetchingRef.current || !entityId) {
        callStopFetching()
        return
      }

      bitsFetch({ triggered_entity_id: entityId }, fetchAction, null, fetchMethod, signal).then(resp => {
        if (!resp.success && isFetchingRef.current) {
          fetchSequentially()

          return
        }

        if (resp.success) {
          const formData = Array.isArray(resp.data?.formData)
            ? resp.data?.formData
            : Object.values(resp.data?.formData)

          setFlow(prevFlow =>
            create(prevFlow, draftFlow => {
              draftFlow.flow_details.fields = formData
              draftFlow.flow_details.primaryKey = resp.data?.primaryKey
              draftFlow.flow_details['trigger_type'] =
                draftFlow.flow_details?.trigger_type || 'custom_form_submission'
            })
          )
          setFormFields(formData)
        }

        callStopFetching()
      })
    } catch (err) {
      console.log(
        err.name === 'AbortError' ? __('AbortError: Fetch request aborted', 'bit-integrations') : err
      )
    }
  }

  const primaryKeySet = key => {
    setFlow(prevFlow =>
      create(prevFlow, draftFlow => {
        const keys = key?.split(',') || []
        const primaryKey = keys.map(k => ({
          key: k,
          value: flow.flow_details.fields?.find(item => item.name === k)?.value
        }))

        const hasEmptyValues = primaryKey.some(item => !item.value)
        if (key && hasEmptyValues) {
          draftFlow.flow_details.primaryKey = null

          toast.error(__('Unique value not found!', 'bit-integrations'))
          return
        }

        draftFlow.flow_details.primaryKey = primaryKey
      })
    )
  }

  useEffect(() => {
    return () => {
      callStopFetching()
    }
  }, [])

  const setTriggerEntityId = entityId => {
    if (flow?.triggered_entity_id) {
      callStopFetching()
    }

    setFlow(prevFlow =>
      create(prevFlow, draftFlow => {
        draftFlow.triggered_entity_id = entityId
        draftFlow.flow_details['fields'] = []
        draftFlow.flow_details['primaryKey'] = undefined

        if (draftFlow.flow_details?.body?.data) {
          draftFlow.flow_details.body.data = []
        } else {
          draftFlow.flow_details.field_map = []
        }
      })
    )

    const multiForm = flow.flow_details?.multi_form
    const requiresPrimaryKey = multiForm?.some(
      ({ triggered_entity_id, skipPrimaryKey: isSkipPrimaryKey }) =>
        triggered_entity_id === entityId && isSkipPrimaryKey
    )

    setSkipPrimaryKey(requiresPrimaryKey)
    setFormFields([])
  }

  return (
    <div>
      {flow?.flow_details?.multi_form && flow?.flow_details?.multi_form?.length > 0 && (
        <div className="flx">
          <b className="wdt-200 d-in-b">{__('Select a Form/Task Name:', 'bit-integrations')}</b>
          <div className="w-5 flx flx-between">
            <MultiSelect
              className="msl-wrp-options"
              defaultValue={flow?.triggered_entity_id}
              options={flow.flow_details?.multi_form?.map(field => ({
                label: field?.form_name,
                value: field?.triggered_entity_id
              }))}
              onChange={val => setTriggerEntityId(val)}
              singleSelect
              style={{ width: '100%', minWidth: 400, maxWidth: 450 }}
            />
          </div>
        </div>
      )}
      {flow?.triggered_entity_id && (
        <div className="flx">
          <b className="wdt-200 d-in-b">
            {skipPrimaryKey
              ? __('Fetch Again:', 'bit-integrations')
              : __('Unique Key:', 'bit-integrations')}
          </b>
          <div className="w-5 flx flx-between">
            {!skipPrimaryKey && (
              <MultiSelect
                options={flow.flow_details.fields?.map(field => ({
                  label: field?.label,
                  value: field?.name
                }))}
                className="msl-wrp-options"
                defaultValue={
                  Array.isArray(flow?.flow_details?.primaryKey)
                    ? flow?.flow_details?.primaryKey.map(item => item.key).join(',')
                    : ''
                }
                onChange={primaryKeySet}
                disabled={isLoading}
                closeOnSelect
              />
            )}
            <button
              onClick={handleFetch}
              className={`btn btcd-btn-lg sh-sm flx ml-1 ${isLoading ? 'red' : 'purple'}`}
              type="button">
              {isLoading
                ? __('Stop', 'bit-integrations')
                : flow.flow_details.fields
                  ? __('Fetched ✔', 'bit-integrations')
                  : __('Fetch', 'bit-integrations')}
              {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditCustomFormSubmissionInteg
