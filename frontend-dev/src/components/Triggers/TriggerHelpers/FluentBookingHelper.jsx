import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import { getFluentFluentBookingFields } from './FluentBookingHelper/FluentBookingCommonFunction'
import { $formFields, $newFlow } from '../../../GlobalStates'
import { useRecoilState, useSetRecoilState } from 'recoil'

const FluentBookingHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details
  const setFormFields = useSetRecoilState($formFields)

  const handleChange = (val) => {
    setFlowData(val, 'selectedEvent')
    if (val) {
      getFluentFluentBookingFields(setFlowData, val, edit, setFormFields)
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
      {id && (
        <div className={edit ? 'flx' : ''}>
          <h4 className={edit ? 'wdt-200' : ''}>{__('Select a Event', 'bit-integrations')}</h4>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedEvent}
            options={triggerData?.events?.map((event) => ({
              label: event.title,
              value: event.id.toString()
            }))}
            onChange={(val) => handleChange(val)}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
    </div>
  )
}

export default FluentBookingHelper
