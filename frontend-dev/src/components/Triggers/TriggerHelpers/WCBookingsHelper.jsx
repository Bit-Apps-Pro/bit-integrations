import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'

const WCBookingsHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details
  const allStatus = [
    { label: 'Any Status', value: 'any' },
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Pending Confirmation', value: 'pending-confirmation' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Paid', value: 'paid' },
    { label: 'Complete', value: 'complete' },
    { label: 'In Cart', value: 'in-cart' },
    { label: 'Cancelled', value: 'cancelled' }
  ]

  return (
    <div>
      {id === 'booking_status_changed' && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>
            {__('Select Status:', 'bit-integrations')}
          </b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedStatus || 'any'}
            options={allStatus}
            onChange={(val) => setFlowData(val, 'selectedStatus')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
    </div>
  )
}

export default WCBookingsHelper
