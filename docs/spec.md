# Product Specification: **BayWise — Aransas Pass Guided Fishing Intelligence App**

## 1. Product Summary

**BayWise** is a mobile-first fishing journal and local intelligence app for people who take guided fishing trips around **Aransas Pass, Port Aransas, Redfish Bay, Lydia Ann Channel, Corpus Christi Bay, Aransas Bay, and Rockport**.

The app helps anglers capture what they learned on a guided trip, convert that into reusable fishing “pattern cards,” and build a personal playbook for future trips.

The app should **not** be positioned as a secret spot-sharing app. It should be positioned as:

> **A fishing memory engine that helps anglers remember what the guide knew — without burning the guide’s spots.**

Aransas Pass is a strong local launch market because it sits in the Coastal Bend and is surrounded by bay, flats, channel, boating, fishing, tourism, and guide-driven outdoor activity. The City of Aransas Pass even brands itself around fishing with the phrase “Where they bite every day.” ([Aransas Pass][1]) The Aransas Pass Chamber also describes the area as part of the Texas Gulf Coast / Coastal Bend with hospitality, recreation, and outdoor activity as major local themes. ([Aransas Pass Chamber of Commerce][2])

---

# 2. Working Product Name

## Recommended name

**BayWise**

## Alternate names

* **GuideMind Fishing**
* **Bay Pattern**
* **Redfish Recall**
* **FlatsWise**
* **Trip-to-Tide**
* **Coastal Pattern Log**
* **Guide Debrief**

My recommendation is **BayWise** because it is broad enough to expand beyond Aransas Pass later, but still feels local, coastal, and smart.

---

# 3. Core Product Thesis

Most anglers who go on a guided fishing trip learn more than they can retain.

They remember:

* “We caught redfish.”
* “We used shrimp.”
* “The guide said something about tide.”
* “We were near grass or oyster or something.”

But they forget the important pattern:

* Tide movement.
* Wind direction.
* Water clarity.
* Structure.
* Depth.
* Bait movement.
* Presentation.
* Time window.
* What changed when the bite stopped.
* Why the guide moved.

**BayWise captures that knowledge and turns it into reusable fishing intelligence.**

---

# 4. Target Users

## Primary User: Guided Trip Angler

A tourist, beginner, business traveler, or weekend fisherman who books a guide around Aransas Pass / Port Aransas / Rockport and wants to actually learn from the trip.

### Pain points

* Forgets what the guide explained.
* Does not understand why the fish were there.
* Wants to fish again without a guide but lacks confidence.
* Takes photos but does not capture conditions.
* Does not know how tide, wind, bait, water clarity, and structure connect.

## Secondary User: Fishing Guide

A local guide who wants to give clients a polished post-trip recap, improve repeat bookings, and educate clients without exposing exact spots.

### Pain points

* Clients forget what they learned.
* Clients ask repetitive questions after the trip.
* Guides want referrals and repeat business.
* Guides do not want their exact spots published.
* Guides need better follow-up marketing.

## Tertiary User: Local Fishing Businesses

Bait shops, tackle shops, marinas, boat ramps, kayak rentals, lodging, restaurants, and tourism partners.

### Pain points

* Need visibility to anglers visiting the area.
* Want to sell bait, tackle, ice, fuel, lodging, and food.
* Want to sponsor useful local fishing content.

---

# 5. Local Market Fit: Aransas Pass Edition

The MVP should launch as a **hyperlocal Aransas Pass / Coastal Bend version**, not a generic fishing app.

## Local waters to include

* Redfish Bay
* Lydia Ann Channel
* Corpus Christi Bay
* Aransas Bay
* Copano Bay
* Port Aransas jetties
* Rockport / Fulton area
* Estes Flats
* South Bay
* St. Charles Bay

## Local species focus

* Redfish / red drum
* Speckled trout / spotted seatrout
* Flounder
* Black drum
* Sheepshead
* Mangrove snapper
* Spanish mackerel
* Pompano
* Jack crevalle
* Hardhead / gafftop as nuisance catch

The app should include **regulation reminders**, but the app should not treat stored regulation data as permanently reliable. TPWD’s Outdoor Annual is the authoritative source for Texas fishing regulations, and Texas requires a current fishing license with the appropriate endorsement for public waters; a saltwater endorsement is required for coastal waters. ([Texas Parks & Wildlife][3])

