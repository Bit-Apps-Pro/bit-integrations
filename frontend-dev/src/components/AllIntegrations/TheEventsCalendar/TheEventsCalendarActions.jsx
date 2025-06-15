/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { TASK_LIST_VALUES } from './theEventsCalendarConstants'
import { $btcbi } from '../../../GlobalStates'
import { useRecoilValue } from 'recoil'

export default function TheEventsCalendarActions({
  theEventsCalendarConf,
  setTheEventsCalendarConf,
  loading,
  setLoading
}) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const actionHandler = (e, type) => {
    const newConf = { ...theEventsCalendarConf }

    if (type === 'vendorCheckbox') {
      if (e.target.checked) {
        newConf.actions[e.target.value] = true
      } else {
        delete newConf.actions[e.target.value]
      }
    }

    setTheEventsCalendarConf({ ...newConf })
  }

  return <></>
}
