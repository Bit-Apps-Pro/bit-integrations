/* eslint-disable react/jsx-props-no-spreading */
import EditIcn from '../../Icons/EditIcn'

export default function TitleModal({ action, children }) {
  return (
    <div className="action-btn-wrapper">
      <div className="action-btn" tabIndex="0" role="button" onClick={action} onKeyPress={action}>
        <EditIcn />
      </div>
      {children}
    </div>
  )
}
