import { useEffect } from 'react';

const getMobileDetect = (userAgent: string) => {
  const isAndroid = () => !!userAgent.match(/Android/i);
  const isIOS = () => !!userAgent.match(/iPhone|iPad|iPod/i);
  const isOpera = () => !!userAgent.match(/Opera Mini/i);
  const isWindows = () => !!userAgent.match(/IEMobile/i);
  const isSSR = () => !!userAgent.match(/SSR/i);
  const isMobile = () => !!(isAndroid() || isIOS() || isOpera() || isWindows());
  const isDesktop = () => !!(!isMobile() && !isSSR());
  return {
    isMobile: isMobile(),
    isDesktop: isDesktop(),
    isAndroid: isAndroid(),
    isIOS: isIOS(),
    isSSR: isSSR(),
  };
};
const useDeviceDetect = () => {
  useEffect(() => {}, []);
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;
  return getMobileDetect(userAgent);
};

export default useDeviceDetect;
