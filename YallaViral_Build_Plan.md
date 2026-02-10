# 🚀 YallaViral: Mini-SaaS Build Plan (Next.js + Supabase)

**Objective:** Build a localized UGC & Studio booking platform for the Meknes market.
**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase, shadcn/ui.
**Key Features:** Dual workflow (Studio Rental vs. UGC Campaign), Drag-and-Drop Builder, WhatsApp Integration.

---

## 🛑 MASTER INSTRUCTIONS FOR USER
1.  **Do not** paste this entire file at once.
2.  Copy **Phase 1**, paste it into your AI agent (Antigravity/Cursor/Windsurf), and wait for it to finish.
3.  **Verify** the result (run the code).
4.  Only then, copy **Phase 2**, and so on.

---

## 🟢 PHASE 1: Project Skeleton & UI Foundation

**CONTEXT FOR AGENT:**
We are building a "Mini SaaS" called YallaViral.
Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React.
UI Library: shadcn/ui.
Database: Supabase.

**TASK:**
1.  **Initialize Project:**
    * Create a new Next.js app named `yallaviral`.
    * Initialize `shadcn/ui` with the `slate` base color and CSS variables.
    * Install `lucide-react` for icons.
    * Install `framer-motion` for animations.

2.  **Folder Structure:**
    * Set up the standard App Router structure:
        * `/app/(auth)` -> For Login/Register pages.
        * `/app/(dashboard)` -> For the main app layout (Sidebar + Header).
        * `/components/ui` -> For shadcn components.
        * `/lib` -> For utility functions and Supabase client.

3.  **Global Layout:**
    * Create a `Sidebar` component in `(dashboard)/layout.tsx`.
    * **Links:** "Dashboard", "New Campaign" (UGC), "Book Studio", "My Requests".
    * **Style:** Use a high-contrast "Gen-Z" aesthetic. Primary color: Electric Purple (`#7c3aed`). Background: White.
    * Add a simple "Connect Wallet/Login" button placeholder in the top right.

**VALIDATION:**
* Run `npm run dev`.
* Verify you see a clean dashboard with a purple sidebar and the correct links.

---

### 🛑 STOP AND VERIFY: Is the app running and the sidebar visible?

---

## 🟡 PHASE 2: Database Schema & Supabase Setup

**CONTEXT FOR AGENT:**
Project: YallaViral (Next.js + Supabase). We need to set up the backend.

**TASK:**
1.  **Supabase Setup:**
    * Install `@supabase/supabase-js`.
    * Create a `lib/supabase.ts` client helper.

2.  **Database Migration (SQL):**
    * Create a SQL migration file to generate these tables:
        * `profiles`: `id` (uuid, PK), `full_name`, `brand_name`, `phone`, `role` (admin/client).
        * `resources`: `id` (uuid, PK), `type` (enum: 'model', 'studio', 'gear'), `name`, `hourly_rate` (int), `image_url`, `tags` (text[]), `status` (active/inactive).
        * `bookings`: `id` (uuid, PK), `user_id` (fk), `resource_id` (fk), `start_time` (timestamptz), `end_time` (timestamptz), `status` (enum: 'pending', 'confirmed', 'rejected'), `total_price` (int).

3.  **Seed Data:**
    * Create a script or SQL command to insert dummy data:
        * 3 Models (Sara, Amine, Lina) with different tags.
        * 2 Studio Spaces (Podcast Room, Green Screen).
        * 2 Gear items (Ring Light, Sony A7).

4.  **Types:**
    * Generate TypeScript interfaces for these tables in `types/database.ts`.

**VALIDATION:**
* Check your Supabase dashboard to see the tables created.
* Verify the dummy data exists in the `resources` table.

---

### 🛑 STOP AND VERIFY: Do you have data in Supabase?

---

## 🟠 PHASE 3: The "Studio Booking" Module

**CONTEXT FOR AGENT:**
We are building the "Studio Rental" feature where users pick a room and a time.
Libraries: `date-fns`, `react-day-picker`.

**TASK:**
1.  **Resource Fetching:**
    * Create a Server Component at `/app/(dashboard)/studio/page.tsx`.
    * Fetch all items from `resources` where `type` is 'studio'.
    * Display them as a Grid of Cards (Image + Name + Rate).

2.  **Booking Interface (The Drawer):**
    * When a user clicks a Studio Card, open a `Sheet` (from shadcn/ui) or `Dialog`.
    * Inside the Sheet, show a Calendar (`react-day-picker`).
    * Allow selecting a single Date.
    * Add a simple "Time Slot" selector (Morning: 09-13, Afternoon: 14-18).

3.  **State Management:**
    * Use local state (`useState`) to track the selected Date and Time.
    * Display a "Summary" at the bottom: "Room: Podcast | Date: [Date] | Total: [Price]".

**VALIDATION:**
* Click on "Podcast Room".
* Does the drawer open?
* Can you pick a date?

---

### 🛑 STOP AND VERIFY: Can you select a date and see the price update?

---

## 🔴 PHASE 4: The "UGC Builder" (Drag & Drop)

**CONTEXT FOR AGENT:**
We are building the complex "UGC Campaign" builder.
Libraries: `zustand` (state), `@dnd-kit/core` (drag and drop).

**TASK:**
1.  **Store Setup:**
    * Create a Zustand store `useCampaignStore`.
    * State: `selectedModels` (array), `videoStyle` (string), `notes` (string).

2.  **The Builder Layout:**
    * Create `/app/(dashboard)/campaign/page.tsx`.
    * **Left Column (Source):** Render a list of Draggable Model Cards (fetched from Supabase).
    * **Right Column (Target):** A Droppable area called "My Campaign".

3.  **Drag & Drop Logic:**
    * Implement `DndContext` and `useDraggable`/`useDroppable`.
    * When a Model is dropped into the "My Campaign" box, add them to the Zustand store.
    * Show the selected models in the Right Column with a "Remove" (X) button.

4.  **Video Style Selector:**
    * Below the "My Campaign" box, add a simple specific selector for "Video Style" (Unboxing, Testimonial, Skit).

**VALIDATION:**
* Drag "Model Sara" from left to right.
* Does she stay in the box?
* If you refresh, does the state persist (optional, but good)?

---

### 🛑 STOP AND VERIFY: Does the Drag & Drop work smoothly?

---

## 🟣 PHASE 5: Submission & WhatsApp Integration

**CONTEXT FOR AGENT:**
Finalizing the app. We need to save the booking and trigger the WhatsApp flow.

**TASK:**
1.  **Server Actions:**
    * Create a file `actions/create-booking.ts`.
    * Function `submitBooking(data)`:
        * Validate the user is logged in.
        * Insert the record into the `bookings` table in Supabase.
        * Return the new `booking_id`.

2.  **The "Submit" Button:**
    * Connect the "Request Booking" button in both Studio and UGC pages to this Server Action.
    * Show a loading state (`useFormStatus`) while submitting.

3.  **Success Page & WhatsApp:**
    * Create `/app/success/page.tsx`.
    * Display a big "Checkmark" animation.
    * **The Magic Button:** Add a button "Finalize on WhatsApp".
    * **Link Logic:** `https://wa.me/2126XXXXXXXX?text=Hello Mediast! I just created request #[BookingID]. Can we confirm details?`

**VALIDATION:**
* Complete a full flow: Pick a Model -> Drag to Box -> Click Submit.
* Check Supabase: Is the row there?
* Click WhatsApp button: Does it open WhatsApp with the correct message?

---

### 🏁 FINAL STOP: The MVP is ready for review.