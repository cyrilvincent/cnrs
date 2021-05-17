import flask
import media

app = flask.Flask(__name__)

@app.route("/")
def index():
    return f"""<html>
                    <body>
                        <h1>Hello World!</h1>
                        <br>Depuis le poste de Cyril
                    </body>
                </html>"""

@app.route("/toto/titi/<param>")
def toto(param):
    return f"""<html>
                    <body>
                        <h1>Hello World!</h1>
                        <br>Depuis le poste de Cyril {param}
                    </body>
                </html>"""

app.run(host="0.0.0.0")
