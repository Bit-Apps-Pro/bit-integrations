import { Panel, Tab, Tabs } from '@bumaga/tabs'
import { __ } from '../../../Utils/i18nwrap'
import FreshSalesNewRecord from './FreshSalesNewRecord'
import FreshSalesRelatedRecord from './FreshSalesRelatedRecord'
import CloseIcn from '../../../Icons/CloseIcn'

export default function FreshSalesIntegLayout({ tab, settab, formID, formFields, handleInput, freshSalesConf, setFreshSalesConf, isLoading, setIsLoading, setSnackbar }) {
  const addNewRelatedTab = () => {
    if (freshSalesConf.relatedlists.length < 2) {
      const newConf = { ...freshSalesConf }
      newConf.relatedlists.push({
        actions: {},
        field_map: [{ formField: '', freshSalesFormField: '' }],
        moduleData: {},
        module: '',
      })
      setFreshSalesConf({ ...newConf })
    }
  }

  const removeRelatedTab = indx => {
    const newConf = { ...freshSalesConf }
    newConf.relatedlists.splice(indx, 1)

    if (!newConf.relatedlists.length) settab(0)
    setFreshSalesConf({ ...newConf })
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Module:', 'bit-integrations')}</b>
      <select onChange={handleInput} name="module" value={freshSalesConf.moduleData.module} className="btcd-paper-inp w-5" disabled={tab}>
        <option value="">{__('Select Module', 'bit-integrations')}</option>
        {
          Object.keys(freshSalesConf.default.modules).map(moduleApiName => (
            <option key={moduleApiName} value={moduleApiName}>
              {moduleApiName}
            </option>
          ))
        }
      </select>
      <br />
      <div>
        <Tabs>
          <div className="flx mt-2">
            <Tab>
              <button className={`btcd-s-tab-link ${tab === 0 && 's-t-l-active'}`} type="button">
                {__('New Record', 'bit-integrations')}
              </button>
            </Tab>

            {freshSalesConf?.relatedlists && freshSalesConf.relatedlists.map((_, indx) => (
              <>
                <Tab key={`t-${indx * 3}`}>
                  <button className={`btcd-s-tab-link ${tab === indx + 1 && 's-t-l-active'}`} type="button">
                    {__('Related List #', 'bit-integrations')}
                    {indx + 1}
                  </button>
                </Tab>
                <button onClick={() => removeRelatedTab(indx)} className="icn-btn" aria-label="delete-relatedlist" type="button"><CloseIcn size="14" /></button>
              </>
            ))}
            {freshSalesConf.relatedlists.length < 2 && freshSalesConf.default.modules[freshSalesConf.moduleData.module]?.relatedlists && <button onClick={addNewRelatedTab} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Add More Related List', 'bit-integrations')}'` }} type="button">+</button>}
          </div>
          <div className="btcd-hr" />

          <Panel>
            <FreshSalesNewRecord
              tab={tab}
              settab={settab}
              formFields={formFields}
              freshSalesConf={freshSalesConf}
              setFreshSalesConf={setFreshSalesConf}
              handleInput={handleInput}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setSnackbar={setSnackbar}
            />
          </Panel>
          {/* {
            freshSalesConf?.relatedlists && freshSalesConf.relatedlists.map((_, indx) => (
              <Panel key={`p-${indx + 2.4}`}>
                <FreshSalesRelatedRecord
                  indx={indx}
                  tab={tab}
                  settab={settab}
                  formID={formID}
                  formFields={formFields}
                  freshSalesConf={freshSalesConf}
                  setFreshSalesConf={setFreshSalesConf}
                  handleInput={handleInput}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setSnackbar={setSnackbar}
                />
              </Panel>
            ))
          } */}
        </Tabs>
      </div>
      <br />
    </>
  )
}
