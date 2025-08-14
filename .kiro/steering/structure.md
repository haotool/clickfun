# Project Structure & Organization

## Root Directory - Core Files

```
clickfun/
├── index.html              # Main game file - single HTML with embedded CSS/JS
├── fx.worker.js            # Visual effects Web Worker for graphics processing
├── app.webmanifest         # PWA manifest configuration
├── sw.js                   # Service Worker for offline functionality
├── icons/pwa.svg           # Application icon (SVG format)
├── README.md               # Project documentation (Chinese)
├── CHANGELOG.md            # Version history and updates
└── PROJECT_STRUCTURE.md    # Detailed structure documentation
```

## Supporting Directories

### Documentation (`docs/`)

- Architecture documentation
- Development guides
- Test reports and verification
- API documentation

### Testing (`tests/`)

- Unit and integration tests (`.test.js` files)
- Test configuration and runners
- Performance benchmarks
- PWA functionality tests

### Development Tools (`dev-tools/`)

- Node.js dependencies (`package.json`)
- TPS testing utilities
- Cache management scripts
- Automated test runners

### Assets (`assets/`)

- Screenshots and test images
- Performance reports
- Error logs and debugging materials

## Architecture Patterns

### Single File Application

- All game logic contained in `index.html`
- Embedded CSS and JavaScript for simplicity
- No build process or bundling required

### Web Worker Pattern

- Graphics processing offloaded to `fx.worker.js`
- Main thread handles game logic and user interaction
- Worker handles intensive visual effects (lightning, ripples)

### PWA Architecture

- Service Worker (`sw.js`) manages caching strategy
- Manifest (`app.webmanifest`) defines app metadata
- Offline-first approach with cache-first strategy

## Code Organization Principles

### CSS Structure

- CSS custom properties (variables) for theming
- Component-based class naming
- Responsive design with mobile-first approach
- Animation keyframes for visual effects

### JavaScript Structure

- Event-driven architecture
- Modular functions within single file
- Web Worker communication via postMessage
- LocalStorage for settings persistence

### File Naming Conventions

- Kebab-case for files (`fx.worker.js`, `app.webmanifest`)
- Descriptive names indicating purpose
- Version tracking in Service Worker and manifest

## Deployment Structure

### Production Files (Required)

- `index.html` - Core application
- `fx.worker.js` - Graphics worker
- `app.webmanifest` - PWA manifest
- `sw.js` - Service Worker
- `icons/` - Application icons

### Development Files (Optional)

- `docs/`, `tests/`, `dev-tools/`, `assets/` - Not needed for production
- Can be excluded during deployment for minimal footprint
