import { __ } from '../../Utils/i18nwrap'

export default function GetInfo({ url, info }) {
  return (
    <small className="d-blk mt-1">
      {__(`${ info || '' }`)}
      <a className="btcd-link" href={url} target="_blank" rel="noreferrer">{__(' here.')}</a>
    </small>
  )
}
