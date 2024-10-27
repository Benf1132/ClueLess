class Suggestion {
    constructor(playerList, room, weapon, suspect) {
        this.playerList = playerList;
        this.room = room;
        this.weapon = weapon;
        this.suspect = this.matchSuspectToPlayer(suspect);

        this.moveSuspectToRoom();
        this.moveWeaponToRoom();
        this.adjustRoomLayout();
    }

    // Method to find the player that matches the suspect's name
    matchSuspectToPlayer(suspect) {
        for (const player of this.playerList) {
            if (player.character === suspect) {
                return player.character;
            }
        }
        throw new Error("No matching player found for the suspect.");
    }

    // Move the suspect's character to the room's tile only if not already present
    moveSuspectToRoom() {
        const charactersInRoom = this.room.getCharacters();
    
        // Check if the suspect is already in the room
        if (!charactersInRoom.includes(this.suspect)) {
            this.suspect.move(this.room);
            this.room.addCharacter(this.suspect);
    
            // Mark the player as "pulled by suggestion"
            for (const player of this.playerList) {
                if (player.character === this.suspect) {
                    player.pulledBySuggestion = true;
                    break;
                }
            }
        }
    }
    
    // Move the weapon to the room's tile only if not already present
    moveWeaponToRoom() {
        const weaponsInRoom = this.room.getWeapons();
    
        // Check if the weapon is already in the room
        if (!weaponsInRoom.includes(this.weapon)) {
            this.weapon.setCurrentTile(this.room);
            this.room.addWeapon(this.weapon);
        }
    }

    adjustRoomLayout() {
        const charactersInRoom = this.room.getCharacters();
        const weaponsInRoom = this.room.getWeapons();
    
        let positionIndex = 1;
    
        // Adjust character positions by adding classes
        for (const character of charactersInRoom) {
            const characterElement = character.characterImageElement;
            characterElement.classList.add(`position-${positionIndex}`);
            positionIndex++;
        }
    
        // Reset position index for weapons
        positionIndex = 1;
    
        // Adjust weapon positions by adding classes
        for (const weapon of weaponsInRoom) {
            const weaponElement = weapon.weaponImage; // Direct access to weaponImage element
            weaponElement.classList.add(`position-${positionIndex}`);
            positionIndex++;
        }
    }
}

export { Suggestion };
