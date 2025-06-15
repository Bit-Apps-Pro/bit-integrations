/* eslint-disable no-param-reassign */

import { create } from 'mutative'
import { useEffect, useRef, useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { $formFields, $newFlow } from '../../GlobalStates'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import toast from 'react-hot-toast'

function EditCustomFormSubmissionInteg({ setSnackbar }) {
  const [flow, setFlow] = useRecoilState($newFlow)
  const setFormFields = useSetRecoilState($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const intervalRef = useRef(null)
  const fetchAction = flow?.flow_details?.fetch?.action || ''
  const fetchMethod = flow?.flow_details?.fetch?.method || ''
  const removeAction = flow?.flow_details?.fetch_remove?.action || ''
  const removeMethod = flow?.flow_details?.fetch_remove?.method || ''

  const handleFetch = () => {
    if (isLoading) {
      clearInterval(intervalRef.current)
      removeTestData()
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    intervalRef.current = setInterval(() => {
      bitsFetch(null, fetchAction, null, fetchMethod).then((resp) => {
        if (resp.success) {
          clearInterval(intervalRef.current)
          setFlow(prevFlow => create(prevFlow, draftFlow => {
            draftFlow.flow_details.fields = resp.data?.formData
            draftFlow.flow_details.primaryKey.key = resp.data?.primaryKey?.key
            draftFlow.flow_details.primaryKey.value = resp.data?.primaryKey?.value
          }))
          setFormFields(resp.data?.formData)
          setIsLoading(false)
          bitsFetch({ reset: true }, removeAction, null, removeMethod)
        }
      })
    }, 1500)
  }

  const primaryKeySet = (key) => {
    setFlow(prevFlow => create(prevFlow, draftFlow => {
      const keys = key?.split(',') || []
      const primaryKey = keys.map(k => (
        {
          key: k,
          value: flow.flow_details.fields?.find(item => item.name === k)?.value
        }
      ))

      const hasEmptyValues = primaryKey.some(item => !item.value);
      if (key && hasEmptyValues) {
        draftFlow.flow_details.primaryKey = null

        toast.error('Unique value not found!')
        return
      }

      draftFlow.flow_details.primaryKey = primaryKey
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
      removeTestData()
    }
  }, [])

  return (
    <div className="flx">
      <b className="wdt-200 d-in-b">{__('Unique Key:', 'bit-integrations')}</b>
      <div className="w-5 flx flx-between">
        <MultiSelect
          options={flow.flow_details.fields?.map(field => ({ label: field?.label, value: field?.name }))}
          className="msl-wrp-options"
          defaultValue={Array.isArray(flow?.flow_details?.primaryKey) ? flow?.flow_details?.primaryKey.map(item => item.key).join(',') : ''}
          onChange={primaryKeySet}
          disabled={isLoading}
          closeOnSelect
        />
        <button onClick={handleFetch} className={`btn btcd-btn-lg sh-sm flx ml-1 ${isLoading ? 'red' : 'green'}`} type="button">
          {isLoading
            ? __('Stop', 'bit-integrations')
            : (flow.flow_details.fields
              ? __('Fetched ✔', 'bit-integrations')
              : __('Fetch', 'bit-integrations'))
          }
          {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
        </button>
      </div>
    </div>
  )
}

export default EditCustomFormSubmissionInteg
