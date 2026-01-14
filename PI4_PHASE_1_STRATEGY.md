# Pi4 (PassiveBrain) Phase 1 Strategy: Narrative Depth & Visual Rendering

**Document Purpose**: Context for integrating Pi4 into DreamCraft Legacies subscription preparation
**Date**: 2026-01-09
**Status**: Implementation Planning

---

## Executive Summary

Pi4 should **NOT sit idle** until Phase 2. Instead, it should become a **narrative enrichment & visual rendering engine** that transforms raw Year 4 simulation data into publication-ready content with:

- **Character arc tracking** with emotional/relationship trajectories
- **Relationship network visualization** (trust graphs, alliance maps)
- **World state snapshots** (territory, resources, factional control)
- **Event timeline infographics** (consequences, decision impact)
- **Monthly stats dashboards** (deaths, conflicts, influence metrics)
- **Character arc charts** (happiness, power, influence over time)

This addresses the critical gap: **raw simulation output alone isn't interesting enough for a paid subscription.** Visuals + structured narrative layers = premium content.

---

## The Problem: Raw Narrative Data Isn't Subscription-Ready

### Current State
- Year 4 simulation generating ~300-500 words/day of narrative
- Pi1 outputs basic sequential events
- No structured data extraction
- Limited narrative arc tracking
- No visual engagement layer

### Market Reality
- Text-only narratives = low engagement (attention economy)
- Subscribers expect **depth**: character development, relationship arcs, world evolution
- Visuals are critical: people scroll past text, stop for images
- Data transparency adds credibility: "This is real, verifiable, not just AI-generated"

### Questions You Asked
1. **"What does Pi4 do until Phase 2?"** → Needs productive work while narrative data matures
2. **"Is the story interesting enough yet?"** → Probably not; ~100 days of basic narrative is thin
3. **"Can Pi4 create visual renderings?"** → **Yes, absolutely—and it should be a priority**

---

## Pi4's Role: Narrative Depth & Visual Rendering (Months 1-3)

### Architecture: Data → JSON → Visuals

```
Year 4 Simulation Output (Pi1)
         ↓
Raw daily narrative + events
         ↓
Pi4 Processing Pipeline
┌─────────────────────────────────────────────┐
│ Extract & Structure (Layer 1)              │
├─────────────────────────────────────────────┤
│ ✓ Parse character decisions                │
│ ✓ Track relationship changes               │
│ ✓ Extract world state shifts               │
│ ✓ Identify key events & consequences       │
│ ✓ Calculate emotion/tension metrics        │
└─────────────────────────────────────────────┘
         ↓
Generate Structured JSON Data
         ↓
┌─────────────────────────────────────────────┐
│ Visual Rendering (Layer 2)                 │
├─────────────────────────────────────────────┤
│ ✓ Character status cards (SVG)             │
│ ✓ Relationship maps (D3/SVG)               │
│ ✓ World state visualization (SVG)          │
│ ✓ Timeline infographics (HTML/SVG)         │
│ ✓ Stats dashboards (Data viz cards)        │
│ ✓ Character arc charts (Plotly/SVG)        │
└─────────────────────────────────────────────┘
         ↓
Output: PNG/SVG/HTML Assets
         ↓
Blog Template (Substack/Patreon)
├─ Narrative prose (~2K-3K words)
├─ Visual assets (embedded)
├─ Data dashboard
└─ Next month's cliffhanger/hooks
```

---

## Visual Assets Pi4 Should Generate (Monthly)

### 1. Character Status Cards
**What**: One-page card per main character showing current state
**Content**:
- Character name & role
- Current emotional state (icon/color)
- Trust/reputation bar (0-100)
- Key relationships (icons: ally, enemy, romance, neutral)
- Power level (influence score)
- One-sentence arc descriptor
- Most recent major decision

**Format**: SVG (scalable, embeddable, printable)
**Time to Generate**: ~5 seconds per character (12-15 characters = 1-2 minutes)
**Tools**: Python (Pillow/matplotlib) OR Node.js (svg.js)
**Example Output**:
```
┌─────────────────────────────┐
│ ARIA (The Rebel Leader)     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Emotion: ⚡ Determined      │
│ Trust: ████████░░ 82/100    │
│ Allies: [⚔️ Kael, 💕 Mira] │
│ Enemies: [👹 Thorne]        │
│ Power: ████████░░ 75/100    │
│ Arc: Questioning leadership │
│        after betrayal       │
└─────────────────────────────┘
```

