# Technology Stack

## Core Technologies

- **Frontend**: Pure HTML5 + CSS3 + JavaScript ES6+
- **Graphics Rendering**: OffscreenCanvas + Web Workers for visual effects
- **Audio System**: Web Audio API with procedural sound generation
- **PWA**: Service Worker + Web App Manifest
- **Architecture**: Single-page application with modular design

## Key Libraries & APIs

- **Material Symbols**: Google Material Symbols Rounded for icons
- **Canvas API**: OffscreenCanvas for high-performance visual effects
- **Web Workers**: Dedicated worker (fx.worker.js) for graphics processing
- **Service Worker**: Custom caching strategy for offline functionality
- **Web Audio API**: Real-time audio synthesis
- **Touch Events**: Multi-touch gesture handling

## Browser Support

- Chrome 88+ (recommended)
- Firefox 85+
- Safari 14+
- Edge 88+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Requirements

- **Frame Rate**: Stable 60 FPS animations
- **Response Time**: <50ms click latency
- **Memory**: Optimized resource management
- **Battery**: Power-saving mode detection

## Common Commands

### Development Server

```bash
# Python HTTP server
python3 -m http.server 8080

# Node.js serve
npx serve .

# Access at http://localhost:8080
```

### Testing

```bash
# Install test dependencies
cd dev-tools && npm install

# Run complete test suite
npm test

# Launch TPS testing tool
open dev-tools/tps-test.html
```

### PWA Cache Management

```bash
# Clear PWA cache (development)
node dev-tools/clear-cache.js
```

## Build Process

No build step required - direct deployment of source files. The application runs entirely in the browser with:

- Static file serving
- Service Worker handles caching
- Web Workers handle intensive graphics processing
- No compilation or bundling needed
