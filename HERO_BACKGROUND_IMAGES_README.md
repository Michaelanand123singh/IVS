# Hero Background Images Setup

## 📁 Image Placement

To add your hero background images, place them in the `src/assets/images/` folder with these exact names:

- `src/assets/images/hero-bg-1.jpg` - First background image
- `src/assets/images/hero-bg-2.jpg` - Second background image  
- `src/assets/images/hero-bg-3.jpg` - Third background image

## 🖼️ Image Requirements

- **Format**: JPG or PNG
- **Size**: 1920x1080px (Full HD) recommended
- **Aspect Ratio**: 16:9
- **File Size**: Keep under 2MB per image for optimal loading
- **Quality**: High quality, professional images

## 🎨 Image Suggestions

For a professional corporate look, consider using:

1. **hero-bg-1.jpg**: Office building, business environment, or technology theme
2. **hero-bg-2.jpg**: Team collaboration, meeting room, or workspace
3. **hero-bg-3.jpg**: Technology, computers, or business solutions

## 🔄 How It Works

The hero section will automatically cycle through these 3 images with a smooth fade transition every 8 seconds. The images will:

- Cover the full viewport height
- Maintain aspect ratio
- Have a subtle dark overlay for text readability
- Animate smoothly between each image

## 📝 Current Status

Currently using placeholder files. Replace the placeholder files in the `src/assets/images/` folder with your actual images to see the effect.

## 🚀 How It Works

The Hero component imports the images using ES6 imports:

```typescript
import heroBg1 from '@/assets/images/hero-bg-1.jpg';
import heroBg2 from '@/assets/images/hero-bg-2.jpg';
import heroBg3 from '@/assets/images/hero-bg-3.jpg';
```

Then uses them in the background image URLs:

```typescript
style={{
  backgroundImage: `url(${heroBg1.src})`
}}
```

## 🎯 Pro Tips

- Use images with good contrast for text overlay
- Ensure images are optimized for web
- Test on different screen sizes
- Consider using WebP format for better compression (with JPG fallback)
