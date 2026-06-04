# Tailwind CSS Setup - Complete Configuration

## Current Status: Already Configured! 

Your Tailwind CSS v4 is already properly set up and working. Here's the complete setup:

## Current Configuration

### 1. **Package Dependencies** (Already Installed)
```json
{
  "dependencies": {
    "@tailwindcss/vite": "^4.1.17",
    "tailwindcss": "^4.1.17"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.22",
    "postcss": "^8.5.6"
  }
}
```

### 2. **Vite Configuration** (Already Setup)
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
})
```

### 3. **Tailwind Configuration** (Already Setup)
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandGreen: {
          DEFAULT: "#004d00",
          600: "#005a00",
          700: "#004400",
        },
        brandYellow: {
          DEFAULT: "#ffd200",
          500: "#ffd200",
          600: "#f5c400",
        },
      },
    },
  },
  plugins: [],
}
```

### 4. **PostCSS Configuration** (Already Setup)
```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 5. **CSS Import** (Already Setup)
```css
/* src/index.css */
@import "tailwindcss";

:root {
  --brand-green: #004d00;
  --brand-green-2: #005a00;
  --brand-yellow: #ffd200;
  --brand-bg: #f7f7f7;
  --brand-text: #1f2937;
  --brand-muted: #6b7280;

  font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color: var(--brand-text);
  background-color: var(--brand-bg);

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Additional custom styles... */
```

### 6. **HTML Link** (Already Setup)
```html
<!-- index.html -->
<script src="https://cdn.tailwindcss.com"></script>
```

## How to Use Tailwind CSS

### 1. **Basic Usage**
```jsx
// In any component
<div className="bg-brandGreen text-white p-4 rounded-lg">
  <h1 className="text-2xl font-bold">Hello Tailwind!</h1>
</div>
```

### 2. **Custom Colors**
```jsx
// Using custom brand colors defined in tailwind.config.js
<div className="bg-brandGreen text-brandYellow">
  Brand Colors
</div>
```

### 3. **Responsive Design**
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive Grid
</div>
```

### 4. **Hover and Focus States**
```jsx
<button className="bg-brandGreen hover:bg-brandGreen-600 focus:outline-none">
  Interactive Button
</button>
```

## Available Brand Colors

### **Brand Green**
- `bg-brandGreen` - Main green (#004d00)
- `bg-brandGreen-600` - Lighter green (#005a00)
- `bg-brandGreen-700` - Darker green (#004400)
- `text-brandGreen` - Text color
- `border-brandGreen` - Border color

### **Brand Yellow**
- `bg-brandYellow` - Main yellow (#ffd200)
- `bg-brandYellow-500` - Standard yellow (#ffd200)
- `bg-brandYellow-600` - Darker yellow (#f5c400)
- `text-brandYellow` - Text color
- `border-brandYellow` - Border color

## Common Tailwind Classes Used in Project

### **Layout**
```jsx
<div className="container mx-auto px-4">
<div className="flex flex-col md:flex-row">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### **Spacing**
```jsx
<div className="p-4 m-2 space-y-4 gap-6">
<div className="mt-8 mb-4">
```

### **Typography**
```jsx
<h1 className="text-4xl font-bold text-center">
<p className="text-lg text-gray-600">
<span className="text-sm font-medium">
```

### **Colors & Backgrounds**
```jsx
<div className="bg-white text-gray-800">
<div className="bg-brandGreen text-white">
<div className="bg-gray-100">
```

### **Borders & Shadows**
```jsx
<div className="border-2 border-brandYellow rounded-lg">
<div className="shadow-lg hover:shadow-xl">
```

### **Transitions & Animations**
```jsx
<div className="transition-all duration-300 hover:scale-105">
<div className="transform hover:-translate-y-1">
```

## If Tailwind is Not Working

### **Check These:**

1. **Verify Imports in index.css**
```css
@import "tailwindcss";
```

2. **Check Vite Config**
```javascript
import tailwindcss from '@tailwindcss/vite'
plugins: [tailwindcss(), react()]
```

3. **Verify Tailwind Config Content Path**
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

4. **Restart Development Server**
```bash
npm run dev
```

### **Troubleshooting Steps:**

1. **Clear Cache**
```bash
rm -rf node_modules/.vite
npm run dev
```

2. **Check Console for Errors**
- Open browser dev tools
- Look for CSS-related errors
- Check if Tailwind classes are applied

3. **Verify Build Process**
```bash
npm run build
npm run preview
```

## Advanced Usage

### **Custom Components**
```jsx
// Create reusable component with Tailwind
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

// Usage
<Card className="border-2 border-brandYellow">
  <h2 className="text-xl font-bold text-brandGreen">Title</h2>
</Card>
```

### **Conditional Classes**
```jsx
<div className={isActive ? "bg-brandGreen" : "bg-gray-200"}>
  Conditional styling
</div>
```

### **Combining with CSS Variables**
```jsx
<div style={{ "--brand-green": "#004d00" }} className="bg-[var(--brand-green)]">
  Using CSS variables with Tailwind
</div>
```

## Status: Ready to Use! 

Your Tailwind CSS is fully configured and ready to use. You can:

1. **Use any Tailwind class** in your components
2. **Access custom brand colors** (brandGreen, brandYellow)
3. **Build responsive designs** with md:, lg:, xl: prefixes
4. **Add hover/focus states** with hover: and focus: prefixes
5. **Use transitions and animations** with transition- classes

**All Tailwind classes should work immediately in your components!**
