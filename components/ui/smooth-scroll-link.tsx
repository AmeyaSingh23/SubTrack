"use client";

type Props = {
  targetId: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Smooth-scrolls to an element by id. Needed because the app uses
 * `html { overflow: hidden }`, which breaks the default anchor smooth scroll.
 * This walks up from the target to find the actual scrollable ancestor.
 */
export function SmoothScrollLink({ targetId, className, children }: Props) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;

    // Find the nearest scrollable ancestor (the one that actually scrolls
    // when you wheel-scroll the page).
    let scroller: HTMLElement | Window = window;
    let node: HTMLElement | null = target.parentElement;
    while (node) {
      const style = getComputedStyle(node);
      const overflowY = style.overflowY;
      const isScrollable =
        (overflowY === "auto" || overflowY === "scroll") &&
        node.scrollHeight > node.clientHeight;
      if (isScrollable) {
        scroller = node;
        break;
      }
      node = node.parentElement;
    }

    if (scroller === window) {
      // Fall back to scrolling the document body or html.
      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      const el = scroller as HTMLElement;
      const top = target.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop;
      el.scrollTo({ top, behavior: "smooth" });
    }
  }

  return (
    <a href={`#${targetId}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
