"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { ExternalLink, ImagePlus, X } from "lucide-react";

import { cn } from "@/lib/utils";

/* 이미지 팝업: 감싼 칸(children)을 누르면 가로세로 16:9 팝업창이 뜹니다.
   - 크기: 세로 720px × 가로 1280px. 화면이 그보다 작으면 16:9 비율 그대로 화면에 맞게 줄어듭니다.
   - 닫기: 오른쪽 위 X 버튼, 팝업 바깥 어두운 곳 클릭, 또는 키보드 Esc
   - 이미지가 없으면 점선 안내가, 관리자에서 링크를 넣었으면 "링크 열기" 버튼이 보입니다. */
export function ImagePopup({
  title,
  imageUrl,
  linkUrl,
  emptyLabel,
  children,
  className,
}: {
  title: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
  emptyLabel: string;
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
        className={cn("block w-full cursor-zoom-in text-left", className)}
      >
        {children}
      </button>

      <dialog
        ref={ref}
        aria-label={title}
        // 팝업 바깥(어두운 배경)을 누르면 닫힘
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        {/* 팝업 본체: 16:9 (aspect-video). 폭 = 1280px / 화면 폭 / 화면 높이×16/9 중 가장 작은 값 */}
        <div className="relative aspect-video w-[min(1280px,calc(100vw_-_2rem),calc((100dvh_-_2rem)*16/9))] overflow-hidden rounded-2xl bg-hero text-hero-foreground shadow-2xl ring-1 ring-hero-foreground/15">
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill sizes="1280px" className="object-contain" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 border-2 border-dashed border-hero-foreground/25 bg-hero-foreground/5 text-hero-muted">
              <ImagePlus className="size-12" />
              <span className="text-base">{emptyLabel}</span>
            </div>
          )}

          {/* 아래쪽 제목 + 링크 버튼 */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-black/70 to-transparent p-4 pt-12 sm:p-6 sm:pt-16">
            <p className="text-base font-semibold sm:text-xl">{title}</p>
            {linkUrl ? (
              <a
                href={linkUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                링크 열기
                <ExternalLink className="size-4" />
              </a>
            ) : null}
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="닫기"
            className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-black/50 text-white ring-1 ring-white/20 backdrop-blur hover:bg-black/70"
          >
            <X className="size-5" />
          </button>
        </div>
      </dialog>
    </>
  );
}
