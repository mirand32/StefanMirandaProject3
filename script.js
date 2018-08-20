// Define Variables
let fishPositions=[];
let fishPositionsBad=[];
let playerScore=0;
let start=30;
let fishes=8;
let width = ($(window).width());
let height = ($(window).height());

$(function(){
    // Figure out how many fish based on screen size
    if (window.matchMedia("(min-width: 610px)").matches) {
        fishes = 6;
    } else if (window.matchMedia("(min-width: 400px)").matches) {
        fishes = 6;
    } else if (window.matchMedia("(min-width: 200px)").matches) {
        fishes = 4;
    }
    
    init();
    
    
    function init(){
        
        // Generate Fish
        for(let i=0; i<fishes;i++){
            generateFish(i);
        }
        
        // Listen for hook directions
        let keyPressListening=function(){
            document.addEventListener("keydown", dropHook);
            document.addEventListener("keydown", moveHook);   
        }
        
        // Move hook left and right;
        
        let moveHook=function(event){
            if (event.key === "ArrowLeft" && $(".hook").offset().left>50) {
                setInterval(collision, 10);
                $(".hook").animate({ left: "-=50px"}, {
                    duration: 10,
                    complete: $(".hook").stop()
                });
            }
            if (event.key === "ArrowRight" && $(".hook").offset().left + $(".hook").width()+50<width) {
                setInterval(collision, 10);
                $(".hook").animate({ left: "+=50px" }, {
                    duration: 10,
                    complete: $(".hook").stop()
                });
            }
        }
        
        // Cast the line to catch fish
        
        let dropHook= function(event){
            if (event.key === "ArrowDown" && $(".hook").offset().left<width) {
                document.removeEventListener("keydown", dropHook);  
                document.removeEventListener("keydown", moveHook);  
                setInterval(collision, 25);
                $(".hook").animate({ top: height - 50 - $(".hook").height() }, {
                    duration: 3000,
                    complete: function () {
                        $(".hook").animate({ top: 50 },{
                            complete: keyPressListening,
                        })
                        $(".hook").stop();
                    }
                });
            }
        }

        // Create check to see if fish are caught by the hook   
        function collision(){
            for(let i=0;i<fishPositions.length;i++){
                let x1=$('.hook').offset().left;
                let y1=$('.hook').offset().top;
                let x2=$(`.fish${i}`).offset().left;
                let y2=$(`.fish${i}`).offset().top;
                if (x1 > x2 +10 && x1 < (x2 + $(".fish").width()-40) && y1 + ($(".hook").height() / 2) > y2 && y1 < (y2 + 100)) {
                    $(".hook").stop();
                    $(".hook").animate({ top: 50 }, 100,"linear");
                    $(`.fish${i}`).stop();
                    $(`.fish${i}`).animate({ top: 0 }, 100, "linear");
                    if (y2<5){
                        $(`.fish${i}`).stop();
                        $(`.fish${i}`).remove();
                        generateFish(i);
                        keyPressListening();
                        if (fishPositions[i].score==="good"){
                            playerScore+=10;
                            $(".score").text("Score: "+playerScore);
                        }
                        else{
                            playerScore-=10;
                            $(".score").text("Score: " + playerScore);
                        }
                    }
                };
            }
        }
        keyPressListening();
    }
    //Function to move fish
    function animatethis(targetElement, speed) {
        $(targetElement).animate({ left: (width - $(".fish").width() - 50)},
        {
                duration: speed,
                complete: function () {
                    $(this).removeClass("flipped"),
                    targetElement.animate({ left: 0},
                        {
                            duration: speed,
                            complete: function () {
                                $(this).addClass("flipped"),
                                animatethis(targetElement, speed);
                            }
                        });
                    }
                });
            };
    //Generate fish and place them on the page
    function generateFish(i){
        if (i % 2 === 0) {
            $('.pond').append(`<div class="fish fish${i} flipped"><img src="images/khoi-fish.png" alt="A guy named Khoi angry terribly photoshopped onto a picture of cartoon fish that is red"></div>`);
        }
        else {
            $('.pond').append(`<div class="fish fish${i} flipped"><img src="images/bad-fish.png" alt="A guy named Khoi smiling terribly photoshopped onto a picture of cartoon fish that is orange"></div>`);
        }

        if (window.matchMedia("(min-width: 800px)").matches) {
            $(".fish img").css("width", 300)
        } else if (window.matchMedia("(min-width: 610px)").matches){
            $(".fish img").css("width",  200)
        } else if (window.matchMedia("(min-width: 400px)").matches) {
            $(".fish img").css("width", 180);
            $(".timer").css("text-align","right")
        } else if (window.matchMedia("(min-width: 200px)").matches) {
            $(".fish img").css("width", 120);
            $(".timer").css("text-align", "right")
        }
        //generate random Xcoordinate
        let fishX = Math.random() * (height - $(".hook").height()-$(".fish").height()) + $(".hook").height();
        $(`.fish${i}`).css("top", fishX);
        //generate random Ycoordinate
        let fishY = Math.random() * width - $(".fish").width();
        $(`.fish${i}`).css("left", fishY);
        // Create object of each fishes x and y coordinates
        let fishPositioned = {
            "x": fishX,
            "y": fishY
        };
        if (i%2===0){
            fishPositioned.score="good";
        }
        else{
            fishPositioned.score="bad"
        }
        fishPositions[i] = fishPositioned;
        // Call function to get fish to swim
        animatethis($(`.fish${i}`), Math.random() * 6000 + 1000);
    }
    
})

// Set Timer put in end screen text
setInterval(function () {
    if (start===0){
        $(".timer").css("display", "none");
        $(".hook").css("display", "none");
        $(".fish").css("display", "none");
        $(".final-score-message").css("display", "inline");
        $(".final-score").text(`Your score is ${playerScore}`)
        if(playerScore<=0){
            $(".final-score-message").text("Maybe just buy your fish at the store from now on???")
        }
        else if(playerScore<50){
            $(".final-score-message").text("You have the skills to catch as many Magikarps as you want...not that impressive though")
            
        }
        else{
            $(".final-score-message").text("Pretty sure you have the fishing skills to catch Poseidon if you wanted too")
        }
    }
    start-=1;
    $('.timer').text(start);
}, 1000);