/* eslint-disable no-param-reassign */

import { create } from 'mutative'
import { useEffect, useRef, useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../GlobalStates'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import toast from 'react-hot-toast'
import { deepCopy, extractValueFromPath } from '../../Utils/Helpers'
import CloseIcn from '../../Icons/CloseIcn'
import EyeIcn from '../Utilities/EyeIcn'
import EyeOffIcn from '../Utilities/EyeOffIcn'
import TreeViewer from '../Utilities/treeViewer/TreeViewer'

function EditActionHook() {
  const [actionConf, setActionConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const setFormFields = useSetRecoilState($formFields)
  const [showResponse, setShowResponse] = useState(false)
  const [showSelectedFields, setShowSelectedFields] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const intervalRef = useRef(null)
  let controller = new AbortController()
  const signal = controller.signal

  const handleFetch = () => {
    if (isLoading) {
      clearInterval(intervalRef.current)
      removeTestData(flow?.triggered_entity_id)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    intervalRef.current = setInterval(() => {
      bitsFetch({ hook_id: flow?.triggered_entity_id }, 'action_hook/test', null, 'POST', signal)
        .then((resp) => {
          if (resp.success) {
            clearInterval(intervalRef.current)
            controller.abort()
            setFlow((prevFlow) =>
              create(prevFlow, (draftFlow) => {
                draftFlow.flow_details['rawData'] = resp.data.actionHook
                draftFlow.flow_details['fields'] = []
                draftFlow.flow_details['primaryKey'] = undefined

                if (draftFlow.flow_details?.body?.data) {
                  draftFlow.flow_details.body.data = []
                } else {
                  draftFlow.flow_details.field_map = []
                }
              })
            )
            setActionConf((prevConf) =>
              create(prevConf, (draftConf) => {
                draftConf['rawData'] = resp.data.actionHook
                draftConf['fields'] = []
                draftConf['primaryKey'] = undefined

                if (draftConf?.body?.data) {
                  draftConf.body.data = []
                } else {
                  draftConf.field_map = []
                }
              })
            )
            setFormFields([])
            setIsLoading(false)
            setShowResponse(true)
            setShowSelectedFields(true)
            removeTestData(flow?.triggered_entity_id, true)
          }
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            console.log('AbortError: Fetch request aborted')
          }
        })
    }, 1500)
  }

  const removeTestData = (hookID, reset = false) => {
    bitsFetch({ hook_id: hookID, reset: reset }, 'action_hook/test/remove').then((resp) => {
      intervalRef.current && clearInterval(intervalRef.current)
    })
  }

  const primaryKeySet = (val) => {
    setFlow((prevFlow) =>
      create(prevFlow, (draftFlow) => {
        draftFlow.flow_details['primaryKey'] = !val
          ? undefined
          : { key: val, value: extractValueFromPath(flow.flow_details?.rawData, val) }
      })
    )
    setActionConf((prevConf) =>
      create(prevConf, (draftConf) => {
        draftConf['primaryKey'] = !val
          ? undefined
          : { key: val, value: extractValueFromPath(flow.flow_details?.rawData, val) }
      })
    )
  }

  const setSelectedFieldsData = (value = null, remove = false, index = null) => {
    if (remove) {
      index = index ? index : flow.flow_details.fields.findIndex((field) => field.name === value)
      if (index !== -1) {
        removeSelectedField(index)
      }
      return
    }
    addSelectedField(value)
  }

  const addSelectedField = (value) => {
    setFlow((prevFlow) =>
      create(prevFlow, (draftFlow) => {
        if (draftFlow.flow_details.fields.findIndex((field) => field.name === value) === -1) {
          draftFlow.flow_details['fields'].push({ label: value, name: value })
        }
      })
    )
    setActionConf((prevConf) =>
      create(prevConf, (draftConf) => {
        if (draftConf.fields.findIndex((field) => field.name === value) === -1) {
          draftConf['fields'].push({ label: value, name: value })
        }
      })
    )
    setFormFields((prevFields) =>
      create(prevFields, (draftFields) => {
        if (draftFields.findIndex((field) => field.name === value) === -1) {
          draftFields.push({ label: value, name: value })
        }
      })
    )
  }

  const removeSelectedField = (index) => {
    setFormFields((prevFields) =>
      create(prevFields, (draftFields) => {
        index = draftFields.findIndex(
          (field) => field.name === flow.flow_details.fields[index].name
        )
        draftFields.splice(index, 1)
      })
    )
    setFlow((prevFlow) =>
      create(prevFlow, (draftFlow) => {
        draftFlow.flow_details.fields.splice(index, 1)
      })
    )
    setActionConf((prevConf) =>
      create(prevConf, (draftConf) => {
        draftConf.fields.splice(index, 1)
      })
    )
  }

  const setHook = (val) => {
    if (flow?.triggered_entity_id) {
      removeTestData(flow?.triggered_entity_id)
    }

    setFlow((prevFlow) =>
      create(prevFlow, (draftFlow) => {
        draftFlow.triggered_entity_id = val
        draftFlow.flow_details['rawData'] = []
        draftFlow.flow_details['fields'] = []
        draftFlow.flow_details['primaryKey'] = undefined

        if (draftFlow.flow_details?.body?.data) {
          draftFlow.flow_details.body.data = []
        } else {
          draftFlow.flow_details.field_map = []
        }
      })
    )
    setActionConf((prevConf) =>
      create(prevConf, (draftConf) => {
        draftConf['rawData'] = []
        draftConf['fields'] = []
        draftConf['primaryKey'] = undefined

        if (draftConf?.body?.data) {
          draftConf.body.data = []
        } else {
          draftConf.field_map = []
        }
      })
    )
    setFormFields([])
    setShowResponse(false)
    setShowSelectedFields(false)
  }

  return (
    <div className="trigger-custom-width">
      <div className="flx flx-between">
        <div className="wdt-100 d-in-b">
          <b>{__('Hook:', 'bit-integrations')}</b>
        </div>
        <input
          className="btcd-paper-inp mt-1"
          onChange={(e) => setHook(e.target.value)}
          name="custom"
          value={flow?.triggered_entity_id || ''}
          type="text"
          placeholder={__('Enter Hook...', 'bit-integrations')}
          disabled={isLoading}
        />
      </div>
      <div className="flx mt-1 flx-between">
        <b className="wdt-100 d-in-b">{__('Unique Key:', 'bit-integrations')}</b>
        <MultiSelect
          options={flow.flow_details.fields?.map((field) => ({
            label: field?.label,
            value: field?.name
          }))}
          defaultValue={
            Array.isArray(flow?.flow_details?.primaryKey)
              ? flow?.flow_details?.primaryKey.map((item) => item.key).join(',')
              : flow?.flow_details?.primaryKey?.key || ''
          }
          className="msl-wrp-options"
          onChange={primaryKeySet}
          singleSelect
          closeOnSelect
        />
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
      {flow.flow_details?.fields && (
        <>
          <div className="flx flx-between">
            <div className="my-3">
              <b>{__('Selected Fields:', 'bit-integrations')}</b>
            </div>
            <button
              onClick={() => setShowSelectedFields((prev) => !prev)}
              className="btn btcd-btn-md sh-sm flx">
              <span className="txt-actionHook-resbtn font-inter-500">
                {showSelectedFields ? 'Hide Selected Fields' : 'View Selected Fields'}
              </span>
              {!showSelectedFields ? (
                <EyeIcn width="20" height="20" strokeColor="#000000" />
              ) : (
                <EyeOffIcn width="20" height="20" strokeColor="#000000" />
              )}
            </button>
          </div>
          {showSelectedFields && (
            <div
              className="bg-white rounded border my-1 table-webhook-div p-2"
              style={{ minHeight: '40px', maxHeight: '14rem' }}>
              {flow.flow_details?.fields.map((field, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <input
                    key={index}
                    className="btcd-paper-inp w-100 m-1"
                    type="text"
                    onChange={(e) => setSelectedFieldsData(e.target.value, index)}
                    value={field?.name?.replace(/[,]/gi, '.')?.replace(/["{\}[\](\)]/gi, '')}
                    disabled={isLoading}
                  />
                  <button
                    className="btn btcd-btn-lg sh-sm"
                    onClick={() => removeSelectedField(index)}
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      color: '#ff4646',
                      padding: '2px'
                    }}>
                    <CloseIcn size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {flow.flow_details?.rawData && (
        <>
          <div className="flx flx-between">
            <div className="my-3">
              <b>{__('Select Fields:', 'bit-integrations')}</b>
            </div>
            <button
              onClick={() => setShowResponse((prev) => !prev)}
              className="btn btcd-btn-md sh-sm flx">
              <span className="txt-actionHook-resbtn font-inter-500">
                {showResponse ? 'Hide Response' : 'View Response'}
              </span>
              {!showResponse ? (
                <EyeIcn width="20" height="20" strokeColor="#000000" />
              ) : (
                <EyeOffIcn width="20" height="20" strokeColor="#000000" />
              )}
            </button>
          </div>
          {flow.flow_details?.rawData && showResponse && (
            <TreeViewer data={flow?.flow_details?.rawData} onChange={setSelectedFieldsData} />
          )}
        </>
      )}
    </div>
  )
}

export default EditActionHook
