import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { __ } from '../../../Utils/i18nwrap'
import ZohoRecruitNewRecord from './ZohoRecruitNewRecord'
import ZohoRecruitRelatedRecord from './ZohoRecruitRelatedRecord'
import { refreshModules } from './ZohoRecruitCommonFunc'
import CloseIcn from '../../../Icons/CloseIcn'

export default function ZohoRecruitIntegLayout({ tab, settab, formID, formFields, handleInput, recruitConf, setRecruitConf, isLoading, setIsLoading, setSnackbar }) {
  const addNewRelatedTab = () => {
    const newConf = { ...recruitConf }

    if (newConf.relatedlists.length < 3) {
      newConf.relatedlists.push({
        actions: {},
        field_map: [{ formField: '', zohoFormField: '' }],
        module: '',
        upload_field_map: [{ formField: '', zohoFormField: '' }],
      })
    }

    setRecruitConf({ ...newConf })
  }

  const removeRelatedTab = indx => {
    const newConf = { ...recruitConf }

    newConf.relatedlists.splice(indx, 1)

    if (!newConf.relatedlists.length) settab(0)

    setRecruitConf({ ...newConf })
  }
  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">Module:</b>
      <select onChange={handleInput} name="module" value={recruitConf.module} className="btcd-paper-inp w-5" disabled={tab === 1}>
        <option value="">{__('Select Module', 'bit-integrations')}</option>
        {
          recruitConf.default && recruitConf.default.modules && Object.keys(recruitConf.default.modules).map(moduleApiName => (
            <option key={moduleApiName} value={moduleApiName}>
              {recruitConf.default.modules[moduleApiName].pl}
            </option>
          ))
        }
      </select>
      {tab === 0 && <button onClick={() => refreshModules(formID, recruitConf, setRecruitConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Recruit Modules"' }} type="button" disabled={isLoading}>&#x21BB;</button>}
      <br />
      <Tabs
        selectedTabClassName="s-t-l-active"
      >
        <TabList className="flx mt-2 mb-0">
          <Tab className="btcd-s-tab-link">
            {__('New Record', 'bit-integrations')}
          </Tab>
          {recruitConf?.relatedlists && recruitConf.relatedlists.map((_, indx) => (
            <>
              <Tab key={`rel-${indx + 64}`} className="btcd-s-tab-link">
                {__('Related List #', 'bit-integrations')}
                {indx + 1}
              </Tab>
              <button onClick={() => removeRelatedTab(indx)} className="icn-btn" aria-label="delete-relatedlist" type="button"><CloseIcn size="14" /></button>
            </>
          ))}
          {recruitConf.relatedlists.length < 3 && <button onClick={addNewRelatedTab} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Add More Related List"' }} type="button">+</button>}
        </TabList>
        <div className="btcd-hr" />
        <TabPanel>
          <ZohoRecruitNewRecord
            tab={tab}
            settab={settab}
            formID={formID}
            formFields={formFields}
            recruitConf={recruitConf}
            setRecruitConf={setRecruitConf}
            isLoading={isLoading}
            setSnackbar={setSnackbar}
          />
        </TabPanel>
        {
          recruitConf?.relatedlists && recruitConf.relatedlists.map((_, indx) => (
            <TabPanel key={`rlt-${indx + 89}`}>
              <ZohoRecruitRelatedRecord
                indx={indx}
                tab={tab}
                settab={settab}
                formID={formID}
                formFields={formFields}
                recruitConf={recruitConf}
                setRecruitConf={setRecruitConf}
                handleInput={handleInput}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setSnackbar={setSnackbar}
              />
            </TabPanel>
          ))
        }
      </Tabs>
    </>
  )
}
