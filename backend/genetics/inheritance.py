def predict_inheritance(family):

    members = family["members"]

    affected = [m for m in members if m.get("affected")]

    males = [m for m in members if m["gender"] == "male"]
    females = [m for m in members if m["gender"] == "female"]

    male_affected = [m for m in males if m.get("affected")]
    female_affected = [m for m in females if m.get("affected")]

    # Rule 1: X-linked recessive (simple heuristic)
    if len(male_affected) > len(female_affected) * 2:
        return {
            "prediction": "x_linked_recessive",
            "confidence": 0.75,
            "reason": "More affected males than females suggest X-linked recessive inheritance"
        }

    # Rule 2: Autosomal dominant
    if len(affected) > 0 and len(affected) >= len(members) / 2:
        return {
            "prediction": "autosomal_dominant",
            "confidence": 0.70,
            "reason": "Trait appears in many individuals across generations"
        }

    # Rule 3: Autosomal recessive (default)
    return {
        "prediction": "autosomal_recessive",
        "confidence": 0.65,
        "reason": "Trait appears less frequently and may skip generations"
    }