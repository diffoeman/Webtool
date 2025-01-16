document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');

    if (!username && window.location.pathname.includes('index.html')) {
        alert('Je bent niet ingelogd. Je wordt doorgestuurd naar de inlogpagina.');
        window.location.href = 'login.html';
    } else if (username) {
        const welcomeMessage = document.createElement('h2');
        welcomeMessage.textContent = `Welkom, ${username}!`;
        document.body.prepend(welcomeMessage);
    }
});

// Registratie formulier
if (window.location.pathname.includes('register.html')) {
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        const response = await fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Registratie succesvol! Je kunt nu inloggen.');
            window.location.href = 'login.html';
        } else {
            alert(result.error || 'Er is iets misgegaan.');
        }
    });
}

// Login formulier
if (window.location.pathname.includes('login.html')) {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('username', username); // Sla de naam op
            alert('Inloggen succesvol!');
            window.location.href = 'index.html';
        } else {
            alert(result.error || 'Inloggen mislukt.');
        }
    });
}

// Feedback versturen
async function disagree(index) {
    const username = localStorage.getItem('username');
    const feedback = document.getElementById(`feedback-${index}`).value;
    const activityName = document.querySelectorAll('.activity-name')[index].textContent;

    if (!feedback.trim()) {
        alert('Vul alsjeblieft je feedback in.');
        return;
    }

    const response = await fetch('http://127.0.0.1:5000/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, feedback, activity: activityName }),
    });

    if (response.ok) {
        alert(`Bedankt, ${username}, voor je feedback!`);
        document.getElementById(`feedback-${index}`).value = ''; // Leeg het tekstvak
    } else {
        alert('Feedback verzenden mislukt.');
    }
}
