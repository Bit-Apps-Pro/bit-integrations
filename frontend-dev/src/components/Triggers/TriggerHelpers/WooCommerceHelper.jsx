import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import { $newFlow } from '../../../GlobalStates'
import { getVariationsByProduct } from './WooCommerceHelper/WooCommerceCommonFunction'
import { create } from 'mutative'

const WooCommerceHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details

  const setFlowDataDepend = (val, type, isLoad = true) => {
    const tmpFlow = create(flow, (draftChangeData) => {
      if (!edit) {
        draftChangeData.triggerData[type] = val
      } else {
        draftChangeData.flow_details[type] = val
      }
    })
    if (type === 'selectedVariableProduct' && id === '20') {
      getVariationsByProduct(val, tmpFlow, setNewFlow, edit)
    } else {
      setNewFlow(tmpFlow)
    }
  }

  return (
    <div>
      {(id === '10' || id === '19') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>
            {__('Select a Product', 'bit-integrations')}
          </b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedProduct}
            options={triggerData?.products?.map((product) => ({
              label: product.product_title,
              value: product.product_id.toString()
            }))}
            onChange={(val) => setFlowData(val, 'selectedProduct')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}

      {id === '11' && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>
            {__('Select a order status', 'bit-integrations')}
          </b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedOrderStatus}
            options={
              triggerData?.orderStatus &&
              Object.entries(triggerData.orderStatus).map(([key, value]) => ({
                label: value,
                value: key.toString()
              }))
            }
            onChange={(val) => setFlowData(val, 'selectedOrderStatus')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
      {id === '17' && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>
            {__('Select a categories', 'bit-integrations')}
          </b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedProductCategory}
            options={
              triggerData?.allProductCategories &&
              triggerData.allProductCategories.map((item) => ({
                label: item.name,
                value: item.term_id.toString()
              }))
            }
            onChange={(val) => setFlowData(val, 'selectedProductCategory')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}

      {id === '20' && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>
            {__('Select a variable product', 'bit-integrations')}
          </b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedVariableProduct}
            options={
              triggerData?.allVariableProduct &&
              triggerData.allVariableProduct.map((item) => ({
                label: item.product_title,
                value: item.product_id.toString()
              }))
            }
            onChange={(val) => setFlowDataDepend(val, 'selectedVariableProduct')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
      {triggerData?.selectedVariableProduct && id === '20' && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>
            {__('Select a variation', 'bit-integrations')}
          </b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedVariation}
            options={
              triggerData?.allVariation &&
              triggerData.allVariation.map((item) => ({
                label: item.variation_title,
                value: item.variation_id.toString()
              }))
            }
            onChange={(val) => setFlowData(val, 'selectedVariation')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
      <div />
    </div>
  )
}

export default WooCommerceHelper
