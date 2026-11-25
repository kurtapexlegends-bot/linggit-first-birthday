# Linggit's 1st Birthday Interactive Invitation Website 🎈

A joyful, animated Ms. Rachel themed interactive digital invitation for **Linggit's 1st Birthday**, designed to run smoothly on desktop and mobile browsers, ready to deploy to **Vercel** with a free domain and SSL.

---

## Invitation features

- An illustrated sunshine cover with a tap-to-open envelope and optional music.
- A Ms. Rachel welcome, interactive neutral outfit swatches, and a venue spread with Google Maps, Waze, and a calendar download.
- A portrait frame for Linggit, a Potty Tinay chime, and a virtual birthday candle.
- An expandable party program and an RSVP form that saves directly to the private guest list, with an optional WhatsApp copy.

---

## 🛠️ Quick Start (Local Development)

```powershell
cd C:\Users\acost\.gemini\antigravity\scratch\linggit-first-birthday
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Customize the party

The private dashboard at `/kingkong` shows RSVP totals and recent replies. Open **Guest replies** to search responses, record a reply received elsewhere, update counts, or export the filtered list as CSV. Open **Invitation** or **Media** to change the guest site, then select **Publish changes**.

Set the event date, venue, directions links, dress code, milestones, program, and RSVP deadline in [event-config.ts](src/config/event-config.ts). The current directions links point to Pasig City. Replace them with the venue pin before sharing the invitation.

The RSVP form saves responses to the private dashboard when guests select **Send RSVP**. WhatsApp sharing is optional. Replies received through WhatsApp can be recorded in the dashboard.

## Photos and music

- Add Linggit’s photo to `public/images/linggit.png` and rebuild to show it for every guest. The portrait’s photo picker saves changes on the current device.
- Add a recording to `public/audio/you-are-my-sunshine.mp3` and rebuild to use it when the envelope opens. The built-in music box plays when the recording is absent.

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
