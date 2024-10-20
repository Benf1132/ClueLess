// Import necessary classes and enums
import { Gameboard } from './Gameboard.js';
import { Suggestion } from './Suggestion.js';
import { Accusation } from './Accusation.js';
import { CharacterName, WeaponName, RoomName, TileType } from './GameEnums.js';
import Character from './Character.js';

class Controller {
    constructor(gameBoard, gridPane, turnIndicator) {
        this.gameBoard = gameBoard;
        this.gridPane = gridPane;
        this.turnIndicator = turnIndicator;
        this.currentPlayerIndex = 0;
        this.tileMoved = false;
        this.suggestionMade = false;
        this.accusationMade = false;
        
        // Initialize game components
        this.initializePlayers();
        this.initializeButtons();
        this.updateTurnIndicator();
    }

    // Initialize players and assign characters to their starting positions
    initializePlayers() {
        console.log("Initializing players...");
        const startingSquares = [
            this.gameBoard.getTile(0, 4),  // Miss Scarlet
            this.gameBoard.getTile(2, 0),  // Professor Plum
            this.gameBoard.getTile(2, 6),  // Colonel Mustard
            this.gameBoard.getTile(4, 0),  // Mrs. Peacock
            this.gameBoard.getTile(6, 2),  // Mr. Green
            this.gameBoard.getTile(6, 4)   // Mrs. White
        ];

        const characters = [
            new Character(startingSquares[0], CharacterName.MS_SCARLET),
            new Character(startingSquares[1], CharacterName.PROFESSOR_PLUM),
            new Character(startingSquares[2], CharacterName.COLONEL_MUSTARD),
            new Character(startingSquares[3], CharacterName.MRS_PEACOCK),
            new Character(startingSquares[4], CharacterName.MR_GREEN),
            new Character(startingSquares[5], CharacterName.MRS_WHITE)
        ];

        // Initialize players and place characters on the board
        this.gameBoard.players.forEach((player, index) => {
            player.setCharacter(characters[index]);
            const startingTile = characters[index].getCurrentTile();
            this.gridPane.appendChild(characters[index].getCharacterImageView());
            characters[index].getCharacterImageView().style.gridRowStart = startingTile.row + 1;
            characters[index].getCharacterImageView().style.gridColumnStart = startingTile.column + 1;
        });
        console.log("Players initialized.");
    }

    // Initialize buttons and bind their functionality to movement and game actions
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

    // Update the turn indicator to show which player's turn it is
    updateTurnIndicator() {
        const currentPlayer = this.getCurrentPlayer();
        this.turnIndicator.textContent = `${currentPlayer.username}'s Turn (${currentPlayer.character.getCharacterName()})`;
    }

    // Move the current player based on direction
    moveCurrentPlayer(dx, dy) {
        const currentPlayer = this.getCurrentPlayer();
        const character = currentPlayer.character;
        const currentTile = character.getCurrentTile();
        const newTile = this.findNewTile(currentTile, dx, dy);

        if (this.tileMoved) {
            this.showErrorAlert("Move Already Made", "You have already moved. Undo your previous move to change it.");
            return;
        }

        if (newTile) {
            character.move(newTile);
            this.tileMoved = true;
            this.updateCharacterPosition(character);
        } else {
            this.showErrorAlert("Invalid Move", "You cannot move outside the grid.");
        }
    }

    // Find the new tile based on current position and movement direction
    findNewTile(currentTile, dx, dy) {
        const row = currentTile.row + dy;
        const col = currentTile.column + dx;
        return this.gameBoard.getTile(row, col);
    }

    // Update the character's position on the grid
    updateCharacterPosition(character) {
        const characterView = character.getCharacterImageView();
        const currentTile = character.getCurrentTile();
        this.gridPane.removeChild(characterView); // Remove from old position
        this.gridPane.appendChild(characterView); // Append to new position
        characterView.style.gridRowStart = currentTile.row + 1;
        characterView.style.gridColumnStart = currentTile.column + 1;
    }

    // Undo the current player's move
    backButton() {
        const currentPlayer = this.getCurrentPlayer();
        const character = currentPlayer.character;
        if (this.tileMoved) {
            character.undoMove();
            this.tileMoved = false;
            this.updateCharacterPosition(character);
        } else {
            this.showErrorAlert("Nothing to Undo", "You haven't made a move yet.");
        }
    }

    // End the current player's turn and move to the next player
    endTurnButton() {
        this.resetTurnFlags();
        this.nextPlayer();
        this.updateTurnIndicator();
    }

    // Show the current player's hand
    showHandButton() {
        const currentPlayer = this.getCurrentPlayer();
        const playerHand = currentPlayer.hand.getCards();
        const handDialog = document.createElement('div');
        handDialog.classList.add('hand-dialog');

        playerHand.forEach(card => {
            const img = document.createElement('img');
            img.src = card.getImagePath();
            img.classList.add('card-image');
            handDialog.appendChild(img);
        });

        document.body.appendChild(handDialog);
        setTimeout(() => {
            document.body.removeChild(handDialog);
        }, 5000); // Show the hand for 5 seconds
    }

    // Handle the suggestion process
    suggestionButton() {
        if (this.suggestionMade) {
            this.showErrorAlert("Invalid Suggestion", "You have already made a suggestion this turn.");
            return;
        }
        const currentPlayer = this.getCurrentPlayer();
        const currentTile = currentPlayer.character.getCurrentTile();
        if (currentTile instanceof Room) {
            this.showSuggestionDialog(currentPlayer, currentTile);
        } else {
            this.showErrorAlert("Invalid Suggestion", "You must be in a room to make a suggestion.");
        }
    }

    // Handle the accusation process
    accusationButton() {
        if (this.accusationMade) {
            this.showErrorAlert("Invalid Accusation", "You have already made an accusation.");
            return;
        }

        const currentPlayer = this.getCurrentPlayer();
        const currentTile = currentPlayer.character.getCurrentTile();
        if (currentTile instanceof Room) {
            this.showAccusationDialog(currentPlayer, currentTile);
        } else {
            this.showErrorAlert("Invalid Accusation", "You must be in a room to make an accusation.");
        }
    }

    // Create dropdown for selecting options in suggestion or accusation
    createDropdown(options) {
        const select = document.createElement('select');
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });
        return select;
    }

    // Advance to the next player
    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.gameBoard.getPlayers().length;
    }

    // Reset flags for the new turn
    resetTurnFlags() {
        this.tileMoved = false;
        this.suggestionMade = false;
        this.accusationMade = false;
    }

    // Display an error alert
    showErrorAlert(title, message) {
        alert(`${title}: ${message}`);
    }

    // Reset the game (refreshes the page)
    resetGame() {
        window.location.reload();
    }

    // Get the current player
    getCurrentPlayer() {
        return this.gameBoard.getPlayers()[this.currentPlayerIndex];
    }
}

// Wait for the DOM to load before initializing the game
document.addEventListener('DOMContentLoaded', () => {
    const gridPane = document.getElementById('grid-container');
    const turnIndicator = document.getElementById('turnIndicator');

    // Initialize the gameboard (7x7 grid as an example)
    const gameBoard = new Gameboard(7, 7);

    // Initialize the controller with gameBoard and UI components
    const controller = new Controller(gameBoard, gridPane, turnIndicator);
});

// Export the controller to use in the main script
export { Controller };
