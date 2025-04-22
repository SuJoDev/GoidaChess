const socket = io();
const boardDiv = document.getElementById("board");
const moveForm = document.getElementById("moveForm");
const moveInput = document.getElementById("moveInput");

let game = new Chess(initialFen);
let board = Chessboard('board', {
    position: initialFen,
    pieceTheme: '/static/img/chesspieces/wikipedia/{piece}.png',
    draggable: true,
    onDrop: onDrop
});

function onDrop(source, target, piece, newPos, oldPos, orientation) {
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // автоматически превращаем в ферзя
    });

    if (move === null) {
        return 'snapback'; // откатить, если ход некорректный
    }

    // если ход возможен — отправляем его на сервер
    socket.emit("make_move", { move: move.san });
}

// Синхронизация после перемещения
socket.on("move_made", function (data) {
    game.load(data.fen);
    board.position(data.fen);
});

// Если сервер сказал, что ход неверный — откатываем
socket.on("invalid_move", function (data) {
    alert("Неверный ход: " + data.error);
    board.position(game.fen()); // откатить доску
});
