# 🎫 Helpdesk Management System

A comprehensive Helpdesk Ticket Management System built with **React** and **TypeScript**. This application allows users to submit support tickets, while providing Agents and Administrators with specialized tools to manage, assign, and resolve issues efficiently.

---

## 🚀 Key Features

### 📋 Ticket Dashboard (`TicketsList`)
* **Live Search:** Real-time search functionality to filter tickets by subject.
* **Status Filtering:** Easily toggle between "All", "Open", and "Closed" tickets.
* **Auto-Sorting:** Tickets are automatically sorted in descending order (newest first) based on their ID.
* **Dynamic UI:** Ticket cards change colors and badges dynamically based on status and priority levels.
* **Automatic Refresh:** The dashboard detects when a user returns from a detail page and refreshes the data to reflect recent changes.

### ⚙️ Ticket Management (`TicketDetails`)
* **Role-Based Access Control (RBAC):**
    * **Admin:** Full control over the system, including status updates, agent assignment, priority adjustments, and permanent ticket deletion.
    * **Agent:** Permission to view all tickets and update statuses (e.g., closing a ticket after resolution).
    * **User:** Can view their own tickets and add comments/updates.
* **Comment System:** Integrated communication thread for every ticket to track progress and updates.

### 🎨 UI/UX Design
* **Dynamic Badges:** Color-coded priority (Urgent/Normal) and status indicators.
* **Responsive Grid:** A clean, grid-based layout that adapts to different screen sizes.

---

## 🛠 Tech Stack
* **Frontend:** React 18, TypeScript.
* **Routing:** React Router Dom v6.
* **State Management:** React Context API (AuthContext).
* **Styling:** CSS3 (Custom Modules, Flexbox, and Grid).
* **API Communication:** Axios for interfacing with the Node.js/Express backend.
* **Database:** MySQL.

---

## 📂 Project Structure
| File | Responsibility |
| :--- | :--- |
| `TicketsList.tsx` | Main dashboard, search logic, and global filters. |
| `TicketDetails.tsx` | Individual ticket view and permission-based tool rendering. |
| `ChangeStatus.tsx` | Component for updating ticket status (Open/Closed). |
| `api.service.ts` | Centralized API service for all backend communication. |

---

## 🛠 Installation & Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start the Application:**
    ```bash
    npm start
    ```

3.  **Backend Configuration:**
    Ensure your Backend API server is running at the address specified in `api.service.ts` (Default: `http://localhost:4000`).

---

## 📝 Technical Notes
* **Status Mapping:** The system is configured where Status ID `2` represents a "Closed" ticket.
* **Authentication:** All protected API calls require a valid JWT token stored in `localStorage`, passed via the `Authorization` header.

---
**Developed by [ahulamit katzenlbogen] - 2024/2025**
