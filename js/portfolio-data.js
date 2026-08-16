(function () {
  const config = window.PORTFOLIO_SUPABASE || {};
  const hasConfig = () => Boolean(config.url && config.anonKey && window.supabase?.createClient);

  let client = null;

  function getClient() {
    if (!hasConfig()) return null;
    if (!client) {
      client = window.supabase.createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    }
    return client;
  }

  async function fetchJson(path, fallback = {}) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
      }
      return await response.json();
    } catch (e) {
      console.warn(`Fallback fetch failed for ${path}:`, e);
      return fallback;
    }
  }

  function toArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch (_) {
        return value
          .split(/[,|\n]/)
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }
    return [];
  }

  function normalizeStatusLabel(status) {
    if (status === "in_progress") return "in_progress";
    if (status === "active") return "active";
    if (status === "planned") return "planned";
    return status || "active";
  }

  function normalizeProject(row) {
    return {
      id: row.id,
      name: row.name || "",
      description: row.description || "",
      icon: row.icon || "fas fa-code",
      category: row.category || "Project",
      tags: toArray(row.tags),
      links: {
        github: row.github_url || row.github || "",
        live: row.live_url || row.live || ""
      }
    };
  }

  function normalizeLab(row) {
    return {
      id: row.id,
      title: row.title || "",
      description: row.description || "",
      icon: row.icon || "fas fa-flask",
      status: normalizeStatusLabel(row.status),
      tags: toArray(row.tags)
    };
  }

  function normalizeOpenSource(row) {
    return {
      id: row.id,
      name: row.name || "",
      description: row.description || "",
      language: row.language || "",
      stars: row.stars || 0,
      github: row.github_url || row.github || ""
    };
  }

  function normalizeWriteup(row) {
    return {
      id: row.id,
      title: row.title || "",
      date: row.date || row.published_at || "",
      readTime: row.read_time || row.readTime || 0,
      summary: row.summary || "",
      tags: toArray(row.tags),
      link: row.link || ""
    };
  }

  function normalizeStatus(row) {
    if (!row) {
      return {
        current: { title: "", description: "" },
        next: { title: "", description: "" },
        updates: []
      };
    }

    return {
      current: {
        title: row.current_title || row.currentTitle || "",
        description: row.current_description || row.currentDescription || ""
      },
      next: {
        title: row.next_title || row.nextTitle || "",
        description: row.next_description || row.nextDescription || ""
      },
      updates: toArray(row.updates)
    };
  }

  async function loadProjects() {
    const client = getClient();
    if (client) {
      const { data, error } = await client
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error && data) return data.map(normalizeProject);
    }

    const data = await fetchJson("data/projects.json", { projects: [] });
    return (data.projects || []).map(normalizeProject);
  }

  async function loadLabs() {
    const client = getClient();
    if (client) {
      const { data, error } = await client
        .from("labs")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error && data) return data.map(normalizeLab);
    }

    const data = await fetchJson("data/labs.json", { labs: [] });
    return (data.labs || []).map(normalizeLab);
  }

  async function loadOpenSource() {
    const client = getClient();
    if (client) {
      const { data, error } = await client
        .from("opensource")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error && data) return data.map(normalizeOpenSource);
    }

    const data = await fetchJson("data/opensource.json", { opensource: [] });
    return (data.opensource || []).map(normalizeOpenSource);
  }

  async function loadWriteups() {
    const client = getClient();
    if (client) {
      const { data, error } = await client
        .from("writeups")
        .select("*")
        .order("published_at", { ascending: false });
      if (!error && data) return data.map(normalizeWriteup);
    }

    const data = await fetchJson("data/writeups.json", { writeups: [] });
    return (data.writeups || []).map(normalizeWriteup);
  }

  async function loadStatus() {
    const client = getClient();
    if (client) {
      const { data, error } = await client
        .from("site_status")
        .select("*")
        .eq("id", "main")
        .maybeSingle();
      if (!error && data) return normalizeStatus(data);
    }

    const data = await fetchJson("data/status.json", { status: null });
    return normalizeStatus(data.status);
  }

  async function loadApps() {
    const client = getClient();
    if (client) {
      const { data, error } = await client
        .from("apps")
        .select("*")
        .order("name", { ascending: true });
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          name: row.name
        }));
      }
    }

    const data = await fetchJson("data/apps.json", []);
    return Array.isArray(data) ? data : [];
  }

  async function loadBetaSignups() {
    const client = getClient();
    if (!client) return [];

    const { data, error } = await client
      .from("beta_signups")
      .select("id,email,app_id,status,created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async function addBetaSignup(email, appId) {
    const client = getClient();
    if (!client) {
      throw new Error("Supabase is not configured yet.");
    }

    const { error } = await client.from("beta_signups").insert({
      email,
      app_id: appId,
      status: "pending"
    });

    if (error) throw error;
  }

  async function signIn(email, password) {
    const client = getClient();
    if (!client) throw new Error("Supabase is not configured yet.");
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const client = getClient();
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) throw error;
  }

  async function getSession() {
    const client = getClient();
    if (!client) return null;
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async function getAdminProfile() {
    const client = getClient();
    if (!client) return null;
    const session = await getSession();
    if (!session) return null;

    const { data, error } = await client
      .from("profiles")
      .select("id,email,role")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async function requireAdmin() {
    const profile = await getAdminProfile();
    if (!profile || profile.role !== "admin") {
      throw new Error("Admin access required.");
    }
    return profile;
  }

  function toDbTags(tags) {
    return Array.isArray(tags) ? tags : toArray(tags);
  }

  async function saveProject(project) {
    const client = getClient();
    if (!client) throw new Error("Supabase is not configured yet.");
    const payload = {
      id: project.id,
      name: project.name,
      description: project.description,
      icon: project.icon,
      category: project.category,
      tags: toDbTags(project.tags),
      github_url: project.links?.github || "",
      live_url: project.links?.live || "",
      sort_order: Number(project.sort_order || 0),
      featured: Boolean(project.featured)
    };
    const { error } = await client.from("projects").upsert(payload);
    if (error) throw error;
  }

  async function deleteProject(id) {
    const client = getClient();
    if (!client) throw new Error("Supabase is not configured yet.");
    const { error } = await client.from("projects").delete().eq("id", id);
    if (error) throw error;
  }

  async function saveApp(app) {
    const client = getClient();
    if (!client) throw new Error("Supabase is not configured yet.");
    const { error } = await client.from("apps").upsert({
      id: app.id,
      name: app.name
    });
    if (error) throw error;
  }

  async function deleteApp(id) {
    const client = getClient();
    if (!client) throw new Error("Supabase is not configured yet.");
    const { error } = await client.from("apps").delete().eq("id", id);
    if (error) throw error;
  }

  async function saveStatus(status) {
    const client = getClient();
    if (!client) throw new Error("Supabase is not configured yet.");
    const { error } = await client.from("site_status").upsert({
      id: "main",
      current_title: status.current.title,
      current_description: status.current.description,
      next_title: status.next.title,
      next_description: status.next.description,
      updates: status.updates || []
    });
    if (error) throw error;
  }

  async function saveLab(lab) {
    const client = getClient();
    if (!client) throw new Error("Supabase is not configured yet.");
    const payload = {
      id: lab.id,
      title: lab.title,
      description: lab.description,
      icon: lab.icon,
      status: lab.status,
      tags: toDbTags(lab.tags),
      sort_order: Number(lab.sort_order || 0)
    };
    const { error } = await client.from("labs").upsert(payload);
    if (error) throw error;
  }

  async function deleteLab(id) {
    const client = getClient();
    if (!client) throw new Error("Supabase is not configured yet.");
    const { error } = await client.from("labs").delete().eq("id", id);
    if (error) throw error;
  }

  async function saveOpenSource(os) {
    const client = getClient();
    if (!client) throw new Error("Supabase is not configured yet.");
    const payload = {
      id: os.id,
      name: os.name,
      description: os.description,
      language: os.language,
      stars: Number(os.stars || 0),
      github_url: os.github_url || os.github || "",
      sort_order: Number(os.sort_order || 0)
    };
    const { error } = await client.from("opensource").upsert(payload);
    if (error) throw error;
  }

  async function deleteOpenSource(id) {
    const client = getClient();
    if (!client) throw new Error("Supabase is not configured yet.");
    const { error } = await client.from("opensource").delete().eq("id", id);
    if (error) throw error;
  }

  async function saveWriteup(writeup) {
    const client = getClient();
    if (!client) throw new Error("Supabase is not configured yet.");
    const payload = {
      id: writeup.id,
      title: writeup.title,
      published_at: writeup.published_at || writeup.date || new Date().toISOString(),
      date: writeup.date || new Date().toISOString().split('T')[0],
      read_time: Number(writeup.read_time || writeup.readTime || 0),
      summary: writeup.summary,
      tags: toDbTags(writeup.tags),
      link: writeup.link || ""
    };
    const { error } = await client.from("writeups").upsert(payload);
    if (error) throw error;
  }

  async function deleteWriteup(id) {
    const client = getClient();
    if (!client) throw new Error("Supabase is not configured yet.");
    const { error } = await client.from("writeups").delete().eq("id", id);
    if (error) throw error;
  }

  window.PortfolioData = {
    hasConfig,
    loadProjects,
    loadLabs,
    loadOpenSource,
    loadWriteups,
    loadStatus,
    loadApps,
    loadBetaSignups,
    addBetaSignup,
    signIn,
    signOut,
    getSession,
    getAdminProfile,
    requireAdmin,
    saveProject,
    deleteProject,
    saveApp,
    deleteApp,
    saveStatus,
    saveLab,
    deleteLab,
    saveOpenSource,
    deleteOpenSource,
    saveWriteup,
    deleteWriteup
  };
})();
