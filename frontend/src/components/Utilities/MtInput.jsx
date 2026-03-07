/* eslint-disable jsx-a11y/label-has-associated-control */

function MtInput({ label, onChange, value, disabled, type, textarea, className }) {
  return (
    <label className={`btcd-mt-inp ${className}`}>
      {!textarea && (
        <input
          type={type === undefined ? 'text' : type}
          onChange={onChange}
          placeholder=" "
          disabled={disabled}
          value={value}
        />
      )}
      {textarea && (
        <textarea
          type={type === undefined ? 'text' : type}
          onChange={onChange}
          placeholder=" "
          disabled={disabled}
          value={value}
        />
      )}
      <span>{label}</span>
    </label>
  )
}

export default MtInput
