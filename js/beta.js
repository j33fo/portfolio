async function loadApps() {
    try {
        const apps = window.PortfolioData ? await window.PortfolioData.loadApps() : [];
        const appSelect = document.getElementById('app');
        appSelect.innerHTML = '<option value="">-- Choose an app --</option>';
        
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
        if (window.PortfolioData && window.PortfolioData.hasConfig()) {
            await window.PortfolioData.addBetaSignup(email, app);
        } else {
            const scriptUrl = 'https://script.google.com/macros/s/AKfycbw0u4rRvfRp9SkWu5-6QVBKDF8EN7Wla3sNP8TZbMGa8B0hPr9XEwIfWpXSX0PiQzfU/exec';
            await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: new FormData(document.getElementById('beta-form'))
            });
        }

        successMsg.classList.remove('hidden');
        document.getElementById('beta-form').reset();
        await loadApps();
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

document.addEventListener('DOMContentLoaded', loadApps);