---

# 6. MVP Goal

Build a mobile-first web app that lets a user:

1. Create a guided fishing trip record.
2. Capture trip conditions.
3. Capture species caught.
4. Capture bait/lure/presentation.
5. Capture structure and habitat.
6. Add photos and notes.
7. Run an AI debrief.
8. Generate a **Pattern Card**.
9. Save the pattern to a personal fishing playbook.
10. Share a polished trip recap without revealing exact private locations.

---

# 7. Core User Workflow

## Workflow A: Before the Guided Trip

User opens BayWise and creates a new trip.

### Inputs

* Trip date
* Guide name
* Guide company
* Launch location
* Target species
* Type of trip:

  * Bay boat
  * Flats boat
  * Kayak
  * Wade fishing
  * Jetty
  * Nearshore
  * Offshore
* Expected waters:

  * Redfish Bay
  * Lydia Ann Channel
  * Aransas Bay
  * Corpus Christi Bay
  * Port Aransas jetties
  * Other

### Pre-trip checklist

The app gives the user a checklist:

* Fishing license and saltwater endorsement
* Polarized sunglasses
* Hat
* Sunscreen
* Soft cooler
* Motion sickness medicine if needed
* Non-marking shoes
* Water
* Camera
* Cash tip
* Questions to ask the guide

### Guide question prompt

The app prepares a “Guide Debrief Card” with questions:

1. What pattern are we fishing today?
2. What made you choose this area?
3. What tide stage mattered most?
4. What were you looking for in the water?
5. What bait or lure matched the conditions?
6. What would change if the wind shifted?
7. What should I try next time if I fish alone?

---

## Workflow B: During the Trip

User can quickly log events without being glued to the phone.

### Quick catch log

* Species
* Approximate size
* Keep/release
* Bait/lure
* Presentation
* Structure
* Photo
* Time

### One-tap condition markers

* Birds working
* Bait present
* Nervous bait
* Slicks
* Mud boils
* Tailing reds
* Grass edges
* Oyster reef
* Channel edge
* Drain
* Potholes
* Sand pockets
* Marsh edge
* Jetty rocks
* Deep cut
* Current seam

### Privacy design

The app should avoid encouraging users to publish exact coordinates from guided trips.

Instead of exact public locations, use privacy tiers:

* **Exact private pin**: visible only to user.
* **General area**: visible in private recap.
* **Pattern only**: no map, just conditions and structure.
* **Public share**: no coordinates, no sensitive spot details.

---

## Workflow C: After the Trip

User completes the guided debrief.

### Debrief inputs

* What did the guide say was the main pattern?
* What changed during the day?
* When did the bite turn on?
* When did the bite shut off?
* What did the guide look for before stopping?
* What did the guide avoid?
* What would the guide try tomorrow?
* What should the user practice?

### AI output

The app generates:

1. Trip summary
2. Species summary
3. Conditions summary
4. Pattern explanation
5. “Why the fish were there”
6. “What to try next time”
7. Local caution notes
8. Conservation/regulation reminder
9. Shareable recap
10. Private playbook entry

---

# 8. Signature Feature: Pattern Cards

A **Pattern Card** is the core artifact of the app.

## Example Pattern Card

### Title

**Incoming Tide Redfish on Grass Edges**

### Summary

Redfish were feeding during moving water near grass-to-channel transitions. The best action happened when bait was visible and water had enough movement to push shrimp and small baitfish off the flats.

### Conditions

* Target species: Redfish
* Water type: Bay / flats
* Structure: Grass edge, channel edge, potholes
* Tide: Incoming
* Wind: Southeast
* Water clarity: Slightly stained
* Bait: Live shrimp under popping cork
* Presentation: Slow drift along grass edge
* Bite window: Morning incoming tide

### Lesson

The fish were positioned where moving water pushed bait from shallow grass toward slightly deeper edges.

### Try next time

Look for similar structure on an incoming tide. Prioritize visible bait, subtle current, and grass-to-depth transitions.

### Do not share publicly

Exact guide route and private stops should remain hidden.

---

# 9. Main App Modules

## 9.1 Trip Journal

The trip journal stores each fishing trip.

### Features

* Create trip
* Edit trip
* Add photos
* Add catches
* Add notes
* Add guide info
* Add launch point
* Add general water body
* Add conditions
* Add post-trip debrief
* Generate pattern card

