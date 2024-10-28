import { CharacterName, RoomName, WeaponName, getEnumName } from './GameEnums.js';

class Suggestion {
    constructor(playerList, room, weapon, suspect) {
        this.playerList = playerList;
        this.room = getEnumName(RoomName, room);
        this.weapon = getEnumName(WeaponName, weapon);
        this.suspect = getEnumName(CharacterName, suspect);
        
        this.moveSuspectToRoom();
        this.moveWeaponToRoom();
        this.adjustRoomLayout();
    }
    
    // Move the suspect's character to the room's tile only if not already present
    moveSuspectToRoom() {
        const charactersInRoom = this.room.getCharacters();
        
        // Find if the suspect (by name) is already in the room
        const isSuspectInRoom = charactersInRoom.some(character => {
            const characterDisplayName = getEnumName(CharacterName, character.characterName);
            return characterDisplayName === this.suspect;
        });
    
        if (!isSuspectInRoom) {
            const suspectCharacter = this.playerList.find(player => {
                return getEnumName(CharacterName, player.character.characterName) === this.suspect;
            })?.character;

            if (suspectCharacter) {
                suspectCharacter.move(this.room);
                this.room.addCharacter(suspectCharacter);

                // Mark the player as "pulled by suggestion"
                const pulledPlayer = this.playerList.find(player => player.character === suspectCharacter);
                if (pulledPlayer) {
                    pulledPlayer.pulledBySuggestion = true;
                }
            }
        }
    }
    
    // Move the weapon to the room's tile only if not already present
    moveWeaponToRoom() {
        const weaponsInRoom = this.room.getWeapons();

        // Check if the weapon (by name) is already in the room
        const isWeaponInRoom = weaponsInRoom.some(roomWeapon => {
            const weaponDisplayName = getEnumName(WeaponName, roomWeapon.weaponName);
            return weaponDisplayName === this.weapon;
        });
        
        if (!isWeaponInRoom) {
            const weaponObject = this.room.matchWeapon(this.weapon); // Method to retrieve weapon instance by name
            if (weaponObject) {
                weaponObject.setCurrentTile(this.room);
                this.room.addWeapon(weaponObject);
            }
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
            const weaponElement = weapon.weaponImage;
            weaponElement.classList.add(`position-${positionIndex}`);
            positionIndex++;
        }
    }
}

export { Suggestion };
