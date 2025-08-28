#!/usr/bin/env python3
import os, argparse, json, pathlib, requests

ap = argparse.ArgumentParser()
ap.add_argument("--dir", required=True, help="Directory containing PNG/PDF outputs")
args = ap.parse_args()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE = os.environ["SUPABASE_SERVICE_ROLE"]
BUCKET = os.environ.get("SUPABASE_STORAGE_BUCKET","staticfruit-graphs")

headers = {"Authorization": f"Bearer {SUPABASE_SERVICE_ROLE}", "apikey": SUPABASE_SERVICE_ROLE}

def upload(path: str):
    name = pathlib.Path(path).name
    with open(path, "rb") as f:
        r = requests.post(
            f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{name}",
            headers=headers,
            data=f.read(),
            timeout=60
        )
    if r.status_code not in (200,201):
        raise SystemExit(f"Upload failed for {name}: {r.status_code} {r.text}")
    print("Uploaded", name)

for fn in os.listdir(args.dir):
    if fn.endswith(".png") or fn.endswith(".pdf"):
        upload(os.path.join(args.dir, fn))