---

## 9.2 Catch Log

The catch log stores individual fish caught.

### Fields

* Trip ID
* Species
* Time caught
* Approximate length
* Approximate weight
* Kept or released
* Bait/lure
* Hook type
* Presentation
* Structure
* Water depth
* Photo
* Notes

---

## 9.3 Condition Logger

Captures environmental and water conditions.

### Fields

* Date
* Time
* General location
* Tide stage
* Wind direction
* Wind speed
* Cloud cover
* Air temperature
* Water temperature if known
* Water clarity
* Salinity if known
* Current strength
* Moon phase
* Barometric pressure if available
* Recent weather
* Bait activity
* Bird activity

Some of this can be manually entered in MVP. Later versions can integrate weather, tides, and marine APIs.

---

## 9.4 Structure and Habitat Tags

This matters heavily in bay fishing.

### Habitat tags

* Grass flat
* Grass edge
* Oyster reef
* Shell bottom
* Sand pocket
* Mud bottom
* Potholes
* Marsh drain
* Channel edge
* Current seam
* Jetty rocks
* Dock lights
* Bridge piling
* Deep cut
* Spoil island
* Shoreline grass
* Mangrove edge, if applicable

---

## 9.5 AI Debrief Engine

This is the intelligence layer.

### Inputs

* Trip notes
* Catch records
* Species
* Structure
* Tide
* Wind
* Bait/lure
* Guide answers
* Photos metadata if available
* User skill level

### Outputs

* Trip summary
* Pattern card
* Species behavior explanation
* “What mattered most”
* “What probably did not matter”
* Suggested next trip strategy
* Questions to ask the guide next time
* Personal learning notes
* Shareable recap
* Private recap

---

## 9.6 Guide Mode

A guide can create a branded trip recap for clients.

### Features

* Guide profile
* Branded trip summary
* Client photo gallery
* Conditions recap
* Species caught
* Educational pattern explanation
* “Book again” link
* Tip/payment link
* Referral link
* Review link
* Public-safe share version

### Important guide privacy controls

Guides should be able to mark:

* Exact spots hidden
* Route hidden
* Bait details hidden
* General pattern only
* Shareable photos approved
* Client-only recap

---

## 9.7 Local Knowledge Base

The app should include general educational content for Aransas Pass fishing.

### Content examples

* How incoming tide changes Redfish Bay flats
* How to fish grass edges
* How to identify bait activity
* How to use a popping cork
* What to ask a fishing guide
* Redfish vs black drum behavior
* Speckled trout basics
* Flounder migration basics
* Jetty fishing basics
* How wind affects bay fishing
* How to fish respectfully around guides
* Why not to share exact guided spots

---

# 10. AI Features

## 10.1 Pattern Extraction

The AI should extract the likely fishing pattern from messy notes.

### Example user input

> “We started near some grass and potholes. Guide said the water was moving right. Caught reds on shrimp under cork. Later the tide slowed and bite died.”

### AI output

> The primary pattern was redfish feeding on moving water near grass/pothole transitions. The bait presentation worked because shrimp under a popping cork stayed visible and suspended over shallow structure. The bite likely slowed as water movement decreased.

---

## 10.2 Trip Debrief Chat

The user can ask:

* Why did we catch fish there?
* What should I try tomorrow?
* What did the tide have to do with it?
* Why did the guide move?
* What lure would imitate the bait we used?
* What should I buy at the tackle shop?
* What should I practice before my next trip?

---

## 10.3 Shareable Social Recap

The app generates a polished but privacy-safe post.

### Example

> Great morning on the water around Aransas Pass. We found redfish feeding during moving water near shallow grass and deeper edges. The lesson of the day: watch the bait, respect the tide, and don’t leave fish to find fish. Huge thanks to the guide for turning a fishing trip into a real lesson.

No exact spot. No guide secret burned.

---

## 10.4 Regulation Reminder Assistant

The app should provide reminders and direct links to TPWD rather than acting as the final authority.

Example:

> Check TPWD before keeping fish. Texas coastal fishing requires the correct license and saltwater endorsement, and bag/length rules vary by species. TPWD’s Outdoor Annual is the official source. ([Texas Parks & Wildlife][3])

