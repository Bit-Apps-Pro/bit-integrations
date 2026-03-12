function Button({ className, type, onClick, icn, children, style }) {
  return (
    <button
      style={style}
      className={`${icn ? 'icn-btn' : 'btn'}  ${className}`}
      // eslint-disable-next-line react/button-has-type
      type={type || 'button'}
      onClick={onClick}
      aria-label="btcd-button">
      {children}
    </button>
  )
}

export default Button
