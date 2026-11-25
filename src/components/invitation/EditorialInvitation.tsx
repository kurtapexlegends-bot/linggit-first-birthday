"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  ArrowDown, ArrowLeft, ArrowUpRight, CalendarDays, Camera, Check, ChevronDown,
  Clock3, Copy, MapPin, MessageCircle, Minus, Music2, Plus, RotateCcw, Sparkles, Sun,
} from "lucide-react";
import { eventConfig } from "@/config/event-config";
import type { formatInvitation, InvitationSettings } from "@/lib/invitation-settings";
import { audioController } from "@/lib/audio";

const { milestones } = eventConfig;
const photoStorageKey = "linggit_custom_photo";

function foldCalendarLine(line: string) {
  const encoder = new TextEncoder();
  let bytes = 0;
  let folded = "";
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) {
      folded += "\r\n ";
      bytes = 1;
    }
    folded += character;
    bytes += size;
  }
  return folded;
}

function addToCalendar(settings: InvitationSettings, dates: ReturnType<typeof formatInvitation>) {
  const escape = (value: string) => value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Linggit//Birthday Invitation//EN",
    "BEGIN:VEVENT", "UID:linggit-first-birthday@birthday-invitation",
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`,
    `DTSTART:${dates.calendarStart}`, `DTEND:${dates.calendarEnd}`,
    `SUMMARY:${escape(`${settings.nickname}’s first birthday`)}`,
    `LOCATION:${escape(`${settings.venueName}, ${settings.address}`)}`,
    `DESCRIPTION:${escape(`Dress code: ${settings.dressHeading}`)}`,
    "END:VEVENT", "END:VCALENDAR", "",
  ];
  const url = URL.createObjectURL(new Blob([lines.map(foldCalendarLine).join("\r\n")], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "linggit-first-birthday.ics";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function BirthdayPortrait({ photoSrc, nickname }: { photoSrc: string; nickname: string }) {
  const [photo, setPhoto] = useState(photoSrc);
  const [photoFeedback, setPhotoFeedback] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const uploadId = useRef(0);
  const shared = photoSrc.startsWith("/api/invitation-media/");

  useEffect(() => {
    if (shared) return;
    try {
      const saved = localStorage.getItem(photoStorageKey);
      if (saved) setPhoto(saved);
    } catch {
      // Photo personalization can still work for the current visit.
    }
  }, [shared]);

  function loadPhoto(file?: File) {
    if (!file) return;
    const id = ++uploadId.current;
    const objectUrl = URL.createObjectURL(file);
    const preview = new window.Image();
    setPhotoFeedback("Preparing photo…");
    preview.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      if (id === uploadId.current) setPhotoFeedback("Try a JPEG, PNG, or WebP photo.");
    };
    preview.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (id !== uploadId.current) return;
      try {
        const scale = Math.min(1, 1200 / Math.max(preview.naturalWidth, preview.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(preview.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(preview.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Photo preview unavailable");
        context.drawImage(preview, 0, 0, canvas.width, canvas.height);
        const source = canvas.toDataURL("image/webp", 0.87);
        setPhoto(source);
        audioController.playSparkle();
        try {
          localStorage.setItem(photoStorageKey, source);
          setPhotoFeedback("Photo saved on this device.");
        } catch {
          setPhotoFeedback("Photo added for this visit.");
        }
      } catch {
        setPhotoFeedback("This photo could not be prepared. Try another image.");
      }
    };
    preview.src = objectUrl;
  }

  return (
    <figure className="portrait">
      <div className="portrait-frame" data-scroll-art="portrait">
        {photo ? (
          <Image src={photo} fill sizes="(max-width: 600px) 70vw, 340px" alt={`Baby ${nickname}`} onError={() => {
            setPhoto((current) => current === photo ? (photo === photoSrc ? "" : photoSrc) : current);
          }} />
        ) : (
          <div className="portrait-monogram" aria-hidden="true"><Sun strokeWidth={1.2} /></div>
        )}
      </div>
      {!shared && <>
        <input ref={input} hidden type="file" accept="image/*" onChange={(e) => { loadPhoto(e.target.files?.[0]); e.target.value = ""; }} />
        <button type="button" className="text-link portrait-action" onClick={() => input.current?.click()}>
          <Camera size={16} aria-hidden="true" /> {photo ? "Change photo" : "Add a photo"}
        </button>
      </>}
      <span className="portrait-feedback" role="status">{photoFeedback}</span>
    </figure>
  );
}

function GuestCount({ label, name, initial, disabled, invalid, onAdjust }: {
  label: "Adults" | "Children";
  name: "adults" | "kids";
  initial: number;
  disabled: boolean;
  invalid: boolean;
  onAdjust: () => void;
}) {
  const [value, setValue] = useState(String(initial));
  const count = Number(value);

  function step(delta: number) {
    setValue(String(Math.max(0, Math.min(100, Math.trunc(count) + delta))));
    onAdjust();
  }

  return <div className="guest-count">
    <label htmlFor={"guest-" + name}>{label}</label>
    <div className="count-control">
      <button type="button" aria-label={"Remove one " + (name === "adults" ? "adult" : "child")} disabled={disabled || count <= 0} onClick={() => step(-1)}>
        <Minus size={17} aria-hidden="true" />
      </button>
      <input id={"guest-" + name} name={name} type="number" inputMode="numeric" min="0" max="100" value={value}
        onChange={(event) => setValue(event.target.value)} disabled={disabled} required
        aria-invalid={invalid || undefined} aria-describedby={invalid ? "guest-count-error" : undefined} />
      <button type="button" aria-label={"Add one " + (name === "adults" ? "adult" : "child")} disabled={disabled || count >= 100} onClick={() => step(1)}>
        <Plus size={17} aria-hidden="true" />
      </button>
    </div>
  </div>;
}

type RsvpReceipt = { id: string; editKey: string };
const receiptUuid = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

async function rsvpStorageKey(name: string) {
  const normalized = name.toLowerCase().replace(/\s+/g, " ");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
  const nameKey = Array.from(new Uint8Array(digest).slice(0, 12), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return "linggit-rsvp-receipt:" + nameKey;
}

function readReceipt(key: string): RsvpReceipt | undefined {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "null");
    if (typeof value?.id === "string" && typeof value?.editKey === "string" && receiptUuid.test(value.id) && receiptUuid.test(value.editKey)) {
      return { id: value.id, editKey: value.editKey };
    }
  } catch {
    // Treat invalid or inaccessible storage as an empty receipt.
  }
}

function RsvpForm({ nickname, whatsapp }: Pick<InvitationSettings, "nickname" | "whatsapp">) {
  const [attending, setAttending] = useState(true);
  const [reply, setReply] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [guestCountError, setGuestCountError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const guestName = useRef<HTMLInputElement>(null);
  const replyTitle = useRef<HTMLHeadingElement>(null);
  const receipt = useRef<RsvpReceipt>();
  const receiptSlot = useRef<string>();
  const sending = useRef(false);

  useEffect(() => {
    if (reply) replyTitle.current?.focus();
  }, [reply]);

  async function sendReply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending.current) return;
    const fields = new FormData(e.currentTarget);
    const name = String(fields.get("name") ?? "").trim();
    if (!name) return;

    const message = String(fields.get("message") ?? "").trim();
    const adults = attending ? Number(fields.get("adults")) : 0;
    const children = attending ? Number(fields.get("kids")) : 0;
    if (attending && adults + children < 1) {
      setGuestCountError(true);
      e.currentTarget.querySelector<HTMLInputElement>('[name="adults"]')?.focus();
      return;
    }
    const lines = [
      `Hi! Here’s my RSVP for ${nickname}’s first birthday.`,
      `Name: ${name}`,
      `Attending: ${attending ? "Yes" : "No"}`,
    ];
    if (attending) lines.push(`Guests: ${adults} ${adults === 1 ? "adult" : "adults"}, ${children} ${children === 1 ? "child" : "children"}`);
    if (message) lines.push(`Note: ${message}`);
    sending.current = true;
    setSaving(true);
    setSubmitError("");
    try {
      const storageKey = await rsvpStorageKey(name).catch(() => undefined);
      if (!receipt.current) {
        receipt.current = (storageKey ? readReceipt(storageKey) : undefined) ?? { id: crypto.randomUUID(), editKey: crypto.randomUUID() };
        receiptSlot.current = storageKey;
        if (storageKey) {
          try { localStorage.setItem(storageKey, JSON.stringify(receipt.current)); } catch { /* The receipt is still available in memory. */ }
        }
      }
      const response = await fetch("/api/rsvp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...receipt.current, fields: { name, attending, adults, children, message } }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Your RSVP could not be saved. Try again.");
      if (storageKey && storageKey !== receiptSlot.current) {
        try {
          const existing = readReceipt(storageKey);
          if (!existing || existing.id === receipt.current.id) {
            localStorage.setItem(storageKey, JSON.stringify(receipt.current));
            const previous = receiptSlot.current;
            if (previous && readReceipt(previous)?.id === receipt.current.id) localStorage.removeItem(previous);
            receiptSlot.current = storageKey;
          }
        } catch {
          // The server saved the reply even when browser storage is unavailable.
        }
      }
      setReply(lines.join("\n"));
      setCopyStatus("");
    } catch (cause) {
      setSubmitError(cause instanceof TypeError ? "Check your connection, then try sending your RSVP again." : cause instanceof Error ? cause.message : "Your RSVP could not be saved. Try again.");
    } finally {
      sending.current = false;
      setSaving(false);
    }
  }

  async function copyReply() {
    try {
      await navigator.clipboard.writeText(reply);
      setCopyStatus("Reply copied.");
    } catch {
      setCopyStatus("Select and copy the reply above.");
    }
  }

  return (
    <>
      <form method="post" className="rsvp-form" onSubmit={sendReply} onChange={() => setGuestCountError(false)} hidden={Boolean(reply)} aria-busy={saving}>
        <fieldset className="rsvp-fields" disabled={saving}>
          <label htmlFor="guest-name">Your name</label>
          <input ref={guestName} id="guest-name" name="name" autoComplete="name" required pattern=".*\S.*" maxLength={100} />
          <fieldset>
            <legend>Will you be there?</legend>
            <div className="rsvp-options">
              <label><input type="radio" name="attending" checked={attending} onChange={() => setAttending(true)} /> Attending</label>
              <label><input type="radio" name="attending" checked={!attending} onChange={() => setAttending(false)} /> Can’t make it</label>
            </div>
          </fieldset>
          <div className="rsvp-counts" hidden={!attending}>
            <GuestCount label="Adults" name="adults" initial={1} disabled={!attending} invalid={guestCountError} onAdjust={() => setGuestCountError(false)} />
            <GuestCount label="Children" name="kids" initial={0} disabled={!attending} invalid={guestCountError} onAdjust={() => setGuestCountError(false)} />
          </div>
          {guestCountError && <p className="form-error" id="guest-count-error" role="alert">Add at least one adult or child who will attend.</p>}
          <label htmlFor="guest-message">A note for {nickname} <span>(optional)</span></label>
          <textarea id="guest-message" name="message" rows={3} maxLength={500} />
          {submitError && <p className="form-error" role="alert">{submitError}</p>}
          <button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving RSVP…" : "Send RSVP"} <ArrowUpRight size={17} aria-hidden="true" /></button>
        </fieldset>
      </form>
      {reply && (
        <div className="rsvp-reply">
          <span className="confirmation-mark" aria-hidden="true"><Check size={22} /></span>
          <h3 ref={replyTitle} tabIndex={-1}>Your RSVP is saved</h3>
          <p>The host can see your reply. You can also share a copy on WhatsApp.</p>
          <pre>{reply}</pre>
          <a className="button button-primary" href={`https://wa.me/${whatsapp.replace(/^\+/, "")}?text=${encodeURIComponent(reply)}`} target="_blank" rel="noreferrer">
            <MessageCircle size={17} aria-hidden="true" /> Share on WhatsApp <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <div className="reply-actions">
            <button className="text-link" type="button" onClick={copyReply}><Copy size={15} aria-hidden="true" /> Copy reply</button>
            <button className="text-link" type="button" onClick={() => {
              setReply("");
              window.requestAnimationFrame(() => guestName.current?.focus());
            }}>Edit reply</button>
          </div>
          <span className="copy-status" role="status">{copyStatus}</span>
        </div>
      )}
    </>
  );
}