TPWD also has species-specific pages for red drum, spotted seatrout, and flounder bag/length rules. ([Texas Parks & Wildlife][4])

---

# 11. Data Model

## Entity: User

```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "home_location": "string",
  "skill_level": "beginner | intermediate | advanced | guide",
  "created_at": "datetime"
}
```

---

## Entity: Trip

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "trip_type": "guided | solo | group | scouting",
  "trip_date": "date",
  "title": "string",
  "guide_name": "string",
  "guide_company": "string",
  "general_area": "string",
  "launch_location": "string",
  "water_body": "string",
  "target_species": ["redfish", "speckled_trout"],
  "privacy_level": "private | pattern_only | public_safe",
  "notes": "text",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

## Entity: Catch

```json
{
  "id": "uuid",
  "trip_id": "uuid",
  "species": "string",
  "time_caught": "datetime",
  "approx_length_inches": "number",
  "approx_weight_lbs": "number",
  "kept_or_released": "kept | released | unknown",
  "bait_or_lure": "string",
  "presentation": "string",
  "structure_tags": ["grass_edge", "oyster", "channel_edge"],
  "photo_url": "string",
  "notes": "text"
}
```

---

## Entity: Conditions

```json
{
  "id": "uuid",
  "trip_id": "uuid",
  "time_observed": "datetime",
  "tide_stage": "incoming | outgoing | high | low | slack | unknown",
  "wind_direction": "N | NE | E | SE | S | SW | W | NW",
  "wind_speed_mph": "number",
  "water_clarity": "clear | slightly_stained | stained | muddy | unknown",
  "water_depth_ft": "number",
  "cloud_cover": "clear | partly_cloudy | overcast | stormy",
  "bait_activity": "none | low | medium | high",
  "bird_activity": "none | low | medium | high",
  "current_strength": "none | weak | moderate | strong",
  "notes": "text"
}
```

---

## Entity: Pattern Card

```json
{
  "id": "uuid",
  "trip_id": "uuid",
  "title": "string",
  "summary": "text",
  "target_species": ["string"],
  "tide_pattern": "string",
  "wind_pattern": "string",
  "structure_pattern": "string",
  "bait_pattern": "string",
  "presentation_pattern": "string",
  "bite_window": "string",
  "why_it_worked": "text",
  "try_next_time": "text",
  "confidence_score": "number",
  "privacy_warning": "text",
  "created_at": "datetime"
}
```

---

