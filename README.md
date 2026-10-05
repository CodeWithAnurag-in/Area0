# Area0 — Enterprise VLSM & OSPF Adjacency Virtual Laboratory

[![Live Demo](https://img.shields.io/badge/Live_Demo-vlsm--vlab.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vlsm-vlab.vercel.app)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**Area0** is an interactive, hardware-accelerated computer networking virtual laboratory designed to teach **Variable Length Subnet Masking (VLSM)**, **OSPF Neighbor Adjacency Finite State Machines (FSM)**, and enterprise routing architecture. 

It combines cinematic **Three.js WebGL graphics**, real-time algorithmic network calculation engines, a full **Cisco IOS CLI terminal simulator**, and diagnostic benchmark evaluations inside a unified **Bento Monochrome design system**.

---

## Live Production Deployment

Access the live application at: **[https://vlsm-vlab.vercel.app](https://vlsm-vlab.vercel.app)**

---

## Core Features & Modules

### 1. 3D Binary Earth Hero Experience
- **Photorealistic WebGL Earth**: High-resolution bump, specular, and topology mapping with custom ambient and directional lighting.
- **Fibonacci Orbital Binary Shell**: Real-time instanced mesh of 800 orbital data nodes arranged via spherical golden-ratio Fibonacci spirals with dynamic lattice network topologies.
- **Spring-Damped 420vh Scroll Runway**: Apple-grade physics (`useScroll` + `useSpring`) translating trackpad/wheel scrub into continuous cinematic camera plunging ($z = 8.5 \to 0.4$) without raw wheel jitter.
- **Angular Velocity Deceleration**: Rotational torque smoothly ramps down to zero as the camera enters the surface, eliminating high-speed tangential spin artifacts.
- **Locked-Detent Inertia Deadband**: $\sim 100\text{vh}$ solid pitch-black momentum absorption buffer (`#000000`) preventing accidental overscroll past Section 2.
- **Bi-Directional Traversal**: Scrolling up from the top of the main site cleanly re-engages the black void and pulls back out into orbit.

### 2. Interactive VLSM Subnet Planner & Overlap Validator
- **Dynamic Variable Length Subnet Allocation**: Allocate variable-sized subnets from a base major network block (`/24`, `/16`, etc.) sorted by host capacity requirements.
- **Bit-Borrowing & Mask Visualizer**: Step-by-step breakdown of network bits, subnet bits, and host bits with 32-bit binary representation.
- **Real-Time Collision & Overlap Detection**: Instantaneous mathematical boundary validation identifying network collisions and broadcast domain bleed.
- **Exportable Allocation Tables**: Host count, usable IP ranges, subnet masks, wildcard masks, and broadcast addresses.

### 3. OSPF Neighbor Adjacency Finite State Machine (FSM)
- **7-State Adjacency Engine**: Interactive step-through of the complete OSPF convergence lifecycle:
  `Down` $\to$ `Init` $\to$ `2-Way` $\to$ `ExStart` $\to$ `Exchange` $\to$ `Loading` $\to$ `Full`
- **Hello Packet Parameter Negotiation**: Real-time validation of Hello/Dead intervals, Area ID, Subnet Mask, MTU size, and Authentication keys.
- **DR / BDR Election Emulation**: Dual-router priority and highest Router ID (RID) arbitration over multi-access broadcast segments.
- **Live State Inspection**: Visual packet exchange timeline with Database Description (DBD), Link State Request (LSR), and Link State Update (LSU) packet flows.

### 4. Authentic Cisco IOS CLI Terminal Emulator
- **Interactive Command Prompt**: Simulates Cisco IOS routing configuration and troubleshooting commands:
  - `show ip route`
  - `show ip ospf neighbor`
  - `show ip interface brief`
  - `show ip ospf database`
  - `ping` and `traceroute`
  - Tab autocompletion and command history buffer (`↑` / `↓`).

### 5. Diagnostic & Mastery Benchmarks
- **Pre-Test Benchmark**: Baseline knowledge evaluation before starting the lab.
- **Post-Test Benchmark**: Comprehensive mastery evaluation testing VLSM math, CIDR subnetting, and OSPF convergence logic.
- **Pop-out Modal Dialogs**: Self-contained modals keeping the main page flow clean and concise.
- **Radial Speedometer Gauges**: SVG-based animated speedometer indicators rendering accuracy percentages and benchmark grading in real time.

### 6. Bento Monochrome Design System
- **Unified Color Palette**: Single dark and light monochromatic ramp (`neutral-950` root, subtle border hairlines, and specular radial glows).
- **Typography**: Editorial typography featuring **Plus Jakarta Sans** for display headings and **Instrument Sans** for UI, numbers, IP addresses, and code.
- **Full Theme Support**: System-aware and manual Dark/Light mode toggle with zero layout shift or flash.

---

## Tech Stack

| Category | Technologies |
|---|---|
| **Framework & Core** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/) |
| **3D Graphics & Shaders** | [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/), Bento Monochrome Design Tokens |
| **Animation & Motion** | [Framer Motion](https://motion.dev/) (`motion/react`) |
| **Icons & UI Primitives** | [Lucide React](https://lucide.dev/), Radix UI Slot, Canvas Confetti |
| **Hosting & CI/CD** | [Vercel](https://vercel.com/) |

---

## Project Structure

```
vlsm-vlab/
├── public/                 # Static assets, emblems, icons
├── src/
│   ├── assets/             # Brand graphics and media
│   ├── components/         # Application feature sections & 3D canvas
│   │   ├── ui/             # Reusable UI primitives (Bento cards, Liquid buttons)
│   │   ├── vlab/           # Theme toggle & virtual lab utilities
│   │   ├── AimSection.tsx            # Section 2: Statement of Aim
│   │   ├── ArchitectureSection.tsx   # Section 3: Pro Topology Architecture
│   │   ├── Atmosphere.tsx            # 3D Earth atmospheric glow shader
│   │   ├── BinaryField.tsx           # 3D Fibonacci orbital binary shell
│   │   ├── ConclusionSection.tsx     # Section 6: Summary & Lab Footer
│   │   ├── Earth.tsx                 # 3D Photorealistic Earth sphere
│   │   ├── HUD.tsx                   # Sci-Fi telemetry HUD overlay
│   │   ├── HeroExperienceWrapper.tsx # 420vh spring-damped scroll runway
│   │   ├── Navigation.tsx            # Floating island navigation bar
│   │   ├── OspfAdjacencySection.tsx  # Interactive OSPF Neighbor FSM
│   │   ├── PostTestSection.tsx       # Post-test mastery benchmark
│   │   ├── PreTestSection.tsx        # Pre-test diagnostic benchmark
│   │   ├── Scene.tsx                 # Three.js root scene setup
│   │   ├── SpecTableSection.tsx      # Technical network spec table
│   │   ├── SpeedometerGauge.tsx      # Animated radial gauge component
│   │   ├── SubnetPlannerSection.tsx  # Interactive VLSM Subnet Planner
│   │   └── TerminalCard.tsx          # Cisco IOS CLI terminal emulator
│   ├── lib/
│   │   └── utils.ts        # Class merging and utility helpers
│   ├── App.tsx             # Root application orchestrator
│   ├── index.css           # Tailwind CSS v4 design tokens & theme layers
│   └── main.tsx            # Application entry point
├── index.html              # HTML shell with synchronous scroll restoration reset
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration with Tailwind CSS plugin
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm** or **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/CodeWithAnurag-in/Area0.git
   cd Area0
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview the production build**:
   ```bash
   npm run preview
   ```

---

## Deployment

The application is deployed on **Vercel** with automatic preview and production deployments.

To deploy your own instance:
```bash
npx vercel --prod
```

---

## License

This project is created for educational and virtual laboratory demonstration purposes.
