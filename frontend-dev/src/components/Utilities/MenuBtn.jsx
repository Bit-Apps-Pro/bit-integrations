import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CopyIcn from '../../Icons/CopyIcn'
import EditIcn from '../../Icons/EditIcn'
import InfoIcn from '../../Icons/InfoIcn'
import TimeIcn from '../../Icons/TimeIcn'
import TrashIcn from '../../Icons/TrashIcn'
import { __ } from '../../Utils/i18nwrap'

export default function MenuBtn(props) {
  const menuList = useRef(null)
  const menuButton = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const checkIfClickedOutside = (e) => {
    if (
      isMenuOpen &&
      menuList.current &&
      !menuList.current.contains(e.target) &&
      !menuButton.current.contains(e.target)
    ) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    menuButton.current.parentNode.parentNode.parentNode.style.zIndex = isMenuOpen ? '10' : 'auto'
    isMenuOpen
      ? document.addEventListener('click', checkIfClickedOutside)
      : document.removeEventListener('click', checkIfClickedOutside)

    return () => {
      document.removeEventListener('click', checkIfClickedOutside)
    }
  }, [isMenuOpen])

  const height = isMenuOpen ? `${menuList.current.clientHeight}px` : 'auto'

  return (
    <div className="btcd-menu">
      <button
        ref={menuButton}
        className="btcd-menu-btn btcd-mnu sh-sm"
        onClick={() => setIsMenuOpen((oldState) => !oldState)}
        aria-label="toggle menu"
        type="button"
      />
      <div
        ref={menuList}
        className={`btcd-menu-list ${isMenuOpen ? 'btcd-m-a' : ''}`}
        style={{ height }}>
        <Link
          to={`/flow/action/info/${props.id}/${props.name}`}
          type="button"
          className="flx"
          aria-label="actions">
          <InfoIcn size={16} />
          &nbsp;
          {__('Info', 'bit-integrations')}
        </Link>
        <Link
          to={`/flow/action/log/${props.id}/${props.name}`}
          type="button"
          className="flx"
          aria-label="actions">
          <TimeIcn size={16} />
          &nbsp;
          {__('Timeline', 'bit-integrations')}
        </Link>
        <Link
          to={`/flow/action/edit/${props.id}`}
          type="button"
          className="flx"
          aria-label="actions">
          <EditIcn size={16} />
          &nbsp;
          {__('Edit', 'bit-integrations')}
        </Link>
        {props.isValidUser && (
          <button type="button" aria-label="actions" className="flx" onClick={props.dup}>
            <CopyIcn size={16} />
            &nbsp;
            {__('Clone', 'bit-integrations')}
          </button>
        )}
        <button type="button" aria-label="actions" className="flx" onClick={props.del}>
          <TrashIcn size={16} />
          &nbsp;
          {__('Delete', 'bit-integrations')}
        </button>
      </div>
    </div>
  )
}
