# Project: Global Asset & Document Manager (GADM)

A NestJS-based system transitioning from a simple box tracker to a multi-location asset and digital document management system.

## Vision & Scope
- **Multi-Location Management:** Track physical assets across different properties (e.g., Home, Rental Apartment Abroad, Storage Units).
- **Digital Document Vault:** Digitalize and manage critical documents (contracts, IDs, receipts) with searchable metadata.
- **Inventory Hierarchy:** User -> Location -> Container (Box/Folder) -> Item/Document.
- **Property Management Lite:** Store handover protocols, key tracking, and utility contacts for managed properties.

## Tech Stack (Current)
- **Framework:** NestJS (TypeScript)
- **UI/Templating:** Handlebars (`.hbs`) via `@nestjs/platform-express`
- **Styling:** Tailwind CSS (built via PostCSS)
- **Data Persistence:** Local JSON file (`data/boxes.json`) - *Targeted for migration*
- **QR Codes:** `qrcode` library for linking physical boxes to digital metadata.

## Core Architecture
- **Modules:** Currently focused on `boxes`. Will expand to `locations`, `containers`, and `documents`.
- **Identity:** `UserIdentificationMiddleware` provides a "soft" identity (cookies/headers). *To be upgraded for document security.*
- **Service Layer:** `BoxesService` currently manages persistence and QR generation.

## Key Workflows
- **QR Workflow:** Each box/container has a unique ID and a QR code containing its metadata for quick physical-to-digital lookup.
- **CSS Compilation:** `npm run build:css` (Tailwind -> Public).
- **Data Initialization:** `npm run setup-data`.

## Roadmap & Evolution

### Phase 1: Architectural Foundations
- [x] Migrate from JSON file to SQLite with TypeORM to support relational data (Locations -> Containers -> Items).
- [x] Transition to `uuid` for more robust ID generation.
- [x] Enable `ValidationPipe` globally in `main.ts`.
- [ ] Add comprehensive unit tests for core services.

### Phase 2: Multi-Location & Hierarchy
- [ ] Introduce `Location` entity (Name, Address, Country, Property Type).
- [ ] Introduce `Container` entity (Type: Box, Folder, Cabinet) linked to a Location.
- [ ] Update `Box` logic to fit within the `Container` hierarchy.

### Phase 3: Digital Document Management
- [ ] Define `Document` entity (Title, Type, Issue/Expiry Date, Container ID).
- [ ] Implement local/secure file storage for scanned PDFs and Photos.
- [ ] Implement basic encryption for sensitive document metadata.

### Phase 4: Security & Search
- [ ] Upgrade to a robust Authentication system (Passport/JWT) for document privacy.
- [ ] Implement Global Search across all Locations, Containers, and Items.
