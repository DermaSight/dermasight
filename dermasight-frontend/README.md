# DermaSight: Intelligent Skin Disease Classification & Severity Scoring System

DermaSight is an intelligent web application designed for early detection and severity classification of skin diseases. Developed as a Capstone project for Coding Camp 2026 (Theme: Healthy Lives & Well-being), this application aims to act as a first-line triage system to assist individuals in recognizing the severity of their skin conditions and provide educational insights powered by Generative AI.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Knowledge Graph (Graphify)](#knowledge-graph-graphify)

## Features
- **Skin Image Scan:** Users can upload a photo of a skin lesion for initial disease classification.
- **Severity Scoring:** Extracts visual features from the image to estimate the severity index.
- **Generative AI Education:** Provides easy-to-understand medical summaries, triggers, and preliminary advice based on the classification results.
- **Dermatology Library:** A built-in educational library to browse common skin conditions.

## Tech Stack
### Frontend
- **Framework:** React 19 + Vite
- **Package Manager:** Bun
- **Styling:** Tailwind CSS v4, Framer Motion v12
- **Routing:** React Router 7
- **UI Components:** Tabler Icons, React Easy Crop, React Markdown

### Planned AI / Backend (In Progress)
- **Backend API:** Express.js (currently using mocked data in `src/lib/mockService.ts`)
- **AI Models:** TensorFlow (CNN with Custom Components)
- **MLOps API:** FastAPI
- **Data Science:** Streamlit for dashboard, NumPy, Pandas, Matplotlib

## Design System
DermaSight follows a Pinterest-inspired design system documented in [DESIGN.md](./DESIGN.md):
- **Radii:** Uses `16px` for standard cards/buttons, and `32px` for modals/large cards.
- **Colors:** A monochrome and warm-cream palette (`#f6f6f3` and `#ffffff`) with a single primary accent color (`#e60023` - Pinterest Red) reserved exclusively for primary actions.
- **Layout:** Tightly-paced Masonry grids for imagery.
- **Typography:** Uses standard geometric system sans-serif faces.

## Project Architecture
- `src/pages/`: Contains the top-level route views (Scan, Profile, Library, Home, Result, etc.).
- `src/components/`: Reusable, modular UI components categorized by domains.
- `src/lib/`: Core logic hooks, generic wrappers, and mocked backend services.
- `src/utils/`: Common utility functions, formatting logic, and context managers.
- `src/routes/`: Centralized route definition file.

## Getting Started

1. **Install dependencies:**
   Make sure you have [Bun](https://bun.sh/) installed.
   ```bash
   bun install
   ```

2. **Run the development server:**
   ```bash
   bun run dev
   ```

3. **Build for production:**
   ```bash
   bun run build
   ```

4. **Lint and format code:**
   The repository relies on ESLint and Biome for static checks.
   ```bash
   bun run lint:eslint
   bunx biome format --write .
   ```
