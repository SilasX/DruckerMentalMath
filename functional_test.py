from time import sleep
import unittest

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

DEBUG_BUTTON_SELECTOR = "button.debug"
ERROR_SELECTOR = "div.errormsg"
ERROR_MSG = "Uh oh! One of your digits is wrong!"

class UserInputtingNumbers(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.css = self.driver.find_element_by_css_selector
        self.driver.get("http://localhost:8000/index.html")

    def test_indicate_error_vals(self):
        expected = u'2'
        driver = self.driver
        self.css(DEBUG_BUTTON_SELECTOR).click()
        workcell = self.css(".workarea td[posy='1'][posx='0']")
        choicecell = self.css(".numchoices td[tabindex='1']")
        # click the buttons to set tens place on 1st row to 2
        workcell.click()
        choicecell.click()
        actual = workcell.text
        self.assertEqual(expected, actual)
        # check that it has error class
        work_classes = workcell.get_attribute("class")
        self.assertIn("error", work_classes)
        # check that error message shows
        errorcell = self.css(ERROR_SELECTOR)
        self.assertEqual(ERROR_MSG, errorcell.text)
        # then correct error by placing 1 there
        choicecell2 = self.css(".numchoices td[tabindex='0']")
        choicecell2.click()
        self.assertEqual(u'1', workcell.text)
        work_classes = workcell.get_attribute("class")
        self.assertNotIn("error", work_classes)
        # check that error message is empty
        self.assertEqual("", errorcell.text)

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
        choicecell = self.css(".numchoices td[tabindex='7']")
        workcell.click()
        choicecell.click()
        actual = workcell.text
        self.assertEqual(expected, actual)

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
