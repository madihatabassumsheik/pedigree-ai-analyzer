def calculate_child_risk(members):

    father = None
    mother = None

    for member in members:

        if member.get("gender") == "male":
            father = member

        elif member.get("gender") == "female":
            mother = member

    if not father or not mother:

        return {
            "affected": "Unknown",
            "carrier": "Unknown",
            "normal": "Unknown"
        }

    father_genotype = (
        "aa" if father.get("affected")
        else "Aa"
    )

    mother_genotype = (
        "aa" if mother.get("affected")
        else "Aa"
    )

    # Aa x Aa

    if (
        father_genotype == "Aa"
        and mother_genotype == "Aa"
    ):
        return {
            "affected": "25%",
            "carrier": "50%",
            "normal": "25%"
        }

    # aa x Aa

    if (
        father_genotype == "aa"
        and mother_genotype == "Aa"
    ) or (
        father_genotype == "Aa"
        and mother_genotype == "aa"
    ):
        return {
            "affected": "50%",
            "carrier": "50%",
            "normal": "0%"
        }

    # aa x aa

    if (
        father_genotype == "aa"
        and mother_genotype == "aa"
    ):
        return {
            "affected": "100%",
            "carrier": "0%",
            "normal": "0%"
        }

    return {
        "affected": "Unknown",
        "carrier": "Unknown",
        "normal": "Unknown"
    }

def infer_genotypes(members):

    results = []

    for member in members:

        genotype = "Unknown"

        if member.get("affected"):

            genotype = "aa"

        else:

            genotype = "Aa"

        results.append({
            "name": member.get("name"),
            "genotype": genotype
        })

    return results

def validate_pedigree(family):

    warnings = []

    members = family.get("members", [])
    relationships = family.get("relationships", [])

    member_ids = {
        m["id"] for m in members
    }

    # Check 1: orphan nodes

    connected_nodes = set()

    for rel in relationships:

        connected_nodes.add(
            rel["source"]
        )

        connected_nodes.add(
            rel["target"]
        )

    for member in members:

        if member["id"] not in connected_nodes:

            warnings.append(
                f"{member.get('name', member['id'])} is not connected to anyone"
            )

    # Check 2: child without parents

    targets = [
        rel["target"]
        for rel in relationships
    ]

    for member in members:

        if (
            member["id"] in targets
            and not any(
                rel["target"] == member["id"]
                for rel in relationships
            )
        ):
            warnings.append(
                f"{member.get('name')} has no parent relationship"
            )

    # Check 3: generation order

    member_lookup = {
        m["id"]: m
        for m in members
    }

    for rel in relationships:

        parent = member_lookup.get(rel["source"])
        child = member_lookup.get(rel["target"])

        if (
            parent
            and child
            and parent.get("generation", 0)
                >= child.get("generation", 0)
        ):
            warnings.append(
                f"Generation issue between {parent.get('name')} and {child.get('name')}"
            )

    return warnings

def calculate_risk(prediction):

    if prediction == "autosomal_recessive":

        return {
            "affected_probability": "25%",
            "carrier_probability": "50%",
            "normal_probability": "25%",
            "example": "Aa × Aa"
        }

    if prediction == "autosomal_dominant":

        return {
            "affected_probability": "50%",
            "carrier_probability": "N/A",
            "normal_probability": "50%",
            "example": "Aa × aa"
        }

    if prediction == "x_linked_recessive":

        return {
            "affected_probability": "50% sons",
            "carrier_probability": "50% daughters",
            "normal_probability": "50%",
            "example": "XᴺXⁿ × XᴺY"
        }

    return {}

def build_analytics(members):

    total_members = len(members)

    affected_count = len([
        m for m in members
        if m.get("affected")
    ])

    male_count = len([
        m for m in members
        if m.get("gender") == "male"
    ])

    female_count = len([
        m for m in members
        if m.get("gender") == "female"
    ])

    generations = len(
        set(
            m.get("generation")
            for m in members
        )
    )

    return {
        "total_members": total_members,
        "affected_members": affected_count,
        "unaffected_members":
            total_members - affected_count,
        "male_members": male_count,
        "female_members": female_count,
        "generations": generations,
    }

