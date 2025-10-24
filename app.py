from flask import Flask, jsonify, request
from models import db, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Create database tables
with app.app_context():
    db.create_all()

# ---------- API Endpoints ----------

# Get all users
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

# Get single user by ID
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify(user.to_dict())
    return jsonify({"error": "User not found"}), 404

# Create new user
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    name = data.get('name')
    balance = data.get('card_balance', 0.0)
    user = User(name=name, card_balance=balance)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

# Update user balance (simulate fare deduction or top-up)
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_balance(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    data = request.get_json()
    if "card_balance" in data:
        user.card_balance = data["card_balance"]
    db.session.commit()
    return jsonify(user.to_dict())

# Delete user
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"})

# Fare deduction example (simulate ride)
@app.route('/users/<int:user_id>/deduct_fare', methods=['POST'])
def deduct_fare(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    data = request.get_json()
    fare = data.get('fare', 0)
    if user.card_balance < fare:
        return jsonify({"error": "Insufficient balance"}), 400
    user.card_balance -= fare
    db.session.commit()
    return jsonify({"message": f"Fare {fare} deducted", "new_balance": user.card_balance})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
