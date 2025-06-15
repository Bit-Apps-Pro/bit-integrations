import { useState } from 'react'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import DropDown from '../../Utilities/DropDown'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function WooCommerceProductActions({ wcConf, setWcConf, formFields }) {
  const [actionMdl, setActionMdl] = useState({ show: false })

  const handleActionInput = (type, value) => {
    const newConf = deepCopy(wcConf)
    if (!newConf.actions.product) newConf.actions.product = {}
    if (value) {
      newConf.actions.product[type] = value
    } else {
      delete newConf.actions.product[type]
    }
    setWcConf(newConf)
  }

  return (
    <div className="pos-rel">
      <div className="d-flx flx-wrp">
        <TableCheckBox
          className="wdt-200 mt-4 mr-2"
          value="price"
          title={__('Downloadable', 'bitofrm')}
          subTitle={__('Downloadable products give access to a file upon purchase.', 'bit-integrations')}
          checked={wcConf.actions?.product?.downloadable || false}
          onChange={() => setActionMdl({ show: 'downloadable' })}
        />
      </div>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'downloadable'}
        close={() => setActionMdl({ show: false })}
        action={() => setActionMdl({ show: false })}
        title={__('Downloadable Product', 'bit-integrations')}
      >
        <DropDown
          action={val => handleActionInput('downloadable', val)}
          value={wcConf.actions?.product?.downloadable}
          title={<span className="f-m">{__('Select File Upload Fields', 'bit-integrations')}</span>}
          titleClassName="w-10 mt-2"
          placeholder={__('Select Fields', 'bit-integrations')}
          className="w-a"
          options={formFields.filter(fld => fld.type === 'file').map(fl => ({ label: fl.name, value: fl.key }))}
          isMultiple
        />
      </ConfirmModal>
    </div>
  )
}
