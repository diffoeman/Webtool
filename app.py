import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Zorg dat CORS correct is ingesteld
app.config['UPLOAD_FOLDER'] = 'uploads'

# Zorg dat de uploadmap bestaat
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/')
def home():
    return "Backend werkt!"

@app.route('/upload', methods=['POST'])
def upload_files():
    files = request.files.getlist('files')
    all_data = []

    for file in files:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        # Lees de Excel-bestanden
        try:
            df = pd.read_excel(file_path)

            # Debug: Controleer of de kolomnamen overeenkomen
            print("Kolommen in Excel:", df.columns)

            for _, row in df.iterrows():
                all_data.append({
                    'name': row['Activiteit'] if 'Activiteit' in df.columns else 'Onbekend',
                    'estimate': row['Raming'] if 'Raming' in df.columns else 'Geen raming'
                })
        except Exception as e:
            print("Fout bij het verwerken van het bestand:", e)

    return jsonify({'activities': all_data})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
