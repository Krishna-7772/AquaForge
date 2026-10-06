# GitHub Repository Publication Commands

To publish AQUAFORGE to GitHub under your user or organization account, execute the following commands in the project root directory:

```bash
# 1. Initialize & configure git (if not already done)
git init -b main
git add .
git commit -m "feat(core): initial release of AQUAFORGE SSS marine debris and anomaly detection platform v1.0.0"

# 2. Add your GitHub remote repository
git remote add origin https://github.com/Krishna-7772/AquaForge.git

# 3. Push to main branch
git branch -M main
git push -u origin main

# 4. Create and push release tag
git tag -a v1.0.0-prototype -m "Release v1.0.0-prototype: Operational Side-Scan Sonar Perception Prototype for SIH26057"
git push origin v1.0.0-prototype
```

## Recommended GitHub Repository Settings
- **Repository Name:** `AQUAFORGE`
- **Description:** `AI-powered Side-Scan Sonar analysis platform for marine debris, anomaly detection, acoustic evidence, geolocation and survey prioritization (SIH26057 - MoES/NIOT).`
- **Visibility:** Public
- **Topics:** `side-scan-sonar`, `marine-debris`, `ghost-nets`, `acoustic-vision`, `deep-learning`, `ocean-technology`, `sih2026`, `disaster-management`
