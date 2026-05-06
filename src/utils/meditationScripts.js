/**
 * Pre-authored meditation scripts.
 * ─────────────────────────────────────────────────────────────────────────
 * Why static scripts (not LLM-generated):
 *   1. INSTANT LOAD. The previous LLM call took 5-15s before playback could
 *      begin. Pre-authored content plays immediately.
 *   2. CONSISTENT QUALITY. LLM-generated meditations vary wildly in
 *      spiritual depth, scripture accuracy, and tone. Hand-crafted scripts
 *      are reliably good.
 *   3. THEOLOGICAL INTENTIONALITY. This is a faith-based app. Each script
 *      anchors in the specific scripture noted in the meditation prompt.
 *      An LLM may paraphrase, conflate verses, or drift toward generic
 *      mindfulness language ("your truth," "the universe").
 *   4. NO API DEPENDENCY for script generation. The session works even if
 *      LLM endpoints are slow or down.
 *
 * Schema:
 *   Each entry is keyed by meditation id and is an array of segments.
 *   Each segment is { text: string, pause: number_of_seconds }.
 *   - `text` is what Hannah's voice speaks
 *   - `pause` is silence after the segment, before the next one starts
 *   Pause guidance:
 *     2-4s : transitions between thoughts
 *     5-8s : breathing exercises, visualization, reflection
 *     8-12s : sleep meditations, deep stillness
 *
 * Length matched to duration:
 *   3-4 min  : 8-10 segments
 *   5-6 min  : 12-14 segments
 *   7-8 min  : 14-16 segments
 *   9-10 min : 16-18 segments
 *   12 min   : 18-20 segments
 *
 * Falls back to MEDITATIONS_DEFAULT_SCRIPT (defined in the page) if a
 * meditation id has no script entry — though every catalog entry should
 * have one.
 */

