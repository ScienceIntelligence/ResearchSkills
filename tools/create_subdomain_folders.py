#!/usr/bin/env python3
"""
Create subdomain folders under skills/ based on the arXiv category taxonomy.
Each folder gets a .gitkeep so git tracks it.

Usage:
    python tools/create_subdomain_folders.py
"""

import os
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
SKILLS_DIR = REPO_ROOT / "skills"

# ── arXiv-aligned subdomain structure ──
# Physics uses archive-level groupings as subdomains
# All other domains use their direct arXiv subcategories

SUBDOMAINS = {
    "physics": [
        "astrophysics",                                  # astro-ph
        "condensed-matter",                              # cond-mat
        "general-relativity-and-quantum-cosmology",      # gr-qc
        "high-energy-physics",                           # hep-*
        "mathematical-physics",                          # math-ph
        "nuclear-experiment",                            # nucl-ex
        "nuclear-theory",                                # nucl-th
        "quantum-physics",                               # quant-ph
        "nonlinear-sciences",                            # nlin
        "accelerator-physics",                           # physics.acc-ph
        "atmospheric-and-oceanic-physics",               # physics.ao-ph
        "applied-physics",                               # physics.app-ph
        "atomic-and-molecular-clusters",                 # physics.atm-clus
        "atomic-physics",                                # physics.atom-ph
        "biological-physics",                            # physics.bio-ph
        "chemical-physics",                              # physics.chem-ph
        "classical-physics",                             # physics.class-ph
        "computational-physics",                         # physics.comp-ph
        "data-analysis-statistics-and-probability",      # physics.data-an
        "fluid-dynamics",                                # physics.flu-dyn
        "general-physics",                               # physics.gen-ph
        "geophysics",                                    # physics.geo-ph
        "instrumentation-and-detectors",                 # physics.ins-det
        "medical-physics",                               # physics.med-ph
        "optics",                                        # physics.optics
        "plasma-physics",                                # physics.plasm-ph
        "space-physics",                                 # physics.space-ph
    ],
    "mathematics": [
        "commutative-algebra",          # math.AC
        "algebraic-geometry",           # math.AG
        "analysis-of-pdes",            # math.AP
        "algebraic-topology",           # math.AT
        "classical-analysis-and-odes",  # math.CA
        "combinatorics",                # math.CO
        "category-theory",              # math.CT
        "complex-variables",            # math.CV
        "differential-geometry",        # math.DG
        "dynamical-systems",            # math.DS
        "functional-analysis",          # math.FA
        "general-mathematics",          # math.GM
        "general-topology",             # math.GN
        "group-theory",                 # math.GR
        "geometric-topology",           # math.GT
        "history-and-overview",         # math.HO
        "information-theory",           # math.IT
        "k-theory-and-homology",        # math.KT
        "logic",                        # math.LO
        "metric-geometry",              # math.MG
        "mathematical-physics",         # math.MP
        "numerical-analysis",           # math.NA
        "number-theory",                # math.NT
        "operator-algebras",            # math.OA
        "optimization-and-control",     # math.OC
        "probability",                  # math.PR
        "quantum-algebra",              # math.QA
        "rings-and-algebras",           # math.RA
        "representation-theory",        # math.RT
        "symplectic-geometry",          # math.SG
        "spectral-theory",             # math.SP
        "statistics-theory",            # math.ST
    ],
    "computer-science": [
        "artificial-intelligence",                     # cs.AI
        "hardware-architecture",                       # cs.AR
        "computational-complexity",                    # cs.CC
        "computational-engineering-finance-and-science",# cs.CE
        "computational-geometry",                      # cs.CG
        "computation-and-language",                    # cs.CL
        "cryptography-and-security",                   # cs.CR
        "computer-vision-and-pattern-recognition",     # cs.CV
        "computers-and-society",                       # cs.CY
        "databases",                                   # cs.DB
        "distributed-parallel-and-cluster-computing",  # cs.DC
        "digital-libraries",                           # cs.DL
        "discrete-mathematics",                        # cs.DM
        "data-structures-and-algorithms",              # cs.DS
        "emerging-technologies",                       # cs.ET
        "formal-languages-and-automata-theory",        # cs.FL
        "general-literature",                          # cs.GL
        "graphics",                                    # cs.GR
        "computer-science-and-game-theory",            # cs.GT
        "human-computer-interaction",                  # cs.HC
        "information-retrieval",                       # cs.IR
        "information-theory",                          # cs.IT
        "machine-learning",                            # cs.LG
        "logic-in-computer-science",                   # cs.LO
        "multiagent-systems",                          # cs.MA
        "multimedia",                                  # cs.MM
        "mathematical-software",                       # cs.MS
        "numerical-analysis",                          # cs.NA
        "neural-and-evolutionary-computing",           # cs.NE
        "networking-and-internet-architecture",        # cs.NI
        "other-computer-science",                      # cs.OH
        "operating-systems",                           # cs.OS
        "performance",                                 # cs.PF
        "programming-languages",                       # cs.PL
        "robotics",                                    # cs.RO
        "symbolic-computation",                        # cs.SC
        "sound",                                       # cs.SD
        "software-engineering",                        # cs.SE
        "social-and-information-networks",             # cs.SI
        "systems-and-control",                         # cs.SY
    ],
    "quantitative-biology": [
        "biomolecules",                # q-bio.BM
        "cell-behavior",               # q-bio.CB
        "genomics",                    # q-bio.GN
        "molecular-networks",          # q-bio.MN
        "neurons-and-cognition",       # q-bio.NC
        "other-quantitative-biology",  # q-bio.OT
        "populations-and-evolution",   # q-bio.PE
        "quantitative-methods",        # q-bio.QM
        "subcellular-processes",       # q-bio.SC
        "tissues-and-organs",          # q-bio.TO
    ],
    "statistics": [
        "applications",        # stat.AP
        "computation",         # stat.CO
        "methodology",         # stat.ME
        "machine-learning",    # stat.ML
        "other-statistics",    # stat.OT
        "statistics-theory",   # stat.TH
    ],
    "eess": [
        "audio-and-speech-processing",  # eess.AS
        "image-and-video-processing",   # eess.IV
        "signal-processing",            # eess.SP
        "systems-and-control",          # eess.SY
    ],
    "economics": [
        "econometrics",           # econ.EM
        "general-economics",      # econ.GN
        "theoretical-economics",  # econ.TH
    ],
    "quantitative-finance": [
        "computational-finance",                  # q-fin.CP
        "economics",                              # q-fin.EC
        "general-finance",                        # q-fin.GN
        "mathematical-finance",                   # q-fin.MF
        "portfolio-management",                   # q-fin.PM
        "pricing-of-securities",                  # q-fin.PR
        "risk-management",                        # q-fin.RM
        "statistical-finance",                    # q-fin.ST
        "trading-and-market-microstructure",      # q-fin.TR
    ],
}


def main():
    created = 0
    for domain, subs in SUBDOMAINS.items():
        for sub in subs:
            folder = SKILLS_DIR / domain / sub
            folder.mkdir(parents=True, exist_ok=True)
            gitkeep = folder / ".gitkeep"
            if not gitkeep.exists():
                gitkeep.touch()
                created += 1
            else:
                print(f"  (exists) {domain}/{sub}/")

    total = sum(len(v) for v in SUBDOMAINS.values())
    print(f"\nDone. {created} new folders created, {total} total subdomains across {len(SUBDOMAINS)} domains.")
    for domain, subs in SUBDOMAINS.items():
        print(f"  {domain}: {len(subs)} subdomains")


if __name__ == "__main__":
    main()
