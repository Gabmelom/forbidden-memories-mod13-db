import os
import requests as request

# 4 maigc types + 20 monster types
card_types = ["Equip", "Magic", "Ritual", "Trap", "Aqua", "Beast", "Beast-Warrior", "Dinosaur", "Dragon", "Fairy", "Fiend", "Fish", "Insect", "Machine", "Plant", "Pyro", "Reptile", "Rock", "Sea Serpent", "Spellcaster", "Thunder", "Warrior", "Winged Beast", "Zombie"]

# Fetch and save image files using each card type
# Fetch from https://yugioh-fm-db.pages.dev/assets/images/types/<type>.png

def fetch_card_type_icons(card_types):
    base_url = "https://yugioh-fm-db.pages.dev/assets/images/types/"
    output_dir = "types"

    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for card_type in card_types:
        # Construct the URL for the card type icon
        url = f"{base_url}{card_type}.png"
        response = request.get(url)

        if response.status_code == 200:
            # Save the image to the output directory
            with open(os.path.join(output_dir, f"{card_type}.png"), "wb") as f:
                f.write(response.content)
            print(f"Downloaded {card_type}.png")
        else:
            print(f"Failed to download {card_type}.png: {response.status_code}")

if __name__ == "__main__":
    fetch_card_type_icons(card_types)
    print("All card type icons have been downloaded and saved in the 'types' directory.")