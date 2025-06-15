import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import { create } from 'mutative'

const EDDHelper = ({ flow, setFlowData, edit = false }) => {
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
    setNewFlow(tmpFlow)
  }
  return (
    <>
      {(id === '1') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a product.</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedProduct}
            options={triggerData?.allProduct?.map((list) => ({
              label: list.title,
              value: list.id.toString(),
            }))}
            onChange={(val) => setFlowDataDepend(val, 'selectedProduct')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
      {(id === '2') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>Select a discount code</b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedDiscount}
            options={triggerData?.allDiscountCode?.map((list) => ({
              label: list.title,
              value: list.id.toString(),
            }))}
            onChange={(val) => setFlowData(val, 'selectedDiscount')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
    </>
  )
}

export default EDDHelper
