# Onboard Subdomain Maintainer

When the user wants to add a new subdomain maintainer, follow these steps.

## Required Information

Ask the user for (if not already provided):
1. **GitHub username** — or profile URL (e.g. `https://github.com/huangzesen`)
2. **Subdomain** they are maintaining (e.g. `space-physics` under `physics`)
3. **Real name and affiliation** (e.g. "Zesen Huang, UCLA Postdoc")

If the user provides a personal website, look up their research domain from it.

## Steps

### Step 1: Add as GitHub Collaborator (Write permission)

```bash
gh api repos/HHHHHejia/OpenScientist/collaborators/<username> -X PUT -f permission=write
```

This sends an invitation. They must accept before they can review PRs.

### Step 2: Add to CODEOWNERS

Edit `.github/CODEOWNERS`. Add a **subdomain-level** line (keep `@HHHHHejia` as co-owner):

```
skills/physics/space-physics/  @huangzesen @HHHHHejia
```

Do NOT replace the domain-level line — add a new line below it for the subdomain.

### Step 3: Update README Maintainers Table

In `readme.md`, find `## 6. Maintainers` (English section) and `## 6. 维护者` (Chinese section). Add a row to both tables:

English:
```
| ⚛️ Physics | Space Physics | [@huangzesen](https://github.com/huangzesen) | UCLA Postdoc |
```

Chinese (same format):
```
| ⚛️ Physics | Space Physics | [@huangzesen](https://github.com/huangzesen) | UCLA Postdoc |
```

The domain emoji must match:
- ⚛️ Physics, ➗ Mathematics, 💻 Computer Science, 🧬 Quantitative Biology
- 📊 Statistics, ⚡ EESS, 📈 Economics, 💹 Quantitative Finance

### Step 4: Update Interactive Knowledge Tree

In `docs/index.html`, find the matching subdomain node in the `DATA` array and add a `maintainer` field:

```js
{ name: "Space Physics", code: "physics.space-ph", maintainer: "@huangzesen (UCLA)" },
```

The rendering code already handles the `maintainer` field and displays a badge.

### Step 5: Commit and Push

```bash
git add .github/CODEOWNERS readme.md docs/index.html
git commit -m "chore: onboard @<username> as <domain>/<subdomain> maintainer"
git push
```

### Step 6: Confirm to User

Report:
- Invitation sent — they need to accept at https://github.com/HHHHHejia/OpenScientist/invitations
- Once accepted, PRs touching `skills/<domain>/<subdomain>/` will auto-assign them as reviewer
- They can approve and merge PRs in their subdomain
