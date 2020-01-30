import numpy as np
import pandas as pd
import requests, json, time
from bs4 import BeautifulSoup
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def getApprovalRating(primeMinister):
    """
    Sends a HTTP request to get current PM's approval rating from YouGov

    Args:
        None

    Returns: 
        rating (int) : The current approval rating
    """
    try:
        r = requests.get("http://yougov.co.uk/topics/politics/explore/public_figure/" + primeMinister, allow_redirects=True, verify=False)
        source = r.text
        soup = BeautifulSoup(source, 'lxml')
        rating = soup.find('span', {'class' : 'result'})
        rating = rating.findAll('span')
        rating = str(rating[-3].contents[0]).strip()
    except:
        rating = "..."
        time.sleep(3)
    return rating

def getMigrationData():
    """
    Sends a HTTP request to get migration data from the ONS

    Args:
        None

    Returns: 
        migration (dataframe) : Time series dataframe of migration data
    """
    migration = pd.read_csv('data/migration.csv')
    yearEnding = np.array(migration['Year ending'])
    netMigration = np.array(migration['Net migration']) * 1000
    emigration = np.array(migration['Emigration'])
    immigration = np.array(migration['Immigration'])
    return yearEnding, netMigration, emigration, immigration

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