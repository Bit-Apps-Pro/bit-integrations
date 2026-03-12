/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function ActiveCampaignActions({ activeCampaingConf, setActiveCampaingConf }) {
  const actionHandler = (e, type) => {
    const newConf = { ...activeCampaingConf }
    if (e.target.checked) {
      newConf.actions[type] = true
    } else {
      delete newConf.actions[type]
    }

    setActiveCampaingConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={activeCampaingConf.actions?.update || false}
        onChange={e => actionHandler(e, 'update')}
        className="wdt-200 mt-4 mr-2"
        value="user_share"
        title={__('Update ActiveCampaign', 'bit-integrations')}
        subTitle={__('Update Responses with ActiveCampaign existing email?', 'bit-integrations')}
      />
      <TableCheckBox
        checked={activeCampaingConf.actions?.tagUpdate || false}
        onChange={e => actionHandler(e, 'tagUpdate')}
        className="wdt-200 mt-4 mr-2"
        value="user_share"
        title={__('Update ActiveCampaign Tags', 'bit-integrations')}
        subTitle={__('Update existing contact tags in ActiveCampaign?', 'bit-integrations')}
      />
    </div>
  )
}
