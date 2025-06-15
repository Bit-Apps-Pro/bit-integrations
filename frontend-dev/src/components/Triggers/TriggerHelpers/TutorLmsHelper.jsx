import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'

const TutorLmsHelper = ({ flow, setFlowData }) => {
  const id = flow?.triggerData?.formID
  return (
    <div>
      {(id === '2' || id === '5')
        && (
          <>
            <h4>Select a Quiz</h4>
            <MultiSelect
              className="msl-wrp-options"
              defaultValue={flow.triggerData?.selectedQuiz}
              options={flow?.triggerData?.quizzes?.map(list => ({ label: list.quiz_title, value: list.quiz_id.toString() }))}
              onChange={(val) => setFlowData(val, 'selectedQuiz')}
              singleSelect
              style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
            />

          </>
        )}
      {id === '3'
        && (
          <>
            <h4>Select a Lesson</h4>
            <MultiSelect
              className="msl-wrp-options"
              defaultValue={flow.triggerData?.selectedLesson}
              options={flow?.triggerData?.lessons?.map(list => ({ label: list.lesson_title, value: list.lesson_id.toString() }))}
              onChange={(val) => setFlowData(val, 'selectedLesson')}
              singleSelect
              style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
            />

          </>
        )}
      {(id === '4' || id === '1')
        && (
          <>
            <h4>Select a Course</h4>
            <MultiSelect
              className="msl-wrp-options"
              defaultValue={flow.triggerData?.selectedCourse}
              options={flow?.triggerData?.courses?.map(list => ({ label: list.course_title, value: list.course_id.toString() }))}
              onChange={(val) => setFlowData(val, 'selectedCourse')}
              singleSelect
              style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
            />

          </>
        )}
      {id === '5' && flow.triggerData.selectedQuiz
        && (
          <>
            <h4>Select a Condition</h4>
            <MultiSelect
              className="msl-wrp-options"
              defaultValue={flow.triggerData?.selectedCondition}
              options={flow?.triggerData?.percentageCondition?.map(list => ({ label: list.condition_title, value: list.condition_id.toString() }))}
              onChange={(val) => setFlowData(val, 'selectedCondition')}
              singleSelect
              style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
            />
            <h4>Target Value</h4>
            <input className="btcd-paper-inp w-10 mt-1" onChange={(e) => setFlowData(e.target.value, 'requiredPercent')} name="requiredPercent" value={flow?.triggerData?.requiredPercent} type="text" placeholder={__('Targeted Percentage Value(ex: 50)', 'bit-integrations')} />
          </>
        )}
      <div />
    </div>
  )
}

export default TutorLmsHelper
