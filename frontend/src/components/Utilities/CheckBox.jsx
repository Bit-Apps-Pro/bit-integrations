/* eslint-disable jsx-a11y/label-has-associated-control */

function CheckBox({ className, disabled, checked, onChange, radio, name, title, value, sqr }) {
  return (
    <label className={`btcd-ck-wrp ${className}`}>
      {title}
      <input
        type={radio ? 'radio' : 'checkbox'}
        checked={checked}
        onChange={onChange}
        name={name}
        value={value}
        disabled={disabled}
      />
      <span className={`btcd-mrk ${!sqr && 'br-50'} ${radio ? 'rdo' : 'ck'}`} />
    </label>
  )
}

export default CheckBox
