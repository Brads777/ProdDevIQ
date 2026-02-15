---
name: seo-master
description: >
  Comprehensive SEO guide covering technical SEO, content optimization,
  site auditing, Core Web Vitals, and structured data.
  Consolidates 3 SEO skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# SEO Master Skill

Comprehensive SEO guide covering technical fundamentals, content optimization, Core Web Vitals, structured data implementation, site auditing, and Next.js-specific optimization.

## When to Use

Invoke this skill when:
- User says "SEO", "improve search rankings", "Google optimization"
- Conducting site audits or technical SEO reviews
- Optimizing meta tags, structured data, or content for search
- Improving Core Web Vitals (LCP, FID/INP, CLS)
- Implementing Next.js metadata, sitemaps, or dynamic OG images
- Diagnosing crawl issues, duplicate content, or indexing problems
- Setting up Google Search Console or Lighthouse CI monitoring

## Technical SEO Checklist

### Meta Tags

**Essential tags for every page:**
```html
<!-- Title: 50-60 characters, unique per page -->
<title>Primary Keyword - Secondary Keyword | Brand Name</title>

<!-- Meta description: 150-160 characters, compelling CTA -->
<meta name="description" content="Concise summary with target keywords. Include call-to-action.">

<!-- Viewport (mobile-friendly) -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Charset -->
<meta charset="UTF-8">

<!-- Open Graph (social sharing) -->
<meta property="og:title" content="Title for social media">
<meta property="og:description" content="Description for social shares">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Title for Twitter">
<meta name="twitter:description" content="Description for Twitter">
<meta name="twitter:image" content="https://example.com/twitter-image.jpg">
```

**Canonical URLs (prevent duplicate content):**
```html
<link rel="canonical" href="https://example.com/preferred-url">
```

Use when:
- Same content accessible via multiple URLs (`/page?utm_source=...` vs `/page`)
- HTTP and HTTPS versions exist
- www and non-www versions exist

### Robots.txt

**Location:** `https://example.com/robots.txt`

```txt
# Allow all crawlers
User-agent: *
Allow: /

# Block admin areas
Disallow: /admin/
Disallow: /api/

# Block query parameters
Disallow: /*?

# Sitemap location
Sitemap: https://example.com/sitemap.xml
```

**Common mistakes:**
- Don't block CSS/JS (Google needs them for rendering)
- Don't use `robots.txt` to hide sensitive data (use `noindex` meta tag or authentication)
- Ensure `robots.txt` returns 200 status (not 404 or 500)

### Sitemap.xml

**Basic structure:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-02-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2026-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Best practices:**
- Max 50,000 URLs per sitemap (split into multiple if larger)
- Max 50MB uncompressed (gzip sitemaps if needed)
- Update `lastmod` when content changes (triggers recrawl)
- Include only indexable URLs (no 404s, redirects, or noindex pages)

**Submit to Google:**
1. Add sitemap URL to `robots.txt`
2. Submit via Google Search Console → Sitemaps

### HTTPS & Security

**Checklist:**
- [ ] All pages serve over HTTPS (not HTTP)
- [ ] Valid SSL certificate (not expired)
- [ ] Redirect HTTP → HTTPS (301 permanent redirect)
- [ ] No mixed content warnings (all assets loaded via HTTPS)
- [ ] HSTS header enabled (forces HTTPS for future visits)

**HSTS header:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Mobile-Friendly

**Requirements:**
- Viewport meta tag (see above)
- Text readable without zooming (min 16px font size)
- Tap targets ≥ 48×48px with spacing
- No horizontal scrolling on mobile screens
- Avoid interstitials (pop-ups covering content)

**Test:** Google Mobile-Friendly Test (search.google.com/test/mobile-friendly)

### Page Speed

**Target metrics:**
- LCP (Largest Contentful Paint) < 2.5s
- FID/INP (First Input Delay / Interaction to Next Paint) < 200ms
- CLS (Cumulative Layout Shift) < 0.1

See "Core Web Vitals" section for optimization details.

### Crawlability

**Ensure Googlebot can:**
- Access robots.txt (returns 200)
- Render JavaScript (use SSR or SSG for Next.js)
- Follow internal links (no orphaned pages)
- Process redirects (avoid redirect chains: A → B → C, prefer A → C)

**Check in Google Search Console:**
- Coverage report (shows indexed vs excluded pages)
- URL Inspection tool (test how Google sees a page)

## Content Optimization

### Title Tags

**Formula:**
```
[Primary Keyword] - [Secondary Keyword] | [Brand]
```

**Rules:**
- 50-60 characters (search results truncate at ~600px)
- Primary keyword first (front-load important terms)
- Unique per page (no duplicates across site)
- Readable by humans (not keyword-stuffed)

