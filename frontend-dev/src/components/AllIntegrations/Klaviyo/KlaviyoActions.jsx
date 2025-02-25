/* eslint-disable no-param-reassign */

import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { getProFeatureSubtitle, getProFeatureTitle } from '../IntegrationHelpers/ActionUtilitiesHelper'

export default function KlaviyoActions({ klaviyoConf, setKlaviyoConf, loading, setLoading }) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const actionHandler = (e, type) => {
    const newConf = { ...klaviyoConf }
    if (e.target?.checked) {
      newConf['update'] = true
    } else {
      delete newConf.update
    }

    setKlaviyoConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={klaviyoConf?.update || false}
        onChange={e => actionHandler(e, 'update')}
        className="wdt-200 mt-4 mr-2"
        value="update"
        isInfo={!isPro}
        title={getProFeatureTitle(__('Update Profile', 'bit-integrations'))}
        subTitle={getProFeatureSubtitle(
          __('Update Profile', 'bit-integrations'),
          __(
            'A record gets updated based on the email, else a new profile will be created',
            'bit-integrations'
          ),
          '2.4.9'
        )}
      />
    </div>
  )
}
