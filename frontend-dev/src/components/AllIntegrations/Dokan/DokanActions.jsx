/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { TASK_LIST_VALUES } from './dokanConstants'
import { $btcbi } from '../../../GlobalStates'
import { useRecoilValue } from 'recoil'

export default function DokanActions({ dokanConf, setDokanConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const actionHandler = (e, type) => {
    const newConf = { ...dokanConf }

    if (type === 'vendorCheckbox') {
      if (e.target.checked) {
        newConf.actions[e.target.value] = true
      } else {
        delete newConf.actions[e.target.value]
      }
    }

    setDokanConf({ ...newConf })
  }

  return (
    <>
      {!isPro && (
        <div className="pt-2">
          <span className="actions-note">
            {__(
              'The Bit Integrations Pro plugin needs to be installed and activated to utilize these features',
              'bit-integrations'
            )}
          </span>
        </div>
      )}
      <div className="pos-rel d-flx w-8">
        {(dokanConf.selectedTask === TASK_LIST_VALUES.CREATE_VENDOR ||
          dokanConf.selectedTask === TASK_LIST_VALUES.UPDATE_VENDOR) && (
          <>
            <TableCheckBox
              checked={dokanConf.actions?.notifyVendor || false}
              onChange={(e) => actionHandler(e, 'vendorCheckbox')}
              className="wdt-200 mt-4 mr-2"
              value="notifyVendor"
              title={__('Notify Vendor', 'bit-integrations')}
              subTitle={__('Send the vendor an email about their account', 'bit-integrations')}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={dokanConf.actions?.enableSelling || false}
              onChange={(e) => actionHandler(e, 'vendorCheckbox')}
              className="wdt-200 mt-4 mr-2"
              value="enableSelling"
              title={__('Enable Selling', 'bit-integrations')}
              subTitle={__('Enable selling for this vendor', 'bit-integrations')}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={dokanConf.actions?.publishProduct || false}
              onChange={(e) => actionHandler(e, 'vendorCheckbox')}
              className="wdt-200 mt-4 mr-2"
              value="publishProduct"
              title={__('Publish Product Directly', 'bit-integrations')}
              subTitle={__('Publish product of this vendor directly', 'bit-integrations')}
              isInfo={!isPro}
            />
            <TableCheckBox
              checked={dokanConf.actions?.featureVendor || false}
              onChange={(e) => actionHandler(e, 'vendorCheckbox')}
              className="wdt-200 mt-4 mr-2"
              value="featureVendor"
              title={__('Make Vendor Featured', 'bit-integrations')}
              subTitle={__('Make this vendor featured', 'bit-integrations')}
              isInfo={!isPro}
            />
          </>
        )}
      </div>
    </>
  )
}
