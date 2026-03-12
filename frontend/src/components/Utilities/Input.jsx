import { __ } from '../../Utils/i18nwrap'
import CopyText from './CopyText'

export default function Input({ label, name, placeholder, onchange, value, disabled, copytext }) {
  return (
    <>
      <div className="my-1">
        <b>{__(`${label || ''}`)}</b>
      </div>

      {copytext ? (
        <CopyText value={`${copytext}`} toastShow className="field-key-cpy w-6 ml-0" />
      ) : (
        <input
          className="btcd-paper-inp w-6 my-1 mx-0"
          onChange={onchange}
          name={name}
          value={value}
          type="text"
          placeholder={__(`${placeholder || ''}`)}
          disabled={disabled}
        />
      )}
    </>
  )
}
