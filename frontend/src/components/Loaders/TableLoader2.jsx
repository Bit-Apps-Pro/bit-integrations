import { Fragment } from 'react'
import ContentLoader from 'react-content-loader'

const TableLoader = () => (
  <ContentLoader
    speed={0.5}
    width="100%"
    height={400}
    viewBox="0 0 1520 400"
    backgroundColor="#f7f7f7"
    foregroundColor="#ecebeb">
    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
      <Fragment key={`plh-${i + 9}`}>
        <rect x="12" y={10 + 60 * i} rx="4" ry="4" width="20" height="20" />
        <rect x="66" y={10 + 60 * i} rx="10" ry="10" width="85" height="19" />
        <rect x="187" y={10 + 60 * i} rx="10" ry="10" width="169" height="19" />
        <rect x="1182" y={10 + 60 * i} rx="10" ry="10" width="85" height="19" />
        <rect x="401" y={10 + 60 * i} rx="10" ry="10" width="85" height="19" />
        <rect x="522" y={10 + 60 * i} rx="10" ry="10" width="169" height="19" />
        <rect x="977" y={10 + 60 * i} rx="10" ry="10" width="169" height="19" />
        <rect x="730" y={10 + 60 * i} rx="10" ry="10" width="85" height="19" />
        <rect x="1304" y={10 + 60 * i} rx="10" ry="10" width="85" height="19" />
        <rect x="851" y={10 + 60 * i} rx="10" ry="10" width="85" height="19" />
        <circle cx="1456" cy={20 + 60 * i} r="12" />
      </Fragment>
    ))}
  </ContentLoader>
)

export default TableLoader
