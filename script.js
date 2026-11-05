// Shared interactions and project rendering for the portfolio.
document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelectorAll("[data-year]");
  year.forEach(el => el.textContent = new Date().getFullYear());

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".navigation");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    }));
  }

  // Demo projects are shown until you add your own in admin/dashboard.html.
  // Browser localStorage is for a local prototype only; it is not online shared storage.
  const starterProjects = [
    {id:"starter-waw",title:"WAW Homepage Recreation",description:"A practice recreation of a product brand homepage, focusing on layout, navigation and responsive styling.",image:"",technologies:["HTML","CSS"],liveUrl:"",githubUrl:"",published:true,featured:true,createdAt:""},
    {id:"starter-portfolio",title:"Personal Portfolio",description:"A multi-page portfolio to introduce my skills, share projects and make it easy to get in touch.",image:"",technologies:["HTML","CSS","JavaScript"],liveUrl:"",githubUrl:"",published:true,featured:true,createdAt:""}
  ];
  function getProjects() {
    try {
      const saved = localStorage.getItem("imPortfolioProjects");
      return saved === null ? starterProjects : JSON.parse(saved);
    } catch (e) { return starterProjects; }
  }
  function safeUrl(url) {
    if (!url) return "";
    try { const parsed = new URL(url, window.location.href); return ["http:","https:"].includes(parsed.protocol) ? parsed.href : ""; } catch { return ""; }
  }
  function projectCard(project) {
    const card = document.createElement("article");
    card.className = "project-card";
    const thumb = document.createElement("div"); thumb.className = "project-thumb";
    if (project.image) {
      const img = document.createElement("img"); img.src = project.image; img.alt = `${project.title} screenshot`; img.loading = "lazy";
      img.onerror = () => { img.remove(); const fallback = document.createElement("div"); fallback.className = "thumb-placeholder"; fallback.textContent = "IM."; thumb.append(fallback); };
      thumb.append(img);
    } else {
      const fallback = document.createElement("div"); fallback.className = "thumb-placeholder"; fallback.textContent = "IM."; thumb.append(fallback);
    }
    const body = document.createElement("div"); body.className = "project-body";
    const meta = document.createElement("div"); meta.className = "project-meta"; meta.textContent = (project.technologies || []).join(" / ") || "WEB PROJECT";
    const title = document.createElement("h3"); title.textContent = project.title;
    const description = document.createElement("p"); description.textContent = project.description;
    const tags = document.createElement("div"); tags.className = "project-tags";
    (project.technologies || []).forEach(tool => { const tag = document.createElement("span"); tag.textContent = tool; tags.append(tag); });
    const links = document.createElement("div"); links.className = "project-card-links";
    const live = safeUrl(project.liveUrl), github = safeUrl(project.githubUrl);
    if (live) { const a = document.createElement("a"); a.href = live; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = "View live project ↗"; links.append(a); }
    if (github) { const a = document.createElement("a"); a.href = github; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = "Source code ↗"; links.append(a); }
    body.append(meta,title,description,tags);
    if (links.childElementCount) body.append(links);
    card.append(thumb,body); return card;
  }
  const projects = getProjects().filter(p => p.published);
  const all = document.getElementById("all-projects");
  const featured = document.getElementById("featured-projects");
  const empty = document.getElementById("empty-projects");
  if (all) {
    projects.forEach(p => all.append(projectCard(p)));
    if (!projects.length && empty) empty.hidden = false;
    const count = document.getElementById("project-count");
    if (count) count.textContent = `${projects.length} PROJECT${projects.length === 1 ? "" : "S"}`;
  }
  if (featured) {
    const chosen = projects.filter(p => p.featured).slice(0,3);
    (chosen.length ? chosen : projects.slice(0,3)).forEach(p => featured.append(projectCard(p)));
    if (!projects.length) {
      const message = document.createElement("p"); message.className = "form-note"; message.textContent = "Your featured projects will appear here after you add them in the dashboard."; featured.append(message);
    }
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    // Replace this address with your real email before using the form.
    window.location.href = `mailto:YOUR_EMAIL@example.com?subject=${subject}&body=${body}`;
  });
});