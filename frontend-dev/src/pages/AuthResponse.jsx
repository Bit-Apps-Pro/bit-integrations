import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { authInfoAtom } from '../GlobalStates'

// popup window: render when redirected from oauth to bit-integration with code
export default function AuthResponse() {
  const setAuthInfo = useSetRecoilState(authInfoAtom)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash)
    const code = urlParams.get('code')

    if (code) {
      setAuthInfo({ code: code });

      setTimeout(() => {
        window.close()
      }, 100)
    }
  }, [])

  return <h4>Auth Response Captured</h4>
}
