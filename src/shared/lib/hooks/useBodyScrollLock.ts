"use client";

import { useEffect } from "react";

const SCROLL_LOCK_CLASS = "scroll-locked";
const SCROLLBAR_WIDTH_VAR = "--scrollbar-width";

function getScrollbarWidth(): number {
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

type SavedStyles = {
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyRight: string;
  bodyWidth: string;
  bodyOverflow: string;
  bodyPaddingRight: string;
  docOverflow: string;
  scrollY: number;
};

let lockCount = 0;
let saved: SavedStyles | null = null;

function lockBodyScroll(): void {
  if (lockCount === 0) {
    const body = document.body;
    const docEl = document.documentElement;
    const scrollY = window.scrollY;
    const scrollbarWidth = getScrollbarWidth();

    saved = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      docOverflow: docEl.style.overflow,
      scrollY,
    };

    docEl.classList.add(SCROLL_LOCK_CLASS);
    docEl.style.setProperty(SCROLLBAR_WIDTH_VAR, `${scrollbarWidth}px`);
    docEl.style.overflow = "hidden";

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  lockCount += 1;
}

function unlockBodyScroll(): void {
  if (lockCount <= 0) return;

  lockCount -= 1;
  if (lockCount > 0 || !saved) return;

  const body = document.body;
  const docEl = document.documentElement;
  const { scrollY } = saved;

  body.style.position = saved.bodyPosition;
  body.style.top = saved.bodyTop;
  body.style.left = saved.bodyLeft;
  body.style.right = saved.bodyRight;
  body.style.width = saved.bodyWidth;
  body.style.overflow = saved.bodyOverflow;
  body.style.paddingRight = saved.bodyPaddingRight;

  docEl.style.overflow = saved.docOverflow;
  docEl.classList.remove(SCROLL_LOCK_CLASS);
  docEl.style.removeProperty(SCROLLBAR_WIDTH_VAR);

  saved = null;
  window.scrollTo(0, scrollY);
}

/**
 * Locks page scroll when a modal is open without horizontal layout shift.
 * Uses position:fixed on body + scrollbar width compensation for sticky header.
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [locked]);
}
