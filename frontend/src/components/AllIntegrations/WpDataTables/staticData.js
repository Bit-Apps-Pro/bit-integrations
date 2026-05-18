import { __ } from '../../../Utils/i18nwrap'

export const modules = [
  {
    label: __('Add Row', 'bit-integrations'),
    name: 'add_row',
    is_pro: true
  }
]

export const AddRowFields = [
  { key: 'table_id', label: __('Table ID', 'bit-integrations'), required: true },
  { key: 'row_data', label: __('Row Data (JSON)', 'bit-integrations'), required: true }
]
