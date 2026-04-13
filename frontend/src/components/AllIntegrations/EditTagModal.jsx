import { __ } from '../../Utils/i18nwrap'

function EditTagModal({ show, editTagName, onEditTagNameChange, onClose, onSubmit }) {
  if (!show) {
    return null
  }

  return (
    <div className="tag-modal-overlay" onClick={onClose}>
      <div
        className="tag-modal-content tag-picker-modal-content tag-edit-modal-content"
        onClick={e => e.stopPropagation()}>
        <div className="tag-picker-header tag-edit-header">
          <h3 className="tag-modal-title">{__('Edit Tag', 'bit-integrations')}</h3>
          <p className="tag-picker-subtitle">
            {__('Rename this tag for filters and integration assignments.', 'bit-integrations')}
          </p>
        </div>

        <div className="tag-picker-field-wrap tag-edit-field-wrap">
          <label className="tag-modal-label">{__('Tag Name', 'bit-integrations')}</label>
          <input
            type="text"
            value={editTagName}
            onChange={e => onEditTagNameChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onSubmit()
              }
            }}
            placeholder={__('Enter tag name...', 'bit-integrations')}
            maxLength={20}
            autoFocus
            className="tag-modal-input tag-edit-input"
          />
          <p className="tag-picker-counter tag-edit-counter">
            {`${editTagName.length}/20 ${__('characters', 'bit-integrations')}`}
          </p>
        </div>

        <div className="tag-modal-actions tag-picker-actions tag-edit-actions">
          <button type="button" onClick={onClose} className="tag-modal-btn-cancel tag-picker-btn-cancel">
            {__('Cancel', 'bit-integrations')}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="tag-modal-btn-create tag-picker-btn-primary tag-edit-btn-primary">
            {__('Update Tag', 'bit-integrations')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditTagModal
