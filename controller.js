function MultProbController(topSize, bottomSize) {

    var model = new MultProbModel(topSize, bottomSize);
    var view = new MultProbView();

    this.resetProblem = function() {
        // set model to some new random problem
        model.randomizeProblem();
        // reset progress in model
        model.resetProgress();
        // pass model to view
        view.showNewProblem(model);
    };

    /* handlers */

    // handle click in in the work or final area
    this.workClick = function(jqObj) {
        var writeSelector = ".workarea td, .finalanswer td";
        // make only this item selected
        view.setSelected(jqObj, writeSelector);
        // add choose digit message
        view.addMessage(view.CHOOSE_DIGIT_MSG, []);
    };

    // handle choice of number
    this.choiceClick = function(jqObj) {
        // add to view
        if (jqObj.attr("tabindex") !== undefined) {
            var chosenNum = jqObj.html()
            view.writeFromChoice(jqObj);
        }
        // add to model, depending on whether work or final
        // only one item should be selected
        var workSel = ".workarea td.selected"; // work area selector
        var finalSel = ".finalanswer td.selected"; // final area selector
        var errorStr = "error"; // error class string
        var posx = $(workSel).attr("posx");
        var posy = $(workSel).attr("posy");
        var pos = $(finalSel).attr("pos");
        if (posx !== undefined) { // if it found a workarea selected
            model.setWorkDigit(posx, posy, chosenNum);
            // add or remove error class
            if (model.isValidWork(posx, posy)) {
                $(workSel).removeClass(errorStr);
            } else {
                $(workSel).addClass(errorStr);
                view.addMessage(view.ERROR_MSG, ["errormsg"]);
            }
        }
        if (pos !== undefined) { // if it found final row selected
            model.finalRow[parseInt(pos, 10)] = parseInt(chosenNum,10);
            if (model.isValidFinalCell(pos)) {
                $(finalSel).removeClass(errorStr);
                // check for victory
                if (model.isValidFinal()) {
                    $(view.VIC_MSG_SELECTOR).html(view.VICTORY_MSG);
                }
            } else {
                $(finalSel).addClass(errorStr);
                view.addMessage(view.ERROR_MSG, ["errormsg"]);
                $(view.VIC_MSG_SELECTOR).empty();
            }
        }
    };

    this.debugClick = function() {
        model.setProb(123, 45);
        view.showNewProblem(model);
    };

    this.setHandlers = function(obj) {
        $(".workarea td, .finalanswer td").click(function() {
            obj.workClick($(this));
        });

        $(".numchoices td").click(function() {
            obj.choiceClick($(this));
        });

        $("button.debug").click(function() {
            obj.debugClick();
            obj.setHandlers(obj);
        });

        $("button.reset").click(function() {
            obj.resetProblem();
            obj.setHandlers(obj);
        });
    };
};

