# Images Directory

This directory can be used to store local project images for your portfolio.

## Usage Options

You have three options for images in your portfolio:

### Option 1: Use External URLs (Recommended for GitHub Pages)
Store images on external services like Unsplash, Imgur, or cloud storage.

```json
{
  "id": "img1",
  "description": "Project Screenshot",
  "imageUrl": "https://images.unsplash.com/photo-xxxxx",
  "projectId": "1",
  "order": 1
}
```

**Pros:** No storage limits, fast CDN delivery, works perfectly with GitHub Pages
**Cons:** Depends on external service

### Option 2: Store Images Locally
Place images in this directory and reference them with relative paths.

```
data/images/
├── project1-screenshot.png
├── project2-demo.jpg
└── project3-mockup.png
```

Then in your JSON:
```json
{
  "id": "img1",
  "description": "Project Screenshot",
  "imageUrl": "/images/project1-screenshot.png",
  "projectId": "1",
  "order": 1
}
```

**Note:** For this to work with static export, you need to:
1. Copy this folder to `public/images/` before building
2. Or reference images from `public/images/` directly

**Pros:** Full control over images
**Cons:** Increases repository size, slower than CDN

### Option 3: Base64 Encoding (Not Recommended)
Encode images as base64 strings directly in JSON.

```json
{
  "id": "img1",
  "description": "Project Screenshot",
  "base64Content": "data:image/png;base64,iVBORw0KGgo...",
  "projectId": "1",
  "order": 1
}
```

**Pros:** Everything in one file
**Cons:** Large JSON files, poor performance, not recommended

## Recommended Workflow

1. **For Development:** Use external URLs (Unsplash, etc.)
2. **For Production:** 
   - Option A: Keep using external URLs (easiest)
   - Option B: Store in `public/images/` and reference as `/images/filename.png`

## Image Optimization Tips

- Use WebP format for smaller file sizes
- Optimize images before adding (use tools like TinyPNG)
- Recommended dimensions: 800x600 pixels for portfolio images
- Keep file sizes under 200KB each

## Using Images in Public Folder

The better approach is to store images in `public/images/`:

1. Create `public/images/` directory (if it doesn't exist)
2. Place your images there:
   ```
   public/images/
   ├── project1.png
   ├── project2.jpg
   └── project3.png
   ```
3. Reference in JSON as:
   ```json
   "imageUrl": "/images/project1.png"
   ```

This works seamlessly with Next.js static export!
