var setHandlers = function() {
    $(".workarea td, .finalanswer td").click(function() {
        probC.workClick($(this));
    });

    $(".numchoices td").click(function() {
        probC.choiceClick($(this));
    });

    $("button.debug").click(function() {
        probC.debugClick();
        setHandlers();
    });

    $("button.reset").click(function() {
        probC.resetProblem();
        setHandlers();
    });
};

$(document).ready(function() {
    probC = new MultProbController(3, 3);
    probC.resetProblem();
    // event handlers
    /*$("button.reset").click(function() {
        probC.resetProblem(); // reset in model then view
        probC.setHandlers();
    });*/
    probC.setHandlers(probC);
});
