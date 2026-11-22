# M.A. Rakib Sarker — Personal Portfolio Hub V3.1

A responsive website designed around **Academia, Technology and Administration**, written in my first-person voice. To preview, open `index.html` in a modern browser. For testing forms and paths, use a local HTTP server (`python -m http.server 8000`) and browse `http://localhost:8000/`.

## What's included
- Nine main sections, a downloadable latest CV, professional portrait and light/dark switch.
- Complete professional and leadership timelines with bullet points.
- Research statuses updated using the uploaded November 2026 CV.
- Credential filters: Academics (public exams / degree documents), Academic Recognitions, Training, Competitions, Mentoring, Leadership & Service.
- Photo journal: six entries initially, with a *See more* button, full-size gallery dialog and multiple photographs per journal.
- Responsive layouts, accessibility labels, keyboard navigation and social/contact links.

## Academic credential scans
The SSC/HSC/B.Sc. entries currently have **deliberate placeholders**, not fabricated certificates. To add an image, put a `.webp`/`.jpg` file into `assets/certificates/` and update the corresponding item in `data.js`, e.g. `image:'my-ssc.webp'`. Ensure names match exactly.

## Adding photo journals
In `data.js`, add a new object to `journals` with `title`, `category`, `date`, `description`, and `images` (file names within `assets/journey/`). Optional `captions` supports descriptive labels. The first six journal records are featured; the others appear behind **See more**. Order the records newest first.

## Updating projects and research
Add/edit `projects` in `data.js`. Research and experience HTML are in `index.html`; update statuses carefully, separating **accepted for presentation** from **published**, and add verified DOI/publisher links only when issued.

## Contact form — setup, testing, and activation
The page contains a contact form that sends through the third-party [FormSubmit](https://formsubmit.co/documentation) service to `marakibsarker2001@gmail.com` using `https://formsubmit.co/ajax/marakibsarker2001@gmail.com`. This is **not an email server** included with the ZIP. Sending depends on an internet connection and the provider being available.

1. **Publish the site** on a web host such as GitHub Pages or Netlify, then open its `https://...` URL. Clicking `index.html` directly (`file://...`) is **not a valid test** for FormSubmit. The site detects local previews and instead prepares a message through the visitor's own email app, which they must send manually.
2. Fill the form on the hosted site with your own test details and click **Send message**. A *new* FormSubmit recipient receives a **one-time activation message** at `marakibsarker2001@gmail.com`. Check the inbox, Promotions, and Spam/Junk folders. Follow the link in that activation message.
3. After activating, submit a second test form using the hosted website and **confirm the test message arrives in your inbox**. If it doesn't, check spam, network console, and [FormSubmit's official help](https://formsubmit.co/help). Make no assumptions about delivery based only on the on-page success text.
4. Once activated, visitors should be able to submit directly from your hosted website without needing to open an email app. The form provides in-page progress and errors; failed submissions retain the visitor's text. There is also an **Email me directly** link.

Important: no test form submission was sent while generating this package, and the recipient's activation state is unknown. A successful API acceptance is **not proof** that the email reached the inbox. The form uses a third-party processor; do not request passwords or other sensitive data. For more dependable transactional delivery, a dedicated server-side email endpoint would be needed.

## Publishing
You can deploy this folder to GitHub Pages, Netlify or another static host. Connect a domain after verifying images, project links and research metadata.

## Privacy/quality checklist
- Only publish personal details you are comfortable displaying to the public (especially the phone number).
- Replace any portfolio-derived certificate with a high-resolution original when available.
- Supply verified GitHub/Scholar/ORCID profiles; no unverified profile URLs have been added.
- Review all dates and status changes before publishing.
- Optimize new image uploads and add descriptive alt text/captions.

## V3.2 Layout Fix

Fixed the research/publications status label overlapping the article text by reserving enough space for the badge at desktop widths and stacking it under the publication text on smaller screens. All V3.1 contact functionality and content remains intact.

## V3.3 mobile responsive fix

V3.3 fixes the homepage hero on phones and small tablets. An earlier desktop CSS override caused the text and photo to remain side-by-side at narrow widths; the new final media queries stack the introduction, buttons, and portrait vertically. The floating cards are placed below the portrait on phones so they cannot cover the person's face. All existing content, research and certificates, contact form, and desktop design are otherwise unchanged.

To update your existing Netlify site, upload the **entire unzipped `rakib-portfolio-hub-v3-3` folder** from your project's **Deploys** section; do not create a new project. After it finishes, refresh the live page in your phone browser. If old styles appear, reload without cache or try a private tab.