---

### 2. Relationship Network Map
**What**: Visual graph showing all character connections
**Content**:
- Characters as nodes
- Relationships as colored edges:
  - Blue = trust/alliance
  - Red = conflict/rivalry
  - Purple = romance
  - Gray = neutral/unknown
- Edge thickness = relationship strength
- Node size = influence/power level
- Faction clustering (visual grouping)

**Format**: SVG or interactive D3.js
**Time to Generate**: ~10-15 seconds (requires layout algorithm)
**Tools**: D3.js OR Graphviz (dot format) OR vis.js
**Interactivity**: Hover to see relationship details, click to expand
**Example Output**:
```
        [Kael] ←→ [Aria]
         ↙ ↖    ↓
    [Thorne]  [Mira] ←→ [Savik]
         ↖ ↙    ↓
        [Vex] ←→ [Lyssa]

Color legend:
━━ Blue (trust)
━━ Red (conflict)
━━ Purple (romance)
```

---

### 3. World State Map
**What**: Territory/faction control visualization
**Content**:
- Geographic regions (if applicable) or faction territories
- Color-coded by controlling faction
- Key locations marked
- Resource heatmaps (gold, influence, military power)
- Changes highlighted from previous month (green = gained, red = lost)
- Legend showing faction colors

**Format**: SVG with geographic grid or faction diagram
**Time to Generate**: ~15-20 seconds
**Tools**: Mapbox OR custom SVG grid
**Example Output**:
```
Month 4 Territory Control:
[Red Faction: 40% control] - Lost [North Ridge]
[Blue Faction: 35% control] - Gained [East Pass]
[Green Faction: 25% control] - Stable
```

---

### 4. Timeline Infographic (Monthly)
**What**: Chronological event summary with impact visualization
**Content**:
- 4-6 major events from the month
- Event cards with brief descriptions
- Decision points highlighted
- Consequence arrows (showing ripple effects)
- Surprise factor indicator (was this expected?)
- Who was most affected?

**Format**: Horizontal timeline (HTML/CSS) or vertical (SVG)
**Time to Generate**: ~20-30 seconds
**Tools**: Custom HTML/CSS OR SVG path + text
**Example Output**:
```
DAY 1    DAY 10    DAY 20    DAY 28
[Event A]→[Consequence]→[Event B]→[Event C]
        ↓                      ↓
    Impact: X changed   Impact: Alliance formed
    Surprise: 3/10      Surprise: 8/10
```

---

### 5. Monthly Stats Dashboard
**What**: Quick-hit metrics summarizing the month
**Content**:
- Character deaths: X
- New alliances formed: Y
- Conflicts started: Z
- Betrayals: W
- Most influential character: [Name] (influence score)
- Most surprising event: [Event description]
- Tension score: 7/10
- Relationship changes: +X trust, -Y trust
- Population changes (if applicable)

**Format**: Card-based data viz (HTML/CSS or SVG)
**Time to Generate**: ~5 seconds
**Tools**: HTML/CSS OR Plotly
**Example Output**:
```
MONTH 4 STATS
━━━━━━━━━━━━━━━━━━━━━━━━
Deaths: 1 (Rival NPC)
New Alliances: 2
Betrayals: 1
Most Influential: Aria (+12 influence)
Tension Score: 8/10
━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 6. Character Arc Charts
**What**: Line graphs showing character evolution
**Content per character (or quarterly summary)**:
- Y-axis: Happiness, Power, Influence, Trust (0-100)
- X-axis: Days (1-30, or monthly aggregates)
- Multi-line chart showing trajectory
- Major events marked on lines (deaths, decisions, betrayals)
- Color-coded by metric

**Format**: SVG or interactive Plotly chart
**Time to Generate**: ~10 seconds per character
**Tools**: Plotly OR matplotlib OR Recharts (React)
**Example Output**:
```
ARIA'S MONTH 4 ARC
100 ┤                ╭─────
    ├─ Happiness     ╰──────╮ ↓ Betrayal
 75 ├────╭──────╮         ╰──╮
    ├    ║ Power      ╭────╭─╮
 50 ├────╰──╮        ║    ║ ╰────
    ├       ╰────╮ Trust ╰─╮
 25 ├            ╰────────╭╯
    ├
  0 └──────────────────────────
    Day 1  5   10  15  20  25  30
