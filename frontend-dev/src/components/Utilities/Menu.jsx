import { useRef, useState, useEffect } from 'react'

export default function Menu(props) {
  const [isComponentVisible, setIsComponentVisible] = useState(false)
  const ref = useRef(null)

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      // props.onClickOut()
      // isComponentVisible && props.onClickOut()
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
    setIsComponentVisible(true)
  }

  return (
    <div className="btcd-menu">
      <button ref={ref} onClick={handleMenu} className="icn-btn btcd-icn-lg tooltip" style={{ '--tooltip-txt': '"Column  Visibility"', '--tt-left': '148%' }} aria-label="icon-btn" type="button">
        <span className={`btcd-icn ${props.icn}`} />
        {props.title}
      </button>
      <div />
      <div ref={ref} className={`btcd-menu-li ${isComponentVisible ? 'btcd-menu-a' : ''}`}>
        {props.children}
      </div>
    </div>
  )
}
