import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'

const WPCoursewareHelper = ({ flow, setFlowData }) => {
  const selectedAction = flow?.triggerData?.formID
  return (
    <div>
      {(selectedAction === 'userEnrolledCourse' || selectedAction === 'courseCompleted') && (
        <>
          <h4>{__('Select a Course', 'bit-integrations')}</h4>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={flow.triggerData?.selectedCourse}
            options={flow?.triggerData?.courses?.map(({ label, value }) => ({ label, value }))}
            onChange={val => setFlowData(val, 'selectedCourse')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </>
      )}
      {selectedAction === 'moduleCompleted' && (
        <>
          <h4>{__('Select a Module', 'bit-integrations')}</h4>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={flow.triggerData?.selectedModule}
            options={flow?.triggerData?.modules?.map(({ label, value }) => ({ label, value }))}
            onChange={val => setFlowData(val, 'selectedModule')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </>
      )}
      {selectedAction === 'unitCompleted' && (
        <>
          <h4>{__('Select a Unit', 'bit-integrations')}</h4>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={flow.triggerData?.selectedUnit}
            options={flow?.triggerData?.units?.map(({ label, value }) => ({ label, value }))}
            onChange={val => setFlowData(val, 'selectedUnit')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </>
      )}
      <div />
    </div>
  )
}

export default WPCoursewareHelper
