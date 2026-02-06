import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import StudyNotes from './StudyNotes';
import ReflectionPrompt from './ReflectionPrompt';
import CompletionTracker from './CompletionTracker';

const studyGuideContentMap = {
  'psalms': {
    introduction: [
      "The Book of Psalms is a collection of 150 sacred songs and prayers that express the full range of human emotion in response to God. Known as the Psalter or the Songbook of Israel, Psalms has been the source of comfort, strength, and spiritual expression for believers throughout history.",
      "The Psalms were written over many centuries by various authors, with King David traditionally credited as the primary author, though many psalms are attributed to other musicians and temple poets. These prayers and praises served as worship material in the Temple and continue to be recited in synagogues and churches worldwide.",
      "The Psalms are organized into five books and cover themes including praise and thanksgiving, lament and sorrow, wisdom and instruction, historical reflection, and messianic hope. They reveal God's character while acknowledging human struggle, doubt, and the journey toward faith.",
      "The depth and honesty of the Psalms make them uniquely powerful. They don't shy away from expressing anger, fear, and confusion, making them incredibly relevant to modern believers who seek authentic spiritual expression."
    ],
    historicalContext: {
      timePeriod: "The Psalms were composed over a span of approximately 500 years, from roughly the 10th to the 5th century BCE, with some potentially dating to earlier traditions. Many reflect specific historical events during Israel's monarchy and exile.",
      authorship: "Traditionally attributed to King David, though modern scholarship recognizes multiple authors including Asaph, the sons of Korah, and other temple musicians. The diversity of authorship is reflected in the variety of themes and styles throughout the book.",
      geography: "The Psalms were composed primarily in Israel/Judea, with strong connections to Jerusalem and the Temple. References to Zion, the Holy City, and the sanctuary appear throughout.",
      transmission: "Originally composed as songs and prayers for worship, the Psalms were collected and organized into five books corresponding to the five books of the Torah. They were essential to Jewish and Christian worship from ancient times."
    },
    keyCharacters: [
      { name: 'King David', desc: 'Traditionally credited as the primary author, David\'s life experiences inform many psalms of lament, praise, and trust in God.' },
      { name: 'The Psalmist', desc: 'A representative figure expressing the full range of human emotion and spiritual experience before God.' },
      { name: 'God', desc: 'The central subject and recipient of all psalms, portrayed as creator, judge, redeemer, and shepherd.' },
      { name: 'Israel/The People', desc: 'The collective community whose prayers and experiences are voiced throughout the psalms.' },
      { name: 'The Enemies', desc: 'Symbolic figures representing spiritual opposition, inner turmoil, and external threats.' },
      { name: 'The Messiah', desc: 'Anticipated in messianic psalms, pointing forward to Christ\'s coming in Christian interpretation.' }
    ],
    keyEvents: [
      { event: 'Individual Prayers of Lament', desc: 'Psalms expressing personal suffering and the cry for God\'s deliverance.' },
      { event: 'Corporate Praise and Worship', desc: 'Community celebrations and corporate thanksgiving for God\'s mighty deeds.' },
      { event: 'Historical Recollection', desc: 'Reflection on God\'s faithfulness throughout Israel\'s history.' },
      { event: 'Royal Coronation Psalms', desc: 'Songs celebrating the king\'s coronation and God\'s covenant with David.' },
      { event: 'Exilic Longing', desc: 'Psalms composed during or reflecting the Babylonian exile, expressing homesickness and hope.' },
      { event: 'Messianic Anticipation', desc: 'Psalms pointing toward the coming Messiah and ultimate redemption.' },
      { event: 'Renewed Confidence', desc: 'Movement from lament to trust and rejoicing in God\'s protection.' }
    ],
    keyScriptures: [
      { verse: 'Psalm 23:1', text: '"The Lord is my shepherd; I shall not want."', insight: 'One of the most beloved psalms, expressing complete trust in God\'s care and guidance.' },
      { verse: 'Psalm 42:5', text: '"Why, my soul, are you downcast? Why so disturbed within me?"', insight: 'Captures the struggle of faith, moving from despair to renewed hope.' },
      { verse: 'Psalm 150:1-2', text: '"Praise the Lord... Praise him for his mighty deeds."', insight: 'The climactic call to praise God with instruments and celebration.' }
    ],
    keyLocations: [
      { location: 'The Temple', desc: 'The central place of worship where Psalms were sung and used in liturgy.' },
      { location: 'Zion', desc: 'Poetic reference to Jerusalem and God\'s dwelling place, symbolizing spiritual hope.' },
      { location: 'The Sanctuary', desc: 'The holy place where believers refuge and encounter God.' },
      { location: 'Wilderness', desc: 'Symbolic location representing trials, refuge, and testing in the spiritual journey.' },
      { location: 'The Nations', desc: 'Referenced as places and peoples where God\'s dominion extends.' }
    ],
    keyLessons: [
      { title: 'Authentic Expression', desc: 'The Psalms teach that honest, emotional prayer is acceptable and even encouraged before God.' },
      { title: 'God\'s Faithfulness', desc: 'Repeatedly demonstrates that God is trustworthy even when circumstances suggest otherwise.' },
      { title: 'Progression of Faith', desc: 'Shows the journey from lament and doubt to renewed confidence and praise.' },
      { title: 'Community Worship', desc: 'Emphasizes the importance of corporate prayer and praise alongside personal devotion.' },
      { title: 'God\'s Sovereignty', desc: 'Affirms God\'s ultimate control and care despite human struggles and suffering.' },
      { title: 'Messianic Hope', desc: 'Points forward to Christ as the ultimate fulfillment of God\'s redemptive plan.' }
    ]
  },
  'matthew': {
    introduction: [
      "Matthew's Gospel presents the life, teachings, and resurrection of Jesus Christ, emphasizing His role as the promised Messiah of Israel. Written for a Jewish audience, Matthew carefully connects Jesus to Old Testament prophecies and the lineage of King David.",
      "The Gospel is structured around five major teachings of Jesus (the Sermon on the Mount, parables of the kingdom, commissioning of disciples, temple teachings, and apocalyptic discourse), interspersed with narrative accounts of His miracles and interactions.",
      "Matthew portrays Jesus as the Messiah King who establishes a new kingdom based on righteousness, compassion, and spiritual transformation. The gospel emphasizes the fulfillment of Old Testament prophecies in Jesus's life, death, and resurrection.",
      "With its organized structure and emphasis on teaching, Matthew's Gospel has been influential in Christian education and discipleship, providing comprehensive instruction for believers seeking to understand Jesus's message and mission."
    ],
    historicalContext: {
      timePeriod: "Written approximately 60-90 CE, after the fall of Jerusalem in 70 CE, Matthew addresses a primarily Jewish-Christian community experiencing transition and conflict with Jewish authorities.",
      authorship: "Traditionally attributed to Matthew (Levi), one of Jesus's twelve disciples and a former tax collector. Modern scholarship suggests an unknown Jewish-Christian author drawing on Mark's Gospel and other sources.",
      geography: "The Gospel follows Jesus's ministry primarily in Galilee and Judea, with significant focus on Jerusalem and the temple. It reflects knowledge of Palestinian geography and Jewish customs.",
      transmission: "Matthew was widely used in early churches for teaching and worship, becoming one of the four canonical gospels and extensively cited in early Christian writings."
    },
    keyCharacters: [
      { name: 'Jesus Christ', desc: 'The central figure, portrayed as the Messiah King and Son of God who teaches with authority and performs miracles.' },
      { name: 'The Twelve Apostles', desc: 'Jesus\'s chosen disciples, including Peter, James, John, and Judas, who witness His teachings and miracles.' },
      { name: 'John the Baptist', desc: 'The forerunner of Jesus who prepares the way and baptizes Jesus at the beginning of His ministry.' },
      { name: 'Mary', desc: 'Jesus\'s mother, emphasizing the miraculous virginal conception and Jesus\'s legal connection to King David.' },
      { name: 'The Pharisees and Sadducees', desc: 'Jewish religious leaders who often oppose Jesus and are critiqued for their hypocrisy.' },
      { name: 'Pontius Pilate', desc: 'The Roman governor who reluctantly orders Jesus\'s crucifixion.' }
    ],
    keyEvents: [
      { event: 'The Genealogy and Birth', desc: 'Jesus\'s lineage traced through David and Abraham, emphasizing His role as the promised Messiah.' },
      { event: 'The Sermon on the Mount', desc: 'Jesus\'s foundational teaching on righteousness, character, and kingdom values.' },
      { event: 'Miracles and Healings', desc: 'Demonstrations of Jesus\'s divine authority over nature, illness, and demons.' },
      { event: 'The Transfiguration', desc: 'Jesus revealed in glory with Moses and Elijah, confirming His divine nature.' },
      { event: 'The Cleansing of the Temple', desc: 'Jesus\'s prophetic action condemning commercialism in worship.' },
      { event: 'The Last Supper', desc: 'Jesus\'s final meal with disciples, instituting communion/Eucharist.' },
      { event: 'The Crucifixion and Resurrection', desc: 'Jesus\'s death and resurrection, the climax of salvation history.' }
    ],
    keyScriptures: [
      { verse: 'Matthew 5:3-12', text: '"Blessed are the poor in spirit...the pure in heart..."', insight: 'The Beatitudes establish the character and values of kingdom citizens.' },
      { verse: 'Matthew 16:18', text: '"You are Peter, and on this rock I will build my church."', insight: 'Jesus establishes His church and gives Peter a foundational role.' },
      { verse: 'Matthew 28:19-20', text: '"Go and make disciples of all nations...I am with you always."', insight: 'The Great Commission defines the church\'s ongoing mission and Jesus\'s continued presence.' }
    ],
    keyLocations: [
      { location: 'Bethlehem', desc: 'Jesus\'s birthplace, fulfilling prophecy about the Messiah.' },
      { location: 'Galilee', desc: 'The primary setting for Jesus\'s ministry and teaching.' },
      { location: 'The Mount of Olives', desc: 'Site of significant teachings including the Olivet Discourse.' },
      { location: 'Jerusalem/The Temple', desc: 'The spiritual and political center where Jesus faces opposition and is crucified.' },
      { location: 'Golgotha', desc: 'The place of crucifixion where Jesus dies for the sins of the world.' }
    ],
    keyLessons: [
      { title: 'Messianic Fulfillment', desc: 'Jesus is the Messiah promised in Old Testament prophecy, fulfilling the expectations of Israel.' },
      { title: 'Ethical Living', desc: 'The Sermon on the Mount provides comprehensive teaching on righteous living that exceeds mere outward compliance.' },
      { title: 'Kingdom of Heaven', desc: 'Jesus establishes a spiritual kingdom characterized by justice, mercy, and transformation.' },
      { title: 'Faith and Authority', desc: 'Jesus demonstrates divine authority and calls believers to trust completely in Him.' },
      { title: 'Discipleship', desc: 'Following Jesus involves self-denial, taking up one\'s cross, and serving others.' },
      { title: 'Salvation Through Christ', desc: 'Jesus\'s death and resurrection provide redemption and forgiveness for all who believe.' }
    ]
  },
  'proverbs': {
    introduction: [
      "The Book of Proverbs is a collection of wisdom sayings, observations, and instructions designed to guide readers toward righteous living and practical success. Traditionally attributed to King Solomon, known for his wisdom, Proverbs addresses universal human concerns: relationships, work, finances, speech, and character.",
      "Rather than narrative or theology, Proverbs offers concise, memorable statements that contrast wisdom with folly, righteousness with wickedness, and the wise with the foolish. Its aphoristic style makes it timeless and applicable across cultures and generations.",
      "The book is organized thematically and by author, with distinct sections addressing topics like family relationships, business dealings, government, friendship, and the fear of God. Its practical focus makes it invaluable for personal development and decision-making.",
      "Proverbs emphasizes that wisdom begins with the fear of the Lord—a healthy respect and reverence for God. This foundation transforms individual choices and leads to flourishing life characterized by virtue, success, and peace."
    ],
    historicalContext: {
      timePeriod: "Proverbs likely developed over several centuries, with collections attributed to Solomon (10th century BCE) as well as later additions from the period of 500-200 BCE, reflecting various periods of Israel's history.",
      authorship: "Traditionally attributed to King Solomon, though modern scholarship recognizes multiple authors and editors. Various sections are attributed to sages and wise men from different periods.",
      geography: "Composed in ancient Israel, Proverbs reflects the social structures, economics, and relationships of the ancient Near East, with references to royal courts, agriculture, and commerce.",
      transmission: "The Proverbs were preserved and transmitted as wisdom literature valued in Jewish education. They appear frequently in New Testament teachings and continue to shape moral and practical instruction."
    },
    keyCharacters: [
      { name: 'King Solomon', desc: 'Traditionally credited as the primary author, representing wisdom and righteous leadership.' },
      { name: 'The Wise', desc: 'Representative figures who listen to instruction, fear God, and live righteously.' },
      { name: 'The Fool', desc: 'The counterpart to the wise, representing foolishness, pride, and rejection of guidance.' },
      { name: 'Lady Wisdom', desc: 'A personified figure calling to righteousness and understanding throughout the book.' },
      { name: 'The Adulteress/Seductress', desc: 'A symbolic figure representing temptation and the dangers of lustful desire.' },
      { name: 'The Parent and Child', desc: 'Representing the relationship of instruction and discipline essential to growth.' }
    ],
    keyEvents: [
      { event: 'Proverbs on Family Life', desc: 'Guidance for parents, children, spouses, and household relationships.' },
      { event: 'Proverbs on Work and Commerce', desc: 'Practical wisdom for employment, business, honest dealing, and financial prudence.' },
      { event: 'Proverbs on Speech', desc: 'Instructions on the power of words, truthfulness, gossip, and encouragement.' },
      { event: 'Proverbs on Moral Character', desc: 'Contrasts between virtue and vice, pride and humility, courage and cowardice.' },
      { event: 'Proverbs on Rulers and Government', desc: 'Advice for kings and leaders regarding justice, mercy, and righteous rule.' },
      { event: 'The Call of Wisdom', desc: 'Lady Wisdom\'s invitation to pursue understanding and righteousness.' }
    ],
    keyScriptures: [
      { verse: 'Proverbs 1:7', text: '"The fear of the Lord is the beginning of knowledge."', insight: 'Establishes that reverence for God is the foundation of all true wisdom.' },
      { verse: 'Proverbs 3:5-6', text: '"Trust in the Lord with all your heart...and He will direct your paths."', insight: 'Emphasizes submission to God\'s wisdom over human understanding.' },
      { verse: 'Proverbs 22:6', text: '"Train up a child in the way they should go."', insight: 'Highlights the importance of early instruction and parental guidance.' }
    ],
    keyLocations: [
      { location: 'The Royal Court', desc: 'Setting for wisdom about leadership and kingship.' },
      { location: 'The Marketplace', desc: 'Context for business dealings and commercial ethics.' },
      { location: 'The Home', desc: 'Central location for family relationships and domestic instruction.' },
      { location: 'The Street/City Gates', desc: 'Public spaces where wisdom calls out to the foolish and undiscerning.' },
      { location: 'The Temple', desc: 'Spiritual center where fear of God and worship are emphasized.' }
    ],
    keyLessons: [
      { title: 'Fear of God as Foundation', desc: 'True wisdom begins with reverence for God and submission to His authority.' },
      { title: 'Practical Righteousness', desc: 'Wisdom is demonstrated through ethical behavior, honest dealings, and moral choices.' },
      { title: 'Speech and Character', desc: 'Words reveal character; wise speech brings life; foolish speech brings harm.' },
      { title: 'Work and Diligence', desc: 'Diligent work is valued and blessed; laziness leads to poverty and shame.' },
      { title: 'Relationships and Community', desc: 'Healthy relationships require honesty, kindness, humility, and mutual respect.' },
      { title: 'Consequences and Choices', desc: 'Choices have consequences; wisdom leads to flourishing; foolishness leads to destruction.' }
    ]
  },
  'romans': {
    introduction: [
      "Paul's Letter to the Romans is considered one of the most important epistles in the New Testament, presenting a comprehensive exposition of the gospel of Jesus Christ and its implications for both Jews and Gentiles.",
      "Written approximately 55-57 CE, Romans systematically explains how salvation comes through faith in Christ, how God's grace justifies sinners, and how the gospel fulfills God's ancient promises to Israel.",
      "The letter addresses critical theological questions: How are people made right with God? What is the relationship between law and grace? How do Jews and Gentiles relate in God's plan? Romans provides foundational answers that have shaped Christian theology for nearly 2000 years.",
      "Paul's argument progresses from humanity's sinfulness and need for redemption, through justification by faith, to sanctification and transformation by the Holy Spirit. The letter concludes with practical instructions for living out the gospel in daily relationships."
    ],
    historicalContext: {
      timePeriod: "Written around 55-57 CE from Corinth, addressed to the church at Rome which Paul had not yet visited. The letter precedes Paul's journey to Jerusalem and Rome.",
      authorship: "Written by the Apostle Paul to a church he did not plant, demonstrating his missionary vision and theological maturity.",
      geography: "Addressed to believers in Rome, the capital of the empire. Paul writes as someone planning to visit and minister there.",
      transmission: "Romans was preserved and transmitted as one of Paul's most influential letters, extensively quoted in early Christian writings and foundational to Protestant theology."
    },
    keyCharacters: [
      { name: 'Paul', desc: 'The apostle and author, presenting himself as apostle to the Gentiles.' },
      { name: 'Jesus Christ', desc: 'The central subject, portrayed as Savior and Lord whose death and resurrection save believers.' },
      { name: 'The Roman Church', desc: 'Diverse believers (both Jews and Gentiles) to whom Paul addresses his theology.' },
      { name: 'Adam', desc: 'Representative of humanity\'s sinfulness and the consequences of the fall.' },
      { name: 'The Law', desc: 'Portrayed as both holy and ineffective without faith, serving pedagogical purposes.' },
      { name: 'The Holy Spirit', desc: 'Active agent of transformation, intercession, and assurance for believers.' }
    ],
    keyEvents: [
      { event: 'Exposition of Sin', desc: 'Demonstration that all humans (Jews and Gentiles) are sinful and need salvation.' },
      { event: 'Justification by Faith', desc: 'Explanation of how believers are declared righteous through faith in Christ.' },
      { event: 'Death and Life in Christ', desc: 'Union with Christ in His death and resurrection provides liberation from sin.' },
      { event: 'The Role of the Law', desc: 'Clarification of the law\'s purpose and its relationship to grace and faith.' },
      { event: 'Transformation by the Spirit', desc: 'The Holy Spirit\'s work in sanctification and progressive transformation.' },
      { event: 'God\'s Plan for Israel', desc: 'Explanation of Israel\'s past rejection and future restoration in God\'s purposes.' },
      { event: 'Practical Living', desc: 'Guidance for living righteously as response to God\'s grace.' }
    ],
    keyScriptures: [
      { verse: 'Romans 3:23', text: '"All have sinned and fall short of the glory of God."', insight: 'Establishes universal sinfulness and the need for redemption.' },
      { verse: 'Romans 5:8', text: '"Christ died for us while we were still sinners."', insight: 'Demonstrates God\'s love and Christ\'s sacrificial work.' },
      { verse: 'Romans 8:37-39', text: '"In all these things we are more than conquerors...nothing can separate us from God\'s love."', insight: 'Assures believers of eternal security and God\'s unfailing love.' }
    ],
    keyLocations: [
      { location: 'Rome', desc: 'The capital city and destination of the letter, representing pagan civilization.' },
      { location: 'Jerusalem', desc: 'Center of Jewish religion and the site of Christ\'s crucifixion.' },
      { location: 'The Cross', desc: 'The place of Christ\'s redemptive work for humanity.' },
      { location: 'The Heart/Inner Self', desc: 'The spiritual location where faith operates and transformation occurs.' },
      { location: 'The Church', desc: 'The community of believers where unity and love should characterize relationships.' }
    ],
    keyLessons: [
      { title: 'Universal Sinfulness', desc: 'All humans, both Gentiles and Jews, are sinful and stand under God\'s judgment.' },
      { title: 'Salvation by Faith', desc: 'Right standing with God comes through faith in Christ\'s atoning work, not human effort.' },
      { title: 'Grace and the Law', desc: 'God\'s grace supersedes the law; the law reveals sin but cannot save.' },
      { title: 'Union with Christ', desc: 'Believers are united with Christ in His death and resurrection, experiencing liberation.' },
      { title: 'Sanctification', desc: 'The Holy Spirit progressively transforms believers into the image of Christ.' },
      { title: 'God\'s Faithfulness', desc: 'Despite human failure, God\'s plan for both Jews and Gentiles will ultimately succeed.' }
    ]
  },
  'john': {
    introduction: [
      "John's Gospel stands apart from the other three gospels, presenting a uniquely theological account of Jesus's life that emphasizes His divine identity and the meaning of believing in Him.",
      "Rather than tracing Jesus's genealogy or recounting extensive teachings, John focuses on seven dramatic 'signs' (miracles) that reveal Jesus's identity and power, interspersed with profound theological discourse.",
      "Written for both Jews and Greek-speaking gentiles, John's Gospel invites readers to believe that Jesus is the Christ, the Son of God, and that through believing they might have life in His name.",
      "The Gospel's philosophical language ('Word,' 'light,' 'truth,' 'glory') and emphasis on spiritual rebirth and the person of Jesus make it distinctly contemplative, inviting deeper meditation on Jesus's identity and significance."
    ],
    historicalContext: {
      timePeriod: "Written approximately 90-110 CE, one of the latest gospels, after the destruction of the temple and during increasing Jewish-Christian separation.",
      authorship: "Traditionally attributed to the Apostle John, son of Zebedee, though modern scholarship suggests authorship by a Johannine community reflective of John's teaching.",
      geography: "The Gospel reflects knowledge of Palestinian geography and Jewish customs while being written for a broader audience. Settings include Galilee, Samaria, and Jerusalem.",
      transmission: "John was widely used in early churches and became particularly influential in Christian theology. Its prologue shaped early Christological concepts."
    },
    keyCharacters: [
      { name: 'Jesus Christ', desc: 'Presented as the Word made flesh, Son of God, and giver of life.' },
      { name: 'John the Baptist', desc: 'Witness to Jesus, contrasting light and darkness.' },
      { name: 'The Disciples', desc: 'Learners who gradually come to understand Jesus\'s true identity through encounter and teaching.' },
      { name: 'Mary (Jesus\'s mother)', desc: 'Represents believers who follow Jesus throughout His ministry.' },
      { name: 'Thomas', desc: 'Represents doubt transformed into faith through encounter with the risen Jesus.' },
      { name: 'The Beloved Disciple', desc: 'Idealized disciple embodying faith and intimate relationship with Jesus.' }
    ],
    keyEvents: [
      { event: 'The Prologue: The Word Incarnate', desc: 'Jesus revealed as eternal Word who became flesh.' },
      { event: 'Signs of Jesus\'s Divinity', desc: 'Seven miracles revealing Jesus\'s identity and power (water to wine, healing, raising Lazarus, etc.).' },
      { event: 'The Bread of Life Discourse', desc: 'Jesus\'s teaching on faith and sustenance through belief in Him.' },
      { event: 'The Woman at the Well', desc: 'Jesus\'s encounter with a Samaritan woman, revealing His mission to all people.' },
      { event: 'The Healing on the Sabbath', desc: 'Jesus\'s authority over religious law and compassion for the afflicted.' },
      { event: 'Jesus Washes Disciples\' Feet', desc: 'Demonstration of humble service as the model for following Jesus.' },
      { event: 'The Crucifixion and Resurrection', desc: 'Jesus\'s glorification through death and resurrection.' }
    ],
    keyScriptures: [
      { verse: 'John 1:1-3', text: '"In the beginning was the Word, and the Word was with God, and the Word was God."', insight: 'Establishes Jesus\'s eternal divine nature and role in creation.' },
      { verse: 'John 3:16', text: '"For God so loved the world that He gave His only Son..."', insight: 'The gospel message summarized: God\'s love expressed through Christ\'s sacrifice.' },
      { verse: 'John 14:6', text: '"I am the way, the truth, and the life."', insight: 'Jesus\'s exclusive claim as the only path to God and eternal life.' }
    ],
    keyLocations: [
      { location: 'Bethlehem/Jerusalem', desc: 'Jesus\'s origin and primary ministry location.' },
      { location: 'Galilee', desc: 'Setting for early signs and teachings.' },
      { location: 'Samaria', desc: 'Location of the well encounter, signifying Jesus\'s inclusion of outsiders.' },
      { location: 'The Temple', desc: 'Site of confrontation and spiritual teachings about true worship.' },
      { location: 'Gethsemane/Golgotha', desc: 'Locations of Jesus\'s passion and redemptive work.' }
    ],
    keyLessons: [
      { title: 'Jesus as Divine', desc: 'John emphasizes Jesus\'s eternal divinity and equality with God.' },
      { title: 'Belief as Central', desc: 'Saving faith is not mere intellectual agreement but personal trust and commitment to Jesus.' },
      { title: 'Spiritual Rebirth', desc: 'Becoming a disciple requires spiritual transformation from above.' },
      { title: 'Jesus as Life-Giver', desc: 'Jesus provides both physical and spiritual life to all who believe.' },
      { title: 'Love as Central Value', desc: 'Jesus\'s ultimate commandment is that disciples love one another and the world.' },
      { title: 'Abiding in Jesus', desc: 'The metaphor of the vine and branches emphasizes ongoing relationship and dependence on Jesus.' }
    ]
    },
    'exodus': {
    introduction: [
     "The Book of Exodus recounts the dramatic deliverance of the Israelites from Egyptian slavery under the leadership of Moses. This foundational narrative describes God's powerful intervention, miraculous signs, and the establishment of the Law at Mount Sinai.",
     "Exodus shows God's compassion for His oppressed people and His willingness to act decisively on their behalf. The plagues, the parting of the Red Sea, and the pillar of cloud and fire demonstrate God's supremacy over Egypt and nature itself.",
     "The book establishes key themes: redemption, covenant, law, and God's faithfulness. The giving of the Ten Commandments and the construction of the Tabernacle represent humanity's response to God's salvation.",
     "Exodus transforms a band of slaves into a nation covenanted to God, setting the pattern for God's relationship with His people throughout Scripture."
    ],
    historicalContext: {
     timePeriod: "Likely 13th century BCE, during Egypt's New Kingdom period. The exodus may have occurred during the reign of Ramesses II.",
     authorship: "Traditionally attributed to Moses, though modern scholars recognize complex literary sources combined into a unified narrative.",
     geography: "Begins in Egypt, follows the journey through the Sinai Peninsula, and ends at the edge of Canaan.",
     transmission: "Central narrative for Jewish identity and religious practice, retold annually at Passover."
    },
    keyCharacters: [
     { name: 'Moses', desc: 'The leader chosen by God to deliver Israel from slavery and receive the Law.' },
     { name: 'Pharaoh', desc: 'The Egyptian ruler who enslaves Israel and resists God\'s demands.' },
     { name: 'Aaron', desc: 'Moses\'s brother and spokesperson, later becoming the first high priest.' },
     { name: 'God', desc: 'The liberator who hears Israel\'s cry and displays power through miracles.' },
     { name: 'The Israelites', desc: 'God\'s chosen people, transformed from slaves into a covenant nation.' },
     { name: 'Miriam', desc: 'Moses\'s sister who leads the women in celebration and worship.' }
    ],
    keyEvents: [
     { event: 'Israel\'s Enslavement', desc: 'The Israelites become enslaved to Pharaoh for hundreds of years.' },
     { event: 'Moses\'s Call at the Burning Bush', desc: 'God calls Moses to lead Israel out of Egypt.' },
     { event: 'The Ten Plagues', desc: 'God sends devastating plagues to convince Pharaoh to free Israel.' },
     { event: 'The Passover', desc: 'God spares the firstborn of Israel while judgment falls on Egypt.' },
     { event: 'Crossing the Red Sea', desc: 'God miraculously divides the sea, allowing Israel to escape.' },
     { event: 'The Law at Mount Sinai', desc: 'God gives the Ten Commandments and covenant stipulations.' },
     { event: 'The Golden Calf', desc: 'Israel\'s rebellion while Moses is on the mountain.' }
    ],
    keyScriptures: [
     { verse: 'Exodus 3:14', text: '"I AM WHO I AM."', insight: 'God reveals His eternal, self-sufficient nature to Moses.' },
     { verse: 'Exodus 12:13', text: '"The blood will be a sign for you...when I see the blood, I will pass over you."', insight: 'Institution of Passover, foreshadowing Christ\'s redemptive work.' },
     { verse: 'Exodus 20:3-4', text: '"You shall have no other gods before Me."', insight: 'First commandment establishing exclusive worship of God.' }
    ],
    keyLocations: [
     { location: 'Egypt', desc: 'Land of slavery and oppression.' },
     { location: 'The Red Sea', desc: 'Site of God\'s miraculous deliverance.' },
     { location: 'Mount Sinai', desc: 'Where God reveals the Law to Moses.' },
     { location: 'The Wilderness', desc: 'Journey toward the Promised Land.' },
     { location: 'The Tabernacle', desc: 'Portable place of God\'s presence among Israel.' }
    ],
    keyLessons: [
     { title: 'God\'s Redemptive Power', desc: 'God is willing and able to save His people from impossible situations.' },
     { title: 'Obedience and Covenant', desc: 'Relationship with God is established through obedience to His commands.' },
     { title: 'God\'s Faithfulness', desc: 'God remembers His promises and fulfills them despite obstacles.' },
     { title: 'The Importance of Law', desc: 'God\'s laws reflect His character and guide His people toward righteousness.' },
     { title: 'Judgment and Mercy', desc: 'God judges sin but also shows mercy to those who trust Him.' },
     { title: 'God\'s Presence', desc: 'God dwells among His people through the Tabernacle, promising continued presence.' }
    ]
    },
    'leviticus': {
    introduction: [
     "Leviticus provides detailed instructions for worship, sacrifices, and holy living for the Israelites. Addressed primarily to the Levitical priests, it establishes the cultic and moral requirements for maintaining God's covenant.",
     "Rather than narrative, Leviticus consists of laws governing sacrifice, priesthood, ritual purity, and ethical conduct. These instructions demonstrate how God's holy nature requires His people to be holy.",
     "The book establishes the Day of Atonement and other festivals that became central to Jewish practice. It reveals that sin has serious consequences but can be addressed through proper sacrifice and atonement.",
     "While many practices are no longer observed in Christian practice, Leviticus reveals God's holiness and the seriousness of sin, ultimately pointing to Christ as the final and perfect sacrifice."
    ],
    historicalContext: {
     timePeriod: "Addressed to Israel at Mount Sinai following the giving of the Ten Commandments.",
     authorship: "Traditionally attributed to Moses; represents laws compiled for the Levitical priesthood.",
     geography: "Set at Mount Sinai; establishes regulations for worship in the tabernacle.",
     transmission: "Central to Jewish priestly practice for over 2000 years."
    },
    keyCharacters: [
     { name: 'Aaron', desc: 'The high priest and head of the priestly order.' },
     { name: 'The Priests', desc: 'The Levites designated to minister in the tabernacle.' },
     { name: 'God', desc: 'The holy God whose presence requires ritual purity.' },
     { name: 'Israel', desc: 'The covenant community required to maintain holiness.' }
    ],
    keyEvents: [
     { event: 'Ordination of Aaron and His Sons', desc: 'Aaron is established as high priest and his sons as priests.' },
     { event: 'Nadab and Abihu\'s Death', desc: 'Two sons of Aaron die for offering unauthorized fire.' },
     { event: 'Rules for Cleanness and Uncleanness', desc: 'Instructions for maintaining ritual purity.' },
     { event: 'The Day of Atonement', desc: 'Annual occasion for Israel\'s corporate atonement.' },
     { event: 'The Feasts', desc: 'Instructions for Passover, Weeks, and Tabernacles.' },
     { event: 'Blessings and Curses', desc: 'Consequences for obedience and disobedience.' }
    ],
    keyScriptures: [
     { verse: 'Leviticus 19:2', text: '"Be holy, because I, the Lord your God, am holy."', insight: 'God\'s holiness requires His people to pursue holiness.' },
     { verse: 'Leviticus 17:11', text: '"The life of the creature is in the blood...it makes atonement."', insight: 'Blood sacrifice atones for sin; foreshadows Christ.' },
     { verse: 'Leviticus 23:4-8', text: '"These are the Lord\'s appointed festivals..."', insight: 'Establishes the religious calendar for Israel.' }
    ],
    keyLocations: [
     { location: 'Mount Sinai', desc: 'Where God gives these laws to Moses.' },
     { location: 'The Tabernacle', desc: 'Central place of worship and sacrifice.' },
     { location: 'The Holy of Holies', desc: 'The innermost sanctuary entered only on Yom Kippur.' },
     { location: 'The Camp of Israel', desc: 'Where the people live under God\'s laws.' }
    ],
    keyLessons: [
     { title: 'God\'s Holiness', desc: 'God\'s nature is fundamentally holy and separate from sin.' },
     { title: 'The Seriousness of Sin', desc: 'Sin requires atonement through sacrifice; it cannot be ignored.' },
     { title: 'The Way to Atonement', desc: 'God provides specific means for addressing sin and restoring relationship.' },
     { title: 'Ethical Holiness', desc: 'True holiness involves not just ritual purity but ethical behavior.' },
     { title: 'The Priesthood\'s Role', desc: 'Priests serve as mediators between God and the people.' },
     { title: 'Foreshadowing Christ', desc: 'The sacrificial system points to Christ as the ultimate sacrifice.' }
    ]
    },
    'numbers': {
      introduction: [
        "Numbers chronicles Israel's wilderness journey from Sinai to the edge of the Promised Land, spanning approximately 40 years. The book derives its name from the two censuses conducted at the beginning and end of the journey.",
        "This book demonstrates God's faithfulness despite Israel's repeated rebellion and complaining. It shows the consequences of unbelief—an entire generation perishes in the wilderness due to their refusal to trust God.",
        "Numbers contains both narrative and law, including guidelines for offerings, the Nazirite vow, and priestly blessings. The wilderness wandering becomes a powerful metaphor for spiritual testing and dependence on God.",
        "Despite Israel's failures, God remains committed to His covenant promises, providing manna, water, and guidance throughout their journey toward Canaan."
      ],
      historicalContext: {
        timePeriod: "Covers the wilderness period between the exodus from Egypt and arrival at Canaan, approximately 40 years in the 13th century BCE.",
        authorship: "Traditionally attributed to Moses, compiled from various sources documenting Israel's wilderness experience.",
        geography: "Traces Israel's journey through the Sinai wilderness, including Kadesh-barnea and the plains of Moab.",
        transmission: "Preserved as part of the Torah, central to understanding Israel's identity and God's faithfulness despite human failure."
      },
      keyCharacters: [
        { name: 'Moses', desc: 'The leader who intercedes for Israel despite their constant rebellion.' },
        { name: 'Aaron', desc: 'The high priest whose authority is challenged but affirmed by God.' },
        { name: 'Miriam', desc: 'Moses\'s sister who challenges his authority and faces consequences.' },
        { name: 'Caleb and Joshua', desc: 'The faithful spies who trust God\'s promise despite overwhelming odds.' },
        { name: 'Korah', desc: 'Rebel leader who challenges Moses\'s authority and faces divine judgment.' },
        { name: 'Balaam', desc: 'Foreign prophet hired to curse Israel but compelled by God to bless them.' }
      ],
      keyEvents: [
        { event: 'The First Census', desc: 'Numbering the fighting men of Israel before entering Canaan.' },
        { event: 'The Spies\' Report', desc: 'Twelve spies explore Canaan; ten bring a fearful report, two trust God.' },
        { event: 'Israel\'s Rebellion', desc: 'The people refuse to enter Canaan, resulting in 40 years of wandering.' },
        { event: 'Korah\'s Rebellion', desc: 'Challenge to Moses\'s leadership results in divine judgment.' },
        { event: 'Water from the Rock', desc: 'Moses strikes the rock in anger, disqualifying him from entering Canaan.' },
        { event: 'The Bronze Serpent', desc: 'God provides healing through faith when serpents plague the camp.' },
        { event: 'Balaam\'s Oracles', desc: 'Foreign prophet blesses Israel despite being hired to curse them.' }
      ],
      keyScriptures: [
        { verse: 'Numbers 6:24-26', text: '"The Lord bless you and keep you...make His face shine upon you."', insight: 'The Aaronic blessing, still used in worship today.' },
        { verse: 'Numbers 14:18', text: '"The Lord is slow to anger and abounding in steadfast love."', insight: 'God\'s character revealed in mercy despite repeated rebellion.' },
        { verse: 'Numbers 23:19', text: '"God is not a man, that He should lie."', insight: 'God\'s faithfulness and reliability contrasted with human weakness.' }
      ],
      keyLocations: [
        { location: 'Mount Sinai', desc: 'Starting point of the wilderness journey.' },
        { location: 'Kadesh-barnea', desc: 'Where Israel refuses to enter Canaan.' },
        { location: 'The Wilderness', desc: 'Place of testing, provision, and wandering for 40 years.' },
        { location: 'Plains of Moab', desc: 'Final encampment before entering the Promised Land.' },
        { location: 'Canaan', desc: 'The Promised Land visible but unreachable for the rebellious generation.' }
      ],
      keyLessons: [
        { title: 'Consequences of Unbelief', desc: 'Lack of faith in God\'s promises results in lost opportunities and discipline.' },
        { title: 'God\'s Faithfulness', desc: 'Despite Israel\'s repeated failures, God remains committed to His covenant.' },
        { title: 'Leadership and Authority', desc: 'God establishes and defends legitimate authority for the good of His people.' },
        { title: 'Wilderness as Testing', desc: 'Trials reveal true faith and dependence on God.' },
        { title: 'God\'s Provision', desc: 'God provides for physical and spiritual needs even in barren places.' },
        { title: 'Hope for the Future', desc: 'A new generation inherits the promise, demonstrating God\'s ongoing plan.' }
      ]
    },
    'deuteronomy': {
      introduction: [
        "Deuteronomy, meaning 'second law,' consists of Moses's final speeches to Israel before they enter the Promised Land. It's a renewal of the covenant for the new generation born in the wilderness.",
        "The book reviews Israel's history, restates God's laws, and calls the people to wholehearted devotion to God. Moses emphasizes that obedience brings blessing while disobedience brings curse.",
        "Deuteronomy is structured as a covenant renewal ceremony, similar to ancient Near Eastern treaties. It establishes the foundation for Israel's life in Canaan and their relationship with God.",
        "Jesus frequently quoted Deuteronomy, showing its importance in understanding God's requirements and humanity's proper response to His grace."
      ],
      historicalContext: {
        timePeriod: "Set at the end of the 40-year wilderness wandering, just before Israel enters Canaan under Joshua's leadership.",
        authorship: "Traditionally attributed to Moses, though the final chapter (describing his death) was added by another author.",
        geography: "Delivered on the plains of Moab, east of the Jordan River, within sight of the Promised Land.",
        transmission: "Central to Jewish faith and practice, quoted extensively in the New Testament and foundational to covenant theology."
      },
      keyCharacters: [
        { name: 'Moses', desc: 'The aging leader delivering his final instructions and blessings to Israel.' },
        { name: 'Joshua', desc: 'Moses\'s successor, commissioned to lead Israel into Canaan.' },
        { name: 'God', desc: 'The covenant-keeping God who demands exclusive loyalty and obedience.' },
        { name: 'Israel (New Generation)', desc: 'The people poised to inherit the Promised Land.' }
      ],
      keyEvents: [
        { event: 'Review of Wilderness Journey', desc: 'Moses recounts God\'s faithfulness and Israel\'s failures.' },
        { event: 'Restatement of the Law', desc: 'The Ten Commandments and covenant stipulations are repeated.' },
        { event: 'Call to Love God', desc: 'The Shema commands Israel to love God wholeheartedly.' },
        { event: 'Warnings Against Idolatry', desc: 'Strict commands to avoid the pagan practices of Canaan.' },
        { event: 'Blessings and Curses', desc: 'Consequences for obedience and disobedience spelled out.' },
        { event: 'Moses\'s Final Blessing', desc: 'Moses blesses each tribe before his death.' },
        { event: 'Moses\'s Death', desc: 'Moses views the Promised Land but dies before entering.' }
      ],
      keyScriptures: [
        { verse: 'Deuteronomy 6:4-5', text: '"Hear, O Israel: The Lord our God, the Lord is one. Love the Lord your God with all your heart."', insight: 'The Shema, Judaism\'s central confession of faith.' },
        { verse: 'Deuteronomy 8:3', text: '"Man does not live by bread alone but by every word from the mouth of God."', insight: 'Spiritual sustenance is more important than physical.' },
        { verse: 'Deuteronomy 30:19', text: '"Choose life, that you and your children may live."', insight: 'God sets before His people a choice between life and death.' }
      ],
      keyLocations: [
        { location: 'Plains of Moab', desc: 'Where Moses delivers his final addresses.' },
        { location: 'Mount Nebo', desc: 'Where Moses views the Promised Land before his death.' },
        { location: 'The Promised Land', desc: 'Visible across the Jordan, the goal of Israel\'s journey.' },
        { location: 'Egypt', desc: 'Remembered as the place of slavery from which God delivered Israel.' }
      ],
      keyLessons: [
        { title: 'Wholehearted Devotion', desc: 'God requires complete love and loyalty, not divided allegiance.' },
        { title: 'Remember God\'s Faithfulness', desc: 'Recalling God\'s past actions strengthens faith for the future.' },
        { title: 'Obedience Brings Blessing', desc: 'Following God\'s commands leads to flourishing and life.' },
        { title: 'The Danger of Idolatry', desc: 'Worship of false gods always leads to spiritual and moral decline.' },
        { title: 'Teaching the Next Generation', desc: 'Parents must pass faith and God\'s commands to their children.' },
        { title: 'Grace and Choice', desc: 'God sets before people a choice; He desires they choose life and blessing.' }
      ]
    },
    'joshua': {
      introduction: [
        "Joshua records Israel's conquest of Canaan under Joshua's leadership, fulfilling God's ancient promise to Abraham. The book demonstrates God's faithfulness and power as He gives Israel victory over their enemies.",
        "The narrative includes dramatic events like the crossing of the Jordan River, the fall of Jericho, and the sun standing still. These miracles confirm God's presence with Joshua as He was with Moses.",
        "Joshua also details the division of the land among the twelve tribes, establishing Israel's territorial inheritance. The book concludes with covenant renewal and Joshua's challenge for Israel to remain faithful to God.",
        "The conquests raise difficult questions about violence and divine judgment, but the book emphasizes that the Canaanites' removal was due to their wickedness and God's justice."
      ],
      historicalContext: {
        timePeriod: "Late Bronze Age, approximately 1400-1200 BCE, when Israel transitions from wilderness wandering to settled life in Canaan.",
        authorship: "Named after Joshua but likely compiled by later editors using early sources and traditions.",
        geography: "Focuses on Canaan (modern-day Israel/Palestine), detailing cities, regions, and tribal territories.",
        transmission: "Preserved as part of the historical books, foundational to Israel's claim to the land and understanding of God's covenant."
      },
      keyCharacters: [
        { name: 'Joshua', desc: 'Moses\'s successor who leads Israel to conquer and settle Canaan.' },
        { name: 'Rahab', desc: 'The Canaanite woman who hides Israelite spies and is saved when Jericho falls.' },
        { name: 'Caleb', desc: 'Faithful spy who inherits Hebron as reward for his trust in God.' },
        { name: 'Achan', desc: 'Israelite who steals forbidden items, bringing defeat until judgment is executed.' },
        { name: 'God', desc: 'The divine warrior who fights for Israel and fulfills His promises.' }
      ],
      keyEvents: [
        { event: 'Crossing the Jordan', desc: 'God miraculously parts the Jordan River, echoing the Red Sea crossing.' },
        { event: 'Fall of Jericho', desc: 'Israel marches around Jericho; the walls collapse at God\'s command.' },
        { event: 'Defeat at Ai', desc: 'Achan\'s sin brings defeat until the transgression is addressed.' },
        { event: 'The Sun Stands Still', desc: 'God extends daylight to give Israel complete victory.' },
        { event: 'Division of the Land', desc: 'The Promised Land is distributed among the twelve tribes.' },
        { event: 'Covenant Renewal at Shechem', desc: 'Joshua calls Israel to choose whom they will serve.' }
      ],
      keyScriptures: [
        { verse: 'Joshua 1:9', text: '"Be strong and courageous...the Lord your God is with you."', insight: 'God\'s reassurance and command to Joshua for the conquest ahead.' },
        { verse: 'Joshua 24:15', text: '"Choose this day whom you will serve...as for me and my house, we will serve the Lord."', insight: 'Joshua\'s challenge for covenant faithfulness.' },
        { verse: 'Joshua 21:45', text: '"Not one word of all the good promises...failed; all came to pass."', insight: 'Affirms God\'s complete faithfulness to His promises.' }
      ],
      keyLocations: [
        { location: 'Jericho', desc: 'First city conquered, demonstrating God\'s power.' },
        { location: 'Ai', desc: 'Site of initial defeat and later victory after sin is addressed.' },
        { location: 'Gilgal', desc: 'Israel\'s base camp and site of covenant renewal.' },
        { location: 'Shiloh', desc: 'Where the tabernacle is established in the Promised Land.' },
        { location: 'Shechem', desc: 'Location of covenant renewal ceremony.' }
      ],
      keyLessons: [
        { title: 'God Keeps His Promises', desc: 'Every promise God made to the patriarchs is fulfilled in the conquest.' },
        { title: 'Obedience Required', desc: 'Victory depends on following God\'s commands precisely.' },
        { title: 'Corporate Responsibility', desc: 'One person\'s sin can affect the entire community.' },
        { title: 'Faith Over Fear', desc: 'Trusting God enables victory over seemingly impossible obstacles.' },
        { title: 'Covenant Faithfulness', desc: 'Each generation must personally commit to serving God.' },
        { title: 'God as Warrior', desc: 'God fights for His people when they trust and obey Him.' }
      ]
    },
    'judges': {
      introduction: [
        "Judges covers the turbulent period between Joshua's death and the establishment of the monarchy. Israel repeatedly falls into idolatry, suffers oppression, cries out to God, and is delivered by judges whom God raises up.",
        "The book follows a recurring cycle: rebellion, oppression, repentance, and deliverance. This pattern demonstrates both Israel's unfaithfulness and God's patient mercy in repeatedly rescuing His people.",
        "The judges were military and civil leaders, not judicial officials. They include famous figures like Deborah, Gideon, and Samson, each displaying both strengths and weaknesses.",
        "Judges ends with increasing moral chaos, culminating in the refrain 'everyone did what was right in their own eyes,' showing Israel's need for righteous leadership."
      ],
      historicalContext: {
        timePeriod: "Approximately 1200-1050 BCE, spanning roughly 300 years between the conquest and the monarchy.",
        authorship: "Anonymous, likely compiled during the monarchy to explain Israel's pre-monarchic history.",
        geography: "Various regions of Canaan as different tribes face local threats and oppression.",
        transmission: "Preserved as cautionary history showing the consequences of covenant unfaithfulness."
      },
      keyCharacters: [
        { name: 'Deborah', desc: 'Prophetess and judge who leads Israel to victory over Canaanite oppression.' },
        { name: 'Gideon', desc: 'Reluctant leader whom God uses to defeat the Midianites with only 300 men.' },
        { name: 'Samson', desc: 'Nazirite judge with great strength who struggles with moral weakness.' },
        { name: 'Jephthah', desc: 'Outcast who becomes judge and makes a tragic vow.' },
        { name: 'The Israelites', desc: 'God\'s people caught in cycles of rebellion and repentance.' }
      ],
      keyEvents: [
        { event: 'Cycle of Apostasy', desc: 'Israel repeatedly abandons God for idols, bringing oppression.' },
        { event: 'Deborah and Barak\'s Victory', desc: 'Defeat of Canaanite forces under Deborah\'s leadership.' },
        { event: 'Gideon\'s 300', desc: 'God reduces Gideon\'s army to show victory comes from Him.' },
        { event: 'Samson\'s Exploits', desc: 'Samson\'s strength and weaknesses as he fights the Philistines.' },
        { event: 'Civil War with Benjamin', desc: 'Internal strife nearly destroys one of Israel\'s tribes.' }
      ],
      keyScriptures: [
        { verse: 'Judges 2:16', text: '"Then the Lord raised up judges, who saved them."', insight: 'God\'s mercy in repeatedly delivering Israel despite their unfaithfulness.' },
        { verse: 'Judges 21:25', text: '"Everyone did what was right in their own eyes."', insight: 'Moral relativism leads to chaos and the need for godly leadership.' },
        { verse: 'Judges 6:12', text: '"The Lord is with you, mighty warrior."', insight: 'God sees potential and calls people to greater purpose.' }
      ],
      keyLocations: [
        { location: 'Canaan', desc: 'The Promised Land where Israel struggles to remain faithful.' },
        { location: 'Valley of Jezreel', desc: 'Site of Deborah and Barak\'s victory.' },
        { location: 'Ophrah', desc: 'Gideon\'s hometown where God calls him.' },
        { location: 'Gaza', desc: 'Philistine city where Samson is imprisoned and dies.' }
      ],
      keyLessons: [
        { title: 'Cycle of Sin', desc: 'Without faithful leadership, people naturally drift toward idolatry.' },
        { title: 'God\'s Patient Mercy', desc: 'God repeatedly delivers Israel despite their repeated unfaithfulness.' },
        { title: 'Incomplete Obedience', desc: 'Failing to fully follow God\'s commands leads to ongoing problems.' },
        { title: 'God Uses Unlikely Leaders', desc: 'God calls imperfect people and empowers them for His purposes.' },
        { title: 'Need for Godly Leadership', desc: 'Without righteous leadership, society descends into moral chaos.' },
        { title: 'Faith and Action', desc: 'The judges had to act in faith, trusting God for victory.' }
      ]
    },
    'isaiah': {
      introduction: [
        "Isaiah is the longest and most quoted prophetic book in the Old Testament, spanning themes of judgment, redemption, and the coming Messiah. Written during Judah's decline, it warns of impending exile while promising future restoration.",
        "The book divides into two main sections: chapters 1-39 emphasize judgment on Judah and surrounding nations, while chapters 40-66 offer comfort and hope, proclaiming God's redemptive plan.",
        "Isaiah contains the most extensive messianic prophecies in the Old Testament, including the suffering servant passages that Christians see fulfilled in Jesus Christ.",
        "The prophet's vision of God's holiness, combined with his message of both judgment and grace, makes Isaiah essential for understanding God's character and redemptive purposes."
      ],
      historicalContext: {
        timePeriod: "Isaiah prophesied from approximately 740-681 BCE during the reigns of Uzziah, Jotham, Ahaz, and Hezekiah, spanning Assyria's rise to power.",
        authorship: "Traditionally attributed to the prophet Isaiah, though scholars debate whether the entire book comes from one author or multiple contributors.",
        geography: "Centered in Jerusalem and Judah, with prophecies concerning surrounding nations including Assyria, Babylon, and Egypt.",
        transmission: "Extensively quoted in the New Testament and foundational to Jewish and Christian understanding of the Messiah."
      },
      keyCharacters: [
        { name: 'Isaiah', desc: 'The prophet called by God in a dramatic vision of holiness.' },
        { name: 'King Hezekiah', desc: 'Righteous king of Judah who trusts God during Assyrian siege.' },
        { name: 'King Ahaz', desc: 'Faithless king who refuses God\'s sign and makes alliance with Assyria.' },
        { name: 'The Suffering Servant', desc: 'Prophetic figure who bears the sins of many (Isaiah 53).' },
        { name: 'God', desc: 'The Holy One of Israel who judges sin but promises redemption.' }
      ],
      keyEvents: [
        { event: 'Isaiah\'s Call Vision', desc: 'Isaiah sees God\'s holiness and receives his prophetic commission.' },
        { event: 'Sign to Ahaz', desc: 'The virgin birth prophecy given to King Ahaz.' },
        { event: 'Siege of Jerusalem', desc: 'God miraculously delivers Jerusalem from Assyrian assault.' },
        { event: 'Prophecy of Exile', desc: 'Warning that Babylon will conquer Judah.' },
        { event: 'Comfort to Exiles', desc: 'Promise of return and restoration after judgment.' },
        { event: 'The Suffering Servant', desc: 'Prophecy of one who suffers for the sins of others.' },
        { event: 'New Heavens and Earth', desc: 'Vision of ultimate restoration and God\'s eternal kingdom.' }
      ],
      keyScriptures: [
        { verse: 'Isaiah 6:3', text: '"Holy, holy, holy is the Lord Almighty."', insight: 'God\'s holiness is His fundamental characteristic.' },
        { verse: 'Isaiah 9:6', text: '"For to us a child is born...Mighty God, Everlasting Father, Prince of Peace."', insight: 'Prophecy of the Messiah\'s birth and divine nature.' },
        { verse: 'Isaiah 53:5', text: '"He was pierced for our transgressions...by His wounds we are healed."', insight: 'The suffering servant\'s atoning work for humanity.' }
      ],
      keyLocations: [
        { location: 'Jerusalem', desc: 'The holy city, center of worship and object of both judgment and hope.' },
        { location: 'Judah', desc: 'The southern kingdom facing Assyrian and Babylonian threats.' },
        { location: 'Babylon', desc: 'Future captor of Judah, but also place from which God will deliver.' },
        { location: 'Zion', desc: 'Poetic name for Jerusalem, representing God\'s presence and future glory.' }
      ],
      keyLessons: [
        { title: 'God\'s Holiness', desc: 'God\'s perfect holiness cannot tolerate sin and requires judgment.' },
        { title: 'Judgment and Mercy', desc: 'God judges sin but always offers a path to redemption.' },
        { title: 'Messianic Hope', desc: 'A coming servant-king will bring ultimate salvation and restoration.' },
        { title: 'Trust in God Alone', desc: 'Political alliances and military might cannot save; only God can.' },
        { title: 'Universal Salvation', desc: 'God\'s redemption extends to all nations, not just Israel.' },
        { title: 'Future Glory', desc: 'Beyond present suffering lies glorious restoration and eternal peace.' }
      ]
    },
    'jeremiah': {
      introduction: [
        "Jeremiah prophesied during Judah's final decades before Babylonian exile. Called as a young man, he proclaimed an unpopular message of coming judgment for over 40 years, often facing persecution and rejection.",
        "The book contains prophecies, biographical narratives, and Jeremiah's personal laments. It reveals the prophet's emotional struggles as he delivers God's harsh message to a resistant people.",
        "Jeremiah warned that Jerusalem would fall and urged surrender to Babylon, making him appear treasonous. Despite opposition, he remained faithful to God's calling, demonstrating costly obedience.",
        "The book also contains hope: the promise of a new covenant written on hearts rather than stone tablets, pointing to the transformative work of the Spirit in the New Testament era."
      ],
      historicalContext: {
        timePeriod: "Jeremiah prophesied from 627-586 BCE, during Judah's last kings and through the Babylonian destruction of Jerusalem.",
        authorship: "Written by the prophet Jeremiah with his scribe Baruch, compiled into its final form shortly after the exile.",
        geography: "Centered in Jerusalem and Judah, with references to Babylon, Egypt, and surrounding nations.",
        transmission: "Preserved by exilic and post-exilic communities as explanation for the catastrophe and hope for restoration."
      },
      keyCharacters: [
        { name: 'Jeremiah', desc: 'The weeping prophet who faithfully proclaims judgment despite persecution.' },
        { name: 'Baruch', desc: 'Jeremiah\'s faithful scribe who records and preserves his prophecies.' },
        { name: 'King Jehoiakim', desc: 'Wicked king who burns Jeremiah\'s scroll and rejects God\'s word.' },
        { name: 'King Zedekiah', desc: 'Last king of Judah, weak and vacillating, who witnesses Jerusalem\'s fall.' },
        { name: 'Nebuchadnezzar', desc: 'Babylonian king whom God uses as instrument of judgment.' }
      ],
      keyEvents: [
        { event: 'Jeremiah\'s Call', desc: 'God calls Jeremiah as prophet before his birth, appointing him to nations.' },
        { event: 'The Burning of the Scroll', desc: 'King Jehoiakim burns Jeremiah\'s prophecies in defiance.' },
        { event: 'Jeremiah\'s Imprisonment', desc: 'The prophet is imprisoned for predicting Jerusalem\'s fall.' },
        { event: 'Fall of Jerusalem', desc: 'Babylon destroys Jerusalem and the temple, vindicating Jeremiah\'s warnings.' },
        { event: 'Promise of New Covenant', desc: 'God promises to write His law on hearts, not tablets.' },
        { event: 'Prophecies Against Nations', desc: 'Judgment pronounced on surrounding nations, not just Judah.' }
      ],
      keyScriptures: [
        { verse: 'Jeremiah 1:5', text: '"Before I formed you in the womb I knew you."', insight: 'God\'s sovereign calling and purpose for individuals before birth.' },
        { verse: 'Jeremiah 29:11', text: '"I know the plans I have for you...plans to prosper you."', insight: 'Promise of hope and future despite present suffering.' },
        { verse: 'Jeremiah 31:33', text: '"I will put my law in their minds and write it on their hearts."', insight: 'The new covenant of internal transformation through the Spirit.' }
      ],
      keyLocations: [
        { location: 'Jerusalem', desc: 'The doomed city that refuses to repent despite warnings.' },
        { location: 'Babylon', desc: 'Agent of God\'s judgment and place of Israel\'s exile.' },
        { location: 'Egypt', desc: 'Where some Judeans flee, forcing Jeremiah to accompany them.' },
        { location: 'Anathoth', desc: 'Jeremiah\'s hometown where he faces rejection.' }
      ],
      keyLessons: [
        { title: 'Consequences of Disobedience', desc: 'Persistent rejection of God\'s word brings inevitable judgment.' },
        { title: 'Cost of Faithfulness', desc: 'Following God may require suffering rejection and persecution.' },
        { title: 'God\'s Sovereignty', desc: 'God uses even pagan nations to accomplish His purposes.' },
        { title: 'Hope Beyond Judgment', desc: 'Exile is not the end; God promises restoration and renewal.' },
        { title: 'Internal Transformation', desc: 'True change comes from hearts renewed by God, not external religion.' },
        { title: 'God\'s Unchanging Love', desc: 'Even in judgment, God\'s purpose is ultimately redemptive.' }
      ]
    },
    'ezekiel': {
      introduction: [
        "Ezekiel prophesied among the Jewish exiles in Babylon, receiving dramatic visions and performing symbolic acts to communicate God's messages. His ministry spans the fall of Jerusalem and offers hope for future restoration.",
        "The book is known for its vivid imagery: the vision of God's throne-chariot, the valley of dry bones, and the detailed temple vision. These apocalyptic elements influenced later Jewish and Christian apocalyptic literature.",
        "Ezekiel emphasizes individual responsibility for sin, God's holiness, and the certainty of divine judgment. Yet it also proclaims hope: God will restore Israel, give them a new heart, and dwell among them forever.",
        "The prophet serves as watchman for Israel, warning them of danger and calling them to repentance. His message balances harsh judgment with tender promises of renewal."
      ],
      historicalContext: {
        timePeriod: "Ezekiel prophesied from 593-571 BCE among exiles in Babylon, spanning Jerusalem's fall in 586 BCE.",
        authorship: "Written by Ezekiel, a priest and prophet exiled to Babylon in 597 BCE.",
        geography: "Delivered in Babylon to Jewish exiles, though visions concern Jerusalem and the promised land.",
        transmission: "Preserved by exilic community, influential in shaping post-exilic Jewish identity and hope."
      },
      keyCharacters: [
        { name: 'Ezekiel', desc: 'Priest-prophet who receives dramatic visions and performs symbolic acts.' },
        { name: 'God', desc: 'The holy God who will not share His glory and promises to restore His people.' },
        { name: 'The Exiles', desc: 'Jewish community in Babylon who receive Ezekiel\'s prophecies.' },
        { name: 'The Leaders of Israel', desc: 'Wicked rulers who led the nation astray, described as false shepherds.' }
      ],
      keyEvents: [
        { event: 'Vision of God\'s Throne', desc: 'Ezekiel sees God\'s glory on a throne-chariot with cherubim and wheels.' },
        { event: 'Symbolic Acts', desc: 'Ezekiel performs dramatic actions illustrating Jerusalem\'s siege and exile.' },
        { event: 'God\'s Glory Departs', desc: 'Vision of God\'s glory leaving the temple due to Israel\'s sin.' },
        { event: 'Individual Responsibility', desc: 'Teaching that each person is accountable for their own sin.' },
        { event: 'Valley of Dry Bones', desc: 'Vision of resurrection symbolizing Israel\'s future restoration.' },
        { event: 'Vision of New Temple', desc: 'Detailed vision of a restored temple where God\'s glory returns.' }
      ],
      keyScriptures: [
        { verse: 'Ezekiel 36:26', text: '"I will give you a new heart and put a new spirit in you."', insight: 'Promise of internal transformation and renewal by God\'s Spirit.' },
        { verse: 'Ezekiel 37:5', text: '"I will make breath enter you, and you will come to life."', insight: 'God\'s power to resurrect and restore what appears dead.' },
        { verse: 'Ezekiel 18:20', text: '"The one who sins is the one who will die."', insight: 'Each person is responsible for their own choices and actions.' }
      ],
      keyLocations: [
        { location: 'Babylon', desc: 'Place of exile where Ezekiel ministers to fellow captives.' },
        { location: 'Jerusalem', desc: 'The city whose destruction Ezekiel predicts and witnesses in vision.' },
        { location: 'The Temple', desc: 'Symbol of God\'s presence, which is defiled and then abandoned.' },
        { location: 'Kebar River', desc: 'Location in Babylon where Ezekiel receives his call vision.' }
      ],
      keyLessons: [
        { title: 'God\'s Holiness Demands Judgment', desc: 'Sin cannot be ignored; God\'s holiness requires response to wickedness.' },
        { title: 'Individual Accountability', desc: 'Each person is responsible for their own relationship with God.' },
        { title: 'God\'s Glory Central', desc: 'God acts to preserve and display His glory among the nations.' },
        { title: 'Hope of Restoration', desc: 'God promises to restore, renew, and resurrect His people.' },
        { title: 'New Covenant Coming', desc: 'God will transform hearts internally, not just demand external obedience.' },
        { title: 'God as Good Shepherd', desc: 'God Himself will shepherd His people with care and justice.' }
      ]
    },
    'daniel': {
      introduction: [
        "Daniel combines narrative and apocalyptic visions, telling the story of Jewish exiles who remain faithful to God in Babylon while receiving prophecies about future kingdoms and God's ultimate triumph.",
        "The first half contains familiar stories of Daniel and his friends' faithfulness: refusing defiled food, surviving the fiery furnace, and Daniel in the lions' den. These narratives encourage covenant loyalty despite pressure.",
        "The second half presents Daniel's visions of future empires, cosmic conflict, and the coming of God's eternal kingdom. These apocalyptic images influenced later Jewish and Christian eschatology.",
        "Daniel emphasizes God's sovereignty over history, the temporary nature of earthly kingdoms, and the certainty of God's ultimate victory over evil."
      ],
      historicalContext: {
        timePeriod: "Set during the Babylonian exile (6th century BCE) and Persian period, though written or finalized during the 2nd century BCE persecution under Antiochus Epiphanes.",
        authorship: "Traditionally attributed to Daniel, a Jewish exile in Babylon, though scholars debate the date and authorship.",
        geography: "Primarily Babylon, with visions concerning future empires including Persia, Greece, and Rome.",
        transmission: "Preserved as encouragement for Jews facing persecution, demonstrating that faithfulness to God prevails."
      },
      keyCharacters: [
        { name: 'Daniel', desc: 'Faithful Jewish exile who rises to prominence while maintaining covenant loyalty.' },
        { name: 'Shadrach, Meshach, Abednego', desc: 'Daniel\'s friends who refuse to worship idols and survive the furnace.' },
        { name: 'Nebuchadnezzar', desc: 'Babylonian king who learns God\'s sovereignty through humiliation.' },
        { name: 'Belshazzar', desc: 'Wicked king who sees the writing on the wall predicting his downfall.' },
        { name: 'Darius', desc: 'Persian king who unwittingly condemns Daniel to the lions\' den.' }
      ],
      keyEvents: [
        { event: 'Refusing the King\'s Food', desc: 'Daniel and friends maintain dietary laws despite pressure to assimilate.' },
        { event: 'The Fiery Furnace', desc: 'Three friends survive the furnace after refusing to worship an idol.' },
        { event: 'Nebuchadnezzar\'s Dream', desc: 'Daniel interprets a dream of successive kingdoms and God\'s eternal kingdom.' },
        { event: 'The Writing on the Wall', desc: 'Daniel interprets mysterious writing predicting Babylon\'s fall to Persia.' },
        { event: 'Daniel in the Lions\' Den', desc: 'Daniel survives because of his faith and God\'s protection.' },
        { event: 'Vision of Four Beasts', desc: 'Apocalyptic vision of future empires and the Son of Man\'s kingdom.' },
        { event: 'The Seventy Weeks', desc: 'Prophetic timeline concerning Israel\'s future and the Messiah.' }
      ],
      keyScriptures: [
        { verse: 'Daniel 3:17-18', text: '"Our God is able to deliver us...but even if He does not, we will not serve your gods."', insight: 'Faith that trusts God regardless of outcomes.' },
        { verse: 'Daniel 7:13-14', text: '"One like a son of man...was given authority, glory and sovereign power."', insight: 'Vision of the Messiah\'s eternal dominion.' },
        { verse: 'Daniel 12:3', text: '"Those who are wise will shine like the brightness of the heavens."', insight: 'Promise of resurrection and reward for the faithful.' }
      ],
      keyLocations: [
        { location: 'Babylon', desc: 'The empire where Daniel and his friends serve in exile.' },
        { location: 'The Palace', desc: 'Site of Daniel\'s service to kings and dream interpretation.' },
        { location: 'The Lions\' Den', desc: 'Where Daniel is thrown for praying to God.' },
        { location: 'Jerusalem', desc: 'The destroyed city for which Daniel prays for restoration.' }
      ],
      keyLessons: [
        { title: 'Faithfulness in Exile', desc: 'God\'s people can remain loyal even in hostile environments.' },
        { title: 'God\'s Sovereignty Over Nations', desc: 'All earthly kingdoms rise and fall under God\'s control.' },
        { title: 'Cost of Conviction', desc: 'Standing for God may require willingness to face death.' },
        { title: 'Prophecy and History', desc: 'God reveals the future, demonstrating His control over time.' },
        { title: 'Ultimate Victory', desc: 'God\'s kingdom will ultimately triumph over all earthly powers.' },
        { title: 'Resurrection Hope', desc: 'The righteous will be raised to eternal life and glory.' }
      ]
    },
    'acts': {
      introduction: [
        "Acts chronicles the early church's birth and expansion from Jerusalem to Rome, driven by the Holy Spirit's power. Written by Luke as a sequel to his Gospel, it shows how Jesus's followers transformed the world.",
        "The book begins with Jesus's ascension and the Spirit's arrival at Pentecost, empowering disciples to preach boldly. It follows the apostles' ministry, particularly Peter and Paul, as the gospel spreads despite persecution.",
        "Acts demonstrates the inclusion of Gentiles into God's covenant community, showing how the church became a multi-ethnic movement. Key councils and decisions shape the church's theology and practice.",
        "The narrative emphasizes prayer, bold preaching, miraculous signs, and sacrificial community life as hallmarks of Spirit-filled Christianity."
      ],
      historicalContext: {
        timePeriod: "Covers approximately 30-62 CE, from Jesus's ascension through Paul's Roman imprisonment.",
        authorship: "Written by Luke, a physician and companion of Paul, likely in the 80s CE.",
        geography: "Traces the gospel's spread from Jerusalem through Judea, Samaria, Asia Minor, Greece, and to Rome.",
        transmission: "Preserved as the church's foundational history, explaining its origins and mission."
      },
      keyCharacters: [
        { name: 'Peter', desc: 'Leading apostle in the early chapters, preaches at Pentecost and to Cornelius.' },
        { name: 'Paul', desc: 'Converted persecutor who becomes the apostle to the Gentiles.' },
        { name: 'The Holy Spirit', desc: 'The divine presence empowering, guiding, and growing the church.' },
        { name: 'Stephen', desc: 'First Christian martyr whose death scatters believers and spreads the gospel.' },
        { name: 'Barnabas', desc: 'Encourager who mentors Paul and supports early missionaries.' },
        { name: 'Philip', desc: 'Evangelist who brings the gospel to Samaria and the Ethiopian eunuch.' }
      ],
      keyEvents: [
        { event: 'Pentecost', desc: 'The Holy Spirit arrives, empowering disciples to preach in many languages.' },
        { event: 'Peter\'s Sermon', desc: '3,000 believe and are baptized after Peter explains Jesus\'s resurrection.' },
        { event: 'Stephen\'s Martyrdom', desc: 'First Christian killed for faith, leading to gospel spreading beyond Jerusalem.' },
        { event: 'Paul\'s Conversion', desc: 'Persecutor Saul encounters Jesus and becomes apostle Paul.' },
        { event: 'Peter and Cornelius', desc: 'God reveals that Gentiles are included in the gospel without becoming Jews.' },
        { event: 'Jerusalem Council', desc: 'Church leaders decide Gentiles don\'t need to follow Jewish law.' },
        { event: 'Paul\'s Missionary Journeys', desc: 'Gospel spreads throughout the Roman Empire through Paul\'s travels.' }
      ],
      keyScriptures: [
        { verse: 'Acts 1:8', text: '"You will receive power...and be my witnesses to the ends of the earth."', insight: 'The Great Commission powered by the Holy Spirit.' },
        { verse: 'Acts 2:38', text: '"Repent and be baptized...you will receive the gift of the Holy Spirit."', insight: 'The gospel message and promise for all who believe.' },
        { verse: 'Acts 4:12', text: '"Salvation is found in no one else...no other name."', insight: 'Christ\'s exclusive role in salvation.' }
      ],
      keyLocations: [
        { location: 'Jerusalem', desc: 'Birthplace of the church and center of early Christian activity.' },
        { location: 'Antioch', desc: 'First primarily Gentile church, base for Paul\'s missions.' },
        { location: 'Ephesus', desc: 'Major center of Paul\'s ministry in Asia Minor.' },
        { location: 'Rome', desc: 'Capital of the empire, destination of Paul\'s journey.' }
      ],
      keyLessons: [
        { title: 'The Spirit\'s Power', desc: 'The Holy Spirit empowers ordinary people to do extraordinary things.' },
        { title: 'Gospel for All', desc: 'Salvation is offered to all people, Jews and Gentiles alike.' },
        { title: 'Persecution and Growth', desc: 'Opposition cannot stop the gospel; often it spreads the message further.' },
        { title: 'Bold Witness', desc: 'Spirit-filled believers courageously proclaim Christ despite danger.' },
        { title: 'Community and Unity', desc: 'Early believers shared possessions and cared for one another.' },
        { title: 'God\'s Sovereign Plan', desc: 'God orchestrates circumstances to accomplish His purposes.' }
      ]
    },
    '1corinthians': {
      introduction: [
        "Paul's first letter to the Corinthians addresses serious problems in a young, troubled church: divisions, sexual immorality, lawsuits, confusion about spiritual gifts, and disorder in worship.",
        "Written to a congregation in the morally corrupt city of Corinth, the letter provides practical guidance for living as Christians in a pagan culture. Paul balances correction with encouragement.",
        "The letter contains famous passages on love (chapter 13), the resurrection (chapter 15), and spiritual gifts (chapters 12-14). It demonstrates how the gospel transforms both individual lives and community practices.",
        "Paul's approach is both theological and practical, showing how Christian doctrine should shape everyday decisions, relationships, and church life."
      ],
      historicalContext: {
        timePeriod: "Written around 55 CE from Ephesus during Paul's third missionary journey.",
        authorship: "Written by the Apostle Paul to a church he founded during his second journey.",
        geography: "Addressed to the church at Corinth, a prosperous port city known for moral corruption.",
        transmission: "Preserved as essential instruction for church order, ethics, and doctrine."
      },
      keyCharacters: [
        { name: 'Paul', desc: 'The apostle addressing problems in a church he founded and loves.' },
        { name: 'The Corinthian Believers', desc: 'Gifted but immature Christians struggling with division and sin.' },
        { name: 'Apollos', desc: 'Eloquent teacher whose ministry became a source of division.' },
        { name: 'Christ', desc: 'The foundation of the church and source of true wisdom and unity.' }
      ],
      keyEvents: [
        { event: 'Divisions in the Church', desc: 'Believers align with different leaders, creating factions.' },
        { event: 'Sexual Immorality', desc: 'A church member is living with his stepmother; Paul demands action.' },
        { event: 'Lawsuits Between Believers', desc: 'Christians taking each other to pagan courts.' },
        { event: 'Questions About Marriage', desc: 'Paul addresses marriage, singleness, and divorce.' },
        { event: 'Food Sacrificed to Idols', desc: 'Debate over Christian liberty and concern for weaker believers.' },
        { event: 'Disorder in Worship', desc: 'Problems with the Lord\'s Supper and use of spiritual gifts.' },
        { event: 'Resurrection Debate', desc: 'Paul defends the physical resurrection against skeptics.' }
      ],
      keyScriptures: [
        { verse: '1 Corinthians 1:18', text: '"The message of the cross is foolishness to those who are perishing."', insight: 'The gospel\'s wisdom contradicts worldly wisdom.' },
        { verse: '1 Corinthians 13:4-7', text: '"Love is patient, love is kind...it always protects, trusts, hopes, perseveres."', insight: 'The supreme nature and characteristics of Christian love.' },
        { verse: '1 Corinthians 15:57', text: '"Thanks be to God! He gives us the victory through our Lord Jesus Christ."', insight: 'Triumph over death through Christ\'s resurrection.' }
      ],
      keyLocations: [
        { location: 'Corinth', desc: 'Wealthy, immoral port city where the troubled church is located.' },
        { location: 'Ephesus', desc: 'Where Paul writes from during his extended ministry there.' },
        { location: 'The Church Gathering', desc: 'Where worship, gifts, and the Lord\'s Supper occur.' }
      ],
      keyLessons: [
        { title: 'Unity in Christ', desc: 'Believers must overcome divisions and be united in Christ.' },
        { title: 'Sexual Purity', desc: 'Christians must flee sexual immorality; bodies are temples of the Spirit.' },
        { title: 'Christian Liberty with Love', desc: 'Freedom must be exercised with concern for weaker believers.' },
        { title: 'Gifts for Building Up', desc: 'Spiritual gifts exist to serve others, not elevate oneself.' },
        { title: 'Love Above All', desc: 'Love is more important than any spiritual gift or knowledge.' },
        { title: 'Resurrection Hope', desc: 'Christ\'s resurrection guarantees believers\' future resurrection.' }
      ]
    },
    'ephesians': {
      introduction: [
        "Ephesians presents a magnificent vision of the church as Christ's body, chosen before creation and blessed with every spiritual blessing. Paul writes from prison to encourage believers in their identity and calling.",
        "The letter divides into two parts: theological truths about salvation and the church (chapters 1-3), and practical applications for Christian living (chapters 4-6).",
        "Ephesians emphasizes unity among Jewish and Gentile believers, the mystery of the church revealed, and the spiritual warfare believers face. It's less problem-focused than Paul's other letters, offering grand theological vision.",
        "The letter's theme is God's eternal purpose to unite all things in Christ and display His wisdom through the multi-ethnic, Spirit-filled church."
      ],
      historicalContext: {
        timePeriod: "Written around 60-62 CE during Paul's Roman imprisonment.",
        authorship: "Attributed to Paul, though some scholars debate authorship due to style differences from undisputed letters.",
        geography: "Addressed to the church at Ephesus, a major city in Asia Minor where Paul ministered for three years.",
        transmission: "Likely circulated among multiple churches in Asia Minor; foundational for church identity and unity."
      },
      keyCharacters: [
        { name: 'Paul', desc: 'The imprisoned apostle revealing the mystery of God\'s eternal plan.' },
        { name: 'Christ', desc: 'Head of the church, source of all blessings, and reconciler of all things.' },
        { name: 'The Church', desc: 'The body of Christ, temple of the Spirit, and display of God\'s wisdom.' },
        { name: 'Believers', desc: 'Saints chosen before creation, saved by grace, sealed by the Spirit.' }
      ],
      keyEvents: [
        { event: 'Spiritual Blessings Proclaimed', desc: 'Believers are blessed with every spiritual blessing in Christ.' },
        { event: 'Salvation by Grace', desc: 'Saved by grace through faith, not by works, for good works.' },
        { event: 'Jews and Gentiles United', desc: 'The dividing wall is broken; all are one in Christ.' },
        { event: 'Paul\'s Prayer for the Church', desc: 'That believers would know God\'s love and power.' },
        { event: 'Call to Unity and Maturity', desc: 'Using gifts to build up the body in love and truth.' },
        { event: 'Instructions for Relationships', desc: 'Guidance for marriages, families, and workplace conduct.' },
        { event: 'Spiritual Warfare', desc: 'Call to put on God\'s armor against spiritual forces of evil.' }
      ],
      keyScriptures: [
        { verse: 'Ephesians 2:8-9', text: '"For by grace you have been saved through faith...not by works."', insight: 'The foundation of salvation: grace received through faith.' },
        { verse: 'Ephesians 4:4-6', text: '"One body, one Spirit, one Lord, one faith, one baptism, one God."', insight: 'The basis for Christian unity in essential truths.' },
        { verse: 'Ephesians 6:12', text: '"Our struggle is not against flesh and blood but against spiritual forces."', insight: 'The true nature of spiritual warfare.' }
      ],
      keyLocations: [
        { location: 'Ephesus', desc: 'Major city in Asia Minor, site of a strong church community.' },
        { location: 'Rome', desc: 'Where Paul writes from prison.' },
        { location: 'The Heavenly Realms', desc: 'Spiritual dimension where believers are blessed and battle occurs.' }
      ],
      keyLessons: [
        { title: 'Chosen Before Creation', desc: 'God\'s plan for salvation predates human history.' },
        { title: 'Saved by Grace Alone', desc: 'Salvation is entirely God\'s work, not human achievement.' },
        { title: 'Unity in Diversity', desc: 'Jews and Gentiles, all backgrounds, are one in Christ.' },
        { title: 'Maturity Through Gifts', desc: 'Spiritual gifts build up the church when used in love.' },
        { title: 'Transformed Relationships', desc: 'The gospel reshapes marriages, families, and all relationships.' },
        { title: 'Spiritual Battle', desc: 'Believers must actively resist spiritual forces through God\'s armor.' }
      ]
    },
    'revelation': {
      introduction: [
        "Revelation is the Bible's final book, presenting apocalyptic visions of the end times, Christ's return, and God's ultimate victory over evil. Written to seven churches in Asia Minor, it encourages persecuted believers to remain faithful.",
        "The book uses vivid symbolic imagery: beasts, seals, trumpets, bowls of wrath, and cosmic warfare. These symbols, rooted in Old Testament prophecy, communicate theological truths about God's sovereignty and coming judgment.",
        "Revelation reveals Jesus Christ in glory as King of kings and Lord of lords. It promises that despite present suffering, God will judge evil, resurrect the dead, and create new heavens and a new earth.",
        "Though challenging to interpret, Revelation's core message is clear: Christ wins, evil is defeated, and God will dwell with His people forever in perfect peace."
      ],
      historicalContext: {
        timePeriod: "Written around 95 CE during Roman emperor Domitian's persecution of Christians.",
        authorship: "Attributed to John the apostle, exiled on the island of Patmos for his faith.",
        geography: "Addressed to seven churches in Asia Minor (modern-day Turkey); visions encompass cosmic scope.",
        transmission: "Despite early debates about canonicity, accepted as Scripture and profoundly influential in Christian eschatology."
      },
      keyCharacters: [
        { name: 'John', desc: 'The apostle receiving and recording these visions on Patmos.' },
        { name: 'Jesus Christ', desc: 'Revealed as the Lamb who was slain and the victorious King.' },
        { name: 'The Seven Churches', desc: 'Recipients of specific messages addressing their spiritual conditions.' },
        { name: 'The Dragon/Satan', desc: 'The adversary who wages war against God and His people.' },
        { name: 'The Beast', desc: 'Symbol of oppressive political power opposed to God.' },
        { name: 'The Bride', desc: 'The church, prepared for eternal union with Christ.' }
      ],
      keyEvents: [
        { event: 'Vision of Glorified Christ', desc: 'John sees Jesus in radiant glory among the lampstands.' },
        { event: 'Letters to Seven Churches', desc: 'Messages of commendation, correction, and exhortation.' },
        { event: 'The Throne Room', desc: 'Vision of God\'s throne and heavenly worship.' },
        { event: 'The Seven Seals', desc: 'Progressive revelation of God\'s judgments on earth.' },
        { event: 'The Seven Trumpets', desc: 'Further judgments announced by angelic trumpets.' },
        { event: 'The Woman and the Dragon', desc: 'Cosmic conflict between God\'s people and Satan.' },
        { event: 'Fall of Babylon', desc: 'Symbol of worldly power and corruption is judged and destroyed.' },
        { event: 'Christ\'s Return', desc: 'Jesus returns as conquering king to defeat evil.' },
        { event: 'The New Jerusalem', desc: 'God creates new heavens and earth where He dwells with His people.' }
      ],
      keyScriptures: [
        { verse: 'Revelation 1:8', text: '"I am the Alpha and the Omega...who is, and who was, and who is to come."', insight: 'Christ\'s eternal existence and sovereign control over history.' },
        { verse: 'Revelation 21:4', text: '"He will wipe every tear...no more death or mourning or crying or pain."', insight: 'Promise of complete restoration and end of suffering.' },
        { verse: 'Revelation 22:20', text: '"Yes, I am coming soon. Amen. Come, Lord Jesus."', insight: 'The church\'s longing for Christ\'s return.' }
      ],
      keyLocations: [
        { location: 'Patmos', desc: 'Island where John receives his visions while exiled.' },
        { location: 'The Seven Churches', desc: 'Ephesus, Smyrna, Pergamum, Thyatira, Sardis, Philadelphia, Laodicea.' },
        { location: 'The Throne Room', desc: 'Heaven where God reigns in glory.' },
        { location: 'Babylon', desc: 'Symbol of worldly corruption and opposition to God.' },
        { location: 'The New Jerusalem', desc: 'God\'s eternal city descending from heaven to renewed earth.' }
      ],
      keyLessons: [
        { title: 'Christ\'s Ultimate Victory', desc: 'Despite present suffering, Christ will triumph over all evil.' },
        { title: 'Perseverance Required', desc: 'Believers must remain faithful through persecution and trials.' },
        { title: 'Worship as Central', desc: 'Heavenly worship provides perspective on earthly struggles.' },
        { title: 'God\'s Righteous Judgment', desc: 'Evil will be judged; justice will prevail.' },
        { title: 'Hope of Restoration', desc: 'God will make all things new, fulfilling His eternal purposes.' },
        { title: 'Eternal Perspective', desc: 'Present suffering is temporary; eternal glory awaits the faithful.' }
      ]
    },
    'genesis': {
    introduction: [
      "As the first book of the Bible, the Book of Genesis holds immense significance for both Judaism and Christianity. Its name, derived from the Greek term γένεσις (genesis), translates to \"origin\" or \"birth,\" alluding to its primary purpose of providing an account of the creation of the universe, earth, and humanity.",
      "Composed as a collection of stories and narratives, Genesis serves as the cornerstone of biblical history. Its vivid imagery and deeply symbolic language illustrate the genesis of the world and provide a rich tapestry of early human experiences. The book's authorship is traditionally attributed to Moses, who is believed to have compiled the narratives from ancient oral traditions, creating a cohesive story of God's redemptive plan for humanity.",
      "The Book of Genesis is divided into two primary sections: the primeval history (chapters 1-11) and the ancestral history (chapters 12-50). The primeval history begins with the creation story and proceeds to narrate the world's early days, including tales of Adam and Eve, Noah's ark, and the Tower of Babel. The ancestral history focuses on God's covenant with Abraham and follows the lives of his descendants, Isaac, Jacob, and Joseph.",
      "Beyond its historical significance, the Book of Genesis addresses timeless themes such as obedience, faith, and redemption. Its teachings lay the groundwork for understanding God's nature and His interaction with humanity throughout the rest of the biblical narrative. In essence, the Book of Genesis serves as the foundation upon which the entire Bible stands, providing a vital context for comprehending God's plan for creation and redemption."
    ],
    historicalContext: {
      timePeriod: "The Book of Genesis, dating back to approximately the second millennium BCE, is situated within the broader context of the ancient Near East. This period was characterized by the rise and fall of various civilizations, including the Sumerians, Babylonians, Egyptians, and early Semitic peoples.",
      authorship: "Traditionally attributed to Moses, the authorship of Genesis has been a subject of scholarly debate. Some scholars suggest that multiple authors contributed to the text, while others argue for a single author drawing upon various sources. Regardless of its precise authorship, Genesis reflects the perspectives and beliefs of the ancient Israelite people.",
      geography: "The geographical locations mentioned in Genesis, such as the Garden of Eden, Babel, Canaan, and Egypt, provide insight into the movements and interactions of ancient peoples. The narrative takes place within the Fertile Crescent, a region in the ancient Near East known for its agricultural productivity and diverse civilizations.",
      transmission: "The stories within Genesis were likely passed down through oral tradition before being written down. The significance of these narratives for ancient Israelite society and identity cannot be overstated, as they provided a shared understanding of the people's origins, values, and religious beliefs."
    },
    keyCharacters: [
      { name: 'Adam and Eve', desc: 'The first humans created by God in the Garden of Eden. Their disobedience leads to the fall of humanity and the introduction of sin into the world.' },
      { name: 'Noah', desc: 'A righteous man chosen by God to build an ark and survive the great flood. His obedience demonstrates the importance of faith in corrupt times.' },
      { name: 'Abraham', desc: 'The father of faith and ancestor of the Israelites. God establishes a covenant with him, promising to make his descendants a great nation.' },
      { name: 'Isaac', desc: 'The son of Abraham and father of Jacob. His birth in Abraham\'s old age is a miraculous fulfillment of God\'s promise.' },
      { name: 'Jacob', desc: 'Later named Israel, Jacob is the son of Isaac. His life shows the transformative power of God\'s grace and the importance of forgiveness.' },
      { name: 'Joseph', desc: 'The favorite son of Jacob who experiences betrayal and slavery but rises to power in Egypt, demonstrating God\'s ability to bring good from adversity.' }
    ],
    keyEvents: [
      { event: 'The Creation', desc: 'God creates the universe, earth, and all living creatures in six days, declaring all He made "very good."' },
      { event: 'The Fall of Humanity', desc: 'Adam and Eve\'s disobedience in the Garden of Eden introduces sin, death, and suffering into the world.' },
      { event: 'The Great Flood', desc: 'God sends a global flood to cleanse the earth of wickedness. Noah\'s obedience preserves life through the ark.' },
      { event: 'God\'s Covenant with Abraham', desc: 'God establishes a covenant with Abraham, promising to bless his descendants and make them a great nation.' },
      { event: 'Destruction of Sodom and Gomorrah', desc: 'God\'s judgment falls upon these wicked cities, demonstrating His intolerance for sin.' },
      { event: 'Jacob\'s Ladder Vision', desc: 'Jacob dreams of a ladder to heaven with angels ascending and descending. God reaffirms His covenant.' },
      { event: 'Joseph in Egypt', desc: 'Joseph is sold into slavery but rises to power as governor, saving his family from famine.' }
    ],
    keyScriptures: [
      { verse: 'Genesis 1:1', text: '"In the beginning, God created the heavens and the earth."', insight: 'Establishes God\'s sovereignty and role as the divine architect of the universe.' },
      { verse: 'Genesis 1:26', text: '"Let us make man in our image, after our likeness."', insight: 'Affirms the unique nature of humans as beings created in God\'s image with inherent worth.' },
      { verse: 'Genesis 12:2', text: '"I will make of you a great nation, and I will bless you and make your name great."', insight: 'God\'s foundational promise to Abraham, central to His redemptive plan.' }
    ],
    keyLocations: [
      { location: 'The Garden of Eden', desc: 'The idyllic paradise where God places Adam and Eve. A symbol of humanity\'s original, untainted state.' },
      { location: 'Babel', desc: 'The location of the Tower of Babel, where people attempt to build a tower reaching the heavens, explaining the origin of different languages.' },
      { location: 'The Promised Land (Canaan)', desc: 'The territory God promises to give to Abraham\'s descendants, located between the Jordan River and Mediterranean Sea.' },
      { location: 'Egypt', desc: 'Joseph is sold into slavery there and eventually rises to power, saving his family from famine.' },
      { location: 'Mount Moriah', desc: 'The sacred location where God tests Abraham\'s faith by commanding him to sacrifice Isaac.' }
    ],
    keyLessons: [
      { title: 'The Sovereignty of God', desc: 'God is portrayed as the all-powerful creator and ruler of the universe. His actions shape history, and His will is consistently accomplished.' },
      { title: 'The Consequences of Sin', desc: 'Genesis repeatedly highlights the destructive nature of sin, from Adam and Eve\'s disobedience to the destruction of Sodom and Gomorrah.' },
      { title: 'The Power of Faith and Obedience', desc: 'Figures like Abraham, Isaac, and Joseph demonstrate the transformative power of faith and obedience, even in difficult circumstances.' },
      { title: 'The Significance of Covenant', desc: 'God\'s covenants illustrate His faithfulness and provide hope for redemption and restoration.' },
      { title: 'The Value of Forgiveness and Reconciliation', desc: 'Stories like Joseph\'s reconciliation with his brothers highlight the power of forgiveness to restore broken relationships.' },
      { title: 'The Promise of Redemption', desc: 'Genesis lays the groundwork for God\'s ultimate redemptive plan through Jesus Christ, demonstrating His purpose to restore His people.' }
    ]
  }
};

