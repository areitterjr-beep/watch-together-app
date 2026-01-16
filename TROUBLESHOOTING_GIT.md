# Git Troubleshooting Guide

## Common Errors and Solutions

### Error: "fatal: remote origin already exists"

**Solution:**
```bash
# Remove existing remote
git remote remove origin

# Add your remote
git remote add origin https://github.com/areitterjr-beep/watch-together-app.git
```

### Error: "repository 'watch-together-app' already exists on GitHub"

**Solution:**
1. Go to https://github.com/areitterjr-beep/watch-together-app
2. If it exists, you can either:
   - Use the existing repository (just push to it)
   - Delete it and create a new one
   - Use a different name like `watch-together-app-2`

### Error: "failed to push some refs" or "authentication required"

**Solution:**
```bash
# Check your remote URL
git remote -v

# If using HTTPS, you may need a Personal Access Token
# Go to: https://github.com/settings/tokens
# Generate new token with 'repo' permissions
# Use token as password when pushing

# Or switch to SSH (if you have SSH keys set up)
git remote set-url origin git@github.com:areitterjr-beep/watch-together-app.git
```

### Error: "nothing to commit, working tree clean"

**Solution:**
This means files are already committed. Just proceed to:
```bash
git remote add origin https://github.com/areitterjr-beep/watch-together-app.git
git push -u origin main
```

### Error: "Permission denied" or "Operation not permitted"

**Solution:**
- Make sure you're in the correct directory
- Check file permissions: `ls -la .git`
- Try running with proper permissions

### Error: "branch 'main' does not exist"

**Solution:**
```bash
# Create and switch to main branch
git checkout -b main

# Or if you have commits on another branch
git branch -M main
```

### Error: "refusing to merge unrelated histories"

**Solution:**
```bash
# If GitHub repo was initialized with files
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```

---

## Quick Diagnostic Commands

Run these to check your git status:

```bash
cd /Users/allenreitter/my-health-app

# Check git status
git status

# Check remotes
git remote -v

# Check branch
git branch

# Check commits
git log --oneline -5

# Check what files are staged
git status --short
```

---

**Please share the exact error message you're seeing, and I can provide specific help!** 🔧
