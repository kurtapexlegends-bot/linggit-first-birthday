"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, List, Music2, Sun, VolumeX, X } from "lucide-react";
import { EditorialInvitation } from "@/components/invitation/EditorialInvitation";
import { UnsealEnvelope } from "@/components/invitation/UnsealEnvelope";
import type { formatInvitation, InvitationSettings } from "@/lib/invitation-settings";
import { audioController } from "@/lib/audio";

const chapters = [
  { id: "welcome", label: "Welcome" },
  { id: "dress-code", label: "Dress code" },
  { id: "venue", label: "Directions" },
  { id: "birthday", label: "Birthday star" },
  { id: "party", label: "Party program" },
  { id: "rsvp", label: "RSVP" },
];

interface InvitationHomeProps {
  settings: InvitationSettings;
  dates: ReturnType<typeof formatInvitation>;
  photoSrc: string;
  musicSrc: string;
  coverSrc: string;
}

export function InvitationHome({ settings, dates, photoSrc, musicSrc, coverSrc }: InvitationHomeProps) {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [activeChapter, setActiveChapter] = useState("");
  const timer = useRef<number>();
  const progress = useRef<HTMLSpanElement>(null);
  const chapterMenu = useRef<HTMLDivElement>(null);
  const chapterButton = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const chapterTarget = useRef("");

  useEffect(() => {
    try {
      const soundOff = sessionStorage.getItem("linggit_sound_muted") === "true";
      audioController.setMuted(soundOff);
      setMuted(soundOff);
    } catch {
      // Sound is still available when session storage is blocked.
    }

    function followChapterLink() {
      const id = window.location.hash.slice(1);
      if (!chapters.some((chapter) => chapter.id === id)) return;
      if (document.getElementById(id)?.getClientRects().length) return;
      window.clearTimeout(timer.current);
      chapterTarget.current = id;
      setOpening(false);
      setHasOpened(true);
      setOpened(true);
    }

    followChapterLink();
    window.addEventListener("hashchange", followChapterLink);
    return () => {
      window.clearTimeout(timer.current);
      window.removeEventListener("hashchange", followChapterLink);
    };
  }, []);

  useEffect(() => {
    if (!opened) return;
    const targetId = chapterTarget.current;
    const target = document.getElementById(targetId);
    const isDirectLink = window.location.hash === `#${targetId}`;
    target?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "start", behavior: isDirectLink ? "instant" : "auto" });

    const alignment = new AbortController();
    let alignmentFrame = 0;
    let alignmentTimeout = 0;
    function scheduleAlignment() {
      if (!target || !isDirectLink || alignment.signal.aborted || alignmentFrame) return;
      alignmentFrame = window.requestAnimationFrame(() => {
        alignmentFrame = 0;
        if (alignment.signal.aborted || window.location.hash !== `#${targetId}`) return;
        const top = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
        if (Math.abs(target.getBoundingClientRect().top - top) > 1) {
          target.scrollIntoView({ block: "start", behavior: "instant" });
        }
      });
    }

    if (target && isDirectLink) {
      const cancelAlignment = () => alignment.abort();
      for (const event of ["wheel", "pointerdown", "keydown"]) {
        window.addEventListener(event, cancelAlignment, { passive: true, signal: alignment.signal });
      }
      // Initial browser scroll restoration can race hydration and the font layout.
      window.addEventListener("scroll", scheduleAlignment, { passive: true, signal: alignment.signal });
      window.addEventListener("load", scheduleAlignment, { once: true, signal: alignment.signal });
      void document.fonts.ready.then(() => {
        if (alignment.signal.aborted) return;
        scheduleAlignment();
        alignmentTimeout = window.setTimeout(cancelAlignment, 700);
      });
    }

    const sections = chapters.flatMap(({ id }) => {
      const section = document.getElementById(id);
      return section ? [section] : [];
    });
    const artworkNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-art]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const invitation = sections[0]?.parentElement;
    let frame = 0;
    let previousChapter = "";
    let chapterOffsets: number[] = [];
    let viewportHeight = 0;
    let readingLength = 1;
    let artwork: { element: HTMLElement; top: number; height: number; lastPosition?: number }[] = [];

    function measureReadingPosition() {
      if (!invitation) return;
      const scroll = window.scrollY;
      viewportHeight = window.innerHeight;
      chapterOffsets = sections.map((section) => section.getBoundingClientRect().top + scroll);
      artwork = artworkNodes.map((element) => {
        const bounds = element.getBoundingClientRect();
        return { element, top: bounds.top + scroll, height: bounds.height };
      });
      readingLength = Math.max(1, invitation.offsetHeight - viewportHeight * .68);
      scheduleUpdate();
      scheduleAlignment();
    }

    function updateReadingPosition() {
      frame = 0;
      const start = chapterOffsets[0];
      if (start === undefined) return;
      const scroll = window.scrollY;
      const fraction = Math.max(0, Math.min(1, (scroll + viewportHeight * .32 - start) / readingLength));
      progress.current?.style.setProperty("--reading-progress", String(fraction));
      if (!reducedMotion.matches) {
        for (const scene of artwork) {
          const { element, top, height } = scene;
          if (!height || top >= scroll + viewportHeight || top + height <= scroll) continue;
          const cover = element.dataset.scrollArt === "cover";
          const entering = (top - scroll - viewportHeight * .24) / (viewportHeight * .66);
          const progress = Math.max(0, Math.min(1, cover ? (scroll - top) / height : entering));
          const eased = cover ? progress : progress * progress * (3 - 2 * progress);
          const rounded = Math.round(eased * 1000) / 1000;
          if (scene.lastPosition === rounded) continue;
          scene.lastPosition = rounded;
          element.style.setProperty(cover ? "--art-progress" : "--art-fold", String(rounded));
        }
      }
      let active = "";
      for (let index = 0; index < chapterOffsets.length; index++) {
        if (chapterOffsets[index] > scroll + viewportHeight * .36) break;
        active = sections[index].id;
      }
      if (active !== previousChapter) {
        previousChapter = active;
        setActiveChapter(active);
      }
    }
    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateReadingPosition);
    }
    measureReadingPosition();
    const sizeObserver = new ResizeObserver(measureReadingPosition);
    if (invitation) sizeObserver.observe(invitation);
    for (const section of sections) sizeObserver.observe(section);
    for (const element of artworkNodes) sizeObserver.observe(element);
    reducedMotion.addEventListener("change", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measureReadingPosition);
    return () => {
      alignment.abort();
      sizeObserver.disconnect();
      reducedMotion.removeEventListener("change", scheduleUpdate);
      for (const element of artworkNodes) {
        element.style.removeProperty("--art-progress");
        element.style.removeProperty("--art-fold");
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", measureReadingPosition);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(alignmentFrame);
      window.clearTimeout(alignmentTimeout);
    };
  }, [opened]);

  useEffect(() => {
    if (!menuOpen) return;
    function dismiss(event: Event) {
      if (event.target instanceof Node && !chapterMenu.current?.contains(event.target)) setMenuOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      chapterButton.current?.focus();
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  function followChapter(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setMenuOpen(false);
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    });
  }

  function openInvitation() {
    if (opening || opened) return;
    audioController.startLullaby(musicSrc);
    audioController.playSparkle();
    setMusicStarted(true);
    chapterTarget.current = "welcome";
    setOpening(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(() => {
      setHasOpened(true);
      setOpened(true);
      setOpening(false);
    }, reducedMotion ? 0 : 540);
  }

  function toggleSound() {
    const soundOff = opened && !musicStarted ? false : !muted;
    audioController.setMuted(soundOff);
    if (opened && !musicStarted) {
      audioController.startLullaby(musicSrc);
      setMusicStarted(true);
    }
    setMuted(soundOff);
    try {
      sessionStorage.setItem("linggit_sound_muted", String(soundOff));
    } catch {
      // Keep the current preference in memory.
    }
  }

  function replayEnvelope() {
    setOpened(false);
    setMenuOpen(false);
    setActiveChapter("");
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    window.requestAnimationFrame(() => document.getElementById("open-invitation")?.focus());
  }

  const playingSound = !muted && (!opened || musicStarted);

  return (
    <>
      <header className="site-header" data-open={opened}>
        <a href="#top" className="skip-link">Skip to invitation</a>
        <div className="site-header-inner wrap">
          <a href="#top" className="wordmark" aria-label={settings.nickname + " turns one, invitation cover"}>
            <Sun size={24} aria-hidden="true" />
            <span className="wordmark-full">{settings.nickname} turns one<span aria-hidden="true">.</span></span>
            <span className="wordmark-short">{settings.nickname}</span>
          </a>
          {opened && (
            <nav aria-label="Invitation chapters" className="chapter-nav">
              {chapters.filter(({ id }) => id !== "rsvp").map(({ id, label }) => (
                <a key={id} href={`#${id}`} aria-current={activeChapter === id ? "location" : undefined} onClick={(event) => followChapter(event, id)}>{label}</a>
              ))}
            </nav>
          )}
          <div className="header-actions">
            {opened && <div className="chapter-menu" ref={chapterMenu}>
              <button ref={chapterButton} type="button" className="chapter-trigger" aria-label="Chapters" aria-expanded={menuOpen} aria-controls="mobile-chapters" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={19} aria-hidden="true" /> : <List size={19} aria-hidden="true" />}
              </button>
              <nav id="mobile-chapters" className="chapter-panel" aria-label="Invitation chapters" hidden={!menuOpen}>
                {chapters.filter(({ id }) => id !== "rsvp").map(({ id, label }) => (
                  <a key={id} href={"#" + id} aria-current={activeChapter === id ? "location" : undefined} onClick={(event) => followChapter(event, id)}>{label}<ArrowRight size={15} aria-hidden="true" /></a>
                ))}
              </nav>
            </div>}
            <button type="button" className="sound-toggle" aria-label="Sound" aria-pressed={playingSound} onClick={toggleSound}>
              {playingSound ? <Music2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}
              <span>Sound {playingSound ? "on" : "off"}</span>
            </button>
            {opened && <a className="header-rsvp" href="#rsvp" aria-current={activeChapter === "rsvp" ? "location" : undefined} onClick={(event) => followChapter(event, "rsvp")}>RSVP <ArrowUpRight size={15} aria-hidden="true" /></a>}
          </div>
        </div>
        {opened && <span ref={progress} className="reading-progress" aria-hidden="true" />}
      </header>
      <main id="top" tabIndex={-1}>
        <section className="hero" data-enter data-scroll-art="cover" data-custom-cover={Boolean(coverSrc)} data-long-name={settings.nickname.length > 12} aria-labelledby="hero-title">
          <picture className="hero-art" aria-hidden="true">
            {!coverSrc && <source media="(max-width: 640px) and (orientation: portrait)" srcSet="/images/sunshine-phone.webp" />}
            <img src={coverSrc || "/images/sunshine-storybook.webp"} alt="" width="1536" height="1024" fetchPriority="high" />
          </picture>
          <div className="hero-inner wrap">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-rule" /> A first birthday invitation</p>
              <h1 id="hero-title">{settings.nickname}<br /><em>turns one!</em></h1>
              <p className="hero-intro">{settings.coverIntro}</p>
              <p className="hero-date"><CalendarDays size={18} aria-hidden="true" /> <time dateTime={settings.date}>{dates.displayDate}</time></p>
              {opened ? (
                <a className="button button-primary hero-button" href="#welcome" onClick={(event) => followChapter(event, "welcome")}>Read the invitation <ArrowDown size={18} aria-hidden="true" /></a>
              ) : (
                <button id="open-invitation" className="button button-primary hero-button" type="button" disabled={opening} onClick={openInvitation}>
                  {opening ? "Opening invitation…" : "Open the invitation"} <ArrowDown size={18} aria-hidden="true" />
                </button>
              )}
            </div>
            <UnsealEnvelope opening={opening} opened={opened} onOpen={openInvitation} />
          </div>
        </section>
        {hasOpened && <EditorialInvitation settings={settings} dates={dates} hidden={!opened} photoSrc={photoSrc} onReplayEnvelope={replayEnvelope} />}
      </main>
    </>
  );
}
