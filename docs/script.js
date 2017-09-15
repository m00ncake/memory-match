
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
var winAudio = new Audio("audio/ttg_theme_song.mp3");
var clickAudio = new Audio("audio/ttg_crack.mp3");
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

function build_cards(){
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
        console.log(($frontimg).attr("src"));
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
    console.log("sound muted");
    $(".mute a span").toggleClass("glyphicon-volume-up glyphicon-volume-off");
    clickAudio.muted = !clickAudio.muted;
    winAudio.muted = !winAudio.muted;
}

function make_unavailable(clickedCard) {
    matched_cards.push(clickedCard);
    if(matched_cards !== []) {
        clickedCard.off("click");
    }
}

function attemptCounter() {
    attempt_counter++;
    $(".attempts").find(".value").text(attempt_counter);
}

function incrementCounter() {
    match_counter++;
}

function accuracyCounter() {
    accuracy = Math.round((match_counter/attempt_counter)*100);
    $(".accuracy").find(".value").text(accuracy + "%");
}

function reset_stats () {
    match_counter = 0;
    attempt_counter = 0;
    $(".attempts").find(".value").text(attempt_counter);
    accuracy = 0;
    $(".accuracy").find(".value").text(accuracy + "%");
}

function remove_game_area() {
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
    first_card_back.show();
    second_card_back.show();
    first_card_front = null;
    second_card_front = null;
    canIClick = true;
}

function alert_win() {
    winAudio.play();
    $(".win-modal-bg").addClass(winAnimation).toggle();
    $(".close-win-modal").click(function(){
        $(".win-modal-bg").hide();
        reset_button_clicked();
    });
}


function card_clicked() {
    clickAudio.play();
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
            incrementCounter();
            make_unavailable(first_card);
            make_unavailable(second_card);
            first_card_front = null;
            first_card_back = null;
            second_card_front = null;
            second_card_back = null;

            if (match_counter === total_possible_matches) {
                setTimeout(alert_win, 800);
            }

        } else {
            canIClick = false;
            setTimeout(flip_card, 1200);

        }
        accuracyCounter();
    }
}

$(document).ready(function() {
    build_cards();
    $(".mute a").click(toggleAudio);
    $(".card").click(card_clicked);
    $("button.reset").click(reset_button_clicked);
});


