class Suggestion {
    constructor(playerList, room, weapon, suspect) {
        this.playerList = playerList;
        this.room = room;         // Room object
        this.weapon = weapon;     // Weapon object
        this.suspect = suspect;   // Suspect Player object

        this.moveSuspectToRoom();
        this.moveWeaponToRoom();
        this.adjustRoomLayout();
    }

    // Move the suspect's character to the room's tile only if not already present
    moveSuspectToRoom() {
        const charactersInRoom = this.room.getCharacters();

        // Check if the suspect's character is already in the room
        const isSuspectInRoom = charactersInRoom.includes(this.suspect.getCharacter());

        if (!isSuspectInRoom) {
            this.suspect.getCharacter().move(this.room);
            this.room.addCharacter(this.suspect.getCharacter());
            this.suspect.setPulledBySuggestion(true);
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

        for (const character of charactersInRoom) {
            const characterElement = character.characterImageElement;
            characterElement.classList.add(`position-${positionIndex}`);
            positionIndex++;
        }

        positionIndex = 1;

        for (const weapon of weaponsInRoom) {
            const weaponElement = weapon.weaponImage;
            weaponElement.classList.add(`position-${positionIndex}`);
            positionIndex++;
        }
    }
}

export { Suggestion };
