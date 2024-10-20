// CharacterName Enum
const CharacterName = {
    MS_SCARLET: {
        name: 'Miss Scarlet',
        imagePath: 'images/players/miss_scarlet.png'
    },
    MRS_WHITE: {
        name: 'Mrs. White',
        imagePath: 'images/players/mrs_white.png'
    },
    MRS_PEACOCK: {
        name: 'Mrs. Peacock',
        imagePath: 'images/players/mrs_peacock.png'
    },
    MR_GREEN: {
        name: 'Mr. Green',
        imagePath: 'images/players/mr_green.png'
    },
    PROFESSOR_PLUM: {
        name: 'Professor Plum',
        imagePath: 'images/players/professor_plum.png'
    },
    COLONEL_MUSTARD: {
        name: 'Colonel Mustard',
        imagePath: 'images/players/colonel_mustard.png'
    }
};

// RoomName Enum
const RoomName = {
    STUDY: {
        name: 'Study',
        imagePath: 'images/tiles/study.jpg'
    },
    HALL: {
        name: 'Hall',
        imagePath: 'images/tiles/hall.jpg'
    },
    LOUNGE: {
        name: 'Lounge',
        imagePath: 'images/tiles/lounge.jpg'
    },
    LIBRARY: {
        name: 'Library',
        imagePath: 'images/tiles/library.jpg'
    },
    BILLIARD_ROOM: {
        name: 'Billiard Room',
        imagePath: 'images/tiles/billiard_room.jpg'
    },
    DINING_ROOM: {
        name: 'Dining Room',
        imagePath: 'images/tiles/dining_room.jpg'
    },
    CONSERVATORY: {
        name: 'Conservatory',
        imagePath: 'images/tiles/conservatory.jpg'
    },
    BALLROOM: {
        name: 'Ballroom',
        imagePath: 'images/tiles/ballroom.jpg'
    },
    KITCHEN: {
        name: 'Kitchen',
        imagePath: 'images/tiles/kitchen.jpg'
    }
};

// WeaponName Enum
const WeaponName = {
    ROPE: {
        name: 'Rope',
        imagePath: 'images/weapons/rope.png'
    },
    LEAD_PIPE: {
        name: 'Lead Pipe',
        imagePath: 'images/weapons/leadPipe.png' // Adjusted the case to match the filename
    },
    KNIFE: {
        name: 'Knife',
        imagePath: 'images/weapons/knife.png'
    },
    WRENCH: {
        name: 'Wrench',
        imagePath: 'images/weapons/wrench.png'
    },
    CANDLESTICK: {
        name: 'Candlestick',
        imagePath: 'images/weapons/candleStick.png' // Adjusted the case to match the filename
    },
    REVOLVER: {
        name: 'Revolver',
        imagePath: 'images/weapons/revolver.png'
    }
};

// TileType Enum
const TileType = {
    ROOM: 'ROOM',
    STARTING_SQUARE: 'STARTING_SQUARE',
    HALLWAY: 'HALLWAY',
    OUT_OF_BOUNDS: 'OUT_OF_BOUNDS'
};

// CardType Enum
const CardType = {
    SUSPECT: 'SUSPECT',
    WEAPON: 'WEAPON',
    ROOM: 'ROOM'
};

export { CharacterName, RoomName, TileType, WeaponName, CardType };
