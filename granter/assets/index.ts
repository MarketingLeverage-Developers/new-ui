import bellIcon from './bellIcon.png';
import danngnLogo from './danngn-icon.svg';
import defaultProfile from './default-profile.png';
import googleLogo from './google-social-icon.svg';
import kakaoIcon from './kakaoIcon.svg';
import kakaoLogo from './kakao-social-login.svg';
import logo from './logo.svg';
import metaLogo from './meta-social-icon.svg';
import naverLogo from './naver-social-icon.svg';
import smsIcon from './smsIcon.svg';
import unBellIcon from './unBellIcon.png';

export const getMediaLogoSrc = (name: string) => {
    if (name === '네이버') return naverLogo;
    if (name === '구글') return googleLogo;
    if (name === '메타') return metaLogo;
    if (name === '카카오') return kakaoLogo;
    if (name === '당근') return danngnLogo;
    return logo;
};

export {
    bellIcon,
    danngnLogo,
    defaultProfile,
    googleLogo,
    kakaoIcon,
    kakaoLogo,
    logo,
    metaLogo,
    naverLogo,
    smsIcon,
    unBellIcon,
};
