
function render_puzzle(matrix) {

    const puzzle = document.getElementById("puzzle");
    puzzle.innerHTML = "";

    for (let i = 0; i < matrix.length; i++) {

        const tileRowHtmlElement = document.createElement("div");
        tileRowHtmlElement.classList.add("puzzle-row");

        for(let j = 0; j < matrix[i].length; j++) {
            const tileHtmlElement = document.createElement("div");

            tileHtmlElement.classList.add("tile");
            tileHtmlElement.id = "puzzle-tile-" + ((i * 3) + j);

            if (matrix[i][j] == null) tileHtmlElement.classList.add("tile-empty");

            const tileTextHtmlElement = document.createElement("p");
            tileTextHtmlElement.innerHTML = matrix[i][j];

            tileHtmlElement.appendChild(tileTextHtmlElement);
            tileRowHtmlElement.appendChild(tileHtmlElement);
        }

        puzzle.appendChild(tileRowHtmlElement);

    }
}

function execute_move_animation(move, tile_position, onAnimationEnd) {
    let className = "";

    if (move[0] == -1 && move[1] == 0) className = "move-up";
    if (move[0] == 1 && move[1] == 0) className = "move-down";
    if (move[0] == 0 && move[1] == -1) className = "move-left";
    if (move[0] == 0 && move[1] == 1) className = "move-right";

    let tileHtmlElement = document.getElementById("puzzle-tile-" + ((tile_position[0] * 3) + tile_position[1]));
    tileHtmlElement.classList.add(className);

    tileHtmlElement.addEventListener('animationend', () => {
        tileHtmlElement.removeEventListener('animationend', this);
        tileHtmlElement.classList.remove(className);

        if (typeof onAnimationEnd == "function") onAnimationEnd();
    });
}
