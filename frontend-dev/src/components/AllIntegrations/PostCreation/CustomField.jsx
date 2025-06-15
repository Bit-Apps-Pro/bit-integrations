import { __ } from '../../../Utils/i18nwrap'
import CustomFieldMap from './CustomFieldMap'
import { addFieldMap } from './PostHelperFunction'

function CustomField({ formFields, postConf, setPostConf, acfFields, mbFields }) {
  return (
    <div>
      <div style={{ width: 900 }}>
        <div>
          <div>
            <div className="mt-3 mb-1">
              <b>{__('ACF Fields Mapping ', 'bit-integrations')}</b>
              {/* <button onClick={() => refreshAcfFields(data, setAcfFields, setAcfFileFields)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh ACF fields', 'bit-integrations')}'` }} type="button">&#x21BB;</button> */}
            </div>
            <div className="btcd-hr" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp">
                <b>{__('ACF Fields', 'bit-integrations')}</b>
              </div>
            </div>
          </div>
          {
            postConf?.acf_map?.map((itm, i) => (
              <CustomFieldMap
                key={`analytics-m-${i + 9}`}
                i={i}
                type="acf"
                field={itm}
                formFields={formFields}
                postConf={postConf}
                setPostConf={setPostConf}
                customFields={acfFields?.fields}
                fieldType="fields"
              />
            ))
          }

          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap('acf_map', postConf.acf_map.length, postConf, setPostConf)} className="icn-btn sh-sm" type="button">+</button></div>
        </div>
        <div>
          <div>
            <div className="mt-3 mb-1">
              <b>{__('ACF File Upload Fields Mapping', 'bit-integrations')}</b>
              {/* <button onClick={() => refreshAcfFields(postConf, setPostConf, setAcfFileFields)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh ACF fields', 'bit-integrations')}'` }} type="button">&#x21BB;</button> */}
            </div>
            <div className="btcd-hr" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp">
                <b>{__('ACF Fields', 'bit-integrations')}</b>
              </div>
            </div>
          </div>
          {
            postConf?.acf_file_map?.map((itm, i) => (
              <CustomFieldMap
                key={`analytics-m-${i + 9}`}
                i={i}
                type="acfFile"
                field={itm}
                formFields={formFields}
                postConf={postConf}
                setPostConf={setPostConf}
                customFields={acfFields?.files}
                fieldType="file"
              />
            ))
          }

          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap('acf_file_map', postConf?.acf_file_map?.length, postConf, setPostConf)} className="icn-btn sh-sm" type="button">+</button></div>
        </div>
        <br />
        <br />
        <div>
          <div>
            <div className="mt-3 mb-1">
              <b>{__('MetaBox Fields Mapping', 'bit-integrations')}</b>
              {/* <button onClick={() => refreshAcfFields(data, setAcfFields, setAcfFileFields)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh ACF fields', 'bit-integrations')}'` }} type="button">&#x21BB;</button> */}
            </div>
            <div className="btcd-hr" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp">
                <b>{__('MB Fields', 'bit-integrations')}</b>
              </div>
            </div>
          </div>
          {
            postConf?.metabox_map?.map((itm, i) => (
              <CustomFieldMap
                key={`analytics-m-${i + 9}`}
                i={i}
                type="metabox"
                field={itm}
                formFields={formFields}
                postConf={postConf}
                setPostConf={setPostConf}
                customFields={mbFields?.fields}
                fieldType="fields"
              />
            ))
          }

          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap('metabox_map', postConf.metabox_map.length, postConf, setPostConf)} className="icn-btn sh-sm" type="button">+</button></div>
        </div>

        <div>
          <div>
            <div className="mt-3 mb-1">
              <b>{__('MetaBox File Upload Fields Mapping', 'bit-integrations')}</b>
              {/* <button onClick={() => refreshAcfFields(postConf, setPostConf, setAcfFileFields)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh ACF fields', 'bit-integrations')}'` }} type="button">&#x21BB;</button> */}
            </div>
            <div className="btcd-hr" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp">
                <b>{__('MB Fields', 'bit-integrations')}</b>
              </div>
            </div>
          </div>
          {
            postConf?.metabox_file_map?.map((itm, i) => (
              <CustomFieldMap
                key={`analytics-m-${i + 9}`}
                i={i}
                type="metaboxFile"
                field={itm}
                formFields={formFields}
                postConf={postConf}
                setPostConf={setPostConf}
                customFields={mbFields?.files}
                fieldType="file"

              />
            ))
          }

          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap('metabox_file_map', postConf.metabox_file_map.length, postConf, setPostConf)} className="icn-btn sh-sm" type="button">+</button></div>
        </div>
      </div>
    </div>
  )
}

export default CustomField
