import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { authInfoAtom } from '../GlobalStates';

// popup window: render when redirected from oauth to bit-integration with code
export default function AuthResponse() {
  const setAuthInfo = useSetRecoilState(authInfoAtom);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    const authResponse = {};

    for (const [key, value] of searchParams) {
      if (value !== null && value.trim() !== '') {
        authResponse[key] = value;
      }
    }

    if (Object.keys(authResponse).length > 0) {
      setAuthInfo(authResponse);
    }

    setTimeout(() => {
      window.close();
    }, 100);
  }, []);

  return <h4>Auth Response Captured</h4>;
}
