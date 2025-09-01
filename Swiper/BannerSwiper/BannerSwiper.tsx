import React, { useRef, useState } from 'react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper } from 'swiper/react';
import styles from './BannerSwiper.module.scss';
import type { Swiper as SwiperCore } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type BannerSwiperProps = {
    children: React.ReactNode;
    slidesPerView?: number;
};

const BannerSwiper = ({ slidesPerView = 1, children }: BannerSwiperProps) => {
    const swiperRef = useRef<SwiperCore | null>(null);
    const originalCount = React.Children.count(children);

    const [current, setCurrent] = useState(1);
    const [totalPages, setTotalPages] = useState(Math.max(1, Math.ceil(originalCount / slidesPerView)));

    const updatePage = (swiper: SwiperCore) => {
        const perView = typeof swiper.params.slidesPerView === 'number' ? swiper.params.slidesPerView : 1;

        const total = Math.max(1, Math.ceil(originalCount / perView));
        setTotalPages(total);

        const page = Math.floor(swiper.realIndex / perView) + 1;
        setCurrent(page); // loop 상태여도 realIndex가 0으로 돌아가며 1부터 다시 표시됨
    };
    return (
        <div className={styles.Wrapper}>
            <Swiper
                className={styles.BannerSwiper}
                modules={[Autoplay, Navigation]}
                slidesPerView={slidesPerView}
                loop
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onInit={updatePage}
                onSlideChange={updatePage}
                onResize={updatePage}
                onBreakpoint={updatePage}
            >
                {children}
            </Swiper>

            <div className={styles.PageWrapper}>
                <div className={styles.Page}>
                    <span>{current}</span> / <span>{totalPages}</span>
                </div>
            </div>
        </div>
    );
};

export default BannerSwiper;
