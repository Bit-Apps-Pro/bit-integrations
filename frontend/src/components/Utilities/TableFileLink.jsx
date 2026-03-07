function TableFileLink(props) {
  return (
    <div className="btcd-t-link flx mr-2 prevent-drawer">
      <div
        className="tooltip"
        style={{ '--tooltip-txt': `"${props.fname}"`, width: `${props.width ? props.width : '80'}px` }}>
        <a href={`${props.link}`} rel="noopener noreferrer" target="_blank" className="prevent-drawer">
          <span className="btcd-icn icn-file" /> {props.fname}
        </a>
      </div>
      <a
        target="_blank"
        href={`${props.link}&download`}
        download
        rel="noopener noreferrer"
        aria-label="Download"
        className="icn-btn icn-btn-sm flx prevent-drawer">
        <span className="btcd-icn icn-file_download" />
      </a>
    </div>
  )
}

export default TableFileLink
