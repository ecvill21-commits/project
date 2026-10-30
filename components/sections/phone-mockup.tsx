import { BatteryFull, Paperclip, Send, Signal, Smile, Wifi } from "lucide-react";

import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

/* 코드로 그린 휴대폰 그림 (대화 말풍선). 글자는 site.config.ts 의 heroChat 에서 가져옵니다.
   지금은 첫 화면에서 쓰지 않지만, 다시 쓰고 싶으면 <PhoneMockup /> 을 원하는 곳에 넣으세요. */
export function PhoneMockup() {
  const { heroChat } = siteConfig;

  return (
    <div
      aria-hidden
      className="relative w-[270px] rounded-[2.75rem] bg-nav p-3 shadow-2xl shadow-black/50 ring-1 ring-hero-foreground/15 sm:w-[300px] lg:-rotate-3"
    >
      {/* 스피커 */}
      <div className="absolute left-1/2 top-4 h-1.5 w-16 -translate-x-1/2 rounded-full bg-hero-foreground/20" />

      <div className="mt-6 overflow-hidden rounded-[2rem] bg-background text-foreground">
        {/* 상태 표시줄 */}
        <div className="flex items-center justify-end gap-1 bg-hero px-4 pt-2 pb-1 text-[11px] text-hero-foreground">
          <Signal className="size-3" />
          <Wifi className="size-3" />
          <BatteryFull className="size-3.5" />
          <span className="ml-1">9:41</span>
        </div>

        {/* 대화방 제목 */}
        <div className="flex items-center gap-3 bg-hero px-4 py-3 text-hero-foreground">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {heroChat.title.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{heroChat.title}</p>
            <p className="truncate text-xs text-hero-muted">{heroChat.subtitle}</p>
          </div>
          <Paperclip className="size-4 text-hero-muted" />
          <Smile className="size-4 text-hero-muted" />
        </div>

        {/* 말풍선 */}
        <div className="space-y-2.5 bg-muted px-3 py-4">
          {heroChat.messages.map((m, i) => {
            const mine = m.from === "me";
            return (
              <div key={i} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                    mine
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-background"
                  )}
                >
                  {!mine && m.name ? (
                    <p className="mb-0.5 text-xs font-semibold text-primary">{m.name}</p>
                  ) : null}
                  {m.text}
                  <span className="ml-2 align-bottom text-[10px] opacity-70">{m.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 입력창 */}
        <div className="flex items-center gap-2 border-t bg-background px-3 py-3">
          <div className="h-9 flex-1 rounded-full border px-4 text-xs leading-9 text-muted-foreground">
            {heroChat.placeholder}
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Send className="size-4" />
          </div>
        </div>
      </div>

      {/* 홈 바 */}
      <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-hero-foreground/25" />
    </div>
  );
}
