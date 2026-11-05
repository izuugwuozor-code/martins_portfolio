// LOCAL DEMO ONLY. Replace demo auth/storage with Supabase Auth + database + Storage before hosting.
const STORAGE_KEY = "imPortfolioProjects";
const SESSION_KEY = "imPortfolioAdminDemo";
const DEMO_EMAIL = "admin@example.com";
const DEMO_PASSWORD = "ChangeMe123!";

const starterProjects = [
  {id:"starter-waw",title:"WAW Homepage Recreation",description:"A practice recreation of a product brand homepage, focusing on layout, navigation and responsive styling.",image:"",technologies:["HTML","CSS"],liveUrl:"",githubUrl:"",published:true,featured:true,createdAt:""},
  {id:"starter-portfolio",title:"Personal Portfolio",description:"A multi-page portfolio to introduce my skills, share projects and make it easy to get in touch.",image:"",technologies:["HTML","CSS","JavaScript"],liveUrl:"",githubUrl:"",published:true,featured:true,createdAt:""}
];
function loadProjects(){try{const saved=localStorage.getItem(STORAGE_KEY);return saved===null?starterProjects:JSON.parse(saved)}catch{return starterProjects}}
function saveProjects(projects){localStorage.setItem(STORAGE_KEY,JSON.stringify(projects))}
function escapeText(value=""){return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))}
function validWebUrl(value){if(!value)return true;try{return ["http:","https:"].includes(new URL(value).protocol)}catch{return false}}
function announce(message){const el=document.getElementById("dashboard-notice");if(el)el.textContent=message}

