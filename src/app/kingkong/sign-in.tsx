"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, Sparkles, Sun } from "lucide-react";

async function signInRequest(key: FormDataEntryValue | null) {
  const response = await fetch("/api/kingkong/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || "The request failed. Try again.");
  }
  return result;
}

export function KingkongStatusScreen({ title, description }: { title: string; description: string }) {
  return (
    <main className="min-h-[100svh] bg-[#fffbf2] text-[#2e221d] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-[#e7dcc8] bg-[#fffdf8] p-8 shadow-sm text-center space-y-4">
        <span className="inline-flex w-12 h-12 rounded-2xl bg-[#fbe07b]/70 text-[#9e3359] items-center justify-center mx-auto">
          <Sun className="w-6 h-6" aria-hidden="true" />
        </span>
        <h1 className="font-storybook text-2xl font-bold text-[#2e221d]">{title}</h1>
        <p className="text-sm font-semibold text-[#645147] leading-relaxed">{description}</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#9e3359] hover:underline pt-2"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to the invitation
        </a>
      </div>
    </main>
  );
}

export function KingkongSignIn() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => setReady(true), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const key = new FormData(event.currentTarget).get("key");
    setBusy(true);
    setError("");
    try {
      await signInRequest(key);
      location.replace(location.pathname + location.search);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[100svh] bg-[#fffbf2] text-[#2e221d] grid lg:grid-cols-[minmax(360px,0.92fr)_minmax(0,1.08fr)]">
      {/* Left: Warm Cream Sign-In Form */}
      <main className="flex flex-col items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[400px] rounded-3xl border border-[#e7dcc8] bg-[#fffdf8] p-7 sm:p-9 shadow-[0_18px_40px_-18px_rgba(100,68,38,0.14)]">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-11 h-11 rounded-2xl bg-[#fbe07b]/75 border border-[#e3bf75]/60 text-[#9e3359] flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5 stroke-[2.3]" aria-hidden="true" />
            </span>
            <div>
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9e3359]">
                Host workspace
              </span>
              <h1 className="font-storybook text-2xl sm:text-3xl font-bold text-[#2e221d] leading-tight">
                Party dashboard
              </h1>
            </div>
          </div>

          <p className="text-sm font-semibold text-[#645147] leading-relaxed mb-6">
            Enter your host access key to update the storybook invitation, photos, music, and guest RSVPs.
          </p>

          <form method="post" onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-1.5 text-xs font-extrabold text-[#2e221d]">
              <span>Access key</span>
              <div className="relative">
                <Lock
                  className="w-4 h-4 text-[#645147] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  name="key"
                  type={showKey ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  maxLength={128}
                  placeholder="Enter dashboard key"
                  className="w-full min-h-[46px] rounded-xl border border-[#dfd2be] bg-white pl-10 pr-11 py-2.5 text-base font-semibold text-[#2e221d] placeholder:text-[#645147]/50 focus:border-[#c94b77] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((current) => !current)}
                  aria-label={showKey ? "Hide access key" : "Show access key"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-[#645147] hover:bg-[#f8eed9] hover:text-[#2e221d] transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-[#fadce6]/65 border border-[#c94b77]/35 px-3.5 py-2.5 text-xs font-bold text-[#9e3359]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!ready || busy}
              className="w-full min-h-[46px] rounded-full bg-[#c94b77] hover:bg-[#9e3359] text-[#fffbf2] font-extrabold text-sm shadow-sm transition-colors disabled:opacity-50"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#e7dcc8]/80 flex items-center justify-between">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#9e3359] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Back to the invitation
            </a>
          </div>
        </div>
      </main>

      {/* Right: Sunlit Sky & Storybook Cutout Showcase */}
      <aside
        aria-label="Storybook preview artwork"
        className="relative min-h-[260px] lg:min-h-[100svh] overflow-hidden bg-gradient-to-b from-[#cdeafa] via-[#e9f6fd] to-[#e4efdc] border-t lg:border-t-0 lg:border-l border-[#e7dcc8] flex flex-col items-center justify-end p-6 sm:p-10"
      >
        <img
          src="/images/sunshine-storybook.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(205,234,250,0.45) 0%, rgba(233,246,253,0.28) 52%, rgba(228,239,220,0.92) 100%)",
          }}
        />

        {/* Soft Rolling Meadow Hills SVG */}
        <svg
          viewBox="0 0 1200 220"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 w-full h-28 sm:h-40 pointer-events-none"
        >
          <path d="M0,115 C300,35 600,145 960,65 C1090,36 1160,65 1200,85 L1200,220 L0,220 Z" fill="#c7dfb6" />
          <path d="M0,150 C340,90 740,185 1200,112 L1200,220 L0,220 Z" fill="#a8cd92" />
        </svg>

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-[#e3bf75]/70 shadow-sm text-xs font-extrabold text-[#2e221d]">
            <Sparkles className="w-3.5 h-3.5 text-[#c94b77]" aria-hidden="true" />
            <span>Manage Linggit’s 1st birthday invitation & RSVPs</span>
          </div>

          <div className="flex items-end justify-center gap-2 sm:gap-5 w-full pt-2">
            <img
              src="/images/cutouts/ms-rachel-cutout.png"
              alt="Ms. Rachel smiling and waving"
              className="w-36 sm:w-52 h-auto object-contain drop-shadow-[0_14px_20px_rgba(46,34,29,0.2)]"
            />
            <img
              src="/images/cutouts/baby-linggit-cutout.png"
              alt="Baby Linggit smiling in a party outfit"
              className="w-28 sm:w-40 h-auto object-contain drop-shadow-[0_14px_20px_rgba(46,34,29,0.2)]"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
