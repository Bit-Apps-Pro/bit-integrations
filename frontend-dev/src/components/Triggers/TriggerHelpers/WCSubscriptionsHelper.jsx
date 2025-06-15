import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'

const WCSubscriptionsHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details
  const allStatus = [
    { label: 'Any Status', value: 'any' },
    { label: 'Active', value: 'active' },
    { label: 'On Hold', value: 'on-hold' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Pending Cancel', value: 'pending-cancel' }
  ]

  return (
    <div>
      {id &&
        !['user_subscribes_to_product', 'user_purchases_variable_subscription'].includes(id) && (
          <div className={edit ? 'flx mt-3' : ''}>
            <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>
              {__('Select Subscription:', 'bit-integrations')}
            </b>
            <MultiSelect
              className="msl-wrp-options"
              defaultValue={triggerData?.selectedSubscription}
              options={triggerData?.allSubscriptions}
              onChange={(val) => setFlowData(val, 'selectedSubscription')}
              singleSelect
              style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
            />
          </div>
        )}

      {id && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>
            {__('Select Product:', 'bit-integrations')}
          </b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedProduct}
            options={triggerData?.allSubscriptionProducts}
            onChange={(val) => setFlowData(val, 'selectedProduct')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}

      {id === 'user_subscription_status_updated' && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>
            {__('Select Status:', 'bit-integrations')}
          </b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedStatus}
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

export default WCSubscriptionsHelper
