"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeferredInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const noSubscription = () => () => undefined;
const serverSnapshot = () => false;

function subscribeToInstallMode(onChange: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const displayMode = window.matchMedia("(display-mode: standalone)");
  displayMode.addEventListener("change", onChange);
  window.addEventListener("appinstalled", onChange);
  return () => {
    displayMode.removeEventListener("change", onChange);
    window.removeEventListener("appinstalled", onChange);
  };
}

function isInstalled() {
  if (typeof window === "undefined") return false;
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
}

function isIosSafariCandidate() {
  if (typeof navigator === "undefined") return false;
  const userAgent = navigator.userAgent;
  const isAppleMobile = /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(userAgent);
  return isAppleMobile && isSafari;
}

export function InstallButton({
  className = "",
  compactOnMobile = false,
}: {
  className?: string;
  compactOnMobile?: boolean;
}) {
  const [promptEvent, setPromptEvent] = useState<DeferredInstallPrompt | null>(null);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const installed = useSyncExternalStore(subscribeToInstallMode, isInstalled, serverSnapshot);
  const isIosSafari = useSyncExternalStore(noSubscription, isIosSafariCandidate, serverSnapshot);

  useEffect(() => {
    function captureInstallPrompt(event: Event) {
      event.preventDefault();
      setPromptEvent(event as DeferredInstallPrompt);
    }

    function handleInstalled() {
      setPromptEvent(null);
    }

    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function installApp() {
    if (!promptEvent) {
      setShowIosInstructions(true);
      return;
    }

    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  }

  if (installed || (!promptEvent && !isIosSafari)) return null;

  return (
    <>
      <button
        type="button"
        onClick={installApp}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary/40 text-xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${compactOnMobile ? "w-11 px-0 sm:w-auto sm:px-3" : "px-3"} ${className}`}
        aria-label="Ilovani yuklab olish"
        title="Ilovani yuklab olish"
      >
        <Download className="size-4" aria-hidden="true" />
        <span className={compactOnMobile ? "hidden sm:inline" : undefined}>Ilovani yuklab olish</span>
      </button>

      <Dialog open={showIosInstructions} onOpenChange={setShowIosInstructions}>
        <DialogPortal>
          <DialogBackdrop className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm" />
          <DialogPopup className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md border border-border bg-popover p-6 text-popover-foreground shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setShowIosInstructions(false)}
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Yopish"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            <DialogTitle className="pr-8 font-heading text-2xl">Tasty&apos;ni bosh ekranga qo&apos;shing</DialogTitle>
            <DialogDescription className="mt-3 text-sm leading-6 text-muted-foreground">
              Safari brauzerida quyidagi amallarni bajaring:
            </DialogDescription>
            <p className="mt-5 rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-medium text-foreground">
              Safari -&gt; Ulashish -&gt; Bosh ekranga qo&apos;shish
            </p>
          </DialogPopup>
        </DialogPortal>
      </Dialog>
    </>
  );
}