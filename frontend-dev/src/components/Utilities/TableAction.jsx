function TableAction(props) {
  return (
    <div className="btcd-t-action-wrp flx">
      <div className="btcd-t-action">
        {'dup' in props && (
          <button onClick={props.dup} className="icn-btn btcd-hid-icn tooltip" style={{ '--tooltip-txt': '"Duplicate"' }} aria-label="action btn" type="button">
            <span className="btcd-icn btcd-icn-sm icn-file_copy" />
          </button>
        )}
        {'del' in props && (
          <button onClick={props.del} className="icn-btn btcd-hid-icn tooltip" style={{ '--tooltip-txt': '"Delete"' }} aria-label="action btn" type="button">
            <span className="btcd-icn btcd-icn-sm icn-trash-fill" />
          </button>
        )}
        {'edit' in props && (
          <button onClick={props.edit} className="icn-btn btcd-hid-icn tooltip" style={{ '--tooltip-txt': '"Edit"' }} aria-label="action btn" type="button">
            <span className="btcd-icn btcd-icn-sm icn-document-edit" />
          </button>
        )}

        <button className="icn-btn btcd-ph-btn" aria-label="action btn" type="button">
          <span className="btcd-icn btcd-icn-sm icn-dots-three-horizontal" />
        </button>
      </div>
    </div>
  )
}
export default TableAction
