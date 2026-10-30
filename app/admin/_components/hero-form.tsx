"use client";

import { useActionState } from "react";

import { saveHeroText, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import type { HeroText } from "@/lib/types";

const inputClass =
  "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50";
const textareaClass =
  "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50";

/** 첫 화면(히어로) 글자·버튼 링크 수정 칸. hero 에는 지금 사이트에 보이는 값을 넘깁니다. */
export function HeroForm({ hero }: { hero: HeroText }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveHeroText, {});

  return (
    <form action={action} className="grid gap-5">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">작은 머리글</span>
        <input name="eyebrow" defaultValue={hero.eyebrow} className={inputClass} />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">큰 제목 *</span>
        <textarea name="title" required rows={2} defaultValue={hero.title} className={textareaClass} />
        <span className="text-xs text-muted-foreground">Enter 로 줄을 바꾸면 사이트에서도 줄이 바뀝니다.</span>
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">설명 문장</span>
        <textarea name="description" rows={3} defaultValue={hero.description} className={textareaClass} />
      </label>

      <fieldset className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
        <legend className="px-1 text-sm font-medium">첫 번째 버튼 (검은색)</legend>
        <label className="grid gap-1.5 text-sm">
          <span>버튼 글자</span>
          <input name="primary_label" defaultValue={hero.primaryCta.label} className={inputClass} />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span>이동할 위치</span>
          <input name="primary_href" defaultValue={hero.primaryCta.href} placeholder="#features" className={inputClass} />
        </label>
      </fieldset>

      <fieldset className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
        <legend className="px-1 text-sm font-medium">두 번째 버튼 (테두리)</legend>
        <label className="grid gap-1.5 text-sm">
          <span>버튼 글자</span>
          <input name="secondary_label" defaultValue={hero.secondaryCta.label} className={inputClass} />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span>이동할 위치</span>
          <input name="secondary_href" defaultValue={hero.secondaryCta.href} placeholder="#contact" className={inputClass} />
        </label>
      </fieldset>

      <p className="text-xs leading-relaxed text-muted-foreground">
        이동할 위치 예시: <code>#about</code> 소개, <code>#features</code> 기능, <code>#contact</code> 연락처,{" "}
        <code>https://instagram.com</code> 다른 사이트. 칸을 비우면 기본 글자로 돌아갑니다.
      </p>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "저장 중..." : "저장하기"}
        </Button>
        {state.message ? (
          <p className={state.ok ? "text-sm text-muted-foreground" : "text-sm text-destructive"}>
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
