# Izuchukwu Martins Portfolio

A multi-page, dark-and-gold portfolio starter with HTML, CSS and JavaScript.

## Pages
- `index.html` — home
- `about.html` — about
- `projects.html` — public project gallery
- `skills.html` — skills
- `contact.html` — contact form (opens an email app)
- `admin/login.html` and `admin/dashboard.html` — local dashboard prototype

## Open it
1. Extract the ZIP.
2. Open the `izuchukwu-portfolio` folder in VS Code.
3. Run `index.html` with Live Server.

## Add your portrait
Place your image at `images/izuchukwu.png`. If your file has a different name or extension, update the image path in `index.html`.

## Try the dashboard prototype
Open `admin/login.html` with Live Server.
Demo login:
- Email: `admin@example.com`
- Password: `ChangeMe123!`

Then add project details and a screenshot. Projects are stored in this browser's localStorage, and `projects.html` reads that same localStorage.

## Important limitations
This is a frontend prototype, not a secure production upload system. localStorage is tied to the browser/device and is not shared with public visitors or other devices. The demo password is visible in JavaScript and is NOT real security. Do not deploy the admin dashboard as a real private dashboard until it uses server-backed authentication and access controls.

For live publishing, connect Supabase:
1. Use Supabase Auth for real sign-in.
2. Create a `projects` table with `id`, `title`, `description`, `image_url`, `technologies`, `live_url`, `github_url`, `published`, `featured`, `created_at`.
3. Enable Row Level Security. Allow public `SELECT` only for published rows; allow insert/update/delete only for your authenticated admin user.
4. Create a Storage bucket for project screenshots and policies that only let the authenticated admin upload/delete.
5. Replace localStorage calls in `admin/admin.js` and `script.js` with Supabase queries and Storage uploads.
6. Deploy the static pages to a host. A static site alone cannot securely protect admin operations without backend policies.

Before publishing, replace `YOUR_EMAIL@example.com` and the sample GitHub links with your own details.


## Latest visual updates
- The Home page now contains only the home hero, portrait, and continuously moving technology strip.
- “Beginner Frontend Web Developer” is gold. The portrait frame is straight and has no white border.
- The About page includes the same portrait from `images/izuchukwu.png`. Replace that file to use a different photo.
- Skills bars show HTML 95%, CSS 90%, JavaScript 85%, and Responsive Design 80% in gold.
- The technology strip scrolls continuously and slowly; users with reduced-motion preferences are respected.
# waw_project_clone
