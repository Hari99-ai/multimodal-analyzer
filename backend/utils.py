# from pathlib import Path
# import json


# # A tiny toxic words list for demo (in real system use a model/service)
# TOXIC_WORDS = {"hate", "stupid", "idiot", "damn", "shit", "bastard", "ugly", "dirty"}


# # Load ImageNet idx->label map shipped with torchvision (we'll include a fallback minimal mapping)
# IMAGENET_LABELS_PATH = Path(__file__).parent / "imagenet_class_index.json"
# _imagenet = {}
# if IMAGENET_LABELS_PATH.exists():
# _imagenet = json.loads(IMAGENET_LABELS_PATH.read_text())
# else:
# # Minimal fallback mapping for demo
# _imagenet = {"0": ["n01440764", "tench"], "1": ["n01443537", "goldfish"]}




# def map_imagenet_label_to_category(idx: int):
# sidx = str(idx)
# if sidx in _imagenet:
# return _imagenet[sidx][1]
# # fallback
# return f"imagenet_{idx}"




# def contains_toxic_words(text: str):
# if not text:
# return 0.0
# t = text.lower()
# words = set(w.strip(".,!?;:\"'()") for w in t.split())
# toxic_hits = words.intersection(TOXIC_WORDS)
# if not toxic_hits:
# return 0.0
# # score = min(1.0, 0.2 * number_of_hits)
# return min(1.0, 0.2 * len(toxic_hits))
from pathlib import Path
import json

# A tiny toxic words list for demo (in real system use a model/service)
TOXIC_WORDS = {"hate", "stupid", "idiot", "damn", "shit", "bastard", "ugly", "dirty"}

# Load ImageNet idx->label map shipped with torchvision (we'll include a fallback minimal mapping)
IMAGENET_LABELS_PATH = Path(__file__).parent / "imagenet_class_index.json"
_imagenet = {}
if IMAGENET_LABELS_PATH.exists():
    _imagenet = json.loads(IMAGENET_LABELS_PATH.read_text())
else:
    # Minimal fallback mapping for demo
    _imagenet = {
        "0": ["n01440764", "tench"],
        "1": ["n01443537", "goldfish"]
    }


def map_imagenet_label_to_category(idx: int):
    sidx = str(idx)
    if sidx in _imagenet:
        return _imagenet[sidx][1]
    # fallback
    return f"imagenet_{idx}"


def contains_toxic_words(text: str):
    if not text:
        return 0.0
    t = text.lower()
    words = set(w.strip(".,!?;:\"'()") for w in t.split())
    toxic_hits = words.intersection(TOXIC_WORDS)
    if not toxic_hits:
        return 0.0
    # score = min(1.0, 0.2 * number_of_hits)
    return min(1.0, 0.2 * len(toxic_hits))
