import Lottie from 'lottie-react';
import React from 'react';
import loadingAnimation from '@/shared/assets/lotties/loading.json';

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column', // 아이템을 세로로 정렬하기 위해 추가
        height: '100vh',
        width: '100vw',
        backgroundColor: '#ffffff',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
    },
    lottie: {
        width: 150, // 애니메이션의 크기를 지정합니다.
        height: 150,
    },
    text: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginTop: '20px', // 애니메이션과 텍스트 사이에 간격을 줍니다.
    },
};

const LogoLottie = () => <Lottie animationData={loadingAnimation} loop={true} style={styles.lottie} />;

export default LogoLottie;
