// Import necessary classes and enums
import { GameBoard } from './GameBoard.js';
import { Suggestion } from './Suggestion.js';
import { Accusation } from './Accusation.js';
import { CharacterName, WeaponName, RoomName } from './GameEnums.js';
import Character from './Character.js';
import Player from './Player.js';
import Room from './Room.js';
import Tile from './Tile.js';
import Hallway from './Hallway.js';
import StartingSquare from './StartingSquare.js';
import Weapon from './Weapon.js';
import Deck from './Deck.js';
import Card from './Card.js';
import Hand from './Hand.js';

class Controller {
    constructor(gameBoard, gridPane, turnIndicator) {
        this.gameBoard = gameBoard;
        this.gridPane = gridPane;
        this.turnIndicator = turnIndicator;
        this.currentPlayerIndex = 0;
        this.tileMoved = false;  // Track if a tile was moved
        this.suggestionMade = false;  // Track if suggestion was made
        this.accusationMade = false;  // Track if accusation was made

        // Initialize game components
        this.initializePlayers();
        this.updateTurnIndicator();
        this.initializeButtons();
    }

    initializeButtons() {
        // Add event listeners to buttons
        document.getElementById('upButton').addEventListener('click', () => this.upButton());
        document.getElementById('downButton').addEventListener('click', () => this.downButton());
        document.getElementById('leftButton').addEventListener('click', () => this.leftButton());
        document.getElementById('rightButton').addEventListener('click', () => this.rightButton());
        document.getElementById('shortcutButton').addEventListener('click', () => this.shortcutButton());
        document.getElementById('backButton').addEventListener('click', () => this.backButton());
        document.getElementById('endTurnButton').addEventListener('click', () => this.endTurnButton());
        document.getElementById('showHandButton').addEventListener('click', () => this.showHandButton());
        document.getElementById('logoutButton').addEventListener('click', () => this.logoutButton());
        document.getElementById('suggestionButton').addEventListener('click', () => this.suggestionButton());
        document.getElementById('accusationButton').addEventListener('click', () => this.accusationButton());
    }

    updateTurnIndicator() {
        const currentPlayer = this.getCurrentPlayer();
        this.turnIndicator.textContent = `${currentPlayer.username.trim()}'s Turn (${currentPlayer.character.getCharacterName()})`;
    }

    upButton() {
        this.moveCurrentPlayer(0, -1); // Move up
    }

    downButton() {
        this.moveCurrentPlayer(0, 1); // Move down
    }

    leftButton() {
        this.moveCurrentPlayer(-1, 0); // Move left
    }

    rightButton() {
        this.moveCurrentPlayer(1, 0); // Move right
    }

