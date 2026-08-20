# new-ui

마케팅레버리지 프론트엔드에서 Git 서브모듈로 사용하는 공통 React UI 소스입니다.

이 저장소는 독립 번들 패키지가 아니며, 사용하는 부모 애플리케이션이 `package.json`의 peer dependency를 제공합니다.

## Swiper

- 지원 버전: Swiper 14.1 이상
- Node.js: 20.19 이상
- React 컴포넌트는 `swiper/react`, 선택 모듈은 `swiper/modules`, 스타일은 `swiper/css/*` 경로를 사용합니다.

Swiper를 사용하는 공통 컴포넌트:

- `Swiper/BannerSwiper/BannerSwiper.tsx`
- `granter/components/MobileOnboardingMemberCarousel/MobileOnboardingMemberCarousel.tsx`
