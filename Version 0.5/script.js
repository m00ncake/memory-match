/**
 * Created by JTM on 4/20/17 for MEMORY MATCH V0.5
 */
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
var canIClick = true;

function make_unavailable(clickedCard) {
    matched_cards.push(clickedCard);
    if(matched_cards !== []) {
        clickedCard.off("click");
    }
    console.log(matched_cards);
}
//
//        function handleClick() {
//            if(canIClick) {
//                $(".card").on("click");
//            } else {
//                setTimeout(pauseClick, 2000);
//            }
//        }
//
//
//        function pauseClick() {
//            $(".card").off("click");
//        }

function attemptCounter() {
    attempt_counter++;
    $(".attempts").find(".value").text(attempt_counter);
}

function incrementCounter() {
    match_counter++;
}

function flip_card() {
    first_card_back.show();
    second_card_back.show();
    first_card_front = null;
    second_card_front = null;
    canIClick = true;
}

function game_on() {
    if(canIClick === false) {
        return;
    }
    $(this).find(".back").hide();
    if(first_card_front === null) {
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
        if(first_card_front[0] === second_card_front[0]) {
            setTimeout(flip_card, 1000);
        }else if(first_card_front.find("img").attr("src") === second_card_front.find("img").attr("src")) {
            incrementCounter();
            make_unavailable(first_card);
            make_unavailable(second_card);
            first_card_front = null;
            first_card_back = null;
            second_card_front = null;
            second_card_back = null;

            if(match_counter === total_possible_matches) {
                console.log("You have WON~!!");
            }
        } else {
            canIClick = false;
            setTimeout(flip_card, 2000);

//                    first_card_return.delay(2000).show(0.000001);
//                    second_card_return.delay(2000).show(0.000001);

        }
    }
}

$(document).ready(function() {
    $(".card").click(game_on);

});
