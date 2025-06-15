/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function BenchMarkActions({ benchMarkConf, setBenchMarkConf }) {
  const actionHandler = (e, type) => {
    const newConf = { ...benchMarkConf }
    if (type === 'update') {
      if (e.target.checked) {
        newConf.actions.update = true
      } else {
        delete newConf.actions.update
      }
    }
    setBenchMarkConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={benchMarkConf.actions?.update || false} onChange={(e) => actionHandler(e, 'update')} className="wdt-200 mt-4 mr-2" value="user_share" title={__('Update BenchMark', 'bit-integrations')} subTitle={__('Update Responses with BenchMark existing email?', 'bit-integrations')} />
    </div>
  )
}
