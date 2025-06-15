import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'

const SliceWpHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id

  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details
  return (
    <div>
      {id === '2' && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a commission type</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedCommissionType}
            options={triggerData?.AllCommissionType?.map((list) => ({
              label: list.type_label,
              value: list.type_id.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedCommissionType')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
    </div>
  )
}

export default SliceWpHelper
