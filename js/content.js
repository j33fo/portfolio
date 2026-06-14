// ============================================
// Content Loader - Loads JSON data and renders
// ============================================

async function loadJSON(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON:', error);
        return null;
    }
}

// ============================================
// Render Projects
// ============================================

async function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    const data = await loadJSON('data/projects.json');
    if (!data || !data.projects) return;

    container.innerHTML = data.projects.map(project => `
        <div class="app-card p-6 rounded-lg">
            <div class="flex justify-between items-start mb-4">
                <div class="text-3xl text-accent">
                    <i class="${project.icon}"></i>
                </div>
                <span class="text-xs bg-accent/20 text-accent px-2 py-1 rounded">${project.category}</span>
            </div>
            <h3 class="text-xl font-bold mb-2">${project.name}</h3>
            <p class="text-gray-400 text-sm mb-4">${project.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${project.tags.map(tag => `<span class="text-xs bg-accent/10 text-accent px-2 py-1 rounded">${tag}</span>`).join('')}
            </div>
            <div class="flex gap-2">
                ${project.links.github ? `<a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="text-xs text-accent hover:text-green-400 transition flex items-center gap-1">
                    <i class="fab fa-github"></i> Code
                </a>` : ''}
                ${project.links.live ? `<a href="${project.links.live}" target="_blank" rel="noopener noreferrer" class="text-xs text-accent hover:text-green-400 transition flex items-center gap-1">
                    <i class="fas fa-link"></i> Live
                </a>` : ''}
            </div>
        </div>
    `).join('');
}

// ============================================
// Render Labs
// ============================================

async function renderLabs() {
    const container = document.getElementById('labs-container');
    if (!container) return;

    const data = await loadJSON('data/labs.json');
    if (!data || !data.labs) return;

    container.innerHTML = data.labs.map(lab => `
        <div class="blog-post p-6 rounded-lg">
            <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-bold flex items-center gap-2">
                    <i class="${lab.icon} text-accent"></i> ${lab.title}
                </h3>
                <span class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">${lab.status === 'in_progress' ? 'In Progress' : 'Active'}</span>
            </div>
            <p class="text-gray-400 mb-3 text-sm">
                ${lab.description}
            </p>
            <div class="flex gap-2 text-xs">
                ${lab.tags.map(tag => `<span class="text-accent">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// ============================================
// Render Open Source
// ============================================

async function renderOpenSource() {
    const container = document.getElementById('opensource-container');
    if (!container) return;

    const data = await loadJSON('data/opensource.json');
    if (!data || !data.opensource) return;

    container.innerHTML = data.opensource.map(project => `
        <div class="app-card p-6 rounded-lg">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-bold">${project.name}</h3>
                <span class="text-xs text-accent">⭐ ${project.stars}</span>
            </div>
            <p class="text-gray-400 text-sm mb-4">${project.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                <span class="text-xs bg-accent/10 text-accent px-2 py-1 rounded">${project.language}</span>
            </div>
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="text-accent text-sm hover:text-green-400 transition flex items-center gap-2">
                <i class="fab fa-github"></i> View on GitHub
            </a>
        </div>
    `).join('');
}

// ============================================
// Render Writeups
// ============================================

async function renderWriteups() {
    const container = document.getElementById('writeups-container');
    if (!container) return;

    const data = await loadJSON('data/writeups.json');
    if (!data || !data.writeups) return;

    container.innerHTML = data.writeups.map(article => `
        <article class="blog-post p-6 rounded-lg">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="text-lg font-bold">${article.title}</h3>
                    <p class="text-xs text-gray-500 mt-1">${article.readTime} min read</p>
                </div>
                <span class="text-xs text-gray-500">${new Date(article.date).toLocaleDateString()}</span>
            </div>
            <p class="text-gray-400 mb-4">
                ${article.summary}
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${article.tags.map(tag => `<span class="text-xs text-accent">${tag}</span>`).join('')}
            </div>
            <a href="${article.link}" class="text-accent text-sm hover:text-green-400 transition flex items-center gap-2">
                Read Article <i class="fas fa-arrow-right"></i>
            </a>
        </article>
    `).join('');
}

// ============================================
// Render Status
// ============================================

async function renderStatus() {
    const container = document.getElementById('status-container');
    if (!container) return;

    const data = await loadJSON('data/status.json');
    if (!data || !data.status) return;

    const status = data.status;
    container.innerHTML = `
        <div class="bg-secondary/50 border border-accent/30 rounded-lg p-6">
            <div class="flex items-start justify-between mb-3">
                <h3 class="font-bold text-lg">${status.current.title}</h3>
                <span class="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Active</span>
            </div>
            <p class="text-gray-400 text-sm">
                ${status.current.description}
            </p>
        </div>
        
        <div class="bg-secondary/50 border border-gray-700 rounded-lg p-6">
            <div class="flex items-start justify-between mb-3">
                <h3 class="font-bold text-lg">${status.next.title}</h3>
                <span class="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Planned</span>
            </div>
            <p class="text-gray-400 text-sm">
                ${status.next.description}
            </p>
        </div>
        
        <div class="space-y-3 pt-4">
            <p class="text-gray-400 text-sm">
                <strong>Latest updates:</strong>
            </p>
            <ul class="space-y-2 text-sm text-gray-400">
                ${status.updates.map(update => `
                    <li>• <span class="text-accent">${update.project}</span> - ${update.update}</li>
                `).join('')}
            </ul>
        </div>
    `;
}

// ============================================
// Initialize All Content
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    renderLabs();
    renderOpenSource();
    renderWriteups();
    renderStatus();
});
