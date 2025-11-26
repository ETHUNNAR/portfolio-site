# Vi The Ngo - Portfolio Website

A modern, animated portfolio website built with Next.js, Tailwind CSS, and Framer Motion.

## Getting Started

### Prerequisites
- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. **Extract the zip file** and navigate to the project folder:
   ```bash
   cd portfolio-site
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and go to:
   ```
   http://localhost:3000
   ```

### Building for Production

To create a production build:
```bash
npm run build
npm run start
```

## Project Structure

```
portfolio-site/
├── app/
│   ├── globals.css      # Global styles and custom CSS
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main portfolio page
├── components/
│   └── ui/
│       └── timeline.tsx # Animated timeline component
├── lib/
│   └── utils.ts         # Utility functions
├── public/              # Static assets
├── tailwind.config.ts   # Tailwind configuration
└── package.json         # Dependencies
```

## Features

- ✨ Smooth scroll animations with Framer Motion
- 🎨 Custom color scheme with warm accent colors
- 📱 Fully responsive design
- 🌙 Dark theme with subtle noise texture
- ⚡ Fast page loads with Next.js
- 🔤 Beautiful typography with Cormorant Garamond & Sora fonts

## Customization

### Changing Colors
Edit the `tailwind.config.ts` file to modify the accent colors:
```ts
accent: {
  DEFAULT: "#c77d4e",  // Main accent
  light: "#e8a673",    // Lighter variant
  dark: "#8b5a3c",     // Darker variant
}
```

### Updating Content
All content is in `app/page.tsx`. Update the:
- Hero section text
- Skills categories
- Timeline entries (experience & projects)
- Contact information

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

---

