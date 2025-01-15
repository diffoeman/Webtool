// Selecteer elementen
const uploadForm = document.getElementById('uploadForm');
const activitiesDiv = document.getElementById('activities');

// Formulierverzending
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('excelFile');
    const files = fileInput.files;

    if (files.length === 0) {
        alert('Selecteer minimaal één bestand.');
        return;
    }

    const formData = new FormData();
    for (const file of files) {
        formData.append('files', file);
    }

    try {
        const response = await fetch('https://webtool-backend.onrender.com/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            displayActivities(data.activities);
        } else {
            alert('Upload mislukt. Controleer de backend.');
        }
    } catch (error) {
        console.error('Fout bij het verzenden:', error);
        alert('Kon geen verbinding maken met de backend.');
    }
});

// Activiteiten weergeven
function displayActivities(activities) {
    activitiesDiv.innerHTML = ''; // Maak het leeg
    activities.forEach((activity, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p><strong>Activiteit:</strong> ${activity.name}</p>
            <p><strong>Raming:</strong> ${activity.estimate}</p>
            <button onclick="agree(${index})">Eens</button>
            <button onclick="disagree(${index})">Oneens</button>
            <textarea id="feedback-${index}" placeholder="Waarom ben je het oneens?"></textarea>
        `;
        activitiesDiv.appendChild(div);
    });
}

// Functie voor "Eens" knop
function agree(index) {
    alert(`Je bent het eens met activiteit ${index + 1}.`);
}

// Functie voor "Oneens" knop
function disagree(index) {
    const feedback = document.getElementById(`feedback-${index}`).value;
    if (feedback.trim() === '') {
        alert('Vul alsjeblieft een reden in waarom je het oneens bent.');
    } else {
        alert(`Bedankt voor je feedback: "${feedback}"`);
        document.getElementById(`feedback-${index}`).value = ''; // Maak het tekstvak leeg
    }
}
