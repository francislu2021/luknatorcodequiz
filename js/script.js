// luknator timely code quiz
///SETUP
//testing if jQuery has loaded
if (window.jQuery) {
    //Display and hide sections and buttons
    windowLoad();
    showHideButtons();

    console.log("jQuery has loaded!");
} else {
    console.log("jQuery has not loaded!");
}

//creates a variable for each question
var $questions = $(".questions");
//total amount of questions
var total = $("> *", $questions).length;
//a counter for each question
var counter = 0;

///FUNCTIONS WE NEED
//show/hide these sections once page loads
function windowLoad() {
    $("#start-quiz-section").show();
    $("#active-quiz-section").hide();
    $("#quiz-results-section").hide();
}

//function that unchecks all input checkboxes
function resetResponses() {
    for (var i = 1; i < total + 1; i++) {
        $(".response-" + i).prop("checked", false);
    }
}

//shows/hides/disables/enables buttons
function showHideButtons() {
    //shows/hides/enables/disables on page load
    $(".review").hide();
    $(".submit").hide();
    $(".prev").attr("disabled", "disabled");

    indicators();

    if (counter == 0) {
        $(".prev").show();
        $(".next").show();
        $(".next").removeAttr("disabled", "disabled");
        $(".prev").attr("disabled", "disabled");
    } else if (counter == total - 1) {
        $(".review").show();
        $(".next").hide();
        $(".next").attr("disabled", "disabled");
        $(".prev").removeAttr("disabled", "disabled");
    } else {
        $(".next").show();
        $(".review").hide();
        $(".prev").removeAttr("disabled", "disabled");
        $(".next").removeAttr("disabled", "disabled");
    }
}

//creates the indicators
function indicators() {
    $(".indicators").html(" ");
    $(".question-number-change").html(" ");
    $(".question-number-change").append(
        "Question " + (counter + 1) + " of " + total
    );

    for (var i = 0; i < total; i++) {
        if (i == counter) {
            $(".indicators").append(
                "<li class=" + i + "><i class='fas fa-circle'></i></li>"
            );
        } else {
            $(".indicators").append(
                "<li class=" + i + "><i class='far fa-circle'></i></li>"
            );
        }
    }
}

//timer interval variable
var interval;

//function to stop the timer when exit button is clicked
function stopInterval() {
    clearInterval(interval);
}

//score variable
var score = 0;
//answer key
var answers = ["5", "blue", "4", "sea", "superior"];

//function that checks user response and answers
function checkResponse() {
    for (var i = 1; i < total + 1; i++) {
        if ($(".response-" + i).is(":checked")) {
            var userAns = $("input[name=response-" + i + "]:checked").val();
            if (userAns == answers[i - 1]) {
                score++;
            }
        }
    }
    var percent = score * 100 / total;
    $(".percent-result").append(percent + "%");
    $(".user-result").append(score + " out of " + total);
    changeCircle();

    //function that changes the colour of the graphic on the results section
    function changeCircle() {
        if (score == 0) {
            $(".circle-result").attr("class", "circle-result fas fa-frown");
            $(".circle-result").css({
                color: "#c2c2c2"
            });
        } else if (score > 0) {
            $(".circle-result").attr("class", "circle-result fas fa-check-circle");
            if (score > 3) {
                $(".circle-result").css({
                    color: "#a1f1b5"
                });
            } else if (score > 1) {
                $(".circle-result").css({
                    color: "#f5f59f"
                });
            } else {
                $(".circle-result").css({
                    color: "#f59f9f"
                });
            }
        }
    }
}

///BUTTON CLICK EVENTS
//start button
$(".start").click(function() {
    counter = 0;

    $("#active-quiz-section").show();
    $("#start-quiz-section").hide();
    $("#quiz-results-section").hide();
    $(".question-number-change").show();
    $(".question-number").hide();

    $(".timer")[0].innerHTML = "5:00";

    //when you click begin the 5 min timer starts
    interval = setInterval(function() {
        var timer = $(".timer")[0].innerHTML.split(":");
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        --seconds;
        minutes = seconds < 0 ? --minutes : minutes;
        if (minutes < 0) clearInterval(interval);
        seconds = seconds < 0 ? 59 : seconds;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $(".timer").html(minutes + ":" + seconds);
        $(".timer")[0].innerHTML = minutes + ":" + seconds;

        if ($(".timer")[0].innerHTML == "0:00") {
            stopInterval();

            $("#active-quiz-section").hide();
            $("#start-quiz-section").show();
        }
    }, 1000);

    //displays individual questions horizontally
    $("> *", $questions).css({
        display: "inline-block",
        verticalalign: "top"
    });

    showHideButtons();
    indicators();
});

//submit button
$(".submit").click(function() {
    $("#quiz-results-section").show();
    $("#active-quiz-section").hide();
    $(".question-number-change").hide();

    checkResponse();
});

//reset button
$(".reset").click(function() {
    stopInterval();
    resetResponses();
    $(".circle-result").attr("class", "circle-result");

    //hide and reset score
    score = 0;
    $(".percent-result")[0].innerHTML = " ";
    $(".user-result")[0].innerHTML = " ";

    //show/hide section
    $("#start-quiz-section").show();
    $("#quiz-results-section").hide();
});

//exit button
$(".exit").click(function() {
    stopInterval();
    resetResponses();

    $("#start-quiz-section").show();
    $("#active-quiz-section").hide();
    $("#quiz-results-section").hide();

    //animates the questions
    $questions.css({
        transition: "0.4s",
        transform: "translateX(-0%)"
    });
});

//Previous/next button
$(".prev, .next").on("click", function() {
    // Increment/decrement the counter depending on the clicked button
    counter = $(this).hasClass("next") ? ++counter : --counter;

    // Animates the questions
    $questions.css({
        transition: "0.4s",
        transform: "translateX(-" + 100 * counter + "%)"
    });

    showHideButtons();
    indicators();
});

//animates based on indicator pressed
$(".indicators").on("click", "li", function() {
    var indicatorsNumber = $(this).attr("class");

    //changes the indicator colour
    counter = indicatorsNumber;

    //animates the questions
    $questions.css({
        transition: "0.4s",
        transform: "translateX(-" + 100 * indicatorsNumber + "%)"
    });

    showHideButtons();
    indicators();
});

//review button
$(".review").click(function() {
    $(".questions").show();
    $(".question-number").show();
    $(".question-number-change").hide();

    //displays all questions vertically
    $("> *", $questions).css({
        display: "block",
        verticalalign: "none"
    });

    //animates the questions
    $questions.css({
        transition: "0.2s",
        transform: "translateX(0%)"
    });

    //displays submit button
    $(".submit").show();

    //hide buttons and indicators
    $(".review").hide();
    $(".prev").hide();
    $(".next").hide();
    $(".indicators").html(" ");
});