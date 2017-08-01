/***********************/
var first_card = null;
var first_card_front = null;
var first_card_back = null;
var second_card = null;
var second_card_front = null;
var second_card_back = null;
var matched_cards = [];
var total_possible_matches = 9;
var match_counter = 0;
var attempt_counter = 0;
var accuracy = 0;
var games_played = 0;
var canIClick = true;

function randomize(){
    var divArray = $('.card').toArray();
    while(divArray.length > 0){
        var randomOrder = Math.floor(Math.random() * divArray.length);
        var takeElement = divArray.splice(randomOrder, 1);
        $('#game-area').append(takeElement[0]);
    }
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

function reset_button_clicked() {
    //return all cards to original state
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
}

function flip_card() {
    first_card_back.show();
    second_card_back.show();
    first_card_front = null;
    second_card_front = null;
    canIClick = true;
}

function card_clicked() {
    if (canIClick === false) {
        return;
    }
    $(this).find(".back").hide();
    if (first_card_front === null) {
        first_card = $(this);
        first_card_back = $(this).find(".back");
        first_card_front = $(this).find(".front");
        first_card.addClass("clicked");
    } else {
        second_card = $(this);
        second_card_back = $(this).find(".back");
        second_card_front = $(this).find(".front");
        second_card.addClass("clicked");
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
                alert("You have WON~!!");
            }

        } else {
            canIClick = false;
            setTimeout(flip_card, 2000);

        }
        accuracyCounter();
    }
}

$(document).ready(function() {
    $(".card").click(card_clicked);
    $("button.reset").click(reset_button_clicked);

});


