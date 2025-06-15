import { useEffect } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import OneDriveActions from './OneDriveActions'
import { getAllOneDriveFolders, getSingleOneDriveFolders, handleInput } from './OneDriveCommonFunc'

export default function OneDriveIntegLayout({ formID, formFields, oneDriveConf, setOneDriveConf, isLoading, setIsLoading, setSnackbar }) {
  return (
    <>
      <br />
      <b className="wdt-100 d-in-b">Folder:</b>
      <select onChange={(e) => handleInput(e, oneDriveConf, setOneDriveConf, formID, setIsLoading, setSnackbar)} name="folder" value={oneDriveConf.folderMap[0] || oneDriveConf.folder} className="btcd-paper-inp w-7">
        <option value="">{__('Select Folder', 'bit-integrations')}</option>
        {
          oneDriveConf?.default?.rootFolders && oneDriveConf.default.rootFolders.map(teamFolderApi => (
            <option key={teamFolderApi.id} value={teamFolderApi.id}>
              {teamFolderApi.name}
            </option>
          ))
        }
      </select>
      <button onClick={() => getAllOneDriveFolders(formID, oneDriveConf, setOneDriveConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh  Folders', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      {oneDriveConf.folderMap.map((folder, i) => (
        <div key={folder}>
          <br />
          <div className="flx">
            <b className="wdt-100 d-in-b" />
            <div className="d-in-b" style={{ width: (i + 1) * 10, marginLeft: 1, marginRight: 2, height: 58, marginTop: -60 }}>
              <div className="sub-tree" />
            </div>
            <div className="flx sub-folder w-7">
              <select onChange={(e) => handleInput(e, oneDriveConf, setOneDriveConf, formID, setIsLoading, setSnackbar, i + 1)} name="folder" value={oneDriveConf.folderMap[i + 1] || oneDriveConf.folder} className="btcd-paper-inp">
                <option value={oneDriveConf.folderMap[i]}>/ root</option>
                {
                  oneDriveConf?.default?.folders?.[folder] && oneDriveConf.default.folders[folder].map(folderApi => (
                    <option key={folderApi.id} value={folderApi.id}>
                      {folderApi.name}
                    </option>
                  ))
                }
              </select>
              <button onClick={() => getSingleOneDriveFolders(formID, oneDriveConf, setOneDriveConf, setIsLoading, setSnackbar, i)} className="d-non icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Sub Folders', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          </div>
        </div>
      ))}
      <br />
      <br />
      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}

      {oneDriveConf.folder && (
        <>
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <OneDriveActions
            oneDriveConf={oneDriveConf}
            setOneDriveConf={setOneDriveConf}
            formFields={formFields}
            formID={formID}
            setIsLoading={setIsLoading}
            setSnackbar={setSnackbar}
          />
        </>
      )}
    </>
  )
}
