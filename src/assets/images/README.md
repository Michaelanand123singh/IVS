# Hero Background Images

## 📁 How to Add Your Images

1. **Add your image files** to this folder (`src/assets/images/`) with these exact names:
   - `hero-bg-1.jpg` - First background image
   - `hero-bg-2.jpg` - Second background image  
   - `hero-bg-3.jpg` - Third background image

2. **Image requirements:**
   - **Format**: JPG or PNG
   - **Size**: 1920x1080px (Full HD) recommended
   - **File size**: Under 2MB each
   - **Quality**: High resolution, professional images

3. **After adding your images:**
   - Uncomment the import lines in `src/components/Hero.tsx`
   - Uncomment the backgroundImage lines in the same file
   - Comment out the SVG fallback backgrounds

## 🎨 Current Status

The hero section currently uses beautiful SVG gradient backgrounds as fallbacks. Once you add your actual images, the component will automatically use them for the sliding background effect.

## 🔄 How It Works

The Hero component is set up to:
- Import images from this assets folder using ES6 imports
- Cycle through 3 different background images
- Apply smooth fade transitions every 8 seconds
- Fall back to gradient backgrounds if images are not available
