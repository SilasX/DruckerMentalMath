function MultProbModel(topSize, bottomSize) {
    this.size = Math.max(topSize, bottomSize);
    this.topSize = topSize;
    this.bottomSize = bottomSize;
    this.width = 2*this.size;
    this.topRow = new Array();
    this.bottomRow = new Array();
    this.progressRows = new Array();
    this.finalRow = new Array();

    this.randomizeProblem = function() {
        for (var i = 0; i < this.size; i++) {
            if (i === this.size - 1) {
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

    this.resetProgress = function() {
        // rest progress area
        for (var i=0; i<this.bottomSize; i++) {
            this.progressRows[i] = new Array();
            for (var j=0; j<this.width; j++) {
                // zero out each progress row
                this.progressRows[i].push(0);
            }
        }
        // reset final answer
        this.finalRow = new Array();
        for (var i=0; i<this.width; i++) {
            this.finalRow.push(0);
        }
    };

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

    // helper for one-off rows
    this.addRowWith = function(cssClass) {
        var tabIndVal = 0;
        var cssSelector = "table." + cssClass;
        $(cssSelector).empty();
        for (var i=this.width-1; i>=0; i--) {
            var attrStr = ' pos="' + i + '" tabindex="' + tabIndVal + '" class="' + cssClass + '"';
            tabIndVal++;
            $(cssSelector).append('<td' + attrStr + '> </td>');
        }
    };

    // methods for picture number lookup

    // whether or not a number in the workspace needs to be memorized
    this.is_memorable = function(posx, posy) {
        // don't need to remember 0s, so offset by the number of the row
        var lower_bound = posx;
        // has number of memorable spaces quial to top row size + 1
        var upper_bound = posx + this.topSize;
        return posy >= lower_bound && posy <= upper_bound;
    };

    // return [lower, upper] bound of picture numbers
    this.picture_number_range = function(posx, posy) {
        // exit with null if outside of range for memorizing
        if (!this.is_memorable(posx, posy)) {
            return null;
        }
        var rowWidth = this.topSize + 1;
        // y position out of memorable slots; offset by row #
        var y_offset = posy - posx;
        // each row takes up this.width spaces,
        // and each number 10 spaces
        lower_pic_num = 10*(y_offset + posx * rowWidth);
        return [lower_pic_num, lower_pic_num + 9];
    };
}

