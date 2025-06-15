/* eslint-disable no-param-reassign */
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { refreshTemplate } from './SendinBlueCommonFunc'

export default function SendinBlueActions({ sendinBlueConf, setSendinBlueConf, setIsLoading, setSnackbar }) {
  const actionHandler = (e, type) => {
    const newConf = { ...sendinBlueConf }
    if (type === 'update') {
      if (e.target.checked) {
        newConf.actions.update = true
      } else {
        delete newConf.actions.update
      }
    }
    if (type === 'double_optin') {
      if (e.target.checked) {
        newConf.actions.double_optin = true
        newConf.templateId = ''
        newConf.redirectionUrl = ''
        refreshTemplate(newConf, setSendinBlueConf, setSnackbar)
      } else {
        delete newConf.actions.double_optin
        delete newConf.templateId
        delete newConf.redirectionUrl
      }
    }
    setSendinBlueConf({ ...newConf })
  }

  return (

    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={sendinBlueConf.actions?.update || false} onChange={(e) => actionHandler(e, 'update')} className="wdt-200 mt-4 mr-2" value="user_share" title={__('Update Sendinblue', 'bit-integrations')} subTitle={__('Update Responses with Sendinblue existing email?', 'bit-integrations')} />
      <TableCheckBox checked={sendinBlueConf.actions?.double_optin || false} onChange={(e) => actionHandler(e, 'double_optin')} className="wdt-200 mt-4 mr-2" value="double_optin" title={__('Double Opt-in', 'bit-integrations')} subTitle={__('Double Opt-In for confirm subscription.', 'bit-integrations')} />
    </div>
  )
}
