function MultProbView() {
    // set up constants
    this.CHOOSE_WORK_MSG = "Click on a box to select a place";
    this.CHOOSE_DIGIT_MSG = "Now click on a digit to get your reminder of it"
    this.ERROR_MSG = "Uh oh! One of your digits is wrong!"
    this.STAT_BOX_SELECTOR = ".statusbox";
    this.VIC_MSG_SELECTOR = "div.victorymsg span";
    this.PIC_BOX_SELECTOR = "div.picview"
    this.VICTORY_MSG = "You win! You can do basic math!";
    this.NO_MEM_NEEDED = "You don't need fancy memory tricks for that cell!"

    this.setSelected = function(jqObj, otherSelector) {
        // set jqObj to "selected", removed that class from
        // everythnig in otherSelector
        // clear all selected
        $(otherSelector).removeClass("selected");
        // make this one selected
        jqObj.addClass("selected");
    
    };

    // given chosen element, write the number in that element to
    // work or final area
    this.writeFromChoice = function(jqObj) {
        var chosenNum = jqObj.html();
        $("span.selected").html(chosenNum);
    };

    this.bs_spanclass = function(model) {
        return "span2";
    };

    this.resetWorkDisplay = function(model) {
        var tabIndVal = 0;
        var mp_work = '.workarea';
        $(mp_work).empty();
        for (var i = 0; i < model.bottomSize; i++){
            //// reset row model
            //this.progressRows[i] = new Array();
            // add row view
            $(mp_work).append('<div class="row"></div>');
            for (var j = model.width - 1; j >= 0; j--) {
                //// set up item in model
                //this.progressRows[i].push(0);
                // add item to view
                var workStr = ' posx="' + i + '" posy="' + j + '" tabindex="' + tabIndVal  + '" class="' + this.bs_spanclass(model)  + ' workitem"';
                tabIndVal++;
                $(mp_work + " div").last().append(
                    '<span' + workStr + '> </span>'
                );
            }
        }
        this.addDividerBar(model, mp_work);
    };

    this.resetFinalDisplay = function(model) {
        var tabIndVal = 0;
        var mp_final = '.finalanswer';
        $(mp_final).empty();
        $(mp_final).append('<div class="row">');
        for (var i=model.width-1; i>=0; i--) {
            // fill in view
            var attrStr = ' pos="' + i + '" tabindex="' + tabIndVal + '" class="' + this.bs_spanclass(model) + ' finalitem"';
            tabIndVal++;
            $(mp_final + " div.row").append('<span' + attrStr + '> </span>');
        }
        $(mp_final).append('</div>');
    };

    this.addDividerBar = function(model, selector) {
        $(selector).append('<div class="' + this.bs_spanclass(model)  + ' bar"></div>');
        for (var i = 0; i < model.width; i++) {
            $(selector + " div.bar").append('<span class="' + this.bs_spanclass(model)  + '> </span>');
        }
    };

    // overwrite given problem from model (M -> V)
    this.resetGivensDisplay = function(model) {
        // fill in the problem table
        var tabIndVal = 0;
        var mp_string = ".multprob";
        $(mp_string).empty();
        $(mp_string).append('<div class="row toprow"></div>');
        $(mp_string).append('<div class="row bottomrow"></div>');
        // set up top row
        for (var i = model.width - 1; i >= 0; i--) {
            if (i < model.topSize) {
                var topChar = model.topRow[i];
                if (topChar === undefined) {
                    topChar = " ";
                }
                var givenStr = ' givennum"';
            } else {
                var topChar = " ";
                var givenStr = ' padposition"';
            }
            var posStr = ' pos="' + i + '"';
            // append the two numbers to multiply
            $("div.toprow").append('<span class="' + this.bs_spanclass(model) + '" ' + posStr + '>' + topChar + '</span>');
        }
        // set up bottom row
        for (var i = model.width - 1; i >= 0; i--) {
            if (i < model.bottomSize) {
                var bottomChar = model.bottomRow[i];
                if (bottomChar === undefined) {
                    bottomChar = " ";
                }
                var givenStr = ' givennum"';
            } else {
                var bottomChar = " ";
                var givenStr = ' padposition"';
            }
            var posStr = ' pos="' + i + '"';
            $("div.bottomrow").append('<span class="' + this.bs_spanclass(model) + givenStr + posStr + '>' + bottomChar + '</span>');
        }
        // append the divider bar
        this.addDividerBar(model, mp_string);
    };

    this.addMessage = function(msg, classList) {
        $(this.STAT_BOX_SELECTOR).append("<div class='statitem'>" + msg + "</span>");
        for (var i=0; i<classList.length; i++) {
            $(".statitem:last-child").addClass(classList[i]);
        }
        $(this.STAT_BOX_SELECTOR).scrollTop($(this.STAT_BOX_SELECTOR).scrollHeight);
    };

    // render new problem from model
    this.showNewProblem = function(model) {
        // clear status message area
        this.resetGivensDisplay(model);
        var tabIndVal = 0;
        // set up ths user interface for digit choices
        var mp_choices = ".numchoices";
        $(mp_choices).empty();
        for (var i = 0; i <= 3; i++) {
            $(mp_choices).append('<p></p>');
            for (var j = 1; j <= 3; j++) {
                var tabNum = true; // whether to make entry clickable
                var cur_val = 3*i + j;
                var numStr = " ";
                if (cur_val <= 9) {
                    numStr = cur_val.toString();
                }
                else {
                    if (cur_val === 11) {
                        numStr = "0";
                    }
                    else {
                        tabNum = false;
                    }
                }
                var tabStr = '';
                if (tabNum){
                    tabStr = ' class="' + 'span4'  + '" tabindex="' + tabIndVal + '" id="num' + numStr + '"';
                }
                tabIndVal++;
                // append key to last tr
                $(mp_choices + " p").last().append(
                    '<span' + tabStr + '>' + numStr + '</span>'
                );
            }
        }
        // set up working area
        this.resetWorkDisplay(model);
        // set up final answer area
        this.resetFinalDisplay(model);
        // initialize messages
        this.addMessage(this.CHOOSE_WORK_MSG, []);
        $(this.VIC_MSG_SELECTOR).empty();
    };

    this.showPicture = function(pictureNum) {
        this.addMessage("You would be shown picture #" + pictureNum);
    };

    this.showRange = function(lowerVal, upperVal) {
        return "You would be shown the pictures from " + lowerVal + " to " + upperVal;
    };
};

