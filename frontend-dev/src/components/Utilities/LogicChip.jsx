import { __ } from '../../Utils/i18nwrap'

function LogicChip({ logic, nested, onChange }) {
  return (
    <>
      <div style={{ height: nested ? 5 : 10 }}>
        <svg height="60" width="50">
          <line x1="20" y1={nested ? 6 : 10} x2="20" y2="0" style={{ stroke: '#b9c5ff', strokeWidth: 1 }} />
        </svg>
      </div>

      <div>
        <select value={logic} onChange={onChange} className={`btcd-logic-chip ${nested && 'scl-7 op-8'}`}>
          <option value="or">{__('OR', 'bit-integrations')}</option>
          <option value="and">{__('AND', 'bit-integrations')}</option>
        </select>
      </div>

      <div style={{ height: nested ? 5 : 10 }}>
        <svg height="60" width="50">
          <line x1="20" y1={nested ? 6 : 10} x2="20" y2="0" style={{ stroke: '#b9c5ff', strokeWidth: 1 }} />
        </svg>
      </div>
    </>
  )
}

export default LogicChip
