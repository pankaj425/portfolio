# Pankaj Maddheshiya — Portfolio

A recruiter-focused portfolio for **Pankaj Maddheshiya**, an aspiring software developer
working with Java, Python, JavaScript, React and SQL.

The site is built with plain HTML, CSS and JavaScript. There is no build step and no
framework dependency, so it can be deployed directly to GitHub Pages.

## Sections

- **Hero** — introduction, availability, profile photo and resume download
- **About** — background, focus areas and quick facts
- **Skills** — languages, frontend, backend, databases, tools and CS fundamentals
- **Projects** — RecoveryAI, OrderFlow-AI, Real-Time Chat and Car Rental System
- **Internships** — Google AI-ML Virtual Internship and CodeSoft Full Stack internship
- **Education** — Galgotias University and school record, plus Smart India Hackathon 2025
- **Certifications** — GUVI/HCL, Oracle and NPTEL
- **Profiles** — GitHub, LinkedIn and a live list of recently updated repositories
- **Contact** — direct email, phone and a mailto contact form
- **Theme** — dark by default with a light-mode toggle

## Tech

- Semantic HTML5 and accessible landmarks
- Modern CSS (custom properties, grid, flexbox, light/dark themes, animations)
- Vanilla JavaScript (mobile navigation, scroll progress, active links, theme persistence,
  GitHub REST API integration and mailto form handling)
- Font Awesome and Google Fonts (Space Grotesk + Inter)
- SEO metadata, Open Graph image and JSON-LD Person schema

## Files

```text
index.html
app.css
script.js
favicon.svg
.nojekyll
assets/
  Pankaj_Maddheshiya_Resume.pdf
  profile.jpg
  og-image.jpg
```

## Run locally

Open `index.html` directly, or serve the folder:

```bash
npx serve .
```

## Deploy with GitHub Pages

1. Push the files to the `main` branch.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` and the `/ (root)` folder, then save.

The site is published at `https://pankaj425.github.io/portfolio/`.

## Content notes

- Resume content is based on the supplied PDF in `assets/Pankaj_Maddheshiya_Resume.pdf`.
- GitHub activity is loaded from the public GitHub REST API. If the API is unavailable or
  rate-limited, the featured repositories already in the HTML remain visible.
- The Car Rental System is an academic project; its source is available on request because
  no public repository URL was supplied.
- The contact form uses `mailto:` so it works without a backend. To collect submissions
  directly, connect a service such as Formspree or Getform.

## Contact

- Email: [maddheshiyap181@gmail.com](mailto:maddheshiyap181@gmail.com)
- LinkedIn: [pankaj-maddheshiya](https://www.linkedin.com/in/pankaj-maddheshiya/)
- GitHub: [@pankaj425](https://github.com/pankaj425)
