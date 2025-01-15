import os
import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Zorg dat de upload-map bestaat
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Testroute
@app.route('/')
def home():
    return "Backend werkt!"

# Route voor het uploaden van bestanden
@app.route('/upload', methods=['POST'])
def upload_files():
    files = request.files.getlist('files')  # Ontvang meerdere bestanden
    all_data = []  # Lijst voor samengevoegde data

    for file in files:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)  # Sla het bestand lokaal op

        # Lees de Excel-bestanden
        df = pd.read_excel(file_path)

        # Debug: print de kolomnamen
        print("Kolommen in Excel:", df.columns)

        for _, row in df.iterrows():
            all_data.append({
                'name': row.get('Activiteit', 'Onbekend'),  # Controleer de kolomnaam
                'estimate': row.get('Raming', 'Geen raming')  # Controleer de kolomnaam
            })

    return jsonify({'activities': all_data})  # Stuur de data terug naar de frontend

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
