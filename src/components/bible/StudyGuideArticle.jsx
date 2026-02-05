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