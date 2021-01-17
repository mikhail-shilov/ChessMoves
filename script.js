class chessMoves {
    boardNavigator; //Image of array of 64 cells by field 8*8.
    boardState; //Store is cell active or not.

    boardField; //Main area with chessboard.
    controlsField; //Area with movies menu.

    highlightMove = 'horse';
    liveHighlight = true;

    /* Settings for css names, using in appearance. */

    cssApp = 'chess';
    cssField = 'chess__field';
    cssCell = 'chess__cell';
    cssCellLight = 'chess__cell--light';
    cssCellDark = 'chess__cell--dark';
    cssToggle = 'chess__cell--active';
    cssControls = 'chess__controls-wrapper';
    cssModes = 'chess__mode-list';
    cssButtons = 'chess__btn';


    constructor(domElement, cssForToggle) {
        this.boardNavigator = this.initModels();
        this.boardState = this.initModels(false);
        this.boardField = domElement;
        this.domDrawField(this.boardField);
    }

    /*fill board by content of param, or use index number if param are not present*/
    initModels(valueToFill) {
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

    domDrawField(targetArea) {
        const drawField = () => {
            const field = document.createElement('div');
            field.classList.add(this.cssField);
            let cellBlack = true;
            for (let i = 0, index = 0; i < 8; i++) {
                cellBlack = !cellBlack;
                for (let j = 0; j < 8; j++) {
                    const cell = document.createElement('div');
                    cell.classList.add(this.cssCell);
                    cell.classList.add(cellBlack ? this.cssCellDark : this.cssCellLight);
                    cell.dataset.index = String(index++);
                    cell.innerHTML = ``;
                    field.append(cell);
                    cellBlack = !cellBlack;
                }
            }

            if (this.liveHighlight) {
                field.addEventListener('mouseover', this.eventMouseOnField.bind(this));
                field.addEventListener('mouseleave', () => {
                    this.boardState = this.initModels(false)
                    this.domFieldUpdate();
                })
            }
            field.addEventListener('click', this.eventMouseOnField.bind(this));

            return field;
        }

        const drawControls = () => {
            const controls = document.createElement('div');
            controls.classList.add(this.cssControls);

            const listOfModes = document.createElement('ul');
            listOfModes.classList.add(this.cssModes);

            const buttonLiveToggle = document.createElement('button');
            buttonLiveToggle.classList
            let LiveToggleinnerHTML = `Live highlight (now - ${this.liveHighlight ? `on`: `off`})`;
            buttonLiveToggle.innerHTML = LiveToggleinnerHTML;
            buttonLiveToggle.name = 'live-highlight';

            controls.append(listOfModes);
            controls.append(buttonLiveToggle);

            controls.addEventListener('click', this.eventUseControls.bind(this));

            return controls;
        }

        targetArea.innerHTML = '';
        targetArea.classList.add(this.cssApp)
        targetArea.append(drawField());
        targetArea.append(drawControls());
    }

    domFieldUpdate() {
        let boardState = this.boardState.reduce((state, row) => [...state, ...row], []);
        let cells = this.boardField.querySelectorAll(`.${this.cssCell}`);
        cells.forEach((cell, index) => {
                if (boardState[index] === true && !cell.classList.contains(this.cssToggle)) {
                    cell.classList.add(this.cssToggle);
                }
                if (boardState[index] === false && cell.classList.contains(this.cssToggle)) {
                    cell.classList.remove(this.cssToggle);
                }
            }
        );
    }

    discoverCoordinates(cellNumber) {
        return this.boardNavigator.reduce((coordinates, row, index) => {
            let position = row.indexOf(cellNumber);
            if (position >= 0) return {'col': position, 'row': index}
            return coordinates
        }, {'col': null, 'row': null});
    }

    setBoardState(coordinates, value) {
        this.boardState[coordinates.row][coordinates.col] = value;
    }

    highlightAvailableMoves(index) {
        /* Check on field */
        const checker = (coordinates) => {
            return (0 <= coordinates.col && coordinates.col <= 7 && 0 <= coordinates.row && coordinates.row <= 7);
        }

        const coordinates = this.discoverCoordinates(index);

        switch (this.highlightMove) {
            case "single_cell":
                const currentState = this.boardState[coordinates.row][coordinates.col];
                this.setBoardState(coordinates, !currentState);
                break
            case "horse":
                const moveTemplates = [
                    {col: coordinates.col - 1, row: coordinates.row - 2},
                    {col: coordinates.col + 1, row: coordinates.row - 2},
                    {col: coordinates.col + 2, row: coordinates.row - 1},
                    {col: coordinates.col + 2, row: coordinates.row + 1},
                    {col: coordinates.col + 1, row: coordinates.row + 2},
                    {col: coordinates.col - 1, row: coordinates.row + 2},
                    {col: coordinates.col - 2, row: coordinates.row + 1},
                    {col: coordinates.col - 2, row: coordinates.row - 1},
                ];
                this.boardState = this.initModels(false);
                let filtered = moveTemplates.filter(checker);
                filtered.forEach(item => {
                    this.setBoardState(item, true)
                });
        }
    }

    toggleLiveHighlight() {
        this.liveHighlight = !this.liveHighlight;
        this.domDrawField(this.boardField);
    }

    eventMouseOnField(event) {
        if (event.target.classList.contains(this.cssCell)) {
            const index = parseInt(event.target.dataset.index);
            this.highlightAvailableMoves(index);
            this.domFieldUpdate();
        }
    }

    eventUseControls(event) {
        if (event.target.name === 'live-highlight') {
            console.log('sw')
            this.toggleLiveHighlight();

        }
    }


    //Debugging and "under construction" methods.
    coordinateToConsole(cellNumber) {
        let codersCoordinate = this.discoverCoordinates(cellNumber);
        let usersCoordinate = {col: codersCoordinate.col + 1, row: codersCoordinate.row + 1};
        console.log(usersCoordinate);
        return codersCoordinate;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const elField = document.querySelector('#chess');
    const board = new chessMoves(elField, 'active');
});