export default function StudyGuideArticle({ guide, onBack }) {
  const queryClient = useQueryClient();
  const [expandedSections, setExpandedSections] = useState({
    introduction: true,
    historicalContext: false,
    keyCharacters: false,
    keyEvents: false,
    keyScriptures: false,
    keyLocations: false,
    keyLessons: false
  });

  const content = studyGuideContentMap[guide.id];

  // Fetch progress
  const { data: progress } = useQuery({
    queryKey: ['studyProgress', guide.id],
    queryFn: async () => {
      const results = await base44.entities.StudyGuideProgress.filter({
        guide_id: guide.id
      });
      return results[0] || {
        guide_id: guide.id,
        guide_name: guide.title,
        completed_sections: [],
        overall_progress: 0,
        is_completed: false
      };
    }
  });

  // Fetch notes
  const { data: notes = {} } = useQuery({
    queryKey: ['studyNotes', guide.id],
    queryFn: async () => {
      const results = await base44.entities.StudyGuideNote.filter({
        guide_id: guide.id
      });
      const notesMap = {};
      results.forEach(note => {
        const key = `${note.section}-${note.subsection || ''}`;
        notesMap[key] = note.content;
      });
      return notesMap;
    }
  });

  // Mutations
  const updateProgressMutation = useMutation({
    mutationFn: async (newProgress) => {
      if (progress?.id) {
        await base44.entities.StudyGuideProgress.update(progress.id, newProgress);
      } else {
        await base44.entities.StudyGuideProgress.create(newProgress);
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['studyProgress', guide.id])
  });

  const saveNoteMutation = useMutation({
    mutationFn: async ({ section, subsection, content }) => {
      const key = `${section}-${subsection || ''}`;
      const existing = await base44.entities.StudyGuideNote.filter({
        guide_id: guide.id,
        section,
        subsection: subsection || null
      });
      
      if (existing.length > 0) {
        await base44.entities.StudyGuideNote.update(existing[0].id, { content });
      } else {
        await base44.entities.StudyGuideNote.create({
          guide_id: guide.id,
          section,
          subsection: subsection || undefined,
          content
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['studyNotes', guide.id])
  });

  if (!content) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] p-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <p className="text-center text-gray-500 mt-20">Study guide content not found.</p>
      </div>
    );
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleToggleCompletion = (section) => {
    const newCompleted = progress?.completed_sections || [];
    if (newCompleted.includes(section)) {
      newCompleted.splice(newCompleted.indexOf(section), 1);
    } else {
      newCompleted.push(section);
    }
    const newProgress = Math.round((newCompleted.length / 7) * 100);
    updateProgressMutation.mutate({
      guide_id: guide.id,
      guide_name: guide.title,
      completed_sections: newCompleted,
      overall_progress: newProgress,
      is_completed: newProgress === 100
    });
  };

  const handleSaveNote = async (section, subsection, content) => {
    await saveNoteMutation.mutateAsync({ section, subsection, content });
  };

  const getNote = (section, subsection) => {
    const key = `${section}-${subsection || ''}`;
    return notes[key] || '';
  };

  const sections = ['introduction', 'historicalContext', 'keyCharacters', 'keyEvents', 'keyScriptures', 'keyLocations', 'keyLessons'];
  const sectionLabels = ['Introduction', 'Historical Context', 'Key Characters', 'Key Events', 'Key Scriptures', 'Key Locations', 'Key Lessons'];

  const SectionHeader = ({ title, section, isExpanded }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#c9a227] to-[#8fa68a] text-white rounded-lg hover:shadow-lg transition-all duration-300"
    >
      <h2 className="text-lg font-semibold flex items-center gap-3">
        <BookOpen className="w-5 h-5" />
        {title}
      </h2>
      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-gray-600 dark:text-gray-400 hover:text-[#1a1a2e] dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Completion Tracker */}
        {progress && (
          <CompletionTracker
            sections={sectionLabels}
            completedSections={progress.completed_sections}
            onToggleSection={(label) => {
              const sectionKey = sections[sectionLabels.indexOf(label)];
              handleToggleCompletion(sectionKey);
            }}
            overallProgress={progress.overall_progress}
          />
        )}

        {/* Header Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-64 rounded-2xl overflow-hidden mb-6"
        >
          <img
            src={guide.image}
            alt={guide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl font-bold text-white mb-2">{guide.title}</h1>
            <p className="text-white/90">{guide.subtitle}</p>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <SectionHeader title="Introduction" section="introduction" isExpanded={expandedSections.introduction} />
          {expandedSections.introduction && (
            <>
              <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {content.introduction.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </Card>
              <ReflectionPrompt section="Introduction" content={content.introduction.join(' ')} />
              <StudyNotes section="introduction" notes={getNote('introduction')} onSave={(content) => handleSaveNote('introduction', undefined, content)} />
            </>
          )}
        </motion.div>

        {/* Historical Context */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4">
          <SectionHeader title="Historical Context" section="historicalContext" isExpanded={expandedSections.historicalContext} />
          {expandedSections.historicalContext && (
            <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Time Period</h3>
                <p>{content.historicalContext.timePeriod}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Authorship and Sources</h3>
                <p>{content.historicalContext.authorship}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Geographical Settings</h3>
                <p>{content.historicalContext.geography}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Oral Transmission</h3>
                <p>{content.historicalContext.transmission}</p>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Key Characters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4">
          <SectionHeader title="Key Characters" section="keyCharacters" isExpanded={expandedSections.keyCharacters} />
          {expandedSections.keyCharacters && (
            <>
              <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300">
                {content.keyCharacters.map((character, index) => (
                  <div key={index} className="border-l-4 border-[#c9a227] pl-4">
                    <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{character.name}</h3>
                    <p className="text-sm">{character.desc}</p>
                  </div>
                ))}
              </Card>
              <ReflectionPrompt section="Key Characters" content={content.keyCharacters.map(c => c.desc).join(' ')} />
              <StudyNotes section="keyCharacters" notes={getNote('keyCharacters')} onSave={(content) => handleSaveNote('keyCharacters', undefined, content)} />
            </>
          )}
        </motion.div>

        {/* Key Events */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-4">
          <SectionHeader title="Key Events" section="keyEvents" isExpanded={expandedSections.keyEvents} />
          {expandedSections.keyEvents && (
            <>
              <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300">
                {content.keyEvents.map((item, index) => (
                  <div key={index} className="border-l-4 border-[#8fa68a] pl-4">
                    <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{item.event}</h3>
                    <p className="text-sm">{item.desc}</p>
                  </div>
                ))}
              </Card>
              <ReflectionPrompt section="Key Events" content={content.keyEvents.map(e => e.desc).join(' ')} />
              <StudyNotes section="keyEvents" notes={getNote('keyEvents')} onSave={(content) => handleSaveNote('keyEvents', undefined, content)} />
            </>
          )}
        </motion.div>

        {/* Key Scriptures */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4">
          <SectionHeader title="Key Scriptures" section="keyScriptures" isExpanded={expandedSections.keyScriptures} />
          {expandedSections.keyScriptures && (
            <>
              <Card className="p-6 mt-2 space-y-6 text-gray-700 dark:text-gray-300 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                {content.keyScriptures.map((item, index) => (
                  <div key={index}>
                    <p className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{item.verse}</p>
                    <p className="italic mb-2">{item.text}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.insight}</p>
                  </div>
                ))}
              </Card>
              <ReflectionPrompt section="Key Scriptures" content={content.keyScriptures.map(s => s.text).join(' ')} />
              <StudyNotes section="keyScriptures" notes={getNote('keyScriptures')} onSave={(content) => handleSaveNote('keyScriptures', undefined, content)} />
            </>
          )}
        </motion.div>

        {/* Key Locations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-4">
          <SectionHeader title="Key Locations" section="keyLocations" isExpanded={expandedSections.keyLocations} />
          {expandedSections.keyLocations && (
            <>
              <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300">
                {content.keyLocations.map((item, index) => (
                  <div key={index} className="border-l-4 border-[#c9a227] pl-4">
                    <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{item.location}</h3>
                    <p className="text-sm">{item.desc}</p>
                  </div>
                ))}
              </Card>
              <ReflectionPrompt section="Key Locations" content={content.keyLocations.map(l => l.desc).join(' ')} />
              <StudyNotes section="keyLocations" notes={getNote('keyLocations')} onSave={(content) => handleSaveNote('keyLocations', undefined, content)} />
            </>
          )}
        </motion.div>

        {/* Key Lessons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-4">
          <SectionHeader title="Key Lessons" section="keyLessons" isExpanded={expandedSections.keyLessons} />
          {expandedSections.keyLessons && (
            <>
              <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300">
                {content.keyLessons.map((lesson, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">{index + 1}. {lesson.title}</h3>
                    <p className="text-sm">{lesson.desc}</p>
                  </div>
                ))}
              </Card>
              <ReflectionPrompt section="Key Lessons" content={content.keyLessons.map(l => l.desc).join(' ')} />
              <StudyNotes section="keyLessons" notes={getNote('keyLessons')} onSave={(content) => handleSaveNote('keyLessons', undefined, content)} />
            </>
          )}
        </motion.div>

        {/* Conclusion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-6">
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <h2 className="text-lg font-bold text-[#1a1a2e] dark:text-white mb-4">Study Takeaway</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The Book of Genesis serves as the foundation upon which the entire Bible stands. Its narratives about faith, obedience, and redemption remain profoundly relevant today. Genesis invites us to reflect on our place in God's redemptive plan and to embrace the timeless values of faith, obedience, and trust in the sovereign God who created and sustains the universe.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}