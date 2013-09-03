function MultProbView() {
    // set up constants
    this.CHOOSE_WORK_MSG = "Click on a box to select a place";
    this.CHOOSE_DIGIT_MSG = "Now click on a digit from the pad to the right";
    this.ERROR_MSG = "Uh oh! One of your digits is wrong!"
    this.STAT_BOX_SELECTOR = "div.statusbox";
    this.VIC_MSG_SELECTOR = "div.victorymsg";
    this.VICTORY_MSG = "You win! You can do basic math!";

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
        $("td.selected").html(chosenNum);
    };

    this.resetWorkDisplay = function(model) {
        var tabIndVal = 0;
        var mp_work = 'table.workarea';
        $(mp_work).empty();
        for (var i = 0; i < model.bottomSize; i++){
            //// reset row model
            //this.progressRows[i] = new Array();
            // add row view
            $(mp_work).append('<tr></tr>');
            for (var j = model.width - 1; j >= 0; j--) {
                //// set up item in model
                //this.progressRows[i].push(0);
                // add item to view
                var workStr = ' posx="' + i + '" posy="' + j + '" tabindex="' + tabIndVal  + '" class="workitem"';
                tabIndVal++;
                $(mp_work + " tr").last().append(
                    '<td' + workStr + '> </td>'
                );
            }
        }
        this.addDividerBar(model, mp_work);
    };

    this.resetFinalDisplay = function(model) {
        var tabIndVal = 0;
        var mp_final = 'table.finalanswer';
        $(mp_final).empty();
        //// reset model
        //this.finalRow = [];
        for (var i=model.width-1; i>=0; i--) {
            //// build up model with 0s
            //this.finalRow.push(0);
            // fill in view
            var attrStr = ' pos="' + i + '" tabindex="' + tabIndVal + '" class="finalitem"';
            tabIndVal++;
            $(mp_final).append('<td' + attrStr + '> </td>');
        }
    };

    this.addDividerBar = function(model, selector) {
        $(selector).append('<tr class="bar"></tr>');
        for (var i = 0; i < model.width; i++) {
            $(selector + " tr.bar").append('<td> </td>');
        }
    };

    // overwrite given problem from model (M -> V)
    this.resetGivensDisplay = function(model) {
        // fill in the problem table
        var tabIndVal = 0;
        var mp_string = "table.multprob";
        $(mp_string).empty();
        $(mp_string).append('<tr class="toprow"></tr>');
        $(mp_string).append('<tr class="bottomrow"></tr>');
        // set up top row
        for (var i = model.width - 1; i >= 0; i--) {
            if (i < model.topSize) {
                var topChar = model.topRow[i];
                if (topChar === undefined) {
                    topChar = " ";
                }
                var givenStr = ' class="givennum"';
            } else {
                var topChar = " ";
                var givenStr = ' class="padposition"';
            }
            var posStr = 'pos="' + i + '"';
            // append the two numbers to multiply
            $("tr.toprow").append('<td ' + posStr + givenStr + '>' + topChar + '</td>');
        }
        // set up bottom row
        for (var i = model.width - 1; i >= 0; i--) {
            if (i < model.bottomSize) {
                var bottomChar = model.bottomRow[i];
                if (bottomChar === undefined) {
                    bottomChar = " ";
                }
                var givenStr = ' class="givennum"';
            } else {
                var bottomChar = " ";
                var givenStr = ' class="padposition"';
            }
            $("tr.bottomrow").append('<td ' + posStr + givenStr + '>' + bottomChar + '</td>');
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
        var mp_choices = "table.numchoices";
        $(mp_choices).empty();
        for (var i = 0; i <= 3; i++) {
            $(mp_choices).append('<tr></tr>');
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
                    tabStr = ' tabindex="' + tabIndVal + '" id="num' + numStr + '"';
                }
                tabIndVal++;
                // append key to last tr
                $(mp_choices + " tr").last().append(
                    '<td' + tabStr + '>' + numStr + '</td>'
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
    
};

