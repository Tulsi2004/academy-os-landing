# TULSI Blog Studio

The Sanity Studio behind **both** landing sites' blogs.

One project, one dataset, both blogs. Every post carries a `sites` array —
`"tulsi"`, `"academy"`, or both — mirroring the `site` column the two sites
already share in Postgres. Each frontend queries `$SITE in sites`, so ticking
both boxes publishes one post to both blogs without duplicating it.

```
blog-studio/  ← you are here          →  tulsi-landing/      (site: "tulsi")
  schemaTypes/  post · author            academy-os-landing/ (site: "academy")
                category · blockContent
```

---

## First-time setup

Everything below needs a browser login, so it has to be run by a person.

### 1. Create the Sanity project

```bash
cd blog-studio
npm install
npx sanity login          # opens a browser — pick Google/GitHub/email
npx sanity init --create-project "TULSI Blog" --dataset production
```

Choose **"Use the current directory"** and **do not** let it overwrite
`sanity.config.ts` or the schemas — this repo already has them.

`init` writes the projectId into `sanity.cli.ts`. Copy that value; you need it
in step 3. You can also find it any time at https://sanity.io/manage.

### 2. Make the dataset public and allow the sites to read it

The frontends read without an API token, which only works on a public dataset:

```bash
npx sanity dataset visibility set production public

npx sanity cors add http://localhost:3000
npx sanity cors add https://tulsi-solutions.vercel.app
npx sanity cors add https://academy-os-landing.vercel.app
```

Add your real production domains too, once they exist.

### 3. Point both landing sites at the project

In **both** `tulsi-landing/.env.local` and `academy-os-landing/.env.local`
(and in the Vercel environment variables for both deployments):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=<the projectId from step 1>
NEXT_PUBLIC_SANITY_DATASET=production
```

Both sites use the **same** values — that is the point of the shared dataset.

Until this is set, the blog is simply empty: `/blog` renders its "No posts yet"
state, the sitemap ships without post URLs, and nothing errors.

### 4. Run and deploy the studio

```bash
npm run dev               # http://localhost:3333
npx sanity deploy         # pick a hostname → https://<name>.sanity.studio
```

---

## Publishing a post

1. **Authors** → create yourself once (name, slug, photo, role, short bio).
   The slug matters: the article byline links to `/author/<slug>` on the site.
2. **Categories** → create a few (they render as tags on the cards).
3. **TULSI posts** or **Academy OS posts** in the sidebar → **Create**.
   A post started from one of those lists arrives with the right site ticked.
4. Fill in title, slug, excerpt, main image, author, categories, body.
5. **Publish.**

The post appears on the site within ~60 seconds — no redeploy. Drafts never
appear: the frontends read with `perspective: "published"`.

### Fields worth understanding

| Field | Why it matters |
|---|---|
| **Show on** | Which blog(s) the post appears on. At least one is required. |
| **Slug** | Forced lowercase. The article route 308-redirects mixed-case URLs, so an uppercase slug would be unreachable. |
| **Excerpt** | Used on cards, as the article intro, and as the meta-description fallback. Worth writing. |
| **Main image** | Becomes the OG/Twitter card image at 1200×630. Posts without one still render. |
| **Meta title / description** | Only fill these in when you want the search-result text to differ from the title/excerpt. |

---

## Adding a new block type

`schemaTypes/blockContent.ts` and each app's
`components/blog/PortableBody.tsx` are two halves of one contract. Add a type
here without adding a renderer there and the block silently renders nothing —
so change all three files together (studio + both apps).

## Changing the site list

`schemaTypes/sites.ts` is the single source of truth for the studio. The values
must match `SITE` in each app's `lib/site.ts`, or posts vanish from a site with
no error to explain why.
