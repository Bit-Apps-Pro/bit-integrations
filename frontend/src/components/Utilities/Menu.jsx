import { useRef, useState, useEffect } from 'react'
import { __ } from '../../Utils/i18nwrap'

export default function Menu(props) {
  const [isComponentVisible, setIsComponentVisible] = useState(false)
  const wrapRef = useRef(null)

  const handleClickOutside = event => {
    if (wrapRef.current && !wrapRef.current.contains(event.target)) {
      setIsComponentVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  const handleMenu = () => {
    setIsComponentVisible(oldState => !oldState)
  }

  const showTooltip = props.showTooltip !== false
  const buttonClassName = props.btnClassName || `icn-btn btcd-icn-lg ${showTooltip ? 'tooltip' : ''}`
  const menuClassName = props.menuClassName ? ` ${props.menuClassName}` : ''
  const buttonStyle = showTooltip
    ? {
        '--tooltip-txt': `'${props.tooltipText || __('Column  Visibility', 'bit-integrations')}'`,
        '--tt-left': props.tooltipLeft || '148%'
      }
    : undefined

  return (
    <div className="btcd-menu" ref={wrapRef}>
      <button
        onClick={handleMenu}
        className={buttonClassName}
        style={buttonStyle}
        aria-label="icon-btn"
        type="button">
        <span className={`btcd-icn ${props.icn}`} />
        {props.title}
      </button>
      <div />
      <div className={`btcd-menu-li ${isComponentVisible ? 'btcd-menu-a' : ''}${menuClassName}`}>
        {props.children}
      </div>
    </div>
  )
}
