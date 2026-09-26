# Inventory Management System (IMS)

A modern, visually striking dark-mode Inventory Management System web application built with React, TypeScript, and Tailwind CSS. Designed to replace manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use app.

## 🎯 Target Users
- **Inventory Managers** – manage incoming & outgoing stock
- **Warehouse Staff** – perform transfers, picking, shelving, and counting

## 🔐 Authentication
- Email/password sign up & login
- OTP-based password reset (6-digit code with auto-advance inputs)
- Redirect to Inventory Dashboard after successful login

## 📊 Dashboard View
The landing page provides a real-time snapshot of inventory operations:

### Key Performance Indicators (KPIs)
- **Total Products in Stock** – Overall inventory valuation
- **Low Stock / Out of Stock Items** – Items needing attention
- **Pending Receipts** – Incoming shipments awaiting processing
- **Pending Deliveries** – Outgoing orders ready for dispatch
- **Internal Transfers Scheduled** – Movements between locations

### Dynamic Filters
- By document type: Receipts / Delivery / Internal Transfer / Adjustment
- By status: Draft, Waiting, Ready, Done, Canceled
- By warehouse or location
- By product category

## 🧭 Navigation (Left Sidebar)
1. **Products** – Create/update products, view stock per location, manage categories & reordering rules
2. **Operations**
   - **Receipts** (Incoming Stock from vendors)
   - **Delivery Orders** (Outgoing Goods for customer shipment)
   - **Inventory Adjustments** (Fix stock mismatches)
   - **Move History** (Complete audit trail of all stock movements)
3. **Dashboard** – Overview landing page
4. **Settings** – Warehouse management & system preferences
5. **Profile Menu** – My Profile & Logout

## 📦 Core Features

### Product Management
Create products with:
- Name
- SKU / Code
- Category
- Unit of Measure
- Initial stock (optional)

### Receipts (Incoming Goods)
Used when items arrive from vendors:
1. Create a new receipt
2. Add supplier & products
3. Input quantities received
4. Validate → stock increases automatically

*Example: Receive 50 units of “Steel Rods” → stock +50*

### Delivery Orders (Outgoing Goods)
Used when stock leaves the warehouse for customer shipment:
1. Pick items
2. Pack items
3. Validate → stock decreases automatically

*Example: Sales order for 10 chairs → Delivery order reduces chairs by 10*

### Internal Transfers
Move stock inside the company:
- Main Warehouse → Production Floor
- Rack A → Rack B
- Warehouse 1 → Warehouse 2

*Each movement is logged in the ledger*

### Stock Adjustments
Fix mismatches between recorded stock and physical count:
1. Select product/location
2. Enter counted quantity
3. System auto-updates and logs the adjustment

### Additional Features
- ✅ Alerts for low stock
- ✅ Multi-warehouse support
- ✅ SKU search & smart filters
- ✅ Real-time stock ledger with audit trail
- ✅ Command Palette (Cmd+K / Ctrl+K) for quick navigation
- ✅ Animated micro-interactions and transitions
- ✅ Confetti celebrations on successful validations
- ✅ Theme accent switching (Emerald, Blue, Violet, Cyan)
- ✅ Responsive design with glassmorphism effects
- ✅ LocalStorage persistence for all data

## 💰 Example Inventory Flow

**Step 1: Receive Goods from Vendor**
- Receive 100 kg Steel → Stock: +100

**Step 2: Move to Production Rack**
- Internal Transfer: Main Store → Production Rack
- Stock unchanged in total, but location updated

**Step 3: Deliver Finished Goods**
- Deliver 20 Steel → Stock for frames: –20

**Step 4: Adjust Damaged Items**
- 3 kg steel damaged → Stock: –3

*Everything logged in the Stock Ledger*

## 🛠️ Technology Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3.4 with custom dark theme
- **UI Components**: shadcn-style custom components
- **Charts**: Recharts (AreaChart, PieChart)
- **Animations**: Framer Motion
- **Celebrations**: canvas-confetti
- **Icons**: Lucide React
- **Utilities**: clsx + tailwind-merge, date-fns
- **State Management**: Custom InventoryContext (React Context API)
- **Routing**: React Router v6
- **Persistence**: localStorage

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/sathwik-0910/Stocksense.git
cd Stocksense

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
# Outputs to ./dist
```

## 🧪 Testing the Application
Demo login credentials are available in the login page for quick testing:
- **Demo Manager**: manager@apex-ims.io / ManagerPass123!
- **Demo Warehouse**: warehouse@apex-ims.io / WarehousePass456!
- **Demo Analyst**: analyst@apex-ims.io / AnalystPass789!

## 📱 Responsive Design
The application is fully responsive and works on:
- Desktop monitors (primary target)
- Tablets
- Mobile devices (sidebar converts to bottom navigation)

## 🎨 Design System
- **Dark Mode Base**: #0A0A0B (background), #141416 (surface), #1C1C1F (elevated)
- **Accent Colors**: Emerald, Blue, Violet, Cyan (toggleable in Settings)
- **Status Indicators**: 
  - Draft/Gray, Waiting/Amber, Ready/Blue, Done/Green
  - Cancelled/Red, Low Stock/Orange, Out of Stock/Red
- **Typography**: Inter (body), JetBrains Mono (code/numbers)
- **Effects**: Glass panels, blur backgrounds, animated transitions

## 📄 License
MIT License - feel free to use and modify for your inventory management needs.

## � Acknowledgements
- Inspired by modern SaaS applications (Linear, Vercel, Notion dark modes)
- Built with Vite + React + TypeScript starter template
- Icons by Lucide
- Charts by Recharts
- Animations by Framer Motion
