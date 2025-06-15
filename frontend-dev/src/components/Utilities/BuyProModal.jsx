import { CSSTransition } from 'react-transition-group'
import CloseIcn from '../../Icons/CloseIcn'

export default function BuyProModal({ show, setModal, md, lg, style, className, title, warning, hdrActn, children, data }) {
    const handleClickOutside = e => {
        if (e.target.classList.contains('btcd-modal-wrp')) {
            setModal(false)
        }
    }

    return (
        <CSSTransition
            in={show}
            timeout={500}
            classNames="btc-mdl-trn"
            unmountOnExit
        >
            <div
                role="button"
                tabIndex={0}
                onKeyPress={handleClickOutside}
                onClick={handleClickOutside}
                className="btcd-modal-wrp flx"
            >
                <div
                    className={`btcd-modal ${md ? 'btcd-m-md' : ''} ${lg ? 'btcd-m-lg' : ''} ${className}`}
                    style={style}
                >
                    <div className="btcd-modal-content">
                        {hdrActn}
                        <button onClick={() => setModal(false)} className="icn-btn btcd-mdl-close" aria-label="modal-close" type="button"><CloseIcn size={16} stroke={3} /></button>
                        <h2 className="btcd-mdl-title flx" style={{ color: warning ? 'red' : '' }}>{title}</h2>
                        <div className="d-flx flx-col">
                            <div className="d-flx flx-col mt-3">
                                {data > 1 && <small className="btcd-buy-mdl-subtitle" style={{ width: '100%', marginBottom: '10px', fontFamily: 'dashicons' }}>This notice is informing that starting from February 15, there will be a change in the free version of a service. Specifically, the free version will only allow for one integration, but all previous integrations will continue to work normally.</small>}
                                <small className="btcd-buy-mdl-subtitle" style={{ width: '100%', fontFamily: 'dashicons' }}>
                                    You can make
                                    {' '}
                                    <span style={{ fontWeight: 'bold', fontFamily: 'dashicons' }}>1 integration</span>
                                    {' '}
                                    in free version.
                                </small>
                            </div>
                            <div>
                                <small className="btcd-buy-mdl-subtitle" style={{ width: '100%', fontFamily: 'dashicons' }}>Get pro version to create unlimited integrations.</small>
                                <a className="btn ml-auto btcd-btn-lg sh-lm flx mt-3 blue blue-sh" href="https://www.bitapps.pro/bit-integrations" target="_blank" rel="noreferrer">Get Pro</a>
                            </div>
                        </div>
                        {!md && <div className="btcd-mdl-div" />}
                        {children}
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}
