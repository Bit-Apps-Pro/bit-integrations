import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import { getFluentFluentBookingFields } from './FluentBookingHelper/FluentBookingCommonFunction'

const FluentBookingHelper = ({ flow, setFlowData }) => {
  const id = flow?.triggerData?.formID
  console.log(flow.triggerData, 'tdata')
  
  const handleChange = (val) => {
    setFlowData(val, 'selectedEvent')
    if (val) {
      getFluentFluentBookingFields(setFlowData, val)
    } else {
      setFlowData([], 'fields')
    }
  }

  return (
    <div>
      {id &&
        <>
          <h4>Select a Event</h4>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={flow.triggerData?.selectedEvent}
            options={flow?.triggerData?.events?.map(event => ({ label: event.title, value: event.id.toString() }))}
            onChange={(val) => handleChange(val)}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </>}
    </div>
  )
}

export default FluentBookingHelper
