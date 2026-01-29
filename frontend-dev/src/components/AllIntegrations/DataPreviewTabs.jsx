import { Tabs, useTabState, usePanelState } from '@bumaga/tabs'
import { __ } from '../../Utils/i18nwrap'
import JsonViewer from '../Utilities/JsonViewer'

const CustomTab = ({ children }) => {
  const { isActive, onClick } = useTabState()

  return (
    <button onClick={onClick} className={`btcd-data-preview-tab ${isActive ? 'active' : ''}`}>
      {children}
    </button>
  )
}

const CustomPanel = ({ children }) => {
  const isActive = usePanelState()

  return isActive ? <div className="btcd-data-preview-panel">{children}</div> : null
}

export default function DataPreviewTabs({ inputData, outputData }) {
  const hasInputData = data => {
    if (!data) return false
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data)
        return parsed && Object.keys(parsed).length > 0
      } catch (e) {
        return data.trim().length > 0
      }
    }
    return data && Object.keys(data).length > 0
  }

  const parseJsonData = data => {
    if (!data) return {}
    try {
      return typeof data === 'string' ? JSON.parse(data) : data
    } catch (e) {
      return { error: 'Invalid JSON', raw: data }
    }
  }

  const showInputTab = hasInputData(inputData)

  return (
    <Tabs initialActive={showInputTab ? 1 : 0}>
      <div className="btcd-data-preview-tab-header">
        {showInputTab && <CustomTab>{__('Input Data', 'bit-integrations')}</CustomTab>}
        <CustomTab>{__('Output Data', 'bit-integrations')}</CustomTab>
      </div>

      <div>
        {showInputTab && (
          <CustomPanel>
            <div className="btcd-data-preview-content">
              <JsonViewer
                data={parseJsonData(inputData)}
                theme="rjv-default"
                enableClipboard={true}
                collapsed={false}
                displayDataTypes={false}
              />
            </div>
          </CustomPanel>
        )}
        <CustomPanel>
          <div className="btcd-data-preview-content">
            <JsonViewer
              data={parseJsonData(outputData)}
              theme="rjv-default"
              enableClipboard={true}
              collapsed={false}
              displayDataTypes={false}
            />
          </div>
        </CustomPanel>
      </div>
    </Tabs>
  )
}
