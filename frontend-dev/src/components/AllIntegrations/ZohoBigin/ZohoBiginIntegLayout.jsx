import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { useRecoilState } from 'recoil';
import { $actionConf } from '../../../GlobalStates';
import { __ } from '../../../Utils/i18nwrap'
import { refreshModules, refreshPipelinesLayout } from './ZohoBiginCommonFunc'
import ZohoBiginNewRecord from './ZohoBiginNewRecord'

export default function ZohoBiginIntegLayout({ tab, settab, formID, handleInput, isLoading, setIsLoading, setSnackbar }) {
  const [biginConf, setBiginConf] = useRecoilState($actionConf)

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Module:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="module" value={biginConf.module} className="btcd-paper-inp w-5" disabled={tab === 1}>
        <option value="">{__('Select Module', 'bit-integrations')}</option>
        {
          biginConf.default && biginConf.default.modules && Object.values(biginConf.default.modules).map(module => (
            <option key={module.api_name} value={module.api_name}>
              {module.plural_label}
            </option>
          ))
        }
      </select>
      {tab === 0 && <button onClick={() => refreshModules(formID, biginConf, setBiginConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Bigin Modules', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>}
      {biginConf?.module === 'Deals' && !isLoading &&
        <>
          <br />
          <br />
          <b className="wdt-200 d-in-b">{__('Select Layout:', 'bit-integrations')}</b>
          <select onChange={handleInput} name="pLayout" value={biginConf.pLayout} className="btcd-paper-inp w-5" disabled={tab === 1}>
            <option value="">{__('Select Layout', 'bit-integrations')}</option>
            {
              biginConf.default && biginConf.default.pLayouts && Object.values(biginConf.default.pLayouts).map(layout => (
                <option key={layout.name} value={layout.name}>
                  {layout.display_label}
                </option>
              ))
            }
          </select>
          {tab === 0 && <button onClick={() => refreshPipelinesLayout(formID, biginConf, setBiginConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Pipelines Layouts', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>}
        </>}
      <br />
      <Tabs
        selectedTabClassName="s-t-l-active"
      >
        <TabList className="flx mt-2 mb-0">
          <Tab className="btcd-s-tab-link mb-0">
            {__('New Record', 'bit-integrations')}
          </Tab>
        </TabList>

        {/* {biginConf?.relatedlists && biginConf.relatedlists.map((_, indx) => (
            <>
              <Tab key={`rel-${indx + 64}`}>
                <button className={`btcd-s-tab-link ${tab === indx + 1 && 's-t-l-active'}`} type="button">
                  Related List #
                  {indx + 1}
                </button>
              </Tab>
              <button onClick={() => removeRelatedTab(indx)} className="icn-btn" aria-label="delete-relatedlist" type="button"><CloseIcn size="14" /></button>
            </>
          ))}
          {biginConf.relatedlists.length < 3 && <button onClick={addNewRelatedTab} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Add More Related List"' }} type="button">+</button>} */}
        <div className="btcd-hr" />

        <TabPanel>
          <ZohoBiginNewRecord
            tab={tab}
            settab={settab}
            formID={formID}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setSnackbar={setSnackbar}
          />
        </TabPanel>
        {/* {
          biginConf?.relatedlists && biginConf.relatedlists.map((_, indx) => (
            <TabPanel key={`rlt-${indx + 89}`}>
              <ZohoBiginRelatedRecord
                indx={indx}
                tab={tab}
                settab={settab}
                formID={formID}
                formFields={formFields}
                biginConf={biginConf}
                setBiginConf={setBiginConf}
                handleInput={handleInput}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setSnackbar={setSnackbar}
              />
            </TabPanel>
          ))
        } */}
      </Tabs>
    </>
  )
}
