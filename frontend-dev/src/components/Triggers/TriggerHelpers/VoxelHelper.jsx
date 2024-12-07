import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import { $formFields, $newFlow } from '../../../GlobalStates'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { getVoxelFields } from './Voxel/voxelCommonFunction'

const VoxelHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details
  const setFormFields = useSetRecoilState($formFields)

  const handleChange = (val, type) => {
    setFlowData(val, type)
    if (val) {
      getVoxelFields(flow, setFlowData, val, edit, setFormFields)
    } else {
      if (edit) {
        setFormFields([])
      } else {
        setFlowData([], 'fields')
      }
    }
  }

  return (
    <div>
      {(id === 'voxel-7' ||
        id === 'voxel-8' ||
        id === 'voxel-9' ||
        id === 'voxel-10' ||
        id === 'voxel-11' ||
        id === 'voxel-20'
      ) && (
          <>
            <div className={edit ? 'flx mt-3' : ''}>
              <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>
                {__('Select Post Type:', 'bit-integrations')}
              </b>
              <MultiSelect
                className="msl-wrp-options"
                defaultValue={triggerData?.selectedPostType}
                options={triggerData?.postTypes}
                onChange={(val) => handleChange(val, 'selectedPostType')}
                singleSelect
                style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
              />
            </div>
            {edit && !triggerData.selectedPostType && (
              <>
                <br />
                <span className="actions-note">
                  {__('Please select a post type to fetch fields.', 'bit-integrations')}
                </span>
              </>
            )}
          </>
        )}
    </div>
  )
}

export default VoxelHelper
