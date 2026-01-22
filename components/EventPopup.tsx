
import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useLocation, Link } from 'react-router';

/**
 * ############################################################
 * [ OPERATING GUIDE: 팝업창 운영 방법 ]
 * 1. 노출 위치: 오직 '홈페이지(/)' 첫 화면에서만 나타납니다.
 * 2. 활성화 제어: 이벤트가 없을 때는 isActive를 false로 바꾸세요.
 * 3. 이미지 가이드: 16:10 비율의 가로형 이미지를 권장합니다.
 * 4. 위치 조정: 'position' 수치를 변경하여 상하좌우 배치를 조절할 수 있습니다.
 * 5. 유지 시간: 사용자가 닫기를 누르면 'hideDurationDays' 동안 다시 뜨지 않습니다.
 * ############################################################
 */

/**
 * [ EDIT AREA: POPUP CONFIG (팝업 설정) ]
 */
const POPUP_CONFIG = {
  isActive: true, // # 팝업 활성화 상태 (true: 사용함, false: 숨김)
  
  // 컨텐츠 설정
  imageUrl: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=800", // # 이미지 링크
  linkUrl: "/booking", // # 클릭 시 이동할 페이지 주소
  title: "Special Winter Event", // # 배너 큰 제목
  subTitle: "지금 예약하고 온수 스파 무료 혜택을 받으세요.", // # 배너 상세 설명
  
  // 노출 정책
  hideDurationDays: 1, // # '오늘 하루 보지 않기' 클릭 시 다시 안 나타날 기간 (단위: 일)
  
  // 디자인 수치 (Tailwind CSS 클래스 기반)
  width: "max-w-[340px]", // # 카드 너비
  position: "bottom-8 right-8", // # 카드 위치 (예: top-24 right-8 등으로 변경 가능)
  borderRadius: "rounded-[2rem]", // # 모서리 둥글기 정도
  shadow: "shadow-[0_20px_50px_rgba(0,0,0,0.15)]", // # 그림자 깊이
  animation: "animate-in slide-in-from-bottom-10 fade-in duration-1000 ease-out" // # 등장 애니메이션
};

const EventPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 1. 활성화 여부 및 현재 페이지가 홈페이지(/)인지 확인
    if (!POPUP_CONFIG.isActive || location.pathname !== '/') {
      setIsVisible(false);
      return;
    }

    // 2. 로컬 스토리지 확인 (사용자가 닫기를 눌렀는지 체크)
    const hideUntil = localStorage.getItem('event_banner_hide_until');
    if (hideUntil && new Date().getTime() < parseInt(hideUntil)) {
      setIsVisible(false);
      return;
    }
    
    // 3. 페이지 로드 후 자연스러운 등장을 위한 딜레이 설정
    const timer = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, [location.pathname]); // 경로 이동 시마다 노출 여부 재검토

  const closePopup = () => setIsVisible(false);

  // '오늘 하루 보지 않기' 로직
  const hideForToday = () => {
    const expires = new Date().getTime() + (POPUP_CONFIG.hideDurationDays * 24 * 60 * 60 * 1000);
    localStorage.setItem('event_banner_hide_until', expires.toString());
    closePopup();
  };

  // 조건에 맞지 않으면 아무것도 그리지 않음
  if (!isVisible || location.pathname !== '/') return null;

  return (
    <div className={`fixed ${POPUP_CONFIG.position} z-[90] ${POPUP_CONFIG.width} w-full ${POPUP_CONFIG.animation} p-4 md:p-0`}>
      <div className={`relative bg-white ${POPUP_CONFIG.borderRadius} ${POPUP_CONFIG.shadow} overflow-hidden border border-gray-100 group`}>
        
        {/* 이미지 클릭 시 링크 이동 */}
        <Link to={POPUP_CONFIG.linkUrl} onClick={closePopup} className="block relative aspect-[16/10] overflow-hidden">
          <img 
            src={POPUP_CONFIG.imageUrl} 
            alt="Event Promotion" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </Link>

        {/* 텍스트 및 버튼 컨텐츠 */}
        <div className="p-7 space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-green-800 uppercase tracking-widest block">Limited Event</span>
              <h4 className="text-lg font-bold serif text-gray-900 leading-tight">{POPUP_CONFIG.title}</h4>
            </div>
            <button 
              onClick={closePopup} 
              className="text-gray-300 hover:text-gray-900 transition-colors p-1"
              aria-label="닫기"
            >
              <X size={18} />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 leading-relaxed break-keep font-medium">
            {POPUP_CONFIG.subTitle}
          </p>

          <div className="pt-4 flex items-center justify-between gap-4">
            <button 
              onClick={hideForToday}
              className="text-[10px] font-bold text-gray-300 hover:text-gray-900 transition-colors tracking-tighter"
            >
              오늘 하루 보지 않기
            </button>
            <Link 
              to={POPUP_CONFIG.linkUrl}
              onClick={closePopup}
              className="flex items-center gap-2 text-[10px] font-bold text-white bg-green-950 px-4 py-2.5 rounded-full hover:bg-black transition-all shadow-md group/btn"
            >
              DETAILS <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 모바일 접근성용 상단 닫기 보조 버튼 */}
        <button 
          onClick={closePopup}
          className="absolute top-3 right-3 bg-black/20 backdrop-blur-md text-white p-1.5 rounded-full md:hidden"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default EventPopup;
