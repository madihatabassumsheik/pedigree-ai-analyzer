import json
import random

def generate_family(id_num):
    inheritance_types = [
        "autosomal_recessive",
        "autosomal_dominant",
        "x_linked_recessive"
    ]

    inh = random.choice(inheritance_types)

    family = {
        "family_id": f"FAM{id_num:03}",
        "inheritance_type": inh,
        "members": [
            {
                "id": "I-1",
                "gender": "male",
                "affected": random.choice([True, False]),
                "carrier": False
            },
            {
                "id": "I-2",
                "gender": "female",
                "affected": random.choice([True, False]),
                "carrier": False
            }
        ]
    }

    return family


data = [generate_family(i) for i in range(1, 51)]

with open("pedigrees.json", "w") as f:
    json.dump(data, f, indent=2)

print("Dataset generated successfully!")