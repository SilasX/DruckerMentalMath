#### The "Drucker-Flickr" Method for multiplying large numbers.

My implementation of [Andy Drucker's method](http://people.csail.mit.edu/andyd/rec_method.pdf) for multiplying large numbers without writing writing anything down (as an intermediate step anyway).  See [Scott Aarsonon's post](http://www.scottaaronson.com/blog/?p=728) for its significance in computational complexity.

The key trick behind it is this: if you have seen a picture before, you can remember *that* you have seen it, and distinguish it from ones you haven't seen.  So here's what you do:

1) Reserve (without looking at them) ten random pictures corresponding to digits 0-9.

2) Look at (only!) the one corresponding to the digit you want to "write down".

3) When you want to look up the number you've remembered this way, pull up the full 10-image block.  The one you remember tells you the digit you stored!

Then, it's just a matter of having a predictable mapping between a) blocks of images, and b) places in your multiplication workspace, so you don't have to write down which position goes with which image block.  This app will (eventually) do grunt work for you!

#### Installation

Clone the repo and open `index.html` in your favorite browser.

#### Implementation Details

This uses a pseudo-MVC design.  `script.js` instantiates a (MultProb)Controller, which uses the `setHandlers` method to listen for events, each of which calls a controller method that then makes appropriate calls to the (MultProb)Model or (MultProb)View. The Model handles internal representaiton of the multiplicaiton problem and the progress on it, while the View writes to the DOM to keep it in sync.

#### Tests and Development

Set up dependencies for development using virutalenv:

    virtualenv venv
    . ./venv/bin/activate
    pip install -r requirements.txt

##### Model tests (unit tests)
The test suite can be run simply by opening `test/qunit.html`, which uses the [QUnit](http://qunitjs.com/) testing framework.

##### Interaction tests with Selenium (functional tests)

Fire up a local server by running `python server.py`, then run `python functional_test.py` while that's active.

#### Usage

Sorry, so far this only gives you a sheet to work out multiplication problems.

But to do that, click on the square where you want to write something down, then on the appropriate digit in the number pad.

#### License

In light of the *grave* threat from possible *leeching* off my *hard* work, I have placed this under the MIT license.
