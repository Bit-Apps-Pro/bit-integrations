import { Link } from 'react-router'
import Table from '../Utilities/Table'
import { __ } from '../../Utils/i18nwrap'
import TagFilterBar from './TagFilterBar'

function IntegrationsTableView({
  cols,
  filteredIntegrations,
  setTableCols,
  setBulkDelete,
  setBulkTagAssign,
  selectedTags,
  tags,
  onToggleTagFilter,
  onOpenEditTagModal,
  onConfirmDeleteTag,
  onOpenTagPicker,
  onClearTagFilters,
  onPreloadFlowBuilder
}) {
  return (
    <>
      <div className="af-header flx flx-between">
        <h2>{__('Integrations', 'bit-integrations')}</h2>

        <Link
          to="/flow/new"
          className="btn btcd-btn-lg purple purple-sh"
          onMouseEnter={onPreloadFlowBuilder}
          onFocus={onPreloadFlowBuilder}
          onTouchStart={onPreloadFlowBuilder}
          onMouseDown={onPreloadFlowBuilder}>
          {__('Create Integration', 'bit-integrations')}
        </Link>
      </div>

      <div className="forms">
        <Table
          className="f-table btcd-all-frm"
          height="60vh"
          columns={cols}
          data={filteredIntegrations}
          rowSeletable
          resizable
          columnHidable
          setTableCols={setTableCols}
          setBulkDelete={setBulkDelete}
          setBulkTagAssign={setBulkTagAssign}
          search
          searchPlaceholder={__('Search integrations...', 'bit-integrations')}
          bulkDeleteLabel={__('Delete Integration', 'bit-integrations')}
          bulkTagAssignLabel={__('Bulk Tag Assign', 'bit-integrations')}
          topLeftContent={
            <TagFilterBar
              selectedTags={selectedTags}
              tags={tags}
              onToggleTagFilter={onToggleTagFilter}
              onOpenEditTagModal={onOpenEditTagModal}
              onConfirmDeleteTag={onConfirmDeleteTag}
              onOpenTagPicker={onOpenTagPicker}
              onClearTagFilters={onClearTagFilters}
            />
          }
        />
      </div>
    </>
  )
}

export default IntegrationsTableView