**Examples:**
- Good: "Electric Bikes for Commuters - Free Shipping | BikeShop"
- Bad: "Buy Electric Bikes, E-Bikes, Electric Bicycles, Cheap E-Bikes Online"

### Meta Descriptions

**Formula:**
```
[Value proposition]. [Feature/benefit]. [Call-to-action].
```

**Rules:**
- 150-160 characters
- Include target keyword (bolded in search results if it matches query)
- Actionable (use verbs: "Learn", "Discover", "Get")
- Unique per page

**Example:**
```
Discover electric bikes designed for daily commutes. 50-mile range, lightweight frames. Shop now with free shipping.
```

### Heading Hierarchy

**Structure:**
```html
<h1>Page Title (one per page, matches title tag)</h1>
  <h2>Main Section</h2>
    <h3>Subsection</h3>
    <h3>Subsection</h3>
  <h2>Main Section</h2>
    <h3>Subsection</h3>
```

**Rules:**
- One `<h1>` per page (primary keyword)
- Don't skip levels (no `<h1>` → `<h3>` without `<h2>`)
- Include keywords in headings naturally
- Use headings to structure content (not for styling)

### Keyword Placement

**Priority locations:**
1. **Title tag** — primary keyword first
2. **H1** — primary keyword
3. **First paragraph** — primary keyword in first 100 words
4. **H2/H3 subheadings** — secondary keywords and variations
5. **Image alt text** — descriptive, include keywords when relevant
6. **URL slug** — `/electric-bikes` not `/page?id=123`

**Keyword density:** 1-2% (natural writing, not forced repetition)

### Internal Linking

**Best practices:**
- Link to related content (keep users on site)
- Use descriptive anchor text ("read our guide to SEO" not "click here")
- Link from high-authority pages to important pages (homepage → product pages)
- Ensure all pages ≤ 3 clicks from homepage

**Example:**
```html
<!-- Bad -->
<a href="/seo-guide">Click here</a> for more info.

<!-- Good -->
Learn more in our <a href="/seo-guide">complete SEO guide</a>.
```

**Site architecture:**
```
Homepage
├── Category A
│   ├── Product A1
│   └── Product A2
├── Category B
│   ├── Product B1
│   └── Product B2
└── Blog
    ├── Post 1 (links to Product A1)
    └── Post 2 (links to Product B2)
```

### Image SEO

**Optimization checklist:**
- [ ] Descriptive file names (`electric-bike-commute.jpg` not `IMG_1234.jpg`)
- [ ] Alt text for all images (describes image + context)
- [ ] Compressed (use WebP, max 200KB per image)
- [ ] Responsive (serve different sizes via `srcset`)
- [ ] Lazy loading (native `loading="lazy"` or Intersection Observer)

**Alt text examples:**
```html
<!-- Bad -->
<img src="bike.jpg" alt="bike">

<!-- Good -->
<img src="electric-bike-commute.jpg" alt="Woman riding electric bike through city during morning commute">
```

## Core Web Vitals

### LCP (Largest Contentful Paint)

**Target:** < 2.5 seconds

**What it measures:** Time until largest visible element renders (hero image, heading, video).

**Common culprits:**
- Large unoptimized images
- Render-blocking CSS/JS
- Slow server response (TTFB > 600ms)
- Client-side rendering (React without SSR)

**Fixes:**
1. **Optimize images:**
   ```html
   <!-- Next.js Image component -->
   <Image
     src="/hero.jpg"
     alt="Hero"
     width={1200}
     height={600}
     priority // Preloads above-the-fold images
   />
   ```

2. **Preload critical resources:**
   ```html
   <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
   <link rel="preload" href="/hero.jpg" as="image">
   ```

3. **Reduce server response time:**
   - Use CDN (Cloudflare, Vercel Edge Network)
   - Enable HTTP/2 or HTTP/3
   - Cache static assets (set `Cache-Control` headers)

4. **Eliminate render-blocking resources:**
   ```html
   <!-- Inline critical CSS -->
   <style>/* Critical above-the-fold styles */</style>

   <!-- Defer non-critical CSS -->
   <link rel="preload" href="/styles.css" as="style" onload="this.rel='stylesheet'">
   ```

### FID/INP (First Input Delay / Interaction to Next Paint)

**Target:** < 200ms

**What it measures:** Time from user interaction (click, tap) to browser response.

**Common culprits:**
- Heavy JavaScript execution blocking main thread
- Large bundles (long parse/compile time)
- Long tasks (> 50ms)

**Fixes:**
1. **Code splitting:**
   ```javascript
   // Next.js dynamic imports
   import dynamic from 'next/dynamic';

   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <p>Loading...</p>,
   });
   ```

