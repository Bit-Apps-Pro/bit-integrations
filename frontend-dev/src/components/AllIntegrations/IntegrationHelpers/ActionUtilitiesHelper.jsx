import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __, sprintf } from '../../../Utils/i18nwrap'

const getProFeatureSubtitle = (title, subTitle, proVersion) => {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return isPro
    ? subTitle
    : sprintf(
        __(
          'The Bit Integration Pro v(%s) plugin needs to be installed and activated to enable the %s feature',
          'bit-integrations'
        ),
        proVersion,
        title
      )
}

const getProFeatureTitle = title => {
  return (
    <span>
      {title}
      &nbsp;
      <span
        style={{
          backgroundColor: '#7902f8',
          color: 'white',
          padding: '2px 4px',
          textAlign: 'center',
          borderRadius: '5px'
        }}>
        {__('Pro', 'bit-integrations')}
      </span>
    </span>
  )
}

export { getProFeatureSubtitle, getProFeatureTitle }
