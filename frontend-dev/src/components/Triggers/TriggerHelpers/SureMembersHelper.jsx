import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Cooltip from '../../Utilities/Cooltip'

const SureMembersHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details

  return (
    <div>
      {id && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b flx' : 'flx wdt-200 d-in-b mt-3 mb-3'}>
            Select Group
            {(id === 'sureMembers-1' || id === 'sureMembers-2') && (
              <Cooltip width={250} icnSize={17} className="ml-2">
                <div className="txt-body">
                  {__("This integration won't work if a group isn't chosen", 'bit-integrations')}
                </div>
              </Cooltip>
            )}
          </b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedGroup}
            options={triggerData?.groups?.map((group) => ({
              label: group.title,
              value: group.id.toString()
            }))}
            onChange={(val) => setFlowData(val, 'selectedGroup')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
    </div>
  )
}

export default SureMembersHelper
