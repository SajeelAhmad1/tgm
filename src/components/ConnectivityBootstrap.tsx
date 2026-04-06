import NetInfo from '@react-native-community/netinfo';
import React, {useEffect} from 'react';
import {useConnectivityStore} from '../store/connectivityStore';

function isReachableOnline(state: {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
}): boolean {
  if (state.isConnected !== true) {
    return false;
  }
  if (state.isInternetReachable === false) {
    return false;
  }
  return true;
}

/**
 * Subscribes to NetInfo once at app root. Mount inside SafeAreaProvider.
 */
export function ConnectivityBootstrap(): React.JSX.Element | null {
  const setOnline = useConnectivityStore(s => s.setOnline);

  useEffect(() => {
    const unsub = NetInfo.addEventListener(s => {
      setOnline(isReachableOnline(s));
    });
    void NetInfo.fetch().then(s => setOnline(isReachableOnline(s)));
    return () => {
      unsub();
    };
  }, [setOnline]);

  return null;
}
