<<<<<<< HEAD
# myblog
=======
# Gabriel's Portfolio

A modern, modular portfolio website showcasing projects, experiments, open source work, and technical writeups.

**Live Site:** https://j33fo.github.io/portfolio

## 📁 Project Structure

```
portfolio/
├── index.html              # Homepage with section previews
├── projects.html           # Full projects page
├── labs.html               # Full labs/experiments page
├── opensource.html         # Full open source page
├── writeups.html           # Full articles/writeups page
├── status.html             # Current work & updates page
├── css/
│   └── styles.css          # Custom styles
├── js/
│   ├── main.js             # Navigation & interactions
│   ├── content.js          # Homepage content loader
│   └── pages.js            # Individual page content loader
├── data/
│   ├── projects.json       # Projects data
│   ├── labs.json           # Labs/experiments data
│   ├── opensource.json     # Open source projects data
│   ├── writeups.json       # Articles/writeups data
│   └── status.json         # Current work & updates data
└── README.md               # This file
```

## 🚀 Quick Start

### Run Locally

```bash
cd portfolio
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser.

**Why a web server?** The site uses `fetch()` to load JSON files, which requires HTTP (not `file://`).

### Update Content

All content is stored in JSON files in `/data/`. Simply edit the JSON files and refresh your browser.

## 📝 Adding Content

### Add a Project

Edit `data/projects.json`:

```json
{
  "id": "unique-id",
  "name": "Project Name",
  "description": "Brief description",
  "icon": "fas fa-icon-name",
  "category": "Web App",
  "tags": ["React", "Node.js"],
  "links": {
    "github": "https://github.com/...",
    "live": "https://example.com"
  }
}
```

### Add a Lab/Experiment

Edit `data/labs.json`:

```json
{
  "id": "unique-id",
  "title": "Lab Title",
  "description": "What you're experimenting with",
  "icon": "fas fa-brain",
  "status": "in_progress",
  "tags": ["#tag1", "#tag2"]
}
```

### Add an Open Source Project

Edit `data/opensource.json`:

```json
{
  "id": "unique-id",
  "name": "Project Name",
  "description": "What it does",
  "language": "Python",
  "stars": 42,
  "github": "https://github.com/..."
}
```

### Add a Writeup/Article

Edit `data/writeups.json`:

```json
{
  "id": "unique-id",
  "title": "Article Title",
  "date": "2026-06-14",
  "readTime": 5,
  "summary": "Brief summary of the article",
  "tags": ["#tech", "#learning"],
  "link": "#"
}
```

### Update Status

Edit `data/status.json`:

```json
{
  "status": {
    "current": {
      "title": "Currently Working On",
      "description": "What you're working on now..."
    },
    "next": {
      "title": "Up Next",
      "description": "What's planned..."
    },
    "updates": [
      {
        "project": "Project Name",
        "update": "What changed",
        "date": "2026-06-14"
      }
    ]
  }
}
```

## 🎨 Customize

### Colors

Edit `index.html` and search for the Tailwind config. The accent color is `#10b981` (green). Change it to customize the theme.

### Styles

Edit `css/styles.css` for custom styling.

### Navigation

The navigation appears on every page. It's defined in each HTML file's `<header>` section.

## 📱 Features

- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Dark Theme** - Modern dark UI with accent colors
- ✅ **Data-Driven** - All content from JSON files
- ✅ **Fast Loading** - Lightweight, no build step needed
- ✅ **Section Pages** - Each section gets its own dedicated page
- ✅ **Homepage Preview** - Shows highlights with "See All" links

## 🔧 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Styling:** Tailwind CSS
- **Icons:** Font Awesome
- **Data:** JSON files
- **Hosting:** GitHub Pages

## 📦 Deployment

### First Time Setup

1. Create a GitHub repo: `https://github.com/j33fo/portfolio`
2. Initialize git locally (already done)
3. Push to GitHub:
   ```bash
   git remote add origin https://github.com/j33fo/portfolio.git
   git branch -M main
   git push -u origin main
   ```
4. Enable GitHub Pages:
   - Go to repo **Settings → Pages**
   - Select `main` branch as source
   - Save

Your site will be live at: `https://j33fo.github.io/portfolio`

### Update Existing Site

After making changes locally:

```bash
git add -A
git commit -m "Update projects"
git push
```

Changes appear on GitHub Pages within minutes.

## 🚀 Make It Your Personal Site

**Want the URL `https://j33fo.github.io` instead?**

Rename the repo to `j33fo.github.io` and it'll automatically deploy to that URL.

## 📄 File Sizes

- **Total:** ~60 KB (uncompressed)
- **HTML:** ~25 KB
- **CSS:** ~3 KB
- **JavaScript:** ~15 KB
- **Data:** ~5 KB

## 🐛 Troubleshooting

**Projects not showing on homepage?**
- Make sure you're running through a web server (`python3 -m http.server`)
- Check browser console for errors (F12)
- Verify JSON file format is valid

**Styles looking weird?**
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache

**Push to GitHub failing?**
- Check you have a valid Personal Access Token
- Ensure repo exists at `https://github.com/j33fo/portfolio`

## 📚 Learn More

- [Tailwind CSS Docs](https://tailwindcss.com)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [GitHub Pages Guide](https://pages.github.com)

---

**Made with AI & curiosity.** 🚀

Made with help from Copilot.
>>>>>>> 6886737 (Add comprehensive README with setup and usage instructions)
