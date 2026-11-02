"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";

/* 돋보기 효과: 마우스가 지나가는 곳 주변의 글자가 살짝 커지고 떠오릅니다.
   - MagnifyArea 로 감싼 영역 안의 MagnifyText 글자에만 적용됩니다.
   - 마우스가 있는 컴퓨터에서만 움직이고, 휴대폰(터치)·'동작 줄이기' 기기에서는 가만히 있습니다.
   - 세기 조절: RADIUS(영향 범위, px), MAX_SCALE(가장 커지는 정도, 0.3 = 30%), LIFT(떠오르는 높이, px) */
const RADIUS = 110;
const MAX_SCALE = 0.35;
const LIFT = 4;

type Char = { el: HTMLElement; x: number; y: number; active: boolean };

export function MagnifyArea({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const area = ref.current;
    if (!area) return;
    if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;

    let chars: Char[] = [];
    let dirty = true;
    let frame = 0;
    let mouseX = 0;
    let mouseY = 0;

    // 글자마다 화면 속 위치(가운데 점)를 기억해 둠. 화면 크기가 바뀌면 다시 잼
    const measure = () => {
      chars = Array.from(area.querySelectorAll<HTMLElement>("[data-mag]"), (el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          x: r.left + r.width / 2 + window.scrollX,
          y: r.top + r.height / 2 + window.scrollY,
          active: false,
        };
      });
      dirty = false;
    };

    const update = () => {
      frame = 0;
      if (dirty) measure();
      const x = mouseX + window.scrollX;
      const y = mouseY + window.scrollY;
      for (const c of chars) {
        const d = Math.hypot(c.x - x, c.y - y);
        if (d < RADIUS) {
          // 마우스 바로 아래가 가장 크고, 멀어질수록 부드럽게 원래 크기로
          const f = 0.5 * (1 + Math.cos((Math.PI * d) / RADIUS));
          c.el.style.transform = `translateY(${-LIFT * f}px) scale(${1 + MAX_SCALE * f})`;
          c.active = true;
        } else if (c.active) {
          c.el.style.transform = "";
          c.active = false;
        }
      }
    };

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      for (const c of chars) {
        c.el.style.transform = "";
        c.active = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const markDirty = () => {
      dirty = true;
    };

    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerenter", markDirty);
    area.addEventListener("pointerleave", reset);
    window.addEventListener("resize", markDirty);
    const observer = new ResizeObserver(markDirty);
    observer.observe(area);

    return () => {
      reset();
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerenter", markDirty);
      area.removeEventListener("pointerleave", reset);
      window.removeEventListener("resize", markDirty);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* 글자를 한 자씩 나눠서 돋보기 효과를 받을 수 있게 함.
   단어 중간에서 줄이 바뀌지 않도록 단어 단위로 묶고, "\n" 은 줄바꿈으로 바꿉니다.
   화면 읽기 프로그램에는 원래 문장 그대로 읽히도록 따로 넣어 둠. */
export function MagnifyText({ text }: { text: string }) {
  return (
    <>
      <span aria-hidden>
        {text.split("\n").map((line, li) => (
          <Fragment key={li}>
            {li > 0 ? <br /> : null}
            {line.split(" ").map((word, wi) => (
              <Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span className="inline-block whitespace-nowrap">
                  {Array.from(word, (ch, ci) => (
                    <span
                      key={ci}
                      data-mag
                      className="inline-block transition-transform duration-150 ease-out"
                    >
                      {ch}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}
