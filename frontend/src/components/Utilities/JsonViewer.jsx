import ReactJson from '@microlink/react-json-view'

export default function JsonViewer({
  data = {},
  theme = 'monokai',
  indentWidth = '4',
  enableClipboard = false,
  collapsed = false,
  displayDataTypes = true,
  onChange
}) {
  return (
    <div className="bg-white max-h-96 rounded border my-3 table-webhook-div">
      <ReactJson
        src={data}
        theme={theme}
        indentWidth={indentWidth}
        onSelect={onChange}
        enableClipboard={enableClipboard}
        collapsed={collapsed}
        displayDataTypes={displayDataTypes}
        style={{ padding: '15px' }}
      />
    </div>
  )
}
