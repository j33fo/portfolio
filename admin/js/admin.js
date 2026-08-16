(function () {
  const els = {};
  let state = {
    projects: [],
    apps: [],
    signups: [],
    labs: [],
    opensource: [],
    writeups: []
  };

  function el(id) {
    return document.getElementById(id);
  }

  function showDashboard(show) {
    el("login-section").classList.toggle("hidden", show);
    el("dashboard").classList.toggle("hidden", !show);
    el("logout-btn").classList.toggle("hidden", !show);
  }

  function setLoginError(message) {
    const node = el("login-error");
    node.textContent = message;
    node.classList.remove("hidden");
  }

  function clearLoginError() {
    const node = el("login-error");
    node.textContent = "";
    node.classList.add("hidden");
  }

  function resetProjectForm() {
    el("project-id").value = "";
    el("project-name").value = "";
    el("project-category").value = "";
    el("project-icon").value = "";
    el("project-live").value = "";
    el("project-github").value = "";
    el("project-tags").value = "";
    el("project-sort").value = "";
    el("project-description").value = "";
  }

  function resetLabForm() {
    el("lab-id").value = "";
    el("lab-title").value = "";
    el("lab-description").value = "";
    el("lab-icon").value = "fas fa-flask";
    el("lab-status").value = "active";
    el("lab-tags").value = "";
    el("lab-sort").value = "";
  }

  function resetOpenSourceForm() {
    el("opensource-id").value = "";
    el("opensource-name").value = "";
    el("opensource-description").value = "";
    el("opensource-language").value = "";
    el("opensource-stars").value = "";
    el("opensource-github").value = "";
    el("opensource-sort").value = "";
  }

  function resetWriteupForm() {
    el("writeup-id").value = "";
    el("writeup-title").value = "";
    el("writeup-date").value = "";
    el("writeup-read-time").value = "";
    el("writeup-summary").value = "";
    el("writeup-tags").value = "";
    el("writeup-link").value = "";
  }

  function resetAppForm() {
    el("app-id").value = "";
    el("app-name").value = "";
  }

  function renderProjects() {
    el("projects-count").textContent = String(state.projects.length);
    el("projects-list").innerHTML = state.projects.length
      ? state.projects.map((project) => `
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-gray-700 rounded-lg p-4 bg-secondary/30">
            <div>
              <p class="font-semibold">${project.name}</p>
              <p class="text-sm text-gray-400">${project.category}</p>
            </div>
            <div class="flex gap-2">
              <button data-edit-project="${project.id}" class="px-3 py-2 rounded border border-gray-700 text-sm hover:border-accent hover:text-accent transition">Edit</button>
              <button data-delete-project="${project.id}" class="px-3 py-2 rounded border border-red-500 text-red-400 text-sm hover:bg-red-500/10 transition">Delete</button>
            </div>
          </div>
        `).join("")
      : `<p class="text-gray-400 text-sm">No projects yet.</p>`;
  }

  function renderLabs() {
    el("labs-count").textContent = String(state.labs.length);
    el("labs-list").innerHTML = state.labs.length
      ? state.labs.map((lab) => `
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-gray-700 rounded-lg p-4 bg-secondary/30">
            <div>
              <p class="font-semibold">${lab.title}</p>
              <p class="text-sm text-gray-400">${lab.status === 'in_progress' ? 'In Progress' : lab.status === 'active' ? 'Active' : 'Planned'}</p>
            </div>
            <div class="flex gap-2">
              <button data-edit-lab="${lab.id}" class="px-3 py-2 rounded border border-gray-700 text-sm hover:border-accent hover:text-accent transition">Edit</button>
              <button data-delete-lab="${lab.id}" class="px-3 py-2 rounded border border-red-500 text-red-400 text-sm hover:bg-red-500/10 transition">Delete</button>
            </div>
          </div>
        `).join("")
      : `<p class="text-gray-400 text-sm">No labs yet.</p>`;
  }

  function renderOpenSource() {
    el("opensource-count").textContent = String(state.opensource.length);
    el("opensource-list").innerHTML = state.opensource.length
      ? state.opensource.map((os) => `
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-gray-700 rounded-lg p-4 bg-secondary/30">
            <div>
              <p class="font-semibold">${os.name}</p>
              <p class="text-sm text-gray-400">${os.language} • ⭐ ${os.stars}</p>
            </div>
            <div class="flex gap-2">
              <button data-edit-opensource="${os.id}" class="px-3 py-2 rounded border border-gray-700 text-sm hover:border-accent hover:text-accent transition">Edit</button>
              <button data-delete-opensource="${os.id}" class="px-3 py-2 rounded border border-red-500 text-red-400 text-sm hover:bg-red-500/10 transition">Delete</button>
            </div>
          </div>
        `).join("")
      : `<p class="text-gray-400 text-sm">No open source projects yet.</p>`;
  }

  function renderWriteups() {
    el("writeups-count").textContent = String(state.writeups.length);
    el("writeups-list").innerHTML = state.writeups.length
      ? state.writeups.map((writeup) => `
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-gray-700 rounded-lg p-4 bg-secondary/30">
            <div>
              <p class="font-semibold">${writeup.title}</p>
              <p class="text-sm text-gray-400">${writeup.date ? new Date(writeup.date).toLocaleDateString() : ""} • ${writeup.readTime || 0} min read</p>
            </div>
            <div class="flex gap-2">
              <button data-edit-writeup="${writeup.id}" class="px-3 py-2 rounded border border-gray-700 text-sm hover:border-accent hover:text-accent transition">Edit</button>
              <button data-delete-writeup="${writeup.id}" class="px-3 py-2 rounded border border-red-500 text-red-400 text-sm hover:bg-red-500/10 transition">Delete</button>
            </div>
          </div>
        `).join("")
      : `<p class="text-gray-400 text-sm">No writeups yet.</p>`;
  }

  function renderApps() {
    el("apps-count").textContent = String(state.apps.length);
    el("apps-list").innerHTML = state.apps.length
      ? state.apps.map((app) => `
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-gray-700 rounded-lg p-4 bg-secondary/30">
            <div>
              <p class="font-semibold">${app.name}</p>
              <p class="text-sm text-gray-400">${app.id}</p>
            </div>
            <div class="flex gap-2">
              <button data-edit-app="${app.id}" class="px-3 py-2 rounded border border-gray-700 text-sm hover:border-accent hover:text-accent transition">Edit</button>
              <button data-delete-app="${app.id}" class="px-3 py-2 rounded border border-red-500 text-red-400 text-sm hover:bg-red-500/10 transition">Delete</button>
            </div>
          </div>
        `).join("")
      : `<p class="text-gray-400 text-sm">No apps yet.</p>`;
  }

  function renderSignups() {
    el("signups-count").textContent = String(state.signups.length);
    el("signups-list").innerHTML = state.signups.length
      ? `<div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="text-left text-gray-400">
              <tr>
                <th class="py-2 pr-4">Email</th>
                <th class="py-2 pr-4">App</th>
                <th class="py-2 pr-4">Status</th>
                <th class="py-2 pr-4">Created</th>
              </tr>
            </thead>
            <tbody>
              ${state.signups.map((row) => `
                <tr class="border-t border-gray-800">
                  <td class="py-2 pr-4 font-mono text-xs">${row.email}</td>
                  <td class="py-2 pr-4">${row.app_id}</td>
                  <td class="py-2 pr-4">
                    <span class="text-xs px-2 py-0.5 rounded ${
                      row.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      row.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }">${row.status || "pending"}</span>
                  </td>
                  <td class="py-2 pr-4 text-xs text-gray-500">${new Date(row.created_at).toLocaleString()}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>`
      : `<p class="text-gray-400 text-sm text-center py-4">No beta signups yet.</p>`;
  }

  async function loadDashboard() {
    await PortfolioData.requireAdmin();

    const [projects, apps, signups, status, labs, opensource, writeups] = await Promise.all([
      PortfolioData.loadProjects(),
      PortfolioData.loadApps(),
      PortfolioData.loadBetaSignups(),
      PortfolioData.loadStatus(),
      PortfolioData.loadLabs(),
      PortfolioData.loadOpenSource(),
      PortfolioData.loadWriteups()
    ]);

    state.projects = projects;
    state.apps = apps;
    state.signups = signups;
    state.labs = labs;
    state.opensource = opensource;
    state.writeups = writeups;

    el("status-current-title").value = status.current.title || "";
    el("status-current-description").value = status.current.description || "";
    el("status-next-title").value = status.next.title || "";
    el("status-next-description").value = status.next.description || "";
    el("status-updates").value = JSON.stringify(status.updates || [], null, 2);

    renderProjects();
    renderLabs();
    renderOpenSource();
    renderWriteups();
    renderApps();
    renderSignups();
  }

  function setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.dataset.tab;

        tabButtons.forEach((b) => {
          b.classList.remove("active", "border-accent", "text-accent");
          b.classList.add("border-transparent", "text-gray-400");
        });

        btn.classList.add("active", "border-accent", "text-accent");
        btn.classList.remove("border-transparent", "text-gray-400");

        tabContents.forEach((content) => {
          content.classList.toggle("hidden", content.id !== `tab-content-${targetTab}`);
        });
      });
    });
  }

  async function bootstrap() {
    if (!PortfolioData.hasConfig()) {
      setLoginError("Supabase config is missing. Set js/supabase-config.js first.");
      return;
    }

    const session = await PortfolioData.getSession();
    if (session) {
      showDashboard(true);
      await loadDashboard();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupTabs();
    els.loginForm = el("login-form");

    el("login-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      clearLoginError();
      const email = el("email").value.trim();
      const password = el("password").value;

      try {
        await PortfolioData.signIn(email, password);
        showDashboard(true);
        await loadDashboard();
      } catch (error) {
        setLoginError(error.message || "Login failed.");
      }
    });

    el("logout-btn").addEventListener("click", async () => {
      await PortfolioData.signOut();
      showDashboard(false);
    });

    // Projects Form Handler
    el("project-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const project = {
        id: el("project-id").value.trim() || `project-${Date.now()}`,
        name: el("project-name").value.trim(),
        category: el("project-category").value.trim(),
        icon: el("project-icon").value.trim() || "fas fa-code",
        links: {
          live: el("project-live").value.trim(),
          github: el("project-github").value.trim()
        },
        tags: el("project-tags").value.split(",").map((item) => item.trim()).filter(Boolean),
        sort_order: Number(el("project-sort").value || 0),
        description: el("project-description").value.trim()
      };

      await PortfolioData.saveProject(project);
      resetProjectForm();
      await loadDashboard();
    });

    el("project-reset").addEventListener("click", resetProjectForm);
    el("new-project-btn").addEventListener("click", resetProjectForm);

    // Labs Form Handler
    el("lab-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const lab = {
        id: el("lab-id").value.trim() || `lab-${Date.now()}`,
        title: el("lab-title").value.trim(),
        status: el("lab-status").value,
        icon: el("lab-icon").value.trim() || "fas fa-flask",
        tags: el("lab-tags").value.split(",").map((item) => item.trim()).filter(Boolean),
        sort_order: Number(el("lab-sort").value || 0),
        description: el("lab-description").value.trim()
      };

      await PortfolioData.saveLab(lab);
      resetLabForm();
      await loadDashboard();
    });

    el("lab-reset").addEventListener("click", resetLabForm);
    el("new-lab-btn").addEventListener("click", resetLabForm);

    // Open Source Form Handler
    el("opensource-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const os = {
        id: el("opensource-id").value.trim() || `os-${Date.now()}`,
        name: el("opensource-name").value.trim(),
        language: el("opensource-language").value.trim(),
        stars: Number(el("opensource-stars").value || 0),
        github: el("opensource-github").value.trim(),
        sort_order: Number(el("opensource-sort").value || 0),
        description: el("opensource-description").value.trim()
      };

      await PortfolioData.saveOpenSource(os);
      resetOpenSourceForm();
      await loadDashboard();
    });

    el("opensource-reset").addEventListener("click", resetOpenSourceForm);
    el("new-opensource-btn").addEventListener("click", resetOpenSourceForm);

    // Writeups Form Handler
    el("writeup-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const writeup = {
        id: el("writeup-id").value.trim() || `article-${Date.now()}`,
        title: el("writeup-title").value.trim(),
        date: el("writeup-date").value,
        read_time: Number(el("writeup-read-time").value || 0),
        link: el("writeup-link").value.trim() || "#",
        tags: el("writeup-tags").value.split(",").map((item) => item.trim()).filter(Boolean),
        summary: el("writeup-summary").value.trim()
      };

      await PortfolioData.saveWriteup(writeup);
      resetWriteupForm();
      await loadDashboard();
    });

    el("writeup-reset").addEventListener("click", resetWriteupForm);
    el("new-writeup-btn").addEventListener("click", resetWriteupForm);

    // Apps Form Handler
    el("app-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const app = {
        id: el("app-id").value.trim() || el("app-name").value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: el("app-name").value.trim()
      };
      await PortfolioData.saveApp(app);
      resetAppForm();
      await loadDashboard();
    });

    el("app-reset").addEventListener("click", resetAppForm);
    el("new-app-btn").addEventListener("click", resetAppForm);

    // Save Status Handler
    el("save-status-btn").addEventListener("click", async () => {
      const updatesRaw = el("status-updates").value.trim();
      let updates = [];
      if (updatesRaw) {
        try {
          updates = JSON.parse(updatesRaw);
        } catch (e) {
          alert("Invalid updates JSON array format: " + e.message);
          return;
        }
      }
      await PortfolioData.saveStatus({
        current: {
          title: el("status-current-title").value.trim(),
          description: el("status-current-description").value.trim()
        },
        next: {
          title: el("status-next-title").value.trim(),
          description: el("status-next-description").value.trim()
        },
        updates
      });
      alert("Status saved successfully!");
      await loadDashboard();
    });

    el("refresh-signups-btn").addEventListener("click", loadDashboard);

    // Global Click Delegation
    document.body.addEventListener("click", async (event) => {
      const editProject = event.target.closest("[data-edit-project]");
      const deleteProject = event.target.closest("[data-delete-project]");
      const editApp = event.target.closest("[data-edit-app]");
      const deleteApp = event.target.closest("[data-delete-app]");
      const editLab = event.target.closest("[data-edit-lab]");
      const deleteLab = event.target.closest("[data-delete-lab]");
      const editOpenSource = event.target.closest("[data-edit-opensource]");
      const deleteOpenSource = event.target.closest("[data-delete-opensource]");
      const editWriteup = event.target.closest("[data-edit-writeup]");
      const deleteWriteup = event.target.closest("[data-delete-writeup]");

      if (editProject) {
        const project = state.projects.find((item) => item.id === editProject.dataset.editProject);
        if (!project) return;
        el("project-id").value = project.id;
        el("project-name").value = project.name;
        el("project-category").value = project.category;
        el("project-icon").value = project.icon;
        el("project-live").value = project.links.live || "";
        el("project-github").value = project.links.github || "";
        el("project-tags").value = (project.tags || []).join(", ");
        el("project-sort").value = project.sort_order || 0;
        el("project-description").value = project.description;
        document.querySelector('[data-tab="projects"]').click();
      }

      if (deleteProject) {
        if (confirm("Are you sure you want to delete this project?")) {
          await PortfolioData.deleteProject(deleteProject.dataset.deleteProject);
          await loadDashboard();
        }
      }

      if (editApp) {
        const app = state.apps.find((item) => item.id === editApp.dataset.editApp);
        if (!app) return;
        el("app-id").value = app.id;
        el("app-name").value = app.name;
        document.querySelector('[data-tab="apps"]').click();
      }

      if (deleteApp) {
        if (confirm("Are you sure you want to delete this app?")) {
          await PortfolioData.deleteApp(deleteApp.dataset.deleteApp);
          await loadDashboard();
        }
      }

      if (editLab) {
        const lab = state.labs.find((item) => item.id === editLab.dataset.editLab);
        if (!lab) return;
        el("lab-id").value = lab.id;
        el("lab-title").value = lab.title;
        el("lab-status").value = lab.status;
        el("lab-icon").value = lab.icon || "fas fa-flask";
        el("lab-tags").value = (lab.tags || []).join(", ");
        el("lab-sort").value = lab.sort_order || 0;
        el("lab-description").value = lab.description;
        document.querySelector('[data-tab="labs"]').click();
      }

      if (deleteLab) {
        if (confirm("Are you sure you want to delete this lab experiment?")) {
          await PortfolioData.deleteLab(deleteLab.dataset.deleteLab);
          await loadDashboard();
        }
      }

      if (editOpenSource) {
        const os = state.opensource.find((item) => item.id === editOpenSource.dataset.editOpensource);
        if (!os) return;
        el("opensource-id").value = os.id;
        el("opensource-name").value = os.name;
        el("opensource-language").value = os.language;
        el("opensource-stars").value = os.stars || 0;
        el("opensource-github").value = os.github || "";
        el("opensource-sort").value = os.sort_order || 0;
        el("opensource-description").value = os.description;
        document.querySelector('[data-tab="opensource"]').click();
      }

      if (deleteOpenSource) {
        if (confirm("Are you sure you want to delete this open source project?")) {
          await PortfolioData.deleteOpenSource(deleteOpenSource.dataset.deleteOpensource);
          await loadDashboard();
        }
      }

      if (editWriteup) {
        const writeup = state.writeups.find((item) => item.id === editWriteup.dataset.editWriteup);
        if (!writeup) return;
        el("writeup-id").value = writeup.id;
        el("writeup-title").value = writeup.title;
        el("writeup-date").value = writeup.date || "";
        el("writeup-read-time").value = writeup.readTime || 0;
        el("writeup-link").value = writeup.link || "#";
        el("writeup-tags").value = (writeup.tags || []).join(", ");
        el("writeup-summary").value = writeup.summary;
        document.querySelector('[data-tab="writeups"]').click();
      }

      if (deleteWriteup) {
        if (confirm("Are you sure you want to delete this writeup?")) {
          await PortfolioData.deleteWriteup(deleteWriteup.dataset.deleteWriteup);
          await loadDashboard();
        }
      }
    });

    bootstrap().catch((error) => {
      setLoginError(error.message || "Unable to load admin.");
    });
  });
})();
