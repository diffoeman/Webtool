import os
import bcrypt
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Schakel CORS in voor frontend communicatie

users = {}  # Simpele opslag voor gebruikers (naam als sleutel, wachtwoordhash als waarde)
feedback_data = []  # Lijst om feedback op te slaan

@app.route('/')
def home():
    return "Backend werkt!"

# Registreren
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Naam en wachtwoord zijn verplicht.'}), 400

    if username in users:
        return jsonify({'error': 'Gebruiker bestaat al.'}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    users[username] = hashed_pw
    return jsonify({'message': 'Registratie succesvol!'}), 200

# Inloggen
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if username not in users:
        return jsonify({'error': 'Gebruiker niet gevonden.'}), 404

    hashed_pw = users[username]
    if bcrypt.checkpw(password.encode('utf-8'), hashed_pw):
        return jsonify({'message': 'Inloggen succesvol!'}), 200
    else:
        return jsonify({'error': 'Onjuist wachtwoord.'}), 401

# Feedback versturen
@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    username = data.get('username')
    feedback = data.get('feedback')
    activity = data.get('activity')

    if not username or not feedback or not activity:
        return jsonify({'error': 'Alle velden zijn verplicht!'}), 400

    feedback_data.append({
        'username': username,
        'feedback': feedback,
        'activity': activity
    })
    return jsonify({'message': 'Feedback opgeslagen!'}), 200

# Feedback ophalen
@app.route('/get-feedback', methods=['GET'])
def get_feedback():
    return jsonify(feedback_data), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
