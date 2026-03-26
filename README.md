# Janice Divina Liad — REALTOR® Website

**Domain:** janicedivinarealestate.com  
**Brokerage:** HomeSmart PV & Associates  
**DRE:** #02099146  
**Stack:** Static HTML → GitHub → Vercel  

## Quick Start

1. Push this repo to GitHub
2. Connect the repo to Vercel
3. Add custom domain `janicedivinarealestate.com` in Vercel → Settings → Domains
4. Update DNS at your domain registrar to point to Vercel

## Project Structure

```
janice-site/
├── public/
│   ├── index.html          ← Main website (all sections)
│   └── images/
│       ├── janice-headshot.jpg
│       └── homesmart-logo.jpg
├── package.json
├── vercel.json             ← Vercel deploy config
└── README.md
```

## Content Updates

All content is in `public/index.html`. Search for these to update:
- **Phone:** `(209) 305-9401`
- **Email:** `jdivinare@outlook.com`
- **Listings:** Search for `prop-card` sections
- **Blog posts:** Search for `blogPosts` in the script section
- **Reviews:** Search for `review-card` sections

## Features

- Full brand website with Ninja Selling methodology
- Buyer's Guide (10-step Ninja process + lead magnet)
- Seller's Guide (9-step process + lead magnet)
- YouTube channel integration
- Blog with modal readers
- Zillow reviews section
- Booking/consultation portal
- Agent portal (CRM, listings, timeline, reviews)
- Client portal (timeline, documents, messaging)
- Vendor partner portal
- Property carousel
- Mobile responsive

## Future Phases

- Connect Supabase for real database (contacts, bookings, leads)
- Add authentication for agent/client/vendor portals
- Integrate with real MLS data
- Connect email service for lead magnets
- Add Google Analytics
