import { __, sprintf } from '../../Utils/i18nwrap'

export default function Note({ note, isInstruction = false, isHeadingNull = false, maxWidth = '450px' }) {
  return (
    <div className="note" style={{ maxWidth: maxWidth }}>
      {!isHeadingNull && (
        <h4 className="mt-0">
          {isInstruction ? __('Instruction', 'bit-integrations') : __('Note', 'bit-integrations')}
        </h4>
      )}
      <div
        className="note-text"
        dangerouslySetInnerHTML={{ __html: __(note, 'bit-integrations') }}
      />
    </div>
  )
}
