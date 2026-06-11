def analyze_aquarium(water_type, volume, selected_species):
    warnings = []
    score = 100
    
    # Rule 1: Water Type Compatibility
    for sp in selected_species:
        if sp.water_type != water_type:
            warnings.append({"type": "error", "message": f"{sp.name} wymaga wody: {sp.water_type}, a zbiornik to: {water_type}."})
            score -= 50

    # Rule 2: Bioload Capacity
    total_bioload = sum(sp.bioload for sp in selected_species)
    if total_bioload > volume:
        overload = total_bioload - volume
        warnings.append({"type": "error", "message": f"Przekroczono pojemność biologiczną o {overload} litrów! Zbyt dużo ryb."})
        score -= 30
    elif total_bioload > volume * 0.8:
        warnings.append({"type": "warning", "message": "Zbiornik jest blisko maksymalnego obciążenia biologicznego (powyżej 80%)."})
        score -= 10

    # Rule 3: Behavioral Tags Analysis (Predator vs small, territorial etc.)
    tags_in_tank = []
    for sp in selected_species:
        sp_tags = [t.strip().lower() for t in sp.tags.split(",") if t.strip()]
        for tag in sp_tags:
            tags_in_tank.append((sp.name, tag))

    has_predator = any(tag == "predator" for _, tag in tags_in_tank)
    has_peaceful = any(tag == "peaceful" for _, tag in tags_in_tank)

    if has_predator and has_peaceful:
        warnings.append({"type": "error", "message": "Ryzyko łańcucha pokarmowego: W zbiorniku znajdują się drapieżniki oraz gatunki łagodne."})
        score -= 40

    # Rule 4: Territorial aggression
    territorial_count = sum(1 for _, tag in tags_in_tank if tag == "territorial")
    if territorial_count > 1 and volume < 200:
        warnings.append({"type": "warning", "message": "Wiele ryb terytorialnych w małym zbiorniku (<200l) może prowadzić do agresji."})
        score -= 20

    score = max(0, score)

    return {
        "compatibility_score": score,
        "total_bioload": total_bioload,
        "capacity": volume,
        "warnings": warnings
    }
