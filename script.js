class chessMoves {
    #boardNavigator; //image of array of 64 cells by field 8*8
    #boardState; //Store is cell active or not
    #elemField;
    #elemCell = 'field__cell';
    #elemCellLight = 'field__cell--light';
    #elemCellDark = 'field__cell--dark';
    #elemToggle = 'field__cell--active';

    constructor(domElement, cssForToggle) {
        this.#boardNavigator = this.#initModels();
        this.#boardState = this.#initModels(false);
        this.#elemField = domElement;
        this.#domDrawField(this.#elemField);
    }

    /*заполняет доску значениями из параметра либо порядковыми номерами, если параметр не указан*/

    /*fill board by content of param, or index number if param are not present*/
    #initModels(valueToFill) {
        let board = [];
        for (let i = 0, index = 0; i < 8; i++) {
            let row = [];
            for (let j = 0; j < 8; j++) {
                row = [...row, (typeof valueToFill !== "undefined") ? valueToFill : index++];
            }
            board = [...board, row];
        }
        return board;
    }

    #domDrawField(targetArea) {
        targetArea.textContent = '';
        let cellBlack = true;
        for (let i = 0, index = 0; i < 8; i++) {
            cellBlack ? cellBlack = false : cellBlack = true;
            for (let j = 0; j < 8; j++) {
                const cell = document.createElement('div');
                cell.classList.add(this.#elemCell);
                cell.classList.add(cellBlack ? this.#elemCellDark: this.#elemCellLight);
                cell.innerHTML = `${index}`;
                cell.dataset.index = String(index++);
                targetArea.append(cell);
                cellBlack ? cellBlack = false : cellBlack = true;
            }
        }
    }

    #discoverCoordinates(cellNumber) {
        const coordinatesOfCell = this.#boardNavigator.reduce((coordinates, row, index) => {
            let position = row.indexOf(cellNumber);
            if (position >= 0) return {'col': position, 'row': index}
            return coordinates
        }, {'col': null, 'row': null});
        return coordinatesOfCell;
    }

    #setBoardState(coordinates, value) {
        this.#boardState[coordinates.row][coordinates.col] = value;
    }

    #updateCssProperty() {

    }


    setBoardState(coordinates, value) {
        this.#boardState[coordinates.row][coordinates.col] = value;
        console.log(this.#boardState);
    }


    coordinateToConsole(cellNumber) {
        let codersCoordinate = this.#discoverCoordinates(cellNumber);
        let usersCoordinate = {col: codersCoordinate.col + 1, row: codersCoordinate.row + 1};
        console.log(usersCoordinate);
        return codersCoordinate;
    }

}


document.addEventListener('DOMContentLoaded', () => {
    //Collect elements for work
    const elField = document.querySelector('#chess-board');
    const elClearButton = document.getElementById('clear-btn');
    let elCells = document.querySelectorAll('.field__cell');

    const board = new chessMoves(elField, 'active');


    const clickHandler = (event) => {
        const index = parseInt(event.target.dataset.index);
        const nowWeAre = board.coordinateToConsole(index);
        board.setBoardState(nowWeAre, true);
    };


    let markedCells = [];


    const drawField = (targetArea) => {
        targetArea.textContent = '';
        let cellBlack = true;
        for (let i = 0, index = 0; i < 8; i++) {
            cellBlack ? cellBlack = false : cellBlack = true;
            for (let j = 0; j < 8; j++) {
                const cell = document.createElement('div');
                cell.classList.add('field__cell');
                if (cellBlack) cell.classList.add('field__cell--black');
                cell.innerHTML = `${index}`;
                cell.dataset.index = String(index++);
                cell.onclick = clickHandler;
                targetArea.append(cell);
                cellBlack ? cellBlack = false : cellBlack = true;
            }
        }
    }


    const setActiveState = (cells, activeCells) => {
        for (let i = 0; i < 64; i++) {
            const col = cells[i].dataset.col
            const row = cells[i].dataset.row

            if (activeCells.some(cell => cell.col === col && cell.row === row)) {
                cells[i].classList.add('active');
            } else {
                if (cells[i].classList.contains('active')) {
                    cells[i].classList.remove('active');
                }
            }
        }
    }


    const clearState = () => {
        markedCells = [];
        for (let i = 0; i < 64; i++) {
            if (elCells[i].classList.contains('active')) {
                elCells[i].classList.remove('active');
            }
        }

    }


    const clickHandler333 = (event) => {
        elCells = document.querySelectorAll('.field__cell');

        let col = event.target.dataset.col;
        let row = event.target.dataset.row;
        if (!markedCells.some(item => item.col === col && item.row === row)) {
            markedCells = [...markedCells, {'col': col, 'row': row}];
        } else {
            markedCells = markedCells.filter(item => item.col !== col || item.row !== row);
        }
        console.log(`Столбец: ${col} строка: ${row}`);
        console.log(markedCells);

        setActiveState(elCells, markedCells);

        elClearButton.addEventListener('click', clearState)

    };


    const initField = () => {
        let array = [];
        for (let i = 0; i < 8; i++) {
            let row = [];
            for (let i = 0; i < 8; i++) {
                row.push(0);
            }
            array.push(row);
        }
        return array;
    }


    const setMark = (array, x, y) => {
        if (array[y - 1] != undefined) {
            if (array[y - 1][x - 1] === 0) array[y - 1][x - 1] = 1;
        }
    }

    const moveChecker = (x, y) => {
        if ((x - 2 > 0 && x - 2 < 8) && (y - 1 > 0 && y - 1 <= 8)) {
            console.log('Left+Up is OK!');
        } else {
            console.log('Left+Up is not OK!');
        }
    };

    const moveCheckerOfHorse = (x, y) => {

        setMark(fieldModel, x, y);

        setMark(fieldModel, x - 2, y - 1);

        setMark(fieldModel, x - 2, y + 1);

        setMark(fieldModel, x - 1, y - 2);

        setMark(fieldModel, x + 1, y - 2);

        setMark(fieldModel, x + 2, y + 1);

        setMark(fieldModel, x + 2, y - 1);

        setMark(fieldModel, x - 1, y + 2);

        setMark(fieldModel, x + 1, y + 2);

    };

    let fieldModel = initField();

    const drawField_old = (targetArea) => {
        targetArea.textContent = '';

        const cell = document.createElement('div');
        cell.className = 'field__cell';
        cell.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            const row = document.createElement('div');
            row.className = 'feild__row';

            for (let j = 0; j < 8; j++) {
                const cell = document.createElement('div');
                cell.className = (fieldModel[i][j] === 1) ? 'field__cell active' : 'field__cell';
                cell.innerHTML = '<div class="field__pad"></div>';
                cell.dataset.row = i + 1;
                cell.dataset.col = j + 1;
                cell.onclick = clickHandler;
                row.append(cell);
            }
            ;

            targetArea.append(row);
        }
        ;
    };

    const clickHandler_old = (event) => {
        console.log(event.target);
        const cell = event.target.querySelector('.field__pad');
        console.log(cell);
        const row = 1 * (event.target.dataset.row);
        const col = 1 * (event.target.dataset.col);
        console.log('Координаты клетки - строка:' + row + ' столбец:' + col);
        moveChecker(col, row);
        fieldModel = initField();
        moveCheckerOfHorse(col, row);
        console.log(fieldModel);
        drawField(elField);
    };

    //drawField(elField);

});


