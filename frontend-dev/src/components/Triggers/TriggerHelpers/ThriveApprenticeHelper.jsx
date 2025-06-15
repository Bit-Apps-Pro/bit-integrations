import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import { } from './ThriveApprenticeHelper/ThriveApprenticeCommonFunction.js'

const ThriveApprenticeHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id

  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const triggerData = !edit ? newFlow?.triggerData : flow?.flow_details

  return (
    <>
      {(id === '1') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a Course</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedCourse}
            options={triggerData?.allCourse?.map((list) => ({
              label: list.title,
              value: list.id.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedCourse')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
      {(id === '2') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a Lesson</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedLesson}
            options={triggerData?.allLesson?.map((list) => ({
              label: list.title,
              value: list.id.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedLesson')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
      {(id === '3') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a Module</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedModule}
            options={triggerData?.allModule?.map((list) => ({
              label: list.title,
              value: list.id.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedModule')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
    </>
  )
}

export default ThriveApprenticeHelper
