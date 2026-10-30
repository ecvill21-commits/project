import { sampleItems, siteConfig } from "@/site.config";
import { getPublicClient } from "@/lib/supabase";
import type { HeroText, Item } from "@/lib/types";

/**
 * 특정 섹션의 카드 목록을 가져옵니다.
 * - Supabase가 연결 안 됐으면: site.config.ts 의 예시 카드를 보여줌
 * - 연결됐으면: 데이터베이스에서 '보이기'로 설정된 카드만 순서대로 가져옴
 */
export async function getItems(section: string): Promise<Item[]> {
  const supabase = getPublicClient();
  const samples = sampleItems.filter((item) => item.section === section);
  if (!supabase) return samples;

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("section", section)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getItems] Supabase 읽기 실패:", error.message);
    return samples;
  }
  return (data ?? []) as Item[];
}

/**
 * 첫 화면(히어로) 글자를 가져옵니다.
 * - 관리자 페이지에서 저장한 글자가 있으면 그것을, 없으면 site.config.ts 의 hero 를 사용
 * - 비어 있는 칸은 site.config.ts 의 글자로 채움
 */
export async function getHeroText(): Promise<HeroText> {
  const fallback = siteConfig.hero;
  const supabase = getPublicClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("site_texts")
    .select("value")
    .eq("key", "hero")
    .maybeSingle();

  if (error) {
    console.error("[getHeroText] Supabase 읽기 실패:", error.message);
    return fallback;
  }

  const saved = (data?.value ?? {}) as Partial<HeroText>;
  return {
    eyebrow: saved.eyebrow || fallback.eyebrow,
    title: saved.title || fallback.title,
    description: saved.description || fallback.description,
    primaryCta: {
      label: saved.primaryCta?.label || fallback.primaryCta.label,
      href: saved.primaryCta?.href || fallback.primaryCta.href,
    },
    secondaryCta: {
      label: saved.secondaryCta?.label || fallback.secondaryCta.label,
      href: saved.secondaryCta?.href || fallback.secondaryCta.href,
    },
  };
}