```

---

## Implementation: Data Structures & Pipeline

### JSON Output Schema (Example)

```json
{
  "month": 4,
  "date_range": "2026-01-01 to 2026-01-31",
  "characters": [
    {
      "id": "aria_001",
      "name": "Aria",
      "role": "Rebel Leader",
      "current_emotion": "determined",
      "trust_score": 82,
      "power_score": 75,
      "relationships": [
        { "target": "kael_002", "type": "ally", "strength": 0.9 },
        { "target": "thorne_003", "type": "enemy", "strength": 0.8 },
        { "target": "mira_004", "type": "neutral", "strength": 0.5 }
      ],
      "arc_summary": "Questioning leadership after betrayal",
      "recent_decision": "Moved camp to Northern territory",
      "daily_scores": [
        { "day": 1, "happiness": 65, "power": 70, "influence": 75, "trust": 80 },
        { "day": 10, "happiness": 58, "power": 72, "influence": 78, "trust": 88 },
        { "day": 28, "happiness": 62, "power": 75, "influence": 82, "trust": 82 }
      ]
    }
  ],
  "relationships": [
    { "character_a": "aria_001", "character_b": "kael_002", "type": "ally", "strength": 0.9, "changed_this_month": true },
    { "character_a": "aria_001", "character_b": "thorne_003", "type": "enemy", "strength": 0.8, "changed_this_month": false }
  ],
  "world_state": {
    "territories": [
      { "name": "North Ridge", "controller": "red_faction", "changed_this_month": true, "change": "lost" }
    ],
    "resources": { "red_faction": 450, "blue_faction": 380, "green_faction": 220 }
  },
  "events": [
    {
      "day": 5,
      "title": "Betrayal Revealed",
      "description": "Thorne was secretly feeding information to rivals.",
      "impact_on": ["aria_001", "kael_002"],
      "surprise_score": 8,
      "consequences": ["Aria questions leadership", "Trust in Kael strengthened"]
    }
  ],
  "stats": {
    "deaths": 1,
    "new_alliances": 2,
    "betrayals": 1,
    "most_influential": "aria_001",
    "tension_score": 8
  }
}
```

---

## Timeline: Pi4 Phase 1 Implementation (Months 1-3)

### Month 1: Build Data Extraction & Rendering Pipeline
```
Week 1: Design JSON schema for narrative data
Week 2: Build extraction logic (parse Pi1 output → JSON)
Week 3: Build first 3 visualization generators (status cards, relationship map, timeline)
Week 4: Test on existing Year 4 data (Days 1-30)

Deliverable: Demo package showing Month 1 of Year 4
             (narrative + visuals + stats dashboard)
```

### Month 2: Expand Visualizations & Create Blog Template
```
Week 1-2: Build remaining visualizations (world map, stats dashboard, arc charts)
Week 3: Design blog/Substack template integrating narrative + visuals
Week 4: Generate Months 2-3 of Year 4 with full visual treatment

Deliverable: 3 complete "demo months" ready for audience testing
             (Months 1, 2, 3 of Year 4 with all visuals)
```

### Month 3: Audience Testing & Feedback Loop
```
Week 1-2: Post demo months on Reddit (r/DnD, r/TTRPG), Discord communities
          Ask: "Would you subscribe for this narrative + visual depth?"
          Gather feedback on:
          - Visual appeal
          - Narrative depth
          - Update frequency preference
          - Pricing willingness

Week 3-4: Adjust Pi4 output based on feedback
          Refine visualizations, narrative structure, data layers
          Prepare for Month 4 launch

Deliverable: Validated content format + audience interest signals
             Ready for Phase 2 (subscription launch)
```

---

## Why This Approach Works

### 1. **Addresses the "Interesting Enough?" Question**
- Raw text: "Day 5: Aria confronted Thorne about the betrayal."
- With visuals: [Trust graph showing Aria-Thorne drop from 0.8 to 0.2] + [Timeline infographic] + [Stats: "Betrayals: 1"]
- Visual + narrative + data = **compelling**

### 2. **Creates Engagement Hooks**
- Cliffhanger narrative + visual build-up = people come back next month
- Relationship maps show "Who's about to break up?" (predictive engagement)
- Arc charts show "Is Aria going to explode?" (tension visualization)

### 3. **Proves Authenticity**
- Subscribers can inspect the database
- Numbers don't lie; visuals show the underlying data
- Differentiates from generic "AI-generated" content
- This is **verifiable simulation**, not prompts

### 4. **Makes Pi4 Productive**
- Not idle; generating real business assets
- Outputs are immediately usable (SVG/PNG, blog-ready)
- Can be recycled for merchandise later (t-shirts, posters, campaign guides)

### 5. **De-risks Subscription Launch**
- Test content format with 50-100 people first
- Get feedback before building payment infrastructure
- Validate "people will actually pay for this"
- Reduces risk of Phase 2 marketplace pivot

---

## Visual Asset Generation: Technical Options

### Option A: Python (Recommended for Rapid Development)
**Tools**: matplotlib, Plotly, Pillow, networkx
**Pros**: Fast iteration, good for prototyping, simple syntax
**Cons**: Slower rendering than Node.js
**Best for**: Stats dashboards, arc charts, relationship networks (networkx has great graph layout)

```python
# Example: Relationship network in 15 lines
import networkx as nx
import matplotlib.pyplot as plt

