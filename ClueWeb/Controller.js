import { Gameboard } from './Gameboard.js';
import { Suggestion } from './Suggestion.js';
import { Accusation } from './Accusation.js';
import { CharacterName, WeaponName, RoomName, TileType } from './GameEnums.js';
import Character from './Character.js';
import StartSquare from './StartSquare.js';
import Hallway from './Hallway.js';
import Room from './Room.js';
import OutOfBounds from './OutOfBounds.js';

class Controller {
    constructor(gameBoard, gridPane, turnIndicator) {
        this.gameBoard = gameBoard;
        this.gridPane = gridPane;
        this.turnIndicator = turnIndicator;
        this.currentPlayerIndex = 0;
        this.tileMoved = false;
        this.suggestionMade = false;
        this.accusationMade = false;

        // Removed calls to initializePlayers() and initializeButtons() from constructor
    }

    async initializePlayers() {
        const startingSquares = [
            this.gameBoard.getTile(0, 4),  // Miss Scarlet
            this.gameBoard.getTile(2, 0),  // Professor Plum
            this.gameBoard.getTile(2, 6),  // Colonel Mustard
            this.gameBoard.getTile(4, 0),  // Mrs. Peacock
            this.gameBoard.getTile(6, 2),  // Mr. Green
            this.gameBoard.getTile(6, 4)   // Mrs. White
        ];
    
        const characterNames = [
            'MS_SCARLET',
            'PROFESSOR_PLUM',
            'COLONEL_MUSTARD',
            'MRS_PEACOCK',
            'MR_GREEN',
            'MRS_WHITE'
        ];
    
        const characters = characterNames.map((name, index) => new Character(startingSquares[index], name));
        const availableCharacters = [...characters];
    
        const numPlayers = 6;  // You can adjust this to the desired number of players
    
        for (let i = 0; i < numPlayers; i++) {
            const placeholderPlayer = this.gameBoard.getPlayers()[i];
            const { username, password, chosenCharacter } = await this.askForPlayerDetails(availableCharacters);
    
            placeholderPlayer.setUsername(username);
            placeholderPlayer.setPassword(password);
            placeholderPlayer.setCharacter(chosenCharacter);
            availableCharacters.splice(availableCharacters.indexOf(chosenCharacter), 1);
    
            const startingTile = chosenCharacter.getCurrentTile();
            startingTile.element.appendChild(chosenCharacter.getCharacterImageView());
        }
    
        // Remove unused placeholder players
        this.gameBoard.players = this.gameBoard.players.slice(0, numPlayers);
    
        // Sort players so that the player with Miss Scarlet goes first
        const sortedPlayers = this.gameBoard.getPlayers().sort((a, b) => {
            if (a.getCharacter().getCharacterName() === 'MS_SCARLET') return -1;
            if (b.getCharacter().getCharacterName() === 'MS_SCARLET') return 1;
            return 0;
        });
    
        // Update the game board's players array with the sorted players
        this.gameBoard.players = sortedPlayers;
    
        // Find the index of the player who chose Miss Scarlet
        const msScarletIndex = this.gameBoard.players.findIndex(player => player.getCharacter().getCharacterName() === 'MS_SCARLET');
        if (msScarletIndex !== -1) {
            this.currentPlayerIndex = msScarletIndex;
        } else {
            // If no one chose Miss Scarlet, default to the first player
            this.currentPlayerIndex = 0;
        }
    }

    updateTurnIndicator() {
        const currentPlayer = this.getCurrentPlayer();
        if (currentPlayer && currentPlayer.username && currentPlayer.character) {
            this.turnIndicator.textContent = `${currentPlayer.username.trim()}'s Turn (${currentPlayer.character.getCharacterName()})`;
        } else {
            this.turnIndicator.textContent = `Waiting for players to initialize...`;
        }
    }

    initializeButtons() {
        document.getElementById('upButton').addEventListener('click', () => this.moveCurrentPlayer(0, -1));
        document.getElementById('downButton').addEventListener('click', () => this.moveCurrentPlayer(0, 1));
        document.getElementById('leftButton').addEventListener('click', () => this.moveCurrentPlayer(-1, 0));
        document.getElementById('rightButton').addEventListener('click', () => this.moveCurrentPlayer(1, 0));
        document.getElementById('backButton').addEventListener('click', () => this.backButton());
        document.getElementById('endTurnButton').addEventListener('click', () => this.endTurnButton());
        document.getElementById('showHandButton').addEventListener('click', () => this.showHandButton());
        document.getElementById('suggestionButton').addEventListener('click', () => this.suggestionButton());
        document.getElementById('accusationButton').addEventListener('click', () => this.accusationButton());
        document.getElementById('shortcutButton').addEventListener('click', () => this.shortcutButton());
        document.getElementById('logoutButton').addEventListener('click', () => this.logoutButton());
    }

    askForPlayerDetails(availableCharacters) {
        return new Promise((resolve) => {
            const characterNames = availableCharacters.map(character => character.getCharacterName().toString());
            const select = document.createElement('select');
    
            characterNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
    
            const dialog = document.createElement('div');
            dialog.classList.add('player-setup-dialog');
    
            const usernameLabel = document.createElement('label');
            usernameLabel.textContent = 'Enter username:';
            const usernameInput = document.createElement('input');
            usernameInput.type = 'text';
    
            const passwordLabel = document.createElement('label');
            passwordLabel.textContent = 'Enter password:';
            const passwordInput = document.createElement('input');
            passwordInput.type = 'password';
    
            const characterLabel = document.createElement('label');
            characterLabel.textContent = 'Choose your character:';
    
            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Confirm';
    
            dialog.appendChild(usernameLabel);
            dialog.appendChild(usernameInput);
            dialog.appendChild(passwordLabel);
            dialog.appendChild(passwordInput);
            dialog.appendChild(characterLabel);
            dialog.appendChild(select);
            dialog.appendChild(confirmButton);
    
            confirmButton.addEventListener('click', () => {
                const username = usernameInput.value.trim();
                const password = passwordInput.value.trim();
                const chosenCharacterName = select.value;
                const chosenCharacter = availableCharacters.find(character => character.getCharacterName().toString() === chosenCharacterName);
    
                if (username && password && chosenCharacter) {
                    document.body.removeChild(dialog);
                    resolve({ username, password, chosenCharacter });
                } else {
                    alert('You must enter a username, password, and select a character!');
                }
            });
    
            document.body.appendChild(dialog);
        });
    }

    getCurrentPlayer() {
        const players = this.gameBoard.getPlayers();
        const currentPlayer = players[this.currentPlayerIndex];
        return currentPlayer;
    }

    // ... rest of your methods (moveCurrentPlayer, backButton, etc.) remain the same ...

}

// Wait for the DOM to load before initializing the game
document.addEventListener('DOMContentLoaded', () => {
    // Wrap the initialization in an async function
    const initGame = async () => {
        const gridPane = document.getElementById('grid-container');
        const turnIndicator = document.getElementById('turnIndicator');

        const gameBoard = new Gameboard(7, 7);
        gameBoard.debugNeighbors();

        const controller = new Controller(gameBoard, gridPane, turnIndicator);

        // Await the asynchronous initialization of players
        await controller.initializePlayers();

        // Initialize buttons after players have been set up
        controller.initializeButtons();

        // Update the turn indicator
        controller.updateTurnIndicator();
    };

    // Call the async initialization function
    initGame();
});

export { Controller };
