import os
from flask import Flask, flash, jsonify, redirect, render_template, request, session, url_for
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError

import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier

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
    """Get data from user"""

    # if request method is post run data operations
    if request.method == "POST":

        # get input values from form
        name = request.form.get("fullName")
        title = request.form.get("title")
        age = request.form.get("age")
        sex = request.form.get("gender")
        pclass = request.form.get("class")
        family = request.form.get("family")
        family = int(family) + 1

        # store forename in session
        name_arr = name.split()
        session["name"] = name_arr[0].capitalize()

        # if fields are missing return error message
        if not name or not title or not age or not sex or not pclass or not family:
            return render_template("error.html", title="Error", message="Please ensure the form is fully completed before submitting")
        # else run data operations
        else:
            # calculate length of title on value
            title_len_3 = [0, 3, 15]
            title_len_4 = [1, 4, 6, 8, 9, 11, 14]
            title_len_5 = [5, 10, 12, 16]
            title_len_6 = [2, 7]

            # if the title in array return name length
            if int(title) in title_len_3:
                title_len = 3
            elif int(title) in title_len_4:
                title_len = 4
            elif int(title) in title_len_5:
                title_len = 5
            elif int(title) in title_len_6:
                title_len = 6

            # calculate length of full name
            name_len =  title_len + len(name)

            # is alone
            if family == 1:
                isalone = 1
            else:
                isalone = 0

            # calculate average fare for pclass
            if int(pclass) == 1:
                fare = 84
            elif int(pclass) == 2:
                fare = 21
            elif int(pclass) == 3:
                fare = 14

            # numpy array of input values
            x = np.array([[int(pclass), int(sex), int(age), int(fare), int(family), int(isalone), int(title), name_len]])

            # unpickle model
            model = pickle.load(open("model.sav", 'rb'))

            # run model against input values
            result = model.predict(x)
            probability = model.predict_proba(x)
            survival_proba = round((probability[0][1] * 100), 2) 

            # prepare output response
            if int(result[0]) == 1:
                message = "would have survived"
            else:
                message = "would not have survived"
                
            # return results page
            return render_template("result.html", survival_proba=survival_proba, result=result, message=message)
    else:
        return render_template("index.html")


@app.route("/analysis", methods=['GET'])
def analysis():
    """Show analysis to user"""
    return render_template("analysis.html")

if __name__ == '__main__':
    app.run()