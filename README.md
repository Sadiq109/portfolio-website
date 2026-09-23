# My portfolio website

I'm Sadiq Mohamud, a University of Minnesota Twin Cities student pursuing a BA in Computer Science and a BAS in IT Infrastructure. This is my personal portfolio.

Live site: https://sadiq109.github.io/portfolio-website/

## What's in it

- An animated hero with a canvas particle network and a typing effect
- A sticky glass navbar that highlights the section you're reading, plus a scroll progress bar
- Scroll-reveal animations and count-up stats
- A skills grid and an experience timeline
- Project cards with 3D hover tilt, tech tags and category filters
- A light/dark theme toggle that remembers your choice
- A mobile menu and responsive layout
- Respects `prefers-reduced-motion`, and the content stays visible if JavaScript is off

## How it's built

Plain HTML, CSS and JavaScript with no frameworks or build step:

- `index.html` - page structure and content
- `styles.css` - theme variables, layout, animations and responsive rules
- `script.js` - theme toggle, nav, reveal, typing, filters, tilt and particles
- `favicon.svg` - site icon

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

GitHub Pages deploys it from the `main` branch.
