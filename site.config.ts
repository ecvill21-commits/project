/* ==========================================================================
   ★ 사이트 내용 설정 파일
   --------------------------------------------------------------------------
   사이트에 보이는 글자(이름, 소개, 메뉴, 연락처 등)는 대부분 여기에 있습니다.
   따옴표 " " 안의 글자만 바꾸고 저장하면 화면에 바로 반영됩니다.
   (따옴표, 쉼표, 중괄호 { } 는 지우지 않도록 조심!)
   ========================================================================== */

import type { Item } from "@/lib/types";

export const siteConfig = {
  /* 브라우저 탭 제목과 검색 결과에 보이는 정보 */
  name: "My Studio",
  title: "My Studio — 나의 첫 웹사이트",
  description: "바이브 코딩으로 만든 나의 웹사이트입니다.",

  /* 상단 메뉴 (href 의 #이름 은 아래 섹션의 id 와 같아야 해당 위치로 이동) */
  nav: [
    { label: "소개", href: "#about" },
    { label: "기능", href: "#features" },
    { label: "연락처", href: "#contact" },
  ],

  /* 상단 메뉴 맨 오른쪽 버튼 (누르면 새 탭에서 열림) */
  secretButton: { label: "비밀버튼", href: "/admin" },

  /* 첫 화면(히어로) */
  hero: {
    eyebrow: "브랜드 및 지역 홍보 최고의 선택 - 애드팟",
    /* 마지막 줄은 초록색으로 강조됩니다. \n 은 줄바꿈 */
    title: "찍고 공유하는\n자연스러운 흐름이\n브랜드의 무한 확산\n홍보 콘텐츠가 됩니다.",
    description:
      "방문객의 한 장 사진이 광고비 없이\n브랜드를 무한 확산시키는 자연 발생 바이럴 마케팅",
    primaryCta: { label: "더 알아보기", href: "#features" },
    secondaryCta: { label: "연락하기", href: "#contact" },
  },

  /* 첫 화면 왼쪽 메인 이미지의 기본 사진.
     관리자 페이지(메인 이미지 탭)에서 이미지를 올리면 그 이미지가 대신 보입니다. */
  heroMainImage: { title: "AD & PHOTO 외부형 포토부스", image: "/images/booth-outdoor.webp" },

  /* 메인 이미지 뒤에 비스듬히 깔리는 사진 (첫 번째 = 왼쪽, 두 번째 = 오른쪽). 사진 파일은 public/images 에 */
  heroBackImages: ["/images/frame-magazine.png", "/images/frame-wanted.png"],

  /* 첫 화면 소제목 위의 핵심 기능 (사이에 + 가 자동으로 붙음) */
  heroTagline: ["QR 다운로드", "SNS 공유", "로고 자동 삽입"],

  /* 휴대폰 대화 그림 속 글자 (components/sections/phone-mockup.tsx — 지금은 첫 화면에서 쓰지 않음)
     from: "me" = 내가 보낸 초록 말풍선, "them" = 상대 말풍선 */
  heroChat: {
    title: "My Studio",
    subtitle: "지금 대화 중",
    placeholder: "메시지 입력",
    messages: [
      { from: "them", name: "지민", text: "내일 미팅 시간 괜찮으세요?", time: "10:39" },
      { from: "me", name: "", text: "네! 오후 2시 어떠세요?", time: "10:40" },
      { from: "them", name: "지민", text: "좋아요, 시안도 같이 볼게요 🙂", time: "10:42" },
      { from: "me", name: "", text: "그럼 그때 뵐게요", time: "10:45" },
    ],
  },

  /* 소개 섹션 */
  about: {
    eyebrow: "About",
    title: "소개",
    paragraphs: [
      "여기에 나 또는 우리 팀, 가게, 프로젝트에 대한 소개를 적습니다.",
      "두 번째 문단도 필요하면 이렇게 줄을 추가하면 됩니다.",
    ],
  },

  /* 기능(항목) 섹션의 제목 — 카드 목록 자체는 관리자 페이지(/admin)에서 관리 */
  features: {
    eyebrow: "Features",
    title: "기능",
    description: "관리자 페이지에서 카드를 추가·수정·삭제할 수 있는 영역입니다.",
  },

  /* 연락처 섹션 */
  contact: {
    eyebrow: "Contact",
    title: "함께 이야기해요",
    description: "궁금한 점이 있다면 언제든 연락 주세요.",
    email: "hello@example.com",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "GitHub", href: "https://github.com" },
    ],
  },

  /* 맨 아래(푸터) */
  footer: {
    copyright: "© 2026 My Studio. All rights reserved.",
  },

  /* 관리자 페이지에서 관리할 섹션 목록.
     key  = 데이터베이스에 저장되는 이름(영문 소문자),
     label = 관리자 화면에 보이는 이름.
     예) 포트폴리오라면 { key: "works", label: "작업물" } 을 추가 */
  adminSections: [
    { key: "hero-main", label: "메인 이미지" }, // 첫 화면 왼쪽 큰 이미지 (첫 번째 1장만 보임)
    { key: "hero-cards", label: "가운데 3장" }, // 첫 화면 제목 아래 이미지 3장
    { key: "showcase", label: "하단 5장" }, // 기울어진 초록 띠 아래 이미지 5장
    { key: "features", label: "기능" },
  ],
};

/* Supabase를 아직 연결하지 않았을 때 대신 보여줄 예시 카드.
   Supabase를 연결하면 이 내용 대신 관리자 페이지에서 등록한 카드가 보입니다. */
export const sampleItems: Item[] = [
  {
    id: "sample-1",
    section: "features",
    title: "첫 번째 기능",
    description: "카드 하나에 제목, 설명, 이미지, 링크를 넣을 수 있어요.",
    image_url: null,
    link_url: null,
    sort_order: 1,
    is_visible: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "sample-2",
    section: "features",
    title: "두 번째 기능",
    description: "관리자 페이지에서 순서를 바꾸거나 숨길 수도 있어요.",
    image_url: null,
    link_url: null,
    sort_order: 2,
    is_visible: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "sample-3",
    section: "features",
    title: "세 번째 기능",
    description: "포트폴리오라면 작업물, 가게라면 메뉴처럼 자유롭게 쓰세요.",
    image_url: null,
    link_url: null,
    sort_order: 3,
    is_visible: true,
    created_at: "2026-01-01T00:00:00Z",
  },
];
