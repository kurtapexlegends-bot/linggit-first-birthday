"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioController } from "@/lib/audio";
import confetti from "canvas-confetti";
import { eventConfig } from "@/config/event-config";
import {
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Users,
  Heart,
  ChevronDown,
} from "lucide-react";

interface RsvpHubSceneProps {
  onRestart: () => void;
}

export const RsvpHubScene: React.FC<RsvpHubSceneProps> = ({ onRestart }) => {
  const [guestName, setGuestName] = useState("");
  const [adultsCount, setAdultsCount] = useState("2");
  const [kidsCount, setKidsCount] = useState("0");
  const [status, setStatus] = useState<"attending" | "declined">("attending");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showProgram, setShowProgram] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    audioController.playSparkle();

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#F472B6", "#38BDF8", "#FBBF24", "#4ADE80"],
    });

    setSubmitted(true);
  };

  const handleDownloadCalendar = () => {
    audioController.playPop();

    // Generate ICS calendar format for Apple, Google, Outlook
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Linggit Birthday//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:${eventConfig.celebrant.nickname}'s 1st Birthday Celebration!`,
      `DESCRIPTION:${eventConfig.celebrant.fullName} is turning ONE! Dress Code: ${eventConfig.dressCode.themeName}.`,
      `LOCATION:${eventConfig.venue.name}, ${eventConfig.venue.address}`,
      `DTSTART:${eventConfig.event.calendarStartDate}`,
      `DTEND:${eventConfig.event.calendarEndDate}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${eventConfig.celebrant.nickname}-1st-birthday.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pre-filled WhatsApp / Messenger message text
  const primaryContact = eventConfig.rsvp.contactPersons[0];
  const encodedText = encodeURIComponent(
    `Hi ${primaryContact.name}! We received the invitation for ${eventConfig.celebrant.nickname}'s 1st Birthday! RSVP for ${guestName || "our family"}: ${
      status === "attending" ? "JOYFULLY ATTENDING 🎉" : "Regretfully declining 💖"
    } (${adultsCount} adults, ${kidsCount} kids). Message: ${message || "Happy 1st Birthday Linggit!"}`
  );

  const whatsappUrl = primaryContact.whatsappNumber
    ? `https://wa.me/${primaryContact.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodedText}`
    : null;

  return (
    <div className="flex flex-col items-center justify-between min-h-[75vh] w-full max-w-lg mx-auto px-4 py-2 select-none">
      {/* Top Friendly Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 border border-emerald-300 rounded-full text-emerald-900 font-extrabold text-xs shadow-sm mb-2"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>RSVP &amp; Program Hub</span>
      </motion.div>

      {/* Program Accordion Toggle */}
      <div className="w-full mb-3">
        <button
          onClick={() => {
            audioController.playPop();
            setShowProgram(!showProgram);
          }}
          className="w-full flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rachel-pink-dark" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {showProgram ? "Hide Event Program & Schedule" : "View Event Program & Timeline 🎈"}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform ${showProgram ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {showProgram && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-2 space-y-1.5"
            >
              {eventConfig.program.map((item) => (
                <div
                  key={item.time}
                  className="p-3 bg-white/95 rounded-xl border border-slate-100 shadow-sm flex items-start gap-3"
                >
                  <span className="text-[11px] font-black text-rachel-blue-dark bg-sky-50 px-2 py-0.5 rounded-md shrink-0">
                    {item.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800">{item.title}</p>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                    )}
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Interactive RSVP Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-3xl p-5 shadow-xl border-2 border-rachel-pink/30 mb-3"
      >
        <div className="text-center mb-4">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Reserve Your Seats
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Please RSVP by <strong className="text-rose-600 font-bold">{eventConfig.rsvp.deadline}</strong>
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2.5"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-extrabold text-emerald-900">
              Thank You, {guestName}!
            </h4>
            <p className="text-xs text-emerald-700 font-medium leading-relaxed">
              Your RSVP has been recorded! {eventConfig.celebrant.nickname} and the whole family can&apos;t wait to celebrate with you.
            </p>

            {/* Instant Messenger / WhatsApp button */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioController.playPop()}
                className="inline-flex items-center justify-center gap-2 mt-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send WhatsApp Copy to Mommy &amp; Daddy</span>
              </a>
            )}

            <div>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-[11px] text-slate-500 underline mt-2 block mx-auto"
              >
                Need to edit your RSVP?
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            {/* Guest Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Full Name / Family Name *
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Tita Sarah & Tito Mark"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rachel-pink/50 text-slate-800"
              />
            </div>

            {/* Attendance Choice */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Will you be attending?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    audioController.playPop();
                    setStatus("attending");
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                    status === "attending"
                      ? "bg-rachel-pink text-white border-rachel-pink shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  🎉 Joyfully Attending
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioController.playPop();
                    setStatus("declined");
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                    status === "declined"
                      ? "bg-slate-700 text-white border-slate-700 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  💌 Regretfully Declining
                </button>
              </div>
            </div>

            {/* Pax Counts */}
            {status === "attending" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Adults
                  </label>
                  <select
                    value={adultsCount}
                    onChange={(e) => setAdultsCount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none text-slate-800"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Adult" : "Adults"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                    <span>👶</span> Kids / Toddlers
                  </label>
                  <select
                    value={kidsCount}
                    onChange={(e) => setKidsCount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none text-slate-800"
                  >
                    {[0, 1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Child" : "Children"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Heartfelt Birthday Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rachel-pink fill-rachel-pink" />
                Wish or Message for Linggit
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Can't wait to sing with you, baby Linggit!"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rachel-pink/50 text-slate-800"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-teal-600 hover:to-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Confirmation</span>
            </button>
          </form>
        )}
      </motion.div>

      {/* Quick Action Utilities: Add to Calendar & Replay */}
      <div className="w-full flex items-center justify-center gap-2 text-xs">
        <button
          onClick={handleDownloadCalendar}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 shadow-sm transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-rachel-pink-dark" />
          <span>Add to Calendar</span>
        </button>

        <button
          onClick={() => {
            audioController.playPop();
            onRestart();
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 shadow-sm transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rachel-blue-dark" />
          <span>Replay from Envelope</span>
        </button>
      </div>

      <p className="mt-4 text-[10px] text-slate-400 text-center">
        Made with love for {eventConfig.celebrant.fullName} &bull; Ms. Rachel Songs for Littles Theme
      </p>
    </div>
  );
};