2. **Debounce/throttle event handlers:**
   ```javascript
   function throttle(fn, wait) {
     let lastTime = 0;
     return function(...args) {
       const now = Date.now();
       if (now - lastTime >= wait) {
         lastTime = now;
         fn(...args);
       }
     };
   }

   window.addEventListener('scroll', throttle(() => {
     // Expensive operation
   }, 200));
   ```

3. **Web Workers for heavy computation:**
   ```javascript
   // main.js
   const worker = new Worker('/worker.js');
   worker.postMessage({ data: largeDataset });
   worker.onmessage = (e) => console.log(e.data);

   // worker.js
   self.onmessage = (e) => {
     const result = expensiveCalculation(e.data);
     self.postMessage(result);
   };
   ```

4. **Reduce third-party scripts:**
   - Defer non-critical scripts (`<script defer>`)
   - Use `async` for independent scripts
   - Self-host analytics (avoid Google Analytics round-trip)

### CLS (Cumulative Layout Shift)

**Target:** < 0.1

**What it measures:** Visual stability — unexpected layout shifts during page load.

**Common culprits:**
- Images without dimensions (browser doesn't reserve space)
- Ads/embeds injected after page load
- Web fonts causing FOIT/FOUT (flash of invisible/unstyled text)
- Dynamic content insertion above existing content

**Fixes:**
1. **Set image dimensions:**
   ```html
   <!-- Always include width/height -->
   <img src="photo.jpg" alt="Photo" width="800" height="600">

   <!-- Next.js Image sets dimensions automatically -->
   <Image src="/photo.jpg" alt="Photo" width={800} height={600} />
   ```

2. **Reserve space for ads/embeds:**
   ```css
   .ad-container {
     width: 300px;
     height: 250px; /* Reserve space before ad loads */
     background: #f0f0f0;
   }
   ```

3. **Optimize font loading:**
   ```css
   @font-face {
     font-family: 'MyFont';
     src: url('/fonts/myfont.woff2') format('woff2');
     font-display: swap; /* Show fallback font immediately */
   }
   ```

4. **Avoid inserting content above existing content:**
   ```javascript
   // Bad: Prepending pushes content down
   container.prepend(newElement);

   // Good: Append to bottom or use fixed-height placeholder
   container.append(newElement);
   ```

## Structured Data

### JSON-LD Basics

**Format:** JavaScript Object Notation for Linked Data (preferred by Google).

**Placement:** In `<script type="application/ld+json">` tag in `<head>` or `<body>`.

### Common Schemas

#### Article

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Optimize SEO for Next.js",
  "image": "https://example.com/article-image.jpg",
  "author": {
    "@type": "Person",
    "name": "Jane Doe"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Example Corp",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2026-02-14",
  "dateModified": "2026-02-14",
  "description": "Learn Next.js SEO best practices including metadata, sitemaps, and Core Web Vitals."
}
```

#### Product

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Electric Bike Model X",
  "image": "https://example.com/bike.jpg",
  "description": "Lightweight electric bike with 50-mile range",
  "sku": "BIKE-X-2026",
  "brand": {
    "@type": "Brand",
    "name": "BikeShop"
  },
  "offers": {
    "@type": "Offer",
    "price": "1299.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/products/bike-x"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "127"
  }
}
```

#### FAQ

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO (Search Engine Optimization) is the practice of improving website visibility in search engine results."
      }
    },
    {
      "@type": "Question",
      "name": "How long does SEO take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO typically takes 3-6 months to show significant results, depending on competition and site authority."
      }
    }
  ]
}
```

#### HowTo

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Optimize Images for SEO",
  "description": "Step-by-step guide to image optimization",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Compress images",
      "text": "Use TinyPNG or Squoosh to reduce file size without quality loss."
    },
    {
      "@type": "HowToStep",
      "name": "Add alt text",
      "text": "Write descriptive alt text including relevant keywords."
    },
    {
      "@type": "HowToStep",
      "name": "Use responsive images",
      "text": "Implement srcset to serve different sizes for different devices."
    }
  ]
}
```

### Testing Structured Data

**Tools:**
- Google Rich Results Test (search.google.com/test/rich-results)
- Schema Markup Validator (validator.schema.org)

