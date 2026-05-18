export const modules = [{ label: 'Add Row', value: 'add_row' }]

export const AddRowFields = [
  { key: 'table_id', label: 'Table ID', required: true },
  { key: 'row_data', label: 'Row Data (JSON)', required: true },
]

export const WpDataTablesStaticData = {
  modules,
  add_row: AddRowFields,
}
