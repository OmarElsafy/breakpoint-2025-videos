# Breakpoint 2025 Videos

Solana Breakpoint 2025 – all 199 talks, organized by category so you can actually watch what you care about instead of scrolling a giant playlist.  

## Why this exists

The official Breakpoint 2025 playlist is amazing but unusable if you have limited time: 199 videos, no categories, and no easy way to focus on your niche (DeFi, infra, AI, payments, etc.).  
This project solves that by turning the playlist into a browsable app with filters and search, so you can go deep on your lane instead of randomly clicking thumbnails. [page:33]

## What you can do

- Browse every talk in a **filterable grid** instead of one long list. [page:32]  
- Filter by category (DeFi, Credit, Payments, Infrastructure, AI, Institutional, Community, Security, DePIN, Prediction Markets, NFTs/Gaming, RWA, Data, Wallets, Fundraising, etc.). [page:32][page:33]  
- Search by **title, company, or speaker** to build your own focused watchlist. [page:32]  
- Open any talk in a modal YouTube player without leaving the page. [page:32]

## How it works

- `videos-data.js` contains a hand‑curated array of all Breakpoint 2025 talks with `id`, `title`, `category`, `companies`, and `speakers`. [page:33]  
- `app.js` loads that data, renders cards into a responsive grid, and wires up search, category filters, and the video modal. [page:32]  
- `index.html` and `styles.css` handle the layout, including a compact left sidebar inspired by research dashboards. [page:48][page:49]

## Local setup

```bash
git clone https://github.com/OmarElsafy/breakpoint-2025-videos.git
cd breakpoint-2025-videos
# open index.html in your browser (or use a simple static server)
