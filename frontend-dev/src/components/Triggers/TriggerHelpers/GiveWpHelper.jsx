import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'

const GiveWpHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id

  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const setFlowDataDepend = (val, type, isLoad = true) => {
    const tmpFlow = { ...flow }
    if (!edit) {
      tmpFlow.triggerData[type] = val
    } else {
      tmpFlow.flow_details[type] = val
    }

    setNewFlow({ ...tmpFlow })
  }
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details
  return (
    <div>
      { (id === '1' || id === '*') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a Donation Form</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedDonationForm}
            options={triggerData?.allDonationForms?.map((list) => ({
              label: list.post_title,
              value: list.ID.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedDonationForm')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
      { (id === '2') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a Recurring Donation Form</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedRecurringDonationForm}
            options={triggerData?.allRecurringForms?.map((list) => ({
              label: list.post_title,
              value: list.ID.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedRecurringDonationForm')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
    </div>

  )
}
export default GiveWpHelper
