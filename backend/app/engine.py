from typing import List, Tuple
from .models import Species

def analyze_aquarium(water_type: str, volume: float, selected_species: List[Tuple[Species, int]]):
    warnings = []
    score = 100
    species_details = []
    
    # Rule 1: Water Type Compatibility
    for sp, qty in selected_species:
        if sp.water_type != water_type:
            warnings.append({"type": "error", "message": f"{sp.name} wymaga wody: {sp.water_type}, a zbiornik to: {water_type}."})
            score -= 50

    # Rule 2: Bioload Capacity
    total_bioload = sum(sp.bioload * qty for sp, qty in selected_species)
    
    for sp, qty in selected_species:
        species_bioload = sp.bioload * qty
        percentage = (species_bioload / volume) * 100 if volume > 0 else 0
        species_details.append({
            "id": sp.id,
            "name": sp.name,
            "quantity": qty,
            "total_bioload": species_bioload,
            "percentage_of_tank": round(percentage, 1)
        })

    if total_bioload > volume:
        overload = total_bioload - volume
        warnings.append({"type": "error", "message": f"Przekroczono pojemność biologiczną o {overload} litrów! Zbyt dużo ryb."})
        score -= 30
    elif total_bioload > volume * 0.8:
        warnings.append({"type": "warning", "message": "Zbiornik jest blisko maksymalnego obciążenia biologicznego (powyżej 80%)."})
        score -= 10

    # Rule 3: Behavioral Tags Analysis
    tags_in_tank = []
    for sp, qty in selected_species:
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

    # Rule 5: Water Parameters Compatibility (pH and Temp)
    recommended_parameters = None
    if selected_species:
        overall_ph_min = max(sp.ph_min for sp, qty in selected_species)
        overall_ph_max = min(sp.ph_max for sp, qty in selected_species)
        overall_temp_min = max(sp.temp_min for sp, qty in selected_species)
        overall_temp_max = min(sp.temp_max for sp, qty in selected_species)
        
        if overall_ph_min > overall_ph_max:
            warnings.append({"type": "error", "message": f"Konflikt pH! Ryby wymagają wykluczających się zakresów pH."})
            score -= 40
            
        if overall_temp_min > overall_temp_max:
            warnings.append({"type": "error", "message": f"Konflikt temperatury! Ryby wymagają wykluczających się temperatur."})
            score -= 40
            
        # Food derivation based on tags
        food_types = set()
        for sp, qty in selected_species:
            if "predator" in sp.tags:
                food_types.add("Mięsny (żywy/mrożony)")
            elif "algae-eater" in sp.tags:
                food_types.add("Roślinny")
            else:
                food_types.add("Suchy wieloskładnikowy")

        recommended_parameters = {
            "ph": f"{overall_ph_min} - {overall_ph_max}" if overall_ph_min <= overall_ph_max else "Brak wspólnego pH",
            "temperature": f"{overall_temp_min}°C - {overall_temp_max}°C" if overall_temp_min <= overall_temp_max else "Brak wspólnej temp.",
            "salinity": "1.020 - 1.025 SG" if water_type == "saltwater" else "Słodka (0 SG)",
            "food": ", ".join(food_types)
        }

    score = max(0, score)

    return {
        "compatibility_score": score,
        "total_bioload": total_bioload,
        "capacity": volume,
        "warnings": warnings,
        "species_details": species_details,
        "recommended_parameters": recommended_parameters
    }
