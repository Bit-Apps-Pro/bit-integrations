import React, { memo } from 'react'
import TrashIcn from '../../../../Icons/TrashIcn'
import { __ } from '../../../../Utils/i18nwrap'
import Button from '../../../Utilities/Button'
import SmartTagOptions from '../SmartTagOptions'
import FlowFormFieldsOptions from '../FlowFormFieldsOptions'
import { create } from 'mutative'

function TriggerDataSelect({ isInfo, childindx, itm, webHooks, setWebHooks }) {
  const setFromField = (val) => {
    setWebHooks((prevConf) =>
      create(prevConf, (draftConf) => {
        draftConf.body.data[childindx] = { ...draftConf.body.data[childindx], value: val }
      })
    )
  }

  const delParam = () => {
    setWebHooks((prevConf) =>
      create(prevConf, (draftConf) => {
        draftConf.body.data.splice(childindx, 1)
      })
    )
  }

  return !isInfo ? (
    <div className="flx p-atn">
      <Button onClick={delParam} icn>
        <TrashIcn size={16} />
      </Button>
      <select
        className="btcd-paper-inp mr-2"
        name="formField"
        value={itm.value || ''}
        onChange={(ev) => setFromField(ev.target.value)}>
        <option value="">{__('Select Field', 'bit-integrations')}</option>
        <FlowFormFieldsOptions />
        <SmartTagOptions />
      </select>
    </div>
  ) : null
}

export default TriggerDataSelect
