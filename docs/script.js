
var previousClick;
var first_card = null;
var first_card_front = null;
var first_card_back = null;
var second_card = null;
var second_card_front = null;
var second_card_back = null;
var winAnimation = "animated zoomInUp";
var suggestAnimation = "animated shake";
var cardClickAnimation = "animated pulse";
var onAnimationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
var soundToggle = new Audio("audio/ttg_bloop-off.mp3");
var winAudio = new Audio("audio/ttg_theme.mp3");
var clickAudio1 = new Audio("audio/ttg_crack.mp3");
var clickAudio2 = new Audio("audio/ttg_wack.mp3");
var clickAudio3 = new Audio("audio/ttg_smack.mp3");
var clickAudio4 = new Audio("audio/ttg_crack-a-lika-smack-smack.mp3");
var clickAudioArr = [
    clickAudio1, clickAudio1, clickAudio1, clickAudio1,
    clickAudio2, clickAudio2, clickAudio2, clickAudio2,
    clickAudio3, clickAudio3, clickAudio3, clickAudio3,
    clickAudio4
    ];
var matchAudio = new Audio("audio/ttg_booyah.mp3");
var matched_cards = [];
var total_possible_matches = 9;
var match_counter = 0;
var attempt_counter = 0;
var accuracy = 0;
var games_played = 0;
var canIClick = true;
var cardBackArr = ["card_background.png"];
var cardFrontArr = [
    "front_collage.png",
    "front_robin.png",
    "front_starfire.png",
    "front_rainbow.png",
    "front_wow.png",
    "front_group.png",
    "front_robin.png",
    "front_group.png",
    "front_wow.png",
    "front_collage.png",
    "front_beastboy.png",
    "front_raven.png",
    "front_cyborg.png",
    "front_raven.png",
    "front_rainbow.png",
    "front_starfire.png",
    "front_cyborg.png",
    "front_beastboy.png"
    ];

function randomizedClickAudio() {
    //randomizes the sound when the cards are clicked
    var tempSoundArr = clickAudioArr.slice();
    var randomOrder = Math.floor(Math.random() * tempSoundArr.length);
    var selectSound = tempSoundArr[randomOrder];
    console.log(selectSound);
    return selectSound;

}

function build_cards(){
    //builds out the 18 cards for the game board
    var tempCardFrontArr = cardFrontArr.slice();
    while(tempCardFrontArr.length > 0){
        var randomOrder = Math.floor(Math.random() * tempCardFrontArr.length);
        var takeElement = tempCardFrontArr.splice(randomOrder, 1);
        var $card = $("<div>", {
            class: "card animated flipInY",
        });
        var $front = $("<div>", {
            class: "front",
        });
        var $back = $("<div>", {
            class: "back",
        });
        var $frontimg = $("<img>", {
            src: "images/" + takeElement[0]
        }); 
        var $backimg = $("<img>", {
            src: "images/card_background.png"
        });
        $front.append($frontimg);
        $back.append($backimg);
        $card.append($front).append($back);
        $("#game-area").append($card); 
    }

}

function toggleAudio() {
    //toggles the audio on/off when the volume logo is clicked
    console.log("sound muted");
    console.log("click audi0:", clickAudio2.muted);    
    $(".mute a span")
        .toggleClass("glyphicon-volume-up glyphicon-volume-off")
        .removeClass("bounce")
        .addClass("rubberBand")
        .one(onAnimationEnd, function(){
            $(".mute a span").removeClass("rubberBand");
        });
    soundToggle.play();    
    clickAudio1.muted = !clickAudio1.muted;
    clickAudio2.muted = !clickAudio2.muted;
    clickAudio3.muted = !clickAudio3.muted;
    clickAudio4.muted = !clickAudio4.muted;
    console.log('click audio:', clickAudio1.muted, clickAudio2.muted, clickAudio3.muted);
    matchAudio.muted = !matchAudio.muted;
    console.log('match audio:', matchAudio.muted);
    winAudio.muted = !winAudio.muted;
    console.log('win audio:', winAudio.muted);
    
}

function volumeUp() {
    //turns volume up to full 
    clickAudio1.volume = 1;
    clickAudio2.volume = 1;
    clickAudio3.volume = 1;
    clickAudio4.volume = 1;
    
}

