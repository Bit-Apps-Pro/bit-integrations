import 'react-multiple-select-dropdown-lite/dist/index.css'
import CloseIcn from '../../Icons/CloseIcn'
import { __ } from '../../Utils/i18nwrap'
import ConfirmModal from './ConfirmModal'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { memo, useState } from 'react'

function FieldContainer({ data = [], onRemoveField, onUpdateField }) {
  const [actionMdl, setActionMdl] = useState(false)
  const [fieldIndex, setFieldIndex] = useState()

  const onFieldClick = index => {
    setFieldIndex(index)
    setActionMdl(true)
  }

  const types = [
    { label: 'Text', value: 'text' },
    { label: 'Email', value: 'email' },
    { label: 'Select', value: 'select' },
    { label: 'Radio', value: 'radio' },
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Number', value: 'number' },
    { label: 'Phone Number', value: 'tel' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Date Picker', value: 'datepicker' },
    { label: 'URL', value: 'url' },
    { label: 'File', value: 'file' },
    { label: 'Array', value: 'array' },
    { label: 'Object', value: 'object' }
  ]

  return (
    <div
      className="bg-white rounded border my-1 table-webhook-div p-2 field-container"
      style={{ minHeight: '6rem', maxHeight: '14rem' }}>
      {data.map((field, index) => (
        <div key={index} class="field-wrapper">
          <button
            className="field purple-sh tooltip"
            onClick={() => onFieldClick(index)}
            style={{
              '--tooltip-txt': `'${__('Click to edit', 'bit-integrations')}'`
            }}
            type="button">
            {field?.label?.replace(/[,]/gi, '.').replace(/["{\}[\](\)]/gi, '')}
          </button>
          <button
            className="remove-field tooltip"
            onClick={() => onRemoveField(index)}
            style={{
              '--tooltip-txt': `'${__('Click to remove', 'bit-integrations')}'`
            }}>
            <CloseIcn size={8} stroke={7} />
          </button>
        </div>
      ))}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt="Ok"
        show={actionMdl}
        close={() => setActionMdl(false)}
        action={() => setActionMdl(false)}
        title={__('Edit Field', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />

        <div className="mt-2">
          <div className="mt-3 mb-2">
            <b>{__('Field Label', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-100"
            type="text"
            onChange={e => onUpdateField(e.target.value, fieldIndex, 'label')}
            value={data[fieldIndex]?.label}
          />

          <div className="mt-3 mb-2">
            <b>{`${__('Field Id', 'bit-integrations')} (${__('It is not recommended to edit the field ID', 'bit-integrations')})`}</b>
          </div>
          <input
            className="btcd-paper-inp w-100"
            type="text"
            onChange={e => onUpdateField(e.target.value, fieldIndex, 'name')}
            value={data[fieldIndex]?.name}
          />

          <div className="mt-3 mb-2">
            <b>{__('Field Type', 'bit-integrations')}</b>
          </div>
          <MultiSelect
            className="msl-wrp-options w-10"
            defaultValue={data[fieldIndex]?.type || 'text'}
            options={types}
            onChange={val => onUpdateField(val, fieldIndex, 'type')}
            singleSelect
            closeOnSelect
            customValue
          />
        </div>
      </ConfirmModal>
    </div>
  )
}

export default memo(FieldContainer)
