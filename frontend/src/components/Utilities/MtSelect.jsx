function MtSelect({ className, onChange, value, label, children, style }) {
  return (
    <div className={`btcd-mt-sel ${className}`} style={style}>
      <select onChange={onChange} value={value || ''}>
        {children}
      </select>
      <small>{label}</small>
    </div>
  )
}

export default MtSelect