def predict_inheritance(family):

    members = family.get("members", [])
    relationships = family.get("relationships", [])

    scores = {
        "autosomal_dominant": 0,
        "autosomal_recessive": 0,
        "x_linked_recessive": 0,
    }    

    validation_warnings = (
        validate_pedigree(family)
    )

    analytics = build_analytics(members)

    # -------------------------
    # Build lookup
    # -------------------------

    member_lookup = {
        m["id"]: m
        for m in members
    }

    # -------------------------
    # Affected by generation
    # -------------------------

    affected_generations = set()

    for m in members:
        if m.get("affected"):
            affected_generations.add(
                m.get("generation")
            )

    all_generations = set(
        m.get("generation")
        for m in members
    )

    # -------------------------
    # Check skipped generations
    # -------------------------

    missing_generation = False

    if len(all_generations) > 1:

        min_gen = min(all_generations)
        max_gen = max(all_generations)

        for g in range(min_gen, max_gen + 1):

            if (
                g not in affected_generations
            ):
                missing_generation = True

    # -------------------------
    # Father → Son transmission
    # -------------------------

    father_to_son = False

    for rel in relationships:

        if (
            rel.get("relationshipType")
            != "parent-child"
        ):
            continue

        parent = member_lookup.get(
            rel["source"]
        )

        child = member_lookup.get(
            rel["target"]
        )

        if not parent or not child:
            continue

        if (
            parent["gender"] == "male"
            and child["gender"] == "male"
            and parent["affected"]
            and child["affected"]
        ):
            father_to_son = True

    # -------------------------
    # Count affected males/females
    # -------------------------

    affected_males = len([
        m for m in members
        if (
            m["gender"] == "male"
            and m["affected"]
        )
    ])

    affected_females = len([
        m for m in members
        if (
            m["gender"] == "female"
            and m["affected"]
        )
    ])

    # ==================================================
    # RULE 1
    # Autosomal Dominant
    # ==================================================

    if (
        not missing_generation
        and len(affected_generations) >= 2
    ):
        risk = calculate_risk("autosomal_dominant")

        return {
            "prediction":
                "autosomal_dominant",

            "confidence": 0.90,

            "analytics": analytics,

            "reason":
                "Affected individuals appear in every generation.",

            "ai_explanation": generate_explanation("autosomal_dominant", members),

            "warnings": validation_warnings,

             "risk": risk,

            "genotypes": infer_genotypes(members),

            "future_child_risk": calculate_child_risk(members)
        }

    # ==================================================
    # RULE 2
    # X-linked Recessive
    # ==================================================

    if (
        affected_males >= 2
        and affected_females == 0
        and not father_to_son
    ):
        risk = calculate_risk("x_linked_recessive")

        return {
            "prediction":
                "x_linked_recessive",

            "confidence": 0.85,

            "analytics": analytics,

            "reason":
                "Affected males predominate and no father-to-son transmission was detected.",

            "ai_explanation": generate_explanation("x_linked_recessive", members),

            "warnings": validation_warnings,

            "risk": risk,

            "genotypes": infer_genotypes(members),

            "future_child_risk": calculate_child_risk(members)

        }

    # ==================================================
    # RULE 3
    # Autosomal Recessive
    # ==================================================

    if missing_generation:

        risk = calculate_risk("autosomal_recessive")

        return {
            "prediction":
                "autosomal_recessive",

            "confidence": 0.82,

            "analytics": analytics,

            "reason":
                "Trait appears to skip one or more generations.",
            
            "ai_explanation": generate_explanation("autosomal_recessive", members),
            
            "warnings": validation_warnings,

            "risk": risk,

            "genotypes": infer_genotypes(members),

            "future_child_risk": calculate_child_risk(members)
        }

    # ==================================================
    # Fallback
    # ==================================================

    return {
        "prediction": "uncertain",

        "confidence": 0.50,

        "analytics": analytics,

        "reason":
            "Insufficient pedigree evidence.",

        "ai_explanation": generate_explanation("", members),

        "warnings": validation_warnings,

        "risk": {
        "affected_probability": "Unknown",  
        "carrier_probability": "Unknown",
        "normal_probability": "Unknown",
        "example": "Insufficient data"
         },

        "genotypes": infer_genotypes(members),

        "future_child_risk": calculate_child_risk(members)
    }


def generate_explanation(
        prediction,
        members
    ):

        affected = [
            m for m in members
            if m.get("affected")
        ]

        generations = sorted(
            list(
                set(
                    m["generation"]
                    for m in affected
                )
            )
        )

        explanation = []

        explanation.append(
            f"Affected individuals appear in generations {generations}."
        )

        males = [
            m for m in affected
            if m["gender"] == "male"
        ]

        females = [
            m for m in affected
            if m["gender"] == "female"
        ]

        explanation.append(
            f"{len(males)} affected male(s) and {len(females)} affected female(s) were identified."
        )

        if prediction == "autosomal_dominant":

            explanation.append(
                "The trait appears across multiple generations and does not skip generations."
            )

        elif prediction == "autosomal_recessive":

            explanation.append(
                "The trait appears to skip generations, which is typical of recessive inheritance."
            )

        elif prediction == "x_linked_recessive":

            explanation.append(
                "Affected males predominate and no father-to-son transmission was observed."
            )

        return " ".join(explanation)