## Entity: Guide Profile

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "guide_name": "string",
  "company_name": "string",
  "service_area": ["Aransas Pass", "Port Aransas", "Rockport"],
  "target_species": ["redfish", "speckled_trout", "flounder"],
  "booking_url": "string",
  "phone": "string",
  "email": "string",
  "logo_url": "string",
  "privacy_defaults": {
    "hide_exact_locations": true,
    "hide_route": true,
    "allow_pattern_summary": true
  }
}
```

---

# 12. MVP Screens

## Screen 1: Home Dashboard

Shows:

* Recent trips
* Saved pattern cards
* Start new trip
* Ask BayWise
* Local regulation links
* Guide Mode entry

---

## Screen 2: New Trip

Fields:

* Trip title
* Date
* Guided or solo
* Guide name
* General area
* Target species
* Trip type
* Privacy setting

---

## Screen 3: Quick Catch Log

Fast mobile form:

* Species
* Photo
* Bait/lure
* Structure
* Kept/released
* Notes

---

## Screen 4: Conditions

Simple buttons:

* Tide stage
* Wind
* Water clarity
* Structure
* Bait activity
* Bird activity
* Current

---

## Screen 5: Guide Debrief

Prompted questionnaire:

* What pattern were we fishing?
* Why did this area produce?
* What changed?
* What would you try next?
* What should I learn?

---

## Screen 6: Pattern Card

Displays generated fishing lesson.

Sections:

* Pattern name
* Conditions
* Structure
* Bait/lure
* Why it worked
* Try next time
* Private notes
* Share button

---

## Screen 7: Playbook

Saved patterns grouped by:

* Species
* Water body
* Tide
* Structure
* Bait/lure
* Season
* Confidence

---

## Screen 8: Share Recap

Generates:

* Public social caption
* Private trip summary
* Guide thank-you post
* Client recap PDF
* No-location version

---

# 13. Privacy and Ethics Requirements

This app should be extremely careful about fishing culture.

## Rules

1. Do not encourage users to expose guide spots.
2. Default all exact locations to private.
3. Public posts should remove coordinates.
4. Pattern sharing should focus on conditions, not GPS.
5. Guide-created trips should let guides control what is shared.
6. The app should include conservation reminders.
7. The app should link to TPWD for official rules.
8. The app should support catch-and-release logging.
9. The app should avoid creating “spot burning” leaderboards.

## Product principle

> Teach patterns, not coordinates.

---

# 14. Monetization

## Consumer plan

### Free

* 3 trips
* Basic catch log
* Basic notes
* Photos
* Manual conditions

### Premium: $9/month

* Unlimited trips
* AI pattern cards
* AI debrief chat
* Playbook
* Exportable recaps
* Local species lessons
* Tide/weather integrations

### Local Pack: $29 one-time

**Aransas Pass Inshore Starter Pack**

Includes:

* Redfish Bay pattern guide
* Common structures
* Species basics
* Trip checklist
* Guide debrief templates
* Local bait/lure glossary

---

## Guide plan

### Guide Basic: $29/month

* Branded trip recaps
* Client photo galleries
* Booking link
* Review request link
* Privacy-safe social posts

### Guide Pro: $99/month

* Unlimited client recaps
* Guide dashboard
* Repeat-client tracking
* Client education library
* Referral capture
* Email/SMS follow-up templates

---

## Local sponsor model

Local businesses can sponsor useful sections.

Examples:

* Bait shop sponsor for “what to bring”
* Marina sponsor for launch checklist
* Restaurant sponsor for post-trip meal
* Lodge/hotel sponsor for visiting anglers
* Tackle shop sponsor for species gear list

---

# 15. Suggested Tech Stack

Given your normal build style, I would build this as a fast MVP with:

## Frontend

* Next.js
* React
* TypeScript
* Tailwind or shadcn/ui
* Mobile-first PWA

## Backend

* FastAPI or Next.js API routes
* PostgreSQL / Supabase
* Supabase Auth
* Supabase Storage for photos
* PostGIS later for private location/geospatial features

## AI

* OpenAI API for debrief and pattern card generation
* Structured JSON outputs
* Prompt templates by trip type/species
* RAG later for local fishing knowledge base

## External APIs, later phase

* Tide API
* Weather API
* Marine forecast API
* Moon phase API
* TPWD regulation links
* Mapbox or Google Maps
* Stripe for subscriptions

---

# 16. AI Prompt Template

## Pattern Card Generation Prompt

```text
You are BayWise, a coastal fishing trip debrief assistant.

Your job is to convert a fishing trip log into a privacy-safe fishing pattern card.

Do not reveal exact GPS coordinates.
Do not encourage users to expose guide spots.
Focus on species behavior, structure, tide, wind, water clarity, bait, and presentation.

Trip data:
{{trip_data}}

Catch data:
{{catch_data}}

Conditions:
{{conditions}}

Guide notes:
{{guide_notes}}

