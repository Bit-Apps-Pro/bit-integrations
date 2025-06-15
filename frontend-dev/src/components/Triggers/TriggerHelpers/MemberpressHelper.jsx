import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'

const MemberpressHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id

  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details
  return (
    <>
      {id === '1' && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select life time membership</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedOneTimeMembership}
            options={triggerData?.oneTimeMembership?.map((list) => ({
              label: list.membershipTitle,
              value: list.membershipId.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedOneTimeMembership')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}

      {(id === '2' || id === '5') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a recurring membership</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedRecurringMembership}
            options={triggerData?.recurringMembership?.map((list) => ({
              label: list.membershipTitle,
              value: list.membershipId.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedRecurringMembership')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
      {(id === '3' || id === '4') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a membership</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedCancelMembership}
            options={triggerData?.allMemberships?.map((list) => ({
              label: list.membershipTitle,
              value: list.membershipId.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedCancelMembership')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
    </>
  )
}

export default MemberpressHelper
