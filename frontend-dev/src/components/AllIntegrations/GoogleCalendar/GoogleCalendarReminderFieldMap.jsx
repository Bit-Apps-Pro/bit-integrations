import { delReminderFieldMap } from './IntegrationHelpers'

export default function GoogleCalendarReminderFieldMap({ rIndex, reminderField, googleCalendarConf, setGoogleCalendarConf }) {
  const handleReminderFieldMapping = (event, index) => {
    const newConf = { ...googleCalendarConf }
    newConf.reminder_field_map[index][event.target.name] = event.target.value
    setGoogleCalendarConf({ ...newConf })
  }

  return (
    <div className="flx mt-2">
      <select className="btcd-paper-inp mr-2" name="method" value={reminderField.method || ''} onChange={(re) => handleReminderFieldMapping(re, rIndex)}>
        <option value="">Select Notification Type</option>
        <option value="popup">Notification</option>
        <option value="email">Email</option>
      </select>
      <input type="number" className="btcd-paper-inp" name="minutes" placeholder="minutes" value={reminderField.minutes || ''} onChange={(re) => handleReminderFieldMapping(re, rIndex)} />
      <button onClick={() => delReminderFieldMap(rIndex, googleCalendarConf, setGoogleCalendarConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
        <span className="btcd-icn icn-trash-2" />
      </button>
    </div>
  )
}
