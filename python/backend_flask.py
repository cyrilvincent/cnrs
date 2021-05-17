import flask
import config

app = flask.Flask(__name__)


@app.route("/api")
def index():
    return flask.jsonify(config.version)


@app.route("/api/db")
def db():
    with open("db.json") as f:
        s = f.read()
        r = flask.Response(response=s,
                           status=200,
                           mimetype="application/json")
        return r


# if __name__ == '__main__':
#     app.run(host="0.0.0.0")
