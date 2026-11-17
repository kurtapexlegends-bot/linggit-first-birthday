# Linggit's 1st Birthday Interactive Invitation Website 🎈

A joyful, animated Ms. Rachel themed interactive digital invitation for **Linggit's 1st Birthday**, designed to run smoothly on desktop and mobile browsers, ready to deploy to **Vercel** with a free domain and SSL.

---

## 🌟 Key Features

1. **Interactive Envelope Hero:**
   - Tap-to-open 3D envelope with paper textures, golden wax seal, unfolding animation, and celebration confetti.
   - User gesture automatically unlocks browser audio playback.
2. **"You Are My Sunshine" Background Music:**
   - Built-in, zero-dependency Web Audio API music-box lullaby playing the real melody of *"You Are My Sunshine"*.
   - Drop-in MP3 support: placing `you-are-my-sunshine.mp3` inside `public/audio/` will automatically use your custom audio file.
   - Persistent top-right floating mute/unmute control.
3. **Ms. Rachel Welcome & Dress Code Guide:**
   - Ms. Rachel greets guests with comic speech bubbles and pop sound effects.
   - Interactive neutral dress code palette swatches (Cream, Warm Taupe, Light Khaki, Sage, Clean White) with one-click HEX copying and outfit tips.
4. **Venue Pin with Pointing Ms. Rachel:**
   - Stylized venue map featuring a bouncing radar location pin.
   - Ms. Rachel pointing directly to the pin.
   - One-click navigation buttons for **Google Maps** and **Waze**.
5. **Baby Linggit's Grand Reveal:**
   - Dramatic entrance animation: *"Linggit is turning 1! You are invited!"* with golden birthday crown and confetti.
6. **"Potty Tinay" & 1st Milestones Card:**
   - Dedicated spotlight on Linggit's favorite Ms. Rachel song: **Potty Tinay**.
   - Interactive Potty Tinay character with cute chime sound on tap.
   - First-year stats: 365 Days of Joy, 6 Pearly Teeth, Cruising & Walking.
7. **RSVP & Event Program Hub:**
   - Expandable timeline of events (Welcome, Grand Entrance, Themed Games, Cake Ceremony).
   - In-app RSVP form (Guest Name, Adult & Kid count, Birthday message).
   - Instant WhatsApp/Messenger backup confirmation link.
   - "Add to Calendar" (.ics export for Apple Calendar, Google Calendar, Outlook).
   - "Replay from Envelope" button.

---

## 🛠️ Quick Start (Local Development)

```powershell
cd C:\Users\acost\.gemini\antigravity\scratch\linggit-first-birthday
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ How to Customize Event Information

All text, dates, times, venue locations, and dress codes are centralized in one single file:
👉 [src/config/event-config.ts](file:///C:/Users/acost/.gemini/antigravity/scratch/linggit-first-birthday/src/config/event-config.ts)

You can customize:
- `celebrant.nickname` / `celebrant.fullName`
- `event.displayDate` / `event.displayTime`
- `venue.name`, `venue.address`, `venue.googleMapsUrl`, `venue.wazeUrl`
- `rsvp.deadline`, contact numbers, WhatsApp numbers, Messenger links
- Milestones and favorite things

---

## 📸 Adding Real Photos & Audio

- **Baby's Photo Cutout:** Drop a transparent PNG of baby Linggit into `public/images/linggit.png`.
- **Ms. Rachel Cutout:** Drop a cutout photo into `public/images/ms-rachel.png`.
- **Custom MP3 Audio:** Drop your audio file into `public/audio/you-are-my-sunshine.mp3`.

*(Note: High-fidelity vector illustrations and synthesized audio fallbacks are already included out of the box if no files are added!)*

---

## 🚀 How to Deploy to Vercel (Free Domain & SSL)

### Option 1: Via Vercel CLI (Fastest)
1. In your terminal, run:
   ```powershell
   npx vercel
   ```
2. Follow the 3 prompts:
   - *Set up and deploy?* -> `Y`
   - *Which scope?* -> Select your account
   - *Link to existing project?* -> `N`
   - *What's your project name?* -> `linggit-first-birthday`
   - *In which directory?* -> `./`
3. Vercel will deploy in 30 seconds and give you a free URL:
   `https://linggit-first-birthday.vercel.app`

### Option 2: Via GitHub + Vercel Dashboard
1. Push this folder to a GitHub repository:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit of Linggit 1st Birthday invitation"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/linggit-first-birthday.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. Click **Deploy**.
5. Your invitation will be live on `https://your-repo-name.vercel.app`!
