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
            // Use the createDropdown() method to create the dropdown for characters
            const characterNames = availableCharacters.map(character => character.getCharacterName().toString());
            const select = this.createDropdown(characterNames); // Replaces the dropdown creation logic
    
            const dialog = document.createElement('div');
            dialog.classList.add('player-setup-dialog');
    
            // Use the createLabel() method to create labels
            const usernameLabel = this.createLabel('Enter username:');
            const usernameInput = document.createElement('input');
            usernameInput.type = 'text';
    
            const passwordLabel = this.createLabel('Enter password:');
            const passwordInput = document.createElement('input');
            passwordInput.type = 'password';
    
            const characterLabel = this.createLabel('Choose your character:');
    
            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Confirm';
    
            // Append labels, inputs, and button to the dialog
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

        const neighbors = currentTile.getNeighbors();
        const allNeighborsOccupied = neighbors.every(neighbor => neighbor.isOccupied());

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
        } 
        
        if(allNeighborsOccupied) {
            this.showErrorAlert("No Valid Moves", "All available hallways are blocked. Either end your turn without moving or make an accusation/suggestion first.");
            return;
        } else if (newTile.isOccupied()) {
                this.showErrorAlert("Invalid Move", "You cannot move to an occupied hallway.");
                return;
        }
        
        character.move(newTile);
        this.tileMoved = true;
        this.updateCharacterPosition(character);
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
            this.showErrorAlert("Invalid End Turn", "You must move to a nearby room or make an accusation before ending your turn.");
            return;
        }

        if (currentTile instanceof Room && 
            !this.tileMoved && 
            !this.suggestionMade) {
            this.showErrorAlert("Invalid End Turn", "You must move to a hallway or make a suggestion/accusation before ending your turn.");
            return;
        }
       
        // Combine both confirmation checks into one dialog
        let confirmationMessage = "Are you sure you want to end your turn?";
        if (currentTile instanceof Room && !this.suggestionMade) {
            confirmationMessage = "Are you sure you would like to end your turn without making a suggestion/accusation first?";
        }
    
        // Single confirmation dialog
        if (confirm(confirmationMessage)) {
            // Reset turn flags and move to next player
            this.resetTurnFlags();
            this.nextPlayer();
            this.updateTurnIndicator();
        }
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
            if (currentPlayer.wasPulledBySuggestion) {
                currentPlayer.setPulledBySuggestion(false);
                this.showSuggestionDialog(currentPlayer, currentTile);
            } else {
                if (this.tileMoved) {
                    this.showSuggestionDialog(currentPlayer, currentTile);
                } else {
                    if (currentTile.isCornerRoom) {
                        this.showErrorAlert("Invalid Suggestion", "To make a suggestion here you must re-enter the room via a hallway or take a shortcut to the opposite room.");
                    } else {
                        this.showErrorAlert("Invalid Suggestion", "To make a suggestion here you must re-enter the room via a hallway.");
                    }
                }
            }
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
            this.disproveSuggestionOrAccusation(player, suspect, weapon, room, true);
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
        const currentPlayer = this.getCurrentPlayer();
        const currentTile = currentPlayer.getCharacter().getCurrentTile();

        if (currentTile instanceof StartSquare) {
            this.showErrorAlert("Invalid Accusation", "You cannot make an accusation from a start square.");
            return;
        }
    
        this.showAccusationDialog(currentPlayer, currentTile);
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
                this.disproveSuggestionOrAccusation(player, suspect, weapon, room, false);
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
    
    async disproveSuggestionOrAccusation(suggestor, suspect, weapon, room, isSuggestion) {
        const players = this.gameBoard.getPlayers();
        const suggestorIndex = players.indexOf(suggestor);
    
        let disproven = false;
        let disproofPlayer = null;
        let disproofCard = null;
    
        // Loop through players starting from the one after the suggestor
        for (let i = 1; i < players.length; i++) {
            const currentIndex = (suggestorIndex + i) % players.length;
            const player = players[currentIndex];
    
            if (player === suggestor) continue;
    
            // Ask for password to verify player identity
            await this.checkPlayerPassword(player);
    
            // Change the theory message based on whether it's a suggestion or an accusation
            const theoryMessage = isSuggestion
                ? `${suggestor.getUsername()} suggests that ${suspect.getCharacterName()} committed the crime with the ${weapon.getWeaponName()} in the ${room.getRoomName()}.`
                : `${suggestor.getUsername()} accuses ${suspect.getCharacterName()} of committing the crime with the ${weapon.getWeaponName()} in the ${room.getRoomName()}.`;
    
            // Check if the current player has cards to disprove the theory
            const matchingCards = player.getMatchingCards(suspect, weapon, room);
    
            if (matchingCards.length > 0) {
                // Player has matching cards to disprove the theory
                const selectedCard = await this.showTheoryAndCardChoiceDialog(player, matchingCards, theoryMessage);
                disproofCard = selectedCard;
                disproofPlayer = player;
                disproven = true;
    
                // Notify the suggestor of the disproven card
                this.showInfoAlert('Theory Disproved', `${disproofPlayer.getUsername()} disproved your theory with the card: ${disproofCard.getName()}`);
                break; // Stop after the first disproof
            } else {
                // No matching cards; show the theory and "no cards" message in the same dialog
                await this.showTheoryAndCardChoiceDialog(player, [], theoryMessage, true); // Passing true to indicate no cards
            }
        }
    
        // If no players could disprove the theory
        if (!disproven) {
            this.showInfoAlert('Theory Not Disproven', "No players could disprove your theory.");
        }
    
        // End turn and move to the next player
        this.resetTurnFlags();
        this.nextPlayer();
        this.updateTurnIndicator();
    }
    
    showTheoryAndCardChoiceDialog(player, matchingCards, theoryMessage) {
        return new Promise((resolve) => {
            // Create a dialog allowing the player to choose one card to disprove the theory
            const dialog = document.createElement('dialog');
            dialog.classList.add('dialog');
            dialog.setAttribute('open', '');
    
            // Display the theory message
            const theoryLabel = this.createLabel(theoryMessage);
            dialog.appendChild(theoryLabel);
    
            // Dropdown for selecting a card
            const cardDropdown = this.createDropdown(matchingCards.map(card => card.getName()));
            dialog.appendChild(this.createLabel(`${player.getUsername()}, choose a card to disprove:`));
            dialog.appendChild(cardDropdown);
    
            // Confirm button to submit the chosen card
            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Confirm';
            dialog.appendChild(confirmButton);
    
            confirmButton.addEventListener('click', () => {
                const selectedCard = matchingCards.find(card => card.getName() === cardDropdown.value);
                resolve(selectedCard);
                dialog.close();
                document.body.removeChild(dialog);
            });
    
            document.body.appendChild(dialog);
        });
    }

    async endGame(winningPlayer, suspect, weapon, room) {
        // Loop through each player to display the winner message
        for (let i = 0; i < players.length; i++) {
            const currentIndex = (suggestorIndex + i) % players.length;
            const player = players[currentIndex];
            
            // Display the winner message to the current player
            await this.showWinnerMessage(winningPlayer, suspect, weapon, room, currentPlayer);
        }
    
        // After showing the message to all players, reset the game
        this.resetGame();
    }
    
    // Helper function to display the winner message asynchronously
    showWinnerMessage(winningPlayer, suspect, weapon, room, currentPlayer) {
        return new Promise((resolve) => {
            // Show an alert with the winning message
            alert(`${currentPlayer.username}, ${winningPlayer.username} wins! The crime was committed by ${suspect.getCharacterName()} with the ${weapon.getWeaponName()} in the ${room.getRoomName()}.`);
            
            // Resolve the promise to continue to the next player
            resolve();
        });
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
            if (!(currentTile instanceof Room)) {
                 this.showErrorAlert("Invalid Move", "You must be in a corner room to use the shortcut.");
            } else {
                this.showErrorAlert("Move Already Made", "You have already moved. Wait until next turn to access the shortcut!");
            }
            return;
        }
    
        if (!(currentTile instanceof Room) || !currentTile.isCornerRoom) {
            this.showErrorAlert("Invalid Move", "You must be in a corner room to use the shortcut.");
            return;
        }
    
        const secretNeighbor = currentTile.getNeighbor('secret');
        character.move(secretNeighbor);
        this.tileMoved = true;
        this.updateCharacterPosition(character);
    }

    logoutButton() {
        const confirmLogout = confirm("You're about to logout!");
        if (confirmLogout) {
            console.log("You successfully logged out!");
            window.close();
        }
    }

    async checkPlayerPassword(currentPlayer) {
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

document.addEventListener('DOMContentLoaded', () => {
    // Wrap the initialization in an async function
    const initGame = async () => {
        const gridPane = document.getElementById('grid-container');
        const turnIndicator = document.getElementById('turnIndicator');

        const gameBoard = new Gameboard(7, 7);

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
