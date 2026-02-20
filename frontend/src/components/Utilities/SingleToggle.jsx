export default function SingleToggle(props) {
  return (
    <div className={`flx flx-between ${props.className}`}>
      <span className="font-w-m">{props.title}</span>
      <label htmlFor={`s-ck-${props.title}-${props.isChecked}`} className="btcd-label">
        <div className="btcd-toggle">
          <input
            id={`s-ck-${props.title}-${props.isChecked}`}
            onChange={props.action}
            className="btcd-toggle-state"
            type="checkbox"
            name="check"
            value="check"
            checked={props.isChecked}
          />
          <div className="btcd-toggle-inner">
            <div className="btcd-indicator" />
          </div>
          <div className="btcd-active-bg" />
        </div>
        <div className="btcd-label-text" />
      </label>
    </div>
  )
}
