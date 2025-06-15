import { __ } from '../../../Utils/i18nwrap'
import FreshSalesNewRecord from './FreshSalesNewRecord'

export default function FreshSalesIntegLayout({
  formID,
  formFields,
  handleInput,
  freshSalesConf,
  setFreshSalesConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Module:', 'bit-integrations')}</b>
      <select
        onChange={handleInput}
        name="module"
        value={freshSalesConf.moduleData.module}
        className="btcd-paper-inp w-5"
        disabled={isLoading}>
        <option value="">{__('Select Module', 'bit-integrations')}</option>
        {Object.keys(freshSalesConf.default.modules).map((moduleApiName) => (
          <option key={moduleApiName} value={moduleApiName}>
            {moduleApiName}
          </option>
        ))}
      </select>
      <br />
      <div>
        {freshSalesConf.moduleData.module !== 'Account' && <div className="btcd-hr" />}
        <FreshSalesNewRecord
          formFields={formFields}
          freshSalesConf={freshSalesConf}
          setFreshSalesConf={setFreshSalesConf}
          handleInput={handleInput}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
      </div>
      <br />
    </>
  )
}
