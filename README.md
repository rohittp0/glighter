# Glighter

A Progressive Web App for creating map animations and exporting them as videos.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MapTiler API Key

1. Sign up for a free MapTiler account at [https://www.maptiler.com/](https://www.maptiler.com/)
2. Get your API key from the MapTiler dashboard
3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Edit `.env.local` and replace `your_api_key_here` with your actual MapTiler API key:
   ```
   VITE_MAPTILER_API_KEY=your_actual_api_key_here
   ```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### Location Selection Screen

1. **Add Locations**: Click anywhere on the map to add numbered markers
2. **Drag Markers**: Click and drag markers to reposition them
3. **Delete Markers**: Click the × button next to a location in the list
4. **View Country Names**: Markers are automatically reverse-geocoded to show country names
5. **Continue**: Click "Next: Preview Animation" when you have at least 2 locations

### Animation Preview Screen

1. **Preview**: Click "Play" to see the animation
   - Animation starts from the opposite hemisphere
   - Flies to each country in sequence
   - Highlights each country with orange fill
   - Ends with a zoom-out showing all countries
2. **Stop**: Click "Stop" to halt the animation mid-sequence
3. **Export Video**: Click "Export Video" to record and download the animation as a `.webm` file

## Features

- 📍 Interactive map with click-to-add markers
- 🎯 Numbered, draggable markers with sequential ordering
- 🌍 Automatic reverse geocoding to country names
- 🎬 Smooth camera animations with country highlighting
- 📹 Client-side video export (no server required)
- 📱 Mobile-first, responsive design
- ⚡ Fast and lightweight (~1.2MB bundle)

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 7** - Build tool and dev server
- **MapLibre GL JS** - Map rendering
- **MapTiler** - Map tiles and geocoding API
- **Zustand** - State management
- **MediaRecorder API** - Video export

## Project Structure

```
src/
├── components/
│   ├── map/               # Map-related components
│   │   ├── MapContainer.tsx
│   │   ├── MarkerManager.tsx
│   │   ├── CountryLayer.tsx
│   │   └── AnimationController.tsx
│   └── ui/                # UI components
│       ├── Button.tsx
│       ├── MarkerList.tsx
│       └── ProgressBar.tsx
├── screens/               # Main app screens
│   ├── LocationSelectionScreen.tsx
│   └── AnimationPreviewScreen.tsx
├── hooks/                 # Custom React hooks
│   ├── useCountryGeocoding.ts
│   └── useVideoExport.ts
├── store/                 # Zustand state stores
│   ├── useMarkerStore.ts
│   └── useAnimationStore.ts
├── services/              # External services
│   ├── maptiler.ts
│   ├── geocoding.ts
│   └── videoExport.ts
├── utils/                 # Helper functions
│   └── animationHelpers.ts
├── types/                 # TypeScript types
│   ├── marker.types.ts
│   ├── country.types.ts
│   └── animation.types.ts
└── assets/
    └── data/
        └── countries-110m.geojson  # Country boundaries
```

## Development Commands

```bash
# Start dev server with HMR
npm run dev

# Type-check and build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+

**Note**: Video export requires MediaRecorder API support. On Safari, you may need to use Safari 14.1+ for WebM video recording.

## Current Template: Country Highlight

The app currently includes one animation template:

- Flies to each selected country in sequence
- Highlights each country with semi-transparent orange fill
- Starts from the opposite hemisphere of the first marker
- Ends with a zoom-out showing all selected countries

## Future Enhancements

- Additional animation templates (city spotlight, route animation, etc.)
- PWA offline support with service worker
- Custom animation timing controls
- Multiple video format export options (MP4, GIF)
- Sharing capabilities

## License

MIT
