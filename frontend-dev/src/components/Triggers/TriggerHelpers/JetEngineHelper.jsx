import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../../GlobalStates'

const JetEngineHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? Number(flow?.triggerData?.formID) : Number(flow.triggered_entity_id)

  const [newFlow, setNewFlow] = useRecoilState($newFlow)

  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details
  return (
    <div>
      {([1, 2].includes(id))
        && (
          <>
            <div className={edit ? 'flx mt-3' : ''}>
              <b className={edit ? 'mr-24' : 'wdt-200 d-in-b mt-3 mb-3'}>Post Types</b>
              <MultiSelect
                className="msl-wrp-options mt-2"
                defaultValue={triggerData?.selectedPostType}
                options={triggerData?.types?.map(type => ({ label: type.title, value: type.id.toString() }))}
                onChange={(val) => setFlowData(val, 'selectedPostType')}
                singleSelect
                style={{ width: '100%', minWidth: 300, maxWidth: 450 }}
              />
            </div>
            <div className={edit ? 'flx mt-3' : ''}>
              <b className={edit ? 'mr-24' : 'wdt-200 d-in-b mt-3 mb-3'}>Meta key</b>
              <MultiSelect
                className="msl-wrp-options mt-2"
                defaultValue={triggerData?.selectedMetaKey}
                onChange={(val) => setFlowData(val, 'selectedMetaKey')}
                customValue
                singleSelect
                style={{ width: '100%', minWidth: 300, maxWidth: 450 }}
              />
            </div>
            { id === 2 && (
              <div className={edit ? 'flx mt-3' : ''}>
                <b className={edit ? 'mr-24' : 'wdt-200 d-in-b mt-3 mb-3'}>Meta value</b>
                <MultiSelect
                  className="msl-wrp-options mt-2"
                  defaultValue={triggerData?.selectedMetaValue}
                  onChange={(val) => setFlowData(val, 'selectedMetaValue')}
                  customValue
                  singleSelect
                  style={{ width: '100%', minWidth: 300, maxWidth: 450 }}
                />
              </div>
            )}
          </>

        )}
    </div>
  )
}

export default JetEngineHelper
