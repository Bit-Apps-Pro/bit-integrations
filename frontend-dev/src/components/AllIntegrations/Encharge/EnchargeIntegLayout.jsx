// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import Cooltip from '../../Utilities/Cooltip'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import EnchargeFieldMap from './EnchargeFieldMap'

export default function EnchargeIntegLayout({ formID, formFields, enchargeConf, setEnchargeConf }) {
  const handleInput = (e) => {
    const newConf = { ...enchargeConf }
    newConf[e.target.name] = e.target.value
    setEnchargeConf(newConf)
  }
  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Tags:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5 mt-1" onChange={handleInput} name="tags" value={enchargeConf.tags || ''} type="text" placeholder={__('tag-1, tag-2', 'bit-integrations')} />
        <Cooltip width={250} icnSize={17} className="ml-2">
          <div className="txt-body">
            Tags separate with comma
          </div>
        </Cooltip>
      </div>
      {enchargeConf?.default?.fields !== 0
        && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('Encharge Fields', 'bit-integrations')}</b></div>
            </div>

            {enchargeConf.field_map.map((itm, i) => (
              <EnchargeFieldMap
                key={`sendinblue-m-${i + 9}`}
                i={i}
                field={itm}
                enchargeConf={enchargeConf}
                formFields={formFields}
                setEnchargeConf={setEnchargeConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(enchargeConf.field_map.length, enchargeConf, setEnchargeConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
          </>
        )}
    </>
  )
}
