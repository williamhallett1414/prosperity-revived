# Apple App Store Review Notes

## Info.plist Required Entries
Add these to your iOS project's Info.plist before submitting:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Prosperity Revived uses the microphone to let you have voice conversations with your AI coaching guides (Gideon, Hannah, Coach David, Chef Daniel, Coach Paul) and to record sermon notes.</string>

<key>NSCameraUsageDescription</key>
<string>Prosperity Revived uses the camera to let you record video messages to share your faith journey with the community and to take progress photos for your fitness goals.</string>
```

## App Privacy (App Store Connect)
Declare these data types:
- **Health & Fitness**: Workout logs, nutrition data, body measurements
- **User Content**: Journal entries, community posts, chat messages, photos
- **Identifiers**: Email address, user ID
- **Usage Data**: App interactions, feature usage
- **Sensitive Info**: Religious beliefs (faith-based content)

## Age Rating
Recommend: **12+** (religious content, community features, health tracking)

## Required Features Already Implemented
- ✅ AI content disclosure on all chat screens
- ✅ Crisis resources (988 Suicide & Crisis Lifeline, Crisis Text Line 741741)
- ✅ Health & wellness disclaimer on fitness/nutrition pages
- ✅ Account deletion (Settings → Manage My Data → Delete Account)
- ✅ Data export request (Settings → Manage My Data → Access & Export)
- ✅ Content reporting (flag icon on community posts)
- ✅ User blocking (X icon on community posts)
- ✅ AI moderation notice on community feed
- ✅ Health & Wellness Waiver during onboarding
- ✅ Privacy Policy page (in-app + Settings link)
- ✅ Terms & Conditions page
- ✅ Subscription Terms page

## App Review Submission Notes (paste into App Store Connect)
"Prosperity Revived is a faith-based wellness app featuring AI coaching
guides. All AI-generated responses are clearly labeled as such and are
not a substitute for professional medical, financial, or therapeutic
advice. Crisis resources (988 Lifeline) are prominently displayed on
all mental health and emotional wellness screens. Users must accept a
Health & Wellness Waiver during onboarding before accessing fitness or
nutrition features. Account deletion is available in Settings → Manage
My Data. Community content is moderated by AI with user reporting and
blocking capabilities."