    showHandButton() {
        const currentPlayer = this.getCurrentPlayer();
        const playerHand = currentPlayer.getHand().getCards();

        // Create a dialog to display the hand
        const handDialog = document.createElement('div');
        handDialog.classList.add('hand-dialog');

        // Create a container to hold the card images
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');

        // Add each card's image to the container
        playerHand.forEach(card => {
            const img = document.createElement('img');
            img.src = card.getImagePath();
            img.alt = card.getName();
            img.style.width = '150px';
            img.style.height = '150px';
            img.style.margin = '10px';
            cardContainer.appendChild(img);
        });

        // Add a close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(handDialog);
        });

        handDialog.appendChild(cardContainer);
        handDialog.appendChild(closeButton);

        // Style the dialog
        handDialog.style.position = 'fixed';
        handDialog.style.top = '50%';
        handDialog.style.left = '50%';
        handDialog.style.transform = 'translate(-50%, -50%)';
        handDialog.style.backgroundColor = 'white';
        handDialog.style.border = '1px solid black';
        handDialog.style.padding = '20px';
        handDialog.style.zIndex = '1000';

        document.body.appendChild(handDialog);
    }

    initializePlayers() {
        // Define the starting squares for each character
        const startingSquares = [
            this.gameBoard.getTile(0, 4),  // Miss Scarlet
            this.gameBoard.getTile(2, 0),  // Professor Plum
            this.gameBoard.getTile(2, 6),  // Colonel Mustard
            this.gameBoard.getTile(4, 0),  // Mrs. Peacock
            this.gameBoard.getTile(6, 2),  // Mr. Green
            this.gameBoard.getTile(6, 4)   // Mrs. White
        ];

        // Create characters
        const characters = [
            new Character(startingSquares[0], 'MS_SCARLET'),
            new Character(startingSquares[1], 'PROFESSOR_PLUM'),
            new Character(startingSquares[2], 'COLONEL_MUSTARD'),
            new Character(startingSquares[3], 'MRS_PEACOCK'),
            new Character(startingSquares[4], 'MR_GREEN'),
            new Character(startingSquares[5], 'MRS_WHITE')            
        ];

        // Track selected characters to prevent duplicates
        let availableCharacters = [...characters];

        // Interactive player setup
        for (let i = 1; i <= 6; i++) {
            const placeholderPlayer = this.gameBoard.getPlayers()[i - 1];
            // Ask for the username
            let username = this.askForInput(`Player Setup`, `Enter a username for Player ${i}`);
            placeholderPlayer.setUsername(username);

            // Ask for the password
            let password = this.askForInput(`Player Setup`, `Enter a password for Player ${i}`);
            placeholderPlayer.setPassword(password);

            // Let the player choose a character
            let chosenCharacter = this.askForCharacter(availableCharacters);
            placeholderPlayer.setCharacter(chosenCharacter);

            // Remove the chosen character from the available characters list
            availableCharacters = availableCharacters.filter(c => c !== chosenCharacter);

            // Place the character on the game board
            const startingTile = chosenCharacter.getCurrentTile();
            this.gridPane.appendChild(chosenCharacter.getCharacterImageView());
            startingTile.element.appendChild(chosenCharacter.getCharacterImageView());
        }

        this.getFirstPlayer();
    }

    askForInput(title, content) {
        let input = null;
        while (input === null || input.trim() === '') {
            input = prompt(`${title}\n${content}`);
            if (input === null || input.trim() === '') {
                this.showAlert('warning', 'Input Required', `You must enter a valid ${content.toLowerCase()}!`);
            }
        }
        return input;
    }

    askForCharacter(availableCharacters) {
        let chosenCharacter = null;
        while (chosenCharacter === null) {
            const characterNames = availableCharacters.map(character => character.getCharacterName());
            const input = prompt(`Character Selection\nChoose your character:\nAvailable characters: ${characterNames.join(', ')}`);
            if (input !== null) {
                const selectedCharacter = availableCharacters.find(c => c.getCharacterName().toUpperCase() === input.trim().toUpperCase());
                if (selectedCharacter) {
                    chosenCharacter = selectedCharacter;
                } else {
                    this.showAlert('warning', 'Character Selection Required', 'You must select a character from the list!');
                }
            } else {
                this.showAlert('warning', 'Character Selection Required', 'You must select a character!');
            }
        }
        return chosenCharacter;
    }

    suggestionButton() {
        if (this.suggestionMade) {
            this.showErrorAlert("Invalid Suggestion", "You have already made a previous suggestion and cannot make another one this turn.");
            return;
        }

        const currentPlayer = this.getCurrentPlayer();
        const currentTile = currentPlayer.getCharacter().getCurrentTile();

        if (currentTile instanceof Room) {
            const currentRoom = currentTile;

            if (currentPlayer.wasPulledBySuggestion && currentPlayer.wasPulledBySuggestion()) {
                currentPlayer.setPulledBySuggestion(false);
                this.showSuggestionDialog();
            } else {
                if (this.tileMoved) {
                    this.showSuggestionDialog();
                } else {
                    if (currentRoom.isCornerRoom) {
                        this.showErrorAlert("Invalid Suggestion", "To make a suggestion here you must re-enter the room via a hallway or take a shortcut to the opposite room and make the suggestion there.");
                    } else {
                        this.showErrorAlert("Invalid Suggestion", "To make a suggestion here you must re-enter the room via a hallway.");
                    }
                }
            }
        } else if (currentTile instanceof StartingSquare) {
            this.showErrorAlert("Invalid Suggestion", "Your first move must be to the nearest hallway.");
        } else {
            this.showErrorAlert("Invalid Suggestion", "To make a suggestion you must be in a room.");
        }
    }

    // Method to create and show the suggestion dialog
    showSuggestionDialog() {
        const currentRoom = this.getCurrentPlayer().getCharacter().getCurrentTile();
        // Create dropdown menus for suspect and weapon selection
        const suspectSelect = this.createDropdown(this.gameBoard.getCharacterNames(), 'Select Suspect');
        const weaponSelect = this.createDropdown(this.gameBoard.getWeaponNames(), 'Select Weapon');

        // Create a dialog
        const dialog = document.createElement('div');
        dialog.classList.add('dialog');

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm';

        dialog.appendChild(suspectSelect.label);
        dialog.appendChild(suspectSelect.select);
        dialog.appendChild(weaponSelect.label);
        dialog.appendChild(weaponSelect.select);
        dialog.appendChild(confirmButton);

        // Style the dialog
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'white';
        dialog.style.border = '1px solid black';
        dialog.style.padding = '20px';
        dialog.style.zIndex = '1000';

        document.body.appendChild(dialog);

        confirmButton.addEventListener('click', () => {
            const selectedSuspectName = suspectSelect.select.value;
            const selectedWeaponName = weaponSelect.select.value;

            const selectedSuspect = this.gameBoard.matchCharacter(selectedSuspectName);
            const selectedWeapon = this.gameBoard.matchWeapon(selectedWeaponName);

            if (selectedSuspect && selectedWeapon) {
                const suggestion = new Suggestion(this.gameBoard.getPlayers(), currentRoom, selectedWeapon, selectedSuspect);
                this.suggestionMade = true;
                this.disproveSuggestionOrAccusation(this.getCurrentPlayer(), selectedSuspect, selectedWeapon, currentRoom, true);
            }

            document.body.removeChild(dialog);
        });
    }

    accusationButton() {
        const currentPlayer = this.getCurrentPlayer();
        const currentTile = currentPlayer.getCharacter().getCurrentTile();

        if (currentTile instanceof StartingSquare) {
            this.showErrorAlert("Invalid Accusation", "Your first move must be to the nearest hallway");
        } else {
            const confirmAccusation = confirm("Are you sure you want to make this accusation? If you are wrong, you will be kicked out of the game.");
            if (confirmAccusation) {
                // Create dropdown menus for suspect, weapon, and room selection
                const suspectSelect = this.createDropdown(this.gameBoard.getCharacterNames(), 'Select Suspect');
                const weaponSelect = this.createDropdown(this.gameBoard.getWeaponNames(), 'Select Weapon');
                const roomSelect = this.createDropdown(this.gameBoard.getRoomNames(), 'Select Room');

                // Create a dialog
                const dialog = document.createElement('div');
                dialog.classList.add('dialog');

                const confirmButton = document.createElement('button');
                confirmButton.textContent = 'Confirm';

                dialog.appendChild(suspectSelect.label);
                dialog.appendChild(suspectSelect.select);
                dialog.appendChild(weaponSelect.label);
                dialog.appendChild(weaponSelect.select);
                dialog.appendChild(roomSelect.label);
                dialog.appendChild(roomSelect.select);
                dialog.appendChild(confirmButton);

                // Style the dialog
                dialog.style.position = 'fixed';
                dialog.style.top = '50%';
                dialog.style.left = '50%';
                dialog.style.transform = 'translate(-50%, -50%)';
                dialog.style.backgroundColor = 'white';
                dialog.style.border = '1px solid black';
                dialog.style.padding = '20px';
                dialog.style.zIndex = '1000';

                document.body.appendChild(dialog);

                confirmButton.addEventListener('click', () => {
                    const selectedSuspectName = suspectSelect.select.value;
                    const selectedWeaponName = weaponSelect.select.value;
                    const selectedRoomName = roomSelect.select.value;

                    const selectedSuspect = this.gameBoard.matchCharacter(selectedSuspectName);
                    const selectedWeapon = this.gameBoard.matchWeapon(selectedWeaponName);
                    const selectedRoom = this.gameBoard.matchRoom(selectedRoomName);

                    if (selectedSuspect && selectedWeapon && selectedRoom) {
                        const accusation = new Accusation(
                            this.gameBoard.getPlayers(),
                            selectedRoom,
                            selectedWeapon,
                            selectedSuspect,
                            this.gameBoard.getEnvelope()
                        );
                        this.accusationMade = true;

                        this.disproveSuggestionOrAccusation(currentPlayer, selectedSuspect, selectedWeapon, selectedRoom, false);

                        if (accusation.isAccusationCorrect()) {
                            this.endGame(currentPlayer, selectedSuspect, selectedWeapon, selectedRoom);
                        } else {
                            this.showAlert('error', "Incorrect Accusation", "You have been kicked out of the game.");
                            currentPlayer.setInactivity();
                            this.endTurn();
                        }
                    }

                    document.body.removeChild(dialog);
                });
            }
        }
    }

    // Implement the disproveSuggestionOrAccusation, endGame, backButton, endTurnButton, and other methods similarly...

    // Utility methods
    createDropdown(options, labelText) {
        const label = document.createElement('label');
        label.textContent = labelText;

        const select = document.createElement('select');
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });

        return { label, select };
    }

    showAlert(type, title, content) {
        alert(`${title}\n${content}`);
    }

    showErrorAlert(title, message) {
        alert(`${title}\n${message}`);
    }

    getCurrentPlayer() {
        return this.gameBoard.getPlayers()[this.currentPlayerIndex];
    }

    getFirstPlayer() {
        const characterNames = this.gameBoard.getPlayers().map(player => player.getCharacter().name);
        for (let i = 0; i < characterNames.length; i++) {
            const c = characterNames[i];
            if (c === 'MS_SCARLET') {
                this.currentPlayerIndex = i;
                break;
            }
        }
    }

    // Continue implementing other methods as per your Java code
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const gridPane = document.getElementById('gridPane'); // Adjust the ID as per your HTML
    const turnIndicator = document.getElementById('turnIndicator'); // Adjust the ID as per your HTML
    const gameBoard = new GameBoard(7, 7);
    const controller = new Controller(gameBoard, gridPane, turnIndicator);
});
