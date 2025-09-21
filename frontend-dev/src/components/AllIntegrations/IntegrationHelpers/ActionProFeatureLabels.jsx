import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __, sprintf } from '../../../Utils/i18nwrap'

const ProFeatureTitle = ({ title }) => {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <span>
      {title} &nbsp;
      {!isPro && <span className="pro-btn">{__('Pro', 'bit-integrations')}</span>}
    </span>
  )
}

const ProFeatureSubtitle = ({ title, subtitle, proVersion }) => {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <span>
      {isPro
        ? subtitle
        : sprintf(
            __(
              'The Bit Integrations Pro v(%s) plugin needs to be installed and activated to enable the %s feature',
              'bit-integrations'
            ),
            proVersion,
            title
          )}
    </span>
  )
}

export { ProFeatureTitle, ProFeatureSubtitle }
