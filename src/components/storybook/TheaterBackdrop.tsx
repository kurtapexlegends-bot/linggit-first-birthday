"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { audioController } from "@/lib/audio";

interface TheaterBackdropProps {
  scene: number;
}

const skyThemes: Record<number, string> = {
  0: "linear-gradient(180deg, #BEE6FA 0%, #E7F6FE 54%, #FFF7DC 100%)",
  1: "linear-gradient(180deg, #B9E4FA 0%, #E4F5FD 55%, #FFF9E6 100%)",
  2: "linear-gradient(180deg, #FCE0EB 0%, #FFF3F7 52%, #FFF9EA 100%)",
  3: "linear-gradient(180deg, #C7E9FA 0%, #E6F6EC 58%, #F4F8E6 100%)",
  4: "linear-gradient(180deg, #FDE89B 0%, #FFF4CC 52%, #FFFBF0 100%)",
  5: "linear-gradient(180deg, #F9D9E8 0%, #E4F3FC 55%, #FFF8EC 100%)",
  6: "linear-gradient(180deg, #C6E8FA 0%, #FBE7EE 58%, #FFF7E4 100%)",
};

const buntingColors = ["#F48FB1", "#7BC4EB", "#FBD865", "#9AD3A5", "#F48FB1", "#7BC4EB", "#FBD865", "#9AD3A5", "#F48FB1", "#7BC4EB", "#FBD865", "#9AD3A5"];

export function TheaterBackdrop({ scene }: TheaterBackdropProps) {
  const prefersReducedMotion = useReducedMotion();
  const [sunSpins, setSunSpins] = useState(0);

  function tickleSun() {
    audioController.playSparkle();
    setSunSpins((s) => s + 1);
  }

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden transition-all duration-700 pointer-events-none"
      style={{ background: skyThemes[scene] ?? skyThemes[0] }}
      aria-hidden="true"
    >
      {/* Interactive Smiling Cartoon Sun in upper-left/right sky */}
      <motion.button
        type="button"
        tabIndex={-1}
        onClick={tickleSun}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                rotate: sunSpins * 360,
                scale: [1, 1.04, 1],
              }
        }
        transition={{
          rotate: { type: "spring", stiffness: 120, damping: 14 },
          scale: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="pointer-events-auto absolute top-14 right-4 sm:top-16 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 cursor-pointer opacity-90 hover:opacity-100"
      >
        <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-md">
          {/* Spinning Sun Rays */}
          <g stroke="#F6C344" strokeWidth="7" strokeLinecap="round">
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 70 + Math.cos(angle) * 44;
              const y1 = 70 + Math.sin(angle) * 44;
              const x2 = 70 + Math.cos(angle) * 60;
              const y2 = 70 + Math.sin(angle) * 60;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
          {/* Warm Sun Disc */}
          <circle cx="70" cy="70" r="36" fill="#FDE068" stroke="#FFFFFF" strokeWidth="4" />
          {/* Cute Smiling Sun Face */}
          <path d="M55 67 Q59 61 63 67" fill="none" stroke="#6B4423" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M77 67 Q81 61 85 67" fill="none" stroke="#6B4423" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="51" cy="74" r="5" fill="#F494A6" opacity="0.65" />
          <circle cx="89" cy="74" r="5" fill="#F494A6" opacity="0.65" />
          <path d="M62 76 Q70 84 78 76" fill="none" stroke="#6B4423" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      </motion.button>

      {/* Swaying Pastel Bunting Pennants across top */}
      {scene > 0 && (
        <motion.div
          initial={prefersReducedMotion ? false : { y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 0.92 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="absolute top-[58px] sm:top-[64px] inset-x-0 flex justify-center pointer-events-none"
        >
          <svg
            viewBox="0 0 1200 74"
            preserveAspectRatio="none"
            className="w-full max-w-[1440px] h-11 sm:h-14"
          >
            <path
              d="M0 8 Q300 44 600 18 Q900 44 1200 8"
              fill="none"
              stroke="#C9841A"
              strokeOpacity="0.4"
              strokeWidth="2.5"
            />
            {buntingColors.map((color, idx) => {
              const x = idx * 100 + 18;
              const yOffset = Math.sin((idx / buntingColors.length) * Math.PI * 2) * 10 + 18;
              return (
                <polygon
                  key={idx}
                  points={`${x},${yOffset} ${x + 64},${yOffset + 2} ${x + 32},${yOffset + 42}`}
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              );
            })}
          </svg>
        </motion.div>
      )}

      {/* Continuously Drifting Fluffy Clouds */}
      {!prefersReducedMotion && (
        <>
          <motion.svg
            viewBox="0 0 200 90"
            animate={{ x: ["-15vw", "110vw"] }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
            className="absolute top-[16%] left-0 w-36 sm:w-52 opacity-80"
          >
            <path
              d="M35 72 H165 C180 72 190 61 190 48 C190 36 180 26 167 26 C163 12 148 4 132 8 C122 -2 100 -2 88 10 C75 4 56 12 52 28 C36 28 24 40 24 54 C24 64 29 72 35 72 Z"
              fill="#FFFFFF"
            />
          </motion.svg>

          <motion.svg
            viewBox="0 0 200 90"
            animate={{ x: ["108vw", "-20vw"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute top-[28%] left-0 w-28 sm:w-44 opacity-65"
          >
            <path
              d="M35 72 H165 C180 72 190 61 190 48 C190 36 180 26 167 26 C163 12 148 4 132 8 C122 -2 100 -2 88 10 C75 4 56 12 52 28 C36 28 24 40 24 54 C24 64 29 72 35 72 Z"
              fill="#FFFFFF"
            />
          </motion.svg>
        </>
      )}

      {/* Layered Rolling Pop-Up Theater Hills at Bottom */}
      <div className="absolute inset-x-0 bottom-0 h-[34vh] min-h-[210px] pointer-events-none">
        {/* Back pastel hill */}
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute bottom-0 inset-x-0 w-full h-full"
        >
          <path
            d="M0,180 C280,60 560,240 880,130 C1140,45 1320,140 1440,100 L1440,320 L0,320 Z"
            fill="#C7E4B6"
          />
        </svg>

        {/* Mid meadow hill */}
        <motion.svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          animate={prefersReducedMotion ? undefined : { y: [0, 4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 inset-x-0 w-full h-[84%]"
        >
          <path
            d="M0,140 C340,250 680,50 1080,170 C1260,220 1380,170 1440,145 L1440,320 L0,320 Z"
            fill="#A9D896"
          />
        </motion.svg>

        {/* Front lush storybook hill */}
        <svg
          viewBox="0 0 1440 240"
          preserveAspectRatio="none"
          className="absolute bottom-0 inset-x-0 w-full h-[58%]"
        >
          <path
            d="M0,110 C320,30 620,170 980,95 C1200,50 1350,90 1440,120 L1440,240 L0,240 Z"
            fill="#90C97B"
          />
          {/* Tiny painted meadow daisies */}
          <circle cx="190" cy="145" r="5" fill="#FFFBF2" />
          <circle cx="190" cy="145" r="2.2" fill="#FBD865" />
          <circle cx="430" cy="165" r="5" fill="#FADCE6" />
          <circle cx="430" cy="165" r="2.2" fill="#FBD865" />
          <circle cx="1050" cy="140" r="5.5" fill="#FFFBF2" />
          <circle cx="1050" cy="140" r="2.5" fill="#F48FB1" />
          <circle cx="1270" cy="162" r="5" fill="#FFFBF2" />
          <circle cx="1270" cy="162" r="2.2" fill="#FBD865" />
        </svg>
      </div>
    </div>
  );
}