**Validation:**
- No errors (red flags in test tools)
- All required properties present
- Matches visible page content (don't markup invisible content)

## Site Audit Process

### Crawl Analysis

**Tools:**
- Screaming Frog SEO Spider (free up to 500 URLs)
- Ahrefs Site Audit
- Semrush Site Audit

**Crawl checklist:**
1. **Set crawl limits:**
   - Max URLs: 10,000 (or site total)
   - Respect robots.txt
   - Crawl speed: 1 URL/sec (avoid overloading server)

2. **Export reports:**
   - All URLs with status codes
   - Missing meta descriptions
   - Duplicate title tags
   - Broken images
   - Redirect chains

### Common Issues

#### Broken Links (404s)

**Find:**
```bash
# Using Grep to find hardcoded links
grep -r "href=" --include="*.html" --include="*.jsx" --include="*.tsx"
```

**Fix:**
- Update links to correct URLs
- Implement 301 redirects for moved pages
- Remove links to deleted pages

#### Duplicate Content

**Scenarios:**
- Same content on `/page` and `/page/`
- HTTP and HTTPS versions
- www and non-www versions

**Fixes:**
1. Canonical tags (see Technical SEO Checklist)
2. 301 redirects to preferred version
3. Parameter handling in Google Search Console

#### Redirect Chains

**Bad:**
```
/old-page → /temp-page → /new-page
```

**Fix:** Redirect directly from `/old-page` to `/new-page`.

**Next.js redirects:**
```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true, // 301 redirect
      },
    ];
  },
};
```

#### Orphaned Pages

**Definition:** Pages with no internal links pointing to them.

**Find:** Compare sitemap URLs vs crawled URLs (sitemap-only = orphaned).

**Fix:** Add internal links from relevant pages.

### Indexing Issues

**Check Google Search Console → Coverage:**
- **Excluded:** URLs not indexed
  - "Noindex tag" — intentional or accidental?
  - "Blocked by robots.txt" — ensure not blocking important pages
  - "Duplicate, Google chose different canonical" — canonical tag missing/incorrect

## Next.js SEO

### Metadata API (App Router)

**Static metadata:**
```typescript
// app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | My Site',
  description: 'Welcome to my site',
  openGraph: {
    title: 'Home | My Site',
    description: 'Welcome to my site',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return <h1>Home</h1>;
}
```

**Dynamic metadata:**
```typescript
// app/products/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await fetchProduct(params.id);

  return {
    title: `${product.name} | Products`,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}
```

### Sitemap Generation

**Dynamic sitemap:**
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchAllProducts();

  const productUrls = products.map((product) => ({
    url: `https://example.com/products/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...productUrls,
  ];
}
```

**Accessible at:** `https://example.com/sitemap.xml`

### Dynamic OG Images

**Generate OG images on-the-fly:**
```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        {title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

**Usage:**
```typescript
export const metadata: Metadata = {
  openGraph: {
    images: ['/api/og?title=My+Page+Title'],
  },
};
```

### Static Generation for SEO

**Prefer SSG over SSR:**
```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetchAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Page({ params }) {
  const post = await fetchPost(params.slug);
  return <article>{post.content}</article>;
}
```

**Why:** Static pages load faster (better Core Web Vitals) and are fully crawlable without JavaScript.

## Monitoring

### Google Search Console

**Setup:**
1. Verify ownership (DNS record or meta tag)
2. Submit sitemap
3. Check "Coverage" report weekly

**Key metrics:**
- **Impressions** — how often your site appears in search results
- **Clicks** — actual visits from search
- **CTR** — clicks / impressions (target: 2-5% average)
- **Average position** — ranking in search results (target: top 10 = position ≤ 10)

**Actionable insights:**
- Pages with high impressions but low CTR → improve title/meta description
- Pages with position 11-20 → optimize content to break into top 10
- Coverage errors → fix indexing issues

### Lighthouse CI

**Automate Lighthouse audits in CI/CD:**
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci && npm run build
      - run: npx @lhci/cli@0.12.x autorun
```

**Lighthouse CI config:**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      startServerCommand: 'npm start',
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

**Fail CI if SEO score < 90.**

### Rank Tracking

**Tools:**
- Ahrefs Rank Tracker
- Semrush Position Tracking
- Google Search Console (free, but less granular)

**What to track:**
- Target keywords (5-20 primary keywords)
- Competitor rankings
- Historical trends (weekly snapshots)

**Action triggers:**
- Rank drop > 5 positions → investigate (algorithm update? competitor change?)
- Competitor overtakes → analyze their content/backlinks

## Additional Checklist

**Pre-launch SEO:**
- [ ] Title tags unique and optimized
- [ ] Meta descriptions written for all pages
- [ ] Canonical tags set
- [ ] Sitemap.xml generated and submitted
- [ ] Robots.txt configured
- [ ] HTTPS enabled with redirects
- [ ] Mobile-friendly (passes Google test)
- [ ] Core Web Vitals passing (LCP, FID/INP, CLS)
- [ ] Structured data implemented (Article, Product, FAQ, etc.)
- [ ] Google Search Console verified
- [ ] Google Analytics or alternative installed

**Ongoing SEO:**
- [ ] Weekly Search Console review (coverage, performance)
- [ ] Monthly content audit (update outdated posts, fix broken links)
- [ ] Quarterly competitor analysis
- [ ] Monitor Core Web Vitals (set alerts for regressions)
