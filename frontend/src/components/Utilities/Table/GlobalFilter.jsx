import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'

function GlobalFilter({ globalFilter, setGlobalFilter, setSearch, placeholder }) {
  const [delay, setDelay] = useState(null)

  const handleSearch = e => {
    delay && clearTimeout(delay)

    const { value } = e.target
    setGlobalFilter(value || undefined)

    setDelay(
      setTimeout(() => {
        setSearch(value || undefined)
      }, 1000)
    )
  }

  return (
    <div className="f-search">
      <button
        type="button"
        className="icn-btn"
        aria-label="icon-btn"
        onClick={() => {
          setSearch(globalFilter || undefined)
        }}>
        <span className="btcd-icn icn-search" />
      </button>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        <input
          value={globalFilter || ''}
          onChange={handleSearch}
          placeholder={placeholder || __('Search', 'bit-integrations')}
        />
      </label>
    </div>
  )
}

export default GlobalFilter
