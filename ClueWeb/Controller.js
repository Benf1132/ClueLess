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
    
        // Dynamically generate character names from the CharacterName enum
        const characterNames = Object.keys(CharacterName);
    
        const characters = characterNames.map((name, index) => new Character(startingSquares[index], name));
        const availableCharacters = [...characters];
    
        for (let i = 0; i < this.gameBoard.getPlayers().length; i++) {
            const placeholderPlayer = this.gameBoard.getPlayers()[i];
            const { username, password, chosenCharacter } = await this.askForPlayerDetails(availableCharacters);
    
            placeholderPlayer.setUsername(username);
            placeholderPlayer.setPassword(password);
            placeholderPlayer.setCharacter(chosenCharacter);
            availableCharacters.splice(availableCharacters.indexOf(chosenCharacter), 1);
    
            const startingTile = chosenCharacter.getCurrentTile();
            startingTile.element.appendChild(chosenCharacter.getCharacterImageView());
        }
    
        // Find the index of the player who chose Miss Scarlet
        const msScarletIndex = this.gameBoard.players.findIndex(player => player.getCharacter().getCharacterName() === 'Miss Scarlet');
        this.currentPlayerIndex = msScarletIndex;
    
        // Update the turn indicator
        this.updateTurnIndicator();
    }

    updateTurnIndicator() {
        const currentPlayer = this.getCurrentPlayer();
        this.turnIndicator.textContent = `${currentPlayer.username.trim()}'s Turn (${currentPlayer.getCharacter().getCharacterName()})`;
    }

    initializeButtons() {
        document.getElementById('upButton').addEventListener('click', () => this.moveCurrentPlayer('up'));
        document.getElementById('downButton').addEventListener('click', () => this.moveCurrentPlayer('down'));
        document.getElementById('leftButton').addEventListener('click', () => this.moveCurrentPlayer('left'));
        document.getElementById('rightButton').addEventListener('click', () => this.moveCurrentPlayer('right'));
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
        const currentPlayer = this.gameBoard.getPlayers()[this.currentPlayerIndex];
        return currentPlayer;
    }

    moveCurrentPlayer(direction) {
        const currentPlayer = this.getCurrentPlayer();
        const character = currentPlayer.getCharacter();
        const currentTile = character.getCurrentTile();
        const newTile = currentTile.getNeighbor(direction);

        if (this.tileMoved) {
            this.showErrorAlert("Move Already Made", "You have already moved. Undo your previous move to change it.");
            return;
        }

        if (newTile instanceof OutOfBounds) {
            this.showErrorAlert("Invalid Move", "You cannot move to an out-of-bounds area.");
            return;
        }

        if (currentTile instanceof StartSquare) {
            if (!(newTile instanceof Hallway)) {
                this.showErrorAlert("Invalid Move", "Your first move must be to the nearest hallway.");
                return;
            }
        } else if (currentTile instanceof Hallway) {
            if (!(newTile instanceof Room)) {
                this.showErrorAlert("Invalid Move", "You can only move to a nearby room.");
                return;
            }
        } else if (currentTile instanceof Room) {
            if (newTile instanceof Hallway && newTile.isOccupied()) {
                this.showErrorAlert("Invalid Move", "You cannot move to an occupied hallway.");
                return;
            }
        }

        if (newTile) {
            character.move(newTile);
            this.tileMoved = true;
            this.updateCharacterPosition(character);
        } else {
            this.showErrorAlert("Invalid Move", "You cannot move outside the grid.");
        }
    }

    findNewTile(currentTile, dx, dy) {
        const row = currentTile.row + dy;
        const col = currentTile.column + dx;
        return this.gameBoard.getTile(row, col);
    }

    updateCharacterPosition(character) {
        const characterView = character.getCharacterImageView();
        const currentTile = character.getCurrentTile();
        const previousTile = character.getPreviousTile();

        if (previousTile && previousTile.element.contains(characterView)) {
            previousTile.element.removeChild(characterView);
        }

        currentTile.element.appendChild(characterView);
    }

    backButton() {
        const currentPlayer = this.getCurrentPlayer();
        const character = currentPlayer.getCharacter();
        if (this.tileMoved) {
            if (character.getCurrentTile() instanceof Hallway) {
                character.getCurrentTile().setOccupied(false);
            }
            character.undoMove();
            this.tileMoved = false;
            this.updateCharacterPosition(character);
        } else {
            this.showErrorAlert("Nothing to Undo", "You haven't made a move yet.");
        }
    }

    endTurnButton() {
        const currentPlayer = this.getCurrentPlayer();
        const currentTile = currentPlayer.getCharacter().getCurrentTile();

        if (currentTile instanceof StartSquare) {
            this.showErrorAlert("Invalid End Turn", "You must move to the nearest hallway before ending your turn.");
            return;
        }

        if (currentTile instanceof Hallway && !this.tileMoved) {
            this.showErrorAlert("Invalid End Turn", "You must move to a nearby room before ending your turn.");
            return;
        }

        if (currentTile instanceof Room && !this.tileMoved && !this.suggestionMade && !this.accusationMade) {
            this.showErrorAlert("Invalid End Turn", "You must move to a hallway or make a suggestion/accusation before ending your turn.");
            return;
        }

        this.resetTurnFlags();
        this.nextPlayer();
        this.updateTurnIndicator();
    }

   showHandButton() {
        const currentPlayer = this.getCurrentPlayer();
        const playerHand = currentPlayer.getHand().getCards();
    
        // Create the modal overlay
        const overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');
    
        // Create the dialog
        const dialog = document.createElement('div');
        dialog.classList.add('hand-dialog');
    
        // Create the cards container
        const cardsContainer = document.createElement('div');
        cardsContainer.classList.add('cards-container');
    
        playerHand.forEach(card => {
            const img = document.createElement('img');
            img.src = card.getImagePath();
            img.alt = card.getName();
            img.classList.add('card-image');
            cardsContainer.appendChild(img);
        });
    
        // Create the close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.classList.add('close-button');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    
        // Append elements to the dialog
        dialog.appendChild(cardsContainer);
        dialog.appendChild(closeButton);
    
        // Append the dialog to the overlay
        overlay.appendChild(dialog);
    
        // Append the overlay to the body
        document.body.appendChild(overlay);
    }
    suggestionButton() {
        if (this.suggestionMade) {
            this.showErrorAlert("Invalid Suggestion", "You have already made a suggestion this turn.");
            return;
        }

        const currentPlayer = this.getCurrentPlayer();
        const currentTile = currentPlayer.getCharacter().getCurrentTile();
        if (currentTile instanceof Room) {
            this.showSuggestionDialog(currentPlayer, currentTile);
        } else {
            this.showErrorAlert("Invalid Suggestion", "You must be in a room to make a suggestion.");
        }
    }

    showSuggestionDialog(player, room) {
        const dialog = document.createElement('dialog');
        dialog.classList.add('dialog');
        dialog.setAttribute('open', '');

        const suspectDropdown = this.createDropdown(this.gameBoard.getCharacterNames());
        const weaponDropdown = this.createDropdown(this.gameBoard.getWeaponNames());

        dialog.appendChild(this.createLabel('Suspect:'));
        dialog.appendChild(suspectDropdown);
        dialog.appendChild(this.createLabel('Weapon:'));
        dialog.appendChild(weaponDropdown);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm';
        dialog.appendChild(confirmButton);

        confirmButton.addEventListener('click', () => {
            const suspect = this.gameBoard.matchCharacter(suspectDropdown.value);
            const weapon = this.gameBoard.matchWeapon(weaponDropdown.value);
            const suggestion = new Suggestion(this.gameBoard.getPlayers(), room, weapon, suspect);
            this.suggestionMade = true;
            this.tileMoved = true;
            this.showErrorAlert("Suggestion Made", "Your suggestion has been made.");
            dialog.close();
            document.body.removeChild(dialog);
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        dialog.appendChild(cancelButton);

        cancelButton.addEventListener('click', () => {
            dialog.close();
            document.body.removeChild(dialog);
        });

        document.body.appendChild(dialog);
    }

    accusationButton() {
        if (this.accusationMade) {
            this.showErrorAlert("Invalid Accusation", "You have already made an accusation.");
            return;
        }

        const currentPlayer = this.getCurrentPlayer();
        const currentTile = currentPlayer.getCharacter().getCurrentTile();
        if (!(currentTile instanceof StartSquare)) {
            this.showAccusationDialog(currentPlayer, currentTile);
        } else {
            this.showErrorAlert("Invalid Accusation", "You cannot make an accusation from a start square.");
        }
    }

    showAccusationDialog(player, room) {
        const dialog = document.createElement('dialog');
        dialog.classList.add('dialog');
        dialog.setAttribute('open', '');

        const suspectDropdown = this.createDropdown(this.gameBoard.getCharacterNames());
        const weaponDropdown = this.createDropdown(this.gameBoard.getWeaponNames());
        const roomDropdown = this.createDropdown(this.gameBoard.getRoomNames());

        dialog.appendChild(this.createLabel('Suspect:'));
        dialog.appendChild(suspectDropdown);
        dialog.appendChild(this.createLabel('Weapon:'));
        dialog.appendChild(weaponDropdown);
        dialog.appendChild(this.createLabel('Room:'));
        dialog.appendChild(roomDropdown);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm';
        dialog.appendChild(confirmButton);

        confirmButton.addEventListener('click', () => {
            const suspect = this.gameBoard.matchCharacter(suspectDropdown.value);
            const weapon = this.gameBoard.matchWeapon(weaponDropdown.value);
            const room = this.gameBoard.matchRoom(roomDropdown.value);
            const accusation = new Accusation(this.gameBoard.getPlayers(), room, weapon, suspect, this.gameBoard.envelope);

            if (accusation.isAccusationCorrect()) {
                this.endGame(player, suspect, weapon, room);
            } else {
                this.showErrorAlert("Wrong Accusation", "You are out of the game!");
                player.setInactive();
                this.gameBoard.players = this.gameBoard.players.filter(p => p !== player);
                this.endTurnButton();
            }
            dialog.close();
            document.body.removeChild(dialog);
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        dialog.appendChild(cancelButton);

        cancelButton.addEventListener('click', () => {
            dialog.close();
            document.body.removeChild(dialog);
        });

        document.body.appendChild(dialog);
    }

    endGame(player, suspect, weapon, room) {
        alert(`${player.username} wins! The crime was committed by ${suspect.getCharacterName()} with the ${weapon.getWeaponName()} in the ${room.getRoomName()}.`);
        this.resetGame();
    }

    resetGame() {
        window.location.reload();
    }

    resetTurnFlags() {
        this.tileMoved = false;
        this.suggestionMade = false;
        this.accusationMade = false;
    }

    nextPlayer() {
        // Skip inactive players
        do {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.gameBoard.getPlayers().length;
        } while (!this.gameBoard.getPlayers()[this.currentPlayerIndex].isActive());

        this.updateTurnIndicator();
    }

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

    createLabel(text) {
        const label = document.createElement('label');
        label.textContent = text;
        return label;
    }

    showErrorAlert(title, message) {
        alert(`${title}: ${message}`);
    }

    shortcutButton() {
        const currentPlayer = this.getCurrentPlayer();
        const character = currentPlayer.getCharacter();
        const currentTile = character.getCurrentTile();

        if (this.tileMoved) {
            this.showErrorAlert("Move Already Made", "You have already moved. Please undo your previous move if you want to change it.");
            return;
        }

        if (!(currentTile instanceof Room) || !currentTile.isCorner()) {
            this.showErrorAlert("Invalid Move", "You must be in a corner room to use the shortcut.");
            return;
        }

        const oppositeRoom = this.findOppositeCornerRoom(currentTile);
        if (oppositeRoom) {
            character.move(oppositeRoom);
            this.tileMoved = true;
            this.updateCharacterPosition(character);
        } else {
            this.showErrorAlert("Invalid Move", "No opposite corner room found.");
        }
    }

    findOppositeCornerRoom(currentRoom) {
        const cornerRooms = {
            'STUDY': 'KITCHEN',
            'KITCHEN': 'STUDY',
            'LOUNGE': 'CONSERVATORY',
            'CONSERVATORY': 'LOUNGE'
        };

        const oppositeRoomName = cornerRooms[currentRoom.getRoomName()];
        if (oppositeRoomName) {
            return this.gameBoard.rooms.find(room => room.getRoomName() === oppositeRoomName);
        }
        return null;
    }

    logoutButton() {
        const confirmLogout = confirm("You're about to logout!");
        if (confirmLogout) {
            console.log("You successfully logged out!");
            window.close();
        }
    }

    checkPlayerPassword(currentPlayer) {
        let passwordCorrect = false;
        while (!passwordCorrect) {
            const password = prompt(`${currentPlayer.getUsername()}, please enter your password:`);
            if (password === currentPlayer.getPassword()) {
                passwordCorrect = true;
            } else {
                alert("The password you entered is incorrect. Please try again.");
            }
        }
    }
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
