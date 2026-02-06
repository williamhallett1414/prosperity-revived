import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import StudyNotes from './StudyNotes';
import AIReflectionQuestions from './AIReflectionQuestions';
import GideonStudyAssistant from './GideonStudyAssistant';

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
  },
  'numbers': {
    introduction: [
      "The Book of Numbers recounts Israel's journey from Mount Sinai to the plains of Moab, chronicling forty years of wilderness wandering. It combines census data, legal material, and narrative accounts of rebellion and God's faithfulness.",
      "Numbers reveals the consequences of unbelief and disobedience, showing how an entire generation missed entering the Promised Land due to their lack of faith. Yet it also demonstrates God's patience and provision during Israel's testing.",
      "The book's name derives from the two censuses conducted—one at the beginning and one at the end of the wilderness period. These censuses organize Israel as a military and religious community prepared for conquest.",
      "Numbers teaches that God's promises are certain, but entering into them requires faith and obedience. The wilderness becomes a testing ground where character is revealed and refined."
    ],
    historicalContext: {
      timePeriod: "Covers approximately 1445-1405 BCE, the forty years Israel spent in the wilderness between Egypt and Canaan.",
      authorship: "Traditionally attributed to Moses, with later editorial additions. Reflects eyewitness accounts of wilderness events.",
      geography: "Journeys from Mount Sinai through various wilderness locations to the plains of Moab east of the Jordan River.",
      transmission: "Preserved as part of the Torah, central to Jewish understanding of God's discipline and faithfulness."
    },
    keyCharacters: [
      { name: 'Moses', desc: 'God\'s chosen leader who intercedes for rebellious Israel and leads them through the wilderness.' },
      { name: 'Aaron', desc: 'The high priest whose authority is challenged but vindicated by God.' },
      { name: 'Miriam', desc: 'Moses\'s sister who challenges his authority and faces consequences.' },
      { name: 'Caleb and Joshua', desc: 'The two faithful spies who trusted God and were allowed to enter Canaan.' },
      { name: 'Korah', desc: 'Leader of a rebellion against Moses and Aaron, judged by God.' },
      { name: 'Balaam', desc: 'A pagan prophet hired to curse Israel but compelled to bless them instead.' }
    ],
    keyEvents: [
      { event: 'The First Census', desc: 'Numbering of Israel\'s fighting men at Mount Sinai.' },
      { event: 'The Twelve Spies', desc: 'Exploration of Canaan resulting in fear and unbelief among ten spies.' },
      { event: 'Rebellion and Judgment', desc: 'Israel refuses to enter Canaan and is sentenced to forty years of wandering.' },
      { event: 'Korah\'s Rebellion', desc: 'Challenge to Moses\'s leadership results in divine judgment.' },
      { event: 'Moses Strikes the Rock', desc: 'Moses\'s disobedience costs him entry into the Promised Land.' },
      { event: 'The Bronze Serpent', desc: 'God provides healing through faith in His provision.' },
      { event: 'Balaam\'s Prophecies', desc: 'God turns intended curses into blessings for Israel.' }
    ],
    keyScriptures: [
      { verse: 'Numbers 14:18', text: '"The Lord is slow to anger, abounding in love and forgiving sin."', insight: 'Reveals God\'s merciful character despite Israel\'s rebellion.' },
      { verse: 'Numbers 23:19', text: '"God is not human, that he should lie...Does he promise and not fulfill?"', insight: 'Affirms God\'s absolute faithfulness to His promises.' },
      { verse: 'Numbers 21:8-9', text: '"Make a snake...anyone who is bitten can look at it and live."', insight: 'Foreshadows Christ lifted up for salvation.' }
    ],
    keyLocations: [
      { location: 'Mount Sinai', desc: 'Starting point of the journey.' },
      { location: 'Kadesh Barnea', desc: 'Where the spies return and Israel rebels.' },
      { location: 'The Wilderness', desc: 'Testing ground for Israel\'s faith.' },
      { location: 'Plains of Moab', desc: 'Final encampment before entering Canaan.' }
    ],
    keyLessons: [
      { title: 'Consequences of Unbelief', desc: 'Lack of faith in God\'s promises leads to missing His blessings.' },
      { title: 'God\'s Provision', desc: 'Even in judgment, God provides for His people\'s needs.' },
      { title: 'Leadership and Authority', desc: 'God establishes authority and defends it against rebellion.' },
      { title: 'The Importance of Faith', desc: 'Faith is essential to entering into God\'s promises.' },
      { title: 'God\'s Patience', desc: 'Despite repeated rebellion, God remains faithful to His covenant.' },
      { title: 'Testing Produces Character', desc: 'Wilderness experiences reveal and refine faith.' }
    ]
  },
  'deuteronomy': {
    introduction: [
      "Deuteronomy consists of Moses's farewell speeches to Israel on the plains of Moab, just before they enter the Promised Land. The name means 'second law,' as Moses restates God's commands for the new generation.",
      "The book reviews Israel's wilderness journey, reiterates the Law, and calls the people to covenant faithfulness. Moses emphasizes that obedience brings blessing while disobedience brings curse.",
      "Deuteronomy's structure resembles ancient Near Eastern treaty documents, establishing the terms of Israel's relationship with God. It emphasizes exclusive loyalty to Yahweh and total commitment to His commands.",
      "The book concludes with Moses's death and Joshua's commissioning, marking the transition to a new era. Deuteronomy profoundly influenced later Jewish and Christian thought, quoted frequently by Jesus."
    ],
    historicalContext: {
      timePeriod: "Set in 1405 BCE on the plains of Moab, immediately before Israel's entry into Canaan.",
      authorship: "Attributed to Moses, though the account of his death was added later. Represents Moses's final teachings.",
      geography: "Delivered on the plains of Moab, east of the Jordan River, overlooking the Promised Land.",
      transmission: "Central to Jewish Torah study and frequently cited throughout Scripture."
    },
    keyCharacters: [
      { name: 'Moses', desc: 'Aging leader delivering final instructions before his death.' },
      { name: 'Joshua', desc: 'Moses\'s successor, commissioned to lead Israel into Canaan.' },
      { name: 'Israel (New Generation)', desc: 'Children of those who died in the wilderness, preparing to enter the land.' },
      { name: 'God', desc: 'The covenant-making God who demands exclusive loyalty.' }
    ],
    keyEvents: [
      { event: 'Review of Wilderness Journey', desc: 'Moses recounts Israel\'s forty years and God\'s faithfulness.' },
      { event: 'Restatement of the Law', desc: 'The Ten Commandments and other laws are repeated and explained.' },
      { event: 'The Shema', desc: 'Declaration of God\'s unity and command to love Him completely.' },
      { event: 'Blessings and Curses', desc: 'Consequences of obedience and disobedience are outlined.' },
      { event: 'Covenant Renewal', desc: 'The new generation commits to the covenant at Moab.' },
      { event: 'Moses\'s Song and Blessing', desc: 'Poetic teaching and blessing upon the twelve tribes.' },
      { event: 'Moses\'s Death', desc: 'Moses views the Promised Land but dies before entering.' }
    ],
    keyScriptures: [
      { verse: 'Deuteronomy 6:4-5', text: '"Hear, O Israel: The Lord our God, the Lord is one. Love the Lord your God with all your heart..."', insight: 'The Shema—core declaration of Jewish faith and Jesus\'s greatest commandment.' },
      { verse: 'Deuteronomy 30:19', text: '"I have set before you life and death...choose life."', insight: 'God offers a clear choice with eternal consequences.' },
      { verse: 'Deuteronomy 8:3', text: '"Man does not live on bread alone but on every word from God."', insight: 'Spiritual nourishment is essential; quoted by Jesus in the wilderness.' }
    ],
    keyLocations: [
      { location: 'Plains of Moab', desc: 'Where Moses delivers his final addresses.' },
      { location: 'Mount Nebo', desc: 'Where Moses views the Promised Land before his death.' },
      { location: 'Jordan River', desc: 'Boundary to be crossed to enter Canaan.' }
    ],
    keyLessons: [
      { title: 'Wholehearted Devotion', desc: 'God demands complete love and loyalty, not divided allegiance.' },
      { title: 'Obedience Brings Blessing', desc: 'Following God\'s commands results in life and prosperity.' },
      { title: 'Remember God\'s Faithfulness', desc: 'Recalling God\'s past actions strengthens present faith.' },
      { title: 'Teach the Next Generation', desc: 'Parents must diligently teach God\'s commands to their children.' },
      { title: 'Choose Life', desc: 'Every generation must choose whether to follow God.' },
      { title: 'Leadership Transition', desc: 'God\'s work continues beyond individual leaders.' }
    ]
  },
  'joshua': {
    introduction: [
      "The Book of Joshua narrates Israel's conquest of Canaan under Joshua's leadership, fulfilling God's promise to Abraham centuries earlier. It demonstrates God's faithfulness and the necessity of courageous faith.",
      "After forty years in the wilderness, the new generation crosses the Jordan River and begins the systematic conquest of the land. Through miraculous victories and strategic campaigns, God gives Israel the land He promised.",
      "Joshua emphasizes the importance of obedience to God's commands and the consequences of compromise. Complete devotion to God results in victory, while disobedience leads to defeat.",
      "The book concludes with the division of land among the tribes and Joshua's challenge to choose whom they will serve, establishing a pattern of covenant renewal that continues throughout Israel's history."
    ],
    historicalContext: {
      timePeriod: "Approximately 1405-1385 BCE, covering the conquest and initial settlement of Canaan.",
      authorship: "Traditionally attributed to Joshua with later editorial additions. Reflects early conquest traditions.",
      geography: "Centers on the land of Canaan, including Jericho, Ai, Gibeon, and various tribal territories.",
      transmission: "Preserved as part of the Former Prophets in the Hebrew Bible, foundational to Israel's national identity."
    },
    keyCharacters: [
      { name: 'Joshua', desc: 'Moses\'s successor who leads Israel in conquering Canaan with faith and courage.' },
      { name: 'Rahab', desc: 'The Canaanite prostitute who hides Israelite spies and is saved for her faith.' },
      { name: 'Achan', desc: 'Israelite who takes forbidden plunder, bringing defeat until his sin is judged.' },
      { name: 'Caleb', desc: 'Faithful spy rewarded with his portion of the land.' },
      { name: 'The Gibeonites', desc: 'Canaanites who deceive Israel into making a treaty.' }
    ],
    keyEvents: [
      { event: 'Crossing the Jordan', desc: 'God miraculously stops the river, allowing Israel to cross on dry ground.' },
      { event: 'Fall of Jericho', desc: 'City walls collapse after Israel marches and shouts in obedience.' },
      { event: 'Defeat at Ai', desc: 'Achan\'s sin causes Israel\'s defeat, teaching the cost of disobedience.' },
      { event: 'Gibeonite Deception', desc: 'Israel makes a treaty without consulting God.' },
      { event: 'The Sun Stands Still', desc: 'God grants Joshua\'s request for extended daylight to complete victory.' },
      { event: 'Division of the Land', desc: 'Canaan is divided among the twelve tribes.' },
      { event: 'Joshua\'s Farewell', desc: 'Joshua challenges Israel to choose whom they will serve.' }
    ],
    keyScriptures: [
      { verse: 'Joshua 1:9', text: '"Be strong and courageous...for the Lord your God will be with you."', insight: 'God\'s presence enables courage in the face of overwhelming challenges.' },
      { verse: 'Joshua 24:15', text: '"Choose for yourselves this day whom you will serve...as for me and my household, we will serve the Lord."', insight: 'Faith requires deliberate choice and commitment.' },
      { verse: 'Joshua 21:45', text: '"Not one of all the Lord\'s good promises to Israel failed."', insight: 'God\'s faithfulness is absolute and complete.' }
    ],
    keyLocations: [
      { location: 'Jericho', desc: 'First city conquered through miraculous divine intervention.' },
      { location: 'Ai', desc: 'Site of initial defeat due to sin, then victory after purification.' },
      { location: 'Gibeon', desc: 'Where the Gibeonites deceive Israel into a treaty.' },
      { location: 'Shiloh', desc: 'Where the Tabernacle is established in the Promised Land.' },
      { location: 'Shechem', desc: 'Site of covenant renewal and Joshua\'s farewell address.' }
    ],
    keyLessons: [
      { title: 'Courageous Faith', desc: 'Following God requires courage to face obstacles and opposition.' },
      { title: 'Complete Obedience', desc: 'Partial obedience is disobedience; God requires full commitment.' },
      { title: 'God Fights for His People', desc: 'Victory comes from God, not human strength or strategy.' },
      { title: 'Sin Affects Community', desc: 'Individual sin has corporate consequences for God\'s people.' },
      { title: 'God\'s Promises Are Sure', desc: 'What God promises, He accomplishes without fail.' },
      { title: 'Choose Wisely', desc: 'Each generation must choose to serve God faithfully.' }
    ]
  },
  'judges': {
    introduction: [
      "The Book of Judges chronicles a dark period in Israel's history when 'everyone did what was right in their own eyes.' It recounts cycles of sin, oppression, repentance, and deliverance under various judges whom God raised up.",
      "After Joshua's death, Israel repeatedly abandons God for idolatry, resulting in oppression by surrounding nations. When they cry out, God mercifully sends deliverers—judges who lead military victories and spiritual renewal.",
      "The book demonstrates the devastating consequences of abandoning God and the importance of godly leadership. Each cycle of rebellion shows Israel's tendency toward spiritual decay without faithful guidance.",
      "Judges ends in moral chaos, setting the stage for Israel's request for a king. It reveals humanity's need for righteous leadership and points toward God's ultimate King."
    ],
    historicalContext: {
      timePeriod: "Approximately 1380-1050 BCE, between Joshua's death and the establishment of the monarchy.",
      authorship: "Anonymous, though traditionally associated with Samuel. Compiled from various sources.",
      geography: "Events occur throughout Canaan as different tribes face threats from surrounding peoples.",
      transmission: "Part of the Former Prophets, illustrating the pattern of covenant faithfulness and failure."
    },
    keyCharacters: [
      { name: 'Deborah', desc: 'Prophet and judge who leads Israel to victory over Canaanite oppression.' },
      { name: 'Gideon', desc: 'Reluctant deliverer who defeats Midian with a small army, demonstrating God\'s power.' },
      { name: 'Samson', desc: 'Nazarite judge with supernatural strength who ultimately defeats the Philistines despite moral failure.' },
      { name: 'Jephthah', desc: 'Outcast who becomes a deliverer but makes a tragic vow.' },
      { name: 'Ruth and Boaz', desc: 'Story of redemption during this chaotic period.' }
    ],
    keyEvents: [
      { event: 'Death of Joshua', desc: 'Israel loses godly leadership and begins cycles of apostasy.' },
      { event: 'Deborah and Barak\'s Victory', desc: 'Defeat of Canaanite oppression through faith and courage.' },
      { event: 'Gideon\'s Three Hundred', desc: 'God reduces Gideon\'s army to show that victory comes from Him.' },
      { event: 'Samson\'s Life and Death', desc: 'Supernatural strength used imperfectly but ultimately defeating Israel\'s enemies.' },
      { event: 'Civil War', desc: 'Moral decay leads to conflict between tribes.' }
    ],
    keyScriptures: [
      { verse: 'Judges 2:10-12', text: '"Another generation grew up who knew neither the Lord nor what he had done for Israel."', insight: 'Failure to pass on faith leads to spiritual decline.' },
      { verse: 'Judges 21:25', text: '"In those days Israel had no king; everyone did as they saw fit."', insight: 'Absence of godly leadership results in moral chaos.' },
      { verse: 'Judges 6:12', text: '"The Lord is with you, mighty warrior."', insight: 'God sees potential and calls the weak to accomplish great things.' }
    ],
    keyLocations: [
      { location: 'Canaan', desc: 'The Promised Land where Israel struggles to remain faithful.' },
      { location: 'Shiloh', desc: 'Location of the Tabernacle during this period.' },
      { location: 'Various Tribal Territories', desc: 'Different regions face different oppressors and deliverers.' }
    ],
    keyLessons: [
      { title: 'Cycles of Sin', desc: 'Without faithfulness, people fall into repeated patterns of rebellion.' },
      { title: 'God\'s Mercy', desc: 'Despite repeated failure, God responds to genuine repentance.' },
      { title: 'Need for Godly Leadership', desc: 'Strong spiritual leadership is essential for community faithfulness.' },
      { title: 'Teach the Next Generation', desc: 'Faith must be intentionally passed to children.' },
      { title: 'God Uses Flawed People', desc: 'God accomplishes His purposes through imperfect instruments.' },
      { title: 'Compromise Leads to Downfall', desc: 'Partial obedience and cultural accommodation result in spiritual decay.' }
    ]
  },
  'ruth': {
    introduction: [
      "The Book of Ruth is a beautiful story of loyalty, redemption, and divine providence set during the chaotic period of the Judges. It follows a Moabite widow who chooses to follow the God of Israel.",
      "Ruth's devotion to her mother-in-law Naomi and her faith in Israel's God lead to her marriage to Boaz, a kinsman-redeemer. This union places Ruth in the lineage of King David and ultimately Jesus Christ.",
      "Against the backdrop of moral decline in Judges, Ruth shines as an example of covenant loyalty, kindness, and faith. The book demonstrates that God's grace extends beyond ethnic Israel to all who trust Him.",
      "Ruth's story reveals God's sovereignty in ordinary events, showing how He orchestrates circumstances to accomplish His redemptive purposes through faithful people."
    ],
    historicalContext: {
      timePeriod: "Set during the time of the Judges (approximately 12th-11th century BCE), though written later.",
      authorship: "Anonymous, though Jewish tradition suggests Samuel. Written to show David's ancestry.",
      geography: "Moves between Moab (east of the Dead Sea) and Bethlehem in Judah.",
      transmission: "Read annually at the Feast of Weeks (Shavuot) in Jewish tradition, celebrating harvest and covenant."
    },
    keyCharacters: [
      { name: 'Ruth', desc: 'Moabite widow who demonstrates extraordinary loyalty and faith in Israel\'s God.' },
      { name: 'Naomi', desc: 'Israelite widow who returns to Bethlehem bitter but finds restoration.' },
      { name: 'Boaz', desc: 'Wealthy landowner who acts as kinsman-redeemer, showing grace and integrity.' },
      { name: 'God', desc: 'The unseen orchestrator of events, working through human faithfulness.' }
    ],
    keyEvents: [
      { event: 'Famine and Loss', desc: 'Naomi\'s family moves to Moab where her husband and sons die.' },
      { event: 'Ruth\'s Commitment', desc: 'Ruth refuses to leave Naomi, pledging loyalty to her and her God.' },
      { event: 'Gleaning in Boaz\'s Field', desc: 'Ruth providentially works in the field of a relative who shows her kindness.' },
      { event: 'The Threshing Floor', desc: 'Ruth appeals to Boaz to act as kinsman-redeemer.' },
      { event: 'Redemption and Marriage', desc: 'Boaz redeems Naomi\'s land and marries Ruth.' },
      { event: 'Birth of Obed', desc: 'Ruth and Boaz\'s son becomes grandfather to King David.' }
    ],
    keyScriptures: [
      { verse: 'Ruth 1:16', text: '"Where you go I will go...your people will be my people and your God my God."', insight: 'Ruth\'s declaration of loyalty and faith, choosing covenant over culture.' },
      { verse: 'Ruth 2:12', text: '"May the Lord repay you for what you have done...under whose wings you have come to take refuge."', insight: 'Recognition that faith in God brings divine reward and protection.' },
      { verse: 'Ruth 4:14', text: '"Praise be to the Lord, who this day has not left you without a guardian-redeemer."', insight: 'Celebration of God\'s redemptive provision through Boaz.' }
    ],
    keyLocations: [
      { location: 'Moab', desc: 'Foreign land where Naomi\'s family seeks refuge during famine.' },
      { location: 'Bethlehem', desc: 'The town where redemption unfolds and David will later be born.' },
      { location: 'The Threshing Floor', desc: 'Place of Ruth\'s appeal and Boaz\'s commitment.' }
    ],
    keyLessons: [
      { title: 'Loyalty and Covenant Love', desc: 'Ruth exemplifies hesed—steadfast, loyal love that reflects God\'s character.' },
      { title: 'God\'s Inclusive Grace', desc: 'God accepts all who come to Him in faith, regardless of ethnic background.' },
      { title: 'Providence in Ordinary Life', desc: 'God works through everyday circumstances to accomplish His purposes.' },
      { title: 'Redemption', desc: 'The kinsman-redeemer foreshadows Christ who redeems His people.' },
      { title: 'Integrity and Character', desc: 'Boaz demonstrates godly character in business and relationships.' },
      { title: 'God Reverses Bitterness', desc: 'Naomi\'s emptiness is transformed into fullness through God\'s provision.' }
    ]
  },
  '1samuel': {
    introduction: [
      "First Samuel chronicles Israel's transition from the period of judges to the monarchy, following the lives of Samuel, Saul, and David. It explores themes of leadership, obedience, and God's sovereign choice.",
      "The book begins with Samuel's miraculous birth and calling as prophet, priest, and judge. Israel demands a king like the surrounding nations, and God grants their request while warning of the consequences.",
      "Saul, Israel's first king, starts promisingly but repeatedly disobeys God, resulting in his rejection. Meanwhile, God chooses David, a shepherd boy, to be Israel's next king.",
      "The narrative demonstrates that God looks at the heart rather than outward appearances. True leadership requires humble obedience to God rather than self-reliant power."
    ],
    historicalContext: {
      timePeriod: "Approximately 1100-1010 BCE, from Samuel's birth through Saul's death.",
      authorship: "Anonymous, though traditionally associated with Samuel and later prophets. Compiled from multiple sources.",
      geography: "Events occur throughout Israel, particularly in Ramah, Shiloh, Gibeah, and the wilderness of Judah.",
      transmission: "Part of the Former Prophets, essential to understanding Israel's monarchy and David's dynasty."
    },
    keyCharacters: [
      { name: 'Samuel', desc: 'Last judge and first prophet, who anoints both Saul and David as kings.' },
      { name: 'Saul', desc: 'First king of Israel whose disobedience leads to rejection and tragic downfall.' },
      { name: 'David', desc: 'Shepherd boy chosen by God to be Israel\'s greatest king.' },
      { name: 'Hannah', desc: 'Samuel\'s mother whose faith and prayer result in his miraculous birth.' },
      { name: 'Jonathan', desc: 'Saul\'s son who forms a covenant friendship with David.' },
      { name: 'Goliath', desc: 'Philistine giant defeated by David in faith and courage.' }
    ],
    keyEvents: [
      { event: 'Hannah\'s Prayer', desc: 'Childless Hannah prays for a son and dedicates him to God.' },
      { event: 'Samuel\'s Calling', desc: 'Young Samuel hears God\'s voice and becomes a prophet.' },
      { event: 'Israel Demands a King', desc: 'Rejecting God\'s direct rule, Israel asks for human monarchy.' },
      { event: 'Saul\'s Anointing', desc: 'Saul is chosen as Israel\'s first king.' },
      { event: 'Saul\'s Disobedience', desc: 'Saul repeatedly disobeys God and is rejected as king.' },
      { event: 'David Anointed', desc: 'Samuel secretly anoints David as future king.' },
      { event: 'David and Goliath', desc: 'David defeats the Philistine champion in faith.' },
      { event: 'Saul\'s Pursuit of David', desc: 'Jealous Saul tries to kill David, who repeatedly spares Saul\'s life.' }
    ],
    keyScriptures: [
      { verse: '1 Samuel 16:7', text: '"The Lord does not look at the things people look at...the Lord looks at the heart."', insight: 'God\'s criteria for leadership differs radically from human standards.' },
      { verse: '1 Samuel 15:22', text: '"To obey is better than sacrifice."', insight: 'God values obedience over religious ritual.' },
      { verse: '1 Samuel 17:47', text: '"The battle is the Lord\'s."', insight: 'Victory belongs to God, not human might.' }
    ],
    keyLocations: [
      { location: 'Shiloh', desc: 'Location of the Tabernacle where Samuel serves.' },
      { location: 'Ramah', desc: 'Samuel\'s hometown and center of his prophetic ministry.' },
      { location: 'Gibeah', desc: 'Saul\'s capital city.' },
      { location: 'The Valley of Elah', desc: 'Where David defeats Goliath.' },
      { location: 'The Wilderness of Judah', desc: 'Where David flees from Saul.' }
    ],
    keyLessons: [
      { title: 'God Looks at the Heart', desc: 'Character and faithfulness matter more than outward appearance or ability.' },
      { title: 'Obedience Over Performance', desc: 'God desires obedience to His commands more than impressive religious acts.' },
      { title: 'Consequences of Compromise', desc: 'Partial obedience and self-reliance lead to spiritual failure.' },
      { title: 'God\'s Sovereignty in Leadership', desc: 'God raises up leaders according to His purposes, not human preference.' },
      { title: 'Faithful Friendship', desc: 'Jonathan and David model covenant loyalty that transcends self-interest.' },
      { title: 'Trust in God\'s Timing', desc: 'David waits for God to establish him as king rather than seizing power.' }
    ]
  },
  '2samuel': {
    introduction: [
      "Second Samuel narrates David's reign as king of Israel, documenting both his triumphs and failures. It shows how David established Jerusalem as Israel's capital and extended the kingdom's borders.",
      "The book presents David as a man after God's own heart who leads Israel to its golden age. Yet it also honestly portrays David's moral failures, particularly his adultery with Bathsheba and murder of Uriah.",
      "God establishes an eternal covenant with David, promising that his dynasty will endure forever—a promise ultimately fulfilled in Jesus Christ, the Son of David.",
      "Second Samuel teaches that even great leaders are flawed, that sin has serious consequences, yet God's grace and purposes prevail through repentance and restoration."
    ],
    historicalContext: {
      timePeriod: "Approximately 1010-970 BCE, covering David's forty-year reign over Israel.",
      authorship: "Anonymous, compiled from court records and prophetic sources. Traditionally associated with Nathan and Gad.",
      geography: "Centers on Jerusalem, which David establishes as Israel's political and religious capital.",
      transmission: "Part of the Former Prophets, foundational to understanding the Davidic covenant central to biblical theology."
    },
    keyCharacters: [
      { name: 'David', desc: 'Israel\'s greatest king who unites the nation and receives God\'s covenant promise.' },
      { name: 'Bathsheba', desc: 'Woman with whom David commits adultery, later mother of Solomon.' },
      { name: 'Nathan', desc: 'Prophet who confronts David about his sin and delivers God\'s covenant promise.' },
      { name: 'Absalom', desc: 'David\'s son who rebels and temporarily seizes the throne.' },
      { name: 'Joab', desc: 'David\'s military commander, loyal yet often violent and self-serving.' },
      { name: 'Uriah', desc: 'Loyal soldier murdered by David to cover his sin with Bathsheba.' }
    ],
    keyEvents: [
      { event: 'David Becomes King', desc: 'David is anointed king over all Israel after Saul\'s death.' },
      { event: 'Capture of Jerusalem', desc: 'David conquers Jerusalem and makes it Israel\'s capital.' },
      { event: 'The Ark Brought to Jerusalem', desc: 'David brings the Ark of the Covenant to Jerusalem with celebration.' },
      { event: 'God\'s Covenant with David', desc: 'God promises David an eternal dynasty.' },
      { event: 'David\'s Sin with Bathsheba', desc: 'David commits adultery and murder, facing severe consequences.' },
      { event: 'Nathan\'s Confrontation', desc: 'The prophet exposes David\'s sin through a parable.' },
      { event: 'Absalom\'s Rebellion', desc: 'David\'s son leads a coup, forcing David to flee Jerusalem.' },
      { event: 'David\'s Return', desc: 'After Absalom\'s defeat, David returns to Jerusalem.' }
    ],
    keyScriptures: [
      { verse: '2 Samuel 7:16', text: '"Your house and your kingdom will endure forever before me."', insight: 'The Davidic covenant promises an eternal kingdom fulfilled in Christ.' },
      { verse: '2 Samuel 12:13', text: '"I have sinned against the Lord."', insight: 'David\'s repentance demonstrates genuine contrition before God.' },
      { verse: '2 Samuel 22:2-3', text: '"The Lord is my rock, my fortress and my deliverer."', insight: 'David\'s psalm of thanksgiving acknowledges God as his strength.' }
    ],
    keyLocations: [
      { location: 'Hebron', desc: 'Where David first reigns over Judah before uniting all Israel.' },
      { location: 'Jerusalem', desc: 'David\'s capital, called the City of David.' },
      { location: 'The Palace', desc: 'Where David\'s sin with Bathsheba occurs.' },
      { location: 'Mahanaim', desc: 'David\'s refuge during Absalom\'s rebellion.' }
    ],
    keyLessons: [
      { title: 'God\'s Covenant Faithfulness', desc: 'God\'s promises endure despite human failure.' },
      { title: 'Sin Has Consequences', desc: 'Even forgiven sin brings painful results.' },
      { title: 'Repentance Restores', desc: 'Genuine repentance brings forgiveness and restoration.' },
      { title: 'Leadership Requires Integrity', desc: 'Moral failure damages families and nations.' },
      { title: 'God\'s Purposes Prevail', desc: 'Despite human sin and rebellion, God\'s plan continues.' },
      { title: 'Grace for the Repentant', desc: 'God shows mercy to those who genuinely turn from sin.' }
    ]
  },
  '1kings': {
    introduction: [
      "First Kings continues Israel's monarchic history from David's death through the division of the kingdom and the ministries of Elijah and Elisha. It chronicles both the glory of Solomon's reign and the tragic split of the nation.",
      "The book begins with Solomon's ascension, his wisdom, and the construction of the Temple in Jerusalem. Yet even Solomon's heart is turned away by foreign wives, leading to idolatry and division.",
      "After Solomon's death, the kingdom splits into northern Israel and southern Judah. The northern kingdom rapidly descends into idolatry under a succession of evil kings.",
      "First Kings emphasizes that covenant faithfulness brings blessing while idolatry and disobedience bring judgment. The prophets, especially Elijah, call the people back to exclusive worship of Yahweh."
    ],
    historicalContext: {
      timePeriod: "Approximately 970-850 BCE, from Solomon's reign through the early divided kingdom period.",
      authorship: "Anonymous, compiled from royal annals and prophetic records. Possibly edited during the Babylonian exile.",
      geography: "Centers on Jerusalem (Judah) and Samaria (Israel), with references to surrounding nations.",
      transmission: "Part of the Former Prophets, explaining the theological reasons for Israel's eventual exile."
    },
    keyCharacters: [
      { name: 'Solomon', desc: 'David\'s son who builds the Temple but later falls into idolatry.' },
      { name: 'Rehoboam', desc: 'Solomon\'s son whose harsh policies split the kingdom.' },
      { name: 'Jeroboam', desc: 'First king of northern Israel who establishes idolatrous worship.' },
      { name: 'Elijah', desc: 'Mighty prophet who confronts Baal worship and calls Israel back to God.' },
      { name: 'Ahab', desc: 'Evil king of Israel married to Jezebel, promoting Baal worship.' },
      { name: 'Jezebel', desc: 'Foreign queen who aggressively promotes idolatry in Israel.' }
    ],
    keyEvents: [
      { event: 'Solomon Becomes King', desc: 'David designates Solomon as his successor.' },
      { event: 'Solomon\'s Wisdom', desc: 'God grants Solomon extraordinary wisdom and wealth.' },
      { event: 'Building the Temple', desc: 'Solomon constructs the magnificent Temple in Jerusalem.' },
      { event: 'The Kingdom Divides', desc: 'Ten tribes break away from Rehoboam, forming northern Israel.' },
      { event: 'Jeroboam\'s Golden Calves', desc: 'The northern king establishes alternative worship centers with idols.' },
      { event: 'Elijah and the Prophets of Baal', desc: 'Elijah confronts false prophets on Mount Carmel.' },
      { event: 'Elijah\'s Flight and Renewal', desc: 'Discouraged Elijah encounters God and receives a new commission.' }
    ],
    keyScriptures: [
      { verse: '1 Kings 3:9', text: '"Give your servant a discerning heart to govern your people."', insight: 'Solomon\'s prayer for wisdom rather than wealth or power.' },
      { verse: '1 Kings 18:21', text: '"How long will you waver between two opinions? If the Lord is God, follow him."', insight: 'Elijah\'s challenge to choose exclusive loyalty to God.' },
      { verse: '1 Kings 19:12', text: '"After the earthquake came a fire, but the Lord was not in the fire. And after the fire came a gentle whisper."', insight: 'God often speaks in quiet, gentle ways rather than dramatic displays.' }
    ],
    keyLocations: [
      { location: 'Jerusalem', desc: 'Capital of united Israel and later Judah, site of Solomon\'s Temple.' },
      { location: 'Samaria', desc: 'Capital of the northern kingdom of Israel.' },
      { location: 'Mount Carmel', desc: 'Where Elijah confronts the prophets of Baal.' },
      { location: 'Mount Horeb', desc: 'Where Elijah encounters God after fleeing Jezebel.' }
    ],
    keyLessons: [
      { title: 'Wisdom from God', desc: 'True wisdom comes from God and should be sought above all else.' },
      { title: 'Dangers of Compromise', desc: 'Even wise leaders can fall through gradual compromise and sin.' },
      { title: 'Exclusive Worship', desc: 'God demands exclusive allegiance; divided loyalty is idolatry.' },
      { title: 'Consequences of Idolatry', desc: 'Turning from God brings judgment and national division.' },
      { title: 'Prophetic Courage', desc: 'God\'s prophets must speak truth even when opposed by powerful rulers.' },
      { title: 'God\'s Faithfulness', desc: 'Despite human failure, God preserves a faithful remnant.' }
    ]
  },
  '2kings': {
    introduction: [
      "Second Kings continues the history of Israel's divided monarchy through both kingdoms' eventual fall into exile. It chronicles the ministries of prophets like Elisha and the tragic consequences of persistent idolatry.",
      "The northern kingdom of Israel falls to Assyria in 722 BCE after generations of wickedness. The southern kingdom of Judah survives longer but ultimately falls to Babylon in 586 BCE.",
      "Throughout this decline, God sends prophets to call the people to repentance. Occasional reforms under righteous kings like Hezekiah and Josiah provide temporary respite but cannot reverse the downward trajectory.",
      "Second Kings demonstrates that covenant unfaithfulness inevitably leads to judgment. Yet even in exile, God's purposes continue, pointing toward future restoration."
    ],
    historicalContext: {
      timePeriod: "Approximately 850-560 BCE, from Elisha's ministry through the Babylonian exile.",
      authorship: "Anonymous compilation from royal chronicles and prophetic records, likely edited during exile.",
      geography: "Events occur in both Israel (north) and Judah (south), with increasing involvement of Assyria and Babylon.",
      transmission: "Part of the Former Prophets, explaining theologically why Israel and Judah went into exile."
    },
    keyCharacters: [
      { name: 'Elisha', desc: 'Elijah\'s successor who performs numerous miracles and guides kings.' },
      { name: 'Hezekiah', desc: 'Righteous king of Judah who trusts God and experiences miraculous deliverance.' },
      { name: 'Josiah', desc: 'Young king who discovers the Law and leads comprehensive reform.' },
      { name: 'Isaiah', desc: 'Prophet who ministers to multiple kings and prophesies deliverance.' },
      { name: 'Nebuchadnezzar', desc: 'Babylonian king who conquers Jerusalem and takes Judah into exile.' }
    ],
    keyEvents: [
      { event: 'Elijah Taken to Heaven', desc: 'Elijah is taken up in a whirlwind, and Elisha receives a double portion of his spirit.' },
      { event: 'Elisha\'s Miracles', desc: 'Numerous healings and miracles demonstrate God\'s power and compassion.' },
      { event: 'Fall of Israel', desc: 'The northern kingdom is conquered by Assyria and exiled.' },
      { event: 'Hezekiah\'s Deliverance', desc: 'Jerusalem is miraculously saved from Assyrian siege.' },
      { event: 'Discovery of the Law', desc: 'During temple repairs, the Book of the Law is found, sparking reform.' },
      { event: 'Josiah\'s Reform', desc: 'Comprehensive religious renewal including Passover celebration.' },
      { event: 'Fall of Jerusalem', desc: 'Babylon conquers Judah, destroys the Temple, and exiles the people.' }
    ],
    keyScriptures: [
      { verse: '2 Kings 17:13-14', text: '"Turn from your evil ways...But they would not listen."', insight: 'Despite repeated warnings, Israel persists in rebellion.' },
      { verse: '2 Kings 19:19', text: '"Deliver us from his hand, so that all the kingdoms of the earth may know that you alone, Lord, are God."', insight: 'Hezekiah\'s prayer acknowledges God\'s uniqueness and power.' },
      { verse: '2 Kings 22:19', text: '"Because your heart was responsive and you humbled yourself before the Lord..."', insight: 'God honors genuine humility and repentance.' }
    ],
    keyLocations: [
      { location: 'Samaria', desc: 'Capital of Israel until its fall to Assyria.' },
      { location: 'Jerusalem', desc: 'Capital of Judah, site of the Temple destroyed by Babylon.' },
      { location: 'Assyria', desc: 'Empire that conquers and exiles northern Israel.' },
      { location: 'Babylon', desc: 'Empire that conquers Judah and destroys Jerusalem.' }
    ],
    keyLessons: [
      { title: 'Persistent Sin Brings Judgment', desc: 'Generations of idolatry result in inevitable exile.' },
      { title: 'God\'s Patience Has Limits', desc: 'God is patient but eventually judges unrepentant sin.' },
      { title: 'Righteous Leadership Matters', desc: 'Good kings bring blessing; evil kings bring curse.' },
      { title: 'Reforms Are Temporary', desc: 'Without heart change, religious reforms don\'t last.' },
      { title: 'God Preserves a Remnant', desc: 'Even in judgment, God maintains a faithful people.' },
      { title: 'Prophets Speak Truth', desc: 'God\'s messengers warn of coming judgment and call to repentance.' }
    ]
  },
  '1chronicles': {
    introduction: [
      "First Chronicles retells Israel's history from Adam to David, focusing particularly on David's reign and preparations for the Temple. Written after the Babylonian exile, it encourages the returning community.",
      "Unlike Samuel and Kings which emphasize political history, Chronicles focuses on religious history—worship, the Temple, and the Levitical priesthood. It presents an idealized portrait of David as model king.",
      "The extensive genealogies connect post-exilic Israel to their ancestors, affirming continuity with God's ancient promises. The emphasis on worship and the Temple encourages rebuilding both physical and spiritual foundations.",
      "Chronicles demonstrates that despite exile and restoration, God's covenant with David endures. The book calls the community to faithfulness, proper worship, and trust in God's unchanging purposes."
    ],
    historicalContext: {
      timePeriod: "Covers biblical history from creation to approximately 1000 BCE, but written around 450-400 BCE after the exile.",
      authorship: "Anonymous, traditionally associated with Ezra. Compiled for the post-exilic community.",
      geography: "Primarily focuses on Jerusalem and Judah, with extensive genealogical connections throughout Israel.",
      transmission: "Preserved as part of the Writings in Hebrew Bible, reinterpreting history for a new generation."
    },
    keyCharacters: [
      { name: 'David', desc: 'Presented as the ideal king who prioritizes worship and prepares for the Temple.' },
      { name: 'The Levites', desc: 'Temple servants and musicians given prominent attention.' },
      { name: 'Nathan', desc: 'Prophet who delivers God\'s covenant promise to David.' },
      { name: 'The Israelite Ancestors', desc: 'Genealogies connecting post-exilic community to ancient promises.' }
    ],
    keyEvents: [
      { event: 'Extensive Genealogies', desc: 'Tracing Israel\'s lineage from Adam through the twelve tribes.' },
      { event: 'David Established as King', desc: 'David\'s anointing and military victories.' },
      { event: 'Bringing the Ark to Jerusalem', desc: 'The Ark is brought with celebration and proper worship.' },
      { event: 'David\'s Desire to Build the Temple', desc: 'God denies David\'s request but promises his son will build it.' },
      { event: 'Organizing Temple Worship', desc: 'David establishes orders of priests, Levites, and musicians.' },
      { event: 'Preparations for the Temple', desc: 'David gathers materials and resources for Solomon to build.' }
    ],
    keyScriptures: [
      { verse: '1 Chronicles 16:34', text: '"Give thanks to the Lord, for he is good; his love endures forever."', insight: 'Refrain emphasizing God\'s steadfast love and faithfulness.' },
      { verse: '1 Chronicles 29:11', text: '"Yours, Lord, is the greatness and the power and the glory..."', insight: 'David\'s prayer acknowledging God\'s absolute sovereignty.' },
      { verse: '1 Chronicles 28:9', text: '"Acknowledge the God of your father, and serve him with wholehearted devotion."', insight: 'David\'s charge to Solomon emphasizes complete commitment.' }
    ],
    keyLocations: [
      { location: 'Jerusalem', desc: 'David\'s capital and future site of the Temple.' },
      { location: 'The Tabernacle', desc: 'Temporary worship center until the Temple is built.' }
    ],
    keyLessons: [
      { title: 'Continuity with the Past', desc: 'God\'s faithfulness connects generations through covenant promises.' },
      { title: 'Priority of Worship', desc: 'Proper worship of God should be central to community life.' },
      { title: 'Preparation for the Future', desc: 'One generation prepares blessings for the next.' },
      { title: 'God\'s Sovereign Choice', desc: 'God chooses leaders and people according to His purposes.' },
      { title: 'Wholehearted Service', desc: 'God desires complete devotion, not halfhearted commitment.' }
    ]
  },
  '2chronicles': {
    introduction: [
      "Second Chronicles continues the history of Judah from Solomon through the Babylonian exile, emphasizing the importance of the Temple, faithful worship, and covenant obedience.",
      "The book focuses almost exclusively on the southern kingdom of Judah, largely ignoring the northern kingdom except where it intersects with Judah's story. This selective focus highlights the Davidic line and Jerusalem's Temple.",
      "Chronicles evaluates each king based on their faithfulness to God and treatment of the Temple. Righteous kings who promote worship experience blessing; idolatrous kings face judgment.",
      "The book ends with Cyrus's decree allowing Jews to return and rebuild the Temple, offering hope that God's purposes for His people continue despite exile."
    ],
    historicalContext: {
      timePeriod: "Covers 970-538 BCE from Solomon to the exile, but written around 450-400 BCE for the post-exilic community.",
      authorship: "Anonymous, possibly Ezra. Written to encourage rebuilding and faithfulness after exile.",
      geography: "Centers on Jerusalem and Judah, with references to surrounding nations that interact with Judah.",
      transmission: "Part of the Writings, providing theological interpretation of Judah's history."
    },
    keyCharacters: [
      { name: 'Solomon', desc: 'Builder of the Temple and wisest king of Israel.' },
      { name: 'Rehoboam', desc: 'Solomon\'s son under whom the kingdom divides.' },
      { name: 'Jehoshaphat', desc: 'Righteous king who seeks God and experiences military victory.' },
      { name: 'Hezekiah', desc: 'Reformer king who cleanses the Temple and trusts God.' },
      { name: 'Josiah', desc: 'Young king who leads the most comprehensive religious reform.' },
      { name: 'The Prophets', desc: 'Messengers who call kings and people to faithfulness.' }
    ],
    keyEvents: [
      { event: 'Building the Temple', desc: 'Solomon constructs the magnificent Temple in Jerusalem.' },
      { event: 'Dedication of the Temple', desc: 'God\'s glory fills the Temple at its dedication.' },
      { event: 'The Kingdom Divides', desc: 'Northern tribes break away from Rehoboam.' },
      { event: 'Jehoshaphat\'s Victory', desc: 'Judah wins battle through worship and trust in God.' },
      { event: 'Hezekiah\'s Passover', desc: 'Revival of Passover celebration and religious renewal.' },
      { event: 'Josiah\'s Reform', desc: 'Discovery of the Law sparks comprehensive religious reform.' },
      { event: 'Fall of Jerusalem', desc: 'Babylon destroys the city and Temple, exiling the people.' },
      { event: 'Cyrus\'s Decree', desc: 'Persian king allows Jews to return and rebuild the Temple.' }
    ],
    keyScriptures: [
      { verse: '2 Chronicles 7:14', text: '"If my people...will humble themselves and pray...then I will hear from heaven and will forgive their sin."', insight: 'God\'s promise to respond to genuine repentance.' },
      { verse: '2 Chronicles 16:9', text: '"The eyes of the Lord range throughout the earth to strengthen those whose hearts are fully committed to him."', insight: 'God seeks and supports wholehearted devotion.' },
      { verse: '2 Chronicles 20:15', text: '"The battle is not yours, but God\'s."', insight: 'Victory comes from trusting God rather than human strength.' }
    ],
    keyLocations: [
      { location: 'Jerusalem', desc: 'Capital of Judah and site of the Temple.' },
      { location: 'The Temple', desc: 'Center of worship and national identity.' },
      { location: 'Babylon', desc: 'Empire that conquers Judah and exiles the people.' }
    ],
    keyLessons: [
      { title: 'Seek God Wholeheartedly', desc: 'God blesses those who pursue Him with complete devotion.' },
      { title: 'Worship Matters', desc: 'Proper worship and Temple service are central to covenant faithfulness.' },
      { title: 'Repentance Brings Restoration', desc: 'God responds to genuine humility and prayer.' },
      { title: 'Leadership Affects Nations', desc: 'Kings\' faithfulness determines the nation\'s spiritual health.' },
      { title: 'God\'s Purposes Endure', desc: 'Even exile cannot thwart God\'s ultimate plan for His people.' }
    ]
  },
  'ezra': {
    introduction: [
      "Ezra chronicles the return of Jewish exiles from Babylon to Jerusalem and the rebuilding of the Temple. It demonstrates God's faithfulness in bringing His people back to their land.",
      "The book divides into two main sections: the return under Zerubbabel and the rebuilding of the Temple, and the return under Ezra and religious reform. Both emphasize restoration of worship and covenant faithfulness.",
      "Opposition from neighboring peoples threatens the rebuilding project, but God enables His people to complete the Temple despite obstacles. Later, Ezra leads spiritual renewal through teaching the Law.",
      "Ezra shows that physical restoration must be accompanied by spiritual renewal. Returning to the land requires returning to God's Word and covenant."
    ],
    historicalContext: {
      timePeriod: "538-458 BCE, covering the initial return and subsequent reforms under Ezra.",
      authorship: "Traditionally attributed to Ezra the scribe, though possibly compiled by others.",
      geography: "Journey from Babylon to Jerusalem; focus on rebuilding Jerusalem and the Temple.",
      transmission: "Part of post-exilic literature encouraging covenant faithfulness after return."
    },
    keyCharacters: [
      { name: 'Zerubbabel', desc: 'Governor who leads the first return and rebuilds the Temple.' },
      { name: 'Ezra', desc: 'Priest and scribe who teaches the Law and leads spiritual reform.' },
      { name: 'Cyrus', desc: 'Persian king who decrees that Jews may return to Jerusalem.' },
      { name: 'Haggai and Zechariah', desc: 'Prophets who encourage the Temple rebuilding project.' }
    ],
    keyEvents: [
      { event: 'Cyrus\'s Decree', desc: 'Persian king allows Jews to return and rebuild the Temple.' },
      { event: 'First Return Under Zerubbabel', desc: 'Nearly 50,000 exiles return to Jerusalem.' },
      { event: 'Foundation of the Temple Laid', desc: 'Work begins on rebuilding the Temple amid celebration and tears.' },
      { event: 'Opposition and Delays', desc: 'Local peoples oppose the building, causing work to stop.' },
      { event: 'Temple Completion', desc: 'Work resumes and the Temple is completed after prophetic encouragement.' },
      { event: 'Ezra\'s Return', desc: 'Ezra leads a second group back with authorization to teach the Law.' },
      { event: 'Reform and Renewal', desc: 'Ezra addresses intermarriage and leads the people in covenant renewal.' }
    ],
    keyScriptures: [
      { verse: 'Ezra 1:2-3', text: '"The Lord...has appointed me to build a temple for him at Jerusalem."', insight: 'God moves pagan kings to accomplish His purposes.' },
      { verse: 'Ezra 7:10', text: '"Ezra had devoted himself to the study and observance of the Law of the Lord, and to teaching."', insight: 'Spiritual leadership requires study, personal obedience, and teaching.' },
      { verse: 'Ezra 9:9', text: '"Though we are slaves, our God has not forsaken us."', insight: 'Even in reduced circumstances, God remains faithful to His people.' }
    ],
    keyLocations: [
      { location: 'Babylon', desc: 'Place of exile from which the Jews return.' },
      { location: 'Jerusalem', desc: 'The rebuilt city and site of the restored Temple.' },
      { location: 'The Temple', desc: 'Rebuilt worship center, though less glorious than Solomon\'s.' }
    ],
    keyLessons: [
      { title: 'God Fulfills Promises', desc: 'God brings His people back from exile as He promised.' },
      { title: 'Worship Must Be Restored', desc: 'Rebuilding the Temple represents recommitment to God.' },
      { title: 'Opposition Will Come', desc: 'God\'s work often faces resistance but will ultimately succeed.' },
      { title: 'The Priority of God\'s Word', desc: 'Spiritual renewal requires teaching and obeying Scripture.' },
      { title: 'Separation from Sin', desc: 'Covenant faithfulness requires rejecting compromise.' }
    ]
  },
  'nehemiah': {
    introduction: [
      "Nehemiah recounts the rebuilding of Jerusalem's walls and the spiritual renewal of the returned Jewish community. It demonstrates how prayer, planning, and perseverance accomplish God's purposes despite opposition.",
      "Nehemiah, a cupbearer to the Persian king, receives permission to return and rebuild Jerusalem's defensive walls. Through wise leadership and dependence on God, the walls are completed in just 52 days.",
      "Beyond physical reconstruction, Nehemiah leads spiritual reforms including public reading of the Law, covenant renewal, and correction of social injustices. He demonstrates that true restoration requires both structure and spirituality.",
      "The book emphasizes the importance of godly leadership, prayer, and commitment to God's Word. Nehemiah models servant leadership that prioritizes God's glory and the people's welfare."
    ],
    historicalContext: {
      timePeriod: "445-425 BCE, approximately 90 years after the first return under Zerubbabel.",
      authorship: "Largely Nehemiah's first-person memoir, possibly edited by later scribes.",
      geography: "Centers on Jerusalem and the surrounding region of Judah under Persian rule.",
      transmission: "Originally combined with Ezra, focusing on physical and spiritual restoration after exile."
    },
    keyCharacters: [
      { name: 'Nehemiah', desc: 'Cupbearer to the king who becomes governor and leads Jerusalem\'s rebuilding.' },
      { name: 'Ezra', desc: 'Priest who reads the Law to the assembled people.' },
      { name: 'Sanballat and Tobiah', desc: 'Local officials who oppose the rebuilding project.' },
      { name: 'Artaxerxes', desc: 'Persian king who authorizes Nehemiah\'s mission.' }
    ],
    keyEvents: [
      { event: 'Nehemiah\'s Prayer', desc: 'Nehemiah weeps and prays for Jerusalem upon hearing of its desolation.' },
      { event: 'Permission Granted', desc: 'The king authorizes Nehemiah to rebuild Jerusalem\'s walls.' },
      { event: 'Surveying the Walls', desc: 'Nehemiah secretly inspects Jerusalem\'s broken walls at night.' },
      { event: 'Rebuilding Despite Opposition', desc: 'Workers build with tools in one hand and weapons in the other.' },
      { event: 'Walls Completed', desc: 'The walls are finished in 52 days, demonstrating God\'s help.' },
      { event: 'Reading of the Law', desc: 'Ezra publicly reads the Law, and the people respond with repentance.' },
      { event: 'Covenant Renewal', desc: 'The community commits to follow God\'s commands.' }
    ],
    keyScriptures: [
      { verse: 'Nehemiah 1:4', text: '"When I heard these things, I sat down and wept...and prayed."', insight: 'Burden for God\'s people leads to prayer and action.' },
      { verse: 'Nehemiah 4:14', text: '"Don\'t be afraid of them. Remember the Lord, who is great and awesome."', insight: 'Courage comes from remembering God\'s character and power.' },
      { verse: 'Nehemiah 8:10', text: '"The joy of the Lord is your strength."', insight: 'Spiritual strength comes from rejoicing in God.' }
    ],
    keyLocations: [
      { location: 'Susa', desc: 'Persian capital where Nehemiah serves the king.' },
      { location: 'Jerusalem', desc: 'The rebuilt city whose walls provide security and identity.' },
      { location: 'The Water Gate', desc: 'Where Ezra reads the Law to the assembled people.' }
    ],
    keyLessons: [
      { title: 'Prayer and Action', desc: 'Effective leadership combines prayer with practical planning.' },
      { title: 'Perseverance Through Opposition', desc: 'God\'s work will face resistance but can be completed through faith.' },
      { title: 'The Power of God\'s Word', desc: 'Public reading and teaching of Scripture brings renewal.' },
      { title: 'Leadership Requires Sacrifice', desc: 'Nehemiah models selfless service for the common good.' },
      { title: 'Community Commitment', desc: 'Rebuilding requires unified effort and mutual support.' },
      { title: 'Joy in the Lord', desc: 'Spiritual joy provides strength for difficult tasks.' }
    ]
  },
  'esther': {
    introduction: [
      "The Book of Esther tells the dramatic story of how a Jewish woman becomes queen of Persia and saves her people from genocide. Though God's name never appears in the book, His providential care is evident throughout.",
      "Set during the Persian exile, Esther shows God's faithfulness to preserve His people even in foreign lands. Through a series of seemingly coincidental events, God positions Esther and Mordecai to deliver the Jews.",
      "The book establishes the feast of Purim, celebrating Jewish deliverance from Haman's plot. It demonstrates that God works behind the scenes through courageous individuals who risk everything for righteousness.",
      "Esther's story encourages believers that God's purposes will prevail even when He seems absent. Providence operates through human courage and moral choices."
    ],
    historicalContext: {
      timePeriod: "Set during the reign of Xerxes I (Ahasuerus) of Persia, approximately 486-465 BCE.",
      authorship: "Anonymous, written to explain the origin of the Purim festival.",
      geography: "Set in Susa, the Persian capital, among the Jewish community in exile.",
      transmission: "Read annually at Purim in Jewish tradition, celebrating God's deliverance."
    },
    keyCharacters: [
      { name: 'Esther', desc: 'Jewish orphan who becomes queen and risks her life to save her people.' },
      { name: 'Mordecai', desc: 'Esther\'s cousin and guardian who uncovers a plot and guides her actions.' },
      { name: 'Haman', desc: 'Pride-filled official who plots to exterminate all Jews.' },
      { name: 'King Xerxes', desc: 'Persian ruler whose edicts determine the fate of nations.' }
    ],
    keyEvents: [
      { event: 'Vashti\'s Removal', desc: 'The queen refuses the king\'s summons and is deposed.' },
      { event: 'Esther Becomes Queen', desc: 'Esther is chosen from among many candidates to be queen.' },
      { event: 'Mordecai Uncovers Plot', desc: 'Mordecai discovers and reports an assassination attempt.' },
      { event: 'Haman\'s Genocidal Decree', desc: 'Haman manipulates the king into ordering Jewish extermination.' },
      { event: 'Esther\'s Courage', desc: 'Esther risks death by approaching the king uninvited.' },
      { event: 'Haman\'s Downfall', desc: 'Haman is executed on the gallows he prepared for Mordecai.' },
      { event: 'The Jews Are Saved', desc: 'A new decree allows Jews to defend themselves.' }
    ],
    keyScriptures: [
      { verse: 'Esther 4:14', text: '"Who knows but that you have come to your royal position for such a time as this?"', insight: 'God positions people strategically for His purposes.' },
      { verse: 'Esther 4:16', text: '"If I perish, I perish."', insight: 'Courageous faith accepts risk for the sake of righteousness.' },
      { verse: 'Esther 9:22', text: '"Days when the Jews got relief from their enemies...from sorrow to joy."', insight: 'God reverses circumstances, turning mourning into celebration.' }
    ],
    keyLocations: [
      { location: 'Susa', desc: 'Persian capital where the royal court and drama unfold.' },
      { location: 'The Royal Palace', desc: 'Setting for Esther\'s rise and courageous advocacy.' }
    ],
    keyLessons: [
      { title: 'God\'s Hidden Providence', desc: 'God works through circumstances even when unseen.' },
      { title: 'Courage in Crisis', desc: 'Faith requires courageous action at critical moments.' },
      { title: 'Pride Leads to Downfall', desc: 'Haman\'s pride results in his destruction.' },
      { title: 'Divine Positioning', desc: 'God places people strategically for His purposes.' },
      { title: 'Reversal of Fortune', desc: 'God can turn desperate situations into deliverance.' },
      { title: 'Community Solidarity', desc: 'Mordecai and Esther demonstrate commitment to their people.' }
    ]
  },
  'job': {
    introduction: [
      "The Book of Job explores the problem of suffering through the story of a righteous man who loses everything. It challenges simplistic explanations that suffering always results from sin.",
      "Job's friends insist he must have sinned to deserve such calamity, but Job maintains his innocence while questioning God's justice. The book grapples honestly with why the righteous suffer.",
      "God's response doesn't answer Job's questions directly but reveals His wisdom, power, and sovereignty over creation. Job learns to trust God's goodness even without understanding His ways.",
      "Job teaches that suffering doesn't always have neat explanations, that questioning God is permitted, and that God's wisdom infinitely exceeds human comprehension. Trust in God's character is essential when His actions seem incomprehensible."
    ],
    historicalContext: {
      timePeriod: "Setting unclear, possibly patriarchal period (2000-1800 BCE). Book written much later, possibly 6th-4th century BCE.",
      authorship: "Anonymous. The poetic dialogue and prose framework suggest sophisticated literary composition.",
      geography: "Set in the land of Uz, possibly Edom or northern Arabia, outside Israel proper.",
      transmission: "Part of the Wisdom literature, addressing universal questions of suffering and divine justice."
    },
    keyCharacters: [
      { name: 'Job', desc: 'Righteous man who suffers catastrophic loss yet maintains faith in God.' },
      { name: 'Eliphaz, Bildad, and Zophar', desc: 'Job\'s friends who offer conventional wisdom about suffering and sin.' },
      { name: 'Elihu', desc: 'Younger man who offers a different perspective on suffering.' },
      { name: 'Satan', desc: 'The Accuser who challenges Job\'s motives for serving God.' },
      { name: 'God', desc: 'The sovereign Creator whose wisdom surpasses human understanding.' }
    ],
    keyEvents: [
      { event: 'Job\'s Prosperity', desc: 'Job is described as blameless, wealthy, and blessed with family.' },
      { event: 'Satan\'s Challenge', desc: 'Satan claims Job serves God only for blessings, not genuine devotion.' },
      { event: 'Job\'s Losses', desc: 'Job loses wealth, children, and health in rapid succession.' },
      { event: 'Friends\' Visits', desc: 'Three friends come to comfort but instead accuse Job of hidden sin.' },
      { event: 'Job\'s Defense', desc: 'Job maintains innocence while questioning God\'s justice.' },
      { event: 'God\'s Response', desc: 'God speaks from the whirlwind, revealing His wisdom and power.' },
      { event: 'Job\'s Restoration', desc: 'Job repents in humility; God restores double what he lost.' }
    ],
    keyScriptures: [
      { verse: 'Job 1:21', text: '"The Lord gave and the Lord has taken away; may the name of the Lord be praised."', insight: 'Job worships God even in devastating loss.' },
      { verse: 'Job 19:25', text: '"I know that my redeemer lives."', insight: 'Even in suffering, Job maintains hope in God\'s ultimate justice.' },
      { verse: 'Job 42:2', text: '"I know that you can do all things; no purpose of yours can be thwarted."', insight: 'Job acknowledges God\'s absolute sovereignty.' }
    ],
    keyLocations: [
      { location: 'The Land of Uz', desc: 'Job\'s homeland where the story unfolds.' },
      { location: 'The Ash Heap', desc: 'Where Job sits in mourning and suffering.' }
    ],
    keyLessons: [
      { title: 'Mystery of Suffering', desc: 'Suffering doesn\'t always result from personal sin; some mysteries remain.' },
      { title: 'Worship in Pain', desc: 'True faith worships God even in loss and confusion.' },
      { title: 'God\'s Wisdom Exceeds Ours', desc: 'Human understanding is limited; trust in God\'s character is essential.' },
      { title: 'Honest Questions Allowed', desc: 'God permits honest wrestling with difficult questions.' },
      { title: 'Humility Before God', desc: 'Encountering God leads to humble submission.' },
      { title: 'Ultimate Restoration', desc: 'God can restore what was lost in His perfect timing.' }
    ]
  },
  'ecclesiastes': {
    introduction: [
      "Ecclesiastes presents the reflections of 'the Teacher' (traditionally Solomon) on the meaning of life. It honestly confronts life's apparent meaninglessness and the futility of pursuing satisfaction apart from God.",
      "The Teacher experiments with pleasure, wisdom, work, and wealth—finding all of them ultimately unsatisfying ('vanity' or 'meaningless'). Without God, even good things cannot provide lasting purpose.",
      "Yet the book doesn't end in despair. It concludes that fearing God and keeping His commands is humanity's whole duty. Meaning comes not from achievements or possessions but from relationship with God.",
      "Ecclesiastes provides refreshing honesty about life's difficulties and disappointments. It acknowledges that life 'under the sun' often seems futile, pointing readers toward eternal perspective and reverence for God."
    ],
    historicalContext: {
      timePeriod: "Traditionally set in Solomon's later life (10th century BCE), though likely written later, possibly 5th-3rd century BCE.",
      authorship: "Anonymous sage writing in Solomon's voice, part of wisdom tradition.",
      geography: "Reflects on universal human experience rather than specific geographic setting.",
      transmission: "Part of Wisdom literature and the Five Megillot, read at the Feast of Tabernacles."
    },
    keyCharacters: [
      { name: 'The Teacher (Qoheleth)', desc: 'Wise man reflecting on life\'s meaning through experience and observation.' },
      { name: 'God', desc: 'The one who gives meaning to life and should be feared and obeyed.' }
    ],
    keyEvents: [
      { event: 'Pursuit of Wisdom', desc: 'The Teacher seeks understanding through intellectual pursuit.' },
      { event: 'Pursuit of Pleasure', desc: 'Experimentation with wine, laughter, and entertainment proves empty.' },
      { event: 'Pursuit of Achievement', desc: 'Great works and accomplishments fail to satisfy.' },
      { event: 'Pursuit of Wealth', desc: 'Accumulating riches brings anxiety rather than contentment.' },
      { event: 'Observation of Injustice', desc: 'Recognition that life often seems unfair and meaningless.' },
      { event: 'Conclusion', desc: 'Fear God and keep His commands—this is humanity\'s purpose.' }
    ],
    keyScriptures: [
      { verse: 'Ecclesiastes 1:2', text: '"Meaningless! Meaningless!...Everything is meaningless."', insight: 'Without God, life\'s pursuits ultimately disappoint.' },
      { verse: 'Ecclesiastes 3:1', text: '"There is a time for everything, and a season for every activity."', insight: 'God orders time and events according to His purposes.' },
      { verse: 'Ecclesiastes 12:13', text: '"Fear God and keep his commandments, for this is the duty of all mankind."', insight: 'Life\'s meaning found in reverence for God and obedience.' }
    ],
    keyLocations: [
      { location: 'Under the Sun', desc: 'Repeated phrase describing earthly, temporal existence without eternal perspective.' }
    ],
    keyLessons: [
      { title: 'Life Without God Is Meaningless', desc: 'Pursuits apart from God ultimately fail to satisfy.' },
      { title: 'Enjoy God\'s Gifts', desc: 'Simple pleasures are gifts from God to be enjoyed with gratitude.' },
      { title: 'Accept Life\'s Limitations', desc: 'Human wisdom and control are limited; accept what cannot be changed.' },
      { title: 'Fear God', desc: 'Reverence for God provides life\'s foundation and meaning.' },
      { title: 'Live with Eternity in View', desc: 'Earthly life is brief; eternal perspective is essential.' },
      { title: 'Death Is Certain', desc: 'Mortality should motivate wise living in the present.' }
    ]
  },
  'songofsolomon': {
    introduction: [
      "The Song of Solomon (or Song of Songs) is a collection of love poetry celebrating romantic and sexual love within marriage. It presents human love as a gift from God worthy of celebration.",
      "The book features dialogue between lovers, describing their attraction, courtship, and consummation of marriage. Its frank celebration of physical desire stands unique among biblical books.",
      "Interpreted allegorically throughout history, the Song has been read as representing God's love for Israel or Christ's love for the Church. Yet its primary meaning celebrates the goodness of marital love.",
      "Song of Solomon affirms that sexual desire within marriage is holy and beautiful. It dignifies romantic love and physical intimacy as part of God's good creation."
    ],
    historicalContext: {
      timePeriod: "Traditionally attributed to Solomon (10th century BCE), though date of composition debated.",
      authorship: "Attributed to Solomon, though possibly a later collection using his name.",
      geography: "References locations throughout Israel including Jerusalem, Sharon, and Lebanon.",
      transmission: "Part of the Writings and the Five Megillot, read at Passover in Jewish tradition."
    },
    keyCharacters: [
      { name: 'The Beloved (Woman)', desc: 'The female lover who expresses desire and devotion.' },
      { name: 'The Lover (Man)', desc: 'The male lover who praises his beloved\'s beauty.' },
      { name: 'The Friends', desc: 'Chorus that comments on the relationship.' }
    ],
    keyEvents: [
      { event: 'First Expressions of Love', desc: 'The lovers praise each other\'s beauty and express longing.' },
      { event: 'The Wedding', desc: 'Celebration of the marriage union.' },
      { event: 'Consummation', desc: 'Physical intimacy within marriage is celebrated.' },
      { event: 'Seasons of Distance', desc: 'Temporary separation and longing for reunion.' },
      { event: 'Affirmation of Exclusive Love', desc: 'Commitment to faithful, enduring love.' }
    ],
    keyScriptures: [
      { verse: 'Song of Solomon 8:6-7', text: '"Place me like a seal over your heart...Love is as strong as death."', insight: 'True love is powerful, exclusive, and enduring.' },
      { verse: 'Song of Solomon 2:16', text: '"My beloved is mine and I am his."', insight: 'Mutual belonging characterizes covenant love.' },
      { verse: 'Song of Solomon 8:7', text: '"Many waters cannot quench love; rivers cannot sweep it away."', insight: 'Genuine love cannot be destroyed or purchased.' }
    ],
    keyLocations: [
      { location: 'Jerusalem', desc: 'City where the lovers meet and celebrate their union.' },
      { location: 'Vineyards', desc: 'Setting for romance and courtship.' },
      { location: 'Gardens', desc: 'Places of beauty and intimacy.' }
    ],
    keyLessons: [
      { title: 'Sexuality Is Sacred', desc: 'Physical intimacy within marriage is God\'s good gift to be celebrated.' },
      { title: 'Exclusive Commitment', desc: 'True love requires faithful, exclusive devotion.' },
      { title: 'Mutual Delight', desc: 'Marriage partners should find joy and delight in one another.' },
      { title: 'Love Cannot Be Forced', desc: 'Authentic love develops naturally and cannot be manufactured.' },
      { title: 'Beauty of Romance', desc: 'Romantic expression and courtship are valuable and good.' },
      { title: 'Enduring Commitment', desc: 'Love perseveres through difficulties and changing seasons.' }
    ]
  },
  'isaiah': {
    introduction: [
      "Isaiah is one of the major prophetic books, containing visions and prophecies that span judgment, exile, and restoration. It presents some of Scripture's most profound messianic prophecies.",
      "The book divides into three sections: warnings of judgment (chapters 1-39), promises of comfort (40-55), and visions of future glory (56-66). Isaiah prophesied during critical periods when Assyria and Babylon threatened Judah.",
      "Isaiah emphasizes God's holiness and sovereignty, calling Israel to repentance and faith. The prophet envisions a coming Servant who will suffer for His people's sins—prophecies Christians see fulfilled in Jesus Christ.",
      "The book's themes of judgment and mercy, suffering and glory, make it central to understanding both Old Testament theology and New Testament interpretation of Jesus's mission."
    ],
    historicalContext: {
      timePeriod: "Isaiah ministered approximately 740-680 BCE during the reigns of several Judean kings.",
      authorship: "Isaiah son of Amoz, though scholars debate whether the entire book comes from one author.",
      geography: "Primarily concerns Jerusalem and Judah, with prophecies about surrounding nations.",
      transmission: "Extensively quoted in the New Testament, particularly regarding Christ's identity and mission."
    },
    keyCharacters: [
      { name: 'Isaiah', desc: 'Prophet called by God in a dramatic vision to speak to Judah and Jerusalem.' },
      { name: 'King Ahaz', desc: 'Faithless king who refuses to trust God during crisis.' },
      { name: 'King Hezekiah', desc: 'Righteous king who trusts God and experiences miraculous deliverance.' },
      { name: 'The Suffering Servant', desc: 'Mysterious figure who bears others\' sins—fulfilled in Jesus Christ.' },
      { name: 'God', desc: 'The Holy One of Israel who judges sin but promises ultimate redemption.' }
    ],
    keyEvents: [
      { event: 'Isaiah\'s Vision and Calling', desc: 'Isaiah sees God\'s holiness and is commissioned as prophet.' },
      { event: 'The Immanuel Prophecy', desc: 'Promise that a virgin will conceive and bear a son.' },
      { event: 'Assyrian Threat', desc: 'Isaiah counsels Hezekiah to trust God rather than foreign alliances.' },
      { event: 'Hezekiah\'s Healing', desc: 'God extends Hezekiah\'s life in response to prayer.' },
      { event: 'Promises of Restoration', desc: 'Prophecies of return from exile and future glory.' },
      { event: 'The Suffering Servant', desc: 'Prophecies of one who will suffer for others\' transgressions.' }
    ],
    keyScriptures: [
      { verse: 'Isaiah 6:3', text: '"Holy, holy, holy is the Lord Almighty."', insight: 'Vision of God\'s absolute holiness that defines His nature.' },
      { verse: 'Isaiah 53:5', text: '"He was pierced for our transgressions...by his wounds we are healed."', insight: 'Prophecy of Christ\'s atoning suffering for humanity\'s sin.' },
      { verse: 'Isaiah 40:31', text: '"Those who hope in the Lord will renew their strength."', insight: 'Promise of strength and endurance for those who trust God.' }
    ],
    keyLocations: [
      { location: 'Jerusalem', desc: 'Center of worship and focus of Isaiah\'s ministry.' },
      { location: 'The Temple', desc: 'Where Isaiah receives his calling vision.' },
      { location: 'Babylon', desc: 'Future place of exile prophesied by Isaiah.' }
    ],
    keyLessons: [
      { title: 'God\'s Holiness', desc: 'God\'s absolute holiness demands reverence and purity.' },
      { title: 'Judgment for Sin', desc: 'God will judge persistent rebellion and idolatry.' },
      { title: 'Comfort and Hope', desc: 'Beyond judgment, God promises restoration and redemption.' },
      { title: 'The Suffering Servant', desc: 'Salvation comes through vicarious suffering—fulfilled in Christ.' },
      { title: 'Trust in God Alone', desc: 'Political alliances fail; only God provides true security.' },
      { title: 'Future Glory', desc: 'God will ultimately restore creation and His people to glory.' }
    ]
  },
  'jeremiah': {
    introduction: [
      "Jeremiah prophesied during Judah's final decades before Babylonian exile, warning of coming judgment while offering hope for eventual restoration. His ministry spanned over forty years of rejection and suffering.",
      "Called as a young man, Jeremiah faithfully proclaimed God's word despite opposition, persecution, and despair. He witnessed the fulfillment of his prophecies as Jerusalem fell and the people were exiled.",
      "The book combines oracles of judgment, symbolic actions, biographical narratives, and promises of a new covenant. Jeremiah's emotional struggle and honest prayers make him deeply human and relatable.",
      "Jeremiah introduces the concept of the new covenant—God's promise to write His law on human hearts. This prophecy finds fulfillment in Jesus Christ and the Holy Spirit."
    ],
    historicalContext: {
      timePeriod: "Approximately 627-585 BCE, from Josiah's reign through Jerusalem's fall and aftermath.",
      authorship: "Jeremiah the prophet with assistance from his scribe Baruch. Complex composition history.",
      geography: "Primarily Jerusalem and Judah, with time spent in Egypt after Jerusalem's fall.",
      transmission: "One of the major prophets, extensively read for understanding exile and God's covenant faithfulness."
    },
    keyCharacters: [
      { name: 'Jeremiah', desc: 'The weeping prophet who suffers for proclaiming God\'s unwelcome message.' },
      { name: 'Baruch', desc: 'Jeremiah\'s faithful scribe who records and preserves his prophecies.' },
      { name: 'King Josiah', desc: 'Righteous reformer during whose reign Jeremiah begins his ministry.' },
      { name: 'King Zedekiah', desc: 'Last king of Judah who ignores Jeremiah\'s counsel.' },
      { name: 'Nebuchadnezzar', desc: 'Babylonian king whom God uses as instrument of judgment.' }
    ],
    keyEvents: [
      { event: 'Jeremiah\'s Call', desc: 'God calls Jeremiah as a prophet before birth and commissions him despite youth.' },
      { event: 'Symbolic Actions', desc: 'Jeremiah performs dramatic object lessons (broken pottery, yoke, etc.).' },
      { event: 'Opposition and Persecution', desc: 'Jeremiah faces mockery, imprisonment, and death threats.' },
      { event: 'The Scroll Burned', desc: 'King Jehoiakim burns Jeremiah\'s prophecies in defiance.' },
      { event: 'Fall of Jerusalem', desc: 'Jeremiah\'s prophecies are fulfilled as Babylon conquers the city.' },
      { event: 'Forced to Egypt', desc: 'Jeremiah is taken to Egypt by remnant fleeing Babylon.' }
    ],
    keyScriptures: [
      { verse: 'Jeremiah 1:5', text: '"Before I formed you in the womb I knew you."', insight: 'God has purposes for individuals before birth.' },
      { verse: 'Jeremiah 29:11', text: '"I know the plans I have for you...plans to prosper you and not to harm you."', insight: 'Even in exile, God has good purposes for His people.' },
      { verse: 'Jeremiah 31:33', text: '"I will put my law in their minds and write it on their hearts."', insight: 'The new covenant promises internal transformation through the Spirit.' }
    ],
    keyLocations: [
      { location: 'Jerusalem', desc: 'City that Jeremiah warns but which refuses to repent.' },
      { location: 'The Temple', desc: 'Focus of false confidence; Jeremiah prophesies its destruction.' },
      { location: 'Babylon', desc: 'Instrument of God\'s judgment and place of exile.' },
      { location: 'Egypt', desc: 'Where Jeremiah is forced to live after Jerusalem\'s fall.' }
    ],
    keyLessons: [
      { title: 'Faithful Witness Despite Rejection', desc: 'God\'s messengers must speak truth even when opposed.' },
      { title: 'Judgment Is Certain', desc: 'Persistent sin will be judged; warnings should be heeded.' },
      { title: 'God\'s Plans Include Restoration', desc: 'Beyond judgment lies hope for renewal and return.' },
      { title: 'The New Covenant', desc: 'God promises internal transformation that the old covenant couldn\'t provide.' },
      { title: 'Genuine vs. False Religion', desc: 'External religiosity without heart obedience is worthless.' },
      { title: 'God\'s Sovereignty', desc: 'God controls history and uses nations to accomplish His purposes.' }
    ]
  },
  'lamentations': {
    introduction: [
      "Lamentations is a collection of five poetic laments mourning Jerusalem's destruction by Babylon in 586 BCE. It gives voice to profound grief while maintaining hope in God's compassion.",
      "The poems express raw anguish over the city's fall, the Temple's destruction, and the suffering of the people. Yet even in deepest sorrow, the author affirms God's faithfulness and mercy.",
      "Lamentations demonstrates that honest expression of grief and questioning is appropriate in faith. It doesn't minimize suffering but brings it before God in prayer and protest.",
      "The book's central message—that God's mercies are new every morning—provides hope even in the darkest circumstances. Suffering is acknowledged but not given the final word."
    ],
    historicalContext: {
      timePeriod: "Written shortly after Jerusalem's fall in 586 BCE, during the early exile period.",
      authorship: "Traditionally attributed to Jeremiah, though anonymous. Reflects eyewitness experience.",
      geography: "Mourns the destruction of Jerusalem and the Temple.",
      transmission: "Read annually on Tisha B'Av (Ninth of Av) in Jewish tradition, commemorating the Temple's destruction."
    },
    keyCharacters: [
      { name: 'The Poet', desc: 'Voice expressing the community\'s grief and maintaining hope in God.' },
      { name: 'Jerusalem (Personified)', desc: 'The destroyed city portrayed as a suffering woman.' },
      { name: 'God', desc: 'Both the judge who brought judgment and the source of hope for restoration.' }
    ],
    keyEvents: [
      { event: 'Jerusalem\'s Destruction', desc: 'The city is conquered, burned, and depopulated by Babylon.' },
      { event: 'Temple\'s Destruction', desc: 'God\'s house is destroyed, symbolizing His judgment.' },
      { event: 'Suffering of the People', desc: 'Starvation, violence, and exile afflict the population.' },
      { event: 'Expression of Grief', desc: 'The community mourns their loss and acknowledges sin.' },
      { event: 'Confession of Hope', desc: 'Despite circumstances, faith in God\'s compassion endures.' }
    ],
    keyScriptures: [
      { verse: 'Lamentations 3:22-23', text: '"Because of the Lord\'s great love we are not consumed...his compassions never fail. They are new every morning."', insight: 'Even in judgment, God\'s mercy provides hope for each new day.' },
      { verse: 'Lamentations 3:25', text: '"The Lord is good to those whose hope is in him."', insight: 'Waiting on God in faith brings ultimate goodness.' },
      { verse: 'Lamentations 5:19', text: '"You, Lord, reign forever; your throne endures from generation to generation."', insight: 'God\'s sovereignty remains constant despite human circumstances.' }
    ],
    keyLocations: [
      { location: 'Jerusalem', desc: 'The destroyed city that was once beautiful and glorious.' },
      { location: 'The Temple', desc: 'The destroyed sanctuary that symbolized God\'s presence.' }
    ],
    keyLessons: [
      { title: 'Honest Grief Is Valid', desc: 'Expressing deep sorrow and questioning is appropriate in faith.' },
      { title: 'Sin Has Consequences', desc: 'Judgment came because of persistent covenant unfaithfulness.' },
      { title: 'God\'s Compassion Endures', desc: 'Even in judgment, God\'s mercy provides hope.' },
      { title: 'New Mercies Daily', desc: 'Each day brings fresh opportunities for God\'s grace.' },
      { title: 'Hope Beyond Suffering', desc: 'Present suffering doesn\'t negate future restoration.' },
      { title: 'Community Lament', desc: 'Shared grief and hope strengthen faith in crisis.' }
    ]
  },
  'ezekiel': {
    introduction: [
      "Ezekiel prophesied to Jewish exiles in Babylon, proclaiming both judgment on Jerusalem and hope for future restoration. His vivid visions and dramatic symbolic actions conveyed God's messages powerfully.",
      "The book begins with Ezekiel's extraordinary vision of God's glory and calling as a prophet. He warns that Jerusalem will fall due to persistent idolatry and announces God's judgment on surrounding nations.",
      "After Jerusalem's fall, Ezekiel's message shifts to comfort and restoration. He envisions the valley of dry bones coming to life, a new Temple, and God's return to dwell among His people.",
      "Ezekiel emphasizes individual responsibility before God and the promise of spiritual transformation. God will give His people new hearts and His Spirit, enabling true obedience."
    ],
    historicalContext: {
      timePeriod: "593-571 BCE, during the Babylonian exile, spanning before and after Jerusalem's fall in 586 BCE.",
      authorship: "Ezekiel the priest-prophet, exiled to Babylon in 597 BCE.",
      geography: "Prophesied from Tel Abib in Babylon while focusing on events in Jerusalem.",
      transmission: "Major prophetic book influencing apocalyptic literature and vision of restoration."
    },
    keyCharacters: [
      { name: 'Ezekiel', desc: 'Priest-prophet who receives extraordinary visions and performs symbolic acts.' },
      { name: 'The Exiles', desc: 'Jewish community in Babylon who receive Ezekiel\'s prophecies.' },
      { name: 'God', desc: 'The holy God whose glory departs from the Temple but promises to return.' }
    ],
    keyEvents: [
      { event: 'Ezekiel\'s Call Vision', desc: 'Ezekiel sees God\'s glory on a throne-chariot and is commissioned.' },
      { event: 'Symbolic Acts', desc: 'Ezekiel performs dramatic actions illustrating Jerusalem\'s coming siege.' },
      { event: 'Vision of Temple Idolatry', desc: 'God shows Ezekiel abominations practiced in the Temple.' },
      { event: 'God\'s Glory Departs', desc: 'God\'s presence leaves the Temple due to Israel\'s sin.' },
      { event: 'Fall of Jerusalem', desc: 'News reaches exiles that Jerusalem has fallen as prophesied.' },
      { event: 'Valley of Dry Bones', desc: 'Vision of dead bones coming to life, symbolizing Israel\'s restoration.' },
      { event: 'Vision of New Temple', desc: 'Detailed vision of a restored Temple where God dwells forever.' }
    ],
    keyScriptures: [
      { verse: 'Ezekiel 36:26', text: '"I will give you a new heart and put a new spirit in you."', insight: 'God promises internal transformation, not just external reform.' },
      { verse: 'Ezekiel 37:3', text: '"Son of man, can these bones live?"', insight: 'God can restore life to what appears dead and hopeless.' },
      { verse: 'Ezekiel 18:20', text: '"The one who sins is the one who will die."', insight: 'Individual responsibility before God; each person accountable for their choices.' }
    ],
    keyLocations: [
      { location: 'Tel Abib (Babylon)', desc: 'Jewish settlement where Ezekiel ministers to exiles.' },
      { location: 'Jerusalem', desc: 'City whose destruction Ezekiel prophesies and mourns.' },
      { location: 'The Temple', desc: 'From which God\'s glory departs and to which it will return.' },
      { location: 'The Valley', desc: 'Vision setting where dry bones come to life.' }
    ],
    keyLessons: [
      { title: 'God\'s Glory and Holiness', desc: 'God\'s majestic holiness demands reverence and obedience.' },
      { title: 'Individual Responsibility', desc: 'Each person is accountable for their own choices before God.' },
      { title: 'Transformation from Within', desc: 'God promises new hearts and His Spirit for genuine change.' },
      { title: 'Resurrection Hope', desc: 'God can bring life from death and restore what seems impossible.' },
      { title: 'God\'s Presence', desc: 'God will dwell among His people in ultimate restoration.' },
      { title: 'Judgment Then Restoration', desc: 'God judges sin but ultimately restores His repentant people.' }
    ]
  },
  'daniel': {
    introduction: [
      "Daniel recounts the experiences of Jewish exiles in Babylon who remain faithful to God despite pressure to compromise. It combines narratives of God's deliverance with apocalyptic visions of future kingdoms.",
      "The first half presents stories of Daniel and his friends maintaining covenant faithfulness in a pagan empire. God vindicates their faith through miraculous deliverances and promotions to high positions.",
      "The second half contains Daniel's visions of successive world empires and the ultimate establishment of God's eternal kingdom. These prophecies have influenced apocalyptic thought throughout history.",
      "Daniel teaches that God is sovereign over all earthly kingdoms and will ultimately establish His rule. Faithfulness to God, even unto death, is required and will be vindicated."
    ],
    historicalContext: {
      timePeriod: "Set during Babylonian and early Persian periods (605-530 BCE), though book likely completed later.",
      authorship: "Attributed to Daniel, though scholars debate dating and authorship.",
      geography: "Set in Babylon and later Persia, among the Jewish exile community.",
      transmission: "Canonical in both Jewish and Christian traditions, influential in apocalyptic literature."
    },
    keyCharacters: [
      { name: 'Daniel', desc: 'Young Jewish exile who rises to prominence through wisdom and faithfulness.' },
      { name: 'Shadrach, Meshach, Abednego', desc: 'Daniel\'s friends who refuse to worship idols and are miraculously saved.' },
      { name: 'Nebuchadnezzar', desc: 'Babylonian king who recognizes God\'s sovereignty after humbling experiences.' },
      { name: 'Belshazzar', desc: 'Babylonian ruler during whose feast Daniel interprets the writing on the wall.' },
      { name: 'Darius', desc: 'Persian ruler who unwittingly places Daniel in the lions\' den.' }
    ],
    keyEvents: [
      { event: 'Daniel\'s Training', desc: 'Daniel and friends maintain dietary laws while training in Babylon.' },
      { event: 'Nebuchadnezzar\'s Dream', desc: 'Daniel interprets the king\'s dream of successive kingdoms.' },
      { event: 'The Fiery Furnace', desc: 'Three friends refuse to bow to idol and are miraculously saved.' },
      { event: 'Nebuchadnezzar\'s Madness', desc: 'The king is humbled and learns God\'s sovereignty.' },
      { event: 'The Writing on the Wall', desc: 'Daniel interprets mysterious writing announcing Babylon\'s fall.' },
      { event: 'Daniel in the Lions\' Den', desc: 'Daniel is thrown to lions for prayer but protected by God.' },
      { event: 'Visions of Future Kingdoms', desc: 'Daniel receives prophecies about world empires and God\'s ultimate kingdom.' }
    ],
    keyScriptures: [
      { verse: 'Daniel 3:17-18', text: '"Our God whom we serve is able to deliver us...But if not, we will not serve your gods."', insight: 'Faith trusts God\'s ability but commits to obedience regardless of outcome.' },
      { verse: 'Daniel 2:44', text: '"The God of heaven will set up a kingdom that will never be destroyed."', insight: 'God\'s eternal kingdom will supersede all earthly powers.' },
      { verse: 'Daniel 6:10', text: '"He got down on his knees and prayed, giving thanks to his God, just as he had done before."', insight: 'Faithful prayer continues despite persecution.' }
    ],
    keyLocations: [
      { location: 'Babylon', desc: 'Empire where Daniel serves and receives visions.' },
      { location: 'The Royal Court', desc: 'Where Daniel interprets dreams and rises to power.' },
      { location: 'The Fiery Furnace', desc: 'Where God protects His faithful servants.' },
      { location: 'The Lions\' Den', desc: 'Where Daniel is miraculously preserved.' }
    ],
    keyLessons: [
      { title: 'Faithfulness in Exile', desc: 'Believers must remain faithful even in hostile environments.' },
      { title: 'God\'s Sovereignty', desc: 'God rules over all earthly kingdoms and their rise and fall.' },
      { title: 'Courage to Stand', desc: 'Faith requires courage to obey God rather than compromise.' },
      { title: 'God Vindicates Faith', desc: 'God delivers and honors those who remain faithful.' },
      { title: 'God\'s Ultimate Kingdom', desc: 'All earthly kingdoms will pass; only God\'s kingdom endures.' },
      { title: 'Prayer Despite Persecution', desc: 'Maintain spiritual disciplines even when forbidden.' }
    ]
  },
  'hosea': {
    introduction: [
      "Hosea uses the prophet's own marriage to an unfaithful wife as a living parable of Israel's spiritual adultery against God. It's a story of betrayal, judgment, and ultimately, redeeming love.",
      "God commands Hosea to marry Gomer, who repeatedly abandons him for other lovers. This painful relationship illustrates Israel's unfaithfulness through idolatry and their pursuit of foreign alliances.",
      "Despite Israel's betrayal, God promises to pursue and restore His people. Like Hosea redeeming Gomer, God will redeem Israel through judgment and love.",
      "Hosea emphasizes that God desires steadfast love and knowledge of Him more than religious ritual. True relationship with God involves faithful devotion, not mere external compliance."
    ],
    historicalContext: {
      timePeriod: "Approximately 750-722 BCE, during the final decades before Israel's fall to Assyria.",
      authorship: "Hosea son of Beeri, prophet to the northern kingdom of Israel.",
      geography: "Prophesied in northern Israel during political instability and moral decay.",
      transmission: "One of the twelve minor prophets, frequently cited regarding God's covenant love."
    },
    keyCharacters: [
      { name: 'Hosea', desc: 'Prophet whose marriage illustrates God\'s relationship with Israel.' },
      { name: 'Gomer', desc: 'Hosea\'s unfaithful wife representing Israel\'s spiritual adultery.' },
      { name: 'Israel', desc: 'The northern kingdom pursuing idols while claiming to worship God.' },
      { name: 'God', desc: 'The faithful husband who pursues His unfaithful people with relentless love.' }
    ],
    keyEvents: [
      { event: 'Hosea Marries Gomer', desc: 'God commands Hosea to marry a promiscuous woman.' },
      { event: 'Gomer\'s Unfaithfulness', desc: 'Gomer abandons Hosea, mirroring Israel\'s idolatry.' },
      { event: 'Birth of Symbolic Children', desc: 'Children are given names symbolizing judgment and restoration.' },
      { event: 'Redemption of Gomer', desc: 'Hosea buys Gomer back, demonstrating God\'s redeeming love.' },
      { event: 'Prophecies of Judgment', desc: 'God announces coming destruction due to persistent sin.' },
      { event: 'Promises of Restoration', desc: 'Beyond judgment, God promises to heal and restore His people.' }
    ],
    keyScriptures: [
      { verse: 'Hosea 6:6', text: '"I desire mercy, not sacrifice, and acknowledgment of God rather than burnt offerings."', insight: 'God values genuine relationship over external religious ritual.' },
      { verse: 'Hosea 11:8', text: '"How can I give you up...My heart is changed within me."', insight: 'God\'s compassion prevails over His judgment.' },
      { verse: 'Hosea 14:4', text: '"I will heal their waywardness and love them freely."', insight: 'God\'s love is not earned but freely given to the repentant.' }
    ],
    keyLocations: [
      { location: 'Northern Israel', desc: 'The kingdom pursuing idolatry and facing coming judgment.' },
      { location: 'Assyria', desc: 'Foreign power Israel foolishly courts instead of trusting God.' }
    ],
    keyLessons: [
      { title: 'God\'s Faithful Love', desc: 'God loves His people despite their unfaithfulness.' },
      { title: 'Spiritual Adultery', desc: 'Idolatry is betrayal of covenant relationship with God.' },
      { title: 'Knowledge of God', desc: 'True religion involves personal knowledge and relationship with God.' },
      { title: 'Judgment Leads to Restoration', desc: 'God disciplines to bring His people back to Himself.' },
      { title: 'Mercy Over Ritual', desc: 'God desires heartfelt devotion more than external observances.' },
      { title: 'God\'s Pursuing Love', desc: 'God actively seeks to restore wayward people to relationship.' }
    ]
  },
  'joel': {
    introduction: [
      "Joel uses a devastating locust plague as the backdrop for prophecies about the Day of the Lord—a time of judgment and restoration. The plague becomes a call to repentance and a picture of coming judgment.",
      "The prophet calls for national mourning, fasting, and genuine repentance. If the people turn to God wholeheartedly, He promises to restore what the locusts have destroyed.",
      "Joel prophesies the outpouring of God's Spirit on all people, a promise Christians believe was fulfilled at Pentecost. This democratization of the Spirit marks a new era in God's relationship with humanity.",
      "The book emphasizes that sincere repentance—returning to God with all one's heart—brings forgiveness and restoration. God is gracious and compassionate, ready to relent from judgment."
    ],
    historicalContext: {
      timePeriod: "Date debated; possibly 9th century or post-exilic period (5th century BCE).",
      authorship: "Joel son of Pethuel, little known beyond this book.",
      geography: "Concerns Judah and Jerusalem, with universal implications.",
      transmission: "One of the twelve minor prophets, quoted by Peter at Pentecost."
    },
    keyCharacters: [
      { name: 'Joel', desc: 'Prophet who interprets the locust plague as call to repentance.' },
      { name: 'The People of Judah', desc: 'Called to corporate repentance and restoration.' },
      { name: 'God', desc: 'Compassionate judge who desires repentance and promises His Spirit.' }
    ],
    keyEvents: [
      { event: 'The Locust Plague', desc: 'Devastating agricultural disaster that destroys crops.' },
      { event: 'Call to Repentance', desc: 'Joel summons all people to fasting and mourning.' },
      { event: 'God\'s Response', desc: 'God promises to restore and bless the repentant people.' },
      { event: 'Prophecy of the Spirit', desc: 'God will pour out His Spirit on all people.' },
      { event: 'The Day of the Lord', desc: 'Coming judgment and ultimate victory for God\'s people.' }
    ],
    keyScriptures: [
      { verse: 'Joel 2:12-13', text: '"Return to me with all your heart...Rend your heart and not your garments."', insight: 'God desires internal repentance, not external displays.' },
      { verse: 'Joel 2:28', text: '"I will pour out my Spirit on all people."', insight: 'Prophecy of universal Spirit outpouring fulfilled at Pentecost.' },
      { verse: 'Joel 2:32', text: '"Everyone who calls on the name of the Lord will be saved."', insight: 'Salvation is available to all who genuinely seek God.' }
    ],
    keyLocations: [
      { location: 'Judah', desc: 'Land devastated by locusts and called to repentance.' },
      { location: 'Jerusalem', desc: 'Center of worship where people gather for repentance.' },
      { location: 'The Valley of Jehoshaphat', desc: 'Future judgment site for the nations.' }
    ],
    keyLessons: [
      { title: 'Wholehearted Repentance', desc: 'True repentance involves internal heart change, not just external ritual.' },
      { title: 'God\'s Compassion', desc: 'God is gracious and willing to relent from judgment when people repent.' },
      { title: 'Restoration After Judgment', desc: 'God can restore what disaster has destroyed.' },
      { title: 'Universal Spirit', desc: 'God\'s Spirit will be poured out on all believers, not just leaders.' },
      { title: 'The Day of the Lord', desc: 'A future day of judgment and vindication is coming.' }
    ]
  },
  'amos': {
    introduction: [
      "Amos, a shepherd from Judah, prophesied against the northern kingdom of Israel during a time of prosperity and injustice. He condemned social oppression, empty worship, and the exploitation of the poor.",
      "Despite economic success, Israel's society was corrupt—the wealthy oppressed the poor, courts were unjust, and worship was hypocritical. Amos announced that God would judge this injustice severely.",
      "The prophet's message emphasizes that God cares deeply about social justice and ethical treatment of others. Religious ritual without justice is abhorrent to God.",
      "Amos introduced the phrase 'let justice roll on like a river,' calling for systemic righteousness rather than occasional charity. His message remains relevant wherever injustice and religious hypocrisy coexist."
    ],
    historicalContext: {
      timePeriod: "Approximately 760-750 BCE, during Jeroboam II's prosperous but corrupt reign in Israel.",
      authorship: "Amos, a shepherd and fig farmer from Tekoa in Judah who prophesied to northern Israel.",
      geography: "Prophesied in northern Israel, particularly at Bethel, though from southern Judah.",
      transmission: "One of the twelve minor prophets, influential in emphasizing social justice."
    },
    keyCharacters: [
      { name: 'Amos', desc: 'Shepherd-prophet called by God to confront Israel\'s injustice.' },
      { name: 'Jeroboam II', desc: 'King during whose reign prosperity masked moral decay.' },
      { name: 'Amaziah', desc: 'Priest at Bethel who opposes Amos\'s prophecy.' },
      { name: 'The Wealthy Oppressors', desc: 'Those who exploit the poor and pervert justice.' }
    ],
    keyEvents: [
      { event: 'Oracles Against Nations', desc: 'Amos pronounces judgment on surrounding nations, then Israel.' },
      { event: 'Condemnation of Injustice', desc: 'Specific indictments of social and economic oppression.' },
      { event: 'Critique of Empty Worship', desc: 'God rejects Israel\'s festivals and offerings because of injustice.' },
      { event: 'Visions of Judgment', desc: 'Five visions depicting coming destruction.' },
      { event: 'Confrontation with Amaziah', desc: 'The priest tries to silence Amos but fails.' },
      { event: 'Promise of Restoration', desc: 'After judgment, God will restore David\'s fallen kingdom.' }
    ],
    keyScriptures: [
      { verse: 'Amos 5:24', text: '"Let justice roll on like a river, righteousness like a never-failing stream!"', insight: 'God demands systemic justice, not occasional charity.' },
      { verse: 'Amos 5:21-23', text: '"I hate, I despise your religious festivals...Away with the noise of your songs!"', insight: 'Worship without justice is offensive to God.' },
      { verse: 'Amos 3:7', text: '"Surely the Sovereign Lord does nothing without revealing his plan to his servants the prophets."', insight: 'God communicates His intentions through His messengers.' }
    ],
    keyLocations: [
      { location: 'Tekoa', desc: 'Amos\'s hometown in Judah.' },
      { location: 'Bethel', desc: 'Northern kingdom\'s worship center where Amos prophesies.' },
      { location: 'Samaria', desc: 'Capital of Israel condemned for luxury and oppression.' }
    ],
    keyLessons: [
      { title: 'Social Justice Matters to God', desc: 'God cares deeply about how people treat one another, especially the vulnerable.' },
      { title: 'Worship Without Justice Is Hypocrisy', desc: 'Religious observance is meaningless without ethical living.' },
      { title: 'Privilege Brings Responsibility', desc: 'Those with power and wealth are accountable for how they use them.' },
      { title: 'God Judges Injustice', desc: 'Systematic oppression and exploitation will face divine judgment.' },
      { title: 'Prophetic Courage', desc: 'Speaking truth to power requires courage and conviction.' },
      { title: 'Hope Beyond Judgment', desc: 'Even severe judgment isn\'t God\'s final word; restoration follows.' }
    ]
  },
  'obadiah': {
    introduction: [
      "Obadiah, the shortest book in the Old Testament, pronounces God's judgment on Edom for their pride and violence against Judah. It demonstrates that God defends His people and judges their oppressors.",
      "Edom (descendants of Esau) rejoiced when Babylon destroyed Jerusalem and participated in plundering Judah. Obadiah announces that their pride will be humbled and their nation destroyed.",
      "The book's theme is divine justice—those who harm God's people will face consequences. Yet it also promises that God's kingdom will ultimately prevail.",
      "Though brief, Obadiah teaches important lessons about pride, family betrayal, and God's protective care for His covenant people."
    ],
    historicalContext: {
      timePeriod: "Possibly shortly after Jerusalem's fall in 586 BCE, addressing Edom's betrayal.",
      authorship: "Obadiah, about whom nothing else is known.",
      geography: "Concerns Edom (south of the Dead Sea) and its relationship with Judah.",
      transmission: "One of the twelve minor prophets, addressing God's judgment on Israel's enemies."
    },
    keyCharacters: [
      { name: 'Obadiah', desc: 'Prophet announcing judgment on Edom.' },
      { name: 'Edom', desc: 'Nation descended from Esau, representing pride and betrayal.' },
      { name: 'Judah', desc: 'God\'s people whom Edom betrayed in their time of crisis.' }
    ],
    keyEvents: [
      { event: 'Edom\'s Pride', desc: 'Edom trusts in mountain fortresses and security.' },
      { event: 'Betrayal of Judah', desc: 'Edom rejoices at Jerusalem\'s fall and assists enemies.' },
      { event: 'Pronouncement of Judgment', desc: 'God announces Edom will be destroyed for their violence.' },
      { event: 'Promise of Restoration', desc: 'Judah will possess Edom; God\'s kingdom will triumph.' }
    ],
    keyScriptures: [
      { verse: 'Obadiah 1:3-4', text: '"The pride of your heart has deceived you...though you soar like the eagle...I will bring you down."', insight: 'Pride leads to downfall; security apart from God is illusion.' },
      { verse: 'Obadiah 1:15', text: '"As you have done, it will be done to you."', insight: 'God\'s justice ensures people reap what they sow.' },
      { verse: 'Obadiah 1:21', text: '"The kingdom will be the Lord\'s."', insight: 'God\'s ultimate reign will be established.' }
    ],
    keyLocations: [
      { location: 'Edom', desc: 'Mountainous region whose pride and security will be overthrown.' },
      { location: 'Jerusalem', desc: 'City whose destruction Edom exploited.' }
    ],
    keyLessons: [
      { title: 'Pride Precedes Destruction', desc: 'Trusting in human security rather than God leads to downfall.' },
      { title: 'Betrayal Has Consequences', desc: 'Those who harm God\'s people face His judgment.' },
      { title: 'Divine Justice', desc: 'God ensures that actions have appropriate consequences.' },
      { title: 'God Defends His People', desc: 'God protects and vindicates those who belong to Him.' },
      { title: 'God\'s Kingdom Prevails', desc: 'Ultimately, God\'s reign will be established over all.' }
    ]
  },
  'jonah': {
    introduction: [
      "The Book of Jonah tells the story of a reluctant prophet who flees from God's call to preach to Nineveh, Israel's enemy. It's a narrative about God's compassion extending beyond Israel to all nations.",
      "When God calls Jonah to warn Nineveh of judgment, Jonah boards a ship in the opposite direction. God sends a storm, and Jonah is swallowed by a great fish, where he prays and repents.",
      "After being vomited onto shore, Jonah finally preaches to Nineveh, and the entire city repents. But Jonah is angry that God shows mercy to his enemies, revealing his nationalistic prejudice.",
      "The book challenges narrow religious attitudes and demonstrates that God's compassion extends to all people who repent. It teaches that God's mercy should be celebrated, not resented."
    ],
    historicalContext: {
      timePeriod: "Set during Jonah's ministry in the 8th century BCE, possibly during Jeroboam II's reign.",
      authorship: "Anonymous, though features Jonah son of Amittai mentioned in 2 Kings.",
      geography: "Moves from Israel to the sea to Nineveh (Assyrian capital).",
      transmission: "One of the twelve minor prophets, unique for its narrative rather than oracles."
    },
    keyCharacters: [
      { name: 'Jonah', desc: 'Reluctant prophet who flees God\'s call and resents His mercy.' },
      { name: 'The Sailors', desc: 'Pagan mariners who come to fear God through the storm.' },
      { name: 'The King of Nineveh', desc: 'Leads his city in repentance upon hearing God\'s message.' },
      { name: 'God', desc: 'Compassionate and sovereign, pursuing both Jonah and Nineveh.' }
    ],
    keyEvents: [
      { event: 'Jonah Flees', desc: 'Jonah boards a ship to Tarshish, fleeing God\'s presence.' },
      { event: 'The Storm', desc: 'God sends a tempest that threatens the ship.' },
      { event: 'Jonah Thrown Overboard', desc: 'Jonah is cast into the sea, calming the storm.' },
      { event: 'Inside the Fish', desc: 'Jonah spends three days and nights in the fish\'s belly, praying.' },
      { event: 'Jonah Preaches to Nineveh', desc: 'After being vomited out, Jonah warns Nineveh of destruction.' },
      { event: 'Nineveh Repents', desc: 'The entire city, from king to commoner, repents in sackcloth.' },
      { event: 'Jonah\'s Anger', desc: 'Jonah resents God\'s mercy toward Nineveh.' },
      { event: 'The Plant Lesson', desc: 'God uses a plant to teach Jonah about compassion.' }
    ],
    keyScriptures: [
      { verse: 'Jonah 2:9', text: '"Salvation comes from the Lord."', insight: 'Jonah acknowledges in the fish that deliverance belongs to God alone.' },
      { verse: 'Jonah 4:2', text: '"I knew that you are a gracious and compassionate God, slow to anger and abounding in love."', insight: 'Jonah knows God\'s character but resents His mercy toward enemies.' },
      { verse: 'Jonah 3:10', text: '"When God saw what they did and how they turned from their evil ways, he relented."', insight: 'Genuine repentance moves God to show mercy.' }
    ],
    keyLocations: [
      { location: 'Joppa', desc: 'Port city where Jonah boards a ship to flee.' },
      { location: 'The Sea', desc: 'Where God pursues Jonah and demonstrates sovereignty.' },
      { location: 'Nineveh', desc: 'Great Assyrian city that repents at Jonah\'s preaching.' }
    ],
    keyLessons: [
      { title: 'Cannot Flee from God', desc: 'God\'s presence and purposes are inescapable.' },
      { title: 'God\'s Universal Compassion', desc: 'God cares for all nations, not just Israel.' },
      { title: 'Repentance Brings Mercy', desc: 'Genuine turning from evil moves God to show compassion.' },
      { title: 'Confronting Prejudice', desc: 'Believers must confront nationalistic and ethnic prejudices.' },
      { title: 'Second Chances', desc: 'God gives opportunities to fulfill His purposes despite failure.' },
      { title: 'God\'s Patience', desc: 'God is patient with both rebellious prophets and repentant pagans.' }
    ]
  },
  'micah': {
    introduction: [
      "Micah prophesied judgment against both Israel and Judah for social injustice, corrupt leadership, and false worship. Like Amos, he championed the cause of the oppressed and condemned exploitation.",
      "The prophet announced that both Jerusalem and Samaria would fall due to persistent sin. Yet he also promised that a ruler would come from Bethlehem to shepherd God's people—a prophecy Christians see fulfilled in Jesus.",
      "Micah's famous summary of God's requirements—to act justly, love mercy, and walk humbly with God—remains one of Scripture's most concise statements of covenant faithfulness.",
      "The book balances judgment with hope, announcing both the destruction of corrupt society and the eventual restoration under a righteous ruler from David's line."
    ],
    historicalContext: {
      timePeriod: "Approximately 735-700 BCE, contemporary with Isaiah, during the Assyrian threat.",
      authorship: "Micah of Moresheth, a rural prophet addressing both kingdoms.",
      geography: "Prophesied in Judah but addressed both Judah and Israel.",
      transmission: "One of the twelve minor prophets, quoted in Matthew regarding Jesus's birth in Bethlehem."
    },
    keyCharacters: [
      { name: 'Micah', desc: 'Prophet from a small town who confronts urban corruption and injustice.' },
      { name: 'The Oppressors', desc: 'Wealthy and powerful who exploit the poor and pervert justice.' },
      { name: 'The Promised Ruler', desc: 'Future shepherd-king from Bethlehem who will restore Israel.' },
      { name: 'God', desc: 'The just judge who demands righteousness and promises restoration.' }
    ],
    keyEvents: [
      { event: 'Judgment on Samaria', desc: 'Prophecy that Israel\'s capital will be destroyed.' },
      { event: 'Condemnation of Leaders', desc: 'Rulers, prophets, and priests are denounced for corruption.' },
      { event: 'Social Injustice Exposed', desc: 'Exploitation of the poor and vulnerable is detailed.' },
      { event: 'Prophecy of Bethlehem Ruler', desc: 'A future leader will come from David\'s hometown.' },
      { event: 'God\'s Lawsuit', desc: 'God presents His case against Israel for covenant violation.' },
      { event: 'Promise of Restoration', desc: 'Beyond judgment, God will restore and shepherd His flock.' }
    ],
    keyScriptures: [
      { verse: 'Micah 6:8', text: '"What does the Lord require of you? To act justly and to love mercy and to walk humbly with your God."', insight: 'Summarizes covenant faithfulness in ethical and relational terms.' },
      { verse: 'Micah 5:2', text: '"But you, Bethlehem...out of you will come for me one who will be ruler over Israel."', insight: 'Messianic prophecy of Jesus\'s birthplace and identity.' },
      { verse: 'Micah 7:18', text: '"Who is a God like you, who pardons sin...You do not stay angry forever but delight to show mercy."', insight: 'God\'s character is fundamentally merciful and forgiving.' }
    ],
    keyLocations: [
      { location: 'Samaria', desc: 'Capital of northern Israel prophesied to fall.' },
      { location: 'Jerusalem', desc: 'Capital of Judah also facing judgment for corruption.' },
      { location: 'Bethlehem', desc: 'Small town from which the messianic ruler will emerge.' }
    ],
    keyLessons: [
      { title: 'God Demands Justice', desc: 'Social and economic justice are central to covenant faithfulness.' },
      { title: 'False Worship', desc: 'Religious ritual without ethical living is abhorrent to God.' },
      { title: 'Leadership Accountability', desc: 'Those in power will be judged for how they use authority.' },
      { title: 'God\'s Requirements Are Clear', desc: 'Justice, mercy, and humility define true religion.' },
      { title: 'Hope in the Messiah', desc: 'A future righteous ruler will establish God\'s kingdom.' },
      { title: 'God\'s Mercy Triumphs', desc: 'God delights in showing mercy to the repentant.' }
    ]
  },
  'nahum': {
    introduction: [
      "Nahum prophesies the destruction of Nineveh, the Assyrian capital that once repented at Jonah's preaching but has returned to violence and cruelty. The book proclaims God's judgment on oppressive empires.",
      "Assyria had terrorized the ancient Near East for centuries, and Nineveh was its symbol of power and brutality. Nahum announces that God will destroy this seemingly invincible city.",
      "The prophecy was fulfilled in 612 BCE when Babylon and Media conquered Nineveh. The book demonstrates that God judges nations that oppress others and that even the mightiest empires fall before Him.",
      "Nahum provides comfort to oppressed believers, showing that God sees injustice and will ultimately vindicate His people. Evil powers may seem unstoppable, but God's justice prevails."
    ],
    historicalContext: {
      timePeriod: "Approximately 663-612 BCE, between the fall of Thebes and Nineveh's destruction.",
      authorship: "Nahum the Elkoshite, otherwise unknown.",
      geography: "Prophecies against Nineveh, capital of the Assyrian Empire.",
      transmission: "One of the twelve minor prophets, demonstrating God's judgment on oppressive nations."
    },
    keyCharacters: [
      { name: 'Nahum', desc: 'Prophet who announces Nineveh\'s coming destruction.' },
      { name: 'Nineveh (Personified)', desc: 'The violent, oppressive city facing divine judgment.' },
      { name: 'Judah', desc: 'God\'s people who will be delivered from Assyrian oppression.' },
      { name: 'God', desc: 'The righteous judge who will not leave the guilty unpunished.' }
    ],
    keyEvents: [
      { event: 'Declaration of God\'s Character', desc: 'God is slow to anger but will not leave guilt unpunished.' },
      { event: 'Nineveh\'s Crimes Recounted', desc: 'Violence, witchcraft, and oppression are detailed.' },
      { event: 'Vision of Nineveh\'s Fall', desc: 'Vivid description of the city\'s coming destruction.' },
      { event: 'Comfort for Judah', desc: 'Promised deliverance from Assyrian oppression.' }
    ],
    keyScriptures: [
      { verse: 'Nahum 1:3', text: '"The Lord is slow to anger but great in power; the Lord will not leave the guilty unpunished."', insight: 'God\'s patience has limits; justice will be executed.' },
      { verse: 'Nahum 1:7', text: '"The Lord is good, a refuge in times of trouble. He cares for those who trust in him."', insight: 'God protects those who take refuge in Him.' },
      { verse: 'Nahum 1:15', text: '"Look, there on the mountains, the feet of one who brings good news, who proclaims peace!"', insight: 'Announcement of deliverance from oppression.' }
    ],
    keyLocations: [
      { location: 'Nineveh', desc: 'Assyrian capital doomed to destruction for violence and pride.' },
      { location: 'Judah', desc: 'Nation that will be delivered from Assyrian threat.' }
    ],
    keyLessons: [
      { title: 'God Judges Oppression', desc: 'Nations that brutalize others will face divine justice.' },
      { title: 'No Nation Is Invincible', desc: 'Even the mightiest empires fall before God.' },
      { title: 'God Protects His People', desc: 'God is a refuge and defender for those who trust Him.' },
      { title: 'Justice Will Prevail', desc: 'Evil may prosper temporarily, but God\'s judgment is certain.' },
      { title: 'God\'s Patience Has Limits', desc: 'Persistent wickedness eventually faces consequences.' }
    ]
  },
  'habakkuk': {
    introduction: [
      "Habakkuk presents a dialogue between the prophet and God about why evil goes unpunished. The prophet questions why God allows wickedness to prevail in Judah and why He would use an even more wicked nation (Babylon) as His instrument of judgment.",
      "God responds that He is working according to His purposes, and the righteous must live by faith even when His ways seem incomprehensible. Babylon will indeed judge Judah, but Babylon itself will face judgment.",
      "The book concludes with Habakkuk's prayer of faith, declaring he will rejoice in God even if all external circumstances collapse. This represents mature faith that trusts God's character despite confusion about His actions.",
      "Habakkuk teaches that honest questions are acceptable in faith and that trust in God's goodness must persist even when His methods are mysterious. 'The righteous will live by faith' becomes foundational to New Testament theology."
    ],
    historicalContext: {
      timePeriod: "Approximately 605-600 BCE, just before Babylon's conquest of Judah.",
      authorship: "Habakkuk the prophet, about whom little else is known.",
      geography: "Concerns Judah and the looming Babylonian threat.",
      transmission: "One of the twelve minor prophets, influential for its emphasis on faith."
    },
    keyCharacters: [
      { name: 'Habakkuk', desc: 'Prophet who questions God\'s justice and learns to trust.' },
      { name: 'Judah', desc: 'Wicked nation that will face God\'s judgment through Babylon.' },
      { name: 'The Babylonians', desc: 'Ruthless empire God will use as instrument of judgment.' },
      { name: 'God', desc: 'Sovereign judge whose ways transcend human understanding.' }
    ],
    keyEvents: [
      { event: 'Habakkuk\'s First Complaint', desc: 'Why does God tolerate wickedness and injustice in Judah?' },
      { event: 'God\'s First Answer', desc: 'God is raising up Babylon to judge Judah.' },
      { event: 'Habakkuk\'s Second Complaint', desc: 'How can God use a nation more wicked than Judah?' },
      { event: 'God\'s Second Answer', desc: 'The righteous will live by faith; Babylon will also be judged.' },
      { event: 'Woes Against Babylon', desc: 'Five woes pronounce judgment on Babylonian pride and violence.' },
      { event: 'Habakkuk\'s Prayer', desc: 'The prophet commits to trust God regardless of circumstances.' }
    ],
    keyScriptures: [
      { verse: 'Habakkuk 2:4', text: '"The righteous person will live by his faithfulness."', insight: 'Faith in God sustains the righteous through trials; foundational to Paul\'s theology.' },
      { verse: 'Habakkuk 2:20', text: '"The Lord is in his holy temple; let all the earth be silent before him."', insight: 'God\'s sovereignty demands reverent submission.' },
      { verse: 'Habakkuk 3:17-18', text: '"Though the fig tree does not bud...yet I will rejoice in the Lord."', insight: 'True faith rejoices in God despite circumstances.' }
    ],
    keyLocations: [
      { location: 'Judah', desc: 'Nation facing judgment for persistent wickedness.' },
      { location: 'Babylon', desc: 'Rising empire that will judge Judah but also face judgment.' }
    ],
    keyLessons: [
      { title: 'Questions Are Permitted', desc: 'Honest wrestling with God\'s ways is part of mature faith.' },
      { title: 'Live by Faith', desc: 'Trust in God must persist when His actions seem incomprehensible.' },
      { title: 'God\'s Sovereignty', desc: 'God uses even wicked nations to accomplish His purposes.' },
      { title: 'All Are Accountable', desc: 'Both Judah and Babylon face judgment for their wickedness.' },
      { title: 'Joy Independent of Circumstances', desc: 'True faith can rejoice in God regardless of external conditions.' },
      { title: 'God\'s Timing', desc: 'God works according to His timeline, requiring patient faith.' }
    ]
  },
  'zephaniah': {
    introduction: [
      "Zephaniah prophesies the coming Day of the Lord—a time of universal judgment when God will purify His creation. The book announces sweeping devastation followed by restoration for a humble remnant.",
      "Prophesying during Josiah's reign, Zephaniah warns that reform alone cannot avert judgment. Judah's persistent sin requires purging, though God will preserve a faithful remnant.",
      "The book extends judgment beyond Judah to all nations, showing that God's justice is universal. Yet within this dark message shines hope that God will restore a purified people who trust in Him.",
      "Zephaniah emphasizes that the Day of the Lord brings both terror for the proud and joy for the humble. Those who seek the Lord and righteousness will be sheltered in His judgment."
    ],
    historicalContext: {
      timePeriod: "Approximately 640-620 BCE, during King Josiah's reign before his reforms.",
      authorship: "Zephaniah, who traces his lineage back to King Hezekiah.",
      geography: "Concerns Jerusalem and Judah, with oracles against surrounding nations.",
      transmission: "One of the twelve minor prophets, emphasizing the Day of the Lord theme."
    },
    keyCharacters: [
      { name: 'Zephaniah', desc: 'Prophet of royal lineage who announces coming judgment and restoration.' },
      { name: 'Judah', desc: 'Nation facing judgment for syncretism and injustice.' },
      { name: 'The Remnant', desc: 'Humble faithful who will be preserved and restored.' },
      { name: 'God', desc: 'The warrior-judge who will purify creation and rejoice over His people.' }
    ],
    keyEvents: [
      { event: 'Announcement of Universal Judgment', desc: 'The Day of the Lord will sweep away all creation.' },
      { event: 'Judgment on Judah', desc: 'Jerusalem and Judah face destruction for idolatry and violence.' },
      { event: 'Oracles Against Nations', desc: 'Surrounding nations will also face God\'s judgment.' },
      { event: 'Call to Seek the Lord', desc: 'The humble are urged to seek God before judgment comes.' },
      { event: 'Promise to the Remnant', desc: 'God will preserve and restore a purified people.' },
      { event: 'God Rejoices Over His People', desc: 'After judgment, God delights in His restored people.' }
    ],
    keyScriptures: [
      { verse: 'Zephaniah 2:3', text: '"Seek the Lord, all you humble of the land...perhaps you will be sheltered on the day of the Lord\'s anger."', insight: 'Urgency to seek God before judgment arrives.' },
      { verse: 'Zephaniah 3:17', text: '"The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you."', insight: 'God rejoices over His restored people with singing.' },
      { verse: 'Zephaniah 1:14-15', text: '"The great day of the Lord is near...a day of wrath, a day of distress and anguish."', insight: 'The Day of the Lord brings terrifying judgment for the unrepentant.' }
    ],
    keyLocations: [
      { location: 'Jerusalem', desc: 'City facing judgment for corruption and idolatry.' },
      { location: 'Surrounding Nations', desc: 'Philistia, Moab, Ammon, Cush, and Assyria all face judgment.' }
    ],
    keyLessons: [
      { title: 'The Day of the Lord', desc: 'God will judge all creation, purifying it from sin.' },
      { title: 'Seek God Urgently', desc: 'Judgment is coming; people must seek God immediately.' },
      { title: 'Humble Remnant Preserved', desc: 'God saves those who humbly trust in Him.' },
      { title: 'Universal Judgment', desc: 'All nations are accountable to God, not just Israel.' },
      { title: 'Joy After Judgment', desc: 'Beyond purification comes restoration and divine delight.' },
      { title: 'God Rejoices Over His People', desc: 'God takes pleasure in those He has redeemed.' }
    ]
  },
  'haggai': {
    introduction: [
      "Haggai prophesies to the post-exilic community in Jerusalem, calling them to prioritize rebuilding the Temple. The people had returned from Babylon but focused on their own houses while the Temple lay in ruins.",
      "Through Haggai, God challenges their priorities and promises blessing if they put His house first. The brief book contains four messages delivered over four months, motivating the people to resume building.",
      "Haggai emphasizes that spiritual priorities affect material prosperity. When God's people honor Him through worship, He provides for their needs.",
      "The book demonstrates the importance of right priorities and the connection between obedience and blessing. It also contains messianic prophecies about the future glory of God's house."
    ],
    historicalContext: {
      timePeriod: "520 BCE, during the reign of Persian king Darius, approximately 18 years after the first return.",
      authorship: "Haggai the prophet, who ministered alongside Zechariah.",
      geography: "Jerusalem and Judah during the early post-exilic period.",
      transmission: "One of the twelve minor prophets, instrumental in motivating Temple rebuilding."
    },
    keyCharacters: [
      { name: 'Haggai', desc: 'Prophet who calls the people to rebuild the Temple.' },
      { name: 'Zerubbabel', desc: 'Governor of Judah who leads the rebuilding project.' },
      { name: 'Joshua (Jeshua)', desc: 'High priest who serves during the restoration.' },
      { name: 'The Returned Exiles', desc: 'Community that has neglected the Temple for their own homes.' }
    ],
    keyEvents: [
      { event: 'Call to Rebuild', desc: 'Haggai challenges the people for neglecting God\'s house.' },
      { event: 'The People Respond', desc: 'Leaders and people obey and resume building work.' },
      { event: 'Encouragement Amid Discouragement', desc: 'God promises His presence and future glory despite present humility.' },
      { event: 'Promise of Blessing', desc: 'God will bless the people once they honor Him.' },
      { event: 'Zerubbabel as Signet Ring', desc: 'God affirms the Davidic line through Zerubbabel.' }
    ],
    keyScriptures: [
      { verse: 'Haggai 1:4', text: '"Is it a time for you yourselves to be living in your paneled houses, while this house remains a ruin?"', insight: 'Challenges wrong priorities—caring for ourselves while neglecting God.' },
      { verse: 'Haggai 2:9', text: '"The glory of this present house will be greater than the glory of the former house."', insight: 'God promises future glory surpassing past splendor.' },
      { verse: 'Haggai 1:5', text: '"Give careful thought to your ways."', insight: 'Self-examination reveals where priorities have gone wrong.' }
    ],
    keyLocations: [
      { location: 'Jerusalem', desc: 'City where the Temple rebuilding project occurs.' },
      { location: 'The Temple Site', desc: 'Ruins that must be rebuilt for God\'s glory.' }
    ],
    keyLessons: [
      { title: 'Prioritize God\'s House', desc: 'God\'s purposes and worship should come before personal comfort.' },
      { title: 'Obedience Brings Blessing', desc: 'When people honor God, He provides for their needs.' },
      { title: 'God\'s Presence Matters', desc: 'God promises to be with those who do His work.' },
      { title: 'Future Glory', desc: 'Present humility doesn\'t limit future blessing and glory.' },
      { title: 'Right Priorities', desc: 'Examining priorities reveals where commitment lies.' },
      { title: 'Divine Encouragement', desc: 'God strengthens those who obey through prophetic encouragement.' }
    ]
  },
  'zechariah': {
    introduction: [
      "Zechariah encouraged the post-exilic community alongside Haggai, providing visions of future hope and messianic prophecies. The book combines immediate encouragement with far-reaching visions of God's ultimate purposes.",
      "The first section presents eight night visions revealing God's plans to restore Jerusalem, judge the nations, and establish His kingdom. These symbolic visions required angelic interpretation.",
      "The second section contains messianic prophecies describing a coming king who is both humble (riding on a donkey) and divine (pierced yet bringing salvation). Christians see these fulfilled in Jesus Christ.",
      "Zechariah emphasizes that God will complete what He started—Jerusalem will be restored, the nations will worship in Zion, and the Messiah will establish God's kingdom on earth."
    ],
    historicalContext: {
      timePeriod: "520-518 BCE, contemporary with Haggai, during Temple rebuilding.",
      authorship: "Zechariah son of Berechiah, prophet and possibly priest.",
      geography: "Post-exilic Jerusalem and Judah, with visions extending to universal scope.",
      transmission: "One of the twelve minor prophets, extensively quoted in the New Testament regarding Jesus."
    },
    keyCharacters: [
      { name: 'Zechariah', desc: 'Priest-prophet who receives visions of restoration and the coming Messiah.' },
      { name: 'Joshua the High Priest', desc: 'Symbolic figure representing Israel\'s cleansing and restoration.' },
      { name: 'Zerubbabel', desc: 'Governor symbolizing the Davidic line and Messianic hope.' },
      { name: 'The Coming King', desc: 'Messianic figure who will be both humble servant and divine ruler.' },
      { name: 'Interpreting Angels', desc: 'Heavenly messengers who explain the visions\' meanings.' }
    ],
    keyEvents: [
      { event: 'Vision of the Horses', desc: 'God\'s agents patrol the earth, reporting on the nations.' },
      { event: 'Vision of Horns and Craftsmen', desc: 'Nations that scattered Judah will themselves be overthrown.' },
      { event: 'Joshua\'s Cleansing', desc: 'The high priest is cleansed, symbolizing Israel\'s purification.' },
      { event: 'The Branch Prophecy', desc: 'Promise of a future Davidic ruler who will build the Temple.' },
      { event: 'Fasting Questioned', desc: 'God desires justice and mercy, not mere ritual fasting.' },
      { event: 'The Humble King', desc: 'Prophecy of a king coming on a donkey, bringing salvation.' },
      { event: 'The Pierced One', desc: 'Vision of one who will be pierced, whom people will mourn.' }
    ],
    keyScriptures: [
      { verse: 'Zechariah 4:6', text: '"Not by might nor by power, but by my Spirit, says the Lord."', insight: 'God accomplishes His purposes through His Spirit, not human strength.' },
      { verse: 'Zechariah 9:9', text: '"Rejoice greatly...your king comes to you, righteous and victorious, lowly and riding on a donkey."', insight: 'Messianic prophecy of Jesus\'s triumphal entry into Jerusalem.' },
      { verse: 'Zechariah 12:10', text: '"They will look on me, the one they have pierced."', insight: 'Prophecy of Christ\'s crucifixion and its impact.' }
    ],
    keyLocations: [
      { location: 'Jerusalem', desc: 'City being rebuilt and destined for future glory.' },
      { location: 'The Temple', desc: 'Being reconstructed and symbolizing God\'s presence.' },
      { location: 'Babylon', desc: 'Place of exile from which God calls His people to return.' }
    ],
    keyLessons: [
      { title: 'God\'s Spirit Empowers', desc: 'God\'s work is accomplished by His Spirit, not human effort.' },
      { title: 'Restoration Is Coming', desc: 'God will complete His restoration of His people and Jerusalem.' },
      { title: 'The Coming Messiah', desc: 'A future king will bring salvation and establish God\'s reign.' },
      { title: 'Justice and Mercy', desc: 'God desires ethical living, not empty religious observance.' },
      { title: 'God Judges the Nations', desc: 'All nations are accountable to God and face judgment.' },
      { title: 'Future Glory', desc: 'Jerusalem will ultimately be exalted as the center of God\'s kingdom.' }
    ]
  },
  'malachi': {
    introduction: [
      "Malachi is the final book of the Old Testament, addressing spiritual apathy and covenant unfaithfulness in post-exilic Judah. The people had returned and rebuilt the Temple, but their worship had become halfhearted and corrupt.",
      "Through a series of questions and answers, God confronts the people's skepticism and challenges their inadequate offerings, corrupt priests, broken marriages, and social injustice.",
      "Malachi promises that God will send a messenger to prepare the way before the Lord comes to His Temple—a prophecy Christians see fulfilled in John the Baptist preparing for Jesus.",
      "The book ends with a warning of judgment and a promise that Elijah will return before the great Day of the Lord. It leaves Israel waiting for the Messiah, a wait that spans the 400 'silent years' until John the Baptist."
    ],
    historicalContext: {
      timePeriod: "Approximately 460-430 BCE, several generations after the return from exile.",
      authorship: "Possibly Malachi (meaning 'my messenger'), though this may be a title rather than a name.",
      geography: "Jerusalem and Judah during the Persian period.",
      transmission: "Final book of the Old Testament, concluding with anticipation of the coming Messiah."
    },
    keyCharacters: [
      { name: 'Malachi', desc: 'Prophet who confronts spiritual apathy and corrupt worship.' },
      { name: 'The Priests', desc: 'Religious leaders offering defiled sacrifices and failing in their duties.' },
      { name: 'The People', desc: 'Community questioning God\'s love and justice while neglecting covenant.' },
      { name: 'God', desc: 'The unchanging covenant God who loves His people but demands faithfulness.' }
    ],
    keyEvents: [
      { event: 'Questioning God\'s Love', desc: 'People doubt God\'s love; He reminds them of choosing Jacob over Esau.' },
      { event: 'Corrupt Sacrifices', desc: 'Priests offer blemished animals, dishonoring God.' },
      { event: 'Broken Marriages', desc: 'Men divorce their wives and marry pagan women.' },
      { event: 'Robbing God', desc: 'People withhold tithes and offerings, testing God\'s patience.' },
      { event: 'The Coming Messenger', desc: 'God promises to send a messenger to prepare His way.' },
      { event: 'Promise of Elijah', desc: 'Elijah will return before the great Day of the Lord.' }
    ],
    keyScriptures: [
      { verse: 'Malachi 3:6', text: '"I the Lord do not change. So you, the descendants of Jacob, are not destroyed."', insight: 'God\'s unchanging nature ensures His covenant faithfulness.' },
      { verse: 'Malachi 3:10', text: '"Bring the whole tithe...and see if I will not...pour out so much blessing."', insight: 'God invites His people to test His faithfulness through generous giving.' },
      { verse: 'Malachi 4:5-6', text: '"I will send the prophet Elijah...he will turn the hearts of the parents to their children."', insight: 'Promise of reconciliation before the Day of the Lord.' }
    ],
    keyLocations: [
      { location: 'The Temple', desc: 'Where corrupt worship occurs and where the Lord will come.' },
      { location: 'Jerusalem', desc: 'Center of the restored community struggling with apathy.' }
    ],
    keyLessons: [
      { title: 'God\'s Unchanging Love', desc: 'Despite questioning, God\'s love for His people endures.' },
      { title: 'Worship Requires Excellence', desc: 'Offering God less than our best dishonors Him.' },
      { title: 'Covenant Faithfulness', desc: 'Marriage and relational commitments matter to God.' },
      { title: 'Generosity and Trust', desc: 'Tithing demonstrates trust in God\'s provision.' },
      { title: 'Coming Messenger', desc: 'God will send forerunners to prepare for His coming.' },
      { title: 'The Day of the Lord', desc: 'A day of judgment and restoration is approaching.' }
    ]
  },
  'mark': {
    introduction: [
      "Mark's Gospel is the shortest and likely earliest of the four gospels, presenting Jesus as the suffering Servant who came to serve and give His life as a ransom. It emphasizes action over lengthy teaching.",
      "Written for a Roman audience, Mark moves quickly from one event to another, using 'immediately' repeatedly. The focus is on Jesus's mighty deeds—healings, exorcisms, and miracles that demonstrate His authority.",
      "Mark portrays Jesus's identity as the Son of God gradually revealed through His works and finally confirmed at the cross. The disciples struggle to understand Jesus's mission until after the resurrection.",
      "The Gospel emphasizes that following Jesus means taking up the cross—suffering and service rather than earthly glory. True discipleship requires denying self and serving others."
    ],
    historicalContext: {
      timePeriod: "Written approximately 65-70 CE, possibly from Rome, during early Christian persecution.",
      authorship: "John Mark, companion of Peter and Paul, though the gospel is anonymous.",
      geography: "Follows Jesus's ministry in Galilee and Judea, culminating in Jerusalem.",
      transmission: "Likely the first gospel written, serving as a source for Matthew and Luke."
    },
    keyCharacters: [
      { name: 'Jesus', desc: 'Presented as the suffering Servant and Son of God who gives His life as ransom.' },
      { name: 'The Disciples', desc: 'Followers who struggle to understand Jesus\'s identity and mission.' },
      { name: 'Peter', desc: 'Prominent disciple whose confession and denials bookend Jesus\'s journey to the cross.' },
      { name: 'The Demons', desc: 'Spiritual forces that recognize Jesus\'s identity even when humans don\'t.' },
      { name: 'The Centurion', desc: 'Roman soldier who confesses Jesus as Son of God at the crucifixion.' }
    ],
    keyEvents: [
      { event: 'John the Baptist', desc: 'Prepares the way for Jesus and baptizes Him.' },
      { event: 'Calling the Disciples', desc: 'Jesus calls fishermen and others to follow Him.' },
      { event: 'Miracles and Healings', desc: 'Numerous demonstrations of Jesus\'s authority over nature, illness, and demons.' },
      { event: 'Peter\'s Confession', desc: 'Peter declares Jesus is the Messiah; Jesus predicts His suffering.' },
      { event: 'The Transfiguration', desc: 'Jesus is revealed in glory to three disciples.' },
      { event: 'The Last Supper', desc: 'Jesus institutes communion and predicts betrayal.' },
      { event: 'Crucifixion', desc: 'Jesus dies on the cross, abandoned by disciples but confessed by a Roman.' },
      { event: 'Resurrection', desc: 'The empty tomb and angelic announcement of Jesus\'s victory.' }
    ],
    keyScriptures: [
      { verse: 'Mark 1:1', text: '"The beginning of the good news about Jesus the Messiah, the Son of God."', insight: 'Mark\'s thesis: Jesus is both Messiah and divine Son.' },
      { verse: 'Mark 10:45', text: '"The Son of Man did not come to be served, but to serve, and to give his life as a ransom."', insight: 'Jesus\'s mission defined: servant leadership and substitutionary sacrifice.' },
      { verse: 'Mark 8:34', text: '"Whoever wants to be my disciple must deny themselves and take up their cross."', insight: 'Following Jesus requires self-denial and willingness to suffer.' }
    ],
    keyLocations: [
      { location: 'Galilee', desc: 'Region of Jesus\'s primary ministry and miracles.' },
      { location: 'Caesarea Philippi', desc: 'Where Peter confesses Jesus as Messiah.' },
      { location: 'Jerusalem', desc: 'City where Jesus is crucified and resurrected.' },
      { location: 'The Temple', desc: 'Site of teaching and confrontation with religious leaders.' },
      { location: 'Golgotha', desc: 'Place of crucifixion where Jesus dies.' }
    ],
    keyLessons: [
      { title: 'Jesus as Suffering Servant', desc: 'Jesus came to serve and suffer, not to be served.' },
      { title: 'Faith and Action', desc: 'Jesus\'s ministry demonstrates God\'s power through mighty acts.' },
      { title: 'Discipleship Costs', desc: 'Following Jesus requires sacrifice and suffering.' },
      { title: 'Gradual Revelation', desc: 'Jesus\'s identity is progressively revealed through words and deeds.' },
      { title: 'Service as Leadership', desc: 'Greatness in God\'s kingdom means serving others.' },
      { title: 'The Cross as Victory', desc: 'Jesus\'s death accomplishes salvation and defeats evil.' }
    ]
  },
  'luke': {
    introduction: [
      "Luke's Gospel presents Jesus as the Savior of all people, emphasizing His compassion for the marginalized—women, children, the poor, and outcasts. Written for a Gentile audience, it presents Jesus's universal mission.",
      "Luke carefully researched eyewitness accounts to provide an orderly narrative of Jesus's life, ministry, death, and resurrection. The Gospel emphasizes prayer, the Holy Spirit, and joy in salvation.",
      "Unique to Luke are parables like the Good Samaritan and Prodigal Son that emphasize God's inclusive grace. The Gospel shows Jesus welcoming those whom society rejected.",
      "Luke traces Jesus's genealogy to Adam, emphasizing His identity as Savior of all humanity. The Gospel concludes with the Great Commission to preach repentance and forgiveness to all nations."
    ],
    historicalContext: {
      timePeriod: "Written approximately 80-90 CE, part of a two-volume work with Acts.",
      authorship: "Luke, a physician and companion of Paul, writing for Gentile Christians.",
      geography: "Follows Jesus from Galilee through an extended journey to Jerusalem.",
      transmission: "One of four canonical gospels, companion volume to Acts of the Apostles."
    },
    keyCharacters: [
      { name: 'Jesus', desc: 'Presented as compassionate Savior who seeks and saves the lost.' },
      { name: 'Mary', desc: 'Mother of Jesus whose song (Magnificat) celebrates God\'s redemption.' },
      { name: 'The Disciples', desc: 'Followers whom Jesus teaches about prayer, service, and mission.' },
      { name: 'The Outcasts', desc: 'Marginalized people whom Jesus welcomes and heals.' },
      { name: 'Zacchaeus', desc: 'Tax collector who encounters Jesus and experiences transformation.' },
      { name: 'The Prodigal Son', desc: 'Parable character representing all who return to the Father.' }
    ],
    keyEvents: [
      { event: 'The Annunciation', desc: 'Angel announces to Mary that she will bear the Messiah.' },
      { event: 'Jesus\'s Birth', desc: 'Shepherds receive angelic announcement of the Savior\'s birth.' },
      { event: 'Jesus\'s Baptism and Temptation', desc: 'Jesus is baptized and tested in the wilderness.' },
      { event: 'Sermon on the Plain', desc: 'Jesus teaches blessings and woes, love for enemies.' },
      { event: 'Parables of Grace', desc: 'Stories of the Good Samaritan, Prodigal Son, and others.' },
      { event: 'Journey to Jerusalem', desc: 'Extended travel narrative with teaching on discipleship.' },
      { event: 'The Last Supper', desc: 'Jesus institutes communion and prepares disciples.' },
      { event: 'Crucifixion and Resurrection', desc: 'Jesus dies and rises, appearing to disciples.' }
    ],
    keyScriptures: [
      { verse: 'Luke 19:10', text: '"The Son of Man came to seek and to save the lost."', insight: 'Jesus\'s mission summarized—active seeking and saving.' },
      { verse: 'Luke 15:7', text: '"There will be more rejoicing in heaven over one sinner who repents."', insight: 'God celebrates when lost people return to Him.' },
      { verse: 'Luke 6:27', text: '"Love your enemies, do good to those who hate you."', insight: 'Radical love transcends natural responses and mirrors God\'s character.' }
    ],
    keyLocations: [
      { location: 'Bethlehem', desc: 'Jesus\'s birthplace, visited by shepherds.' },
      { location: 'Nazareth', desc: 'Jesus\'s hometown where He begins ministry.' },
      { location: 'The Road to Jerusalem', desc: 'Extended journey teaching about discipleship.' },
      { location: 'Jerusalem', desc: 'City where Jesus is crucified and resurrected.' }
    ],
    keyLessons: [
      { title: 'Salvation for All', desc: 'Jesus came to save all people, not just Jews.' },
      { title: 'Compassion for Outcasts', desc: 'Jesus welcomes and restores those society rejects.' },
      { title: 'Prayer and the Spirit', desc: 'Jesus models prayerful dependence and Spirit-empowerment.' },
      { title: 'Costly Grace', desc: 'Salvation is free but discipleship costs everything.' },
      { title: 'Joy in Salvation', desc: 'The gospel brings joy to those who receive it.' },
      { title: 'Reversals of Fortune', desc: 'God lifts up the humble and brings down the proud.' }
    ]
  },
  'acts': {
    introduction: [
      "Acts continues Luke's narrative, chronicling the early Church's growth from Jerusalem to Rome. It shows how the Holy Spirit empowers Jesus's followers to be His witnesses throughout the world.",
      "Beginning with Jesus's ascension and Pentecost, Acts traces the gospel's spread through the apostles' preaching, particularly Peter and Paul. The Church grows despite persecution, moving from Jewish to increasingly Gentile membership.",
      "The book demonstrates how the Spirit guides, empowers, and expands the Church. Major themes include bold witness, miraculous signs, persecution, and the inclusion of Gentiles in God's people.",
      "Acts emphasizes that the Church's mission is global, Spirit-empowered, and unstoppable. Despite opposition, the gospel advances 'to the ends of the earth.'"
    ],
    historicalContext: {
      timePeriod: "Covers approximately 30-62 CE, from Jesus's ascension through Paul's Roman imprisonment.",
      authorship: "Luke, companion of Paul, writing to Theophilus as part two of Luke-Acts.",
      geography: "Moves from Jerusalem through Judea, Samaria, Asia Minor, Greece, and ultimately Rome.",
      transmission: "Canonical history of the early Church, demonstrating the gospel's spread."
    },
    keyCharacters: [
      { name: 'Peter', desc: 'Leading apostle in early chapters who preaches boldly and sees visions.' },
      { name: 'Paul (Saul)', desc: 'Persecutor turned apostle who brings the gospel to Gentiles.' },
      { name: 'The Holy Spirit', desc: 'Divine presence empowering, guiding, and growing the Church.' },
      { name: 'Stephen', desc: 'First Christian martyr whose death sparks persecution.' },
      { name: 'Philip', desc: 'Evangelist who brings the gospel to Samaria and an Ethiopian.' },
      { name: 'Barnabas', desc: 'Encourager who mentors Paul and promotes unity.' }
    ],
    keyEvents: [
      { event: 'The Ascension', desc: 'Jesus ascends to heaven, promising the Spirit\'s coming.' },
      { event: 'Pentecost', desc: 'The Holy Spirit comes with power, birthing the Church.' },
      { event: 'Peter\'s Sermons', desc: 'Thousands respond to bold gospel proclamation.' },
      { event: 'Stephen\'s Martyrdom', desc: 'First Christian killed for faith, sparking wider persecution.' },
      { event: 'Saul\'s Conversion', desc: 'Persecutor encounters the risen Christ and is transformed.' },
      { event: 'Gentile Inclusion', desc: 'Peter\'s vision and Cornelius\'s conversion open the Church to non-Jews.' },
      { event: 'Paul\'s Missionary Journeys', desc: 'Churches established throughout the Roman Empire.' },
      { event: 'Jerusalem Council', desc: 'Apostles decide Gentiles don\'t need to become Jews to follow Jesus.' }
    ],
    keyScriptures: [
      { verse: 'Acts 1:8', text: '"You will receive power when the Holy Spirit comes on you; and you will be my witnesses."', insight: 'The Spirit empowers global witness from Jerusalem to the ends of the earth.' },
      { verse: 'Acts 4:12', text: '"Salvation is found in no one else, for there is no other name under heaven...by which we must be saved."', insight: 'Jesus is the exclusive means of salvation.' },
      { verse: 'Acts 2:38', text: '"Repent and be baptized...And you will receive the gift of the Holy Spirit."', insight: 'Response to the gospel involves repentance, baptism, and receiving the Spirit.' }
    ],
    keyLocations: [
      { location: 'Jerusalem', desc: 'Starting point where the Church is born at Pentecost.' },
      { location: 'Antioch', desc: 'Where believers are first called Christians and Paul begins mission.' },
      { location: 'Asia Minor', desc: 'Region where Paul establishes numerous churches.' },
      { location: 'Greece', desc: 'Philippi, Thessalonica, Athens, and Corinth receive the gospel.' },
      { location: 'Rome', desc: 'Imperial capital where Paul eventually arrives as prisoner.' }
    ],
    keyLessons: [
      { title: 'The Spirit Empowers Mission', desc: 'The Holy Spirit enables witness and church growth.' },
      { title: 'Bold Witness', desc: 'Believers proclaim Christ courageously despite opposition.' },
      { title: 'Inclusive Gospel', desc: 'Salvation is for all people—Jews and Gentiles alike.' },
      { title: 'Church Overcomes Persecution', desc: 'Opposition cannot stop the gospel\'s advance.' },
      { title: 'Unity in Diversity', desc: 'The Church includes people from all backgrounds.' },
      { title: 'Gospel Reaches the World', desc: 'Christ\'s mission is global, reaching all nations.' }
    ]
  },
  '1corinthians': {
    introduction: [
      "Paul's first letter to the Corinthian church addresses numerous problems plaguing this young congregation—divisions, sexual immorality, lawsuits, idol food controversies, and disorder in worship.",
      "Corinth was a cosmopolitan port city known for wealth and moral laxity. The church struggled to live distinctly Christian lives in this pagan environment, importing worldly values into their fellowship.",
      "Paul corrects their errors while teaching foundational truths about the gospel, Christian liberty, spiritual gifts, love, and resurrection. The letter balances correction with instruction.",
      "First Corinthians emphasizes that the Church is Christ's body, requiring unity, purity, and love. Spiritual gifts should build up the community, and all behavior should glorify God."
    ],
    historicalContext: {
      timePeriod: "Written approximately 53-55 CE from Ephesus during Paul's third missionary journey.",
      authorship: "Paul the apostle, addressing a church he founded on his second journey.",
      geography: "Addressed to the church in Corinth, a major commercial city in Greece.",
      transmission: "Canonical epistle addressing practical church issues that remain relevant."
    },
    keyCharacters: [
      { name: 'Paul', desc: 'Apostle and church founder addressing problems with apostolic authority.' },
      { name: 'The Corinthian Believers', desc: 'Diverse congregation struggling with worldliness and division.' },
      { name: 'Apollos', desc: 'Eloquent teacher whom some preferred to Paul, causing division.' },
      { name: 'Chloe\'s Household', desc: 'Those who reported divisions in the church to Paul.' }
    ],
    keyEvents: [
      { event: 'Divisions in the Church', desc: 'Factions form around different leaders (Paul, Apollos, Cephas).' },
      { event: 'Sexual Immorality', desc: 'A case of incest is tolerated rather than addressed.' },
      { event: 'Lawsuits Between Believers', desc: 'Christians are suing each other in pagan courts.' },
      { event: 'Controversy Over Idol Food', desc: 'Debate about eating meat offered to idols.' },
      { event: 'Disorder in Worship', desc: 'Spiritual gifts are being misused; communion is abused.' },
      { event: 'Resurrection Denied', desc: 'Some deny bodily resurrection; Paul defends this central doctrine.' }
    ],
    keyScriptures: [
      { verse: '1 Corinthians 13:4-7', text: '"Love is patient, love is kind...it always protects, always trusts, always hopes."', insight: 'The nature of Christian love that should characterize all behavior.' },
      { verse: '1 Corinthians 15:3-4', text: '"Christ died for our sins...he was buried...he was raised on the third day."', insight: 'The gospel summarized—death, burial, and resurrection.' },
      { verse: '1 Corinthians 10:31', text: '"Whether you eat or drink or whatever you do, do it all for the glory of God."', insight: 'All of life should glorify God, not just religious activities.' }
    ],
    keyLocations: [
      { location: 'Corinth', desc: 'Wealthy, immoral port city where the church struggles with worldliness.' },
      { location: 'The Church Assembly', desc: 'Where worship disorders and spiritual gifts are misused.' }
    ],
    keyLessons: [
      { title: 'Unity in Christ', desc: 'The Church must be united around Christ, not human leaders.' },
      { title: 'Sexual Purity', desc: 'Believers\' bodies are temples of the Holy Spirit, requiring purity.' },
      { title: 'Love Above All', desc: 'Without love, spiritual gifts and knowledge are worthless.' },
      { title: 'Christian Liberty', desc: 'Freedom in Christ should be exercised with consideration for others.' },
      { title: 'Order in Worship', desc: 'Church gatherings should be orderly and edifying.' },
      { title: 'Resurrection Hope', desc: 'Bodily resurrection is central to Christian faith and hope.' }
    ]
  },
  '2corinthians': {
    introduction: [
      "Paul's second letter to Corinth defends his apostolic authority and ministry while addressing reconciliation after painful conflict. It's Paul's most personal and emotional letter.",
      "After a difficult visit and harsh letter, Paul expresses relief that the Corinthians have repented and reconciled with him. Yet he still must defend himself against false apostles who have infiltrated the church.",
      "The letter explores themes of suffering, weakness, and God's strength made perfect in human frailty. Paul's 'thorn in the flesh' and his sufferings demonstrate authentic apostolic ministry.",
      "Second Corinthians teaches that Christian ministry involves suffering, that God's power works through weakness, and that reconciliation is always the goal of godly confrontation."
    ],
    historicalContext: {
      timePeriod: "Written approximately 55-56 CE, shortly after 1 Corinthians, during Paul's third journey.",
      authorship: "Paul the apostle, possibly with Timothy, from Macedonia.",
      geography: "Addressed to Corinth from Macedonia after leaving Ephesus.",
      transmission: "Canonical epistle revealing Paul's apostolic ministry and pastoral heart."
    },
    keyCharacters: [
      { name: 'Paul', desc: 'Apostle defending his ministry and authority against critics.' },
      { name: 'The Corinthians', desc: 'Church that has largely reconciled with Paul but faces continued challenges.' },
      { name: 'Titus', desc: 'Paul\'s coworker who brought news of Corinth\'s repentance.' },
      { name: 'False Apostles', desc: 'Those claiming authority while undermining Paul\'s message.' }
    ],
    keyEvents: [
      { event: 'Reconciliation', desc: 'Paul rejoices that his previous letter produced godly sorrow and repentance.' },
      { event: 'Defense of Ministry', desc: 'Paul explains the nature of apostolic ministry and suffering.' },
      { event: 'Collection for Jerusalem', desc: 'Paul organizes financial support for impoverished believers.' },
      { event: 'Paul\'s Credentials', desc: 'Reluctantly, Paul lists his sufferings and revelations.' },
      { event: 'The Thorn in the Flesh', desc: 'Paul describes a persistent affliction and God\'s response.' },
      { event: 'Planned Visit', desc: 'Paul announces his intention to visit Corinth again.' }
    ],
    keyScriptures: [
      { verse: '2 Corinthians 5:17', text: '"If anyone is in Christ, the new creation has come: The old has gone, the new is here!"', insight: 'Union with Christ brings radical transformation.' },
      { verse: '2 Corinthians 12:9', text: '"My grace is sufficient for you, for my power is made perfect in weakness."', insight: 'God\'s strength works most effectively through human weakness.' },
      { verse: '2 Corinthians 5:21', text: '"God made him who had no sin to be sin for us, so that in him we might become the righteousness of God."', insight: 'The great exchange—our sin for Christ\'s righteousness.' }
    ],
    keyLocations: [
      { location: 'Corinth', desc: 'Church experiencing conflict and reconciliation with Paul.' },
      { location: 'Macedonia', desc: 'From where Paul writes with relief and continued concern.' },
      { location: 'Jerusalem', desc: 'Destination of the financial collection Paul is organizing.' }
    ],
    keyLessons: [
      { title: 'Ministry Involves Suffering', desc: 'Authentic Christian service includes hardship and opposition.' },
      { title: 'Strength in Weakness', desc: 'God\'s power works best through acknowledged human frailty.' },
      { title: 'Godly Sorrow', desc: 'Confrontation that produces repentance leads to restoration.' },
      { title: 'New Creation', desc: 'Union with Christ transforms believers into new creations.' },
      { title: 'Generous Giving', desc: 'Christians should give generously to support others in need.' },
      { title: 'Authentic Leadership', desc: 'True spiritual authority is demonstrated through sacrifice and love.' }
    ]
  },
  'galatians': {
    introduction: [
      "Galatians is Paul's passionate defense of salvation by grace through faith alone, written to churches being influenced by those teaching that Gentiles must follow Jewish law to be saved.",
      "Paul strongly rebukes the Galatians for abandoning the gospel of grace for a 'different gospel' that adds works to faith. He argues that justification comes through Christ alone, not by observing the law.",
      "The letter establishes that both Jews and Gentiles are saved the same way—through faith in Christ. The law served a temporary purpose but cannot save; only Christ's death and resurrection provide salvation.",
      "Galatians emphasizes Christian freedom—believers are free from the law's demands but not free to sin. The Spirit empowers believers to live righteously through love."
    ],
    historicalContext: {
      timePeriod: "Written approximately 48-55 CE, date debated based on when addressed churches were founded.",
      authorship: "Paul the apostle, writing with urgency and strong emotion.",
      geography: "Addressed to churches in Galatia (central Asia Minor/modern Turkey).",
      transmission: "Canonical epistle foundational to Protestant Reformation understanding of justification."
    },
    keyCharacters: [
      { name: 'Paul', desc: 'Apostle defending the gospel of grace against legalistic corruption.' },
      { name: 'The Galatian Believers', desc: 'Christians being swayed by teachers promoting law-keeping.' },
      { name: 'The Judaizers', desc: 'Those teaching that Gentiles must be circumcised and keep the law.' },
      { name: 'Peter, James, and John', desc: 'Jerusalem apostles who affirmed Paul\'s gospel to Gentiles.' }
    ],
    keyEvents: [
      { event: 'Paul\'s Conversion', desc: 'Paul recounts receiving the gospel by revelation from Christ.' },
      { event: 'Jerusalem Meeting', desc: 'Paul meets with apostles who affirm his gospel and mission.' },
      { event: 'Confronting Peter', desc: 'Paul publicly opposes Peter\'s hypocrisy regarding Gentile fellowship.' },
      { event: 'Abraham\'s Example', desc: 'Paul demonstrates that justification by faith predates the law.' },
      { event: 'Purpose of the Law', desc: 'The law was a guardian until Christ came.' },
      { event: 'Freedom in Christ', desc: 'Believers are free but must use freedom to serve one another in love.' }
    ],
    keyScriptures: [
      { verse: 'Galatians 2:20', text: '"I have been crucified with Christ...The life I now live...I live by faith in the Son of God."', insight: 'Christian life is union with Christ through faith, not self-effort.' },
      { verse: 'Galatians 5:1', text: '"It is for freedom that Christ has set us free."', insight: 'Don\'t return to slavery of law-keeping after being freed by grace.' },
      { verse: 'Galatians 5:22-23', text: '"The fruit of the Spirit is love, joy, peace, patience, kindness..."', insight: 'The Spirit produces character transformation, not mere rule-keeping.' }
    ],
    keyLocations: [
      { location: 'Galatia', desc: 'Region where churches are being led astray by false teaching.' },
      { location: 'Jerusalem', desc: 'Where Paul met with apostles to confirm his gospel.' },
      { location: 'Antioch', desc: 'Where Paul confronted Peter over his hypocrisy.' }
    ],
    keyLessons: [
      { title: 'Justification by Faith Alone', desc: 'Salvation comes through faith in Christ, not by works of law.' },
      { title: 'Don\'t Abandon Grace', desc: 'Adding works to faith perverts the gospel.' },
      { title: 'Christian Freedom', desc: 'Believers are free from law but called to serve in love.' },
      { title: 'The Spirit vs. the Flesh', desc: 'The Spirit empowers victory over sinful desires.' },
      { title: 'Unity in Christ', desc: 'In Christ, ethnic and social distinctions don\'t determine standing.' },
      { title: 'Stand Firm', desc: 'Resist any teaching that undermines salvation by grace through faith.' }
    ]
  },
  'ephesians': {
    introduction: [
      "Ephesians presents the grand vision of God's eternal plan to unite all things in Christ and the Church's identity as Christ's body. It's one of Paul's most theologically rich letters.",
      "The first half explores the spiritual blessings believers have in Christ—chosen before creation, redeemed through His blood, sealed by the Spirit. Paul prays that believers would grasp the magnitude of God's love and power.",
      "The second half provides practical instruction for living out this identity. Believers should walk worthy of their calling through unity, transformed living, Spirit-filled worship, and godly relationships.",
      "Ephesians emphasizes the cosmic significance of the Church as the means by which God displays His wisdom. The letter climaxes with teaching on spiritual warfare, emphasizing reliance on God's armor."
    ],
    historicalContext: {
      timePeriod: "Written approximately 60-62 CE during Paul's Roman imprisonment.",
      authorship: "Paul the apostle, though authorship debated due to style differences.",
      geography: "Addressed to Ephesus and possibly circulated to other Asian churches.",
      transmission: "One of the prison epistles, foundational for understanding the Church's nature and calling."
    },
    keyCharacters: [
      { name: 'Paul', desc: 'Imprisoned apostle revealing God\'s eternal purposes for the Church.' },
      { name: 'The Ephesian Believers', desc: 'Mostly Gentile Christians learning their identity in Christ.' },
      { name: 'Christ', desc: 'Head of the Church who fills all things and gives spiritual blessings.' },
      { name: 'The Holy Spirit', desc: 'Who seals believers and empowers transformed living.' }
    ],
    keyEvents: [
      { event: 'Chosen Before Creation', desc: 'God chose believers in Christ before the world\'s foundation.' },
      { event: 'Redemption Through Blood', desc: 'Salvation accomplished through Christ\'s sacrificial death.' },
      { event: 'Jews and Gentiles United', desc: 'Christ breaks down the dividing wall, creating one new humanity.' },
      { event: 'The Church as Mystery', desc: 'God\'s plan to include Gentiles is revealed through the Church.' },
      { event: 'Call to Unity', desc: 'Believers urged to maintain unity through humility and love.' },
      { event: 'Transformed Living', desc: 'Instructions for putting off old life and putting on new.' },
      { event: 'Spiritual Warfare', desc: 'Believers equipped with God\'s armor against spiritual forces.' }
    ],
    keyScriptures: [
      { verse: 'Ephesians 2:8-9', text: '"For it is by grace you have been saved, through faith...not by works."', insight: 'Salvation is entirely God\'s gift, not human achievement.' },
      { verse: 'Ephesians 4:4-6', text: '"There is one body and one Spirit...one Lord, one faith, one baptism."', insight: 'Unity is rooted in shared faith and the one God.' },
      { verse: 'Ephesians 6:12', text: '"Our struggle is not against flesh and blood, but against...spiritual forces of evil."', insight: 'The real battle is spiritual, requiring spiritual resources.' }
    ],
    keyLocations: [
      { location: 'Ephesus', desc: 'Major Asian city where Paul ministered extensively.' },
      { location: 'The Heavenly Realms', desc: 'Spiritual dimension where blessings exist and battles occur.' }
    ],
    keyLessons: [
      { title: 'Blessed in Christ', desc: 'Believers have every spiritual blessing through union with Christ.' },
      { title: 'Saved by Grace', desc: 'Salvation is God\'s gift, not earned by human effort.' },
      { title: 'Unity in the Church', desc: 'Christ unites diverse believers into one body.' },
      { title: 'Walk Worthy', desc: 'Live in a manner consistent with your calling in Christ.' },
      { title: 'Transformed Relationships', desc: 'Christ transforms how we relate in marriage, family, and work.' },
      { title: 'Spiritual Warfare', desc: 'Stand firm against spiritual opposition using God\'s resources.' }
    ]
  },
  'philippians': {
    introduction: [
      "Philippians is Paul's joyful letter to a beloved church, written from prison yet overflowing with rejoicing. It emphasizes joy in Christ regardless of circumstances and calls believers to unity and humility.",
      "The Philippian church had partnered with Paul in the gospel from its founding, supporting him financially and personally. Paul writes to thank them and to address some internal tensions.",
      "Central to the letter is the Christ hymn describing Jesus's humiliation and exaltation. This becomes the model for Christian humility and service—considering others above self.",
      "Despite imprisonment and opposition, Paul rejoices because the gospel advances. The letter demonstrates that joy in Christ transcends circumstances and that contentment comes from relationship with Him."
    ],
    historicalContext: {
      timePeriod: "Written approximately 60-62 CE during Paul's Roman imprisonment.",
      authorship: "Paul the apostle, with Timothy, to a church he founded on his second journey.",
      geography: "Addressed to Philippi in Macedonia, the first European church Paul planted.",
      transmission: "One of the prison epistles, emphasizing joy and Christ-centeredness."
    },
    keyCharacters: [
      { name: 'Paul', desc: 'Imprisoned apostle who models joy in suffering and single-minded devotion to Christ.' },
      { name: 'Timothy', desc: 'Paul\'s trusted coworker whom he commends to the Philippians.' },
      { name: 'Epaphroditus', desc: 'Philippian messenger who risked his life serving Paul.' },
      { name: 'The Philippian Believers', desc: 'Generous church that partnered with Paul in the gospel.' }
    ],
    keyEvents: [
      { event: 'Thanksgiving for Partnership', desc: 'Paul expresses gratitude for their continued support and fellowship.' },
      { event: 'Paul\'s Imprisonment', desc: 'Despite chains, Paul rejoices that the gospel advances.' },
      { event: 'Christ\'s Humility and Exaltation', desc: 'The Christ hymn describes Jesus\'s self-emptying and exaltation.' },
      { event: 'Call to Unity', desc: 'Paul urges Euodia and Syntyche to reconcile.' },
      { event: 'Warning Against False Teachers', desc: 'Paul warns against those promoting law-keeping.' },
      { event: 'Pursuing Christ', desc: 'Paul describes pressing toward the goal of knowing Christ.' }
    ],
    keyScriptures: [
      { verse: 'Philippians 4:4', text: '"Rejoice in the Lord always. I will say it again: Rejoice!"', insight: 'Joy in Christ should be constant, not dependent on circumstances.' },
      { verse: 'Philippians 2:5-8', text: '"In your relationships...have the same mindset as Christ Jesus...he humbled himself."', insight: 'Christ\'s humility is the model for Christian relationships.' },
      { verse: 'Philippians 4:13', text: '"I can do all this through him who gives me strength."', insight: 'Christ empowers believers for all circumstances, especially contentment.' }
    ],
    keyLocations: [
      { location: 'Philippi', desc: 'Macedonian city where Paul planted a strong, supportive church.' },
      { location: 'Rome', desc: 'Where Paul is imprisoned but continues ministry.' }
    ],
    keyLessons: [
      { title: 'Joy in All Circumstances', desc: 'True joy comes from Christ, not favorable conditions.' },
      { title: 'Christ-Like Humility', desc: 'Follow Jesus\'s example of humble service and self-sacrifice.' },
      { title: 'Partnership in the Gospel', desc: 'Support and encourage those proclaiming Christ.' },
      { title: 'Pursue Christ', desc: 'Make knowing Christ the supreme goal, counting all else as loss.' },
      { title: 'Unity Through Humility', desc: 'Consider others above yourself for church unity.' },
      { title: 'Contentment in Christ', desc: 'Learn to be content in every situation through Christ\'s strength.' }
    ]
  },
  'colossians': {
    introduction: [
      "Colossians exalts Christ's supremacy over all creation and confronts false teaching that diminished His sufficiency. Paul emphasizes that Christ is fully God and fully sufficient for salvation.",
      "The Colossian church faced pressure from teachers promoting asceticism, angel worship, and adherence to Jewish regulations. Paul argues that these additions are unnecessary and actually undermine the gospel.",
      "Central to the letter is the Christ hymn declaring Him as Creator, Sustainer, and Reconciler of all things. In Christ 'all the fullness of the Deity lives in bodily form.'",
      "Colossians teaches that union with Christ is complete—believers need nothing added to what they have in Him. Christian living flows from this identity rather than external rules."
    ],
    historicalContext: {
      timePeriod: "Written approximately 60-62 CE during Paul's Roman imprisonment, delivered with Ephesians and Philemon.",
      authorship: "Paul the apostle, with Timothy, to a church he hadn't personally visited.",
      geography: "Addressed to Colossae in Asia Minor (modern Turkey).",
      transmission: "One of the prison epistles, emphasizing Christ's supremacy and sufficiency."
    },
    keyCharacters: [
      { name: 'Paul', desc: 'Apostle writing to confront false teaching and exalt Christ.' },
      { name: 'Epaphras', desc: 'Founder of the Colossian church who reported to Paul.' },
      { name: 'Tychicus', desc: 'Messenger who delivered the letter and provided updates.' },
      { name: 'The Colossian Believers', desc: 'Church being influenced by ascetic and mystical false teaching.' }
    ],
    keyEvents: [
      { event: 'Thanksgiving for Faith', desc: 'Paul thanks God for the Colossians\' faith and love.' },
      { event: 'Christ\'s Supremacy Declared', desc: 'The Christ hymn proclaims His supremacy over creation.' },
      { event: 'Warning Against False Teaching', desc: 'Paul refutes philosophy, legalism, and mysticism.' },
      { event: 'Union with Christ', desc: 'Believers have died and been raised with Christ.' },
      { event: 'Practical Instructions', desc: 'Guidance for transformed living in relationships and work.' }
    ],
    keyScriptures: [
      { verse: 'Colossians 1:15-16', text: '"The Son is the image of the invisible God...For in him all things were created."', insight: 'Christ is both fully God and Creator of all things.' },
      { verse: 'Colossians 2:9-10', text: '"In Christ all the fullness of the Deity lives in bodily form, and in Christ you have been brought to fullness."', insight: 'Christ is completely sufficient; believers need nothing added.' },
      { verse: 'Colossians 3:1-2', text: '"Set your hearts on things above, where Christ is."', insight: 'Believers should focus on eternal rather than earthly concerns.' }
    ],
    keyLocations: [
      { location: 'Colossae', desc: 'Small city in Asia Minor where the church is located.' },
      { location: 'Rome', desc: 'From where Paul writes while imprisoned.' }
    ],
    keyLessons: [
      { title: 'Christ\'s Supremacy', desc: 'Christ is supreme over all creation, powers, and authorities.' },
      { title: 'Sufficiency of Christ', desc: 'Believers are complete in Christ, needing no additions.' },
      { title: 'Beware False Teaching', desc: 'Reject any teaching that diminishes Christ or adds requirements.' },
      { title: 'Hidden Life in Christ', desc: 'True spiritual life is union with the risen Christ.' },
      { title: 'Transformed Living', desc: 'Christian ethics flow from identity in Christ, not external rules.' },
      { title: 'Set Mind on Heaven', desc: 'Focus on eternal realities rather than earthly concerns.' }
    ]
  },
  '1thessalonians': {
    introduction: [
      "Paul's first letter to the Thessalonians encourages a young church facing persecution while addressing questions about Christ's return. It's warm, pastoral, and focused on Christian hope.",
      "The Thessalonian believers had received the gospel joyfully despite persecution. Paul commends their faith, love, and endurance while teaching about sanctification and the second coming.",
      "Concerned about believers who had died, the Thessalonians wondered if they would miss Christ's return. Paul assures them that the dead in Christ will rise first when He returns.",
      "The letter emphasizes holy living while waiting for Christ's return, encouraging believers to encourage one another and live peacefully. Hope in Christ's return should motivate godly conduct."
    ],
    historicalContext: {
      timePeriod: "Written approximately 50-51 CE from Corinth, one of Paul's earliest letters.",
      authorship: "Paul, with Silas and Timothy, to a church recently founded on his second journey.",
      geography: "Addressed to Thessalonica in Macedonia (northern Greece).",
      transmission: "Canonical epistle providing early Christian teaching on Christ's return."
    },
    keyCharacters: [
      { name: 'Paul', desc: 'Apostle who founded the church and writes with pastoral concern.' },
      { name: 'Silas and Timothy', desc: 'Co-workers who ministered in Thessalonica with Paul.' },
      { name: 'The Thessalonian Believers', desc: 'New Christians enduring persecution and awaiting Christ.' },
      { name: 'Jesus Christ', desc: 'The coming Lord whose return brings hope and motivation.' }
    ],
    keyEvents: [
      { event: 'Reception of the Gospel', desc: 'Thessalonians received God\'s word despite persecution.' },
      { event: 'Persecution and Endurance', desc: 'The church faces opposition but stands firm.' },
      { event: 'Timothy\'s Visit', desc: 'Timothy reports on the church\'s faith, bringing Paul joy.' },
      { event: 'Teaching on Sanctification', desc: 'Paul instructs on holy living, especially sexual purity.' },
      { event: 'Questions About the Dead', desc: 'Concerns about believers who died before Christ\'s return.' },
      { event: 'The Day of the Lord', desc: 'Teaching about Christ\'s unexpected return.' }
    ],
    keyScriptures: [
      { verse: '1 Thessalonians 4:16-17', text: '"The Lord himself will come down from heaven...and we will be with the Lord forever."', insight: 'Assurance of Christ\'s return and believers\' resurrection.' },
      { verse: '1 Thessalonians 5:16-18', text: '"Rejoice always, pray continually, give thanks in all circumstances."', insight: 'Constant spiritual practices characterize Christian life.' },
      { verse: '1 Thessalonians 4:3', text: '"It is God\'s will that you should be sanctified."', insight: 'God desires holiness and progressive transformation.' }
    ],
    keyLocations: [
      { location: 'Thessalonica', desc: 'Macedonian city where a strong church emerged despite persecution.' },
      { location: 'Corinth', desc: 'From where Paul writes after leaving Thessalonica.' }
    ],
    keyLessons: [
      { title: 'Hope in Christ\'s Return', desc: 'The second coming provides comfort and motivation.' },
      { title: 'Endure Persecution', desc: 'Suffering for Christ is expected and produces endurance.' },
      { title: 'Pursue Holiness', desc: 'God calls believers to progressive sanctification.' },
      { title: 'Encourage One Another', desc: 'Mutual encouragement strengthens faith.' },
      { title: 'Live Quietly and Work', desc: 'While waiting for Christ, live responsibly and work diligently.' },
      { title: 'Constant Spiritual Practices', desc: 'Rejoice, pray, and give thanks continually.' }
    ]
  },
  '2thessalonians': {
    introduction: [
      "Paul's second letter to the Thessalonians addresses confusion about Christ's return and corrects misunderstandings. Some believed the Day of the Lord had already come, causing alarm and idleness.",
      "Paul clarifies that certain events must precede Christ's return, including a great rebellion and the revealing of the 'man of lawlessness.' Believers should not be alarmed by false reports.",
      "The letter also addresses those who had stopped working, expecting Christ's imminent return. Paul commands that if anyone won't work, they shouldn't eat.",
      "Second Thessalonians balances eschatological teaching with practical instruction, emphasizing that while believers await Christ, they must live responsibly and stand firm in truth."
    ],
    historicalContext: {
      timePeriod: "Written approximately 51-52 CE, shortly after 1 Thessalonians, from Corinth.",
      authorship: "Paul, with Silas and Timothy, addressing continued confusion.",
      geography: "Addressed to Thessalonica in Macedonia.",
      transmission: "Canonical epistle clarifying teaching about Christ's return."
    },
    keyCharacters: [
      { name: 'Paul', desc: 'Apostle correcting misunderstandings about the second coming.' },
      { name: 'The Thessalonians', desc: 'Believers confused about timing and nature of Christ\'s return.' },
      { name: 'The Man of Lawlessness', desc: 'Future figure of opposition to God preceding Christ\'s return.' },
      { name: 'Jesus Christ', desc: 'The coming Lord who will destroy evil and vindicate His people.' }
    ],
    keyEvents: [
      { event: 'Perseverance in Persecution', desc: 'The church continues to endure suffering faithfully.' },
      { event: 'Clarification About the Day', desc: 'Paul explains that Christ\'s return hasn\'t occurred yet.' },
      { event: 'The Man of Lawlessness', desc: 'Description of coming rebellion before Christ\'s return.' },
      { event: 'Stand Firm', desc: 'Believers urged to hold to apostolic teaching.' },
      { event: 'Warning Against Idleness', desc: 'Those refusing to work should not eat.' }
    ],
    keyScriptures: [
      { verse: '2 Thessalonians 2:3', text: '"Don\'t let anyone deceive you...that day will not come until the rebellion occurs."', insight: 'Certain events must precede Christ\'s return; don\'t be alarmed by false reports.' },
      { verse: '2 Thessalonians 3:10', text: '"If a man will not work, he shall not eat."', insight: 'Waiting for Christ doesn\'t excuse irresponsibility.' },
      { verse: '2 Thessalonians 2:15', text: '"Stand firm and hold fast to the teachings we passed on to you."', insight: 'Remain committed to apostolic truth despite confusion.' }
    ],
    keyLocations: [
      { location: 'Thessalonica', desc: 'Church still facing persecution and confusion.' },
      { location: 'Corinth', desc: 'From where Paul writes his clarifying letter.' }
    ],
    keyLessons: [
      { title: 'Don\'t Be Deceived', desc: 'Test teaching against apostolic truth; reject false reports.' },
      { title: 'Christ Will Return', desc: 'The second coming is certain but timing is unknown.' },
      { title: 'Live Responsibly', desc: 'Awaiting Christ doesn\'t excuse laziness or irresponsibility.' },
      { title: 'Stand Firm in Truth', desc: 'Hold to sound teaching despite confusion or opposition.' },
      { title: 'God Will Judge Evil', desc: 'The man of lawlessness and all opposition will be destroyed.' },
      { title: 'Persevere in Faith', desc: 'Continue faithful living despite persecution or confusion.' }
    ]
  },
  '1timothy': {
    introduction: [
      "Paul's first letter to Timothy provides pastoral instruction for leading the church in Ephesus. It addresses church organization, qualifications for leadership, false teaching, and proper conduct in worship.",
      "Timothy, Paul's young protégé, needed encouragement and instruction for shepherding a challenging congregation. Paul addresses practical matters including elder and deacon qualifications, caring for widows, and handling disputes.",
      "The letter confronts false teachers promoting myths, genealogies, and ascetic practices. Paul emphasizes sound doctrine based on the gospel and godly living flowing from genuine faith.",
      "First Timothy shows that church health requires godly leadership, sound teaching, and orderly worship. Leaders must model Christian character and protect the church from error."
    ],
    historicalContext: {
      timePeriod: "Written approximately 62-64 CE, after Paul's release from first Roman imprisonment.",
      authorship: "Paul the apostle to Timothy, his delegate in Ephesus.",
      geography: "Timothy is ministering in Ephesus, a major Asian city.",
      transmission: "One of the pastoral epistles providing instruction for church leadership."
    },
    keyCharacters: [
      { name: 'Paul', desc: 'Apostle mentoring his younger colleague in pastoral ministry.' },
      { name: 'Timothy', desc: 'Young pastor leading the church in Ephesus.' },
      { name: 'Hymenaeus and Alexander', desc: 'False teachers Paul has disciplined.' },
      { name: 'The Ephesian Church', desc: 'Congregation needing structure and protection from error.' }
    ],
    keyEvents: [
      { event: 'Warning Against False Teachers', desc: 'Paul identifies teachers promoting myths and controversies.' },
      { event: 'Qualifications for Leaders', desc: 'Standards for overseers and deacons are outlined.' },
      { event: 'Instructions for Worship', desc: 'Guidance on prayer, conduct, and teaching roles.' },
      { event: 'Care for Widows', desc: 'Proper support for genuinely needy widows.' },
      { event: 'Honor for Elders', desc: 'How to treat elders, including correction when needed.' },
      { event: 'Warnings About Wealth', desc: 'The dangers of loving money and pursuing riches.' }
    ],
    keyScriptures: [
      { verse: '1 Timothy 3:16', text: '"Beyond all question, the mystery from which true godliness springs is great: He appeared in the flesh..."', insight: 'The gospel centers on Christ\'s incarnation and exaltation.' },
      { verse: '1 Timothy 6:10', text: '"The love of money is a root of all kinds of evil."', insight: 'Greed, not money itself, leads to sin and destruction.' },
      { verse: '1 Timothy 2:5', text: '"There is one God and one mediator between God and mankind, the man Christ Jesus."', insight: 'Christ is the exclusive mediator; no other intermediaries needed.' }
    ],
    keyLocations: [
      { location: 'Ephesus', desc: 'Major Asian city where Timothy leads the church.' },
      { location: 'Macedonia', desc: 'From where Paul possibly writes this letter.' }
    ],
    keyLessons: [
      { title: 'Sound Doctrine Matters', desc: 'Protecting the gospel from false teaching is essential.' },
      { title: 'Leadership Qualifications', desc: 'Church leaders must demonstrate character and faithfulness.' },
      { title: 'Proper Worship', desc: 'Church gatherings should be orderly, reverent, and God-honoring.' },
      { title: 'Care for the Vulnerable', desc: 'The church must support those genuinely in need.' },
      { title: 'Dangers of Wealth', desc: 'Loving money leads to temptation and spiritual ruin.' },
      { title: 'Fight the Good Fight', desc: 'Ministry requires perseverance and courage.' }
    ]
  },
  '2timothy': {
    introduction: [
      "Paul's final letter, written from prison facing execution, charges Timothy to remain faithful to the gospel and endure suffering. It's a poignant farewell from mentor to protégé.",
      "Knowing his death is near, Paul urges Timothy to guard the gospel, endure hardship, and pass on the faith to reliable leaders. The letter is personal, emotional, and urgent.",
      "Paul reflects on his own ministry—having fought the good fight, finished the race, and kept the faith. He awaits the crown of righteousness while encouraging Timothy to continue the work.",
      "Second Timothy emphasizes that faithfulness to Christ may require suffering but brings eternal reward. God's Word is sufficient for teaching and equipping believers for every good work."
    ],
    historicalContext: {
      timePeriod: "Written approximately 66-67 CE during Paul's final Roman imprisonment before execution.",
      authorship: "Paul's last letter, written to Timothy with deep emotion and urgency.",
      geography: "Written from Rome to Timothy, likely still in Ephesus.",
      transmission: "One of the pastoral epistles, Paul's final written words."
    },
    keyCharacters: [
      { name: 'Paul', desc: 'Imprisoned apostle facing death yet confident in Christ.' },
      { name: 'Timothy', desc: 'Beloved spiritual son receiving Paul\'s final charge.' },
      { name: 'Onesiphorus', desc: 'Faithful friend who wasn\'t ashamed of Paul\'s chains.' },
      { name: 'Demas', desc: 'Former coworker who deserted Paul, loving the present world.' }
    ],
    keyEvents: [
      { event: 'Fan the Flame', desc: 'Paul encourages Timothy to rekindle his spiritual gift.' },
      { event: 'Unashamed of the Gospel', desc: 'Call to boldly proclaim truth despite suffering.' },
      { event: 'Entrust to Faithful People', desc: 'Pass on teaching to those who will teach others.' },
      { event: 'Endure Hardship', desc: 'Christian ministry involves suffering like a soldier.' },
      { event: 'Avoid Godless Chatter', desc: 'Warning against false teaching and quarrels.' },
      { event: 'Scripture\'s Sufficiency', desc: 'God\'s Word equips believers for all good works.' },
      { event: 'Paul\'s Farewell', desc: 'Paul reflects on his ministry and awaits his reward.' }
    ],
    keyScriptures: [
      { verse: '2 Timothy 3:16-17', text: '"All Scripture is God-breathed and is useful for teaching...so that the servant of God may be thoroughly equipped."', insight: 'Scripture is divinely inspired and completely sufficient for ministry.' },
      { verse: '2 Timothy 2:2', text: '"Entrust to reliable people who will also be qualified to teach others."', insight: 'Principle of discipleship—multiply faithful teachers.' },
      { verse: '2 Timothy 4:7', text: '"I have fought the good fight, I have finished the race, I have kept the faith."', insight: 'Paul\'s confident testimony of faithful ministry completion.' }
    ],
    keyLocations: [
      { location: 'Rome', desc: 'Where Paul is imprisoned awaiting execution.' },
      { location: 'Ephesus', desc: 'Where Timothy ministers and will receive this letter.' }
    ],
    keyLessons: [
      { title: 'Guard the Gospel', desc: 'Protect sound teaching from corruption and false doctrine.' },
      { title: 'Suffer for Christ', desc: 'Faithfulness may require enduring hardship and persecution.' },
      { title: 'Scripture Is Sufficient', desc: 'God\'s Word provides everything needed for ministry and life.' },
      { title: 'Multiply Disciples', desc: 'Train others who will train still others in the faith.' },
      { title: 'Finish Well', desc: 'Remain faithful throughout life, keeping your eyes on the eternal prize.' },
      { title: 'Unashamed Witness', desc: 'Don\'t be ashamed of the gospel or those who suffer for it.' }
    ]
  },
  'titus': {
    introduction: [
      "Paul's letter to Titus provides instruction for organizing and leading the church in Crete. It emphasizes the importance of godly character in leaders and the necessity of sound doctrine producing godly living.",
      "Titus, Paul's trusted coworker, faces the challenge of establishing church structure on an island known for dishonesty and immorality. Paul provides guidance for appointing elders and addressing false teaching.",
      "The letter stresses that genuine faith produces transformation—sound doctrine leads to godly conduct. Grace not only saves but also teaches believers to live righteously.",
      "Titus demonstrates the connection between belief and behavior, orthodoxy and orthopraxy. What we believe about God should transform how we live in the world."
    ],
    historicalContext: {
      timePeriod: "Written approximately 62-64 CE, between Paul's imprisonments.",
      authorship: "Paul the apostle to Titus, his delegate in Crete.",
      geography: "Addressed to Crete, a Mediterranean island with a poor moral reputation.",
      transmission: "One of the pastoral epistles, providing guidance for church organization and conduct."
    },
    keyCharacters: [
      { name: 'Paul', desc: 'Apostle providing guidance for church establishment.' },
      { name: 'Titus', desc: 'Paul\'s trusted representative organizing the Cretan church.' },
      { name: 'Cretan Believers', desc: 'New Christians needing leadership and sound teaching.' },
      { name: 'False Teachers', desc: 'Those promoting Jewish myths and divisive teaching.' }
    ],
    keyEvents: [
      { event: 'Appointing Elders', desc: 'Titus is to establish qualified leaders in each town.' },
      { event: 'Confronting False Teaching', desc: 'Rebuke those promoting myths and Jewish regulations.' },
      { event: 'Instructions for Different Groups', desc: 'Specific guidance for older men, women, young men, and slaves.' },
      { event: 'Living as Good Citizens', desc: 'Christians should be model citizens in society.' },
      { event: 'Grace That Teaches', desc: 'God\'s grace trains believers to live righteously.' }
    ],
    keyScriptures: [
      { verse: 'Titus 2:11-12', text: '"The grace of God...teaches us to say \'No\' to ungodliness...and to live self-controlled, upright and godly lives."', insight: 'Grace not only saves but transforms behavior.' },
      { verse: 'Titus 3:5', text: '"He saved us, not because of righteous things we had done, but because of his mercy."', insight: 'Salvation is by mercy, not works; it brings regeneration and renewal.' },
      { verse: 'Titus 1:9', text: '"He must hold firmly to the trustworthy message...so that he can encourage others by sound doctrine."', insight: 'Leaders must know and teach truth accurately.' }
    ],
    keyLocations: [
      { location: 'Crete', desc: 'Island known for moral laxity where the church needs organization.' },
      { location: 'Nicopolis', desc: 'Where Paul plans to winter and wants Titus to join him.' }
    ],
    keyLessons: [
      { title: 'Qualified Leadership', desc: 'Church leaders must demonstrate godly character and sound doctrine.' },
      { title: 'Doctrine Shapes Life', desc: 'What we believe should transform how we behave.' },
      { title: 'Grace Transforms', desc: 'God\'s grace not only forgives but trains in righteousness.' },
      { title: 'Good Works Matter', desc: 'Saved by grace, believers should be devoted to good deeds.' },
      { title: 'Silence False Teaching', desc: 'Rebuke error firmly to protect the church.' },
      { title: 'Model Citizenship', desc: 'Christians should be exemplary members of society.' }
    ]
  },
  'philemon': {
    introduction: [
      "Philemon is Paul's personal appeal to a slave owner to receive back his runaway slave Onesimus as a brother in Christ. It's a masterpiece of Christian persuasion and reconciliation.",
      "Onesimus, having fled from Philemon, encountered Paul in Rome and became a Christian. Paul sends him back with this letter, asking Philemon to forgive and receive him not as property but as family.",
      "The letter demonstrates the gospel's power to transform social relationships. In Christ, the slave-master distinction gives way to brotherhood.",
      "Though brief, Philemon addresses profound issues of forgiveness, reconciliation, and the Christian transformation of oppressive social structures. Paul models gracious persuasion rather than authoritarian command."
    ],
    historicalContext: {
      timePeriod: "Written approximately 60-62 CE during Paul's Roman imprisonment.",
      authorship: "Paul, writing a personal letter to his friend and coworker Philemon.",
      geography: "Sent to Colossae where Philemon lived and the church met in his house.",
      transmission: "Shortest of Paul's letters, preserved as a model of Christian reconciliation."
    },
    keyCharacters: [
      { name: 'Paul', desc: 'Imprisoned apostle mediating reconciliation between slave and master.' },
      { name: 'Philemon', desc: 'Slave owner and church leader asked to forgive and receive Onesimus.' },
      { name: 'Onesimus', desc: 'Runaway slave who became Christian and is returning to his master.' },
      { name: 'Apphia and Archippus', desc: 'Likely Philemon\'s wife and son, part of the household church.' }
    ],
    keyEvents: [
      { event: 'Onesimus Flees', desc: 'The slave runs away from Philemon, possibly stealing.' },
      { event: 'Onesimus Meets Paul', desc: 'In Rome, Onesimus encounters Paul and becomes Christian.' },
      { event: 'Paul\'s Appeal', desc: 'Paul writes asking Philemon to receive Onesimus as a brother.' },
      { event: 'Offer to Repay', desc: 'Paul offers to pay any debt Onesimus owes.' },
      { event: 'Request for Guest Room', desc: 'Paul hopes to visit Philemon soon.' }
    ],
    keyScriptures: [
      { verse: 'Philemon 1:16', text: '"No longer as a slave, but better than a slave, as a dear brother."', insight: 'In Christ, social distinctions are transformed by spiritual brotherhood.' },
      { verse: 'Philemon 1:17-18', text: '"If you consider me a partner, welcome him as you would welcome me. If he has done you any wrong...charge it to me."', insight: 'Paul models Christ\'s substitutionary love—taking another\'s debt.' },
      { verse: 'Philemon 1:6', text: '"I pray that your partnership with us in the faith may be effective in deepening your understanding of every good thing we share for the sake of Christ."', insight: 'Christian fellowship deepens understanding of blessings in Christ.' }
    ],
    keyLocations: [
      { location: 'Colossae', desc: 'Where Philemon lives and hosts the church.' },
      { location: 'Rome', desc: 'Where Paul is imprisoned and Onesimus is converted.' }
    ],
    keyLessons: [
      { title: 'Gospel Transforms Relationships', desc: 'Christ changes how believers relate across social boundaries.' },
      { title: 'Forgiveness and Reconciliation', desc: 'Christians should forgive as they have been forgiven.' },
      { title: 'Brotherhood in Christ', desc: 'Spiritual family transcends earthly social distinctions.' },
      { title: 'Gracious Persuasion', desc: 'Appeal to conscience and love rather than command.' },
      { title: 'Substitutionary Love', desc: 'Taking another\'s debt reflects Christ\'s work for us.' }
    ]
  },
  'hebrews': {
    introduction: [
      "Hebrews presents Jesus Christ as superior to angels, Moses, and the Old Testament priesthood. It argues that the new covenant in Christ fulfills and surpasses the old covenant.",
      "Written to Jewish Christians tempted to return to Judaism under persecution, Hebrews demonstrates that Christ is the ultimate high priest, the perfect sacrifice, and the mediator of a better covenant.",
      "The letter alternates between theological exposition and urgent warnings not to fall away. It emphasizes that there is no salvation apart from Christ—He is the only way to God.",
      "Hebrews concludes with the 'faith chapter' listing Old Testament heroes who trusted God's promises. Believers are called to run the race with endurance, fixing eyes on Jesus."
    ],
    historicalContext: {
      timePeriod: "Written approximately 60-70 CE, before the Temple's destruction.",
      authorship: "Anonymous, though traditionally attributed to Paul. Possibly Apollos, Barnabas, or another early leader.",
      geography: "Audience unclear, possibly Roman Jewish Christians.",
      transmission: "Canonical epistle foundational for understanding Christ's priesthood and covenant."
    },
    keyCharacters: [
      { name: 'Jesus Christ', desc: 'Superior High Priest and perfect sacrifice, central throughout.' },
      { name: 'The Author', desc: 'Unknown teacher explaining Christ\'s superiority.' },
      { name: 'The Readers', desc: 'Jewish Christians tempted to abandon Christ for Judaism.' },
      { name: 'Old Testament Heroes', desc: 'Abraham, Moses, and others who model enduring faith.' }
    ],
    keyEvents: [
      { event: 'Christ Superior to Angels', desc: 'Jesus is God\'s Son, not a created being.' },
      { event: 'Christ Superior to Moses', desc: 'Moses was faithful servant; Christ is faithful Son.' },
      { event: 'Christ Our High Priest', desc: 'Jesus is priest forever in the order of Melchizedek.' },
      { event: 'The New Covenant', desc: 'Christ mediates a better covenant with better promises.' },
      { event: 'Christ\'s Perfect Sacrifice', desc: 'Jesus\'s one sacrifice accomplishes what repeated sacrifices couldn\'t.' },
      { event: 'Faith Hall of Fame', desc: 'Heroes of faith who trusted God\'s promises despite not seeing fulfillment.' },
      { event: 'Run the Race', desc: 'Believers urged to persevere with eyes fixed on Jesus.' }
    ],
    keyScriptures: [
      { verse: 'Hebrews 1:3', text: '"The Son is the radiance of God\'s glory and the exact representation of his being."', insight: 'Jesus perfectly reveals God\'s nature and character.' },
      { verse: 'Hebrews 11:1', text: '"Faith is confidence in what we hope for and assurance about what we do not see."', insight: 'Definition of faith as confident trust in God\'s promises.' },
      { verse: 'Hebrews 12:1-2', text: '"Let us run with perseverance...fixing our eyes on Jesus."', insight: 'Endurance comes from focusing on Christ, the source and goal of faith.' }
    ],
    keyLocations: [
      { location: 'The Heavenly Sanctuary', desc: 'True tabernacle where Christ ministers as High Priest.' },
      { location: 'Mount Zion', desc: 'Spiritual reality believers have come to through Christ.' }
    ],
    keyLessons: [
      { title: 'Christ Is Superior', desc: 'Jesus surpasses all previous revelations and provisions.' },
      { title: 'Better Covenant', desc: 'The new covenant in Christ fulfills and surpasses the old.' },
      { title: 'Perfect Sacrifice', desc: 'Christ\'s one sacrifice accomplishes complete salvation.' },
      { title: 'Persevering Faith', desc: 'True faith endures to the end despite trials.' },
      { title: 'Warning Against Apostasy', desc: 'Abandoning Christ means abandoning the only means of salvation.' },
      { title: 'Examples of Faith', desc: 'Old Testament saints model trusting God\'s promises.' }
    ]
  },
  'james': {
    introduction: [
      "James emphasizes that genuine faith produces godly behavior—true belief results in obedient action. It addresses practical Christian living with directness and urgency.",
      "The letter confronts favoritism, uncontrolled speech, worldly wisdom, and indifference to the poor. James insists that faith without works is dead—not that works save, but that real faith inevitably produces good works.",
      "Written to Jewish Christians scattered by persecution, James encourages endurance through trials, which test and strengthen faith. He also addresses prayer, healing, and restoration of wandering believers.",
      "James reads like wisdom literature, offering practical guidance for daily living. It complements Paul's emphasis on grace, showing that grace-given faith transforms conduct."
    ],
    historicalContext: {
      timePeriod: "Possibly 45-50 CE, one of the earliest New Testament books, before the Jerusalem Council.",
      authorship: "James, the brother of Jesus and leader of the Jerusalem church.",
      geography: "Addressed to Jewish Christians scattered throughout the Roman Empire.",
      transmission: "Canonical epistle emphasizing practical Christian living and authentic faith."
    },
    keyCharacters: [
      { name: 'James', desc: 'Jesus\'s brother, church leader writing with wisdom and authority.' },
      { name: 'The Scattered Jewish Christians', desc: 'Believers facing trials and temptations in various locations.' },
      { name: 'The Rich', desc: 'Wealthy people warned about oppression and false security.' },
      { name: 'The Poor', desc: 'Those whom God has chosen and whom the church must not neglect.' }
    ],
    keyEvents: [
      { event: 'Trials Testing Faith', desc: 'Believers face various trials that test and strengthen faith.' },
      { event: 'Favoritism in the Church', desc: 'Rich given preference over poor in church gatherings.' },
      { event: 'Faith and Works', desc: 'Abraham and Rahab demonstrate that real faith produces action.' },
      { event: 'Taming the Tongue', desc: 'The destructive power of uncontrolled speech.' },
      { event: 'Worldly vs. Heavenly Wisdom', desc: 'Contrast between selfish ambition and pure, peaceable wisdom.' },
      { event: 'Prayer for the Sick', desc: 'Elders pray for healing and restoration.' }
    ],
    keyScriptures: [
      { verse: 'James 1:22', text: '"Do not merely listen to the word...Do what it says."', insight: 'True faith results in obedience, not just intellectual agreement.' },
      { verse: 'James 2:17', text: '"Faith by itself, if it is not accompanied by action, is dead."', insight: 'Genuine faith inevitably produces good works.' },
      { verse: 'James 4:7', text: '"Submit yourselves...to God. Resist the devil, and he will flee."', insight: 'Spiritual victory requires submission to God and active resistance to evil.' }
    ],
    keyLocations: [
      { location: 'Jerusalem', desc: 'From where James likely writes as leader of the church.' },
      { location: 'The Dispersion', desc: 'Various locations where Jewish Christians are scattered.' }
    ],
    keyLessons: [
      { title: 'Faith Produces Works', desc: 'Genuine faith necessarily results in obedient action.' },
      { title: 'Trials Develop Character', desc: 'Testing strengthens faith and produces perseverance.' },
      { title: 'Control the Tongue', desc: 'Speech reveals character and requires careful control.' },
      { title: 'Care for the Poor', desc: 'True religion involves practical care for the needy.' },
      { title: 'Humble Before God', desc: 'Submit to God and resist worldly pride and ambition.' },
      { title: 'Prayer in Faith', desc: 'Pray with confidence in God\'s power to heal and restore.' }
    ]
  },
  '1peter': {
    introduction: [
      "Peter writes to Christians scattered throughout Asia Minor, suffering persecution for their faith. He encourages them to persevere with hope in their future inheritance.",
      "The letter emphasizes believers' identity as God's chosen people, living as exiles in a hostile world. Their suffering is temporary; glory awaits those who endure faithfully.",
      "Peter instructs believers to live distinctly holy lives that witness to unbelievers. Even suffering can be redemptive when borne patiently for Christ's sake.",
      "First Peter balances comfort with instruction, assuring believers that their suffering has purpose while calling them to holy conduct, humble submission, and unified love."
    ],
    historicalContext: {
      timePeriod: "Written approximately 62-64 CE, during increasing Roman persecution.",
      authorship: "Peter the apostle, possibly with Silvanus (Silas) as scribe.",
      geography: "Addressed to believers in Pontus, Galatia, Cappadocia, Asia, and Bithynia.",
      transmission: "Canonical epistle providing encouragement and instruction for persecuted Christians."
    },
    keyCharacters: [
      { name: 'Peter', desc: 'Apostle and shepherd encouraging believers facing suffering.' },
      { name: 'Silvanus (Silas)', desc: 'Likely scribe who helped compose the letter.' },
      { name: 'Mark', desc: 'Peter\'s companion mentioned in greetings.' },
      { name: 'The Scattered Believers', desc: 'Christians suffering persecution throughout Asia Minor.' }
    ],
    keyEvents: [
      { event: 'Living Hope Through Resurrection', desc: 'Believers have living hope because Christ is risen.' },
      { event: 'Trials Testing Faith', desc: 'Suffering refines faith like fire refines gold.' },
      { event: 'Holy Living as Exiles', desc: 'Believers are to live holy lives in a pagan world.' },
      { event: 'Submission to Authorities', desc: 'Instructions for relating to government, masters, and leaders.' },
      { event: 'Suffering for Righteousness', desc: 'Blessing comes from suffering for doing good.' },
      { event: 'Shepherding the Flock', desc: 'Elders are to shepherd God\'s flock willingly and humbly.' }
    ],
    keyScriptures: [
      { verse: '1 Peter 2:9', text: '"You are a chosen people, a royal priesthood, a holy nation, God\'s special possession."', insight: 'Believers\' identity is rooted in being chosen and set apart by God.' },
      { verse: '1 Peter 5:7', text: '"Cast all your anxiety on him because he cares for you."', insight: 'God invites believers to entrust all worries to His care.' },
      { verse: '1 Peter 3:15', text: '"Always be prepared to give an answer...for the hope that you have."', insight: 'Believers should be ready to explain their faith with gentleness.' }
    ],
    keyLocations: [
      { location: 'Asia Minor', desc: 'Regions where scattered believers face persecution.' },
      { location: 'Babylon', desc: 'Symbolic reference (likely Rome) from where Peter writes.' }
    ],
    keyLessons: [
      { title: 'Living Hope', desc: 'Resurrection gives believers confident hope for future inheritance.' },
      { title: 'Suffering Refines Faith', desc: 'Trials test and strengthen genuine faith.' },
      { title: 'Holy Living Witnesses', desc: 'Distinct Christian conduct testifies to unbelievers.' },
      { title: 'Suffering for Christ', desc: 'Unjust suffering for righteousness results in blessing.' },
      { title: 'Humble Service', desc: 'Leaders should shepherd willingly, not for personal gain.' },
      { title: 'God Cares for You', desc: 'Cast all anxieties on God who personally cares for His people.' }
    ]
  },
  '2peter': {
    introduction: [
      "Peter's second letter warns against false teachers who deny Christ's return and promote immoral living. It emphasizes the certainty of judgment and the importance of spiritual growth.",
      "Knowing his death is near, Peter urges believers to grow in knowledge of Christ and to live godly lives in light of coming judgment. He warns that false teachers will infiltrate, promoting destructive heresies.",
      "The letter addresses scoffers who mock the promise of Christ's return. Peter explains that God's timing differs from human timing—His patience allows opportunity for repentance.",
      "Second Peter emphasizes that Christ will return to judge and purify creation. Believers should live holy lives while eagerly awaiting the new heavens and new earth."
    ],
    historicalContext: {
      timePeriod: "Written approximately 65-68 CE, shortly before Peter's martyrdom in Rome.",
      authorship: "Peter the apostle, though authorship debated due to style differences from 1 Peter.",
      geography: "Possibly addressed to the same audience as 1 Peter in Asia Minor.",
      transmission: "Canonical epistle warning against false teaching and emphasizing Christ's return."
    },
    keyCharacters: [
      { name: 'Peter', desc: 'Apostle writing his final letter before martyrdom.' },
      { name: 'The Believers', desc: 'Christians needing encouragement to grow and warning about false teachers.' },
      { name: 'False Teachers', desc: 'Those promoting immorality and denying Christ\'s return.' },
      { name: 'The Scoffers', desc: 'Those mocking the promise of Christ\'s second coming.' }
    ],
    keyEvents: [
      { event: 'Call to Spiritual Growth', desc: 'Believers urged to add virtues to their faith progressively.' },
      { event: 'Peter\'s Testament', desc: 'Peter knows his death is near and leaves final instructions.' },
      { event: 'Transfiguration Recalled', desc: 'Peter references seeing Christ\'s glory as evidence of His return.' },
      { event: 'Warning About False Teachers', desc: 'Prediction that destructive heresies will infiltrate the church.' },
      { event: 'Scoffers Dismissed', desc: 'Response to those denying Christ\'s return.' },
      { event: 'The Day of the Lord', desc: 'Description of the day when creation will be renewed.' }
    ],
    keyScriptures: [
      { verse: '2 Peter 3:9', text: '"The Lord is not slow...He is patient with you, not wanting anyone to perish."', insight: 'God\'s delay in returning allows time for repentance.' },
      { verse: '2 Peter 1:3', text: '"His divine power has given us everything we need for a godly life."', insight: 'God has provided all necessary resources for spiritual living.' },
      { verse: '2 Peter 3:18', text: '"Grow in the grace and knowledge of our Lord and Savior Jesus Christ."', insight: 'Christian life involves continuous growth in knowing Christ.' }
    ],
    keyLocations: [
      { location: 'Asia Minor', desc: 'Likely destination of the letter.' },
      { location: 'The Present World', desc: 'Temporary reality that will be destroyed and renewed.' }
    ],
    keyLessons: [
      { title: 'Grow in Christ', desc: 'Add Christian virtues progressively to deepen faith.' },
      { title: 'Beware False Teachers', desc: 'Destructive heresies will infiltrate; test all teaching.' },
      { title: 'Christ Will Return', desc: 'The second coming is certain despite mockers and delays.' },
      { title: 'God\'s Patience', desc: 'Delay in judgment allows opportunity for repentance.' },
      { title: 'Live Holy Lives', desc: 'Anticipation of Christ\'s return should motivate godliness.' },
      { title: 'Scripture Is Authoritative', desc: 'Prophecy comes from God, not human interpretation.' }
    ]
  },
  '1john': {
    introduction: [
      "John's first epistle addresses assurance of salvation and confronts early Gnostic teaching that denied Jesus's full humanity. It emphasizes that genuine faith is demonstrated through love and obedience.",
      "Written to believers troubled by those who left the church denying Christ's incarnation, John provides tests of genuine faith: believing Jesus came in the flesh, obeying God's commands, and loving fellow believers.",
      "The letter's cyclical style repeatedly returns to themes of light and darkness, truth and lies, love and hate. It presents stark contrasts—those who truly know God live distinctly from the world.",
      "First John assures believers they have eternal life while warning against deception. True Christianity involves right belief about Jesus and transformed behavior characterized by love."
    ],
    historicalContext: {
      timePeriod: "Written approximately 85-95 CE, addressing early church challenges with Gnostic-type teaching.",
      authorship: "John the apostle, writing in old age from Ephesus.",
      geography: "Likely addressed to churches in Asia Minor that John oversaw.",
      transmission: "Canonical epistle providing tests for assurance and combating docetic heresy."
    },
    keyCharacters: [
      { name: 'John', desc: 'Apostle writing with pastoral concern and authority.' },
      { name: 'The Readers', desc: 'Believers troubled by those who left denying Christ.' },
      { name: 'The Antichrists', desc: 'Former members who denied Jesus\'s incarnation.' },
      { name: 'Jesus Christ', desc: 'The Son of God who came in flesh and provides salvation.' }
    ],
    keyEvents: [
      { event: 'Proclamation of the Word of Life', desc: 'John testifies to what he has seen and heard about Jesus.' },
      { event: 'Fellowship in the Light', desc: 'Walking in light means fellowship with God and believers.' },
      { event: 'Warning About Antichrists', desc: 'Those denying Christ\'s incarnation have left the church.' },
      { event: 'Test of Love', desc: 'Genuine faith is demonstrated through love for fellow believers.' },
      { event: 'Overcoming the World', desc: 'Faith in Christ provides victory over worldly opposition.' },
      { event: 'Assurance of Eternal Life', desc: 'John writes so readers can know they have eternal life.' }
    ],
    keyScriptures: [
      { verse: '1 John 1:9', text: '"If we confess our sins, he is faithful and just and will forgive us."', insight: 'God forgives all confessed sin through Christ\'s cleansing.' },
      { verse: '1 John 4:8', text: '"Whoever does not love does not know God, because God is love."', insight: 'God\'s essential nature is love; knowing Him produces love for others.' },
      { verse: '1 John 5:13', text: '"I write these things to you...so that you may know that you have eternal life."', insight: 'Believers can have confident assurance of salvation.' }
    ],
    keyLocations: [
      { location: 'Ephesus', desc: 'Likely where John writes and ministers in old age.' },
      { location: 'Asia Minor Churches', desc: 'Congregations receiving this circular letter.' }
    ],
    keyLessons: [
      { title: 'Assurance of Salvation', desc: 'Believers can know with certainty they have eternal life.' },
      { title: 'Tests of Genuine Faith', desc: 'Right belief, obedience, and love demonstrate authentic faith.' },
      { title: 'God Is Love', desc: 'God\'s nature is love; knowing Him produces love for others.' },
      { title: 'Christ Came in Flesh', desc: 'Jesus\'s full humanity and divinity are essential to faith.' },
      { title: 'Confess and Be Forgiven', desc: 'God faithfully forgives confessed sin through Christ.' },
      { title: 'Overcome the World', desc: 'Faith in Christ provides victory over worldly opposition.' }
    ]
  },
  '2john': {
    introduction: [
      "John's second epistle is a brief letter warning against false teachers who deny Jesus's incarnation. It emphasizes the importance of walking in love while refusing to support those promoting heresy.",
      "Addressed to 'the elect lady and her children' (possibly a specific woman or a symbolic reference to a church), John balances love with doctrinal vigilance.",
      "The letter commands believers to love one another while refusing hospitality to those denying Christ came in the flesh. Supporting false teachers makes one complicit in their evil work.",
      "Second John teaches that love operates within the bounds of truth. Genuine love upholds truth rather than compromising it for the sake of tolerance."
    ],
    historicalContext: {
      timePeriod: "Written approximately 85-95 CE, similar period as 1 John.",
      authorship: "John the apostle, referring to himself as 'the elder.'",
      geography: "Addressed to believers in Asia Minor.",
      transmission: "Briefest of John's letters, warning against hospitality to heretics."
    },
    keyCharacters: [
      { name: 'John (The Elder)', desc: 'Apostle writing with pastoral authority.' },
      { name: 'The Elect Lady', desc: 'Woman or church receiving this warning and encouragement.' },
      { name: 'Her Children', desc: 'Believers walking in truth.' },
      { name: 'The Deceivers', desc: 'Those denying Jesus came in the flesh.' }
    ],
    keyEvents: [
      { event: 'Joy in Faithful Children', desc: 'John rejoices that some are walking in truth.' },
      { event: 'Command to Love', desc: 'Believers must love one another as Jesus commanded.' },
      { event: 'Warning About Deceivers', desc: 'Many deny Christ\'s incarnation and lead others astray.' },
      { event: 'Refuse Support for Error', desc: 'Don\'t welcome or support those promoting false teaching.' }
    ],
    keyScriptures: [
      { verse: '2 John 1:6', text: '"This is love: that we walk in obedience to his commands."', insight: 'True love is expressed through obedience to God.' },
      { verse: '2 John 1:9', text: '"Anyone who runs ahead and does not continue in the teaching of Christ does not have God."', insight: 'Departing from Christ\'s teaching means departing from God.' },
      { verse: '2 John 1:10-11', text: '"If anyone comes to you and does not bring this teaching, do not take them into your house."', insight: 'Supporting false teachers makes one complicit in their work.' }
    ],
    keyLocations: [
      { location: 'Asia Minor', desc: 'Region where the recipient lives and false teachers operate.' }
    ],
    keyLessons: [
      { title: 'Love in Truth', desc: 'Genuine love operates within bounds of truth, not at its expense.' },
      { title: 'Guard Sound Doctrine', desc: 'Protect truth about Christ\'s incarnation and identity.' },
      { title: 'Don\'t Support Error', desc: 'Refuse to aid those promoting false teaching.' },
      { title: 'Walk in Obedience', desc: 'Love is demonstrated through obeying God\'s commands.' },
      { title: 'Test Teachers', desc: 'Evaluate all teaching against apostolic truth.' }
    ]
  },
  '3john': {
    introduction: [
      "John's third epistle is a personal letter commending Gaius for his hospitality to traveling teachers while condemning Diotrephes who refused to welcome them and opposed John's authority.",
      "The letter addresses practical church dynamics—how to treat itinerant ministers, the problem of prideful leadership, and the importance of imitating good rather than evil.",
      "Third John demonstrates that supporting gospel workers is a mark of faithfulness, while prideful self-promotion damages the church. Hospitality and humility should characterize Christian leadership.",
      "Though brief, the letter addresses timeless issues: proper use of authority, the importance of supporting ministry, and conflict resolution in the church."
    ],
    historicalContext: {
      timePeriod: "Written approximately 85-95 CE, around the same time as 1 and 2 John.",
      authorship: "John the apostle, writing as 'the elder.'",
      geography: "Addressed to believers in Asia Minor.",
      transmission: "Shortest of John's letters, dealing with church dynamics and leadership."
    },
    keyCharacters: [
      { name: 'John (The Elder)', desc: 'Apostle writing to commend and correct church members.' },
      { name: 'Gaius', desc: 'Faithful believer praised for hospitality to traveling teachers.' },
      { name: 'Diotrephes', desc: 'Prideful church member who rejects John\'s authority and refuses hospitality.' },
      { name: 'Demetrius', desc: 'Highly recommended believer, possibly the letter carrier.' }
    ],
    keyEvents: [
      { event: 'Commendation of Gaius', desc: 'Praise for faithfulness and generous hospitality.' },
      { event: 'Condemnation of Diotrephes', desc: 'Rebuke for pride, gossip, and refusing to welcome teachers.' },
      { event: 'Recommendation of Demetrius', desc: 'Commendation of another faithful believer.' },
      { event: 'Hope to Visit', desc: 'John plans to visit and address issues in person.' }
    ],
    keyScriptures: [
      { verse: '3 John 1:4', text: '"I have no greater joy than to hear that my children are walking in the truth."', insight: 'Spiritual leaders rejoice when those they\'ve taught remain faithful.' },
      { verse: '3 John 1:11', text: '"Dear friend, do not imitate what is evil but what is good."', insight: 'Choose good examples to follow, rejecting prideful behavior.' },
      { verse: '3 John 1:8', text: '"We ought...to show hospitality to such people so that we may work together for the truth."', insight: 'Supporting gospel workers is partnership in truth.' }
    ],
    keyLocations: [
      { location: 'Asia Minor', desc: 'Region where Gaius, Diotrephes, and Demetrius minister.' }
    ],
    keyLessons: [
      { title: 'Support Gospel Workers', desc: 'Hospitality to teachers is partnership in spreading truth.' },
      { title: 'Imitate Good', desc: 'Follow examples of faithfulness, not prideful self-promotion.' },
      { title: 'Reject Prideful Leadership', desc: 'Those who love preeminence damage the church.' },
      { title: 'Walk in Truth', desc: 'Living according to truth brings joy to spiritual leaders.' },
      { title: 'Address Issues Personally', desc: 'Some matters require face-to-face resolution.' }
    ]
  },
  'jude': {
    introduction: [
      "Jude is an urgent warning against false teachers who have infiltrated the church, promoting immorality and denying Christ's lordship. It calls believers to contend for the faith.",
      "Jude, the brother of James and Jesus, intended to write about salvation but felt compelled to address the crisis of false teaching. He draws on Old Testament examples and Jewish tradition to warn of judgment.",
      "The letter describes false teachers in vivid, harsh terms—blemishes, waterless clouds, wandering stars destined for darkness. Their immoral conduct reveals their spiritual bankruptcy.",
      "Despite the stern warnings, Jude concludes with a beautiful doxology praising God who is able to keep believers from stumbling. The letter balances warning with confidence in God's preserving power."
    ],
    historicalContext: {
      timePeriod: "Written approximately 65-80 CE, addressing early infiltration of false teaching.",
      authorship: "Jude, brother of James and Jesus, identifying himself as servant.",
      geography: "Destination unclear, possibly general circulation.",
      transmission: "Short epistle warning against false teachers, closely related to 2 Peter."
    },
    keyCharacters: [
      { name: 'Jude', desc: 'Jesus\'s brother writing urgent warning about false teachers.' },
      { name: 'The Believers', desc: 'Christians needing to contend for authentic faith.' },
      { name: 'The False Teachers', desc: 'Ungodly people perverting grace and denying Christ.' },
      { name: 'Michael the Archangel', desc: 'Example of respect even when disputing with Satan.' }
    ],
    keyEvents: [
      { event: 'Call to Contend for Faith', desc: 'Believers must actively defend the gospel against error.' },
      { event: 'Examples of Judgment', desc: 'Israel in wilderness, Sodom, and fallen angels warn of consequences.' },
      { event: 'Description of False Teachers', desc: 'Vivid characterization of those perverting grace.' },
      { event: 'Remember Apostolic Warnings', desc: 'Scoffers were predicted by the apostles.' },
      { event: 'Build Yourselves Up', desc: 'Instructions for maintaining faith and showing mercy.' },
      { event: 'Doxology', desc: 'Praise to God who keeps believers from falling.' }
    ],
    keyScriptures: [
      { verse: 'Jude 1:3', text: '"Contend for the faith that was once for all entrusted to God\'s holy people."', insight: 'Believers must actively defend authentic gospel teaching.' },
      { verse: 'Jude 1:24-25', text: '"To him who is able to keep you from stumbling and to present you...without fault and with great joy."', insight: 'God preserves believers and will present them blameless.' },
      { verse: 'Jude 1:22', text: '"Be merciful to those who doubt."', insight: 'Show compassion to those struggling with faith.' }
    ],
    keyLocations: [
      { location: 'Egypt and Sodom', desc: 'Examples of God\'s judgment on rebellion and immorality.' }
    ],
    keyLessons: [
      { title: 'Contend for Truth', desc: 'Actively defend the gospel against false teaching.' },
      { title: 'Judgment Is Real', desc: 'God will judge false teachers and all who pervert grace.' },
      { title: 'Persevere in Faith', desc: 'Build yourself up in faith and maintain hope.' },
      { title: 'Show Mercy', desc: 'Have compassion on those struggling or doubting.' },
      { title: 'God Preserves', desc: 'God keeps believers from falling and ensures their final glory.' }
    ]
  },
  'revelation': {
    introduction: [
      "Revelation is apocalyptic prophecy revealing Jesus Christ's ultimate victory over evil and the establishment of God's eternal kingdom. Written to seven churches in Asia Minor, it encourages persecuted believers.",
      "John receives visions of cosmic spiritual warfare, judgments on evil, and the final defeat of Satan, death, and sin. The book uses symbolic imagery drawn from Old Testament prophecy.",
      "Central to Revelation is the Lamb who was slain—Jesus Christ who conquers through sacrificial death and resurrection. He alone is worthy to open the scroll of history and bring God's purposes to fulfillment.",
      "Revelation promises that despite present suffering, Christ will return to judge evil and establish new heavens and new earth. Believers are called to faithful witness even unto death."
    ],
    historicalContext: {
      timePeriod: "Written approximately 95 CE during Roman persecution under Emperor Domitian.",
      authorship: "John the apostle, exiled on Patmos for his faith.",
      geography: "Written on Patmos, addressed to seven churches in Asia Minor.",
      transmission: "Canonical apocalyptic prophecy, final book of the New Testament."
    },
    keyCharacters: [
      { name: 'Jesus Christ (The Lamb)', desc: 'Central figure who conquers through death and reigns forever.' },
      { name: 'John', desc: 'Apostle receiving and recording visions.' },
      { name: 'The Seven Churches', desc: 'Representative congregations facing various challenges.' },
      { name: 'The Dragon (Satan)', desc: 'God\'s enemy who wars against the saints but is defeated.' },
      { name: 'The Beast', desc: 'Symbolic figure representing opposition to God and His people.' },
      { name: 'The Bride', desc: 'The Church prepared for eternal union with Christ.' }
    ],
    keyEvents: [
      { event: 'Vision of Risen Christ', desc: 'John sees Jesus in glory, commanding him to write.' },
      { event: 'Letters to Seven Churches', desc: 'Specific messages addressing each church\'s situation.' },
      { event: 'Throne Room Vision', desc: 'Worship in heaven around God\'s throne.' },
      { event: 'The Lamb Opens the Scroll', desc: 'Only Jesus is worthy to reveal history\'s purposes.' },
      { event: 'Seal, Trumpet, and Bowl Judgments', desc: 'Progressive judgments on rebellious creation.' },
      { event: 'The Fall of Babylon', desc: 'God judges the corrupt system opposing His people.' },
      { event: 'Christ\'s Return', desc: 'Jesus returns as conquering King to judge and reign.' },
      { event: 'Final Judgment', desc: 'All are judged according to their deeds; death and Satan defeated.' },
      { event: 'New Heaven and Earth', desc: 'God creates new reality free from sin, pain, and death.' }
    ],
    keyScriptures: [
      { verse: 'Revelation 1:8', text: '"I am the Alpha and the Omega...who is, and who was, and who is to come, the Almighty."', insight: 'God encompasses all history from beginning to end.' },
      { verse: 'Revelation 21:4', text: '"He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain."', insight: 'Ultimate promise of complete restoration and joy.' },
      { verse: 'Revelation 5:9', text: '"You are worthy...because you were slain, and with your blood you purchased for God persons from every tribe."', insight: 'Christ\'s death redeems people from all nations.' }
    ],
    keyLocations: [
      { location: 'Patmos', desc: 'Island where John is exiled and receives visions.' },
      { location: 'Seven Churches', desc: 'Ephesus, Smyrna, Pergamum, Thyatira, Sardis, Philadelphia, Laodicea.' },
      { location: 'Babylon', desc: 'Symbolic city representing opposition to God.' },
      { location: 'New Jerusalem', desc: 'Eternal city where God dwells with His people forever.' }
    ],
    keyLessons: [
      { title: 'Christ Reigns Victorious', desc: 'Jesus has conquered and will return to establish His kingdom.' },
      { title: 'Faithful Witness Unto Death', desc: 'Believers must remain faithful even if it costs their lives.' },
      { title: 'God Judges Evil', desc: 'All opposition to God will be judged and destroyed.' },
      { title: 'Ultimate Restoration', desc: 'God will create new heavens and earth free from sin and death.' },
      { title: 'Worship the Lamb', desc: 'Jesus alone is worthy of worship and praise.' },
      { title: 'Come, Lord Jesus', desc: 'Believers eagerly await Christ\'s return and eternal reign.' }
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

  const handleSaveNote = async (section, subsection, content) => {
    await saveNoteMutation.mutateAsync({ section, subsection, content });
  };

  const getNote = (section, subsection) => {
    const key = `${section}-${subsection || ''}`;
    return notes[key] || '';
  };

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
              <AIReflectionQuestions section="Introduction" content={content.introduction.join(' ')} guideId={guide.id} />
              <GideonStudyAssistant guideId={guide.id} section="introduction" content={content.introduction.join(' ')} />
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
              <AIReflectionQuestions section="Key Characters" content={content.keyCharacters.map(c => c.desc).join(' ')} guideId={guide.id} />
              <GideonStudyAssistant guideId={guide.id} section="keyCharacters" content={content.keyCharacters.map(c => c.desc).join(' ')} />
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
              <AIReflectionQuestions section="Key Events" content={content.keyEvents.map(e => e.desc).join(' ')} guideId={guide.id} />
              <GideonStudyAssistant guideId={guide.id} section="keyEvents" content={content.keyEvents.map(e => e.desc).join(' ')} />
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
              <AIReflectionQuestions section="Key Scriptures" content={content.keyScriptures.map(s => s.text).join(' ')} guideId={guide.id} />
              <GideonStudyAssistant guideId={guide.id} section="keyScriptures" content={content.keyScriptures.map(s => s.text).join(' ')} />
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
              <AIReflectionQuestions section="Key Locations" content={content.keyLocations.map(l => l.desc).join(' ')} guideId={guide.id} />
              <GideonStudyAssistant guideId={guide.id} section="keyLocations" content={content.keyLocations.map(l => l.desc).join(' ')} />
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
              <AIReflectionQuestions section="Key Lessons" content={content.keyLessons.map(l => l.desc).join(' ')} guideId={guide.id} />
              <GideonStudyAssistant guideId={guide.id} section="keyLessons" content={content.keyLessons.map(l => l.desc).join(' ')} />
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