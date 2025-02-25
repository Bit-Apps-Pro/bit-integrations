/* eslint-disable max-len */
/* eslint-disable no-param-reassign */

import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __, sprintf } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { getProFeatureSubtitle, getProFeatureTitle } from '../IntegrationHelpers/ActionUtilitiesHelper'

export default function FreshSalesActions({ freshSalesConf, setFreshSalesConf }) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const actionHandler = (e, type) => {
    const newConf = { ...freshSalesConf }
    if (type === 'upsert') {
      if (e.target.checked) {
        newConf.actions[type] = true
      } else {
        delete newConf.actions[type]
      }
    }

    setFreshSalesConf({ ...newConf })
  }

  return (
    <>
      <div className="pos-rel d-flx w-8">
        {'Product' !== freshSalesConf.moduleData.module && (
          <TableCheckBox
            onChange={e => actionHandler(e, 'upsert')}
            checked={freshSalesConf?.actions?.upsert || false}
            className="wdt-200 mt-4 mr-2"
            value="Upsert_Record"
            isInfo={!isPro}
            title={getProFeatureTitle(__('Upsert Record', 'bit-integrations'))}
            subTitle={getProFeatureSubtitle(
              __('Upsert Record', 'bit-integrations'),
              __(
                'A record gets updated based on the unique identifier value, else a new record will be created',
                'bit-integrations'
              ),
              '2.1.1'
            )}
          />
        )}
      </div>
    </>
  )
}
