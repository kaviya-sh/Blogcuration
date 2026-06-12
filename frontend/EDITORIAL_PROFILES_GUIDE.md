# Editorial Profiles Feature - Implementation Guide

## Overview

This feature implements a weekly AI-powered analysis system that generates structured **editorial profiles** for each theme. These profiles analyze the 50 most recent published articles and extract:

- **Dominant Keywords** - Frequency analysis with sector mapping
- **Covered Sectors** - Which industry segments are being covered
- **Editorial Spirit** - A 50-word statement defining what makes an article worth publishing vs generic content

These profiles guide all downstream editorial decisions (article scoring, recommendations, editorial feedback).

---

## Architecture

### Frontend-Only Implementation (Backend Ready)
This is currently a frontend implementation with mock data. When backend is ready, simply replace the mock data calls with API endpoints.

### File Structure

```
src/
├── data/
│   └── editorialProfiles.js          # Mock editorial profile data
├── components/
│   └── EditorialProfileModal.svelte   # Modal to view detailed profiles
├── pages/admin/
│   └── EditorialProfilesManager.svelte # Admin page to manage profiles
└── stores/
    └── store.js                        # Updated with profile stores
```

---

## Key Files & Components

### 1. **editorialProfiles.js** (`src/data/editorialProfiles.js`)
Contains mock editorial profile data with 4 themes:
- **AI & LLMs** - Keywords: LLM, RAG, fine-tuning, prompt engineering
- **AI Startups & Funding** - Keywords: Series A, venture capital, product-market fit
- **Web & Infrastructure Engineering** - Keywords: vector database, PostgreSQL, RAG pipeline
- **Green Energy & Sustainability** - Keywords: renewable energy, carbon neutral, EV

**Structure:**
```javascript
{
  id: 'profile-ai-001',
  themeId: 'theme-ai-001',
  themeName: 'AI & LLMs',
  generatedAt: '2026-05-21T09:30:00Z',
  articlesAnalyzed: 50,
  dominantKeywords: [
    { keyword: 'large language model', frequency: 28, sectors: ['enterprise', 'research'] },
    // ...
  ],
  coveredSectors: [
    { sector: 'Enterprise & SaaS', articleCount: 18, growthTrend: 'rising' },
    // ...
  ],
  editorialSpirit: '...',  // 50-word statement
  topSources: [...],       // Top 5 sources
  topAuthors: [...],       // Top 5 authors
  lastCalibrationQuality: 0.87,    // 0-1, reflects accuracy
  acceptanceRate: 0.34,            // % articles accepted
  rejectionReasons: {              // Common reasons for rejection
    'Generic intro-to-ML content': 0.25,
    'Unsubstantiated hype claims': 0.22,
    // ...
  }
}
```

### 2. **EditorialProfileModal.svelte** (`src/components/EditorialProfileModal.svelte`)
A detailed modal component displaying:
- ✅ Profile metadata (generated date, articles analyzed, quality score)
- ✅ Full editorial spirit statement
- ✅ Dominant keywords with frequency and sectors
- ✅ Covered sectors with article counts and growth trends
- ✅ Top sources and authors
- ✅ Rejection reasons with percentages
- ✅ "Regenerate Profile" button (simulates backend regeneration)

**Usage:**
```svelte
<EditorialProfileModal
  profile={selectedProfile}
  isOpen={showProfileModal}
  on:close={closeModal}
/>
```

### 3. **EditorialProfilesManager.svelte** (`src/pages/admin/EditorialProfilesManager.svelte`)
Admin page with:
- 📊 Grid of profile cards (responsive 3-column layout)
- 🔄 "Regenerate" button for manual re-analysis
- 📖 "View Profile" button to open detailed modal
- ℹ️ Info box explaining how profiles work
- 📈 Quick stats per theme (articles, acceptance rate, quality)
- 🎯 Key keywords and sectors preview

