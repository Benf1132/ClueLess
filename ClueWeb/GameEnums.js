// CharacterName "Enum"
const CharacterName = {
    MS_SCARLET: { imagePath: "images/players/miss_scarlet.png" },
    MRS_WHITE: { imagePath: "images/players/mrs_white.png" },
    MRS_PEACOCK: { imagePath: "images/players/mrs_peacock.png" },
    MR_GREEN: { imagePath: "images/players/mr_green.png" },
    PROFESSOR_PLUM: { imagePath: "images/players/professor_plum.png" },
    COLONEL_MUSTARD: { imagePath: "images/players/colonel_mustard.png" }
};

// RoomName "Enum"
const RoomName = {
    STUDY: { imagePath: "images/tiles/study.jpg" },
    HALL: { imagePath: "images/tiles/hall.jpg" },
    LOUNGE: { imagePath: "images/tiles/lounge.jpg" },
    LIBRARY: { imagePath: "images/tiles/library.jpg" },
    BILLIARD_ROOM: { imagePath: "images/tiles/billiard_room.jpg" },
    DINING_ROOM: { imagePath: "images/tiles/dining_room.jpg" },
    CONSERVATORY: { imagePath: "images/tiles/conservatory.jpg" },
    BALLROOM: { imagePath: "images/tiles/ballroom.jpg" },
    KITCHEN: { imagePath: "images/tiles/kitchen.jpg" }
};

// TileType "Enum"
const TileType = {
    ROOM: 'ROOM',
    STARTING_SQUARE: 'STARTING_SQUARE',
    HALLWAY: 'HALLWAY',
    OUT_OF_BOUNDS: 'OUT_OF_BOUNDS'
};

// WeaponName "Enum"
const WeaponName = {
    ROPE: { imagePath: "images/weapons/rope.png" },
    LEAD_PIPE: { imagePath: "images/weapons/leadPipe.png" }, // Fix case
    KNIFE: { imagePath: "images/weapons/knife.png" },
    WRENCH: { imagePath: "images/weapons/wrench.png" },
    CANDLESTICK: { imagePath: "images/weapons/candleStick.png" }, // Fix case
    REVOLVER: { imagePath: "images/weapons/revolver.png" }
};

// CardType "Enum"
const CardType = {
    SUSPECT: 'SUSPECT',
    WEAPON: 'WEAPON',
    ROOM: 'ROOM'
};

export { CharacterName, RoomName, TileType, WeaponName, CardType };
