# Onboard Subdomain Maintainer

When the user wants to add a new subdomain maintainer, follow these steps.

## Required Information

Ask the user for (if not already provided):
1. **GitHub username** — or profile URL (e.g. `https://github.com/huangzesen`)
2. **Subdomain** they are maintaining (e.g. `space-physics` under `physics`)
3. **Real name (Chinese + English)** and affiliation (e.g. "黄泽森 / Zesen Huang, UCLA Postdoc")

If the user provides a personal website, look up their research domain from it.
If the user provides an email, search GitHub by email first (`gh api search/users?q=<email>+in:email`) to find the correct handle.

## Important: Use existing subdomains only

The subdomain **must** already exist as a pre-created folder under `skills/<domain>/`. All 131 arXiv-aligned subdomain folders are pre-created. Do **NOT** invent or create new custom subdomain folders. If the user's research area doesn't map exactly to one folder, pick the closest existing arXiv subdomain (e.g. use `cryptography-and-security` instead of creating `blockchain`).

## Important: Do NOT send GitHub collaborator invitations

GitHub collaborator invitations are handled manually by the repo owner. Do **NOT** run `gh api .../collaborators/...` commands. Only update the files below.

## Steps

### Step 1: Add to CODEOWNERS

Edit `.github/CODEOWNERS`. Add a **subdomain-level** line (keep `@HHHHHejia` as co-owner):

```
skills/physics/space-physics/  @huangzesen @HHHHHejia
```

Do NOT replace the domain-level line — add a new line below it for the subdomain.

### Step 2: Update README Maintainers Table

In `readme.md`, find `## 6. Maintainers` (English section) and `## 6. 维护者` (Chinese section). Add a row to both tables:

English (use English name):
```
| ⚛️ Physics | Space Physics | Zesen Huang [@huangzesen](https://github.com/huangzesen) | UCLA Postdoc |
```

Chinese (use Chinese name):
```
| ⚛️ Physics | Space Physics | 黄泽森 [@huangzesen](https://github.com/huangzesen) | UCLA Postdoc |
```

The domain emoji must match:
- ⚛️ Physics, ➗ Mathematics, 💻 Computer Science, 🧬 Quantitative Biology
- 📊 Statistics, ⚡ EESS, 📈 Economics, 💹 Quantitative Finance

### Step 3: Update Interactive Knowledge Tree

In `docs/index.html`, find the matching subdomain node in the `DATA` array and add a `maintainer` field:

```js
{ name: "Space Physics", code: "physics.space-ph", maintainer: "黄泽森 @huangzesen (UCLA)" },
```

The rendering code already handles the `maintainer` field and displays a badge.

### Step 4: Commit and Push

```bash
git add .github/CODEOWNERS readme.md docs/index.html
git commit -m "chore: onboard @<username> as <domain>/<subdomain> maintainer"
git push
```

### Step 5: Confirm to User

Report:
- Files updated (CODEOWNERS, readme, knowledge tree)
- Remind user to manually send GitHub collaborator invitation
