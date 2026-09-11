import { useEffect, useRef, useState } from "react";

type Props = {
  episode: string;
  title: string;
  paragraphs: string[];
  onDone: () => void;
};

// Safety net only, in case the tab is backgrounded the whole time and the
// rAF watcher below never gets to run. The real cutover is driven by the
// crawl text's actual rendered position, so this can be generous.
const FALLBACK_MS = 65000;

// Cut over once the crawl's bottom edge has scrolled above this fraction of
// the viewport height (it's dissolving into the top mask by then), plus a
// short beat so the cut doesn't feel abrupt.
const CLEAR_THRESHOLD = 0.25;
const CLEAR_BEAT_MS = 450;

/**
 * Star Wars-style opening crawl. Ported from the coco_bday reveal page.
 * Tap anywhere (or press space) to pause — freezes the scroll and the
 * auto-advance together, for when something pulls the reader away mid-read.
 * Esc/Enter/skip button jump straight through.
 *
 * Auto-advance watches where the text actually is on screen rather than
 * racing a fixed timer against the CSS animation's duration — so retuning
 * the crawl's speed in intro.css never reintroduces a dead-air gap before
 * the cutover.
 */
export default function IntroCrawl({ episode, title, paragraphs, onDone }: Props) {
  const doneRef = useRef(false);
  const pausedRef = useRef(false);
  const [paused, setPausedUI] = useState(false);
  const [hintGone, setHintGone] = useState(false);
  const remainingRef = useRef(FALLBACK_MS);
  const runningSinceRef = useRef(Date.now());
  const fallbackTimerRef = useRef<number | undefined>(undefined);
  const crawlRef = useRef<HTMLDivElement>(null);

  function finish() {
    if (doneRef.current) return;
    doneRef.current = true;
    window.clearTimeout(fallbackTimerRef.current);
    onDone();
  }

  function setPaused(next: boolean) {
    if (doneRef.current || next === pausedRef.current) return;
    pausedRef.current = next;
    setPausedUI(next);
    setHintGone(true);
    if (next) {
      window.clearTimeout(fallbackTimerRef.current);
      remainingRef.current -= Date.now() - runningSinceRef.current;
    } else {
      runningSinceRef.current = Date.now();
      fallbackTimerRef.current = window.setTimeout(finish, Math.max(remainingRef.current, 0));
    }
  }

  useEffect(() => {
    // Reduced motion: the crawl won't visibly scroll, so don't make anyone
    // sit through a frozen final frame for the full duration — skip ahead.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    fallbackTimerRef.current = window.setTimeout(finish, remainingRef.current);

    let raf = 0;
    let clearTimer: number | undefined;
    function watch() {
      if (doneRef.current) return;
      if (!pausedRef.current && crawlRef.current) {
        const bottom = crawlRef.current.getBoundingClientRect().bottom;
        if (bottom < window.innerHeight * CLEAR_THRESHOLD) {
          clearTimer = window.setTimeout(finish, CLEAR_BEAT_MS);
          return;
        }
      }
      raf = requestAnimationFrame(watch);
    }
    raf = requestAnimationFrame(watch);

    let lastTap = 0;
    function onPointerDown(e: PointerEvent) {
      if (doneRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest?.(".intro-skip")) return;
      const now = Date.now();
      if (now - lastTap < 300) return; // ignore accidental double-fire
      lastTap = now;
      setPaused(!pausedRef.current);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (doneRef.current) return;
      if (e.key === " " || e.key === "Spacebar" || e.key === "k") {
        e.preventDefault();
        setPaused(!pausedRef.current);
      } else if (e.key === "Escape" || e.key === "Enter") {
        finish();
      }
    }

    // pointerdown, not click: the crawl text is scrolling, so a tap's
    // up-target differs from its down-target and the browser fires no click.
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(fallbackTimerRef.current);
      window.clearTimeout(clearTimer);
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`intro-crawl${paused ? " is-paused" : ""}`}>
      <p className="fade-line">A long time ago, in a town not so far away....</p>

      <div className="crawl-wrap">
        <div className="crawl">
          <div className="crawl-content" ref={crawlRef}>
            <p className="crawl-episode">{episode}</p>
            <h1 className="sw-logo">{title}</h1>
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      <button type="button" className="intro-skip" onClick={finish}>
        skip intro &raquo;
      </button>
      <p className={`tap-hint${hintGone ? " gone" : ""}`}>tap to pause</p>
      <div className="paused-badge" role="status">
        &#10073;&#10073;&nbsp; paused &mdash; tap to resume
      </div>
    </div>
  );
}
