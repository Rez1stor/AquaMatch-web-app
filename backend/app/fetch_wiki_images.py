import os
import json
import time
import urllib.request
import urllib.error
import urllib.parse
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Species

def fetch_and_save_images():
    db = SessionLocal()
    species_list = db.query(Species).all()
    
    images_dir = "/app/frontend/public/images/species"
    os.makedirs(images_dir, exist_ok=True)
    
    for sp in species_list:
        print(f"Processing {sp.scientific_name} ({sp.name})...")
        time.sleep(1) # Delay to avoid 429
        
        headers = {'User-Agent': 'AquaMatchBot/1.0 (contact@aquamatch.local)'}
        
        img_url = None
        
        # We know we have a valid Wikipedia Commons URL in sp.image_url. We extract the filename!
        if sp.image_url and "wikipedia" in sp.image_url:
            parts = sp.image_url.split('/')
            file_name = ""
            if "thumb" in sp.image_url:
                file_name = parts[-2]
            else:
                file_name = parts[-1]
                
            file_name = urllib.parse.unquote(file_name)
            print(f"Querying API for File:{file_name}")
            
            api_url_file = f"https://en.wikipedia.org/w/api.php?action=query&titles=File:{urllib.parse.quote(file_name)}&prop=imageinfo&iiprop=url&format=json"
            
            try:
                req_file = urllib.request.Request(api_url_file, headers=headers)
                with urllib.request.urlopen(req_file) as response_file:
                    res_file = json.loads(response_file.read().decode())
                    pages = res_file.get("query", {}).get("pages", {})
                    for page_id, page_data in pages.items():
                        if "imageinfo" in page_data:
                            img_url = page_data["imageinfo"][0]["url"]
                            break
            except Exception as e:
                print(f"Error resolving File URL for {file_name}: {e}")

        if img_url:
            time.sleep(0.5)
            try:
                img_req = urllib.request.Request(img_url, headers=headers)
                with urllib.request.urlopen(img_req, timeout=15) as response:
                    if response.status == 200:
                        filename = f"{sp.id}_{sp.scientific_name.replace(' ', '_').lower()}.jpg"
                        filepath = os.path.join(images_dir, filename)
                        
                        with open(filepath, 'wb') as f:
                            f.write(response.read())
                        
                        sp.image_url = f"/images/species/{filename}"
                        print(f"Saved {filename} from {img_url}")
                    else:
                        print(f"Failed to download image from {img_url}")
            except Exception as e:
                print(f"Error downloading {img_url}: {e}")
        else:
            print("No image found or resolved.")
            
    db.commit()
    db.close()
    
    print("Done downloading images and updating DB.")

if __name__ == "__main__":
    fetch_and_save_images()
