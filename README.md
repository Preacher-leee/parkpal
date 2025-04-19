 🅿️ ParkPal – Smart Parking Companion

ParkPal is a React-based application that helps users find and mark their parking spots using **Amazon Location Service**. It displays a real-time map, tracks current location, and manages parking durations with contextual alerts.

---

## 🚀 Features

- 🌍 **Interactive Map** powered by **Amazon Location Service**
- 📍 Real-time location tracking
- 🅿️ Set and view parking spot markers
- ⏱️ Intelligent parking timers with visual warnings
- 📦 Clean, component-based architecture using React and Tailwind CSS

---

## 🧰 Tech Stack

- **React + TypeScript**
- **Tailwind CSS**
- **Amazon Location Service (Map + Places)**
- **MapLibre GL** (for rendering AWS maps)
- Context API for state management

---

## 🔧 Setup Instructions

### 1. **Clone the Repository**

```bash
git clone https://github.com/Preacher-leee/parkpal.git
cd parkpal
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure Amazon Location Service
Make sure you have an Amazon Location Service map created.

✅ Replace this placeholder in MapComponent.tsx:
ts
Copy
Edit
const mapName = "YourAmazonMapName"; // <-- Replace with your actual map name
✅ Set your public API key (from AWS Console):
ts
Copy
Edit
const apiKey = "v1.public.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
4. Run the App
bash
Copy
Edit
npm run dev
The app should launch at http://localhost:3000

🗺 Amazon Location Integration
This project uses:

🗺️ Maps – For rendering and tracking

🔍 (Optional) Place Index – If implementing search or autocomplete

🚘 (Optional) Routing – For directions to/from parking

👉 You can manage these from the Amazon Location Service Console

📁 File Structure Highlights

File	Purpose
MapComponent.tsx	Core map UI logic with AWS integration
context/ParkingContext.tsx	Manages user/parking location + timer
components/	Reusable UI elements
pages/	Main route for the app (index.tsx)
🔐 Security Note
This project uses a public API key for Amazon Location Service, which is safe for map-only operations. For secure data operations (like geofencing or routing), you should consider server-side authorization or Cognito Identity Pools.

📦 Future Improvements
Place search and autocomplete using Amazon's Place Index

Routing and turn-by-turn navigation

User account and parking history

Dark mode toggle

👨‍💻 Maintainer
@Preacher-leee – feel free to submit issues or improvements via PR.