### 4. **Store Updates** (`src/stores/store.js`)
New exports:
```javascript
export const editorialProfiles   = writable([]);
export const profilesLoading     = writable(false);
export const regeneratingProfile = writable(null);

export function fetchEditorialProfiles() { /* loads mock data */ }
export async function regenerateProfile(profileId, themeName) { /* simulates regen */ }
```

### 5. **Admin Navigation**
- Updated `AdminShell.svelte` to import and render the new page
- Updated `AdminDashboard.svelte` quick-nav with "Editorial Profiles" card
- Navigation: Dashboard → Profiles

---

## User Workflow

### For Admin Users:
1. **View Profiles**
   - Login to admin panel
   - Click "Profiles" in navigation
   - See grid of all theme editorial profiles

2. **View Detailed Profile**
   - Click "View Profile" on any card
   - See full analysis: keywords, sectors, editorial spirit
   - View top sources, authors, rejection reasons
   - View calibration quality score

3. **Regenerate Profile**
   - Click "Regenerate" button on card or modal
   - Simulates weekly re-analysis (1.5s delay)
   - Updates profile with new generation timestamp

---

## Data Flow

### Current (Frontend Mock):
```
editorialProfiles.js (mock data)
    ↓
store.fetchEditorialProfiles()
    ↓
EditorialProfilesManager component
    ↓
User interaction
```

### After Backend Integration:
```
Backend API /api/themes/{themeId}/editorial-profile
    ↓
store.fetchEditorialProfiles() 
    ↓ (calls backend instead of mock)
EditorialProfilesManager component
    ↓
User interaction
```

---

## Backend Integration (When Ready)

### API Endpoints to Implement:

**1. Get all editorial profiles**
```
GET /api/editorial-profiles
Response:
{
  profiles: [{ profile object }, ...]
}
```

**2. Get profile for specific theme**
```
GET /api/editorial-profiles/:themeId
Response: { profile object }
```

**3. Regenerate profile (trigger analysis)**
```
POST /api/editorial-profiles/:themeId/regenerate
Response: { profile object with new generatedAt }
```

### Integration Steps:
1. Replace mock data calls in `store.js`:
   ```javascript
   export async function fetchEditorialProfiles() {
     const res = await fetch(`${API_BASE}/editorial-profiles`, {
       headers: { 'Authorization': `Bearer ${$adminKey}` }
     });
     editorialProfiles.set(await res.json());
   }
   ```

2. Update regenerateProfile:
   ```javascript
   export async function regenerateProfile(profileId, themeName) {
     regeneratingProfile.set(profileId);
     const res = await fetch(`${API_BASE}/editorial-profiles/${themeName}/regenerate`, {
       method: 'POST',
       headers: { 'Authorization': `Bearer ${$adminKey}` }
     });
     editorialProfiles.update(ps => 
       ps.map(p => p.id === profileId ? await res.json() : p)
     );
     regeneratingProfile.set(null);
   }
   ```

---

## Weekly Analysis Process (Backend Implementation)

The backend should:

1. **Every Monday at 9 AM UTC**, for each theme:
   - Query 50 most recent published articles
   - Extract and rank keywords using TF-IDF or similar
   - Map keywords to industry sectors
   - Generate editorial spirit statement (can use template or LLM)
   - Identify top sources and authors
   - Calculate calibration quality (how well profile matches past decisions)
   - Calculate acceptance/rejection rates

2. **Quality Score Calculation**:
   - Compare profile's predicted article scores vs actual published scores
   - 0.85+ = Excellent (profile accurately predicts what editors like)
   - 0.75-0.85 = Good
   - <0.75 = Fair (profile needs refinement)

3. **Store Results** with timestamp for next analysis

---

## Features & UI Details

### Profile Card Display:
- Theme name and generation date
- 3-column stat grid: Articles Analyzed | Acceptance Rate | Quality
- Editorial spirit preview (first 120 characters)
- Top 3 keywords with "+N more" indicator
- Top 2 sectors with article counts
- "Regenerate" and "View Profile" buttons

