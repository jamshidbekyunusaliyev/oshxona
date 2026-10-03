"use client";

import { Check, Copy, MessageCircle, Send, Share2, X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";

interface ShareButtonProps {
  title: string;
  text: string;
  path: string;
  className?: string;
}

type ToastState = { message: string; isError: boolean } | null;

export function ShareButton({ title, text, path, className = "" }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function getAbsoluteUrl() {
    return `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;
  }

  async function handleShare(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!navigator.share) {
      setIsOpen((open) => !open);
      return;
    }

    try {
      await navigator.share({ title, text, url: getAbsoluteUrl() });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setToast({ message: "Havolani ulashib bo'lmadi. Qayta urinib ko'ring.", isError: true });
    }
  }

  async function copyLink(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const url = getAbsoluteUrl();

    try {
      let copied = false;
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(url);
          copied = true;
        } catch {
          copied = false;
        }
      }

      if (!copied) {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);
        try {
          textarea.focus();
          textarea.select();
          copied = document.execCommand("copy");
        } finally {
          textarea.remove();
        }
      }
      if (!copied) throw new Error("Copy command failed");

      setIsOpen(false);
      setToast({ message: "Havola nusxalandi", isError: false });
    } catch {
      setToast({ message: "Havolani nusxalab bo'lmadi. Qayta urinib ko'ring.", isError: true });
    }
  }

  const absoluteUrl = typeof window === "undefined" ? path : getAbsoluteUrl();
  const encodedUrl = encodeURIComponent(absoluteUrl);
  const encodedText = encodeURIComponent(`${title} | ${text}`);

  function stopNavigation(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    event.stopPropagation();
    window.open(event.currentTarget.href, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Ulashish: ${title}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="grid size-11 place-items-center rounded-full border border-border bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Share2 className="size-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] z-30 w-48 rounded-md border border-border bg-popover p-1.5 text-popover-foreground shadow-xl"
          role="menu"
          aria-label="Ulashish usullari"
          onClick={(event) => event.stopPropagation()}
        >
          <button type="button" role="menuitem" onClick={copyLink} className="flex min-h-11 w-full items-center gap-2.5 rounded-sm px-2.5 text-left text-xs hover:bg-accent">
            <Copy className="size-3.5" aria-hidden="true" /> Havolani nusxalash
          </button>
          <a role="menuitem" href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`} onClick={stopNavigation} className="flex min-h-11 items-center gap-2.5 rounded-sm px-2.5 text-xs hover:bg-accent">
            <Send className="size-3.5" aria-hidden="true" /> Telegram
          </a>
          <a role="menuitem" href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`} onClick={stopNavigation} className="flex min-h-11 items-center gap-2.5 rounded-sm px-2.5 text-xs hover:bg-accent">
            <MessageCircle className="size-3.5" aria-hidden="true" /> WhatsApp
          </a>
          <a role="menuitem" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} onClick={stopNavigation} className="flex min-h-11 items-center gap-2.5 rounded-sm px-2.5 text-xs hover:bg-accent">
            <span className="grid size-3.5 place-items-center rounded-full bg-current/10 font-semibold" aria-hidden="true">f</span> Facebook
          </a>
          <a role="menuitem" href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} onClick={stopNavigation} className="flex min-h-11 items-center gap-2.5 rounded-sm px-2.5 text-xs hover:bg-accent">
            <X className="size-3.5" aria-hidden="true" /> X
          </a>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-5 left-1/2 z-[100] flex min-h-11 -translate-x-1/2 items-center gap-2 rounded-md border px-4 py-2 text-xs shadow-xl ${toast.isError ? "border-destructive/40 bg-popover text-foreground" : "border-primary/30 bg-popover text-foreground"}`}
          role={toast.isError ? "alert" : "status"}
          aria-live="polite"
        >
          {toast.isError ? <Share2 className="size-4 text-destructive" aria-hidden="true" /> : <Check className="size-4 text-primary" aria-hidden="true" />}
          {toast.message}
        </div>
      )}
    </div>
  );
}