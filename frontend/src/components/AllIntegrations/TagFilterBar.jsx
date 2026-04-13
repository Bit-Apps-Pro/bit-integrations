import { __ } from '../../Utils/i18nwrap'

function TagFilterBar({
  selectedTags,
  tags,
  onToggleTagFilter,
  onOpenEditTagModal,
  onConfirmDeleteTag,
  onOpenTagPicker,
  onClearTagFilters
}) {
  return (
    <div className="tag-filter-inline table-top-tag-filter">
      <h4 className="tag-filter-title">{__('Filter by Tags', 'bit-integrations')}</h4>
      <div className="tag-buttons-container">
        <button
          type="button"
          onClick={() => onToggleTagFilter('ALL')}
          className={`tag-btn-all ${selectedTags.length === 0 ? 'active' : ''}`}>
          {__('ALL', 'bit-integrations')}
        </button>

        {tags.map(tag => {
          const isSelected = selectedTags.includes(tag.id)
          return (
            <div key={tag.id} className={`tag-pill ${isSelected ? 'active show-actions' : ''}`}>
              <button type="button" onClick={() => onToggleTagFilter(tag.id)} className="tag-btn">
                {tag.name}
              </button>
              <div className="tag-pill-actions">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    onOpenEditTagModal(tag)
                  }}
                  className="tag-icon-btn"
                  title={__('Edit tag', 'bit-integrations')}>
                  <span className="btcd-icn icn-edit" />
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    onConfirmDeleteTag(tag.id)
                  }}
                  className="tag-icon-btn delete"
                  title={__('Delete tag', 'bit-integrations')}>
                  <span className="btcd-icn icn-trash-2" />
                </button>
              </div>
            </div>
          )
        })}

        <button
          type="button"
          onClick={onOpenTagPicker}
          className="tag-add-btn"
          title={__('Add or select tag', 'bit-integrations')}>
          +
        </button>
      </div>
      {selectedTags.length > 0 && (
        <button type="button" onClick={onClearTagFilters} className="tag-clear-btn">
          <span className="tag-clear-icon">&times;</span>
          {__('Clear filter', 'bit-integrations')}
        </button>
      )}
    </div>
  )
}

export default TagFilterBar
