from repository import EquipmentNode
import sqlalchemy.orm
import sqlalchemy
import json


class Json2DbService:

    def __init__(self, path, session):
        self.path = path
        self.session = session

    def parse(self):
        with open(self.path) as f:
            db = json.load(f)
            print(db)
            for v in db:
                node = self.node_factory(v)
                session.add(node)
                session.commit()

    def node_factory(self, v):
        node = EquipmentNode()
        node.id = v["id"]
        node.label = v["label"]
        node.short_label = v["shortLabel"]
        node.parent_id = v["parentId"] if v["parentId"] != -1 else None
        node.order = v["order"]
        node.leaf = v["leaf"]
        node.unique = False
        node.required = False
        node.text = False
        return node


if __name__ == '__main__':
    print(sqlalchemy.__version__)

    uri = "postgresql://postgres:sa@localhost/cnrs_plateformes"
    engine = sqlalchemy.create_engine(uri, echo=True)
    Session = sqlalchemy.orm.sessionmaker(bind=engine, autocommit=False, autoflush=False)
    session = Session()
    service = Json2DbService("db.json", session)
    service.parse()

