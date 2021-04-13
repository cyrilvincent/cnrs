import json

dict = {
    0: {
        "id": 0,
        "label": "Equipement racine",
        "level": 0,
        "parentId": -1,
        "order": 0,
    }
}
s = "ABCDE"
parent = 0
key = 0
for i in range(5):
    key += 1
    dict[key] = {
        "id": key,
        "label": f"Equipement secondaire {s[i]}",
        "shortLabel": s[i],
        "level": 1,
        "parentId": parent,
        "order": i,
    }
    jparent = key
    for j in range(5):
        key += 1
        dict[key] = {
            "id": key,
            "label": f"Equipment {s[i]}-{s[j]}",
            "shortLabel": f"{s[i]}-{s[j]}",
            "level": 2,
            "parentId": jparent,
            "order": j,
        }
        kparent = key
        for k in range(5):
            key += 1
            dict[key] = {
                "id": key,
                "label": f"Equipment {s[i]}-{s[j]}-{s[k]}",
                "shortLabel": f"{s[i]}-{s[j]}-{s[k]}",
                "level": 3,
                "parentId": kparent,
                "order": k,
            }
            lparent = key
            for l in range(5):
                key += 1
                dict[key] = {
                    "id": key,
                    "label": f"Equipment {s[i]}-{s[j]}-{s[k]}-{s[l]}",
                    "shortLabel": f"{s[i]}-{s[j]}-{s[k]}-{s[l]}",
                    "level": 4,
                    "parentId": lparent,
                    "order": l,
                }
                mparent = key
                for m in range(5):
                    key += 1
                    dict[key] = {
                        "id": key,
                        "label": f"Equipment {s[i]}-{s[j]}-{s[k]}-{s[l]}-{s[m]}",
                        "shortLabel": f"{s[i]}-{s[j]}-{s[k]}-{s[l]}-{s[m]}",
                        "level": 5,
                        "parentId": mparent,
                        "order": m,
                    }

# print(dict)
json = json.dumps(dict, indent=True)
print(json)
with open("db.json", "w") as f:
    f.write(json)
