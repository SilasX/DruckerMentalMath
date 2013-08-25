function MultProb(size) {
    this.size = size;
    this.topSize = size;
    this.bottomSize = size;
    this.width = 2*size;
    this.topRow = new Array();
    this.bottomRow = new Array();
    this.progressRows = new Array();
    this.finalRow = new Array();

    this.randomizeProblem = function() {
        for (var i = 0; i < size; i++) {
            if (i === size - 1) {
                // can't be zero; only 1-9
                this.topRow[i] = Math.floor(Math.random()*9 + 1);
                this.bottomRow[i] = Math.floor(Math.random()*9 + 1);
            }
            else {
                this.topRow[i] = Math.floor(Math.random()*10);
                this.bottomRow[i] = Math.floor(Math.random()*10);
            }
        }
    };

    this.randomizeProblem();

    // set the initial problem
    this.setProb = function(topNum, bottomNum) {
        this.topRow = to_array(topNum);
        this.bottomRow = to_array(bottomNum);
        this.topSize = this.topRow.length;
        this.bottomSize = this.bottomRow.length;
        this.size = Math.max(this.topSize, this.bottomSize);
        this.width = this.topSize + this.bottomSize;
    };

    // set a value of a digit in the workspace
    this.setWorkDigit = function(posxStr, posyStr, val) {
        var x = parseInt(posxStr, 10);
        var y = parseInt(posyStr, 10);
        this.progressRows[x][y] = parseInt(val);
    };

    // set array of values for a row in work space
    this.setWorkRow = function(rowi, num) {
        // zero out target row
        for (var i=0; i<this.width; i++) {
            this.progressRows[rowi][i] = 0;
        }
        // convert input integer to array, w/ 10s shift
        var outArray = to_array(num);
        // copy over elements to row of progressRows array
        for (var i=0; i<outArray.length; i++) {
            this.progressRows[rowi][i] = outArray[i];
        }
    };

    var to_array = function(num) {
        var output = [];
        while (num > 0) {
            var nextVal = num % 10;
            output.push(nextVal);
            num = Math.floor(num / 10);
        }
        // edge case of zero input
        if (output === []) {
            output = [0];
        }
        return output;
    };

    var to_integer = function(numList) {
        var output = 0;
        for (var i = 0; i < numList.length; i++) {
            output += numList[i]*Math.pow(10, i);
        }
        return output;
    };

    this.isValidWork = function(posx, posy) {
        // posx -> position in bottom row
        // posy -> position in top row
        var curVal = this.progressRows[posx][posy]
        // get the answer for the entire row
        // which is bottom * 10^bottom index * all of top
        var rowResult = this.bottomRow[posx] * Math.pow(10,posx) * to_integer(this.topRow);
        var shouldBe = Math.floor(rowResult/Math.pow(10, posy)) % 10;
        // then extract out the desired element
        return curVal === shouldBe;
    }

    this.isValidFinalCell = function(pos) {
        var curVal = this.finalRow[pos];
        // calculate correct final answer
        // pick out correct position of correct answer
        var finalAns = to_integer(this.topRow) * to_integer(this.bottomRow);
        var shouldBe = Math.floor(finalAns/Math.pow(10,pos)) % 10;
        return curVal === shouldBe;
    }

    this.isValidFinal = function() {
        var shouldBe = to_integer(this.topRow) * to_integer(this.bottomRow);
        return to_integer(this.finalRow) == shouldBe;
    }

    this.addDividerBar = function(spaces, selector) {
        $(selector).append('<tr class="bar"></tr>');
        for (var i = 0; i < spaces; i++) {
            $(selector + " tr.bar").append('<td> </td>');
        }
    };

    // overwrite given problem from model (M -> V)
    this.resetGivensDisplay = function() {
        // fill in the problem table
        var tabIndVal = 0;
        var mp_string = "table.multprob";
        $(mp_string).empty();
        $(mp_string).append('<tr class="toprow"></tr>');
        $(mp_string).append('<tr class="bottomrow"></tr>');
        for (var i = this.width - 1; i >= 0; i--) {
            if (i < this.topSize) {
                var topChar = this.topRow[i];
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
        for (var i = this.width - 1; i >= 0; i--) {
            if (i < this.bottomSize) {
                var bottomChar = this.bottomRow[i];
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
        this.addDividerBar(this.width, mp_string);
    }

    this.resetFinal = function() {
        var tabIndVal = 0;
        var mp_final = 'table.finalanswer';
        $(mp_final).empty();
        // reset model
        this.finalRow = [];
        for (var i=this.width-1; i>=0; i--) {
            // build up model with 0s
            this.finalRow.push(0);
            // fill in view
            var attrStr = ' pos="' + i + '" tabindex="' + tabIndVal + '" class="finalitem"';
            tabIndVal++;
            $(mp_final).append('<td' + attrStr + '> </td>');
        }
    };

    this.resetWorkDisplay = function() {
        var tabIndVal = 0;
        var mp_work = 'table.workarea';
        $(mp_work).empty();
        for (var i = 0; i < this.bottomSize; i++){
            // reset row model
            this.progressRows[i] = new Array();
            // add row view
            $(mp_work).append('<tr></tr>');
            for (var j = this.width - 1; j >= 0; j--) {
                // set up item in model
                this.progressRows[i].push(0);
                // add item to view
                var workStr = ' posx="' + i + '" posy="' + j + '" tabindex="' + tabIndVal  + '" class="workitem"';
                tabIndVal++;
                $(mp_work + " tr").last().append(
                    '<td' + workStr + '> </td>'
                );
            }
        }
        this.addDividerBar(this.width, mp_work);
    };

    // render new problem from model
    this.showNewProblem = function() {
        // clear status message area
        this.resetGivensDisplay();
        var tabIndVal = 0;
        // put the choices to the side
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
                    tabStr = ' tabindex="' + tabIndVal + '"';
                }
                tabIndVal++;
                // append key to last tr
                $(mp_choices + " tr").last().append(
                    '<td' + tabStr + '>' + numStr + '</td>'
                );
            }
        }
        // set up working area
        this.resetWorkDisplay();
        // set up final answer area
        this.resetFinal();
        $("div.statsmsg").html("Click on a box to select a place");
    };
}

// handle click in in the work or final area
var workClick = function() {
    var writeSelector = ".workarea td, .finalanswer td";
    $(writeSelector).click(function() {
        // clear all selected
        $(writeSelector).removeClass("selected");
        // make this one selected
        $(this).addClass("selected");
    });
};

// handle choice of number
var choiceClick = function() {
    $(".numchoices td").click(function() {
        // add to view
        if ($(this).attr("tabindex") !== undefined) {
            var chosenNum = $(this).html();
            $("td.selected").html(chosenNum);
        }
        // add to model, depend on whether work or final
        // only one item should be selected
        var workSel = ".workarea td.selected"; // work area selector
        var finalSel = ".finalanswer td.selected"; // final area selector
        var errorStr = "error"; // error class string
        var posx = $(workSel).attr("posx");
        var posy = $(workSel).attr("posy");
        var pos = $(finalSel).attr("pos");
        if (posx !== undefined) { // if it found a workarea selected
            prob.setWorkDigit(posx, posy, chosenNum);
            // add or remove error class
            if (prob.isValidWork(posx, posy)) {
                $(workSel).removeClass(errorStr);
            } else {
                $(workSel).addClass(errorStr);
            }
        }
        if (pos !== undefined) { // if it found final row selected
            prob.finalRow[parseInt(pos, 10)] = parseInt(chosenNum,10);
            if (prob.isValidFinalCell(pos)) {
                $(finalSel).removeClass(errorStr);
            } else {
                $(finalSel).addClass(errorStr);
            }
        }
    });
};

var debugClick = function() {
    $("button.debug").click(function() {
        prob.setProb(123, 45);
        prob.showNewProblem();
        setHandlers();
    });
}

var setHandlers = function() {
    workClick();
    choiceClick();
    debugClick();
};

$(document).ready(function() {
    // initialize TGame object
    prob = new MultProb(3);
    prob.randomizeProblem();
    prob.showNewProblem();
    // event handlers
    $("button.reset").click(function() {
        prob.randomizeProblem();
        prob.showNewProblem();
        setHandlers();
    });
    setHandlers();
});
