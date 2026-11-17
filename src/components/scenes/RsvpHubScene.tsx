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
      origin: { y: 0.65 },
      colors: ["#D4AF37", "#F7B5CD", "#BAE0F6", "#FFFFFF"],
    });

    setSubmitted(true);
  };

  const handleDownloadCalendar = () => {
    audioController.playPop();

    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Linggit Birthday//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:${eventConfig.celebrant.nickname}'s 1st Birthday Celebration`,
      `DESCRIPTION:${eventConfig.celebrant.fullName} is turning ONE. Dress Code: ${eventConfig.dressCode.themeName}.`,
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

  const primaryContact = eventConfig.rsvp.contactPersons[0];
  const encodedText = encodeURIComponent(
    `Hi ${primaryContact.name}! RSVP for ${eventConfig.celebrant.nickname}'s 1st Birthday from ${guestName || "our family"}: ${
      status === "attending" ? "JOYFULLY ATTENDING" : "Regretfully declining"
    } (${adultsCount} adults, ${kidsCount} children). Message: ${message || "Happy 1st Birthday Linggit!"}`
  );

  const whatsappUrl = primaryContact.whatsappNumber
    ? `https://wa.me/${primaryContact.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodedText}`
    : null;

  return (
    <div className="flex flex-col items-center justify-between min-h-[76vh] w-full max-w-lg mx-auto px-4 py-2 select-none">
      {/* Category Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F5ECE0] border border-[#E5C98D] rounded-full text-stone-800 text-xs font-semibold tracking-wider uppercase mb-2 shadow-xs"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#996515]" />
        <span>RSVP &amp; Program</span>
      </motion.div>

      {/* Program Accordion */}
      <div className="w-full mb-3">
        <button
          onClick={() => {
            audioController.playPop();
            setShowProgram(!showProgram);
          }}
          className="w-full flex items-center justify-between p-3.5 bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-sm transition-all text-left"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#996515]" />
            <span className="font-serif-luxury text-xs sm:text-sm font-bold text-stone-800">
              {showProgram ? "Hide Event Schedule" : "View Event Schedule & Timeline"}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-stone-500 transition-transform ${showProgram ? "rotate-180" : ""}`}
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
                  className="p-3 bg-white rounded-xl border border-stone-100 shadow-xs flex items-start gap-3"
                >
                  <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md shrink-0">
                    {item.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-800">{item.title}</p>
                    {item.description && (
                      <p className="text-[11px] text-stone-500 mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Response Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-deckle p-5 w-full mb-3"
      >
        <div className="text-center mb-4">
          <h3 className="font-serif-luxury text-xl font-bold text-stone-900 tracking-tight">
            Reserve Your Attendance
          </h3>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Kindly respond by <strong className="text-stone-800 font-semibold">{eventConfig.rsvp.deadline}</strong>
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E5C98D]/60 text-center space-y-2.5"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-serif-luxury text-base font-bold text-stone-900">
              Thank You, {guestName}
            </h4>
            <p className="text-xs text-stone-600 font-medium leading-relaxed">
              Your response has been recorded. Linggit and family are thrilled to celebrate with you.
            </p>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioController.playPop()}
                className="inline-flex items-center justify-center gap-2 mt-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send WhatsApp Copy to Parents</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-[11px] text-stone-500 underline mt-2 block mx-auto hover:text-stone-700"
            >
              Edit Response
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name / Family Name
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Sarah & Mark Santos"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#996515] text-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Attendance Confirmation
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    audioController.playPop();
                    setStatus("attending");
                  }}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                    status === "attending"
                      ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                      : "bg-[#FAF8F5] text-stone-700 border-stone-200"
                  }`}
                >
                  Joyfully Attending
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioController.playPop();
                    setStatus("declined");
                  }}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                    status === "declined"
                      ? "bg-stone-700 text-white border-stone-700 shadow-xs"
                      : "bg-[#FAF8F5] text-stone-700 border-stone-200"
                  }`}
                >
                  Regretfully Declining
                </button>
              </div>
            </div>

            {status === "attending" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#996515]" /> Adults
                  </label>
                  <select
                    value={adultsCount}
                    onChange={(e) => setAdultsCount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none text-stone-800"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Adult" : "Adults"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Children / Toddlers
                  </label>
                  <select
                    value={kidsCount}
                    onChange={(e) => setKidsCount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none text-stone-800"
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

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                Personal Note for Linggit
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Can't wait to celebrate with you, baby Linggit!"
                className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#996515] text-stone-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mt-1"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" />
              <span>Confirm Attendance</span>
            </button>
          </form>
        )}
      </motion.div>

      {/* Utilities */}
      <div className="w-full flex items-center justify-center gap-2 text-xs">
        <button
          onClick={handleDownloadCalendar}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-stone-50 text-stone-700 font-medium rounded-xl border border-stone-200 shadow-2xs transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-[#996515]" />
          <span>Add to Calendar</span>
        </button>

        <button
          onClick={() => {
            audioController.playPop();
            onRestart();
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-stone-50 text-stone-700 font-medium rounded-xl border border-stone-200 shadow-2xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
          <span>Replay from Start</span>
        </button>
      </div>

      <p className="mt-4 text-[10px] text-stone-400 text-center">
        {eventConfig.celebrant.fullName} &bull; First Birthday Digital Invitation
      </p>
    </div>
  );
};
