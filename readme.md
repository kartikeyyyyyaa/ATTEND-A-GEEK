# ATTEND A GEEK  - Event Access Control System


> A comprehensive, web-based attendance management system designed for GFG Student Chapter events. It features real-time QR scanning, role-based access control, data visualization, and automated ticket generation.

---

## Key Features

### 1. Smart QR Scanning
- **Real-time Camera Feed:** Built using `html5-qrcode` library.
- **Security Validation:** The scanner validates the JSON structure of the QR code. It cross-references the scanned ID against a "Master Database" to prevent unauthorized entry.
- **Duplicate Prevention:** Prevents the same ticket from being scanned twice.

### 2. Live Dashboard & Analytics
- **Dynamic Counters:** Tracks "Participants" (Coders) and "Audience" separately.
- **Visual Analytics:** Integrated **Chart.js** to show a live doughnut chart of the attendee ratio.
- **Real-time Logs:** Displays a scrolling feed of entries with timestamps.

### 3. Registration & Ticket Generation
- **Walk-in Registration:** A dedicated interface (`register.html`) for manual student entry.
- **Instant Digital Pass:** Automatically generates a downloadable QR Ticket using `qrcode.js` immediately after registration.

### 4. Admin Tools (UX/UI)
- **Manual Backup Roster:** A searchable table to check in students manually if the camera fails or lighting is poor.
- **Audio Feedback:** Distinct sound effects for "Success" (Beep) and "Access Denied" (Error Buzzer).
- **Data Export:** One-click button to download the entire attendance log as a **.CSV (Excel)** file.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Modern Glassmorphism & Neon UI).
* **Logic:** Vanilla JavaScript (ES6+).
* **Data Persistence:** Browser `LocalStorage` (Simulates a database and prevents data loss on refresh).
* **Libraries:**
    * `html5-qrcode` (Scanner)
    * `qrcode.js` (Generator)
    * `Chart.js` (Analytics)

## How to Run Locally

** Important: ** Browsers restrict camera access on `file://` protocols. You must use a local server.

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/gfg-event-scanner.git](https://github.com/your-username/gfg-event-scanner.git)
    ```
2.  **Open in VS Code**
3.  **Install "Live Server" Extension** (if not installed).
4.  Right-click `index.html` and select **"Open with Live Server"**.
5.  Allow Camera Permissions when prompted.

---

## Logic & Data Structure

The system relies on a specific JSON format for QR codes to ensure security.

**Valid QR Format:**
```json
{
  "id": "STU001"
}