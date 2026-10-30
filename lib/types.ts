/** 관리자 페이지에서 관리하는 카드(항목) 한 개의 모양. supabase/schema.sql 의 items 테이블과 같습니다. */
export type Item = {
  id: string;
  /** 어느 섹션에 속하는지 (예: "features") */
  section: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  /** 작은 숫자가 먼저 보임 */
  sort_order: number;
  /** false 면 사이트에서 숨김 */
  is_visible: boolean;
  created_at: string;
};

/** 버튼 하나의 글자와 이동할 위치 */
export type Cta = { label: string; href: string };

/** 첫 화면(히어로)의 글자. 관리자 페이지에서 수정하면 supabase 의 site_texts 표(key = 'hero')에 저장됩니다. */
export type HeroText = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: Cta;
  secondaryCta: Cta;
};
