
import { __ } from "../../Utils/i18nwrap";
import MtInput from "./MtInput";
import { create } from 'mutative'

export default function CustomFieldKey({ field, index, conf, handle, setConf, fieldValue, fieldLabel, className }) {
    const handleCustomField = (event, index, setConf, fieldValue) => {
        setConf(prevConf => create(prevConf, draftConf => {
            draftConf.field_map[index][fieldValue] = event.target.value
        }))
    }

    return (
        <MtInput
            onChange={e => handleCustomField(e, index, setConf, fieldValue)}
            label={__(fieldLabel, 'bit-integrations')}
            className={className}
            type="text"
            value={field[fieldValue]}
            placeholder={__(fieldLabel, 'bit-integrations')}
        />
    )
}
