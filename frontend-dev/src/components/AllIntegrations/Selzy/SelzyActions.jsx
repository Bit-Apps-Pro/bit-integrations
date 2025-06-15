import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'

function SelzyActions({ selzyConf, setSelzyConf }) {
  const [actionModel, setActionModel] = useState({ show: false })
  const actionHandler = (e, type) => {
    const newConf = { ...selzyConf }
    if (type === 'option') {
      if (e.target?.checked) {
        newConf.actions.option = true
        setActionModel({ show: 'option' })
      } else {
        setActionModel({ show: false })
        delete newConf.actions.option
      }
    }
    if (type === 'overwrite') {
      if (e.target?.checked) {
        newConf.actions.overwrite = true
        setActionModel({ show: 'overwrite' })
      } else {
        setActionModel({ show: false })
        delete newConf.actions.overwrite
      }
    }

    setSelzyConf({ ...newConf })
  }
  const closeModel = () => {
    setActionModel({ show: false })
  }
  const handleOption = (e) => {
    const newConf = { ...selzyConf }
    const { name, value } = e.target
    if (value !== '') {
      newConf[name] = value
    }
    setSelzyConf(newConf)
  }
  return (
    <>
      <div>
        <TableCheckBox checked={selzyConf?.actions?.option || false} onChange={(e) => actionHandler(e, 'option')} className="wdt-200 mt-4 mr-2" value="option " title={__('Add Option')} subTitle={__('Customize you subcription')} />

        <ConfirmModal
          className="custom-conf-mdl"
          mainMdlCls="o-v"
          btnClass="blue"
          btnTxt={__('Ok')}
          show={actionModel.show === 'option'}
          close={closeModel}
          action={closeModel}
          title={__('Subscribe Option')}
        >
          <div className="btcd-hr mt-2 mb-2" />
          <div className="p-1">
            <div className="my-2 w-100 ">
              {__('Customize your subscription')}
            </div>
            <select name="option" value={selzyConf.option} onChange={handleOption} className="btcd-paper-inp w-100 mx-0">
              <option value="">{__('Select Option')}</option>
              {
                selzyConf?.doubleOption && selzyConf?.doubleOption.map(option => (
                  <option key={option.key} value={option.key}>
                    {option.name}
                  </option>
                ))
              }
            </select>
          </div>

        </ConfirmModal>

      </div>
      <div>
        <TableCheckBox checked={selzyConf?.actions?.overwrite || false} onChange={(e) => actionHandler(e, 'overwrite')} className="wdt-200 mt-4 mr-2" value="overwrite" title={__('Overwrite')} subTitle={__('Field and tag rewriting mode')} />

        <ConfirmModal
          className="custom-conf-mdl"
          mainMdlCls="o-v"
          btnClass="blue"
          btnTxt={__('Ok')}
          show={actionModel.show === 'overwrite'}
          close={closeModel}
          action={closeModel}
          title={__('Subscribe overwrite')}
        >
          <div className="btcd-hr mt-2 mb-2" />
          <div className="p-1">
            <div className="my-2 w-100 ">
              {__('Field and tag rewriting mode')}
            </div>
            <select name="overwrite" value={selzyConf.overwrite} onChange={handleOption} className="btcd-paper-inp w-100 mx-0">
              <option value="">{__('Select Option')}</option>
              {
                selzyConf?.overwriteOption && selzyConf?.overwriteOption.map(option => (
                  <option key={option.key} value={option.key}>
                    {option.name}
                  </option>
                ))
              }
            </select>
          </div>

        </ConfirmModal>

      </div>
    </>
  )
}

export default SelzyActions
