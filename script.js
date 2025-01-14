// Selecteer knoppen en tekstvak
const agreeBtn = document.getElementById('agreeBtn');
const disagreeBtn = document.getElementById('disagreeBtn');
const feedbackBox = document.getElementById('feedback');

// Eventlistener voor "Eens" knop
agreeBtn.addEventListener('click', () => {
    alert('Bedankt voor je akkoord!');
});

// Eventlistener voor "Oneens" knop
disagreeBtn.addEventListener('click', () => {
    const feedback = feedbackBox.value;
    if (feedback.trim() === '') {
        alert('Vul alsjeblieft een reden in waarom je het oneens bent.');
    } else {
        alert(`Bedankt voor je feedback: "${feedback}"`);
        feedbackBox.value = ''; // Leeg het tekstvak na invoer
    }
})
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

    // Stuur bestanden naar de backend
    const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        const data = await response.json();
        displayActivities(data.activities);
    } else {
        alert('Upload mislukt. Probeer opnieuw.');
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

// Knopfunctionaliteit
function agree(index) {
    alert(`Je bent het eens met activiteit ${index + 1}.`);
}

function disagree(index) {
    const feedback = document.getElementById(`feedback-${index}`).value;
    alert(`Feedback voor activiteit ${index + 1}: ${feedback}`);
}
;
