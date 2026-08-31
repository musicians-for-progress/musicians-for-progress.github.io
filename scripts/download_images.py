#!/usr/bin/env python3
"""
Downloads the placeholder images currently used on the Wix site into the
local images/ folder, so the new site is fully self-hosted from day one
and doesn't depend on the Wix CDN staying online.

Usage (run once, from anywhere):

    python3 scripts/download_images.py

Uses only the Python standard library -- no pip install needed. Safe to
re-run any time; it just re-downloads and overwrites each file. Once you
have your own final photos, just replace the files in images/ directly
with the same filenames -- you won't need this script again for those.

If a download fails (Wix occasionally throttles hotlinked requests), the
script tells you which file failed. You can right-click → "Save Image As"
on the old Wix site and save it manually under the matching filename in
images/ instead.
"""

import os
import urllib.request
import urllib.error

IMAGES = {
    # Logo (used in the nav, footer, and About page)
    "logo.png": "https://static.wixstatic.com/media/fe3154_7441a629b6d14ef791da3c389913ce9b~mv2.png/v1/fill/w_329,h_411,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/fe3154_7441a629b6d14ef791da3c389913ce9b~mv2.png",

    # Home page
    "hero-home.jpg": "https://static.wixstatic.com/media/fe3154_1708fd0d6b64440192dcf74897d65d42~mv2.jpg/v1/fill/w_921,h_614,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/fe3154_1708fd0d6b64440192dcf74897d65d42~mv2.jpg",

    # About page
    "about-photo.jpg": "https://static.wixstatic.com/media/fe3154_3dd68ab8a84646129cbe883df19ebf7a~mv2.jpg/v1/fill/w_333,h_424,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/fe3154_3dd68ab8a84646129cbe883df19ebf7a~mv2.jpg",
    "concert-hall.jpg": "https://static.wixstatic.com/media/6a58c342848a4d02b77ad223eebf560e.jpg/v1/fill/w_333,h_222,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/6a58c342848a4d02b77ad223eebf560e.jpg",
    "team-bryce-cox.jpg": "https://static.wixstatic.com/media/fe3154_83085581bf434c5bb4e0930673f3d47e~mv2.jpg/v1/fill/w_287,h_323,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/9_edited.jpg",
    "team-ian-briffa.jpg": "https://static.wixstatic.com/media/fe3154_547d3a3d77d64955a0cd958604e59d13~mv2.jpg/v1/crop/x_0,y_52,w_933,h_1049/fill/w_287,h_323,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/0.jpg",
    "team-honor-hickman.jpg": "https://static.wixstatic.com/media/fe3154_b7dd9ee3a4e9428e88159453a1a1d99a~mv2.jpeg/v1/crop/x_0,y_80,w_427,h_481/fill/w_287,h_323,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Honor%20Hickman%20Headshot%202023.jpeg",
    "team-sadie-habas.jpg": "https://static.wixstatic.com/media/fe3154_c98b8c29ee834d58b1a0312a99a84065~mv2.jpg/v1/crop/x_0,y_142,w_1170,h_969/fill/w_408,h_334,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/5BF111B3-3D92-4379-85D8-242601065367_JPG.jpg",

    # Events page — "Meet the Musicians"
    "musician-sadie-habas.jpg": "https://static.wixstatic.com/media/fe3154_c98b8c29ee834d58b1a0312a99a84065~mv2.jpg/v1/crop/x_0,y_142,w_1170,h_969/fill/w_408,h_334,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/5BF111B3-3D92-4379-85D8-242601065367_JPG.jpg",
    "musician-matthew-lee.jpg": "https://static.wixstatic.com/media/fe3154_a201b15385b94f02a92154543f6107cd~mv2.jpg/v1/crop/x_0,y_277,w_1284,h_1051/fill/w_408,h_334,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/2D3EC25F-B6DF-464E-97F0-9462DE8A6698_JPG.jpg",
    "musician-bryce-cox.jpg": "https://static.wixstatic.com/media/fe3154_9ea134d490f345a88a21142a1ec2c060~mv2.jpeg/v1/fill/w_408,h_334,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Headshot%20-%20Bryce%20Cox.jpeg",
    "musician-nora-cannizzaro.jpg": "https://static.wixstatic.com/media/fe3154_fddf184b0e3141539b5ad265fcb611a0~mv2.jpeg/v1/fill/w_408,h_334,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_1899.jpeg",
    "musician-nathalie-vela.jpg": "https://static.wixstatic.com/media/fe3154_396a69c21b9e422b9f070d19d2e52b72~mv2.jpg/v1/crop/x_0,y_49,w_1170,h_957/fill/w_408,h_334,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/A777AD6F-F560-48A9-A3B2-F086E461A55D_JPG.jpg",
    "musician-anya-mazaris-atkinson.jpg": "https://static.wixstatic.com/media/fe3154_961aef8d6a86410486707184686e3fb0~mv2.jpg/v1/crop/x_0,y_185,w_828,h_678/fill/w_408,h_334,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_1686_JPG.jpg",
    "musician-christopher-relyea.jpg": "https://static.wixstatic.com/media/fe3154_20534e70174e44549a2a115dc23420cd~mv2.jpeg/v1/crop/x_0,y_778,w_3024,h_2476/fill/w_408,h_334,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_3966.jpeg",
    "musician-corrin-kliewer.jpg": "https://static.wixstatic.com/media/fe3154_46624240e64f41a187f079f372207577~mv2.jpeg/v1/crop/x_0,y_778,w_3024,h_2476/fill/w_408,h_334,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_1302.jpeg",

    # Who We Support
    "partner-rian-center.png": "https://static.wixstatic.com/media/fe3154_d408a14d1f9f48228ac4c370c7f42f5a~mv2.png/v1/crop/x_3,y_2,w_272,h_180/fill/w_181,h_120,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/images.png",
    "partner-rosies-place.png": "https://static.wixstatic.com/media/fe3154_5f7dc47914514c3e85d666a32d11ec08~mv2.png/v1/fill/w_249,h_79,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo-rosiesplace.png",

    # Project O.D.E. / Donate (same source photo, used in both places)
    "project-ode.jpg": "https://static.wixstatic.com/media/fe3154_fdcadfaba5854701a36d465115401a9c~mv2.jpg/v1/crop/x_0,y_287,w_2459,h_1356/fill/w_600,h_331,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/external-file_edited.jpg",
    "community-photo.jpg": "https://static.wixstatic.com/media/fe3154_fdcadfaba5854701a36d465115401a9c~mv2.jpg/v1/crop/x_0,y_287,w_2459,h_1356/fill/w_600,h_331,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/external-file_edited.jpg",
}


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(root, "images")
    os.makedirs(out_dir, exist_ok=True)

    headers = {"User-Agent": "Mozilla/5.0 (compatible; MFP-image-fetch/1.0)"}

    ok = 0
    failed = []
    for filename, url in IMAGES.items():
        dest = os.path.join(out_dir, filename)
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = resp.read()
            with open(dest, "wb") as f:
                f.write(data)
            print("  saved  " + filename)
            ok += 1
        except (urllib.error.URLError, urllib.error.HTTPError) as e:
            print("  FAILED " + filename + ": " + str(e))
            failed.append(filename)

    print("\n{}/{} images saved to {}".format(ok, len(IMAGES), out_dir))
    if failed:
        print("Failed: " + ", ".join(failed))
        print("Save these manually from the old Wix site under the matching filename in images/.")


if __name__ == "__main__":
    main()
