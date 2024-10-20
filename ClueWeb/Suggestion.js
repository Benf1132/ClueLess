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

    // Move the suspect's character to the room's tile
    moveSuspectToRoom() {
        this.suspect.move(this.room);
        this.room.addCharacter(this.suspect);

        for (const player of this.playerList) {
            if (player.character === this.suspect) {
                player.pulledBySuggestion = true;
                break;
            }
        }
    }

    // Move the weapon to the room's tile
    moveWeaponToRoom() {
        this.weapon.setCurrentTile(this.room);
        this.room.addWeapon(this.weapon);
    }

    // Adjust the layout of players and weapons in the room to avoid overlap
    adjustRoomLayout() {
        const charactersInRoom = this.room.getCharacters();
        const weaponsInRoom = this.room.getWeapons();

        const offsetStep = 10;
        let characterOffsetX = 0;
        let characterOffsetY = 0;
        let weaponOffsetX = 0;
        let weaponOffsetY = 0;

        // Adjust player positions
        for (const character of charactersInRoom) {
            const characterElement = document.getElementById(`character-${character.getCharacterName()}`);
            characterElement.style.transform = `translate(${characterOffsetX}px, ${characterOffsetY}px)`;
            characterOffsetX += offsetStep;
            characterOffsetY += offsetStep;
        }

        // Adjust weapon positions
        for (const weapon of weaponsInRoom) {
            const weaponElement = document.getElementById(`weapon-${weapon.getWeaponName()}`);
            weaponElement.style.transform = `translate(${weaponOffsetX}px, ${weaponOffsetY}px)`;
            weaponOffsetX += offsetStep;
            weaponOffsetY += offsetStep;
        }
    }
}

export { Suggestion };