Return structured JSON with:
- title
- summary
- target_species
- tide_pattern
- wind_pattern
- structure_pattern
- bait_pattern
- presentation_pattern
- bite_window
- why_it_worked
- what_to_try_next_time
- confidence_score
- privacy_warning
- conservation_note
```

---

# 17. Example Output

```json
{
  "title": "Incoming Tide Redfish on Grass Edges",
  "summary": "The best bite happened when moving water pushed bait across shallow grass and toward slightly deeper edges.",
  "target_species": ["redfish"],
  "tide_pattern": "Incoming tide with steady water movement",
  "wind_pattern": "Manageable southeast wind",
  "structure_pattern": "Grass edge, potholes, and channel transition",
  "bait_pattern": "Live shrimp under popping cork",
  "presentation_pattern": "Slow drift with occasional cork pops",
  "bite_window": "Morning incoming tide",
  "why_it_worked": "Redfish were positioned where bait was being moved off the flat by water movement.",
  "what_to_try_next_time": "Look for visible bait, moving water, and grass-to-depth transitions. Avoid slack water unless fish are visibly active.",
  "confidence_score": 0.82,
  "privacy_warning": "Do not publicly share exact guide locations or routes.",
  "conservation_note": "Check TPWD regulations before keeping fish."
}
```

---

# 18. Development Phases

## Phase 1: Clickable Prototype

Goal: Validate the concept.

Build:

* Landing page
* New trip form
* Catch log mock
* Condition form
* Pattern card output
* Sample Aransas Pass trip
* Guide recap mock

No login required yet.

---

## Phase 2: MVP

Goal: Real users can log trips.

Build:

* Auth
* Trip CRUD
* Catch log
* Conditions
* Photo upload
* AI pattern generation
* Playbook
* Share recap
* TPWD links

---

## Phase 3: Guide Pilot

Goal: Test with 3–5 local guides.

Build:

* Guide profiles
* Branded recap pages
* Client trip links
* Booking/review CTA
* Guide privacy controls

---

## Phase 4: Local Intelligence Layer

Goal: Make it feel deeply local.

Build:

* Aransas Pass local pack
* Redfish Bay lessons
* Species-specific prompts
* Tide/weather integrations
* Local sponsor placements
* Local tackle recommendations

---

## Phase 5: Expansion

Goal: Repeat the model in nearby coastal regions.

Expansion areas:

* Port Aransas
* Rockport
* Corpus Christi
* Matagorda
* Galveston
* South Padre
* Louisiana marsh
* Florida Gulf Coast

---

# 19. MVP Success Metrics

## Consumer metrics

* Number of trips created
* Percentage of trips with catch logs
* Percentage of trips with completed debriefs
* Number of generated pattern cards
* Number of saved playbook entries
* Number of shared recaps
* Repeat usage after second fishing trip

## Guide metrics

* Number of guide-created recaps
* Client recap open rate
* Booking CTA clicks
* Review CTA clicks
* Repeat booking inquiries
* Guide retention

## Business metrics

* Free-to-paid conversion
* Local pack purchases
* Guide plan subscriptions
* Sponsor revenue
* Cost per AI-generated pattern card

---

# 20. Differentiation

BayWise should not compete directly with Navionics, Fishbrain, or tide/weather apps.

## Positioning

| Product Type        | What It Does                     | BayWise Difference                    |
| ------------------- | -------------------------------- | ------------------------------------- |
| Fishing maps        | Shows water, contours, locations | BayWise teaches patterns              |
| Social fishing apps | Share catches                    | BayWise preserves learning            |
| Tide apps           | Show tide and weather            | BayWise explains what tide meant      |
| Guide booking apps  | Find guides                      | BayWise makes the trip more valuable  |
| Journals            | Store notes                      | BayWise turns notes into intelligence |

---

# 21. Landing Page Copy

## Headline

**Turn your guided fishing trip into a personal fishing playbook.**

## Subheadline

BayWise helps anglers capture what they learned on the water, understand why the fish were there, and remember the pattern for next time — without sharing a guide’s secret spots.

## CTA

**Log Your First Trip**

## Secondary CTA

**Create a Guide Recap**

## Value bullets

* Capture catches, bait, tide, wind, structure, and guide notes.
* Generate AI-powered fishing pattern cards.
* Build a private playbook of what worked.
* Share trip recaps without burning exact locations.
* Designed first for Aransas Pass, Port Aransas, Rockport, and Redfish Bay anglers.

---

# 22. Recommended First Build

The first build should be **not a map app**.

Build this first:

1. Trip creation
2. Catch log
3. Conditions form
4. Guide debrief form
5. AI-generated Pattern Card
6. Personal Playbook
7. Privacy-safe social recap

Maps, tides, weather, and advanced local intelligence can come later.

The wedge is simple:

> **People pay hundreds or thousands for guided fishing trips. BayWise helps them keep the lesson.**

[1]: https://aptx.gov/?utm_source=chatgpt.com "Aransas Pass, TX | Official Website"
[2]: https://www.aransaspass.org/?utm_source=chatgpt.com "Aransas Pass Chamber of Commerce: Home"
[3]: https://tpwd.texas.gov/regulations/outdoor-annual/fishing/general-rules-regulations/general-fishing-regulations?utm_source=chatgpt.com "General Fishing Regulations - Texas Parks and Wildlife"
[4]: https://tpwd.texas.gov/regulations/outdoor-annual/fishing/saltwater-fishing/bag-length-limits/drum-bag-length-limits?utm_source=chatgpt.com "Drum Bag & Length Limits - Texas Parks and Wildlife"

