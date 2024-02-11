import Editor, { useMonaco } from "@monaco-editor/react";
import { memo, useRef } from "react";
import toast from "react-hot-toast";
import { __ } from '../../../Utils/i18nwrap';
import "./style.scss"
import { useAsyncDebounce } from "react-table";
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useRecoilValue } from "recoil";
import { $btcbi } from "../../../GlobalStates";
import { SmartTagField } from "../../../Utils/StaticData/SmartTagField";
import Note from '../../Utilities/Note'

const emptyJson = `{ 
    // write here your custom field map 
  }`

function JsonEditor({ data = emptyJson, onChange, formFields = [] }) {
    const btcbi = useRecoilValue($btcbi)
    const { isPro } = btcbi
    const editorRef = useRef(null)
    const monaco = useMonaco()

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor
        prettify()
    }

    const prettify = () => {
        editorRef.current.getAction('editor.action.formatDocument').run()
    }

    const handleEditorValidation = useAsyncDebounce((markers) => {
        markers.forEach((marker) => toast.error(marker.message))
    }, 1000)

    const handlePasteFormField = (field) => {
        if (!field) return
        const editor = editorRef.current
        if (editor) {
            const position = editor.getPosition()
            editor.executeEdits("", [
                {
                    range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                    text: `"${field}": "\${${field}}",`,
                    forceMoveMarkers: true,
                },
            ])
        }
    }

    const info = `<h4>Custom Json Raw Code Setup</h4>
    <ul>
        <li>Remove "// write here your custom field map" & Write your code between {  } or [  ].</li>
        <li>Remove trailing comma from last property of object which is underlined by red color</li>
    </ul>`

    return (
        <div className="json-editor my-3 py-3">
            <Editor
                height="300px"
                width="60%"
                defaultLanguage="json"
                defaultValue={typeof data === 'object' ? JSON.stringify(data) : data}
                theme="vs-dark"
                onValidate={handleEditorValidation}
                onMount={handleEditorDidMount}
                onChange={onChange}
            />
            <div className="form-fields p-atn">
                <select className="btcd-paper-inp mr-2" name="formField" value={''} onChange={(ev) => handlePasteFormField(ev.target.value)}>
                    <option value="">{__('Select Field', 'bit-integrations')}</option>
                    <optgroup label="Form Fields">
                        {
                            formFields?.map(f => (
                                <option key={`ff-rm-${f.name}`} value={f.name}>
                                    {f.label}
                                </option>
                            ))
                        }
                    </optgroup>
                    <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
                        {isPro && SmartTagField?.map(f => (
                            <option key={`ff-rm-${f.name}`} value={`"\${${f.name}}"`}>
                                {f.label}
                            </option>
                        ))}
                    </optgroup>
                </select>
                <Note note={info} />
            </div>
            <button
                onClick={prettify}
                className="prettier-btn btn btcd-btn-sm sh-sm flx"
                type="button"
            >
                {__('{ } Prettify', 'bit-integrations')}
            </button>
        </div>
    );
}

export default memo(JsonEditor)
