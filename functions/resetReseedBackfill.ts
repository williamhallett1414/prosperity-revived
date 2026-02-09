import { base44 } from "@/api/base44Client";

/**
 * Reset + Reseed + Backfill admin function
 * Deletes all meditations, reseeds 30, and queues TTS jobs
 */
export async function resetReseedBackfill() {
  try {
    console.log("[Admin] Starting reset-reseed-backfill…");

    // 1. Delete all existing meditations
    const allMeds = await base44.entities.Meditation.list();
    for (const med of allMeds) {
      await base44.entities.Meditation.delete(med.id);
    }
    console.log(`[Admin] Deleted ${allMeds.length} meditations`);

    // 2. Delete all existing TTSJobs
    const allJobs = await base44.entities.TTSJob.list();
    for (const job of allJobs) {
      await base44.entities.TTSJob.delete(job.id);
    }
    console.log(`[Admin] Deleted ${allJobs.length} TTS jobs`);

    // 3. Reseed 30 meditations
    const MEDITATIONS = [
      {
        id: "gm-1-morning-breath-alignment",
        title: "Morning Breath of Surrender",
        description: "Begin your day by aligning your breath, heart, and mind with the presence of God.",
        category: "breathing",
        duration_minutes: 6,
        image_url: "https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0",
        script: "Find a comfortable seated position, either in a chair with your feet resting on the floor, or on a cushion with your legs gently crossed. Let your hands rest softly on your lap. Close your eyes, and take a slow, deep breath in through your nose, filling your lungs completely. Hold for a moment, and then exhale gently through your mouth. As you breathe, remember these words from Psalm 118:24: 'This is the day that the Lord has made; let us rejoice and be glad in it.' With each inhale, imagine breathing in the grace and strength of God. With each exhale, release any tension, worry, or fear you carried into this moment. Inhale, and silently say, 'Lord, I receive Your peace.' Exhale, and silently say, 'Lord, I release my burdens to You.' Continue this rhythm, slow and steady. If your mind begins to wander, gently bring your focus back to your breath and to the presence of God with you right now. Picture His light filling your chest with every inhale, expanding your capacity for joy, patience, and faith. As you exhale, see that light pushing out anxiety, doubt, and heaviness. Take a few more deep, intentional breaths, resting in the truth that you do not face this day alone. When you are ready, gently open your eyes, carrying this awareness of God's nearness into whatever comes next.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        status: "pending"
      },
      {
        id: "gm-2-breath-of-peace-in-storm",
        title: "Breath of Peace in the Storm",
        description: "Use your breath to anchor your soul in God's peace, even in the middle of life's storms.",
        category: "breathing",
        duration_minutes: 7,
        image_url: "https://images.unsplash.com/photo-1501973801540-537f08ccae7b",
        script: "Settle into a comfortable position, allowing your shoulders to drop away from your ears and your jaw to soften. Close your eyes if you feel safe to do so. Begin by taking a slow breath in through your nose for a count of four. Hold for a gentle count of two. Then exhale slowly through your mouth for a count of six. Let this become your rhythm: in for four, hold for two, out for six. As you breathe, bring to mind the words of Jesus in John 14:27: 'Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid.' With each inhale, imagine receiving the peace of Christ—steady, unshakable, deeper than your circumstances. With each exhale, release fear, tension, and the need to control outcomes. Inhale: 'Your peace, Lord.' Exhale: 'I release my fear.' If worries or specific situations come to mind, don't push them away. Instead, gently place them into the hands of Jesus as you exhale. See Him holding them with care and authority. Continue breathing in this pattern, letting your body relax more fully with each cycle. Feel your chest rise and fall, your heart rate slowing, your mind becoming clearer. You are not alone in the storm; the Prince of Peace is with you. Take a final deep breath in, hold it, and then exhale fully, trusting that God's peace will go with you beyond this moment.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        status: "pending"
      },
      {
        id: "gm-3-rest-in-gods-arms",
        title: "Resting in the Arms of God",
        description: "Gently release the weight of the day and rest your whole being in God's loving arms.",
        category: "sleep",
        duration_minutes: 10,
        image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        script: "Lie down in a comfortable position, allowing your body to be fully supported by the surface beneath you. Let your arms rest by your sides or gently on your stomach. Close your eyes, and take a slow, deep breath in through your nose, then exhale softly through your mouth. Feel the rise and fall of your chest. With each breath, give yourself permission to slow down. You are safe here. You are held here. As you continue to breathe, reflect on Psalm 4:8: 'In peace I will lie down and sleep, for you alone, O Lord, make me dwell in safety.' Let those words wash over you. With every inhale, imagine breathing in God's comfort and protection. With every exhale, release the events of the day—the conversations, the tasks, the unfinished lists. They can rest in God's hands now. Scan your body slowly from head to toe. Notice any areas of tension—your forehead, your jaw, your shoulders, your back. As you exhale, imagine God's gentle hand resting on that area, inviting it to soften and let go. You do not have to hold everything together. God is holding you. Picture yourself as a child resting in the arms of a loving Father, safe, secure, and fully known. There is nothing you need to prove, nothing you need to fix in this moment. Simply be. If thoughts arise, acknowledge them without judgment and let them drift away like clouds passing in a quiet sky. Return to the steady rhythm of your breath and the nearness of God. As you continue to rest, allow your body to grow heavier, your mind quieter, and your heart more at ease. When sleep comes, let it be an act of trust—trust that God is watching over you, even as you rest.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        status: "pending"
      },
      {
        id: "gm-4-surrender-the-day-to-god",
        title: "Surrendering the Day to God",
        description: "Release the weight of today into God's hands so you can sleep in peace and confidence.",
        category: "sleep",
        duration_minutes: 9,
        image_url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
        script: "Find a restful position, either lying on your back or on your side, with your head supported and your body relaxed. Take a slow, deep breath in through your nose, and exhale gently through your mouth. Let your breathing become calm and unforced. As you settle in, bring to mind the words of 1 Peter 5:7: 'Cast all your anxiety on Him because He cares for you.' Imagine yourself holding a basket filled with the concerns, conversations, and responsibilities of this day. One by one, picture yourself handing each item to Jesus. As you exhale, release another weight into His capable hands. You are not abandoning your responsibilities; you are entrusting them to the One who is wiser and stronger than you. With each breath, feel your body grow heavier, more at ease. Your shoulders soften, your jaw unclenches, your hands relax. Whisper quietly in your heart, 'Lord, I give this day back to You.' If a specific worry keeps returning, imagine placing it at the foot of the cross. See it resting there, no longer yours to carry alone. God is not distant; He is near, attentive, and deeply caring. He has been with you in every moment of this day, and He will be with you through the night. As your thoughts begin to slow, let your mind rest on the simple truth: God is in control, and you are His beloved. You can sleep because He does not. You can rest because He is always at work. Take a final deep breath in, hold it gently, and exhale fully, surrendering this day and your night into His faithful hands.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        status: "pending"
      },
      {
        id: "gm-5-present-with-god",
        title: "Fully Present with God",
        description: "Slow down, notice this moment, and become deeply aware of God's presence right where you are.",
        category: "mindfulness",
        duration_minutes: 8,
        image_url: "https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0",
        script: "Sit comfortably, with your feet grounded and your spine gently upright. Rest your hands on your thighs or in your lap. Close your eyes if you are able. Take a slow, deep breath in through your nose, and exhale through your mouth. Begin to notice the sensations of this moment: the feeling of the chair beneath you, the temperature of the air on your skin, the sounds in the room or outside. You are here. You are safe. And God is here with you. In Acts 17:28 we read, 'In Him we live and move and have our being.' Let that truth sink in. You are not separate from God's presence; you are held within it. As you breathe, gently bring your attention to your body. Notice your feet, your legs, your torso, your arms, your neck, your face. If you find any tension, simply acknowledge it and invite it to soften as you exhale. There is no need to force anything—just notice and release. Now, bring your awareness to your breath. Feel the air entering your nose, your chest expanding, your lungs filling. Feel the gentle release as you exhale. If your mind begins to wander to the past or the future, kindly guide it back to this breath, this moment, this presence. Whisper in your heart, 'Lord, I am here with You, and You are here with me.' Allow yourself to rest in this awareness, not striving, not performing, simply being. God delights in being with you, not just when you are productive or strong, but also when you are still and quiet. Take a few more slow, intentional breaths, soaking in the reality of His nearness. When you are ready, gently open your eyes, carrying this sense of presence into the rest of your day.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        status: "pending"
      },
      {
        id: "gm-6-mindful-walk-with-jesus",
        title: "A Mindful Walk with Jesus",
        description: "Imagine walking side by side with Jesus, noticing His presence in every step and every breath.",
        category: "mindfulness",
        duration_minutes: 9,
        image_url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
        script: "Whether you are actually walking or simply imagining it in your mind, allow yourself to picture a quiet path—perhaps a forest trail, a beach at sunrise, or a peaceful garden. Take a slow breath in through your nose, and exhale through your mouth. With each breath, imagine your steps becoming more unhurried, more intentional. Now, picture Jesus walking beside you. Not far ahead, not behind, but right next to you. In Matthew 28:20, He promises, 'I am with you always, to the end of the age.' Let that promise become real in this moment. As you 'walk,' notice the details around you: the color of the sky, the texture of the ground, the sound of leaves or waves or birds. With each step, silently say, 'You are with me.' If worries or distractions arise, imagine gently handing them to Jesus as you continue walking. See Him receive them with kindness and understanding. There is no rush here. No pressure to be anywhere else. You are simply walking with your Savior. Ask Him quietly in your heart, 'Lord, what do You want me to know right now?' Then listen—not for an audible voice, but for a gentle impression, a sense of reassurance, a reminder of His Word. Perhaps a verse comes to mind, or a simple phrase like, 'You are not alone,' or, 'I am guiding you.' Continue this mindful walk, step by step, breath by breath, in His presence. When you are ready to end, picture the path fading and your awareness returning to where you are physically. Take a deep breath in, exhale slowly, and remember: wherever you go next, He walks with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        status: "pending"
      },
      {
        id: "gm-7-heart-of-compassion",
        title: "Receiving the Heart of Compassion",
        description: "Open your heart to receive Christ's compassion for yourself and for others who are hurting.",
        category: "compassion",
        duration_minutes: 8,
        image_url: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c",
        script: "Find a comfortable position, seated or lying down, and allow your body to relax. Take a slow, deep breath in through your nose, and exhale gently through your mouth. As you settle, bring your attention to your heart area—the center of your chest. Place a hand there if it feels comforting. In Colossians 3:12 we read, 'Put on then, as God's chosen ones, holy and beloved, compassionate hearts, kindness, humility, meekness, and patience.' Let those words remind you that compassion begins with receiving God's love for you. As you breathe, imagine the gentle warmth of God's compassion resting on your heart. If you have been hard on yourself, critical, or ashamed, allow this moment to be different. Inhale, and silently say, 'Lord, have compassion on me.' Exhale, and say, 'I receive Your mercy.' Think of an area in your life where you feel weak, tired, or discouraged. Instead of hiding it, gently bring it into the light of God's presence. Picture Jesus looking at you—not with disappointment, but with deep understanding and kindness. He knows your story. He knows your pain. He is 'a man of sorrows and acquainted with grief' (Isaiah 53:3). Let His compassion meet you there. Now, if you feel ready, bring to mind someone else who is hurting—a friend, a family member, even a stranger or a group of people. As you inhale, pray, 'Lord, fill me with Your compassion.' As you exhale, imagine His love flowing from your heart toward them. You are not the source; you are a vessel. Rest for a few more breaths in this flow of compassion—received and given. When you are ready, release these people into God's care, trusting that He loves them even more than you do.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        status: "pending"
      },
      {
        id: "gm-8-loving-like-jesus",
        title: "Loving Like Jesus",
        description: "Reflect on Christ's love for you and allow it to shape the way you see and love others.",
        category: "compassion",
        duration_minutes: 9,
        image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
        script: "Sit comfortably and take a slow, deep breath in through your nose, then exhale gently through your mouth. Let your shoulders relax and your hands rest loosely. As you breathe, bring to mind the words of Jesus in John 13:34: 'A new commandment I give to you, that you love one another: just as I have loved you, you also are to love one another.' Before you think about loving others, pause and consider how Jesus has loved you. Think of moments where He has met you with grace instead of judgment, patience instead of frustration, mercy instead of condemnation. Let gratitude rise in your heart as you remember His faithfulness. Inhale, and silently say, 'Thank You for loving me, Jesus.' Exhale, and say, 'Teach me to love like You.' Now, gently bring to mind someone who is difficult for you to love right now. This might be someone who has hurt you, misunderstood you, or simply drains your energy. Do not force yourself to feel anything specific; just acknowledge their presence in your thoughts. Imagine Jesus standing between you and this person, His hands extended toward both of you. He sees them fully, and He sees you fully. Ask Him, 'Lord, how do You see this person?' Wait quietly for a moment. Perhaps you sense His compassion for their brokenness, His understanding of their story, or His desire for their healing. You are not asked to excuse their behavior or deny your pain, but you are invited to let His love soften the hardness in your heart. As you breathe, imagine His love flowing through you—not from your own strength, but from His. Pray, 'Lord, I choose to release this person into Your hands. Help me to walk in forgiveness and love, one step at a time.' Rest in this posture for a few more breaths, then gently return your focus to God's love for you, which never runs out.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        status: "pending"
      },
      {
        id: "gm-9-gratitude-in-the-little-things",
        title: "Gratitude in the Little Things",
        description: "Slow down and notice the small gifts of God's goodness woven throughout your day.",
        category: "gratitude",
        duration_minutes: 7,
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        script: "Find a comfortable position and allow your body to settle. Take a slow breath in through your nose, and exhale gently through your mouth. Let your breathing become steady and relaxed. As you rest here, reflect on James 1:17: 'Every good gift and every perfect gift is from above, coming down from the Father of lights.' Gratitude is not about pretending everything is easy; it is about noticing God's goodness even in the middle of ordinary or difficult days. Begin by bringing to mind one simple gift from today—a warm cup of coffee or tea, a kind word, a moment of laughter, a quiet pause, a ray of sunlight. Hold that memory gently in your mind. Inhale, and silently say, 'Thank You, Lord.' Exhale, and let a smile soften your face, even if only slightly. Now think of another gift—perhaps the ability to breathe, to move, to think, to feel. Maybe it is the presence of someone who loves you, or the comfort of God when you felt alone. Let these moments rise to the surface, one by one, like small lights in the dark. You do not need to force anything; simply notice and give thanks. If your mind drifts to what is missing or painful, acknowledge it honestly before God. Then gently ask, 'Lord, show me where You have been good to me, even here.' Wait and see what comes to mind. Gratitude does not erase pain, but it reminds your heart that God is still at work, still present, still generous. Take a few more breaths, each one a quiet prayer of thanks. 'Thank You for this breath. Thank You for this moment. Thank You that You are with me.' When you are ready, carry this posture of gratitude with you, looking for small glimpses of His goodness throughout the rest of your day.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        status: "pending"
      },
      {
        id: "gm-10-remembering-gods-faithfulness",
        title: "Remembering God's Faithfulness",
        description: "Look back over your journey and remember the many ways God has carried, protected, and provided for you.",
        category: "gratitude",
        duration_minutes: 9,
        image_url: "https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0",
        script: "Sit or lie down in a comfortable position, allowing your body to relax and your breathing to slow. Take a deep breath in through your nose, and exhale gently through your mouth. As you settle, bring to mind Lamentations 3:22–23: 'The steadfast love of the Lord never ceases; His mercies never come to an end; they are new every morning; great is Your faithfulness.' Let those words rest over you like a warm blanket. Begin to look back, not with regret, but with curiosity: 'Lord, where have You been faithful in my life?' Perhaps you remember a time when you felt lost, and God gave you direction. A season of grief where He comforted you. A need that was met in an unexpected way. A door that closed, only for a better one to open later. Let these memories surface gently, one by one. As each one comes, pause and say, 'Thank You, Lord. You were faithful there.' If there are seasons that still feel confusing or painful, you can bring those to Him as well. You might pray, 'Lord, I don't fully understand that time, but I trust that You were with me even then. Show me glimpses of Your faithfulness in it.' Wait quietly and see what He brings to mind—a person, a provision, a strength you didn't know you had. God's faithfulness is not always loud or dramatic; often it is quiet, steady, and constant. As you breathe, let your heart grow more anchored in this truth: the same God who was faithful before will be faithful again. Take a few more deep breaths, resting in His unchanging character. When you are ready, whisper, 'Great is Your faithfulness,' and carry that assurance with you into whatever lies ahead.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        status: "pending"
      },
      {
        id: "gm-11-healing-waters-of-god",
        title: "Healing Waters of God",
        description: "Enter a quiet space of restoration as you invite God's healing presence into your mind, body, and spirit.",
        category: "healing",
        duration_minutes: 10,
        image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        script: "Find a comfortable position, allowing your body to settle and your breathing to slow. Close your eyes gently. Take a deep breath in through your nose, and exhale softly through your mouth. As you breathe, imagine yourself standing beside a peaceful river—clear, calm, and flowing steadily. This river represents the healing presence of God. In Psalm 147:3 we read, 'He heals the brokenhearted and binds up their wounds.' Let those words settle into your heart. Picture Jesus standing beside you at the river's edge. His expression is gentle, full of compassion and understanding. He invites you to step closer. As you breathe, imagine placing your pain, your worries, your physical discomfort, or emotional burdens into the water. Watch as the current carries them away—not ignored, but held by God, who knows exactly what to do with them. Inhale, and silently say, 'Lord, heal me.' Exhale, and say, 'I release this to You.' Now imagine Jesus placing His hand on your shoulder or over your heart. Feel warmth, comfort, and reassurance flowing into you. This is not forced healing; it is gentle, steady restoration. Think of an area in your life where you long for healing—physical, emotional, spiritual, or relational. Bring it before God without fear or shame. Whisper in your heart, 'Lord, meet me here.' Rest in this moment, letting His presence wash over you like the river—cleansing, renewing, restoring. Take a few more slow breaths, trusting that God is at work even when you cannot see it. When you are ready, gently return to your surroundings, carrying His peace with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        status: "pending"
      },
      {
        id: "gm-12-god-is-my-refuge",
        title: "God Is My Refuge",
        description: "Find safety and strength in the shelter of God's presence, no matter what you are facing.",
        category: "healing",
        duration_minutes: 8,
        image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        script: "Sit or lie down comfortably, letting your body relax and your breathing slow. Take a deep breath in through your nose, and exhale gently through your mouth. As you settle, bring to mind Psalm 46:1: 'God is our refuge and strength, a very present help in trouble.' Let those words become the foundation of this moment. Picture yourself standing before a strong, unshakable fortress—its walls tall, its foundation firm. This fortress represents God's protection over your life. As you breathe, imagine stepping inside. Feel the atmosphere shift—quiet, safe, peaceful. Nothing can reach you here without passing through the hands of God. Inhale, and silently say, 'You are my refuge.' Exhale, and say, 'I rest in You.' Now bring to mind something that has been weighing on you—fear, stress, uncertainty, or pain. Instead of carrying it alone, imagine placing it inside this fortress, at the feet of God. See Him receiving it with strength and compassion. You are not weak for needing refuge; you are wise for seeking it. God invites you to rest in His presence, not to fight every battle in your own strength. As you breathe, feel His peace covering you like a warm blanket. Feel your shoulders soften, your heart slow, your mind quiet. Whisper in your heart, 'Lord, be my strength.' Rest here for a few more breaths, knowing that God surrounds you, protects you, and holds you. When you are ready, gently return to your surroundings, carrying His strength with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        status: "pending"
      },
      {
        id: "gm-13-focus-on-what-matters",
        title: "Focus on What Matters",
        description: "Clear away distractions and center your mind on the things God says are truly important.",
        category: "focus",
        duration_minutes: 7,
        image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        script: "Sit comfortably with your spine upright and your feet grounded. Take a slow breath in through your nose, and exhale through your mouth. Let your breathing become steady and calm. As you settle, reflect on Proverbs 4:25: 'Let your eyes look straight ahead; fix your gaze directly before you.' In a world full of noise and distraction, God invites you to focus on what truly matters—His presence, His purpose, His peace. Begin by noticing your breath. Feel the air entering your lungs, your chest rising, your body softening as you exhale. If your mind begins to wander, gently guide it back to your breath. Now bring to mind one thing that has been pulling your attention away from God—stress, busyness, comparison, or worry. Imagine placing it in a box and setting it aside for now. You are not ignoring it; you are simply choosing to focus on what brings life. Inhale, and silently say, 'Lord, center my mind.' Exhale, and say, 'I release distractions.' Picture Jesus standing before you, calm and steady. Ask Him quietly, 'Lord, what do You want me to focus on today?' Wait for a gentle impression—a word, a feeling, a reminder of Scripture. It may be peace, trust, obedience, gratitude, or simply His presence. Let that become your focus. As you breathe, imagine your mind becoming clearer, your heart more aligned, your spirit more grounded. You do not need to have everything figured out; you only need to fix your eyes on Him. Take a few more breaths, resting in His guidance. When you are ready, gently open your eyes, carrying this clarity with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        status: "pending"
      },
      {
        id: "gm-14-strength-for-the-journey",
        title: "Strength for the Journey",
        description: "Receive fresh strength from God as you prepare for the challenges and opportunities ahead.",
        category: "focus",
        duration_minutes: 8,
        image_url: "https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0",
        script: "Find a comfortable position and take a slow, deep breath in through your nose. Exhale gently through your mouth. Let your shoulders relax and your mind settle. As you breathe, reflect on Isaiah 40:31: 'But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles.' Strength does not come from striving; it comes from waiting in God's presence. Begin by noticing your breath. Feel the rise and fall of your chest. With each inhale, imagine drawing in God's strength. With each exhale, release exhaustion, discouragement, or overwhelm. Inhale: 'Renew me, Lord.' Exhale: 'I release my weakness.' Now picture yourself standing at the beginning of a long path. You may not know every twist or turn ahead, but Jesus stands beside you. He places His hand on your shoulder and says, 'I am with you.' Feel His strength flowing into you—not loud or forceful, but steady and empowering. Think of an area where you need strength today—physical, emotional, spiritual, or relational. Bring it before God. Whisper in your heart, 'Lord, strengthen me here.' Wait quietly. Let His presence fill the places where you feel empty. You do not walk this journey alone. God goes before you, walks beside you, and strengthens you from within. Take a few more deep breaths, receiving His renewal. When you are ready, gently return to your surroundings, carrying His strength with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        status: "pending"
      },
      {
        id: "gm-15-confidence-in-christ",
        title: "Confidence in Christ",
        description: "Let go of insecurity and step into the bold, God-given confidence that comes from knowing who you are in Christ.",
        category: "confidence",
        duration_minutes: 7,
        image_url: "https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0",
        script: "Sit comfortably and take a deep breath in through your nose. Exhale slowly through your mouth. Let your body relax and your mind settle. As you breathe, reflect on 2 Timothy 1:7: 'For God gave us a spirit not of fear but of power and love and self-control.' Confidence in Christ is not arrogance; it is rooted in identity—who God says you are. Begin by noticing your breath. Feel your chest rise and fall. With each inhale, imagine breathing in God's truth. With each exhale, release insecurity, doubt, and fear. Inhale: 'I am loved.' Exhale: 'I release fear.' Now bring to mind an area where you feel unsure of yourself—something you've been avoiding, something that intimidates you, or something you feel unqualified for. Instead of shrinking back, imagine Jesus standing beside you, speaking courage into your heart. Hear Him say, 'You are chosen. You are equipped. You are mine.' Let those words settle deep within you. Picture yourself stepping forward with Him at your side. You are not stepping out alone; you are stepping out empowered by His Spirit. As you breathe, imagine your posture straightening, your heart lifting, your confidence growing—not in your own strength, but in His. Whisper in your heart, 'Lord, make me bold in You.' Rest in this truth: the God who calls you also equips you. Take a few more breaths, receiving His courage. When you are ready, gently open your eyes, carrying His confidence with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
        status: "pending"
      },
      {
        id: "gm-16-walking-in-god-given-identity",
        title: "Walking in Your God‑Given Identity",
        description: "Step into the truth of who God created you to be—chosen, loved, and called with purpose.",
        category: "confidence",
        duration_minutes: 9,
        image_url: "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4",
        script: "Sit comfortably and allow your body to relax. Take a slow breath in through your nose, and exhale gently through your mouth. As you settle, reflect on 1 Peter 2:9: 'But you are a chosen people, a royal priesthood, a holy nation, God's special possession.' These words are not poetic exaggerations; they are declarations of your identity in Christ. Begin by noticing your breath. Feel the air entering your lungs, your chest expanding, your body softening as you exhale. Now imagine standing before a mirror—not a physical one, but a spiritual mirror that reflects how God sees you. Instead of flaws or failures, you see strength, purpose, and belovedness. Inhale, and silently say, 'I am chosen.' Exhale, and say, 'I am Yours.' Bring to mind a lie you've believed about yourself—something spoken over you, something you internalized, or something you've repeated in your own thoughts. Hold it gently, without judgment. Now imagine Jesus standing beside you, placing His hand over your heart. Hear Him say, 'This is not who you are.' Watch as that lie fades away like mist in the sunlight. In its place, let God speak truth: 'You are loved. You are called. You are mine.' As you breathe, imagine stepping forward into this identity—shoulders back, heart open, spirit grounded. You do not have to earn this identity; it is a gift. Rest in this truth for a few more breaths. When you are ready, gently return to your surroundings, carrying your God‑given identity with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
        status: "pending"
      },
      {
        id: "gm-17-reflecting-with-god",
        title: "Reflecting with God",
        description: "Look back over your thoughts, emotions, and experiences with God as your gentle guide.",
        category: "reflection",
        duration_minutes: 8,
        image_url: "https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0",
        script: "Sit comfortably and take a slow breath in through your nose. Exhale gently through your mouth. Let your body relax and your mind settle. As you breathe, reflect on Psalm 139:23–24: 'Search me, O God, and know my heart… lead me in the way everlasting.' God does not examine you to condemn you, but to guide you into freedom and truth. Begin by noticing your breath. Feel the rise and fall of your chest. Now imagine sitting with God in a peaceful room—quiet, safe, filled with His presence. He sits beside you, not as a judge, but as a loving Father. Bring to mind one moment from today or this week that stands out—good or difficult. Hold it gently. Ask God, 'Lord, what do You want me to see here?' Wait quietly. Perhaps He shows you a moment of grace, a moment of growth, or a moment where He was closer than you realized. Now bring to mind an emotion you've been carrying—stress, sadness, joy, frustration, or gratitude. Offer it to Him. Whisper in your heart, 'Lord, be with me in this.' Let Him meet you there. As you breathe, imagine His light shining gently into the corners of your heart—not to expose you, but to heal and guide you. Rest in this moment with Him. When you are ready, take a deep breath in, exhale slowly, and return to your surroundings with a renewed sense of clarity and peace.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3",
        status: "pending"
      },
      {
        id: "gm-18-letting-go-with-god",
        title: "Letting Go with God",
        description: "Release what you cannot control and place it fully into God's capable hands.",
        category: "reflection",
        duration_minutes: 7,
        image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        script: "Find a comfortable position and take a slow breath in through your nose. Exhale gently through your mouth. Let your body soften and your mind quiet. As you breathe, reflect on Psalm 55:22: 'Cast your burden on the Lord, and He will sustain you.' Let this be a moment of release. Begin by noticing your breath. Feel the air entering your lungs, your chest rising, your body relaxing as you exhale. Now bring to mind something you've been holding tightly—something heavy, stressful, or uncertain. Picture yourself holding it in your hands. It may feel heavy, sharp, or overwhelming. Now imagine Jesus standing before you, His hands open, gentle, and strong. He invites you to place this burden into His hands. Inhale, and silently say, 'Lord, I trust You.' Exhale, and say, 'I release this to You.' Watch as He receives it—not reluctantly, but gladly. He carries what you cannot. Feel your body lighten, your heart soften, your mind clear. You do not have to hold everything together. God is holding you. Rest in this truth for a few more breaths. When you are ready, gently return to your surroundings, carrying His peace with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3",
        status: "pending"
      },
      {
        id: "gm-19-god-is-with-me",
        title: "God Is With Me",
        description: "Become deeply aware of God's constant presence, comfort, and companionship.",
        category: "mindfulness",
        duration_minutes: 8,
        image_url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
        script: "Sit comfortably and take a slow breath in through your nose. Exhale gently through your mouth. Let your breathing settle. As you breathe, reflect on Joshua 1:9: 'Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go.' Picture yourself sitting in a quiet room. Now imagine Jesus entering the room and sitting beside you. His presence is warm, steady, and reassuring. Inhale: 'You are with me.' Exhale: 'I am not alone.' Bring to mind a situation where you have felt alone or overwhelmed. Imagine Jesus placing His hand on your shoulder, reminding you that He has never left you. Rest in His presence for a few more breaths. When you are ready, whisper, 'You are with me always,' and carry that truth with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3",
        status: "pending"
      },
      {
        id: "gm-20-god-guides-my-steps",
        title: "God Guides My Steps",
        description: "Trust God to guide your steps, even when the path ahead feels uncertain.",
        category: "mindfulness",
        duration_minutes: 9,
        image_url: "https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0",
        script: "Sit comfortably and take a slow breath in through your nose. Exhale gently through your mouth. Let your breathing become calm and steady. As you breathe, reflect on Psalm 37:23: 'The steps of a man are established by the Lord, when he delights in His way.' Picture yourself standing at the beginning of a path. You cannot see where it leads, but you trust that God is guiding you. With each breath, imagine taking a step forward. Inhale: 'Guide me, Lord.' Exhale: 'I trust Your plan.' Bring to mind a decision or direction you are uncertain about. Instead of anxiously trying to figure it out, imagine placing it in God's hands. Whisper in your heart, 'Lord, show me the way.' Rest in His guidance for a few more breaths. When you are ready, whisper, 'You guide my steps,' and carry that trust with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3",
        status: "pending"
      },
      {
        id: "gm-21-jesus-calm-my-anxious-heart",
        title: "Jesus, Calm My Anxious Heart",
        description: "Let the peace of Christ settle your anxious thoughts and steady your breathing.",
        category: "stress_relief",
        duration_minutes: 8,
        image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        script: "Find a comfortable position and allow your body to settle. Take a slow breath in through your nose, and exhale gently through your mouth. Let your shoulders drop and your jaw soften. As you breathe, reflect on Philippians 4:6–7: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God… will guard your hearts and your minds in Christ Jesus.' Imagine your anxious thoughts as small birds fluttering around your mind. One by one, picture them landing gently in the hands of Jesus. He is not overwhelmed by them. He is not frustrated with you. He receives each one with tenderness. Inhale, and silently say, 'Jesus, calm my heart.' Exhale, and say, 'I give You my worries.' Bring to mind one specific worry. Hold it gently. Now imagine placing it into Jesus' hands. See Him close His fingers around it with care. Feel your chest loosen, your breath deepen, your mind quiet. Jesus is not asking you to pretend everything is fine; He is inviting you to trust Him with what is not. Rest in His presence for a few more breaths. When you are ready, whisper in your heart, 'Your peace guards me,' and carry that truth with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3",
        status: "pending"
      },
      {
        id: "gm-22-god-holds-my-future",
        title: "God Holds My Future",
        description: "Release fear of the unknown and rest in the truth that God is already in your tomorrow.",
        category: "stress_relief",
        duration_minutes: 9,
        image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        script: "Sit comfortably and take a slow breath in through your nose. Exhale gently through your mouth. Let your breathing become steady. As you settle, reflect on Jeremiah 29:11: 'For I know the plans I have for you… plans for welfare and not for evil, to give you a future and a hope.' God is not uncertain about your future. He is already there. Begin by noticing your breath. Feel your chest rise and fall. Now bring to mind something about the future that feels unclear or frightening. Instead of trying to solve it, imagine placing it into God's hands. Inhale: 'You know my future.' Exhale: 'I trust You with it.' Picture Jesus walking ahead of you on a path—steady, confident, unhurried. He turns and smiles, motioning for you to follow. You do not walk into the unknown alone; you walk into a future God has already prepared. Rest in this truth for a few more breaths. When you are ready, whisper, 'My future is in Your hands,' and carry that peace with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-22.mp3",
        status: "pending"
      },
      {
        id: "gm-23-god-of-comfort",
        title: "God of All Comfort",
        description: "Let God comfort you in your grief, sadness, or heaviness with His gentle presence.",
        category: "healing",
        duration_minutes: 10,
        image_url: "https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0",
        script: "Sit or lie down comfortably and take a slow breath in through your nose. Exhale gently through your mouth. Let your body soften. As you breathe, reflect on 2 Corinthians 1:3–4: 'The Father of mercies and God of all comfort, who comforts us in all our affliction.' God does not rush your healing. He sits with you in it. Bring your awareness to your heart. Notice any heaviness, sadness, or ache. You do not need to hide it. Imagine Jesus sitting beside you, His presence warm and steady. He places His hand over your heart. Feel comfort flowing into you—not forcing you to feel better, but holding you in love. Inhale: 'You comfort me.' Exhale: 'I rest in You.' Bring to mind the source of your grief or heaviness. Whisper in your heart, 'Lord, be with me here.' Let His presence surround you like a soft blanket. Rest in His comfort for a few more breaths. When you are ready, whisper, 'You are my comfort,' and carry His nearness with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-23.mp3",
        status: "pending"
      },
      {
        id: "gm-24-jesus-light-in-my-darkness",
        title: "Jesus, Light in My Darkness",
        description: "Invite the light of Christ to shine into the dark or confusing places of your heart.",
        category: "healing",
        duration_minutes: 9,
        image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        script: "Find a comfortable position and take a slow breath in through your nose. Exhale gently through your mouth. Let your breathing become calm. As you breathe, reflect on John 8:12: 'I am the light of the world. Whoever follows me will not walk in darkness, but will have the light of life.' Picture yourself standing in a dim room. Now imagine a soft, warm light beginning to fill the space. This light is Jesus—gentle, kind, illuminating. Bring to mind an area of your life that feels dark, confusing, or heavy. Instead of hiding it, imagine holding it out toward Jesus. Inhale: 'Shine Your light.' Exhale: 'I give this to You.' Watch as His light touches that place—not with harshness, but with healing clarity. Feel your heart soften, your mind clear, your spirit lift. Rest in His light for a few more breaths. When you are ready, whisper, 'Your light guides me,' and carry that truth with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-24.mp3",
        status: "pending"
      },
      {
        id: "gm-25-god-of-new-beginnings",
        title: "God of New Beginnings",
        description: "Let go of the past and step into the new thing God is doing in your life.",
        category: "reflection",
        duration_minutes: 8,
        image_url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
        script: "Sit comfortably and take a slow breath in through your nose. Exhale gently through your mouth. Let your body relax. As you breathe, reflect on Isaiah 43:19: 'Behold, I am doing a new thing… do you not perceive it?' God is always at work, even when you cannot see it. Bring to mind something from your past that you are ready to release—a mistake, a disappointment, a closed door. Hold it gently. Now imagine Jesus standing before you with open hands. Inhale: 'I release the old.' Exhale: 'I receive the new.' Picture placing the past into His hands. Watch as He receives it with love. Now imagine Him offering you something new—hope, direction, healing, or peace. Let your heart open to it. Rest in this moment for a few more breaths. When you are ready, whisper, 'You make all things new,' and carry that truth with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-25.mp3",
        status: "pending"
      },
      {
        id: "gm-26-jesus-my-good-shepherd",
        title: "Jesus, My Good Shepherd",
        description: "Follow the gentle guidance of Jesus as He leads you beside still waters.",
        category: "mindfulness",
        duration_minutes: 9,
        image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        script: "Sit comfortably and take a slow breath in through your nose. Exhale gently through your mouth. Let your breathing settle. As you breathe, reflect on Psalm 23:1–2: 'The Lord is my shepherd… He leads me beside still waters; He restores my soul.' Picture yourself walking beside a calm, peaceful stream. Jesus walks ahead of you, guiding you with gentleness. Inhale: 'Lead me, Lord.' Exhale: 'I follow You.' Bring to mind an area where you need guidance. Whisper in your heart, 'Shepherd me here.' Imagine Jesus turning toward you with kindness, offering direction—not rushed, not pressured, but steady. Rest in His guidance for a few more breaths. When you are ready, whisper, 'You restore my soul,' and carry His peace with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-26.mp3",
        status: "pending"
      },
      {
        id: "gm-27-peace-be-still",
        title: "Peace, Be Still",
        description: "Let Jesus speak peace over the storms in your heart and mind.",
        category: "stress_relief",
        duration_minutes: 7,
        image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        script: "Find a comfortable position and take a slow breath in through your nose. Exhale gently through your mouth. Let your body soften. As you breathe, reflect on Mark 4:39: 'He rebuked the wind and said to the sea, \"Peace! Be still!\" And the wind ceased.' Picture the storm inside your heart—worries, fears, racing thoughts. Now imagine Jesus standing before the storm, raising His hand, and speaking, 'Peace, be still.' Inhale: 'Your peace fills me.' Exhale: 'My storm calms.' Feel your breath deepen, your mind quiet, your heart steady. Rest in His peace for a few more breaths. When you are ready, whisper, 'You calm my storms,' and carry His peace with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-27.mp3",
        status: "pending"
      },
      {
        id: "gm-28-god-is-my-strength",
        title: "God Is My Strength",
        description: "Draw fresh strength from God when you feel weary, overwhelmed, or stretched thin.",
        category: "focus",
        duration_minutes: 8,
        image_url: "https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0",
        script: "Sit comfortably and take a slow breath in through your nose. Exhale gently through your mouth. Let your breathing become steady. As you breathe, reflect on Psalm 73:26: 'My flesh and my heart may fail, but God is the strength of my heart and my portion forever.' Strength is not something you must manufacture; it is something God supplies. Bring to mind an area where you feel weak or weary. Inhale: 'Strengthen me, Lord.' Exhale: 'I rest in You.' Picture God placing His hand over your heart, filling you with quiet strength—not loud or forceful, but steady and sustaining. Rest in His strength for a few more breaths. When you are ready, whisper, 'You are my strength,' and carry His power with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-28.mp3",
        status: "pending"
      },
      {
        id: "gm-29-grace-for-today",
        title: "Grace for Today",
        description: "Receive the daily grace God provides—enough for this moment, this breath, this day.",
        category: "gratitude",
        duration_minutes: 7,
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        script: "Sit comfortably and take a slow breath in through your nose. Exhale gently through your mouth. Let your breathing settle. As you breathe, reflect on Matthew 6:34: 'Do not worry about tomorrow… each day has enough trouble of its own.' God gives grace one day at a time. Bring your awareness to this moment—this breath, this heartbeat, this space. Inhale: 'Your grace is enough.' Exhale: 'I release tomorrow.' Think of one thing God has given you today—strength, provision, comfort, or simply breath. Whisper, 'Thank You.' Rest in His grace for a few more breaths. When you are ready, whisper, 'You give me grace for today,' and carry that truth with you.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-29.mp3",
        status: "pending"
      },
      {
        id: "gm-30-resting-in-gods-love",
        title: "Resting in God's Love",
        description: "End your day wrapped in the unconditional, unchanging love of God.",
        category: "sleep",
        duration_minutes: 10,
        image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        script: "Lie down comfortably and take a slow breath in through your nose. Exhale gently through your mouth. Let your body grow heavy and your mind quiet. As you breathe, reflect on Romans 8:38–39: 'Nothing… will be able to separate us from the love of God in Christ Jesus our Lord.' Picture God's love as a warm blanket wrapping around you—steady, safe, unchanging. Inhale: 'Your love surrounds me.' Exhale: 'I rest in You.' Bring to mind the events of your day. Without judgment, offer them to God. Whisper, 'Thank You for being with me.' Let His love wash over every part of you—your thoughts, your emotions, your body. Rest in His presence for a few more breaths. When sleep comes, let it be an act of trust, knowing you are held in perfect love.",
        ambient_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-30.mp3",
        status: "pending"
      }
    ];

    await base44.entities.Meditation.bulkCreate(MEDITATIONS);
    console.log("[Admin] Reseeded 30 meditations");

    // 4. Queue TTS jobs for all 30
    for (const med of MEDITATIONS) {
      await base44.entities.TTSJob.create({
        meditation_id: med.id,
        status: "pending"
      });
    }
    console.log("[Admin] Queued 30 TTS jobs");

    return {
      success: true,
      message: "Reset + Reseed + Backfill completed",
      meditations_reseeded: 30,
      jobs_queued: 30
    };
  } catch (error) {
    console.error("[Admin] Error:", error);
    throw error;
  }
}