# D2R Analytics Platform

**Direct to Retailer Intelligence Hub** - A futuristic React + TypeScript + Tailwind CSS analytics platform for supply chain management and logistics optimization.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

**Demo Credentials:**

- Email: `admin@d2r.com`
- Password: `password123`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── App.tsx              # Root component with providers
│   └── routes.tsx           # Centralized route definitions
│
├── components/
│   ├── ai/                  # Decision Assistant (AI chatbot)
│   ├── auth/                # AuthGuard component
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── strategic/       # KPIs, regions, partners, recommendations
│   │   ├── operational/     # SLA trends, lanes, breaches, queues
│   │   ├── financial/       # Cost waterfall, heatmaps, variance
│   │   ├── facility/        # Capacity, utilization, expansion
│   │   └── forecast/        # Demand/capacity forecasting
│   ├── data-acquisition/    # Upload zone, dataset tables
│   ├── forecast/            # Forecast Centre components
│   ├── layout/              # AppShell, Sidebar, PageTopBar
│   ├── master-data/         # Customer, Partner, Facility tables
│   ├── recommendations/     # AI recommendation components
│   ├── shipments/           # Shipment explorer
│   └── ui/                  # shadcn/ui components
│
├── context/
│   ├── AuthContext.tsx      # Authentication state & login/logout
│   ├── DatasetContext.tsx   # Active dataset & parsed CSV data
│   ├── ThemeContext.tsx     # Theme settings (mode, density, etc.)
│   └── index.ts             # Context re-exports
│
├── hooks/
│   ├── useCommon.ts         # usePagination, useSorting, useDebouncedValue, useLocalStorage
│   ├── use-mobile.tsx       # useIsMobile responsive hook
│   ├── use-toast.ts         # Toast notifications
│   └── index.ts             # Hook re-exports
│
├── lib/
│   ├── utils.ts             # cn() className utility
│   ├── formatters.ts        # formatCurrency, formatDate, formatPercentage, formatNumber
│   └── validators.ts        # isValidEmail, isValidGSTIN, isValidPAN, etc.
│
├── mocks/
│   ├── index.ts             # Central mock data exports
│   ├── strategicDashboard.mock.ts
│   ├── operationalDashboard.mock.ts
│   ├── financialDashboard.mock.ts
│   └── ...                  # Domain-specific mock files
│
├── pages/                   # Route page components
│   ├── auth/                # LoginPage, ForgotPasswordPage
│   ├── dashboard/           # GenericDashboardPage, DatasetDashboardsPage
│   ├── data/                # DatasetsPage, ShipmentsExplorerPage
│   ├── master-data/         # Customer, Partner, Facility, RateCards
│   ├── recommendations/     # RecommendationFeedPage, DetailPage
│   └── admin/               # UsersRolesPage, AppearancePage, AuditTrail
│
└── types/                   # TypeScript interfaces
    ├── dashboard.ts
    ├── data-acquisition.ts
    ├── master-data.ts
    └── ...
```

---

## 🎨 Design System

The app uses a **futuristic dark neon glassmorphism** theme:

- **Colors:** Deep navy/charcoal backgrounds with cyan/violet neon accents
- **Cards:** Glassmorphism with `backdrop-blur` and neon borders
- **Animations:** Subtle hover glows, pulse effects, smooth transitions

### Theming

All colors are defined as CSS variables in `src/index.css` and mapped in `tailwind.config.ts`:

```css
/* src/index.css */
:root {
  --primary: 190 95% 65%; /* Cyan */
  --secondary: 270 70% 65%; /* Violet */
  --accent: 175 80% 55%; /* Teal */
  --background: 222 47% 11%; /* Dark navy */
  /* ... */
}
```

### Key Classes

- `.glass-card` - Glassmorphism card with blur
- `.neon-border` - Animated neon border
- `.neon-text` - Glowing text effect
- `.chip-*` - Status chip variants

---

## 🧩 Adding a New Page

1. **Create the page component:**

   ```tsx
   // src/pages/my-domain/MyNewPage.tsx
   const MyNewPage = () => {
     return (
       <AppShell>
         <PageTopBar title="My New Page" />
         {/* Your content */}
       </AppShell>
     );
   };
   ```

2. **Add route in `src/app/routes.tsx`:**

   ```tsx
   {
     path: "/my-domain/new",
     element: <AuthGuard><MyNewPage /></AuthGuard>
   }
   ```

3. **Add sidebar link in `src/components/layout/Sidebar.tsx`**

4. **Add mock data (if needed) in `src/mocks/myDomain.mock.ts`**

---

## 🔌 Contexts

### useAuth()

```tsx
const { user, isAuthenticated, login, logout } = useAuth();
```

### useDataset()

```tsx
const { activeDataset, setActiveDataset, parsedData } = useDataset();
```

### useTheme()

```tsx
const { theme, setTheme, density, reduceMotion } = useTheme();
```

---

## 🛠 Utilities

### Formatters (`src/lib/formatters.ts`)

```tsx
import { formatCurrency, formatDate, formatPercentage } from "@/lib/formatters";

formatCurrency(529600000, { compact: true }); // "₹529.6Cr"
formatDate("2024-10-31", "relative"); // "2 months ago"
formatPercentage(88.2, { showSign: true }); // "+88.2%"
```

### Validators (`src/lib/validators.ts`)

```tsx
import { isValidEmail, isValidGSTIN, isValidPhone } from "@/lib/validators";

isValidEmail("user@example.com"); // true
isValidGSTIN("27AABCR1234M1Z5"); // true
```

### Hooks (`src/hooks`)

```tsx
import { usePagination, useSorting, useDebouncedValue } from "@/hooks";

const { sortedData, toggleSort } = useSorting({ data, initialSortKey: "name" });
const { currentPage, nextPage, prevPage } = usePagination({ totalItems: 100 });
const debouncedSearch = useDebouncedValue(searchTerm, 300);
```

---

## 📊 Mock Data

All mock data is centralized in `src/mocks/index.ts`:

```tsx
import {
  strategicMock,
  operationalMock,
  financialMock,
  datasetListMock,
} from "@/mocks";
```

Data is derived from actual CSV files:

- `public/data/sample_dataset.csv` - ~22K shipments (Oct 2024)
- `public/data/rate_card_master.csv` - ~47K lane rates

---

## 🔐 Authentication

Mock authentication with localStorage:

- Token stored as `d2r-auth-token`
- User data stored as `d2r-user`
- Protected routes wrapped with `<AuthGuard>`

---

## 📦 Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **shadcn/ui** (component library)
- **React Router v6** (routing)
- **TanStack Query** (data fetching)
- **Recharts** (visualizations)
- **Lucide React** (icons)

---

## 🧪 Development

```bash
# Lint check
npm run lint

# Type check
npm run typecheck

# Build
npm run build
```

---

## 📝 License

Proprietary - D2R Network © 2024
