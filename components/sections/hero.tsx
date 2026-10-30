import Image from "next/image";
import { ArrowRight, ImagePlus } from "lucide-react";

import { siteConfig } from "@/site.config";
import { getHeroText, getItems } from "@/lib/data";
import type { Item } from "@/lib/types";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* 첫 화면(히어로).
   - 글자와 버튼 링크는 관리자 페이지(/admin → 히어로 글자)에서 바꿉니다.
     저장한 적이 없으면 site.config.ts 의 hero 글자가 보입니다.
   - 이미지는 관리자 페이지의 탭에서 올립니다.
       메인 이미지 → 왼쪽 큰 이미지 (첫 번째 1장)
       가운데 3장  → 제목 아래 이미지 3장 (카드 제목이 이미지 아래 설명이 됨)
       하단 5장    → 기울어진 초록 띠 아래 이미지 5장
     순서는 관리자 페이지의 "순서" 숫자로 바꿉니다. 이미지가 없는 칸은 점선 안내가 보입니다.
   - 배경색은 app/globals.css 의 --hero, 무늬는 .hero-pattern 에서 바꿉니다. */
export async function Hero() {
  const [hero, mainItems, cardItems, showcaseItems] = await Promise.all([
    getHeroText(),
    getItems("hero-main"),
    getItems("hero-cards"),
    getItems("showcase"),
  ]);
  const { heroTagline, heroMainImage, heroBackImages } = siteConfig;
  const titleLines = hero.title.split("\n");
  // 관리자에서 올린 메인 이미지가 없으면 site.config.ts 의 기본 사진을 사용
  const main: SlotItem = mainItems[0] ?? {
    title: heroMainImage.title,
    image_url: heroMainImage.image || null,
    link_url: null,
  };
  const cards = Array.from({ length: 3 }, (_, i) => cardItems[i]);
  const showcase = Array.from({ length: 5 }, (_, i) => showcaseItems[i]);

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* ── 위쪽: 짙은 초록 영역 ── */}
      <div className="relative isolate bg-hero text-hero-foreground">
        {/* 희미한 낙서 무늬 + 메인 이미지 뒤 은은한 빛 */}
        <div className="hero-pattern absolute inset-0 -z-10" />
        <div className="absolute -left-40 top-1/4 -z-10 size-[36rem] rounded-full bg-primary/15 blur-3xl" />

        {/* 컴퓨터 화면 배치 (2칸 × 2줄)
              첫째 줄: [메인 이미지] [글자 + 버튼]  ← 둘 다 아래쪽에 맞춰서, 이미지 아래선 = 버튼 아래선
              둘째 줄: [   (빈칸)  ] [가운데 이미지 3장]
            모바일: 글자 + 버튼 → 이미지 3장 → 메인 이미지 순서로 한 줄씩 */}
        <Container className="grid gap-12 pt-14 pb-24 sm:pt-20 sm:pb-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16 lg:pb-36">
          {/* 1. 왼쪽 메인 이미지 (컴퓨터 화면에서는 -translate-x-[5%] 로 이미지 폭의 5% 만큼 왼쪽으로) */}
          <div className="relative z-10 order-3 mx-auto w-full max-w-[400px] lg:col-start-1 lg:row-start-1 lg:self-end lg:-translate-x-[5%]">
            {/* 메인 이미지 뒤의 네컷 사진 2장 (site.config.ts 의 heroBackImages)
                 부스가 날아와 앉을 때 서서히 사라지고, 부스가 사라지면 다시 나타남 (globals.css 의 photos-cycle) */}
            {heroBackImages.map((src, i) => (
              <div
                key={src}
                aria-hidden
                className={cn(
                  "absolute top-1/2 aspect-[2/3] w-[31%] -translate-y-1/2 overflow-hidden rounded-md shadow-2xl shadow-black/50 ring-1 ring-hero-foreground/10 motion-safe:animate-photos-cycle",
                  i % 2 === 0 ? "left-[14%] -rotate-12" : "right-[14%] rotate-[10deg]"
                )}
              >
                <Image src={src} alt="" fill sizes="130px" className="object-cover" />
              </div>
            ))}

            {/* 메인 이미지: 왼쪽 위(45도)에서 돌멩이처럼 돌며 작게 날아와 점점 커지며 안착 → 3초 뒤 사라짐 → 반복
                 (움직임 설정은 globals.css 의 booth-cycle, '동작 줄이기'를 켠 기기에서는 움직이지 않음) */}
            <div className="relative motion-safe:animate-booth-cycle">
              <ImageSlot
                item={main}
                label="관리자 → 메인 이미지"
                sizes="(min-width: 1024px) 420px, 90vw"
                tone="dark"
                // 상하좌우 4면 가장자리를 투명하게 흐려서 배경과 자연스럽게 섞이도록
                // (to_right = 좌우, to_bottom = 위아래. 30%·70% 같은 숫자를 안쪽으로 당기면 더 넓게 흐려짐,
                //  중간의 rgb(0_0_0/0.45) 는 숫자가 작을수록 가장자리 쪽이 더 투명해져 흐림이 강해짐)
                // 기울기: lg:-rotate-[0.13deg] (음수 = 오른쪽이 올라감, 1deg 마다 오른쪽 끝이 폭의 약 1.7% 움직임)
                className="aspect-square ring-0 [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,rgb(0_0_0/0.45)_15%,black_30%,black_70%,rgb(0_0_0/0.45)_85%,transparent),linear-gradient(to_bottom,transparent,rgb(0_0_0/0.45)_12%,black_25%,black_75%,rgb(0_0_0/0.45)_88%,transparent)] lg:-rotate-[0.13deg]"
              />
            </div>
          </div>

          {/* 오른쪽 위: 글자, 버튼 */}
          <div className="order-1 lg:col-start-2 lg:row-start-1 lg:self-end">
            {/* 작은 머리글 (알약 모양 배지) */}
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm text-hero-foreground/90">
              <span className="size-1.5 rounded-full bg-primary" />
              {hero.eyebrow}
            </p>

            {/* 큰 제목: 줄마다 나누고, 여러 줄이면 마지막 줄을 초록색으로 강조 */}
            <h1 className="mt-6 text-4xl font-light leading-[1.2] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              {titleLines.map((line, i) => {
                const highlight = titleLines.length > 1 && i === titleLines.length - 1;
                return (
                  <span key={i} className={cn("block", highlight && "font-bold text-primary")}>
                    {line}
                  </span>
                );
              })}
            </h1>

            {/* 핵심 기능 + 소제목 */}
            <ul className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2">
              {heroTagline.map((tag, i) => (
                <li key={tag} className="flex items-center gap-2">
                  {i > 0 ? <span className="text-primary">+</span> : null}
                  <span className="rounded-full bg-hero-foreground/10 px-3 py-1 text-sm font-semibold text-hero-foreground ring-1 ring-hero-foreground/15">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-xl whitespace-pre-line text-lg leading-relaxed text-hero-muted">
              {hero.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-14 px-9 text-lg shadow-lg shadow-primary/30">
                <a href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <ArrowRight />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 border-hero-foreground/30 bg-transparent px-8 text-lg text-hero-foreground hover:bg-hero-foreground/10 hover:text-hero-foreground"
              >
                <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
              </Button>
            </div>
          </div>

          {/* 2. 오른쪽 아래: 가운데 이미지 3장 */}
          <div className="order-2 lg:col-start-2 lg:row-start-2">
            <ul className="grid grid-cols-3 gap-3 sm:gap-5">
              {cards.map((item, i) => (
                <li key={item?.id ?? `card-${i}`}>
                  <ImageSlot
                    item={item}
                    label="관리자 → 가운데 3장"
                    sizes="(min-width: 1024px) 220px, 33vw"
                    tone="dark"
                    className="aspect-[4/3] rounded-xl shadow-lg shadow-black/20"
                  />
                  <p className="mt-3 text-sm text-hero-foreground/90 sm:text-base">
                    {item?.title ?? `이미지 ${i + 1}`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>

        {/* 3. 기울어진 초록 띠 (오른쪽으로 갈수록 올라감) + 그 아래 밝은 영역의 시작 */}
        <div aria-hidden className="absolute inset-x-0 -bottom-1 h-16 sm:h-24">
          <div className="absolute inset-0 bg-primary [clip-path:polygon(0_72%,100%_0,100%_100%,0_100%)]" />
          <div className="absolute inset-0 bg-background [clip-path:polygon(0_calc(72%+10px),100%_10px,100%_100%,0_100%)]" />
        </div>
      </div>

      {/* ── 아래쪽: 이미지 5장 ── */}
      <div className="bg-background pb-20 pt-6 sm:pt-10">
        <Container>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {showcase.map((item, i) => (
              <li key={item?.id ?? `showcase-${i}`} className="text-center">
                <ImageSlot
                  item={item}
                  label="관리자 → 하단 5장"
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 33vw, 50vw"
                  tone="light"
                  className="aspect-[4/5] rounded-xl"
                />
                <p className="mt-3 text-sm font-medium text-muted-foreground sm:text-base">
                  {item?.title ?? `이미지 ${i + 1}`}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}

/* 이미지 한 칸에 필요한 정보 (관리자 카드 또는 site.config.ts 의 기본 사진) */
type SlotItem = Pick<Item, "title" | "image_url" | "link_url">;

/* 이미지 한 칸. 이미지가 있으면 보여주고, 없으면 점선 안내를 보여줍니다.
   관리자 페이지에서 링크를 넣으면 이미지를 눌렀을 때 그 주소가 새 탭으로 열립니다. */
function ImageSlot({
  item,
  label,
  sizes,
  tone,
  className,
}: {
  item?: SlotItem;
  label: string;
  sizes: string;
  tone: "dark" | "light";
  className?: string;
}) {
  const dark = tone === "dark";
  const box = (
    <div
      className={cn(
        "relative overflow-hidden",
        item?.image_url
          ? dark && "ring-1 ring-hero-foreground/10"
          : dark
            ? "border-2 border-dashed border-hero-foreground/25 bg-hero-foreground/5"
            : "border-2 border-dashed border-border bg-muted",
        className
      )}
    >
      {item?.image_url ? (
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className={cn(
            "flex h-full flex-col items-center justify-center gap-2 p-3 text-center",
            dark ? "text-hero-muted" : "text-muted-foreground"
          )}
        >
          <ImagePlus className="size-7" />
          <span className="text-xs leading-snug">{label}</span>
        </div>
      )}
    </div>
  );

  return item?.link_url ? (
    <a href={item.link_url} target="_blank" rel="noreferrer" className="group block">
      {box}
    </a>
  ) : (
    <div className="group">{box}</div>
  );
}
