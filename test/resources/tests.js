test( "set problem", function() {
    var z = new MultProbModel(3, 3);
    z.setProb(123, 45);
    deepEqual(z.topRow, [3,2,1], z.topRow );
    deepEqual(z.bottomRow, [5,4], z.bottomRow);
    ok(z.width === 5, "right width");
    ok(z.topSize === 3, "top row size");
    ok(z.bottomSize === 2, "top row size");
});

test("check math", function() {
    var z = new MultProbModel(3, 3);
    var expectedWork = [
        [5,3,6,0,0],
        [0,2,9,3,0]
    ];
    var expectedMatch = [
        [true,false,true,true,true],
        [true,true,true,false,true]
    ];
    z.setProb(123, 45); //4920
    z.resetProgress();
    z.setWorkRow(0, 635);
    z.setWorkRow(1, 3920);
    deepEqual(z.progressRows[0], expectedWork[0], "set progress row 0");
    deepEqual(z.progressRows[1], expectedWork[1], "set progress row 1");
    // check that it gives the right value for .isValidWork
    // here, all are correct except 3 in first row
    for (var i=1; i<z.width; i++){
        for (var j=0; j<2; j++) {
            ok(z.isValidWork(j,i) === expectedMatch[j][i], "work check");
        }
    }
});

test("check final", function() {
    var z = new MultProbModel(3, 3);
    z.setProb(123, 45); // 123 * 45 = 5535
    ok(z.isValidFinal() === false ,"finds wrong");
    z.finalRow = [5,3,5,5,0];
    ok(z.isValidFinal() === true ,"finds correct");
    z.finalRow = [1,3,5,5,4];
    var expectedMatch = [false,true,true,true,false];
    for (var i=1; i<z.width; i++){
        ok(z.isValidFinalCell(i) === expectedMatch[i], "digit-wise");
    }
});

test("picture lookup numbers", function() {
    var z = new MultProbModel(3);
    z.setProb(123, 45);
    var expected_mem = [
        [true, true, true, true, false],
        [false, true, true, true, true]
    ];
    var expected_range = [
        [[0,9],[10,19],[20,29],[30,39],null],
        [null,[40,49],[50,59],[60,69],[70,79]]
    ];
    for (var i=0; i<z.bottomSize; i++) {
        for (var j=0; j<z.width; j++) {
            ok(z.is_memorable(i, j) === expected_mem[i][j], "is memorable @ " + i + "," + j);
        }
    }
});