### Modal Display:
- Full theme name and profile metadata
- Complete editorial spirit (50 words, with word count)
- All dominant keywords with frequency and sector mapping
- All covered sectors with article counts and growth trends
- All top sources (ranked 1-5)
- All top authors (ranked 1-5)
- All rejection reasons with percentage bars

### Responsive Design:
- Desktop: 3-column grid for profile cards
- Tablet: 2-column grid
- Mobile: 1-column stack
- Modal adjusts for smaller screens

---

## Metrics Explained

### Dominant Keywords
- **Frequency**: How many articles mention this keyword
- **Sectors**: Which industry segments discuss this keyword
- Example: "RAG" appears 24 times, mostly in "enterprise" and "infrastructure"

### Covered Sectors
- **Article Count**: How many of the 50 articles cover this sector
- **Growth Trend**: "rising" = more coverage this week, "stable" = consistent
- Used to understand theme diversification

### Editorial Spirit
- **50-word statement** defining the theme's editorial identity
- Example: "We publish rigorous analyses of production AI systems... We favor technical depth, real-world constraints, and founder/engineer perspectives over hype."

### Calibration Quality
- **0-1 score** showing how accurately the profile predicts editor decisions
- Calculated by comparing profile's keyword scores to actual published articles
- High quality = profile is good at predicting what gets published

### Acceptance Rate
- **Percentage** of submitted articles accepted for publication
- Helps understand theme selectivity
- Lower rates = higher standards

---

## Customization Points

### To adjust keyword extraction:
- Edit `dominantKeywords` array in editorialProfiles.js
- Change frequency thresholds

### To change sector classifications:
- Update `coveredSectors` mapping
- Add/remove sectors as needed

### To update editorial spirit:
- Edit the 50-word statement (store as plain text)
- Guidelines: Be specific about what the theme publishes, avoid vague language

### To modify quality calculation:
- Adjust how `lastCalibrationQuality` is calculated in backend
- Currently: 0.80-0.95 range, should reflect actual accuracy

---

## Testing

### Current Mock Data:
The component works with 4 pre-loaded profiles (AI, Startups, Engineering, Sustainability). All buttons are functional and demonstrate:
- ✅ Profile card display
- ✅ Modal open/close
- ✅ Regenerate simulation (1.5s delay)
- ✅ Responsive grid layout
- ✅ Data visualization

### To test:
1. Run the app
2. Navigate to Admin → Profiles
3. Click cards to open modal
4. Click "Regenerate" to see animation
5. Inspect data in browser DevTools

---

## Future Enhancements

- [ ] **Export profiles** as PDF reports for stakeholders
- [ ] **Profile comparison** - see how profiles change week-over-week
- [ ] **A/B testing** - test different editorial spirits and measure impact
- [ ] **Team feedback** - allow editors to rate profile accuracy
- [ ] **Custom metrics** - let themes define their own quality metrics
- [ ] **Scheduled regeneration** - automate the weekly run
- [ ] **Keyword trending** - visualize which keywords are rising/falling
- [ ] **Author insights** - recommend articles based on top authors

---

## File Summary

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| `editorialProfiles.js` | Mock data | 150+ | ✅ Complete |
| `EditorialProfileModal.svelte` | Detail view modal | 300+ | ✅ Complete |
| `EditorialProfilesManager.svelte` | Admin page | 250+ | ✅ Complete |
| `store.js` (updated) | State management | +20 lines | ✅ Complete |
| `AdminShell.svelte` (updated) | Navigation | +2 imports | ✅ Complete |
| `AdminDashboard.svelte` (updated) | Quick nav | +1 card | ✅ Complete |

---

## Support

All components are fully self-contained and use standard Svelte patterns:
- Reactive stores for state
- Event dispatching for communication
- CSS custom properties for theming
- Responsive grid layouts
- Accessibility attributes

No external dependencies required beyond Svelte.
