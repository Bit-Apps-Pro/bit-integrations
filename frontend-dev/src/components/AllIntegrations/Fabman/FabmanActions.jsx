/* eslint-disable no-param-reassign */

import { __ } from '../../../Utils/i18nwrap'

export default function FabmanActions({ fabmanConf, setFabmanConf, loading, setLoading }) {
  return (
    <div className="pos-rel d-flx w-8">
      <div className="mt-2">
        <b>{__('No additional utilities available for this action.', 'bit-integrations')}</b>
      </div>
    </div>
  )
}
