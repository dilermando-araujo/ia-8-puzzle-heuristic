
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

render_puzzle(initial_state);