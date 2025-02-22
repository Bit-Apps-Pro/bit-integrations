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
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <span>
      {title}
      &nbsp;
      {!isPro && <span className="pro-btn">{__('Pro', 'bit-integrations')}</span>}
    </span>
  )
}

export { getProFeatureSubtitle, getProFeatureTitle }
