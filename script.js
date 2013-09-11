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
