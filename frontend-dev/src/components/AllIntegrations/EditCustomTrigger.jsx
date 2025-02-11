/* eslint-disable no-param-reassign */

import { create } from 'mutative'
import { useRef, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../GlobalStates'
import CloseIcn from '../../Icons/CloseIcn'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import CopyTextTrigger from '../Utilities/CopyTextTrigger'
import EyeIcn from '../Utilities/EyeIcn'
import EyeOffIcn from '../Utilities/EyeOffIcn'
import SnackMsg from '../Utilities/SnackMsg'
import TreeViewer from '../Utilities/treeViewer/TreeViewer'
import FieldContainer from '../Utilities/FieldContainer'

function EditCustomTrigger() {
  const [actionConf, setActionConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const setFormFields = useSetRecoilState($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [showResponse, setShowResponse] = useState(false)
  const [showSelectedFields, setShowSelectedFields] = useState(false)
  const fetchIntervalRef = useRef(0)
  let controller = new AbortController()
  const signal = controller.signal

  const triggerAbeleHook = `do_action(
    'bit_integrations_custom_trigger',
    '${flow?.triggered_entity_id}',
     array()
     );`

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

  const removeTestData = (hookID, reset = false) => {
    bitsFetch({ hook_id: hookID, reset: reset }, 'custom_trigger/test/remove').then((resp) => {
      delete window.hook_id
      fetchIntervalRef.current && clearInterval(fetchIntervalRef.current)
    })
  }

  const handleFetch = () => {
    if (isLoading) {
      fetchIntervalRef.current && clearInterval(fetchIntervalRef.current)
      controller.abort()
      removeTestData(flow?.triggered_entity_id)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setShowResponse(false)
    setFlow((prevFlow) =>
      create(prevFlow, (draftFlow) => {
        delete draftFlow.flow_details?.tmp
        delete draftFlow.flow_details?.rawData
      })
    )
    fetchIntervalRef.current = setInterval(() => {
      bitsFetch({ hook_id: flow?.triggered_entity_id }, 'custom_trigger/test', null, 'post', signal)
        .then((resp) => {
          if (resp.success) {
            controller.abort()
            clearInterval(fetchIntervalRef.current)
            setFlow((prevFlow) =>
              create(prevFlow, (draftFlow) => {
                draftFlow.flow_details.rawData = resp.data.custom_trigger
                draftFlow.flow_details.fields = []

                if (draftFlow.flow_details?.body?.data) {
                  draftFlow.flow_details.body.data = []
                } else {
                  draftFlow.flow_details.field_map = []
                }
              })
            )
            setActionConf((prevConf) =>
              create(prevConf, (draftConf) => {
                draftConf.rawData = resp.data.custom_trigger
                draftConf.fields = []

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
            console.log(__('AbortError: Fetch request aborted', 'bit-integrations'))
          }
        })
    }, 1500)
  }

  const showResponseTable = () => {
    setShowResponse((prevState) => !prevState)
  }

  const onUpdateField = (value, index, key) => {
    setFlow((prevFlow) =>
      create(prevFlow, (draftFlow) => {
        draftFlow.flow_details.fields[index][key] = value
      })
    )
    setActionConf((prevConf) =>
      create(prevConf, (draftConf) => {
        draftConf.fields[index][key] = value
      })
    )
    setFormFields((prevFields) =>
      create(prevFields, (draftFields) => {
        draftFields[index][key] = value
      })
    )
  }

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
          className={`btn btcd-btn-lg sh-sm flx ${isLoading ? 'red' : flow.flow_details?.rawData ? 'gray': 'purple'}`}
          type="button"
          disabled={isLoading}>
          {isLoading
            ? __('Stop', 'bit-integrations')
            : flow.flow_details?.rawData
              ? __('Fetched ✔', 'bit-integrations')
              : __('Fetch', 'bit-integrations')}
          {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
        </button>
      </div>

      {flow.flow_details?.rawData && (
        <>
          <div className="my-3">
            <b>{__('Selected Fields:', 'bit-integrations')}</b>
          </div>

          {showSelectedFields && (
            <FieldContainer
              data={flow.flow_details.fields}
              onUpdateField={onUpdateField}
              onRemoveField={removeSelectedField}
            />
          )}
          <button
            onClick={() => setShowSelectedFields((prev) => !prev)}
            className="btn btcd-btn-md sh-sm flx gray">
            <span className="txt-actionHook-resbtn font-inter-500">
              {showSelectedFields ? 'Hide Selected Fields' : 'View Selected Fields'}
            </span>
            &nbsp;
            {!showSelectedFields ? (
              <EyeIcn width="20" height="20" strokeColor="#000000" />
            ) : (
              <EyeOffIcn width="20" height="20" strokeColor="#000000" />
            )}
          </button>
        </>
      )}

      {flow.flow_details?.rawData && (
        <>
          <div className="mt-5">
            <b>{__('Select Fields:', 'bit-integrations')}</b>
          </div>

          {showResponse && (
            <TreeViewer data={flow?.flow_details?.rawData} onChange={setSelectedFieldsData} />
          )}
        </>
      )}

      {flow.flow_details?.rawData && (
        <div className="flx flx-between">
          <button onClick={showResponseTable} className="btn btcd-btn-md sh-sm flx gray">
            <span className="txt-actionHook-resbtn font-inter-500">
              {showResponse
                ? __('Hide Response', 'bit-integrations')
                : __('View Response', 'bit-integrations')}
            </span>
            &nbsp;
            {!showResponse ? (
              <EyeIcn width="20" height="20" strokeColor="#000000" />
            ) : (
              <EyeOffIcn width="20" height="20" strokeColor="#000000" />
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default EditCustomTrigger
