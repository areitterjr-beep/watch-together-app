# YouTube TV API - Information & Limitations

## Important Distinction

**YouTube TV** (paid streaming service) is different from:
- **Regular YouTube** (free videos) - ✅ Currently supported in the app
- **YouTube Live Streaming API** (for creators to broadcast) - Different use case

## YouTube TV API Availability

### ❌ **No Public API for YouTube TV Content**

YouTube TV (the paid subscription service) **does NOT have a public API** for streaming its content. This is due to:

1. **DRM Protection** - Content is encrypted and protected
2. **Licensing Restrictions** - Content providers don't allow third-party streaming
3. **Terms of Service** - YouTube TV prohibits unauthorized access/streaming
4. **Legal Restrictions** - Would violate copyright and licensing agreements

### What YouTube TV Offers

- **OAuth 2.0 for TV Devices** - For authentication on smart TVs, but NOT for streaming content
- **Roku/Device Integrations** - For launching YouTube TV app, not for embedding content
- **No Content Streaming API** - Cannot programmatically access or stream YouTube TV content

## What IS Available

### ✅ YouTube Data API v3
- Search videos
- Get video metadata
- Get playlists
- **Does NOT provide streaming URLs** - Only metadata

### ✅ YouTube IFrame API (What We Use)
- Embed YouTube videos (regular YouTube, not YouTube TV)
- Control playback
- **Works with public YouTube videos only**
- **Does NOT work with YouTube TV content**

### ✅ YouTube Live Streaming API
- For creators to broadcast live content
- Create/manage live streams
- **Not for watching YouTube TV content**

## Alternatives for Your App

### Option 1: Regular YouTube Videos ✅ (Current Implementation)
- Works with public YouTube videos
- Uses YouTube IFrame API
- Synchronized playback
- **Limitation**: Only public videos, not YouTube TV content

### Option 2: Screen Sharing
- One person shares their YouTube TV screen
- Others watch the shared screen
- **Workaround**: Not ideal, but works

### Option 3: Browser Extension
- Users install a browser extension
- Extension syncs YouTube TV playback
- **Examples**: Teleparty, Netflix Party (for Netflix)
- **Limitation**: Requires extension installation

### Option 4: Manual Sync
- Countdown timers
- Manual play/pause coordination
- **Limitation**: Not automatic

## Technical Details

### Why YouTube TV Can't Be Embedded

1. **DRM (Digital Rights Management)**
   - Content is encrypted
   - Requires special decryption keys
   - Only YouTube TV app can decrypt

2. **Licensing Agreements**
   - Content providers (Networks, Studios) restrict where content can be shown
   - Third-party embedding violates these agreements

3. **Authentication**
   - Requires YouTube TV subscription
   - OAuth only provides authentication, not content access

## Current App Capabilities

Your app currently supports:
- ✅ **Regular YouTube videos** (public videos)
- ✅ **Custom video URLs** (MP4, WebM, etc.)
- ✅ **Synchronized playback**
- ✅ **Video/audio chat**

**Does NOT support:**
- ❌ YouTube TV content
- ❌ Netflix (similar restrictions)
- ❌ Other DRM-protected streaming services

## Recommendations

### For YouTube TV Content:
1. **Screen Sharing** - Best workaround
2. **Browser Extension** - If available
3. **Manual Coordination** - Countdown timers

### For Regular YouTube:
- ✅ Your current implementation works perfectly!
- ✅ Can watch any public YouTube video together
- ✅ Full playback control and synchronization

## Summary

**YouTube TV API**: ❌ Not available for streaming content
**Regular YouTube API**: ✅ Available (what we use)
**Solution**: Use screen sharing or browser extensions for YouTube TV content

Your app works great with regular YouTube videos! For YouTube TV, users would need to use screen sharing as a workaround.
