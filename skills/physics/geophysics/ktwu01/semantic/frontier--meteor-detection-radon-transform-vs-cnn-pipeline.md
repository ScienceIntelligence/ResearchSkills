---
name: meteor-detection-radon-transform-vs-cnn-pipeline
memory_type: semantic
subtype: frontier
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## Fact
For meteor-light-trail detection in fish-eye camera images from Digital Autonomous Fireball Observatories, the current best practice combines Radon transformation (to detect linear trails) with Fourier transformation testing, and then validates candidates with a CNN trained partly on prior pipeline results and partly on manually identified trails. Prior approaches (video: UFOCapture, CAMS, CMN by Gural & Šegon; radar/radio: BRAMS) are tied to specific camera/sensor systems and lack portability. Classical Hough-transform approaches predate CNN integration.
## Evidence
Manuscript PSS-D-25-00229 by Suk & Šimberová reviewed by KW as invited reviewer for Planetary and Space Science (Elsevier, Scopus Q2).
