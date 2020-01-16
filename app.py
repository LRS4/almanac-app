import os
from flask import Flask, flash, jsonify, json, redirect, render_template, request, session, url_for
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError

import numpy as np
import pandas as pd

# PEP8 Python Validator Tool: http://pep8online.com/

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True


# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.route("/", methods=['GET', 'POST'])
def index():
    """Show introduction screen"""
    marker = 'home'
    return render_template("index.html", marker=marker)


@app.route("/population", methods=['GET'])
def population():
    """Show population statistics"""
    marker = 'population'
    return render_template("population.html", marker=marker)

@app.route("/map", methods=['GET'])
def map():
    """Show map"""
    marker = 'map'
    return render_template("map.html", marker=marker) 

@app.route("/sources", methods=['GET'])
def sources():
    """Show data sources list"""
    return render_template("sources.html")

@app.route("/tools", methods=['GET'])
def tools():
    """Show tools list"""
    return render_template("tools.html")  

if __name__ == '__main__':
    app.run()