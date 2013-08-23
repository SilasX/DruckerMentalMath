test( "set problem", function() {
    var z = new MultProb(3);
    z.setProb(123, 45);
    deepEqual(z.topRow, [3,2,1], z.topRow );
    deepEqual(z.bottomRow, [5,4], z.bottomRow);
    ok(z.width === 5, "right width");
    ok(z.topSize === 3, "top row size");
    ok(z.bottomSize === 2, "top row size");
});

test("check math", function() {
    var z = new MultProb(3);
    var expectedWork = [
        [5,3,6,0,0],
        [0,2,9,3,0]
    ];
    var expectedMatch = [
        [true,false,true,true,true],
        [true,true,true,false,true]
    ];
    z.setProb(123, 45); //4920
    z.setNewProblem();
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
