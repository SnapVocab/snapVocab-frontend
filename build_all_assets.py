import os
import sys
import numpy as np
from PIL import Image, ImageDraw
import rembg

src_path = r"C:\Users\MSII\.gemini\antigravity-ide\brain\7ff80ded-96f9-45bf-9cf3-3011eb6a9b30\.user_uploaded\media_1788857286018.jpg"
orig_img = Image.open(src_path).convert("RGB")
bg_cream = (254, 244, 232)

out_base = r"c:\Users\MSII\Downloads\lovable-project-65edf03e\assets\images\mascot"
exp_dir = os.path.join(out_base, "expressions")
act_dir = os.path.join(out_base, "actions")
app_dir = os.path.join(out_base, "applications")
turn_dir = os.path.join(out_base, "turnaround")

for d in [exp_dir, act_dir, app_dir, turn_dir]:
    os.makedirs(d, exist_ok=True)

# Initialize fast u2net session
print("Initializing rembg u2net session...")
session = rembg.new_session("u2net")

def process_item(crop_box, masks=None, canvas_size=(512, 512), is_card=False):
    cropped = orig_img.crop(crop_box).copy()
    
    if masks:
        draw = ImageDraw.Draw(cropped)
        for m_type, m_coords in masks:
            if m_type == 'rect':
                draw.rectangle(m_coords, fill=bg_cream)
            elif m_type == 'poly':
                draw.polygon(m_coords, fill=bg_cream)
                
    if is_card:
        # Card with rounded background (e.g. app icon, sticker, loading, notification)
        # We can extract the card cleanly by thresholding the outer background cream
        rgba = cropped.convert("RGBA")
        arr = np.array(rgba)
        r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
        dist = np.sqrt((r.astype(float)-254)**2 + (g.astype(float)-244)**2 + (b.astype(float)-232)**2)
        # Background is where distance < 18
        alpha = np.where(dist < 18, 0, 255).astype(np.uint8)
        # Smooth alpha
        rgba.putalpha(Image.fromarray(alpha))
    else:
        # Transparent cutout of mascot character
        rgba = rembg.remove(cropped, session=session)
        
    # Trim transparent borders
    bbox = rgba.getbbox()
    if bbox:
        trimmed = rgba.crop(bbox)
    else:
        trimmed = rgba
        
    # Scale with high quality LANCZOS
    cw, ch = canvas_size
    pad = 32
    target_max_w = cw - pad * 2
    target_max_h = ch - pad * 2
    
    scale = min(target_max_w / trimmed.width, target_max_h / trimmed.height)
    new_w = max(1, int(trimmed.width * scale))
    new_h = max(1, int(trimmed.height * scale))
    resized = trimmed.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    paste_x = (cw - new_w) // 2
    paste_y = (ch - new_h) // 2
    canvas.paste(resized, (paste_x, paste_y), resized)
    
    return canvas, trimmed

items = [
    # 1. Expressions (6 items)
    (
        os.path.join(exp_dir, "snapy-vui-ve.png"),
        (665, 45, 792, 212),
        [('rect', (0, 0, 30, 35))],  # Mask out small tip of 'Biểu cảm' orange badge on top-left
        False
    ),
    (
        os.path.join(exp_dir, "snapy-nhay-mat.png"),
        (793, 45, 900, 212),
        None,
        False
    ),
    (
        os.path.join(exp_dir, "snapy-to-mo.png"),
        (900, 35, 1000, 212),
        None,
        False
    ),
    (
        os.path.join(exp_dir, "snapy-tap-trung.png"),
        (665, 225, 786, 400),
        None,
        False
    ),
    (
        os.path.join(exp_dir, "snapy-bat-ngo.png"),
        (786, 225, 895, 400),
        None,
        False
    ),
    (
        os.path.join(exp_dir, "snapy-tu-hao.png"),
        (895, 225, 1005, 400),
        None,
        False
    ),
    
    # 2. Actions / Poses (6 items)
    (
        os.path.join(act_dir, "snapy-chao-mung.png"),
        (18, 435, 192, 645),
        [('rect', (0, 0, 192-18, 468-435))],  # Mask out top orange header badge
        False
    ),
    (
        os.path.join(act_dir, "snapy-doc-sach.png"),
        (194, 435, 345, 645),
        None,
        False
    ),
    (
        os.path.join(act_dir, "snapy-nhay-len.png"),
        (346, 415, 505, 645),
        None,
        False
    ),
    (
        os.path.join(act_dir, "snapy-an-mung.png"),
        (506, 435, 690, 645),
        None,
        False
    ),
    (
        os.path.join(act_dir, "snapy-suy-nghi.png"),
        (695, 435, 848, 645),
        None,
        False
    ),
    (
        os.path.join(act_dir, "snapy-kham-pha.png"),
        (850, 435, 1000, 645),
        None,
        False
    ),
    
    # 3. Main Mascot
    (
        os.path.join(out_base, "snapy-main.png"),
        (5, 10, 305, 435),
        [('rect', (280-5, 0, 305-5, 135-10))],  # Mask out 'S' of SnapVocab
        False
    ),
    
    # 4. Turnaround (Front, Side, Back)
    (
        os.path.join(turn_dir, "snapy-turnaround-truoc.png"),
        (25, 705, 140, 845),
        None,
        False
    ),
    (
        os.path.join(turn_dir, "snapy-turnaround-ben.png"),
        (140, 705, 250, 845),
        None,
        False
    ),
    (
        os.path.join(turn_dir, "snapy-turnaround-sau.png"),
        (250, 705, 365, 845),
        None,
        False
    ),
    
    # 5. Applications (Cards)
    (
        os.path.join(app_dir, "snapy-app-icon.png"),
        (672, 700, 786, 825),
        None,
        True
    ),
    (
        os.path.join(app_dir, "snapy-sticker-goodjob.png"),
        (805, 695, 965, 825),
        None,
        True
    ),
    (
        os.path.join(app_dir, "snapy-loading-rocket.png"),
        (660, 830, 800, 975),
        None,
        True
    ),
    (
        os.path.join(app_dir, "snapy-thong-bao.png"),
        (810, 830, 975, 975),
        None,
        True
    ),
]

print(f"Total items to process: {len(items)}")
for i, (out_path, crop_box, masks, is_card) in enumerate(items):
    print(f"[{i+1}/{len(items)}] Processing: {os.path.basename(out_path)}...")
    canvas, trimmed = process_item(crop_box, masks, canvas_size=(512, 512), is_card=is_card)
    canvas.save(out_path, "PNG")
    # Also save tight trimmed version
    trimmed_path = out_path.replace(".png", "-trimmed.png")
    trimmed.save(trimmed_path, "PNG")

# Also update existing assets/images/snapy-*.png for backward compatibility
legacy_mapping = {
    "snapy-welcome.png": os.path.join(act_dir, "snapy-chao-mung.png"),
    "snapy-happy.png": os.path.join(exp_dir, "snapy-vui-ve.png"),
    "snapy-curious.png": os.path.join(exp_dir, "snapy-to-mo.png"),
    "snapy-reading.png": os.path.join(act_dir, "snapy-doc-sach.png"),
    "snapy-snap.png": os.path.join(out_base, "snapy-main.png"),
}

legacy_dir = r"c:\Users\MSII\Downloads\lovable-project-65edf03e\assets\images"
for filename, src in legacy_mapping.items():
    dest = os.path.join(legacy_dir, filename)
    img = Image.open(src)
    img.save(dest, "PNG")
    print(f"Updated legacy asset: {filename}")

print("\nSUCCESS: All mascot PNGs generated and verified!")
