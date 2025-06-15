import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { refreshMailpoetHeader, refreshNewsLetter } from './MailPoetCommonFunc'
import MailPoetFieldMap from './MailPoetFieldMap'

export default function MailPoetIntegLayout({ formID, formFields, mailPoetConf, setMailPoetConf, isLoading, setIsLoading, setSnackbar }) {
  const lists = (val) => {
    const newConf = { ...mailPoetConf }
    if (val) {
      newConf.lists = val ? val.split(',') : []
      refreshMailpoetHeader(newConf, setMailPoetConf, setIsLoading, setSnackbar)
    } else {
      delete newConf.lists
    }
    setMailPoetConf({ ...newConf })
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('List: ', 'bit-integrations')}</b>
        <MultiSelect
          defaultValue={mailPoetConf?.lists}
          className="btcd-paper-drpdwn w-6"
          options={mailPoetConf?.default?.newsletterList && Object.keys(mailPoetConf.default.newsletterList).map(newsletter => ({ label: mailPoetConf.default.newsletterList[newsletter].newsletterName, value: mailPoetConf.default.newsletterList[newsletter].newsletterId }))}
          onChange={val => lists(val)}
        />
        <button onClick={() => refreshNewsLetter(formID, mailPoetConf, setMailPoetConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh MailPoet List', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {mailPoetConf?.lists
        && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('MailPoet Fields', 'bit-integrations')}</b></div>
            </div>

            {mailPoetConf.field_map.map((itm, i) => (
              <MailPoetFieldMap
                key={`mailpoet-m-${i + 9}`}
                i={i}
                field={itm}
                mailPoetConf={mailPoetConf}
                formFields={formFields}
                setMailPoetConf={setMailPoetConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(mailPoetConf.field_map.length, mailPoetConf, setMailPoetConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
          </>
        )}
    </>
  )
}