function volumeDown() {
    //turns volume down to a minimum
    clickAudio1.volume = 0.1;
    clickAudio2.volume = 0.1;
    clickAudio3.volume = 0.1;   
    clickAudio4.volume = 0.1;   
    
}

function make_unavailable(clickedCard) {
    //makes a clicked card unavailable so it cannot be clicked again
    matched_cards.push(clickedCard);
    if(matched_cards !== []) {
        clickedCard.off("click");
    }
}

function attemptCounter() {
    //increases the counter for the number of times the player have attempted to make a match
    attempt_counter++;
    $(".attempts").find(".value").text(attempt_counter);
}

function incrementCounter() {
    //increases the counter for the number of matches the player have made
    match_counter++;
}

function accuracyCounter() {
    //calculates the player accuracy in percentage
    accuracy = Math.round((match_counter/attempt_counter)*100);
    $(".accuracy").find(".value").text(accuracy + "%");
}

function reset_stats () {
    //resets all of the stats on the left diplay
    match_counter = 0;
    attempt_counter = 0;
    $(".attempts").find(".value").text(attempt_counter);
    accuracy = 0;
    $(".accuracy").find(".value").text(accuracy + "%");
}

function remove_game_area() {
    //removes all the cards from the game area so a new set can populate
    $("#game-area").empty();
}

function reset_button_clicked() {
    //return all cards to original state then randomizes cards
    reset_stats();
    $(".card").find(".back").show();
    $(".card").off("click");
    $(".card").click(card_clicked);
    games_played++;
    $(".games-played").find(".value").text(games_played);
    matched_cards = [];
    first_card_front = null;
    first_card_back = null;
    second_card_front = null;
    second_card_back = null;
    remove_game_area();
    build_cards();
    $(".card").click(card_clicked);    
}

function flip_card() {
    //flips both cards over when no match has been made
    first_card_back.show();
    second_card_back.show();
    first_card_front = null;
    second_card_front = null;
    canIClick = true;
}

function alert_win() {
    //alerts the player when all matches have been made
    winAudio.play();
    $(".win-modal-bg").addClass(winAnimation).toggle();
    $(".close-win-modal").click(function(){
        $(".win-modal-bg").hide();
        reset_button_clicked();
    });
}


function card_clicked() {
    //runs everytime a card is clicked
    volumeUp();
    $(".card").removeClass("animated flipInY");
    $(this).addClass(cardClickAnimation).one(onAnimationEnd, function(){
        $(this).removeClass(cardClickAnimation);
    });

    if (canIClick === false) {
        return;
    }

    if (this == previousClick) {
        $(".suggest").addClass(suggestAnimation).one(onAnimationEnd, function(){
            $(".suggest").removeClass(suggestAnimation);
        }).show();
        return;
    }
    $(this).find(".back").hide();

    if (first_card_front === null) {
        previousClick = this;
        first_card = $(this);
        first_card_back = $(this).find(".back");
        first_card_front = $(this).find(".front");
        first_card.addClass("clicked");

    } else {
        second_card = $(this);
        second_card_back = $(this).find(".back");
        second_card_front = $(this).find(".front");
        second_card.addClass("clicked");
        $(".suggest").hide();
        previousClick = null;
        attemptCounter();

        if (first_card_front[0] === second_card_front[0]) {
            setTimeout(flip_card, 1000);

        } else if (first_card_front.find("img").attr("src") === second_card_front.find("img").attr("src")) {
            volumeDown();
            matchAudio.play();
            incrementCounter();
            make_unavailable(first_card);
            make_unavailable(second_card);
            first_card_front = null;
            first_card_back = null;
            second_card_front = null;
            second_card_back = null;

            if (match_counter === total_possible_matches) {
                setTimeout(alert_win, 500);
            }

        } else {
            canIClick = false;
            setTimeout(flip_card, 1200);

        }
        accuracyCounter();
    }
    randomizedClickAudio().play();

}

$(document).ready(function() {
    build_cards();
    $(".mute a").click(toggleAudio);
    $(".card").click(card_clicked);
    $("button.reset").click(reset_button_clicked);
});