export const MEDITATION_SCRIPTS = {
  // ─── MORNING (3) ────────────────────────────────────────────────────────

  'morning-gratitude': [
    { text: "Welcome. Take a moment to settle in.", pause: 4 },
    { text: "Close your eyes if you can. Place your hand on your heart.", pause: 5 },
    { text: "This is the day the Lord has made. We will rejoice and be glad in it.", pause: 6 },
    { text: "Breathe in slowly through your nose...", pause: 4 },
    { text: "And release through your mouth.", pause: 5 },
    { text: "Now bring to mind one thing you are thankful for this morning.", pause: 8 },
    { text: "Hold it gently in your awareness. Let gratitude rise.", pause: 7 },
    { text: "Now a second blessing. Something small, perhaps. Something easily missed.", pause: 8 },
    { text: "And a third. The breath in your lungs. The light returning. A face you love.", pause: 8 },
    { text: "Father, thank you for this new day. Thank you for the chance to begin again.", pause: 6 },
    { text: "Set an intention now — one word to carry into your morning.", pause: 7 },
    { text: "Peace. Or trust. Or presence. Whatever rises, let it anchor you.", pause: 6 },
    { text: "When you open your eyes, walk into this day rooted in thankfulness.", pause: 4 },
    { text: "Amen.", pause: 3 },
  ],

  'breathing-reset': [
    { text: "Wherever you are, pause. Three minutes is yours.", pause: 4 },
    { text: "We will breathe together using the four-count box pattern.", pause: 4 },
    { text: "Inhale slowly for four counts...", pause: 5 },
    { text: "Hold for four...", pause: 5 },
    { text: "Exhale for four...", pause: 5 },
    { text: "And rest for four.", pause: 5 },
    { text: "Again. Inhale. Hold. Exhale. Rest.", pause: 8 },
    { text: "And the peace of God, which surpasses all understanding, will guard your heart and your mind.", pause: 6 },
    { text: "One more cycle. Slowly.", pause: 8 },
    { text: "You are returning to center. You are returning to peace.", pause: 5 },
    { text: "Carry this breath with you. Amen.", pause: 3 },
  ],

  'confidence-courage': [
    { text: "Find a steady posture. Stand if you can. Or sit tall.", pause: 4 },
    { text: "Take a deep breath in. Feel your spine lengthen.", pause: 5 },
    { text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", pause: 6 },
    { text: "These words were given to Joshua. They are given to you now.", pause: 5 },
    { text: "Bring to mind something you are facing. A conversation. A challenge. A step you have been hesitating to take.", pause: 7 },
    { text: "See it clearly. Now hear the words again — be strong and courageous.", pause: 6 },
    { text: "You are not walking into it alone. The same God who parted seas walks beside you.", pause: 6 },
    { text: "Inhale strength. Exhale fear.", pause: 7 },
    { text: "Inhale courage. Exhale doubt.", pause: 7 },
    { text: "Now declare it: I am bold. I am equipped. I am sent.", pause: 6 },
    { text: "I do not have a spirit of fear, but of power, and of love, and of a sound mind.", pause: 5 },
    { text: "Step forward today with the boldness of someone who is held.", pause: 4 },
    { text: "Amen.", pause: 3 },
  ],

  // ─── CALM (4) ───────────────────────────────────────────────────────────

  'anxiety-relief': [
    { text: "If your heart is racing, you are in the right place.", pause: 4 },
    { text: "Find a comfortable position. Place both feet on the floor.", pause: 4 },
    { text: "Notice — do not fight — what you are feeling. Anxiety is a signal, not an enemy.", pause: 6 },
    { text: "We will use a longer exhale to settle your nervous system.", pause: 4 },
    { text: "Inhale through your nose for four counts...", pause: 5 },
    { text: "Hold for seven...", pause: 8 },
    { text: "And exhale slowly through your mouth for eight.", pause: 9 },
    { text: "Again. Four in. Seven hold. Eight out.", pause: 12 },
    { text: "Picture a still lake at dawn. The surface is glass. The water is deep.", pause: 7 },
    { text: "This is the peace Christ offers. Not the absence of storms, but the presence of God in them.", pause: 7 },
    { text: "Fear not, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.", pause: 8 },
    { text: "One more long exhale. Release what does not belong to you to carry.", pause: 9 },
    { text: "You are safe. You are held. You can return to this breath any time.", pause: 5 },
    { text: "Amen.", pause: 3 },
  ],

  'letting-go': [
    { text: "Settle into your seat. Let your hands rest open in your lap.", pause: 5 },
    { text: "Take a slow breath in. And out.", pause: 5 },
    { text: "Today we practice releasing what we have been gripping too tightly.", pause: 5 },
    { text: "Bring to mind one thing you have been trying to control.", pause: 7 },
    { text: "Maybe an outcome. Maybe another person. Maybe yesterday.", pause: 6 },
    { text: "See it in your hands. Feel the tightness of your grip.", pause: 6 },
    { text: "Now picture God's hands beneath yours — open, steady, far larger.", pause: 7 },
    { text: "Cast all your anxiety on him because he cares for you.", pause: 6 },
    { text: "On your next exhale, let your fingers loosen.", pause: 5 },
    { text: "Release it slowly. Watch it fall into hands that can hold it.", pause: 8 },
    { text: "Inhale freedom. Exhale control.", pause: 7 },
    { text: "Inhale trust. Exhale striving.", pause: 7 },
    { text: "You do not have to hold what was never yours to hold.", pause: 6 },
    { text: "Carry this lighter posture into your day. Amen.", pause: 4 },
  ],

  'overcoming-fear': [
    { text: "Sit upright. Feel your feet planted firmly.", pause: 4 },
    { text: "We are going to face a fear today, with God beside us.", pause: 5 },
    { text: "Take three deep breaths. In through the nose, out through the mouth.", pause: 9 },
    { text: "Now name your fear in your mind. Not vaguely. Specifically.", pause: 7 },
    { text: "What is the worst you imagine? Let it be named, not hidden.", pause: 7 },
    { text: "God has not given us a spirit of fear, but of power, and of love, and of a sound mind.", pause: 6 },
    { text: "Power. Love. A sound mind. These are yours.", pause: 5 },
    { text: "Picture yourself walking through what scares you. But you are not alone.", pause: 7 },
    { text: "The Lord goes ahead of you and walks beside you.", pause: 6 },
    { text: "The fear is real, but it does not have the final word.", pause: 5 },
    { text: "Declare it now: I will not be ruled by fear. I am held by perfect love.", pause: 6 },
    { text: "Perfect love casts out fear.", pause: 5 },
    { text: "Step into your day with this truth set in your bones. Amen.", pause: 4 },
  ],

  // ─── FAITH (4) ──────────────────────────────────────────────────────────

  'scripture-reflection': [
    { text: "Welcome. Today we will sit with one of the most loved psalms — Psalm twenty-three.", pause: 5 },
    { text: "Let your shoulders drop. Take a slow breath.", pause: 5 },
    { text: "Hear the words slowly. Let them settle in.", pause: 4 },
    { text: "The Lord is my shepherd. I shall not want.", pause: 8 },
    { text: "Sit with that. The Lord. Your shepherd. You shall not lack what you need.", pause: 8 },
    { text: "He makes me lie down in green pastures. He leads me beside still waters.", pause: 8 },
    { text: "Picture the green field. The still water. Your body resting.", pause: 8 },
    { text: "He restores my soul. He guides me along right paths for his name's sake.", pause: 8 },
    { text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me.", pause: 9 },
    { text: "Whatever valley you are in, you are not alone there.", pause: 6 },
    { text: "Your rod and your staff, they comfort me.", pause: 7 },
    { text: "You prepare a table before me in the presence of my enemies.", pause: 7 },
    { text: "Surely your goodness and love will follow me all the days of my life.", pause: 7 },
    { text: "And I will dwell in the house of the Lord forever.", pause: 8 },
    { text: "Rest in this psalm. It is a home you can return to. Amen.", pause: 4 },
  ],

  'purpose-calling': [
    { text: "Find your seat. Let your spine rise like a young tree.", pause: 5 },
    { text: "Today we listen for the calling stitched into who you are.", pause: 5 },
    { text: "Take a deep breath. Settle.", pause: 5 },
    { text: "For I know the plans I have for you, declares the Lord. Plans to prosper you, not to harm you. Plans for hope. Plans for a future.", pause: 7 },
    { text: "These are God's words over your life. Let them land.", pause: 6 },
    { text: "Picture a path lit ahead of you. You cannot see the end. You can see the next step.", pause: 7 },
    { text: "Bring to mind a moment when you felt fully alive. What were you doing?", pause: 8 },
    { text: "That spark is not random. It is a clue.", pause: 6 },
    { text: "What if your purpose is not somewhere out there, waiting to be found, but already inside you, waiting to be lived?", pause: 8 },
    { text: "Surrender your timing. Surrender your need to know the whole map.", pause: 6 },
    { text: "Just take the next faithful step.", pause: 6 },
    { text: "Father, let me walk in the calling you wrote for me before the world began.", pause: 5 },
    { text: "I am sent. I am equipped. I am still becoming. Amen.", pause: 4 },
  ],

  'healing-prayer': [
    { text: "Settle in. This is a sacred space.", pause: 4 },
    { text: "Place your hands palm-up in your lap. A posture of receiving.", pause: 5 },
    { text: "Take three deep breaths.", pause: 9 },
    { text: "Bring to mind what needs healing — body, mind, or spirit.", pause: 7 },
    { text: "Do not minimize it. Do not explain it away. Simply name it.", pause: 7 },
    { text: "He was pierced for our transgressions. He was crushed for our iniquities. By his wounds we are healed.", pause: 7 },
    { text: "Picture yourself laying what hurts at the foot of the cross.", pause: 7 },
    { text: "You do not have to carry this alone.", pause: 6 },
    { text: "Now picture warm light flowing from the top of your head, down through your shoulders, your chest, your stomach, and out through your feet.", pause: 9 },
    { text: "Wherever there is pain, let the light linger.", pause: 8 },
    { text: "Confess your faults to one another, and pray for one another, that you may be healed. The fervent prayer of a righteous person avails much.", pause: 7 },
    { text: "Lord Jesus, Healer, I bring this place of pain to you.", pause: 6 },
    { text: "I receive what you have already given.", pause: 6 },
    { text: "Wholeness in body. Peace in mind. Comfort in spirit.", pause: 7 },
    { text: "Even now, you are restoring me. Amen.", pause: 4 },
  ],

  'worship-presence': [
    { text: "Welcome. Open your hands gently. Open your heart wider.", pause: 5 },
    { text: "Today we step into worship — not as performance, but as presence.", pause: 5 },
    { text: "Take a slow breath. Let the day fall away.", pause: 6 },
    { text: "Make a joyful noise to the Lord, all you lands. Serve the Lord with gladness.", pause: 6 },
    { text: "Begin in gratitude. Bring to mind one thing God has done for you.", pause: 8 },
    { text: "Whisper it now: thank you, Lord.", pause: 6 },
    { text: "Enter his gates with thanksgiving and his courts with praise.", pause: 6 },
    { text: "Now move from gratitude into adoration. Worship is not for what God has done — it is for who he is.", pause: 7 },
    { text: "He is holy. He is faithful. He is gentle with you.", pause: 7 },
    { text: "He is the beginning and the end. The lover of your soul.", pause: 7 },
    { text: "Be still. Breathe in. He is here.", pause: 9 },
    { text: "The Lord is good. His love endures forever. His faithfulness continues through all generations.", pause: 8 },
    { text: "You did not have to climb up to him. He came down to you.", pause: 7 },
    { text: "Sit in this nearness as long as you can. Amen.", pause: 5 },
  ],

  // ─── HEAL (6) ───────────────────────────────────────────────────────────

  'body-scan': [
    { text: "Find a position you can hold for the next eight minutes — sitting or lying down.", pause: 5 },
    { text: "Close your eyes. Take three slow breaths.", pause: 9 },
    { text: "Your body is a temple of the Holy Spirit. Today we honor it with attention.", pause: 6 },
    { text: "Begin at the crown of your head. Notice it. Soften it.", pause: 7 },
    { text: "Now your forehead. Let any furrow release.", pause: 7 },
    { text: "Your jaw. Unclench. Let your tongue rest at the roof of your mouth.", pause: 7 },
    { text: "Your shoulders. Let them drop two inches. Let them drop again.", pause: 8 },
    { text: "Your chest. Feel it rising and falling. The faithful work of your lungs.", pause: 7 },
    { text: "Your stomach. Soften any holding there.", pause: 7 },
    { text: "Your lower back. Let it widen. Let it ease.", pause: 7 },
    { text: "Your hips. Notice the seat beneath you, the support already given.", pause: 7 },
    { text: "Your thighs. Your knees. Let them rest.", pause: 7 },
    { text: "Your calves. Your ankles. Your feet — every small bone.", pause: 7 },
    { text: "Now scan your whole body at once. Notice it as a single, beloved instrument.", pause: 8 },
    { text: "He heals the broken-hearted and binds up their wounds.", pause: 6 },
    { text: "Receive this rest as a gift. Amen.", pause: 4 },
  ],

  'forgiveness-peace': [
    { text: "This is hard work. Welcome it gently.", pause: 5 },
    { text: "Take a slow breath. Let your jaw soften.", pause: 5 },
    { text: "Bring to mind someone you need to forgive — or yourself.", pause: 8 },
    { text: "Do not minimize what they did. Do not minimize what you did.", pause: 6 },
    { text: "Forgiveness is not saying it didn't matter. It is saying — it will not own me anymore.", pause: 7 },
    { text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.", pause: 7 },
    { text: "Picture the resentment in your hands like a heavy stone.", pause: 7 },
    { text: "On your next exhale, see yourself setting it down.", pause: 8 },
    { text: "It does not have to be easy. It does not have to be once. You can come back here again.", pause: 7 },
    { text: "Now receive forgiveness yourself. Whatever you have been holding against yourself — release.", pause: 8 },
    { text: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.", pause: 7 },
    { text: "Inhale grace. Exhale shame.", pause: 7 },
    { text: "You are forgiven. You are free to forgive.", pause: 6 },
    { text: "Carry this lightness forward. Amen.", pause: 4 },
  ],

  'grief-comfort': [
    { text: "If grief brought you here, you are welcome exactly as you are.", pause: 6 },
    { text: "There is no rush. There is no right way to feel.", pause: 5 },
    { text: "Take a slow breath if you can.", pause: 6 },
    { text: "The Lord is close to the broken-hearted. He saves those who are crushed in spirit.", pause: 7 },
    { text: "Notice where in your body the grief lives. Your chest. Your throat. Your stomach.", pause: 8 },
    { text: "Place a hand there gently. Like you would for someone you love.", pause: 7 },
    { text: "You are someone you love.", pause: 6 },
    { text: "Blessed are those who mourn, for they shall be comforted.", pause: 7 },
    { text: "Picture a hand on your shoulder. Steady. Not rushing you.", pause: 8 },
    { text: "Whatever you are carrying, you are not carrying alone.", pause: 7 },
    { text: "Tears are prayers when they cannot be put into words.", pause: 7 },
    { text: "He will wipe every tear from their eyes. There will be no more death, or mourning, or crying, or pain.", pause: 8 },
    { text: "That promise is not for some far-off day only. It is also for now, in pieces, as you can receive it.", pause: 7 },
    { text: "Rest in his nearness as long as you need. Amen.", pause: 6 },
  ],

  'self-compassion': [
    { text: "Settle in. Place a hand over your heart.", pause: 5 },
    { text: "Feel the steady beat. The faithful work happening without your effort.", pause: 6 },
    { text: "Today we silence the inner critic with a kinder voice.", pause: 5 },
    { text: "Notice how you have been speaking to yourself this week.", pause: 7 },
    { text: "Would you speak that way to a child you loved? To a friend?", pause: 7 },
    { text: "I praise you because I am fearfully and wonderfully made. Your works are wonderful. I know that full well.", pause: 7 },
    { text: "Say it now in your heart: I am wonderfully made.", pause: 7 },
    { text: "Now picture God looking at you. Not with disappointment. With delight.", pause: 8 },
    { text: "He rejoices over you with singing.", pause: 7 },
    { text: "If God can be tender with you, you can be tender with you.", pause: 7 },
    { text: "Inhale kindness. Exhale criticism.", pause: 7 },
    { text: "Inhale acceptance. Exhale shame.", pause: 7 },
    { text: "Speak to yourself today as one already loved. Amen.", pause: 4 },
  ],

  'relationships': [
    { text: "Find your seat. Soften your face.", pause: 5 },
    { text: "Bring to mind one important relationship in your life.", pause: 7 },
    { text: "See the person clearly. Their face. Their voice.", pause: 7 },
    { text: "Notice what comes up. Affection. Or hurt. Or expectation. Just notice.", pause: 7 },
    { text: "Love is patient, love is kind. It does not envy, it does not boast.", pause: 6 },
    { text: "It is not proud, not self-seeking, not easily angered. It keeps no record of wrongs.", pause: 7 },
    { text: "Love bears all things, believes all things, hopes all things, endures all things.", pause: 7 },
    { text: "Where in this relationship have you been less than this? Where have they?", pause: 8 },
    { text: "Release any quiet record-keeping. Let the ledger go.", pause: 8 },
    { text: "Now pray for them. Bless them. Even if it is hard.", pause: 8 },
    { text: "Lord, soften my heart toward this person. Heal what is wounded between us.", pause: 7 },
    { text: "Let me love as you have loved me — fully, freely, faithfully.", pause: 6 },
    { text: "Walk into your next interaction with this softened heart. Amen.", pause: 4 },
  ],

  'joy-restoration': [
    { text: "Welcome. If joy has felt distant, you are in the right place.", pause: 5 },
    { text: "Take a deep breath. Let a small smile rest on your lips, even if it feels forced.", pause: 6 },
    { text: "The body and the heart are connected. Joy can begin in either one.", pause: 5 },
    { text: "Now bring to mind a memory of pure delight. A moment you laughed until you cried.", pause: 8 },
    { text: "See it. Feel it. Let it warm you.", pause: 8 },
    { text: "The joy of the Lord is your strength.", pause: 6 },
    { text: "Joy is not a feeling you must summon. It is a wellspring that already lives in you.", pause: 7 },
    { text: "Picture it rising from your belly, up through your chest, into your face.", pause: 8 },
    { text: "You will go out in joy and be led forth in peace.", pause: 7 },
    { text: "Even in hard seasons, joy can coexist with grief. They are not enemies.", pause: 6 },
    { text: "Whisper it: I receive joy today. Even if it is small. Even if it surprises me.", pause: 6 },
    { text: "Carry this lightness forward. Look for joy where you go. Amen.", pause: 4 },
  ],

  // ─── FOCUS (4) ──────────────────────────────────────────────────────────

  'midday-reset': [
    { text: "Stop where you are. Four minutes is yours.", pause: 4 },
    { text: "Take a deep breath in...", pause: 4 },
    { text: "And let it out, with a long sigh if you need to.", pause: 5 },
    { text: "Again. Inhale...", pause: 4 },
    { text: "Exhale.", pause: 5 },
    { text: "And once more — slowly.", pause: 6 },
    { text: "The morning is finished. The afternoon is fresh.", pause: 5 },
    { text: "He gives strength to the weary and increases the power of the weak.", pause: 6 },
    { text: "Set one intention for the next few hours.", pause: 7 },
    { text: "Not a to-do list. One word, or one image, of how you want to show up.", pause: 7 },
    { text: "Father, refresh me. Renew my mind. Carry me through.", pause: 5 },
    { text: "Open your eyes. Step back into your day, lighter. Amen.", pause: 3 },
  ],

  'focus-clarity': [
    { text: "Sit upright. Feet on the floor. Hands resting.", pause: 4 },
    { text: "Take a slow breath in. Hold it for a beat. Let it out.", pause: 6 },
    { text: "Today we clear the static.", pause: 5 },
    { text: "Notice the thoughts pulling at you right now. Don't push them away. Just notice.", pause: 7 },
    { text: "Picture them as leaves on a stream, drifting past.", pause: 7 },
    { text: "Let your eyes look directly ahead. Let your gaze be fixed and forward.", pause: 5 },
    { text: "What is in front of you? What is the one thing that matters most right now?", pause: 8 },
    { text: "Name it in your mind.", pause: 6 },
    { text: "Now picture a still, clear pond. The bottom is visible. Nothing hidden. Nothing churning.", pause: 7 },
    { text: "Lord, give me a quiet mind and a clear path.", pause: 6 },
    { text: "Inhale clarity. Exhale distraction.", pause: 7 },
    { text: "Step into your work with focus. With purpose. With one thing at a time. Amen.", pause: 4 },
  ],

  'abundance-mindset': [
    { text: "Settle in. Open your hands in your lap.", pause: 5 },
    { text: "We begin with a slow breath. In. And out.", pause: 6 },
    { text: "Today we shift from scarcity to abundance.", pause: 5 },
    { text: "Bring to mind three ways God has provided for you.", pause: 8 },
    { text: "A meal. A doorway opened. An unexpected kindness.", pause: 7 },
    { text: "Hold each one in your awareness. Let gratitude rise.", pause: 7 },
    { text: "And my God will meet all your needs according to the riches of his glory in Christ Jesus.", pause: 7 },
    { text: "Now notice where scarcity whispers — there is not enough, you are not enough, time is running out.", pause: 7 },
    { text: "Let those whispers come up to the surface. Then exhale them out.", pause: 7 },
    { text: "Picture a long table set for many. The cup is full. The bread is plenty. There is room for you.", pause: 8 },
    { text: "You are not running out. You are being supplied.", pause: 6 },
    { text: "I trust in the Provider. I receive with open hands. Amen.", pause: 4 },
  ],

  'temptation-resistance': [
    { text: "Find your seat. Plant your feet. Sit tall.", pause: 4 },
    { text: "Today we arm ourselves before facing what pulls us away from God.", pause: 5 },
    { text: "Take a steady breath. Let your spirit settle.", pause: 5 },
    { text: "Be strong in the Lord and in his mighty power. Put on the full armor of God so that you can take your stand.", pause: 7 },
    { text: "Name the temptation in your mind. Be honest. The Lord already knows.", pause: 8 },
    { text: "No temptation has overtaken you except what is common to mankind. And God is faithful — he will not let you be tempted beyond what you can bear.", pause: 8 },
    { text: "He will also provide a way out so that you can endure it.", pause: 6 },
    { text: "Picture the shield of faith over your chest. The sword of the Spirit in your hand.", pause: 7 },
    { text: "When the pull comes today, you will not be empty-handed.", pause: 6 },
    { text: "Whisper it: I am not who I was. I am hidden in Christ.", pause: 6 },
    { text: "I belong to him. The pull will not own me today. Amen.", pause: 4 },
  ],

  'decision-wisdom': [
    { text: "Welcome. There is a decision waiting for you. We will not rush it.", pause: 5 },
    { text: "Settle into your seat. Take three slow breaths.", pause: 9 },
    { text: "If any of you lacks wisdom, let him ask of God, who gives generously to all without finding fault. And it will be given to him.", pause: 7 },
    { text: "Bring the decision to mind now. State it clearly in your head.", pause: 8 },
    { text: "Notice all the voices around it. Other people's expectations. Your own fears. The clock.", pause: 7 },
    { text: "Now let those voices fall silent. Just for these minutes.", pause: 8 },
    { text: "Trust in the Lord with all your heart, and lean not on your own understanding. In all your ways acknowledge him, and he will make your paths straight.", pause: 7 },
    { text: "Picture two paths. Both look reasonable. Do not choose yet. Just sit with each one.", pause: 9 },
    { text: "Notice your body. Where does peace settle? Where does anxiety rise?", pause: 9 },
    { text: "The Spirit often speaks through this quiet inner witness.", pause: 6 },
    { text: "Father, I do not need to know everything. I need to know the next right step.", pause: 7 },
    { text: "Lead me. I will follow.", pause: 7 },
    { text: "Trust that the answer is forming, even when you cannot see it yet.", pause: 7 },
    { text: "Walk forward in peace. Amen.", pause: 4 },
  ],

  // ─── SLEEP (4) ──────────────────────────────────────────────────────────

  'evening-winddown': [
    { text: "Welcome. The day is finished.", pause: 6 },
    { text: "Lie down or settle into a soft chair. Let your body relax.", pause: 7 },
    { text: "Take a slow breath. Long out-breath.", pause: 8 },
    { text: "Cast your mind back over the day. Just notice. No judging.", pause: 8 },
    { text: "What was good. What was hard. What surprised you.", pause: 9 },
    { text: "Whisper a quiet thank you for one small mercy.", pause: 8 },
    { text: "Now anything that did not go well — release it. Tomorrow has its own grace.", pause: 8 },
    { text: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.", pause: 8 },
    { text: "Soften your forehead. Let your eyes feel heavy.", pause: 9 },
    { text: "Soften your jaw. Let your shoulders sink.", pause: 9 },
    { text: "Soften your hands. Soften your stomach. Soften your legs.", pause: 9 },
    { text: "In peace I will both lie down and sleep. For you alone, O Lord, make me dwell in safety.", pause: 9 },
    { text: "The day is closed. You are kept.", pause: 9 },
    { text: "Rest now. Sleep gently. Amen.", pause: 8 },
  ],

  'deep-sleep': [
    { text: "Welcome. Lie still. Let the bed hold you completely.", pause: 8 },
    { text: "Take one slow, full breath. And let it out.", pause: 10 },
    { text: "Tonight we will slow everything. Body. Breath. Thought.", pause: 9 },
    { text: "Begin with your toes. Let them feel heavy.", pause: 10 },
    { text: "Your feet. Your ankles. Heavy and warm.", pause: 11 },
    { text: "Your calves. Your knees. Your thighs. Sinking into the mattress.", pause: 11 },
    { text: "Your hips. Your lower back. Releasing.", pause: 11 },
    { text: "Your stomach. Your chest. Rising and falling on its own.", pause: 11 },
    { text: "Your hands. Your arms. Resting open or curled, however they want.", pause: 10 },
    { text: "Your shoulders. Heavy. Your neck. Long. Your jaw. Soft.", pause: 11 },
    { text: "Your face. Your eyes. Your forehead. All quiet.", pause: 11 },
    { text: "He gives to his beloved sleep.", pause: 10 },
    { text: "You are safe. You are loved. You are held.", pause: 11 },
    { text: "Picture yourself resting in arms larger than your own.", pause: 12 },
    { text: "There is nothing more required of you tonight.", pause: 11 },
    { text: "Just sleep. Just sleep.", pause: 12 },
    { text: "He watches over you while you sleep. Amen.", pause: 10 },
  ],

  'sabbath-rest': [
    { text: "Welcome to rest.", pause: 6 },
    { text: "Settle into your chair or your bed. Let your hands fall open.", pause: 7 },
    { text: "Take a slow breath. There is nothing you need to do for the next ten minutes.", pause: 8 },
    { text: "Be still, and know that I am God.", pause: 8 },
    { text: "Today we practice ceasing. Not productivity. Not progress. Just being.", pause: 8 },
    { text: "Notice if your mind already wants to make this useful — to plan, to solve, to fix.", pause: 8 },
    { text: "Let those thoughts drift past like clouds.", pause: 9 },
    { text: "There remains, then, a Sabbath-rest for the people of God.", pause: 8 },
    { text: "Sabbath is not a reward for finishing your work. It is a gift before the work is done.", pause: 8 },
    { text: "Whatever is unfinished — let it stay unfinished for these minutes.", pause: 9 },
    { text: "The world will continue without you running it.", pause: 8 },
    { text: "God already finished what mattered most when he said — it is finished — at the cross.", pause: 8 },
    { text: "Inhale stillness. Exhale striving.", pause: 9 },
    { text: "Inhale enough. Exhale not enough.", pause: 9 },
    { text: "Rest is not laziness. Rest is faith — that the world holds together without your effort.", pause: 8 },
    { text: "Be still. Receive.", pause: 10 },
    { text: "Carry this stillness back into your week. Amen.", pause: 5 },
  ],

  'strength-exhaustion': [
    { text: "If you came here weary, you are welcome to bring all of it.", pause: 6 },
    { text: "Settle into your seat. Let your body be heavy. You do not have to perform.", pause: 7 },
    { text: "Take one slow breath. Let it out longer than you took it in.", pause: 8 },
    { text: "Come to me, all you who are weary and burdened, and I will give you rest.", pause: 7 },
    { text: "These are the words of Jesus. They are spoken to you.", pause: 6 },
    { text: "Notice the tiredness. Where does it live in your body?", pause: 7 },
    { text: "Your eyes. Your shoulders. Your spirit. Just notice.", pause: 7 },
    { text: "You are not weak for being tired. You are honest.", pause: 7 },
    { text: "He gives strength to the weary, and increases the power of the weak. Even youths grow tired and weary, but those who hope in the Lord will renew their strength.", pause: 8 },
    { text: "They will mount up with wings like eagles. They will run and not grow weary. They will walk and not faint.", pause: 8 },
    { text: "You do not have to mount up today. Today you can just walk.", pause: 7 },
    { text: "Picture being lifted. Held. Carried.", pause: 8 },
    { text: "Inhale slowly. Receive strength.", pause: 8 },
    { text: "Exhale fully. Release the striving.", pause: 8 },
    { text: "You will rise again. But for now, simply receive. Amen.", pause: 5 },
  ],

  // ─── MORNING (continued) — new-beginnings ────────────────────────────────

  'new-beginnings': [
    { text: "Welcome. A new beginning is in front of you.", pause: 5 },
    { text: "Settle into stillness. Take a slow breath.", pause: 6 },
    { text: "See now, I am doing a new thing! Now it springs up; do you not perceive it?", pause: 6 },
    { text: "Bring to mind the season you are stepping out of.", pause: 8 },
    { text: "Whatever it held — joy, hardship, growth — pause to thank God for it.", pause: 8 },
    { text: "Now picture yourself standing at the edge of a new field, the sun just rising.", pause: 8 },
    { text: "His mercies are new every morning. Great is your faithfulness.", pause: 7 },
    { text: "What does this new season ask of you? Listen.", pause: 9 },
    { text: "Open your hands. Receive what is coming.", pause: 8 },
    { text: "You do not need to know everything to take the first step.", pause: 7 },
    { text: "Father, lead me into what is ahead. Make me brave. Make me open.", pause: 7 },
    { text: "Carry this freshness into your day. Amen.", pause: 4 },
  ],
};

/**
 * Default fallback script — used only if a meditation id is missing from
 * MEDITATION_SCRIPTS above. Generic enough to be reasonable for any topic
 * but every catalog meditation should have a hand-crafted entry.
 */
export const DEFAULT_MEDITATION_SCRIPT = [
  { text: "Welcome. Find a comfortable position and gently close your eyes.", pause: 4 },
  { text: "Take a slow, deep breath in through your nose.", pause: 4 },
  { text: "And release it slowly through your mouth.", pause: 5 },
  { text: "Let your body begin to soften and relax.", pause: 5 },
  { text: "You are held. You are safe. You are loved.", pause: 6 },
  { text: "Take this time as a gift. Simply be present.", pause: 8 },
  { text: "Breathe in peace. And breathe out tension.", pause: 7 },
  { text: "Let every exhale carry away what you no longer need.", pause: 8 },
  { text: "Rest here for a moment. Simply breathe.", pause: 10 },
  { text: "As you prepare to return, carry this peace with you.", pause: 5 },
  { text: "Gently wiggle your fingers and toes.", pause: 4 },
  { text: "When you are ready, slowly open your eyes. Amen.", pause: 4 },
];

/** Look up the script for a meditation id, falling back to default. */
export function getMeditationScript(id) {
  return MEDITATION_SCRIPTS[id] || DEFAULT_MEDITATION_SCRIPT;
}
