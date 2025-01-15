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

        try:
            # Lees de Excel-bestanden
            df = pd.read_excel(file_path)

            # Debug: Controleer of de kolomnamen overeenkomen
            print("Kolommen in Excel:", df.columns.tolist())

            # Controleer of de vereiste kolommen bestaan
            if 'Activiteit' not in df.columns or 'Raming' not in df.columns:
                print("Vereiste kolommen niet gevonden in het bestand.")
                return jsonify({'error': 'Vereiste kolommen niet gevonden in het bestand.'}), 400

            # Itereer door de rijen en voeg de gegevens toe
            for _, row in df.iterrows():
                all_data.append({
                    'name': row['Activiteit'],
                    'estimate': row['Raming']
                })
        except Exception as e:
            print("Fout bij het verwerken van het bestand:", e)
            return jsonify({'error': str(e)}), 500

    return jsonify({'activities': all_data})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
