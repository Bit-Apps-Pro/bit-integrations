import { useEffect } from "react";
import { __ } from "../../../Utils/i18nwrap";
import { addFieldMap } from "./IntegrationHelpers";
import { getAllLevels } from "./RestrictContentCommonFunc";
import RestrictContentFieldMap from "./RestrictContentFieldMap";
import Cooltip from '../../Utilities/Cooltip'
import Note from "../../Utilities/Note";

export default function RestrictContentIntegLayout({ formFields, handleInput, restrictConf, setRestrictConf, isLoading, setIsLoading, setSnackbar }) {
    const handleInputAction = (e) => {
        const newConf = { ...restrictConf };
        const { name, value } = e.target;
        if (e.target.value !== "") {
            newConf[name] = e.target.value;
        } else {
            delete newConf[name];
        }
        setRestrictConf(newConf);
    };

    return (
        <>
            <br />
            <b className="wdt-200 d-in-b">{__("Action:", "bit-integrations")}</b>
            <select onChange={handleInputAction} name="actionName" value={restrictConf?.actionName} className="btcd-paper-inp w-5">
                <option value="">{__("Select Action", "bit-integrations")}</option>
                {restrictConf?.actionLists &&
                    restrictConf.actionLists.map(({ key, label }) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
            </select>
            <br />
            <br />
            {restrictConf?.actionName && (
                <>
                    <b className="wdt-200 d-in-b">{__("Membership Level:", "bit-integrations")}</b>
                    <select onChange={handleInput} name="level_id" value={restrictConf.level_id} className="btcd-paper-inp w-5">
                        <option value="">{__("Select Level", "bit-integrations")}</option>
                        {restrictConf.actionName === "remove-member-level" && (
                            <option value="all">{__("All memberships", "bit-integrations")}</option>
                        )}
                        {restrictConf?.default?.levellists &&
                            restrictConf.default.levellists.map(({ id, name }) => (
                                <option key={id} value={id}>
                                    {name}
                                </option>
                            ))}
                    </select>
                    <button
                        onClick={() => getAllLevels(restrictConf, setRestrictConf, setIsLoading)}
                        className="icn-btn sh-sm ml-2 mr-2 tooltip"
                        style={{ "--tooltip-txt": `'${__("Fetch All Level", "bit-integrations")}'` }}
                        type="button"
                        disabled={isLoading}
                    >
                        &#x21BB;
                    </button>
                </>
            )}
            <br />
            <br />
            {restrictConf.actionName === 'add-member-level' &&
                <div className="flx">
                    <b className="wdt-200 d-in-b">{__('Expiry Date:', 'bit-integrations')}</b>
                    <input className="btcd-paper-inp w-5 mt-1" onChange={handleInput} name="exp_date" value={restrictConf.exp_date || ''} type="date" placeholder={__('Expiry Date', 'bit-integrations')} />
                    <Cooltip width={250} icnSize={17} className="ml-2">
                        <div className="txt-body">
                            Leave it empty for never-expired
                        </div>
                    </Cooltip>
                </div>
            }
            <br />
            <br />
            <Note
                note="This integration will only work for logged-in users."
            />
            {/* {restrictConf?.actionName && restrictConf.actionName === 'add-member-level'
        && (
          <>
            <b className="wdt-200 d-in-b">{__('Members:', 'bit-integrations')}</b>
            <select onChange={handleInput} name="member_id" value={restrictConf.member_id} className="btcd-paper-inp w-5">
              <option value="">{__('Select Member', 'bit-integrations')}</option>
              {restrictConf?.default?.memberlists && restrictConf.default.memberlists.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <button onClick={() => getAllMembers(restrictConf, setRestrictConf, setIsLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Members', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </>
        )} */}
            {/* <br />
            {restrictConf.actionName === 'add-member-level' &&
                <>
                    <div className="mt-5">
                        <b className="wdt-100">{__("Field Map", "bit-integrations")}</b>
                    </div>
                    <div className="btcd-hr mt-1" />
                    <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                        <div className="txt-dp">
                            <b>{__("Form Fields", "bit-integrations")}</b>
                        </div>
                        <div className="txt-dp">
                            <b>{__("Restrict Content Fields", "bit-integrations")}</b>
                        </div>
                    </div>
                </>
            }

            {restrictConf?.level_id &&
                restrictConf.actionName === "add-member-level" &&
                restrictConf?.field_map.map((itm, i) => (
                    <RestrictContentFieldMap
                        key={`rp-m-${i + 9}`}
                        i={i}
                        field={itm}
                        restrictConf={restrictConf}
                        formFields={formFields}
                        setRestrictConf={setRestrictConf}
                        setSnackbar={setSnackbar}
                    />
                ))}
            {restrictConf?.actionName === "add-member-level" && <div className="txt-center btcbi-field-map-button mt-2">
                <button
                    onClick={() => addFieldMap(restrictConf.field_map.length, restrictConf, setRestrictConf, false)}
                    className="icn-btn sh-sm"
                    type="button"
                >
                    +
                </button>
            </div>}
            <br />
            <br /> */}
        </>
    );
}
