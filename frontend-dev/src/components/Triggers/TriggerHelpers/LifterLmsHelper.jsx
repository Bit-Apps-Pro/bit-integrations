import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import { create } from 'mutative'

const LifterLmsHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id

  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details

  const setFlowDataDepend = (val, type, isLoad = true) => {
    const tmpFlow = create(flow, draftChangeData => {
      if (!edit) {
        draftChangeData.triggerData[type] = val
      } else {
        draftChangeData.flow_details[type] = val
      }
    })
    if (type === 'selectedForum' && id === '4') {
      getTopicByForum(val, tmpFlow, setNewFlow, edit)
    } else {
      setNewFlow(tmpFlow)
    }
  }
  return (
    <>
      {(id === '1' || id === '2' || id === '3') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a quiz.</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedQuiz}
            options={triggerData?.allQuiz?.map((list) => ({
              label: list.post_title,
              value: list.ID.toString(),
            }))}
            onChange={(val) => setFlowDataDepend(val, 'selectedQuiz')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
      {(id === '4') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a Lesson</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedLesson}
            options={triggerData?.allLesson?.map((list) => ({
              label: list.post_title,
              value: list.ID.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedLesson')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
      {(id === '5' || id === '6' || id === '7') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a Course</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedCourse}
            options={triggerData?.allCourse?.map((list) => ({
              label: list.post_title,
              value: list.ID.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedCourse')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
      {(id === '8') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a Membership</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedMembership}
            options={triggerData?.allMembership?.map((list) => ({
              label: list.post_title,
              value: list.ID.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedMembership')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
    </>
  )
}

export default LifterLmsHelper
