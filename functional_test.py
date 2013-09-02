from time import sleep
import unittest

from selenium import webdriver

DEBUG_BUTTON_SELECTOR = "button.debug"
ERROR_MSG = "Uh oh! One of your digits is wrong!"
LAST_MSG_SELECTOR = ".statitem:last-child"
VIC_MSG_SELECTOR = "div.victorymsg";
VICTORY_MSG = "You win! You can do basic math!"


def num_selector(input_num):
    """helper function for writing selector for input number """
    if input_num > 0:
        num_str = str(input_num - 1)
    else:
        num_str = "10"
    return ".numchoices td[tabindex='" + num_str + "']"


class UserInputtingNumbers(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.css = self.driver.find_element_by_css_selector
        self.driver.get("http://localhost:8000/index.html")

    def test_indicate_error_vals(self):
        expected = u'2'
        driver = self.driver
        self.css(DEBUG_BUTTON_SELECTOR).click()
        # click the buttons to set tens place on 1st row to 2
        workcell = self.css(".workarea td[posy='1'][posx='0']")
        choicecell = self.css(num_selector(2))
        workcell.click()
        choicecell.click()
        actual = workcell.text
        self.assertEqual(expected, actual)
        # check that it has error class
        work_classes = workcell.get_attribute("class")
        self.assertIn("error", work_classes)
        # check that error message shows
        last_message = self.css(LAST_MSG_SELECTOR)
        self.assertEqual(ERROR_MSG, last_message.text)
        # ... and that it has errormsg class
        msg_classes = last_message.get_attribute("class")
        self.assertIn("errormsg", msg_classes)
        # then correct error by placing 1 there
        choicecell2 = self.css(num_selector(1))
        choicecell2.click()
        self.assertEqual(u'1', workcell.text)
        work_classes = workcell.get_attribute("class")
        self.assertNotIn("error", work_classes)
        # check that last message is not error
        # self.assertNotEqual(ERROR_MSG, last_message.text)

    def test_input_vals_after_restart(self):
        expected = u'8'
        driver = self.driver
        workcell = self.css(".workarea td[posy='2'][posx='1']")
        choicecell = self.css(".numchoices td[tabindex='7']")
        workcell.click()
        choicecell.click()
        # clear board and enter text again
        self.css(DEBUG_BUTTON_SELECTOR).click()
        workcell = self.css(".workarea td[posy='2'][posx='1']")
        choicecell = self.css(num_selector(8))
        workcell.click()
        choicecell.click()
        actual = workcell.text
        self.assertEqual(expected, actual)

    def test_victory(self):
        driver = self.driver
        self.css(DEBUG_BUTTON_SELECTOR).click()
        vic_msg_cell = self.css(VIC_MSG_SELECTOR)
        inputs = [5,3,5,5]
        for pos, val in enumerate(inputs):
            # click on final row
            self.css("td.finalitem[pos='" + str(pos) + "']").click()
            # click on appropriate value
            self.css(num_selector(val)).click()
            # if all inputs are in, check for victory message
            # otherwise, check for its absense
            if (pos == len(inputs) - 1):
                self.assertEqual(VICTORY_MSG, vic_msg_cell.text)
            else:
                self.assertEqual("", vic_msg_cell.text)
            ## clicking again should remove the victory msg
            #self.css("td.finalitem[pos='0']").click()
            #self.css(num_selector(9)).click()
            #self.assertEqual(u"", vic_msg_cell.text)

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
