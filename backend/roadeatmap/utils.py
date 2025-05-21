import requests

def get_route_metrics(origin, destination, api_key, waypoint=None):
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": origin,
        "destination": destination,
        "key": api_key,
        "mode": "driving"
    }
    if waypoint:
        params["waypoints"] = waypoint

    print(f"[Google API] Request: {params}")

    print(f"[Google API] Request WITH WAYPOINT: {params}")

    response = requests.get(url, params=params)
    data = response.json()

    print(f"[Google API] Response status: {response.status_code}")
    print(f"[Google API] Top-level status: {data.get('status')}")
    if not data.get("routes"):
        print("[Google API] No routes found. Full response:")
        print(data)
        return None, None

    legs = data["routes"][0]["legs"]
    total_duration = sum(leg["duration"]["value"] for leg in legs)
    total_distance = sum(leg["distance"]["value"] for leg in legs)
    return total_duration, total_distance
