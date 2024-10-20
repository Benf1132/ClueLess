// Button action handlers
document.getElementById('upButton').addEventListener('click', function() {
    console.log('UP button clicked');
    movePlayer('up');
});

document.getElementById('leftButton').addEventListener('click', function() {
    console.log('LEFT button clicked');
    movePlayer('left');
});

document.getElementById('downButton').addEventListener('click', function() {
    console.log('DOWN button clicked');
    movePlayer('down');
});

document.getElementById('rightButton').addEventListener('click', function() {
    console.log('RIGHT button clicked');
    movePlayer('right');
});

document.getElementById('shortcutButton').addEventListener('click', function() {
    console.log('Shortcut button clicked');
    useShortcut();
});

document.getElementById('backButton').addEventListener('click', function() {
    console.log('Back button clicked');
    moveBack();
});

document.getElementById('endTurnButton').addEventListener('click', function() {
    console.log('End Turn button clicked');
    endTurn();
});

document.getElementById('showHandButton').addEventListener('click', function() {
    console.log('Show Hand button clicked');
    showHand();
});

document.getElementById('suggestionButton').addEventListener('click', function() {
    console.log('Suggestion button clicked');
    makeSuggestion();
});

document.getElementById('accusationButton').addEventListener('click', function() {
    console.log('Accusation button clicked');
    makeAccusation();
});

document.getElementById('logoutButton').addEventListener('click', function() {
    console.log('Logout button clicked');
    logout();
});

// Example functions for game actions
function movePlayer(direction) {
    console.log(`Player moves ${direction}`);
}

function useShortcut() {
    console.log('Player uses shortcut');
}

function moveBack() {
    console.log('Player moves back');
}

function endTurn() {
    console.log('Player ends turn');
}

function showHand() {
    console.log('Showing player hand');
}

function makeSuggestion() {
    console.log('Player makes a suggestion');
}

function makeAccusation() {
    console.log('Player makes an accusation');
}

function logout() {
    console.log('Player logs out');
}
