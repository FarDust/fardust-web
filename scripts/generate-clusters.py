# /// script
# requires-python = ">=3.11"
# dependencies = ["numpy"]
# ///

import json
import numpy as np
from pathlib import Path

CLUSTERS = [
    {
        "id": "family",
        "label": "Messages from the Family",
        "color": "#6eeeff",
        "centroid": [-2.5, 0.5, -1.0],
        "count": 80,
        "spread": 0.75,
    },
    {
        "id": "non_urgent",
        "label": "Non Urgent",
        "color": "#adc6ff",
        "centroid": [1.8, -0.8, 0.6],
        "count": 120,
        "spread": 1.2,
    },
    {
        "id": "sales",
        "label": "Missed Sales call from 800 numbers",
        "color": "#ff7c4b",
        "centroid": [0.2, 1.8, 1.5],
        "count": 65,
        "spread": 0.65,
    },
]

rng = np.random.default_rng(seed=42)  # reproducible

output: dict = {"clusters": []}
for c in CLUSTERS:
    points = rng.normal(loc=c["centroid"], scale=c["spread"], size=(c["count"], 3)).tolist()
    output["clusters"].append(
        {
            "id": c["id"],
            "label": c["label"],
            "color": c["color"],
            "points": [[round(v, 4) for v in p] for p in points],
        }
    )

out_path = (
    Path(__file__).parent.parent / "src" / "assets" / "data" / "notification-clusters.json"
)
out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text(json.dumps(output, indent=2))
print(f"Written {sum(len(c['points']) for c in output['clusters'])} points → {out_path}")
