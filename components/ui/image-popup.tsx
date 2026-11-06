"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { ExternalLink, ImagePlus, X } from "lucide-react";

import { cn } from "@/lib/utils";

/* 팝업 속 설명 글 (site.config.ts 의 heroCardDetails 한 칸) */
export type ImagePopupDetail = {
  eyebrow: string;
  title: string;
  description: string;
  points: readonly { label?: string; title: string; text: string }[];
};

/* 이미지 팝업: 감싼 칸(children)을 누르면 가로세로 16:9 팝업창이 뜹니다.
   - 크기: 세로 720px × 가로 1280px. 화면이 그보다 작으면 16:9 비율 그대로 화면에 맞게 줄어듭니다.
   - 내용: 위에 이미지, 아래에 설명 글(detail). 길면 오른쪽 스크롤바로 내려 봅니다.
   - 닫기: 오른쪽 위 X 버튼, 팝업 바깥 어두운 곳 클릭, 또는 키보드 Esc
   - 이미지가 없으면 점선 안내가, 관리자에서 링크를 넣었으면 "링크 열기" 버튼이 보입니다. */
export function ImagePopup({
  title,
  imageUrl,
  linkUrl,
  emptyLabel,
  detail,
  children,
  className,
}: {
  title: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
  emptyLabel: string;
  detail?: ImagePopupDetail;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={`${title} 크게 보기`}
        className={cn("block w-full cursor-pointer text-left", className)}
      >
        {children}
      </button>

      <dialog
        ref={ref}
        aria-label={detail?.title.replace("\n", " ") ?? title}
        // 팝업 바깥(어두운 배경)을 누르면 닫힘
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        {/* 팝업 본체: 16:9 (aspect-video). 폭 = 1280px / 화면 폭 / 화면 높이×16/9 중 가장 작은 값 */}
        <div className="relative aspect-video w-[min(1280px,calc(100vw_-_2rem),calc((100dvh_-_2rem)*16/9))] overflow-hidden rounded-2xl bg-hero text-hero-foreground shadow-2xl ring-1 ring-hero-foreground/15">
          {/* 내용 영역: 오른쪽에 항상 보이는 스크롤바 (초록 손잡이).
               첫 화면에는 이미지 전체가 잘리지 않고 팝업 안에 들어가고(남는 곳은 배경색),
               아래로 스크롤하면 설명 글이 이어짐 */}
          <div className="absolute inset-0 overflow-y-scroll [scrollbar-color:var(--color-primary)_transparent] [scrollbar-width:thin]">
            {imageUrl ? (
              <div className="relative h-full w-full">
                <Image src={imageUrl} alt={title} fill sizes="1280px" className="object-contain" />
              </div>
            ) : (
              <div className="m-6 flex h-40 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-hero-foreground/25 bg-hero-foreground/5 text-center text-hero-muted sm:m-10 sm:h-56">
                <ImagePlus className="size-10" />
                <span className="px-4 text-sm sm:text-base">{emptyLabel}</span>
              </div>
            )}

            {/* 설명 글: 머리글 → 큰 제목 → 소개 → 칸 여러 개 */}
            <div className="px-6 pb-10 pt-4 sm:px-12 sm:pb-14 sm:pt-6">
              {detail ? (
                <>
                  <p className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary ring-1 ring-primary/30">
                    {detail.eyebrow}
                  </p>
                  <h2 className="mt-4 whitespace-pre-line text-2xl font-bold leading-snug tracking-tight sm:text-4xl">
                    {detail.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-hero-muted sm:text-lg">
                    {detail.description}
                  </p>
                  <ul
                    className={cn(
                      "mt-8 grid gap-4 sm:grid-cols-2",
                      detail.points.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
                    )}
                  >
                    {detail.points.map((point) => (
                      <li
                        key={point.title}
                        className="rounded-xl bg-hero-foreground/5 p-5 ring-1 ring-hero-foreground/10"
                      >
                        {point.label ? (
                          <p className="text-xs font-semibold tracking-wider text-primary">{point.label}</p>
                        ) : null}
                        <p className="mt-2 text-lg font-semibold">{point.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-hero-muted">{point.text}</p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-xl font-semibold">{title}</p>
              )}

              {linkUrl ? (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  링크 열기
                  <ExternalLink className="size-4" />
                </a>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="닫기"
            // 스크롤바와 겹치지 않게 오른쪽에서 조금 띄움 (right-6)
            className="absolute right-6 top-3 grid size-10 cursor-pointer place-items-center rounded-full bg-black/50 text-white ring-1 ring-white/20 backdrop-blur hover:bg-black/70"
          >
            <X className="size-5" />
          </button>
        </div>
      </dialog>
    </>
  );
}
