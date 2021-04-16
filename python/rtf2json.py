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
        prevlevel = -1
        for item in self.db:
            id = item[0]
            level = item[1]
            short = item[2]
            pid = ids[level - 1] if level > 0 else -1
            label = short if level <= 1 else f"{[e for e in self.entities if e['id'] == pid][0]['label']} {short}"
            ids[level] = id
            if level <= prevlevel and prevlevel != -1:
                self.entities[-1]["leaf"] = True
            entity = self.entity(id, label, short, pid, order)
            self.entities.append(entity)
            order += 1
            prevlevel = level
        self.entities[-1]["leaf"] = True

    def entity(self, id, label, shortlabel, parentid, order):
        return {
            "id": id,
            "label": label,
            "shortLabel": shortlabel,
            "parentId": parentid,
            "order": order,
            "leaf": False,
        }

    def save(self, path):
        js = json.dumps(self.entities, indent=True)
        print(js)
        with open(path, "w") as f:
            f.write(js)


if __name__ == '__main__':
    print("MindMeisterRtfParser")
    print("====================")
    path = "../src/assets/Spectroscopie.rtf"
    p = MindMeisterRtfParser()
    p.load(path)
    p.convert()
    path = path.replace("Spectroscopie.rtf", "db.json")
    p.save(path)
