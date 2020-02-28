let minPopulationId = 'minPopulation';
let maxPopulationId = 'maxPopulation';
let parentsRequiredId = 'parentsRequired';
let isRunning = false;
linkInputs();
setEventListeners();
generateGameGrid(document.getElementById('gameContainer'), getSettingFromInput('gridWidth'), getSettingFromInput('gridHeight'));

/**
 * Links a range input to an input with an id that is equal to range.id + 'value'
 * @param {string} id Id of the range to link to input
 * @param {function} eventHandler An optional eventHandler to be called
 */
function linkRangeToInput(id, eventHandler = () => {}) {
    let range = document.querySelector(`#${id}`);
    let input = document.querySelector(`#${id}Value`);
    range.addEventListener('input', e => {
        input.value = range.value;
        if (eventHandler) {
            eventHandler(e);
        }
    });
    input.addEventListener('input', e => {
        range.value = input.value;
        eventHandler(e);
    });
};

function changeValueOfRangeAndInput(id, val) {
    let range = document.querySelector(`#${id}`);
    let input = document.querySelector(`#${id}Value`);
    range.value = val;
    input.value = val;
}

function getInputValuesFromSettings() {
    let inputValues = {};
    document.querySelectorAll(`.setting > input[type="range"]`)
    .forEach(el => {
        inputValues[el.name] = parseInt(el.value);
    });
    inputValues['generationInterval'] = parseFloat(document.getElementById('generationInterval').value);
    return inputValues;
}
function getSettingFromInput(settingId) {
    let el = document.getElementById(settingId);
    
    return el.value;
}

function setEventListeners() {
    document.getElementById('gridWidth').addEventListener('input', e => {
        generateGameGrid(document.getElementById('gameContainer'), getSettingFromInput('gridWidth'), getSettingFromInput('gridHeight'), true);
    });
    document.getElementById('gridHeight').addEventListener('input', e => {
        generateGameGrid(document.getElementById('gameContainer'), getSettingFromInput('gridWidth'), getSettingFromInput('gridHeight'), true);
    });
    document.getElementById('runGeneration').addEventListener('click', e => {
        runGeneration(getInputValuesFromSettings());
    });
    document.getElementById('startGame').addEventListener('click', e => {
        if (isRunning) {
            stopGame();
            isRunning = false;
            e.target.innerHTML = 'Start Game';
        }
        else {
            startGame(getInputValuesFromSettings());
            isRunning  = true;
            e.target.innerHTML = 'Stop Game';
        }
    });
    document.getElementById('restorePattern').addEventListener('click', e => {
        generateGameGrid(document.getElementById('gameContainer'), getSettingFromInput('gridWidth'), getSettingFromInput('gridHeight'), true);
    });
    document.getElementById('savePattern').addEventListener('click', e => {
        savePattern();
    });
    document.getElementById('clearGrid').addEventListener('click', e => {
        generateGameGrid(document.getElementById('gameContainer'), getSettingFromInput('gridWidth'), getSettingFromInput('gridHeight'));
    });
    document.getElementById('generationInterval').addEventListener('input', e => {
        adjustGenerationInterval(parseFloat(e.target.value));
    });
    document.getElementById('setPaintingMode').addEventListener('click', e => {
        setPaintingMode(e.target.checked);
        generateGameGrid(document.getElementById('gameContainer'), getSettingFromInput('gridWidth'), getSettingFromInput('gridHeight'), true);
    });
}
function linkInputs() {
    linkRangeToInput(minPopulationId, () => {
        //Change max neighbours, if min neighbours is bigger
        if (minPopulation.value > maxPopulation.value) {
            changeValueOfRangeAndInput(maxPopulationId, minPopulation.value);
        }
    });
    linkRangeToInput(maxPopulationId, () => {
        //Change min neighbours, if max neighbours is smaller
        if (minPopulation.value > maxPopulation.value) {
            changeValueOfRangeAndInput(minPopulationId, maxPopulation.value);
        }
    });
    linkRangeToInput(parentsRequiredId);
    
}