G = nx.Graph()
G.add_edges_from([('Aria', 'Kael', {'weight': 0.9, 'type': 'ally'})])
pos = nx.spring_layout(G)
nx.draw(G, pos, with_labels=True, node_color='lightblue')
plt.savefig('network.svg', format='svg')
```

### Option B: Node.js + D3.js (Recommended for Interactivity)
**Tools**: D3.js, Plotly.js, svg.js, viz.js
**Pros**: Interactive, runs in browser, great for complex visualizations
**Cons**: Steeper learning curve
**Best for**: Relationship maps (interactive hover), world maps, timeline scrubbing

### Option C: Hybrid (Best Overall)
**Pi4 generates data** (Python) → **Frontend renders visuals** (React/D3)
- Pi4: Extract JSON, do heavy computation (networkx layout, stats)
- React frontend: Handle interactivity, animations, user exploration
- Decouples data from presentation

---

## Key Decision: When to Launch Subscription?

### Recommended Gate for Phase 2 Launch:

✅ **Go to Phase 2 (Launch Subscription) when:**
- You have 3+ months of Year 4 data with full visual treatment
- Reddit/Discord testing shows >60% interest ("Would pay for this")
- Visual rendering pipeline is automated (not manual)
- Blog template is polished (no rough edges)
- You've validated pricing ($5-12/month is acceptable)

❌ **Don't launch if:**
- Visuals are still being hand-made (unsustainable at scale)
- Audience feedback is lukewarm ("Meh, it's okay")
- Data extraction is fragile (breaks on edge cases)
- Only 20-30 days of narrative exist (too thin for subscription justification)

---

## Success Metrics: How to Know This is Working

### Month 1 Success Criteria:
- [ ] JSON extraction pipeline handles 30 days of Year 4 data without errors
- [ ] All 6 visualization types render correctly
- [ ] Time to generate full month package: <5 minutes
- [ ] Blog template looks professional (no broken images, aligned text)

### Month 2 Success Criteria:
- [ ] 3 complete demo months published to portfolio/blog
- [ ] Visual quality is high (no placeholder text, polished design)
- [ ] Narrative + visuals feel cohesive (story and data tell same story)
- [ ] Feedback collected from 50+ people in TTRPG communities

### Month 3 Success Criteria:
- [ ] >60% of feedback is positive ("I'd subscribe")
- [ ] Average willingness to pay: $7-10/month
- [ ] Identified top 3 visual assets people love
- [ ] Pi4 pipeline is fully automated (hands-off)

---

## Next Steps

1. **Clarify simulation state**: Is Year 4 simulation actually running and generating data? If yes, how many days currently exist?
2. **Design Pi4 pipeline**: Build JSON schema + extraction logic in the DreamCraft simulation repo
3. **Prototype first visualization**: Build one chart (relationship map or arc chart) to validate approach
4. **Test data quality**: Extract Month 1, verify narrative + data coherence
5. **Plan blog template**: Wireframe what Month 1 blog post will look like with visuals embedded

---

## Questions to Answer Before Implementation

1. **Data availability**: Does Pi1 have 30-100+ days of structured simulation data we can extract from?
2. **Simulation complexity**: Do the new algorithms (mentioned in recent commits) generate rich relationship + emotional data, or mostly surface-level events?
3. **Visualization preferences**: Are interactive (D3/Plotly) or static (SVG) visuals preferred?
4. **Blog platform**: Will you use Substack (built-in image support), Patreon (community features), or custom Ghost blog (full control)?
5. **Feedback timeline**: Can you get audience feedback in Month 3, or do you need it sooner?

---

**Document Version**: 1.0
**Last Updated**: 2026-01-09
**Owner**: VentureLab Strategy
