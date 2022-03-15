function clone_matrix(base_matrix) {
    const new_matrix = [];

    for (let i = 0; i < base_matrix.length; i++) {
        const matrix_row = [];

        for (let j = 0; j < base_matrix[i].length; j++) {
            matrix_row.push(base_matrix[i][j]);
        }

        new_matrix.push(matrix_row);
    }

    return new_matrix;
}

function get_matrix_empty_position(matrix) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (matrix[i][j] == null) return [i, j];
        }
    }
}

function matrix_equals(x, y) {
    for (let i = 0; i < x.length; i++) {
        for (let j = 0; j < x[i].length; j++) {
            if (x[i][j] != y[i][j]) return false;
        }
    }

    return true;
}

function calc_heuristic(current_state, goal_state) {
    let heuristic = 0;

    for (let i = 0; i < goal_state.length; i++) {
        for (let j = 0; j < goal_state[i].length; j++) {
            if (goal_state[i][j] == null) continue;

            if (goal_state[i][j] != current_state[i][j]) heuristic++;
        }
    }

    return heuristic;
}

function move(matrix, x, y) {
    const empty_position = get_matrix_empty_position(matrix);
    if (
        (empty_position[0] + x) > 2 || (empty_position[1] + y) > 2 ||
        (empty_position[0] + x) < 0 || (empty_position[1] + y) < 0
    ) return null;

    const result = clone_matrix(matrix);
    result[empty_position[0]][empty_position[1]] = matrix[empty_position[0] + x][empty_position[1] + y];
    result[empty_position[0] + x][empty_position[1] + y] = matrix[empty_position[0]][empty_position[1]];
    return result;
}

function check_matrix_node_has_generate_in_list(matrix, list) {
    for (let i in list) {
        if (matrix_equals(matrix, list[i].matrix)) return Number(i);
    }

    return -1;
}

class NodeTree {

    static root_build(initial_state, goal_state) {
        return new NodeTree(null, null, 0, calc_heuristic(initial_state, goal_state), initial_state, goal_state);
    }

    constructor(parent_node, parent_move, level, heuristic, matrix, goal_matrix) {
        this.parent_node = parent_node;
        this.parent_move = parent_move;
        this.level = level;
        this.heuristic = heuristic;
        this.total = level + heuristic;
        this.matrix = matrix;
        this.goal_matrix = goal_matrix;
    }

    generate_children() {
        const children = [];

        const moves = [
            [0,1], // right
            [0, -1], // left
            [1, 0], // down
            [-1, 0] // up
        ];

        for (let i in moves) {
            const child = move(this.matrix, moves[i][0], moves[i][1]);
            if (child != null) {
                children.push(new NodeTree(
                    this, 
                    moves[i],
                    this.level + 1, 
                    calc_heuristic(child, this.goal_matrix),
                    child,
                    this.goal_matrix
                ));
            }
        }

        return children;
    }
}

function run_puzzle(initial_state, goal_state) {

    let opened = [NodeTree.root_build(initial_state, goal_state)];
    let closed = [];
    let goal_node = null;
    
    while (opened.length > 0) {
        const current = opened[0];
        opened = opened.slice(1);
    
        if (matrix_equals(current.matrix, current.goal_matrix)) {
            goal_node = current;
            break;
        }
    
        const children = current.generate_children();
        for (let i in children) {
            const opened_position = check_matrix_node_has_generate_in_list(children[i].matrix, opened);
            const in_opened = opened_position != -1;
    
            const closed_position = check_matrix_node_has_generate_in_list(children[i].matrix, closed);
            const in_closed = closed_position != -1;
    
            if (!in_opened && !in_closed) {
                opened.push(children[i]);
            }
    
            if (in_opened) {
                if (children[i].level < opened[opened_position].level) {
                    opened[opened_position] = children[i];
                }
            }
    
            if (in_closed) {
                if (children[i].level < closed[closed_position].level) {
                    closed = [...closed.slice(0, closed_position), ...closed.slice(closed_position + 1)];
                    opened.push(children[i]);
                }
            }
    
        }
    
        opened = opened.sort((x, y) => (x.total > y.total) ? 1 : -1);
        closed.push(current);
    }
    
    if (goal_node != null) {
    
        let steps = [];
        let current_node = goal_node;
        while (current_node != null) {
            steps = [current_node, ...steps];
            current_node = current_node.parent_node;
        }
    
        count_steps = 0;
        let exec_step = () => {
            render_puzzle(steps[count_steps].matrix);
    
            count_steps++;
            if (count_steps == steps.length) return;
    
            execute_move_animation(
                [
                    steps[count_steps].parent_move[0] * -1,
                    steps[count_steps].parent_move[1] * -1
                ],
                [
                    get_matrix_empty_position(steps[count_steps - 1].matrix)[0] + steps[count_steps].parent_move[0],
                    get_matrix_empty_position(steps[count_steps - 1].matrix)[1] + steps[count_steps].parent_move[1]
                ], 
                () => {
                    exec_step();
                }
            );
        }
    
        exec_step();
    
    } else {
        console.log("NÃO ENCONTRADO");
    }
}

// const initial_state = [
//     [2, 8, 3],
//     [1, 6, 4],
//     [7, null, 5]
// ];

// const goal_state = [
//     [1, 2, 3],
//     [null, 8, 4],
//     [7, 6, 5]
// ];

// run_puzzle(initial_state, goal_state);
