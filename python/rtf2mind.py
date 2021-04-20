import json

class MindMeisterRtfParser:

    def __init__(self):
        self.rownum = 0
        self.db = []
        self.entities = []

    def load(self, path):
        with open(path) as f:
            id = 0
            while True:
                row = self.next(f)
                if row is None:
                    break
                if row.startswith(r"\slmult0\ltrpar\li"):
                    index = row.rindex(r"\li")
                    s = row[index+3:]
                    level = int(int(s) / 200)
                    self.next(f)
                    row = self.next(f)
                    row = self.unicode(row)
                    self.db.append((id, level, row))
                    id += 1

    def next(self, f):
        row = f.readline()
        self.rownum += 1
        if row == "":
            return None
        return row.strip()

    def unicode(self, s):
        s = s.replace(r"\'3f", "")
        s = s.replace(r"\u201", "E")
        s = s.replace(r"\u224", "à")
        s = s.replace(r"\u232", "è")
        s = s.replace(r"\u233", "é")
        s = s.replace(r"\u234", "ê")
        s = s.replace(r"\u244", "ô")
        s = s.replace(r"\u246", "ö")
        s = s.replace(r"\u947", "γ")
        s = s.replace(r"\u8211", "-")
        s = s.replace(r"\u8217", "'")
        return s

    def convert(self):
        nblevel = max([item[1] for item in self.db]) + 1
        ids = []
        for i in range(nblevel):
            ids.append(-1)
        order = 0
        even = True
        for item in self.db:
            id = item[0]
            level = item[1]
            short = item[2]
            pid = ids[level - 1] if level > 0 else -1
            ids[level] = id
            entity = self.entity(id, short, pid)
            if pid == 0:
                if even:
                    entity["direction"] = "right"
                else:
                    entity["direction"] = "left"
                even = not even
            self.entities.append(entity)
            order += 1

    def entity(self, id, topic, parentid):
        if parentid == -1:
            return {
                "id": "root",
                "isroot": True,
                "topic": topic,
            }
        else:
            return {
                "id": "root" if id == 0 else str(id),
                "topic": topic,
                "parentid": "root" if parentid == 0 else str(parentid),
            }

    def save(self, path):
        dict = {"meta":
            {
                "name":"demo",
                "author":"contact@cyrilvincent.com",
                "version":"0",
            },
            "format":"node_array",
            "data":self.entities}
        js = json.dumps(dict, indent=True)
        with open(path, "w") as f:
            f.write("var dbmind = ")
            f.write(js)


if __name__ == '__main__':
    print("MindMeisterRtfParser")
    print("====================")
    path = "../src/assets/Spectroscopie.rtf"
    p = MindMeisterRtfParser()
    p.load(path)
    p.convert()
    path = path.replace("Spectroscopie.rtf", "mind.js")
    p.save(path)
