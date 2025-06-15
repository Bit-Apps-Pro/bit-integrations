import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'

const UltimateMemberHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id

  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details

  return (
    <>
      {(id === 'roleSpecificChange') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a role</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedRole}
            options={triggerData?.allRole?.map((list) => ({
              label: list.label,
              value: list.name.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedRole')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
    </>
  )
}

export default UltimateMemberHelper
