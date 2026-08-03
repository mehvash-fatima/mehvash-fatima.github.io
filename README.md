PORTFOLIO SITE — HOSTING NOTES
================================

Files in this folder:
  index.html                    → home page (start here)
  case-study-01-dspm.html
  case-study-02-copilot.html
  case-study-03-priva.html
  case-study-04-babylon.html

Everything is self-contained — all images are embedded directly in
each HTML file, so there are no separate image/asset folders to
worry about. Just keep all 5 files together in the same folder;
the navigation and "next/previous project" links reference each
other by filename.

TO HOST:
Any static hosting service works, since this is plain HTML/CSS/JS
with no build step or server required. A few easy free options:

  • Netlify Drop — netlify.com/drop
    Drag this whole folder onto the page. Done in seconds.

  • GitHub Pages
    Push these files to a GitHub repo, then enable Pages in the
    repo settings (Settings → Pages → Deploy from branch).

  • Vercel — vercel.com
    Drag-and-drop deploy, similar to Netlify.

Before going live, remember to replace the placeholder contact
details:
  - "[email]" (appears in the hero icons and the footer)
  - "[linkedin url]" (appears in the hero icon and the footer)

Search-and-replace across all 5 files, or open each one in a text
editor and update manually.
