let _gameGrid = []
let _savedPattern;
let _gameLoop;
let settings = {
    minNeighbours: 2,
    maxNeighbours: 3,
    parentsRequired: 3,
    generationInterval: 0.1,
    useGrid: true
};
let _keyStates = {
    leftMouse: false
};
let _paintingMode = false;
/**
 * Generate the gamegrid
 * @param {HTMLElement} container The container of the gamegrid
 * @param {number} gridWidth Width of the grid
 * @param {number} gridHeight Height of the grid
 * @param {boolean} [useSave=false] Should the saved pattern be used
 */
function generateGameGrid(container, gridWidth, gridHeight, useSave = false) {
    _gameGrid = [];
    container.innerHTML = '';
    let gridContainer = document.createElement('div');
    gridContainer.className = 'gridContainer';
    container.appendChild(gridContainer);
    for (let x = 0; x < gridHeight; x++) {
        let row;
        row = document.createElement('div');
        row.className = 'gridRow'
        gridContainer.appendChild(row);
        _gameGrid.push([]);
        for (let y = 0; y < gridWidth; y++) {
            if (useSave && _savedPattern && gridHeight > _savedPattern.length) {
                let arr = [];
                for (let i = 0; i < _savedPattern[0].length; i++) {
                    arr.push('dead');
                }
                _savedPattern.push(arr);
            }
            if (useSave && _savedPattern && gridWidth > _savedPattern[x].length) {
                _savedPattern.map(z => z.push('dead'));
            }
            let cell;
            cell = document.createElement('div');
            cell.className = `gridCell ${useSave && _savedPattern ? _savedPattern[x][y] : 'dead'}`;
            cell.setAttribute('data-x', x);
            cell.setAttribute('data-y', y);
            _gameGrid[x].push(cell);
            row.appendChild(cell);
            if (_paintingMode) {
                cell.addEventListener('mouseover', _cellHandler)
            }
            else{
                cell.removeEventListener('mouseover', _cellHandler)
            }
            cell.addEventListener('mousedown', e => toggleCell(e.target));
        }
    }
}

function _cellHandler(e) {
    if (_paintingMode && _keyStates.leftMouse) {
        toggleCell(e.target)
    }
}

function _mouseDownListener(e) {
    _keyStates.leftMouse = e.buttons === 1;
}

/**
 * Sets paintingmode
 * @param {boolean} bool Should the paintingmode be set
 */
function setPaintingMode(bool) {
    _paintingMode = bool;
    if (bool) {
        document.addEventListener('mousedown', _mouseDownListener);
        document.addEventListener('mouseup', _mouseDownListener);
    }
    else{
        document.removeEventListener('mousedown', _mouseDownListener);
        document.removeEventListener('mouseup', _mouseDownListener);
    }
}

/**
 * Toggles the state of a cell
 * @param {HTMLElement} el The cell to toggle
 */
function toggleCell(el) {
    let classes = 'gridCell ';
    if (!el.className.includes('dead')) {
        classes += 'dead'
    }
    else {
        classes += 'alive';
    }
    el.className = classes;
}

/**
 * Saves current pattern
 */
function savePattern() {
    _savedPattern = deepClone2dArray(_gameGrid.map(x => x.map(y => y.className.split(' ')[1])));
    return _savedPattern;
}


/**
 * Run one generation
 * @param {settings} _settings The settings to use
 */
function runGeneration(_settings = {}) {
    setSettings(_settings);
    for (let x = 0; x < _gameGrid.length; x++) {
        for (let y = 0; y < _gameGrid[x].length; y++) {
            let cell = _gameGrid[x][y];
            let liveNeighbours = _calculateLiveNeighbours(cell);
            if (cell.className.includes('alive')) {
                //Rules for live cells
                if (liveNeighbours < settings.minNeighbours || liveNeighbours > settings.maxNeighbours) {
                    cell.setAttribute('data-shouldToggle', 'true')
                }
            }
            else {
                //Rules for dead cells
                if (liveNeighbours === settings.parentsRequired) {
                    cell.setAttribute('data-shouldToggle', 'true')
                }
            }
        }        
    }
    for (let x = 0; x < _gameGrid.length; x++) {
        for (let y = 0; y < _gameGrid[x].length; y++) {
            const cell = _gameGrid[x][y];
            if (cell.getAttribute('data-shouldToggle') === 'true') {
                toggleCell(cell);
                cell.setAttribute('data-shouldToggle', 'false');
            }
        }
        
    }
}

/**
 * Set a new interval to use when generating new generations
 * @param {number} newInterval The new interval in seconds
 */
function adjustGenerationInterval(newInterval) {
    if (_gameLoop) {
        settings.generationInterval = newInterval;
        clearInterval(_gameLoop);
        _gameLoop = setInterval(() => {
            runGeneration();
        }, settings.generationInterval * 1000);
    }
}

/**
 * @param {HTMLElement} cell 
 */
function _calculateLiveNeighbours(cell) {
    let x = parseInt(cell.getAttribute('data-x'));
    let y = parseInt(cell.getAttribute('data-y'));
    let liveCells = 0;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i === x && j === y) {
                continue
            }
            if (_gameGrid[i] && _gameGrid[i][j] && _gameGrid[i][j].className.includes('alive')) {
                liveCells++;
            }
        }      
    }
    return liveCells;
}

/**
 * Set the settings
 * @param {settings} _settings Settings to use
 */
function setSettings(_settings) {
    for(let key in _settings) {
        settings[key] = _settings[key];
    }
}

/**
 * Start running generations using the set generation interval
 * @param {settings} _settings Settings to use
 */
function startGame(_settings = {}) {
    if (!_gameLoop) {
        setSettings(_settings)
        _gameLoop = setInterval(() => {
            runGeneration();
        }, settings.generationInterval * 1000);
    }
}

/**
 * Stop the game
 */
function stopGame() {
    clearInterval(_gameLoop);
    _gameLoop = undefined;
}

/*
 *HELPERS 
 */

 function deepClone2dArray(arr) {
    // return Array.from(arr.map(x => Array.from(x)));
    return JSON.parse(JSON.stringify(arr));
 }





 /**
  * ********************************************************************** TYPEDEF **********************************************************************
  */


  /**
   * @typedef {Object} settings
   * @property {number} minNeighbours - The minimum amount of neighbours to survive
   * @property {number} maxNeighbours - The maximum amount of neighbours to survive
   * @property {number} parentsRequired - The number of parents required to grant life to a cell
   * @property {number} generationInterval - Time between generations in seconds
   * @property {boolean} useGrid - Should a grid be visible
   */