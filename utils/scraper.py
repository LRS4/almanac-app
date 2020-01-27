import numpy as np
import pandas as pd
import requests
from bs4 import BeautifulSoup

def getDailyBriefing():
    """
    Sends a HTTP request to get The Week's daily briefing

    Args:
        None

    Returns: 
        newsHtml (str) : The HTML snippet parsed from the request
    """
    try:
            r = requests.get("https://www.theweek.co.uk/dailybriefing", allow_redirects=True, verify=False)
            source = r.text
            soup = BeautifulSoup(source, 'lxml')
            newsHtml = soup.findAll('div', {'class' : 'field-items'})
            newsHtml = str(newsHtml[0]).replace('href="', 'href="https://www.theweek.co.uk')
    except:
        newsHtml = "<br/>Error :( News feed failed to load... try refreshing the page"
    
    return newsHtml