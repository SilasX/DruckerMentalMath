from time import sleep
import unittest

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

DEBUG_BUTTON_SELECTOR = "button.debug"

class PythonOrgSearch(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.css = self.driver.find_element_by_css_selector

    def test_set_work_area_vals(self):
        expected = u'2'
        driver = self.driver
        driver.get("http://localhost:8000/index.html")
        self.css(DEBUG_BUTTON_SELECTOR).click()
        WebDriverWait(driver, 500)
        workcell = self.css(".workarea td[posy='1'][posx='0']")
        choicecell = self.css(".numchoices td[tabindex='1']")
        # click the buttons to set tens place on 1st row to 2
        workcell.click()
        choicecell.click()
        actual = workcell.text
        self.assertEqual(expected, actual)
        # check that it has error
        work_classes = workcell.get_attribute("class")
        self.assertIn("error", work_classes)

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
