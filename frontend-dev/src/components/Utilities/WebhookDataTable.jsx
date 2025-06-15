export default function WebhookDataTable({ data, flow, setFlow }) {
  const handleChange = (e, indx) => {
    const { value, name } = e.target
    const newConf = { ...flow }
    newConf.triggerDetail.data[indx] = { ...newConf.triggerDetail.data[indx], type: value }
    setFlow(newConf)
  }

  const types = [
    { key: 'text', value: 'text' },
    { key: 'email', value: 'email' },
    { key: 'file', value: 'file' },
    { key: 'array', value: 'array' },
    { key: 'object', value: 'object' },
  ]

  return (
    <div className="bg-white max-h-96 rounded border my-3 table-webhook-div">
      <table className="border-collapse table-fixed webhook-table-scroll">
        <thead>
          <tr className="btcd-drawer-title tbl-webhook-head">
            <th className="w-7">Value</th>
            <th className="w-3">Type</th>
          </tr>
        </thead>
        <tbody className="body-half-screen">
          {Object.values(data).map(({ name, label, type }, indx) => (
            <tr
              key={name}
              className="tbl-webhook-tdtxt"
            >
              <td className="break-words w-7 d-blk">{label}</td>
              <td className="break-words txt-right-imp w-3 d-blk">
                <select name="type" value={type} onChange={(e) => handleChange(e, indx)} className="btcd-paper-inp">

                  {
                    types.map(item => (
                      <option key={item.value} value={item.value}>
                        {item.value}
                      </option>
                    ))
                  }
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
