"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Copy,
  MessageCircle,
  Minus,
  Plus,
  Sun,
} from "lucide-react";
import type { formatInvitation, InvitationSettings } from "@/lib/invitation-settings";
import { audioController } from "@/lib/audio";
import { downloadBirthdayCalendar } from "@/lib/calendar";

interface RsvpSceneProps {
  settings: InvitationSettings;
  dates: ReturnType<typeof formatInvitation>;
  onReplayEnvelope: () => void;
}

type RsvpReceipt = { id: string; editKey: string };
const receiptUuid = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

async function rsvpStorageKey(name: string) {
  const normalized = name.toLowerCase().replace(/\s+/g, " ");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
  const nameKey = Array.from(new Uint8Array(digest).slice(0, 12), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  return `linggit-rsvp-receipt:${nameKey}`;
}

function readReceipt(key: string): RsvpReceipt | undefined {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "null");
    if (
      typeof value?.id === "string" &&
      typeof value?.editKey === "string" &&
      receiptUuid.test(value.id) &&
      receiptUuid.test(value.editKey)
    ) {
      return { id: value.id, editKey: value.editKey };
    }
  } catch {
    return undefined;
  }
}

function GuestStepper({
  label,
  name,
  initial,
  disabled,
  invalid,
  onAdjust,
}: {
  label: "Adults" | "Children";
  name: "adults" | "kids";
  initial: number;
  disabled: boolean;
  invalid: boolean;
  onAdjust: () => void;
}) {
  const [value, setValue] = useState(String(initial));
  const count = Number(value) || 0;

  function step(delta: number) {
    audioController.playPop();
    setValue(String(Math.max(0, Math.min(100, Math.trunc(count) + delta))));
    onAdjust();
  }

  return (
    <div>
      <label htmlFor={`guest-${name}`} className="block text-xs font-extrabold text-[#2e221d] mb-1.5">
        {label}
      </label>
      <div
        className={`grid grid-cols-[44px_1fr_44px] items-center rounded-xl border bg-[#fffbf2] overflow-hidden ${
          invalid ? "border-[#c94b77]" : "border-[#2e221d]/20 focus-within:border-[#c94b77]"
        }`}
      >
        <button
          type="button"
          aria-label={`Remove one ${name === "adults" ? "adult" : "child"}`}
          disabled={disabled || count <= 0}
          onClick={() => step(-1)}
          className="h-11 flex items-center justify-center bg-[#f8eed9] hover:bg-[#f1e1c0] text-[#9e3359] disabled:opacity-40 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          id={`guest-${name}`}
          name={name}
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={value}
          disabled={disabled}
          required
          onChange={(e) => {
            setValue(e.target.value);
            onAdjust();
          }}
          className="w-full h-11 text-center text-base font-extrabold text-[#2e221d] bg-transparent focus:outline-none tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label={`Add one ${name === "adults" ? "adult" : "child"}`}
          disabled={disabled || count >= 100}
          onClick={() => step(1)}
          className="h-11 flex items-center justify-center bg-[#f8eed9] hover:bg-[#f1e1c0] text-[#9e3359] disabled:opacity-40 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function RsvpScene({ settings, dates, onReplayEnvelope }: RsvpSceneProps) {
  const prefersReducedMotion = useReducedMotion();
  const [attending, setAttending] = useState(true);
  const [reply, setReply] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [guestCountError, setGuestCountError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const guestNameRef = useRef<HTMLInputElement>(null);
  const replyHeadingRef = useRef<HTMLHeadingElement>(null);
  const receipt = useRef<RsvpReceipt>();
  const receiptSlot = useRef<string>();
  const sending = useRef(false);

  useEffect(() => {
    if (reply) replyHeadingRef.current?.focus();
  }, [reply]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending.current) return;

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (!name) return;

    const message = String(form.get("message") ?? "").trim();
    const adults = attending ? Number(form.get("adults")) : 0;
    const children = attending ? Number(form.get("kids")) : 0;

    if (attending && adults + children < 1) {
      setGuestCountError(true);
      e.currentTarget.querySelector<HTMLInputElement>('[name="adults"]')?.focus();
      return;
    }

    const lines = [
      `Hi! Here’s my RSVP for ${settings.nickname}’s first birthday.`,
      `Name: ${name}`,
      `Attending: ${attending ? "Yes" : "No"}`,
    ];
    if (attending) {
      lines.push(
        `Guests: ${adults} ${adults === 1 ? "adult" : "adults"}, ${children} ${children === 1 ? "child" : "children"}`
      );
    }
    if (message) lines.push(`Note: ${message}`);

    sending.current = true;
    setSaving(true);
    setSubmitError("");

    try {
      const storageKey = await rsvpStorageKey(name).catch(() => undefined);
      if (!receipt.current) {
        receipt.current =
          (storageKey ? readReceipt(storageKey) : undefined) ?? {
            id: crypto.randomUUID(),
            editKey: crypto.randomUUID(),
          };
        receiptSlot.current = storageKey;
        if (storageKey) {
          try {
            localStorage.setItem(storageKey, JSON.stringify(receipt.current));
          } catch {
            // Keep in memory
          }
        }
      }

      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...receipt.current,
          fields: { name, attending, adults, children, message },
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Your RSVP could not be saved. Try again.");
      }

      if (storageKey && storageKey !== receiptSlot.current) {
        try {
          const existing = readReceipt(storageKey);
          if (!existing || existing.id === receipt.current.id) {
            localStorage.setItem(storageKey, JSON.stringify(receipt.current));
            const previous = receiptSlot.current;
            if (previous && readReceipt(previous)?.id === receipt.current.id) {
              localStorage.removeItem(previous);
            }
            receiptSlot.current = storageKey;
          }
        } catch {
          // Server already saved
        }
      }

      audioController.playSparkle();
      if (!prefersReducedMotion) {
        void import("canvas-confetti")
          .then(({ default: confetti }) => {
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.65 },
              colors: ["#c94b77", "#fbe07b", "#7bc0e3", "#fffbf2"],
              disableForReducedMotion: true,
            });
          })
          .catch(() => {});
      }

      setReply(lines.join("\n"));
      setCopyStatus("");
    } catch (cause) {
      setSubmitError(
        cause instanceof TypeError
          ? "Check your connection, then try sending your RSVP again."
          : cause instanceof Error
            ? cause.message
            : "Your RSVP could not be saved. Try again."
      );
    } finally {
      sending.current = false;
      setSaving(false);
    }
  }

  async function copyReply() {
    audioController.playPop();
    try {
      await navigator.clipboard.writeText(reply);
      setCopyStatus("Reply copied.");
    } catch {
      setCopyStatus("Select and copy the reply above.");
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
      {/* Left: Warm Invitation Postcard Intro */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
        className="lg:col-span-5 flex flex-col gap-4 text-center lg:text-left items-center lg:items-start"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#fbe07b]/70 text-[#9e3359] flex items-center justify-center shadow-sm">
          <Sun className="w-8 h-8" aria-hidden="true" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#d6eefa] text-[#256f9e] text-xs font-extrabold">
            RSVP by {dates.displayDeadline}
          </span>
          <h2 className="font-storybook text-4xl sm:text-5xl font-bold text-[#2e221d] mt-3 leading-[1.02]">
            Save me a seat!
          </h2>
          <p className="mt-3 text-sm sm:text-base font-semibold text-[#645147] max-w-sm leading-relaxed">
            Let Mommy &amp; Daddy know who’s coming so we can reserve your seats and prepare toddler loot bags.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              audioController.playPop();
              downloadBirthdayCalendar(settings, dates);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#fff8ea] border border-[#e3bf75]/70 text-xs font-extrabold text-[#2e221d] shadow-sm active:scale-95 transition-transform"
          >
            <CalendarDays className="w-4 h-4 text-[#c94b77]" aria-hidden="true" />
            <span>Add to calendar</span>
          </button>

          <button
            type="button"
            onClick={onReplayEnvelope}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#fff8ea] border border-[#2e221d]/15 text-xs font-extrabold text-[#645147] shadow-sm active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Replay envelope</span>
          </button>
        </div>
      </motion.div>

      {/* Right: Tactile RSVP Form Card */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
        className="lg:col-span-7 spread-card rounded-[2rem] p-6 sm:p-8"
      >
        <form
          method="post"
          onSubmit={handleSubmit}
          onChange={() => setGuestCountError(false)}
          hidden={Boolean(reply)}
          aria-busy={saving}
        >
          <fieldset disabled={saving} className="space-y-4 border-0 p-0 m-0">
            <div>
              <label htmlFor="guest-name" className="block text-xs font-extrabold text-[#2e221d] mb-1.5">
                Your name or family name
              </label>
              <input
                ref={guestNameRef}
                id="guest-name"
                name="name"
                autoComplete="name"
                required
                pattern=".*\S.*"
                maxLength={100}
                placeholder="e.g. Tita Sarah & Tito Mark"
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#fffbf2] border border-[#2e221d]/20 text-base font-semibold text-[#2e221d] placeholder:text-[#645147]/55 focus:outline-none focus:border-[#c94b77]"
              />
            </div>

            <fieldset className="border-0 p-0 m-0">
              <legend className="text-xs font-extrabold text-[#2e221d] mb-1.5">
                Will you be joining us?
              </legend>
              <div className="grid grid-cols-2 gap-2.5">
                <label
                  className={`flex items-center justify-center gap-2 min-h-[48px] px-3 rounded-xl border-2 text-sm font-extrabold cursor-pointer transition-colors ${
                    attending
                      ? "border-[#c94b77] bg-[#fadce6]/60 text-[#9e3359]"
                      : "border-[#2e221d]/15 bg-[#fffbf2] text-[#645147]"
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    checked={attending}
                    onChange={() => {
                      audioController.playPop();
                      setAttending(true);
                    }}
                    className="accent-[#c94b77]"
                  />
                  <span>Yes, we’re coming!</span>
                </label>
                <label
                  className={`flex items-center justify-center gap-2 min-h-[48px] px-3 rounded-xl border-2 text-sm font-extrabold cursor-pointer transition-colors ${
                    !attending
                      ? "border-[#256f9e] bg-[#d6eefa]/70 text-[#1e5a82]"
                      : "border-[#2e221d]/15 bg-[#fffbf2] text-[#645147]"
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    checked={!attending}
                    onChange={() => {
                      audioController.playPop();
                      setAttending(false);
                    }}
                    className="accent-[#256f9e]"
                  />
                  <span>Can’t make it</span>
                </label>
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-3" hidden={!attending}>
              <GuestStepper
                label="Adults"
                name="adults"
                initial={2}
                disabled={!attending}
                invalid={guestCountError}
                onAdjust={() => setGuestCountError(false)}
              />
              <GuestStepper
                label="Children"
                name="kids"
                initial={0}
                disabled={!attending}
                invalid={guestCountError}
                onAdjust={() => setGuestCountError(false)}
              />
            </div>

            {guestCountError && (
              <p className="text-xs font-extrabold text-[#9e3359]" role="alert">
                Please include at least one adult or child who will attend.
              </p>
            )}

            <div>
              <label htmlFor="guest-message" className="block text-xs font-extrabold text-[#2e221d] mb-1.5">
                A birthday wish for {settings.nickname} <span className="font-semibold text-[#645147]">(optional)</span>
              </label>
              <textarea
                id="guest-message"
                name="message"
                rows={3}
                maxLength={500}
                placeholder={`Happy 1st birthday, ${settings.nickname}!`}
                className="w-full px-4 py-2.5 rounded-xl bg-[#fffbf2] border border-[#2e221d]/20 text-base font-semibold text-[#2e221d] placeholder:text-[#645147]/55 focus:outline-none focus:border-[#c94b77] resize-y"
              />
            </div>

            {submitError && (
              <p className="text-xs font-extrabold text-[#9e3359]" role="alert">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 rounded-full bg-[#c94b77] hover:bg-[#9e3359] text-[#fffbf2] font-extrabold text-base shadow-md active:scale-[0.98] disabled:opacity-65 transition-[background-color,transform]"
            >
              <span>{saving ? "Saving your RSVP..." : "Send RSVP"}</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </fieldset>
        </form>

        {reply && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#e4efdc] text-[#2f5a35] flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 ref={replyHeadingRef} tabIndex={-1} className="font-storybook text-2xl sm:text-3xl font-bold text-[#2e221d]">
                Your RSVP is saved!
              </h3>
              <p className="text-sm font-semibold text-[#645147] mt-1">
                We’ve recorded your reply. You can also send a quick copy on WhatsApp.
              </p>
            </div>

            <pre className="p-4 rounded-2xl bg-[#fff8ea] border border-[#e3bf75]/50 text-xs sm:text-sm font-semibold text-[#2e221d] whitespace-pre-wrap break-words font-sans">
              {reply}
            </pre>

            <a
              href={`https://wa.me/${settings.whatsapp.replace(/^\+/, "")}?text=${encodeURIComponent(reply)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-[#2f7d4c] hover:bg-[#25653d] text-white font-extrabold text-sm shadow-sm active:scale-[0.98] transition-[background-color,transform]"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Share copy on WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>

            <div className="flex items-center gap-5 pt-1 text-xs font-extrabold text-[#9e3359]">
              <button type="button" onClick={copyReply} className="inline-flex items-center gap-1.5 hover:underline">
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy reply</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setReply("");
                  window.requestAnimationFrame(() => guestNameRef.current?.focus());
                }}
                className="hover:underline"
              >
                Edit reply
              </button>
              {copyStatus && (
                <span className="text-[#645147] font-semibold" role="status">
                  {copyStatus}
                </span>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
