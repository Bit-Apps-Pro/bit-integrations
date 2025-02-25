import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import ProBadgeIcn from '../../../Icons/ProBadgeIcn'
import { ProModalBtnGrp } from '../../Utilities/ProModal'

export default function ActionProFeatureComponent({ title, children }) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <div className="pos-rel">
      {!isPro && (
        <div className="pro-blur flx">
          <div className="pro">
            <div className={`txt-center atn-btns flx flx-center`}>
              <div className={`content`}>
                <ProBadgeIcn size="30" />
                <h4>
                  {__('Unlock Premium Features with Our', 'bit-integrations')}
                  &nbsp;
                  <span className="pro-btn">{__('Pro Plugin', 'bit-integrations')}</span>
                </h4>
                <p>
                  <b>{title}</b> {__('Available On', 'bit-integrations')}
                  &nbsp;
                  <span className="pro-btn">{__('Pro', 'bit-integrations')}</span>
                </p>
                <ProModalBtnGrp />
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
