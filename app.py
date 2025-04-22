from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from chess import Board


app = Flask(__name__)

socketio = SocketIO(app)
board = Board()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html', fen=board.fen())

@socketio.on('make_move')
def handle_move(data):
    move = data['move']
    try:
        board.push_san(move)
        emit('move_made', {'fen': board.fen()}, broadcast=True)
    except Exception as e:
        emit('invalid_move', {'error': str(e)})

if __name__ == '__main__':
    socketio.run(app, debug=True)
