import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../../GlobalStates'
import { getQuizByCourse } from './MasterStudyLmsHelper/MasterStudyLmsCommonFunction.js'

const MasterStudyLmsHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id

  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details

  const setFlowDataDepend = (val, type, isLoad = true) => {
    const tmpFlow = { ...flow }
    if (!edit) {
      tmpFlow.triggerData[type] = val
    } else {
      tmpFlow.flow_details[type] = val
    }
    if (type === 'selectedCourse' && (id === '4' || id === '5')) {
      getQuizByCourse(val, tmpFlow, setNewFlow, edit)
    } else {
      setNewFlow(tmpFlow)
    }
  }

  return (
    <>
    {(id === '1' || id === '3') && (
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
      {(id === '4' || id === '5') && (
        <div className={edit ? 'flx mt-3' : ''}>
        <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a Course</b>
        <MultiSelect
          className="msl-wrp-options"
          defaultValue={triggerData?.selectedCourse}
          options={triggerData?.allCourse?.map((list) => ({
            label: list.title,
            value: list.id.toString(),
          }))}
          onChange={(val) => setFlowDataDepend(val, 'selectedCourse')}
          singleSelect
          style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
        />
      </div>
      )}
      {(id === '4' || id === '5') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a Quiz</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedQuiz}
            options={triggerData?.allQuiz?.map((list) => ({
              label: list.title,
              value: list.id.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedQuiz')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
    </>
  )
}

export default MasterStudyLmsHelper
