import sqlalchemy.ext.declarative
import sqlalchemy.orm
import sqlalchemy

Base = sqlalchemy.ext.declarative.declarative_base()


class EquipmentNode(Base):
    __tablename__ = "equipment_node"

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=False)
    label = sqlalchemy.Column(sqlalchemy.String(255), nullable=False)
    short_label = sqlalchemy.Column(sqlalchemy.String(50), nullable=False)
    parent_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('equipment_node.id'))
    children = sqlalchemy.orm.relationship("EquipmentNode", backref=sqlalchemy.orm.backref('parent', remote_side=[id]))
    order = sqlalchemy.Column(sqlalchemy.Float, nullable=False)
    leaf = sqlalchemy.Column(sqlalchemy.Boolean, nullable=False)

    def __repr__(self):
        return f"EquipmentNode {self.id} {self.short_label}"


class SOR(Base):
    __tablename__ = "sor"

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, )
    label = sqlalchemy.Column(sqlalchemy.String(255), nullable=False)
    platforms = sqlalchemy.orm.relationship("Platform", backref="sor")

    def __repr__(self):
        return f"SOR {self.id} {self.label}"


platform_equipment_association = sqlalchemy.Table(
    'platform_equipment', Base.metadata,
    sqlalchemy.Column('platform_id', sqlalchemy.Integer, sqlalchemy.ForeignKey('platform.id')),
    sqlalchemy.Column('equipment_id', sqlalchemy.Integer, sqlalchemy.ForeignKey('equipment.id'))
)


class Platform(Base):
    __tablename__ = "platform"

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, )
    label = sqlalchemy.Column(sqlalchemy.String(255))
    real = sqlalchemy.Column(sqlalchemy.Boolean, nullable=False)
    sor_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('sor.id'), nullable=False)
    equipments = sqlalchemy.orm.relationship("Equipment",
                                             secondary=platform_equipment_association,
                                             backref="platform")

    def __repr__(self):
        return f"Platform {self.id} {self.label}"


class Equipment(Base):
    __tablename__ = "equipment"

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, )
    label = sqlalchemy.Column(sqlalchemy.String(255))
    components = sqlalchemy.orm.relationship("Component", backref="equipment")
    equipment_node_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('equipment_node.id'),
                                          nullable=False)
    equipment_node = sqlalchemy.orm.relationship("EquipmentNode")

    def __repr__(self):
        return f"Equipment {self.id} {self.label}"


class Component(Base):
    __tablename__ = "component"

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, )
    label = sqlalchemy.Column(sqlalchemy.String(255))
    equipment_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('equipment.id'), nullable=False)
    equipment_node_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('equipment_node.id'),
                                          nullable=False)
    equipment_node = sqlalchemy.orm.relationship("EquipmentNode")

    def __repr__(self):
        return f"Component {self.id} {self.label}"


def create_ic():
    sor = SOR()
    sor.label = "Institut de la chimie du CNRS"
    platform = Platform()
    platform.real = False
    platform.sor = sor
    session.add(sor)
    session.commit()


if __name__ == '__main__':
    print(sqlalchemy.__version__)

    uri = "postgresql://postgres:sa@localhost/cnrs_plateformes"
    engine = sqlalchemy.create_engine(uri, echo=True)
    Base.metadata.create_all(engine)

    Session = sqlalchemy.orm.sessionmaker(bind=engine, autocommit=False, autoflush=False)
    session = Session()

    create_ic()
