import React, { memo } from 'react'
import TriggerDataSelect from './TriggerDataSelect'
import { create } from 'mutative'

function PayLoadFieldMap({ childindx, itm, isInfo, webHooks, setWebHooks }) {
  const handlePayload = (e) => {
    setWebHooks((prevConf) =>
      create(prevConf, (draftConf) => {
        draftConf.body.data[childindx] = {
          ...draftConf.body.data[childindx],
          [e.target.name]: e.target.value
        }
      })
    )
  }

  return (
    <div className="tr">
      <div className="td">
        <input
          className="btcd-paper-inp p-i-sm"
          onChange={handlePayload}
          name="key"
          type="text"
          value={itm.key}
          disabled={isInfo}
        />
      </div>
      <div className="td">
        <input
          className="btcd-paper-inp p-i-sm"
          onChange={handlePayload}
          name="value"
          type="text"
          value={itm.value}
          disabled={isInfo}
        />
      </div>

      <TriggerDataSelect
        itm={itm}
        childindx={childindx}
        isInfo={isInfo}
        webHooks={webHooks}
        setWebHooks={setWebHooks}
      />
    </div>
  )
}

export default memo(PayLoadFieldMap)
