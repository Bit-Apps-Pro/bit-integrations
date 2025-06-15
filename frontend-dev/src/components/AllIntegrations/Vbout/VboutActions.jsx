/* eslint-disable no-param-reassign */

import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'

export default function VboutActions({ vboutConf, setVboutConf }) {

    const actionHandler = (e, type) => {
        const newConf = { ...vboutConf }
        if (type === 'update') {
            if (e.target.checked) {
                newConf.actions.update = true
            } else {
                delete newConf.actions.update
            }
        }


        setVboutConf({ ...newConf })
    }




    return (
        <>
            <div className="pos-rel d-flx w-8">
                <TableCheckBox checked={vboutConf.actions?.update || false} onChange={(e) => actionHandler(e, 'update')} className="wdt-200 mt-4 mr-2" value="update" title={__('Update Contact', 'bit-integrations')} subTitle={__('Update Responses with Vbout exist Contact?', 'bit-integrations')} />
            </div>



        </>


    )
}
