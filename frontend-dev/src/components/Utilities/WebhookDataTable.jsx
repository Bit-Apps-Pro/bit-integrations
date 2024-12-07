import { __ } from '../../Utils/i18nwrap'

export default function WebhookDataTable({ data, flow, setFlow }) {
  const handleChange = (e, indx) => {
    const { value, name } = e.target
    const newConf = { ...flow }
    newConf.triggerDetail.data[indx] = { ...newConf.triggerDetail.data[indx], type: value }
    setFlow(newConf)
  }

  const types = [
    { key: 'text', value: 'text' },
    { key: 'boolean', value: 'true/false' },
    { key: 'email', value: 'email' },
    { key: 'select', value: 'select' },
    { key: 'radio', value: 'radio' },
    { key: 'checkbox', value: 'checkbox' },
    { key: 'number', value: 'number' },
    { key: 'tel', value: 'tel' },
    { key: 'textarea', value: 'textarea' },
    { key: 'datepicker', value: 'datepicker' },
    { key: 'url', value: 'url' },
    { key: 'file', value: 'file' },
    { key: 'array', value: 'array' },
    { key: 'object', value: 'object' },
    { key: 'NULL', value: 'null' },
    { key: 'unknown', value: 'unknown' }
  ]

  return (
    <div className="bg-white max-h-96 rounded border my-3 table-webhook-div">
      <table className="border-collapse table-fixed webhook-table-scroll">
        <thead>
          <tr className="btcd-drawer-title tbl-webhook-head">
            <th className="w-7">{__('Field', 'bit-integrations')}</th>
            <th className="w-3">{__('Type', 'bit-integrations')}</th>
          </tr>
        </thead>
        <tbody className="body-half-screen">
          {Object.values(data).map(({ name, label, type }, indx) => (
            <tr key={name} className="tbl-webhook-tdtxt">
              <td className="break-words w-7 d-blk">{label}</td>
              <td className="break-words txt-right-imp w-3 d-blk">
                <select
                  name="type"
                  value={type}
                  onChange={(e) => handleChange(e, indx)}
                  className="btcd-paper-inp">
                  {types.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.value}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