document.addEventListener("DOMContentLoaded",()=>{
  const loginForm=document.getElementById("login-form");
  if(loginForm){
    if(sessionStorage.getItem(SESSION_KEY)==="yes")location.href="dashboard.html";
    loginForm.addEventListener("submit",event=>{
      event.preventDefault();
      const email=document.getElementById("admin-email").value.trim();
      const password=document.getElementById("admin-password").value;
      const note=document.getElementById("login-notice");
      if(email===DEMO_EMAIL&&password===DEMO_PASSWORD){sessionStorage.setItem(SESSION_KEY,"yes");location.href="dashboard.html"}
      else note.textContent="Demo sign-in didn't match. For this prototype use admin@example.com and ChangeMe123! Do not use this on a live website.";
    });
  }
  const form=document.getElementById("project-form");
  if(!form)return;
  if(sessionStorage.getItem(SESSION_KEY)!=="yes"){location.href="login.html";return}
  const imageInput=document.getElementById("project-image");
  const preview=document.getElementById("image-preview");
  let currentImage="";
  imageInput.addEventListener("change",()=>{
    const file=imageInput.files[0];if(!file)return;
    if(!file.type.startsWith("image/")){announce("Please select an image file.");imageInput.value="";return}
    if(file.size>1.5*1024*1024){announce("This demo accepts images up to 1.5 MB. Compress the image and try again.");imageInput.value="";return}
    const reader=new FileReader();reader.onload=()=>{currentImage=reader.result;preview.innerHTML="";const img=document.createElement("img");img.src=currentImage;img.alt="Selected project preview";preview.append(img)};reader.readAsDataURL(file);
  });
  function resetForm(){form.reset();document.getElementById("project-id").value="";document.getElementById("form-title").textContent="Add a project";document.getElementById("save-project").textContent="Save project";document.getElementById("cancel-edit").hidden=true;currentImage="";preview.innerHTML="<span>Image preview</span>";announce("")}
  function renderList(){
    const list=document.getElementById("admin-project-list");list.innerHTML="";
    const projects=loadProjects();document.getElementById("admin-project-count").textContent=`${projects.length} project${projects.length===1?"":"s"}`;
    if(!projects.length){const p=document.createElement("p");p.className="notice";p.textContent="No projects yet. Add your first one using the form.";list.append(p);return}
    projects.forEach(project=>{
      const item=document.createElement("article");item.className="admin-project";
      if(project.image){const img=document.createElement("img");img.src=project.image;img.alt="";item.append(img)}else{const thumb=document.createElement("div");thumb.className="admin-thumb";thumb.textContent="IM.";item.append(thumb)}
      const content=document.createElement("div");
      const status=document.createElement("div");status.className="status-label";status.textContent=project.published?"PUBLISHED":"DRAFT";
      const title=document.createElement("h3");title.textContent=project.title;
      const desc=document.createElement("p");desc.textContent=project.description;
      const actions=document.createElement("div");actions.className="admin-project-actions";
      const edit=document.createElement("button");edit.textContent="Edit";edit.type="button";edit.addEventListener("click",()=>editProject(project.id));
      const toggle=document.createElement("button");toggle.textContent=project.published?"Unpublish":"Publish";toggle.type="button";toggle.addEventListener("click",()=>{saveProjects(loadProjects().map(p=>p.id===project.id?{...p,published:!p.published}:p));renderList();announce("Project visibility updated. Refresh the public projects page to see the change.")});
      const del=document.createElement("button");del.className="delete";del.textContent="Delete";del.type="button";del.addEventListener("click",()=>{if(confirm(`Delete "${project.title}"?`)){saveProjects(loadProjects().filter(p=>p.id!==project.id));renderList();announce("Project deleted.")}});
      actions.append(edit,toggle,del);content.append(status,title,desc,actions);item.append(content);list.append(item);
    });
  }
  function editProject(id){
    const project=loadProjects().find(p=>p.id===id);if(!project)return;
    document.getElementById("project-id").value=project.id;document.getElementById("project-title").value=project.title;document.getElementById("project-description").value=project.description;document.getElementById("project-technologies").value=(project.technologies||[]).join(", ");document.getElementById("project-live").value=project.liveUrl||"";document.getElementById("project-github").value=project.githubUrl||"";document.getElementById("project-published").checked=!!project.published;document.getElementById("project-featured").checked=!!project.featured;currentImage=project.image||"";
    preview.innerHTML="";if(currentImage){const img=document.createElement("img");img.src=currentImage;img.alt="Current project image";preview.append(img)}else preview.innerHTML="<span>No image selected</span>";
    document.getElementById("form-title").textContent="Edit project";document.getElementById("save-project").textContent="Update project";document.getElementById("cancel-edit").hidden=false;window.scrollTo({top:0,behavior:"smooth"});
  }
  form.addEventListener("submit",event=>{
    event.preventDefault();
    const title=document.getElementById("project-title").value.trim(),description=document.getElementById("project-description").value.trim(),liveUrl=document.getElementById("project-live").value.trim(),githubUrl=document.getElementById("project-github").value.trim();
    if(!validWebUrl(liveUrl)||!validWebUrl(githubUrl)){announce("Links must begin with http:// or https://.");return}
    const id=document.getElementById("project-id").value||`project-${Date.now()}`;
    const previous=loadProjects().find(p=>p.id===id);
    const project={id,title,description,image:currentImage||(previous&&previous.image)||"",technologies:document.getElementById("project-technologies").value.split(",").map(x=>x.trim()).filter(Boolean),liveUrl,githubUrl,published:document.getElementById("project-published").checked,featured:document.getElementById("project-featured").checked,createdAt:(previous&&previous.createdAt)||new Date().toISOString()};
    const projects=loadProjects();const index=projects.findIndex(p=>p.id===id);if(index>=0)projects[index]=project;else projects.unshift(project);
    try{saveProjects(projects);resetForm();renderList();announce("Saved in this browser. Refresh your portfolio page to preview it.");}catch{announce("Could not save. The screenshot may be too large for browser storage. Use a smaller image.");}
  });
  document.getElementById("cancel-edit").addEventListener("click",resetForm);
  document.getElementById("logout-button").addEventListener("click",()=>{sessionStorage.removeItem(SESSION_KEY);location.href="login.html"});
  document.getElementById("clear-projects").addEventListener("click",()=>{if(confirm("Reset the project list to the original demo projects?")){saveProjects(starterProjects);renderList();announce("Demo projects restored.")}});
  renderList();
});