interface EditorialInvitationProps {
  settings: InvitationSettings;
  dates: ReturnType<typeof formatInvitation>;
  hidden: boolean;
  photoSrc: string;
  onReplayEnvelope: () => void;
}

export function EditorialInvitation({ settings, dates, hidden, photoSrc, onReplayEnvelope }: EditorialInvitationProps) {
  const [swatch, setSwatch] = useState(0);
  const [swatchStatus, setSwatchStatus] = useState("");
  const [addressStatus, setAddressStatus] = useState("");
  const [candleLit, setCandleLit] = useState(true);
  const [chimed, setChimed] = useState(false);
  const color = settings.swatches[swatch] ?? settings.swatches[0];
  const addressQuery = encodeURIComponent(settings.address);
  // The original defaults search the whole city. Search the invitation address unless the host supplied a link.
  const mapsUrl = settings.mapsUrl === eventConfig.venue.googleMapsUrl
    ? "https://www.google.com/maps/search/?api=1&query=" + addressQuery
    : settings.mapsUrl;
  const wazeUrl = settings.wazeUrl === eventConfig.venue.wazeUrl
    ? "https://waze.com/ul?q=" + addressQuery
    : settings.wazeUrl;

  async function copySwatch() {
    try {
      await navigator.clipboard.writeText(color.hex);
      setSwatchStatus(`${color.hex} copied.`);
    } catch {
      setSwatchStatus(`Select ${color.hex} to copy it.`);
    }
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(settings.address);
      setAddressStatus("Address copied.");
    } catch {
      setAddressStatus("Select the address above to copy it.");
    }
  }

  function blowOutCandle() {
    setCandleLit(false);
    audioController.playCandleBlow();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    void import("canvas-confetti").then(({ default: confetti }) => {
      confetti({ particleCount: 52, spread: 72, origin: { y: 0.67 }, colors: ["#a74e61", "#efbc54", "#7da7c5", "#f8ebd2"], disableForReducedMotion: true });
    }).catch(() => {
      // The candle goes out even when the celebration effect cannot load.
    });
  }

  return (
    <div className="invitation" hidden={hidden}>
      <section id="welcome" className="welcome spread" aria-labelledby="welcome-title" tabIndex={-1}>
        <div className="spread-inner wrap welcome-inner">
          <div className="welcome-copy">
            <p className="eyebrow"><span className="eyebrow-rule" /> A hello from Ms. Rachel</p>
            <h2 id="welcome-title" tabIndex={-1}>Hi, friends!</h2>
            <p className="section-lead">{settings.welcomeMessage}</p>
            <div className="party-ticket">
              <div className="ticket-detail">
                <CalendarDays size={21} aria-hidden="true" />
                <div><strong><time dateTime={settings.date}>{dates.displayDate}</time></strong><span>{dates.displayTime}</span></div>
              </div>
              <div className="ticket-detail">
                <MapPin size={21} aria-hidden="true" />
                <div><strong>{settings.venueName}</strong>{settings.hall && <span>{settings.hall}</span>}</div>
              </div>
              <div className="ticket-actions">
                <a className="button button-outline" href="#venue">Directions <ArrowUpRight size={15} aria-hidden="true" /></a>
                <a className="button button-primary" href="#rsvp">RSVP <ArrowUpRight size={15} aria-hidden="true" /></a>
              </div>
            </div>
            <a className="text-link welcome-next" href="#dress-code">See what to wear <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
          <div className="welcome-art" data-scroll-art="welcome">
            <div className="illustration-sheet">
              <Image src="/images/ms-rachel-storybook.webp" alt="" fill sizes="(max-width: 760px) 88vw, 58vw" />
            </div>
            <a href="#venue" className="welcome-pin map-pin" aria-label="See the party location"><MapPin size={25} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section id="dress-code" className="dress spread" aria-labelledby="dress-title" tabIndex={-1}>
        <div className="spread-inner wrap dress-inner">
          <div>
            <p className="eyebrow"><span className="eyebrow-rule" /> What to wear</p>
            <h2 id="dress-title" tabIndex={-1}>{settings.dressHeading === "Come in cozy neutrals." ? <>Come in<br /> cozy neutrals.</> : settings.dressHeading}</h2>
            <p className="section-lead">{settings.dressIntro}</p>
          </div>
          <div className="palette-sheet" data-scroll-art="palette">
            <div className="palette-options" role="group" aria-label="Outfit colors">
              {settings.swatches.map((option, index) => (
                <button key={`${option.hex}-${index}`} type="button" aria-pressed={swatch === index} className="swatch" onClick={() => { setSwatch(index); setSwatchStatus(""); }}>
                  <span className="swatch-color" style={{ backgroundColor: option.hex }}>{swatch === index && <Check size={18} aria-hidden="true" />}</span>
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
            <div className="palette-detail" aria-live="polite">
              <div>
                <strong>{color.name}</strong>
                <button type="button" className="text-link" aria-label={`Copy ${color.name} color code`} onClick={copySwatch}>
                  {swatchStatus === `${color.hex} copied.` ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                  {color.hex}
                </button>
              </div>
              <p key={swatch}>{color.tip}</p>
              <span className="sr-only" role="status">{swatchStatus}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="venue" className="venue spread" aria-labelledby="venue-title" tabIndex={-1}>
        <div className="spread-inner wrap venue-inner">
          <div className="venue-art" data-scroll-art="venue" aria-hidden="true">
            <div className="illustration-sheet">
              <Image src="/images/neighborhood-storybook.webp" alt="" fill sizes="(max-width: 760px) 88vw, 43vw" />
            </div>
            <span className="map-pin"><MapPin size={42} strokeWidth={1.5} /></span>
          </div>
          <div className="venue-copy">
            <p className="eyebrow"><span className="eyebrow-rule" /> When &amp; where</p>
            <h2 id="venue-title" tabIndex={-1}>See you there.</h2>
            <p className="venue-name">{settings.venueName}</p>
            <p>{settings.address}</p>
            {settings.hall && <p className="venue-hall">{settings.hall}</p>}
            <div className="venue-time">
              <span><CalendarDays size={17} aria-hidden="true" /> {dates.displayDate}</span>
              <span><Clock3 size={17} aria-hidden="true" /> {dates.displayTime}</span>
            </div>
            <div className="link-row">
              {mapsUrl && <a className="button button-outline" href={mapsUrl} target="_blank" rel="noreferrer">Google Maps <ArrowUpRight size={16} aria-hidden="true" /></a>}
              {wazeUrl && <a className="button button-outline" href={wazeUrl} target="_blank" rel="noreferrer">Waze <ArrowUpRight size={16} aria-hidden="true" /></a>}
            </div>
            <div className="venue-utilities">
              <button type="button" className="text-link" onClick={copyAddress}><Copy size={15} aria-hidden="true" /> Copy address</button>
              <button type="button" className="text-link" onClick={() => addToCalendar(settings, dates)}><CalendarDays size={15} aria-hidden="true" /> Add to calendar</button>
              <span className="copy-status" role="status">{addressStatus}</span>
            </div>
            {settings.landmarks && <details className="venue-landmarks">
              <summary>Landmarks and parking <ChevronDown size={15} aria-hidden="true" /></summary>
              <p>{settings.landmarks}</p>
            </details>}
          </div>
        </div>
      </section>

      <section id="birthday" className="birthday spread" aria-labelledby="birthday-title" tabIndex={-1}>
        <div className="spread-inner wrap birthday-inner">
          <BirthdayPortrait photoSrc={photoSrc} nickname={settings.nickname} />
          <div>
            <p className="eyebrow"><span className="eyebrow-rule" /> The birthday star</p>
            <h2 id="birthday-title" tabIndex={-1}>{settings.nickname} is<br /> turning one!</h2>
            <p className="section-lead">You’re invited!</p>
            <div className="favorite">
              <button className="favorite-icon" type="button" aria-label="Play a chime" onClick={() => { audioController.playSparkle(); setChimed(true); }}>
                {chimed ? <Sparkles size={21} aria-hidden="true" /> : <Music2 size={21} aria-hidden="true" />}
              </button>
              <div><strong>Potty Tinay</strong><p>One of {settings.nickname}’s favorites from Songs for Littles.</p></div>
            </div>
            <dl className="milestones">
              {milestones.stats.slice(1, 3).map(({ label, value }) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="party" className="party spread" aria-labelledby="party-title" tabIndex={-1}>
        <div className="spread-inner wrap party-inner">
          <div className="cake-interaction">
            <div className="cake-window" data-scroll-art="cake">
              <div className="cake-art">
                <Image src="/images/birthday-cake.webp" alt="Painted birthday cake with a single pink candle" fill sizes="(max-width: 760px) 80vw, 460px" />
                {candleLit && <span className="candle-flame" aria-hidden="true" />}
              </div>
            </div>
            <button type="button" className="button button-outline cake-button" onClick={candleLit ? blowOutCandle : () => setCandleLit(true)}>
              {candleLit ? <Sparkles size={16} aria-hidden="true" /> : <RotateCcw size={16} aria-hidden="true" />}
              {candleLit ? "Blow out the candle" : "Relight the candle"}
            </button>
          </div>
          <div>
            <p className="eyebrow"><span className="eyebrow-rule" /> The party</p>
            <h2 id="party-title" tabIndex={-1}>Cake &amp; company.</h2>
            <div className="party-program">
              {settings.program.map((item, index) => item.description ? (
                <details key={index}>
                  <summary><span className="program-time">{item.time}</span><span>{item.title}</span><ChevronDown size={16} aria-hidden="true" /></summary>
                  <p>{item.description}</p>
                </details>
              ) : <div className="program-entry" key={index}>
                <span className="program-time">{item.time}</span><span>{item.title}</span>
              </div>)}
              {settings.program.length === 0 && <p className="section-lead">{dates.displayTime}</p>}
            </div>
          </div>
        </div>
      </section>

      <section id="rsvp" className="rsvp spread" aria-labelledby="rsvp-title" tabIndex={-1}>
        <div className="spread-inner wrap rsvp-inner">
          <div>
            <p className="eyebrow"><span className="eyebrow-rule" /> RSVP by {dates.displayDeadline}</p>
            <h2 id="rsvp-title" tabIndex={-1}>Save me<br /> a seat.</h2>
            <p className="section-lead">Let us know who’s coming so we can plan seats and party favors.</p>
            <Sun className="rsvp-sun" strokeWidth={1} aria-hidden="true" />
          </div>
          <div className="rsvp-paper"><RsvpForm nickname={settings.nickname} whatsapp={settings.whatsapp} /></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-header-inner wrap">
          <span><Sun size={19} aria-hidden="true" /> Made with love for {settings.nickname}.</span>
          <button type="button" className="text-link" onClick={onReplayEnvelope}><ArrowLeft size={16} aria-hidden="true" /> Back to the envelope</button>
        </div>
      </footer>
    </div>
  );
}
