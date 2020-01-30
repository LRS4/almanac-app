import numpy as np
import pandas as pd
import requests, json
from bs4 import BeautifulSoup

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