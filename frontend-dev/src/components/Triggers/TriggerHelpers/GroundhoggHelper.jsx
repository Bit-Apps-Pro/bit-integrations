import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import { $newFlow } from '../../../GlobalStates'
import { useRecoilState } from 'recoil'
import { useEffect } from 'react'
import { getAllGroundhoggTags } from './GroundhoggHelper/GroundhoggCommonFunction'

const GroundhoggHelper = ({ flow, setFlowData, edit = false }) => {
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details

  useEffect(() => {
    if ([2, 3].includes(Number(id))) {
      getAllGroundhoggTags(flow, setNewFlow)
    }
  }, [])

  return (
    <div>
      {(id === '2' || id === '3') && triggerData?.allTag
        && (
          <>
            <div className={edit ? 'flx mt-3' : ''}>
              <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a Tag</b>
              <MultiSelect
                className="msl-wrp-options"
                defaultValue={triggerData?.selectedTag}
                options={triggerData?.allTag?.map(list => ({ label: list.tag_name, value: list.tag_id.toString() }))}
                onChange={(val) => setFlowData(val, 'selectedTag')}
                singleSelect
                style={{ width: '100%', minWidth: 300, maxWidth: `${edit ? '450px' : '400px'}` }}
              />
            </div>

          </>
        )}
      <div />
    </div>
  )
}

export default GroundhoggHelper
