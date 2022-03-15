
const initial_state = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

const goal_state = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

let current_puzzle_state_selected = 0;
const current_puzzle_position_selected = [0, 0];
const puzzles_to_select = [initial_state, goal_state];
const puzzles_values_selecteds = [[], []];

const allow_keys = ["1", "2", "3", "4", "5", "6", "7", "8", " "];
document.addEventListener("keydown", (event) => {
    if (current_puzzle_state_selected > 1) return;

    const { key } = event;
    if (allow_keys.indexOf(key) == -1) return;

    const matrix_value = (key == " ") ? null : Number(key);
    if (puzzles_values_selecteds[current_puzzle_state_selected].indexOf(matrix_value) != -1) return;
    puzzles_to_select[current_puzzle_state_selected][current_puzzle_position_selected[0]][current_puzzle_position_selected[1]] = matrix_value;
    puzzles_values_selecteds[current_puzzle_state_selected].push(matrix_value);

    const tile = document.getElementById(current_puzzle_state_selected + "-puzzle-tile-" + current_puzzle_position_selected[0] + "-" + current_puzzle_position_selected[1]);
    if (matrix_value != null) tile.classList.remove('tile-empty');
    
    const tileText = document.createElement("p");
    tileText.innerHTML = matrix_value;
    tile.innerHTML = '';
    tile.appendChild(tileText);

    current_puzzle_position_selected[1]++;
    if (current_puzzle_position_selected[1] > 2) {
        current_puzzle_position_selected[0]++;
        current_puzzle_position_selected[1] = 0;
    }
    if (current_puzzle_position_selected[0] > 2) {
        current_puzzle_position_selected[0] = 0;
        current_puzzle_state_selected++;
    }

})

function check_matrix_valid(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if(matrix[i][j] == "") return false;
        }
    }

    return true;
}

document.getElementById("puzzle-start-game").onclick = () => {
    if (!check_matrix_valid(initial_state) || !check_matrix_valid(goal_state)) {
        alert("COMPLETE TODOS OS ESTADOS ANTES DE INICIAR");
        return;
    }

    const app = document.getElementById("app");
    app.innerHTML = "";

    const loading_text = document.createElement("p");
    loading_text.innerHTML = "CARREGANDO...";
    app.appendChild(loading_text);

    run_puzzle(initial_state, goal_state, () => {
        app.innerHTML = "";

        const puzzle = document.createElement("div");
        puzzle.id = "puzzle";
        puzzle.classList.add("puzzle");

        app.appendChild(puzzle);
    }, () => {
        app.innerHTML = "";

        const not_found_text = document.createElement("p");
        not_found_text.innerHTML = "NÃO FOI POSSÍVEL ENCONTRAR UMA SOLUÇÃO";
        app.appendChild(not_found_text);
    });
};