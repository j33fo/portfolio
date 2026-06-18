// Load apps dropdown
async function loadApps() {
    try {
        const response = await fetch('data/apps.json');
        const apps = await response.json();
        const appSelect = document.getElementById('app');
        
        apps.forEach(app => {
            const option = document.createElement('option');
            option.value = app.id;
            option.textContent = app.name;
            appSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading apps:', error);
    }
}

// Handle form submission
document.getElementById('beta-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const app = document.getElementById('app').value;
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoader = document.getElementById('btn-loader');
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');
    
    // Hide messages
    successMsg.classList.add('hidden');
    errorMsg.classList.add('hidden');
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    
    try {
        // Replace with your Google Apps Script Web App URL
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbw0u4rRvfRp9SkWu5-6QVBKDF8EN7Wla3sNP8TZbMGa8B0hPr9XEwIfWpXSX0PiQzfU/exec';
        
        const response = await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: new FormData(document.getElementById('beta-form'))
        });
        
        // Show success message
        successMsg.classList.remove('hidden');
        
        // Reset form
        document.getElementById('beta-form').reset();
        
        // Reload apps dropdown
        await loadApps();
        
        // Scroll to success message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Error submitting form:', error);
        document.getElementById('error-text').textContent = 'Failed to submit. Please try again or contact support.';
        errorMsg.classList.remove('hidden');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
});

// Load apps when page loads
document.addEventListener('DOMContentLoaded', loadApps);
