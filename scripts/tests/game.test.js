/**
 * @jest-environment jsdom
 */

const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn } = require('../game');

jest.spyOn(window, 'alert').mockImplementation(() => { });

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe('game object contains correct keys', () => {
    test('score key exists', ()=> {
        expect('score' in game).toBe(true);
    });
    test('current game key exists', ()=> {
        expect('currentGame' in game).toBe(true);
    });
    test('playerMoves key exists', ()=> {
        expect('currentGame' in game).toBe(true);
    });
    test('choices key exists', ()=> {
        expect('currentGame' in game).toBe(true);
    });
    test('turn number key exists', ()=> {
        expect('turnNumber' in game).toBe(true);
    });
    test('turn in progress key exists', ()=> {
        expect('turnInProgress' in game).toBe(true);
    });
    test('last button key exists', ()=> {
        expect('lastButton' in game).toBe(true);
    });
    test('choices contains the correct IDs', () => {
        expect(game.choices).toEqual(['button1', 'button2', 'button3', 'button4']);
    });
});

describe('new game works correctly', () => {
    beforeAll(()=>{
        game.score =42;
        game.playerMoves = ['button1', 'button2'];
        game.currentGame = ['button1', 'button2'];
        document.getElementById('score').innerHTML = '42';
        newGame();
    });
    test('game score should be set to zero', () => {
        expect(game.score).toEqual(0);
    });
    test('clear the playerMoves array', () => {
        expect(game.playerMoves.length).toEqual(0);
    });
    test('should be one move in teh computers game array', () => {
        expect(game.currentGame.length).toEqual(1);
    });
    test('should display zero for the elelment with the ID of score', () => {
        expect(document.getElementById('score').innerText).toEqual(0);
    });
    test('expect data-listener to be true', () => {
        const elements = document.getElementsByClassName('circle');
        for (let element of elements){
            expect (element.getAttribute('data-listener')).toEqual('true');
        }
    });
});

describe ('gameplay works correctly', () => {
    beforeEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn ();
    });
    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });
    test('addTurn adds a new turn to the game', () => {
        addTurn();
        expect(game.currentGame.length).toEqual(2);
    });
    test('should add the correct class to light up the buttons', () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain('light');
    });
    test('show turns shuld update game turn number', () => {
        game.turnNumber = 42;
        showTurns();
        expect(game.turnNumber).toEqual(0);
    });
    test('should increment the score if the turn is correct', () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    });
    test('should call an alert if the move is wrong', () => {
        game.playerMoves.push('wrong');
        playerTurn();
        expect(window.alert).toBeCalledWith('ops thats wrong!');
    });
    test('turn in progress is true while computer displays sequence', () => {
        showTurns();
        expect (game.turnInProgress).toBe(true);
    });
    test('clicking during the computers sequence should fail', () => {
        showTurns();
        game.lastButton = "";
        document.getElementById("button2").click();
        expect(game.lastButton).toEqual("");
    });
});

