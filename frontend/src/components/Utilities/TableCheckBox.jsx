/* eslint-disable react/jsx-props-no-spreading */
export default function TableCheckBox(props) {
  const id = 'id' in props ? props.id : Math.random()
  return (
    <label htmlFor={`btcd-cbx-${id}`} className={`btcd-label-cbx ${props.className}`}>
      <input
        id={`btcd-cbx-${id}`}
        type="checkbox"
        checked={props.checked}
        value={props.value}
        name={props.name}
        onChange={props.onChange}
        className="btcd-cbx-invisible"
        {...props.rest}
        ref={props.refer}
        disabled={props.isInfo}
      />
      <div className={`btcd-t-cbx ${props.cls}`}>
        <svg width="20px" height="20px" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="9" />
          <polyline points="5 10.5 8.5 14 15 7.5" />
          <line x1="6" y1="10" x2="14" y2="10" />
        </svg>
      </div>
      <span>{props.title}</span>
      {props.subTitle && (
        <>
          <br />
          <small className="d-blk mt-1 ml-6 txt-dp" style={{ lineHeight: '18px' }}>
            {props.subTitle}
          </small>
        </>
      )}
    </label>
  )
}
