/* eslint-disable no-param-reassign */

import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { getProFeatureSubtitle, getProFeatureTitle } from '../IntegrationHelpers/ActionUtilitiesHelper'

export default function MailPoetActions({ mailPoetConf, setMailPoetConf }) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const actionHandler = (e, type) => {
    const newConf = { ...mailPoetConf }
    if (type === 'update') {
      if (e.target.checked) {
        newConf.actions.update = true
      } else {
        delete newConf.actions.update
      }
    }
    setMailPoetConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={mailPoetConf.actions?.update || false}
        onChange={e => actionHandler(e, 'update')}
        className="wdt-200 mt-4 mr-2"
        value="user_share"
        isInfo={!isPro}
        title={getProFeatureTitle(__('Update Subscriber', 'bit-integrations'))}
        subTitle={getProFeatureSubtitle(
          __('Update Subscriber', 'bit-integrations'),
          __(
            'Update Mailpoet exist Subscriber? First name, last name, and email may not be updated.',
            'bit-integrations'
          ),
          '2.4.1'
        )}
      />
    </div>
  )
}
