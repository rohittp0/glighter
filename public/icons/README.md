# PWA Icons

To complete the PWA setup, you need to generate the following icon files:

## Required Icons

1. **icon-192x192.png** - 192x192px PNG (Android)
2. **icon-512x512.png** - 512x512px PNG (Android)
3. **apple-touch-icon.png** - 180x180px PNG (iOS, placed in /public/)

## How to Generate

### Option 1: Online Tool (Recommended)
Use https://realfavicongenerator.net:
1. Upload a high-resolution source image (preferably 512x512px or larger)
2. Configure settings for each platform
3. Download the generated icon package
4. Extract files to this directory

### Option 2: Manual Creation
Using an image editor (Figma, Sketch, Photoshop):
1. Create a 512x512px canvas
2. Design the icon with:
   - Orange (#FF6B35) background or primary color
   - Map pin/marker with "G" letter or globe icon
   - Ensure it's recognizable at small sizes
3. Export as PNG in required sizes
4. Save to this directory

### Option 3: Command Line (ImageMagick)
If you have a source SVG or large PNG:

```bash
# From the public directory
convert favicon.svg -resize 192x192 icons/icon-192x192.png
convert favicon.svg -resize 512x512 icons/icon-512x512.png
convert favicon.svg -resize 180x180 apple-touch-icon.png
```

## Design Guidelines

- **Simple and recognizable**: Icon should be clear at 48x48px
- **Branded**: Use Glighter's primary orange (#FF6B35)
- **Symbolic**: Map pin, location marker, or globe work well
- **Safe area**: Keep important elements 10% away from edges
- **Contrast**: Ensure good visibility on both light and dark backgrounds

## Temporary Placeholder

Until proper icons are generated, the app will use the favicon.svg as a fallback.
