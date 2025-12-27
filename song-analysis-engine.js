/**
 * Advanced Song Analysis & Grading Engine
 * Provides critical analysis of lyrics with detailed feedback and improvement suggestions
 */

class SongAnalysisEngine {
    constructor() {
        this.gradingCriteria = {
            lyricalContent: {
                weight: 0.25,
                subcriteria: {
                    originality: 0.3,
                    depth: 0.25,
                    storytelling: 0.25,
                    imagery: 0.2
                }
            },
            structure: {
                weight: 0.20,
                subcriteria: {
                    organization: 0.4,
                    flow: 0.3,
                    transitions: 0.3
                }
            },
            rhymeScheme: {
                weight: 0.15,
                subcriteria: {
                    consistency: 0.4,
                    creativity: 0.35,
                    naturalness: 0.25
                }
            },
            wordplay: {
                weight: 0.15,
                subcriteria: {
                    metaphors: 0.3,
                    wordChoice: 0.3,
                    cleverness: 0.25,
                    alliteration: 0.15
                }
            },
            emotion: {
                weight: 0.15,
                subcriteria: {
                    authenticity: 0.4,
                    impact: 0.35,
                    consistency: 0.25
                }
            },
            technical: {
                weight: 0.10,
                subcriteria: {
                    syllableCount: 0.3,
                    rhythm: 0.4,
                    pronunciation: 0.3
                }
            }
        };

        this.gradeThresholds = {
            'A+': 95,
            'A': 90,
            'A-': 87,
            'B+': 83,
            'B': 80,
            'B-': 77,
            'C+': 73,
            'C': 70,
            'C-': 67,
            'D+': 63,
            'D': 60,
            'F': 0
        };

        this.commonWords = new Set([
            'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
        ]);

        this.clichePhrases = new Set([
            'baby', 'love me', 'heart', 'forever', 'never let you go', 'you and me', 'meant to be', 'destiny', 'soul mate', 'broken heart', 'tears', 'cry', 'die for you', 'angel', 'heaven', 'perfect', 'beautiful', 'amazing', 'incredible', 'unbelievable', 'party all night', 'turn up', 'hands up', 'feel the beat', 'dance floor', 'tonight', 'live it up', 'money', 'cash', 'bling', 'swag', 'haters', 'fake friends'
        ]);

        // Rap-specific analysis criteria
        this.rapGradingCriteria = {
            lyricalContent: {
                weight: 0.20,
                subcriteria: {
                    originality: 0.25,
                    storytelling: 0.25,
                    wordplay: 0.25,
                    punchlines: 0.25
                }
            },
            flow: {
                weight: 0.25,
                subcriteria: {
                    syllablePattern: 0.3,
                    rhythmConsistency: 0.3,
                    delivery: 0.25,
                    pocketRiding: 0.15
                }
            },
            rhymeScheme: {
                weight: 0.20,
                subcriteria: {
                    internalRhymes: 0.4,
                    multisyllabicRhymes: 0.3,
                    rhymeDensity: 0.3
                }
            },
            wordplay: {
                weight: 0.15,
                subcriteria: {
                    metaphors: 0.25,
                    doubleEntendres: 0.25,
                    alliteration: 0.2,
                    puns: 0.15,
                    vocabulary: 0.15
                }
            },
            technical: {
                weight: 0.15,
                subcriteria: {
                    syllableCount: 0.25,
                    stressPatterns: 0.25,
                    breathControl: 0.25,
                    enunciation: 0.25
                }
            },
            authenticity: {
                weight: 0.05,
                subcriteria: {
                    voice: 0.5,
                    credibility: 0.5
                }
            }
        };

        this.rapKeywords = new Set([
            'bars', 'flow', 'rhyme', 'beat', 'mic', 'spit', 'drop', 'verse', 'hook', 'freestyle', 'cypher', 'battle', 'rap', 'hip hop', 'yo', 'uh', 'yeah', 'check', 'listen', 'word', 'real', 'street', 'hood', 'game', 'hustle', 'grind', 'stack', 'paper', 'bread', 'dough', 'green', 'bands', 'racks', 'whip', 'ride', 'chain', 'ice', 'drip', 'flex', 'stuntin', 'ballin', 'player', 'boss', 'king', 'queen', 'crown', 'throne', 'empire', 'dynasty', 'legacy', 'legend', 'goat', 'fire', 'flames', 'heat', 'cold', 'sick', 'ill', 'dope', 'fresh', 'clean', 'smooth', 'tight', 'hard', 'raw', 'real', 'true', 'facts', 'straight', 'no cap', 'for real', 'deadass', 'lowkey', 'highkey', 'periodt', 'slaps', 'bangs', 'hits different'
        ]);

        this.rapCliches = new Set([
            'money over everything', 'started from the bottom', 'haters gonna hate', 'keep it 100', 'real recognize real', 'stay woke', 'get money', 'stack paper', 'hustle hard', 'grind never stops', 'came from nothing', 'rags to riches', 'self made', 'no handouts', 'trust nobody', 'loyalty over royalty', 'family first', 'blood thicker than water', 'ride or die', 'day one', 'og', 'been there', 'seen it all', 'streets raised me', 'concrete jungle', 'urban legend', 'king of the city', 'run the game', 'own the block', 'top of the food chain'
        ]);
    }

    /**
     * Main analysis method - returns comprehensive grade and feedback
     */
    analyzeSong(lyrics, metadata = {}) {
        try {
            // Detect if this is rap/hip-hop
            const isRap = this.detectRapGenre(lyrics);
            
            const analysis = this.performDetailedAnalysis(lyrics, metadata, isRap);
            const grade = this.calculateOverallGrade(analysis, isRap);
            const feedback = this.generateDetailedFeedback(analysis, grade, isRap);
            const improvements = this.generateImprovementSuggestions(analysis, grade, isRap);

            return {
                grade: grade,
                overallScore: analysis.overallScore,
                breakdown: analysis.breakdown,
                feedback: feedback,
                improvements: improvements,
                strengths: this.identifyStrengths(analysis, isRap),
                weaknesses: this.identifyWeaknesses(analysis, isRap),
                isRap: isRap,
                rapAnalysis: isRap ? analysis.rapSpecific : null,
                metadata: {
                    wordCount: analysis.stats.wordCount,
                    uniqueWords: analysis.stats.uniqueWords,
                    averageLineLength: analysis.stats.averageLineLength,
                    structureDetected: analysis.structure.detected,
                    rhymeSchemePattern: analysis.rhyme.pattern,
                    genre: isRap ? 'Rap/Hip-Hop' : 'General'
                }
            };
        } catch (error) {
            console.error('Analysis error:', error);
            return this.getErrorAnalysis();
        }
    }

    /**
     * Detect if lyrics are rap/hip-hop based on content and style
     */
    detectRapGenre(lyrics) {
        const cleanLyrics = lyrics.toLowerCase();
        let rapScore = 0;
        
        // Check for rap keywords
        const rapKeywordCount = Array.from(this.rapKeywords).reduce((count, keyword) => {
            return count + (cleanLyrics.includes(keyword) ? 1 : 0);
        }, 0);
        rapScore += rapKeywordCount * 2;
        
        // Check for rap-style patterns
        const lines = lyrics.split('\n').filter(line => line.trim());
        
        // Check for short, punchy lines (typical of rap)
        const shortLines = lines.filter(line => line.split(' ').length <= 8).length;
        const shortLineRatio = shortLines / lines.length;
        if (shortLineRatio > 0.6) rapScore += 5;
        
        // Check for internal rhymes
        let internalRhymeCount = 0;
        lines.forEach(line => {
            const words = line.split(' ');
            for (let i = 0; i < words.length - 1; i++) {
                if (this.wordsRhyme(words[i], words[i + 1])) {
                    internalRhymeCount++;
                }
            }
        });
        if (internalRhymeCount > lines.length * 0.3) rapScore += 8;
        
        // Check for repetitive patterns (hooks/choruses in rap)
        const repeatedLines = this.findRepeatedLines(lines);
        if (repeatedLines.length > 0) rapScore += 3;
        
        // Check for aggressive/confident language
        const aggressiveWords = ['kill', 'murder', 'destroy', 'dominate', 'crush', 'beast', 'savage', 'fire', 'flames'];
        const aggressiveCount = aggressiveWords.reduce((count, word) => 
            count + (cleanLyrics.includes(word) ? 1 : 0), 0);
        rapScore += aggressiveCount;
        
        // Check for first person perspective (common in rap)
        const firstPersonCount = (cleanLyrics.match(/\b(i|me|my|mine|myself)\b/g) || []).length;
        if (firstPersonCount > lines.length * 0.5) rapScore += 4;
        
        return rapScore >= 15; // Threshold for rap detection
    }

    /**
     * Perform detailed analysis across all criteria
     */
    performDetailedAnalysis(lyrics, metadata, isRap = false) {
        const cleanLyrics = this.preprocessLyrics(lyrics);
        const actualLines = this.getActualLines(lyrics); // Use proper line detection
        const songPurpose = this.detectSongPurpose(lyrics); // Detect song context
        const stats = this.calculateBasicStats(cleanLyrics, actualLines);
        const structure = this.analyzeStructure(cleanLyrics);
        const rhyme = this.analyzeRhymeScheme(cleanLyrics, actualLines);
        const wordplay = this.analyzeWordplay(cleanLyrics);
        const emotion = this.analyzeEmotion(cleanLyrics);
        const content = this.analyzeLyricalContent(cleanLyrics, stats);
        const technical = this.analyzeTechnical(cleanLyrics, stats);

        let breakdown, rapSpecific = null;

        if (isRap) {
            // Specialized rap analysis
            const flow = this.analyzeRapFlow(cleanLyrics, stats);
            const rapRhyme = this.analyzeRapRhymeScheme(cleanLyrics);
            const rapWordplay = this.analyzeRapWordplay(cleanLyrics);
            const rapTechnical = this.analyzeRapTechnical(cleanLyrics, stats);
            const authenticity = this.analyzeRapAuthenticity(cleanLyrics);

            rapSpecific = {
                flow,
                rapRhyme,
                rapWordplay,
                rapTechnical,
                authenticity
            };

            breakdown = {
                lyricalContent: this.scoreRapLyricalContent(content, rapWordplay),
                flow: this.scoreRapFlow(flow),
                rhymeScheme: this.scoreRapRhymeScheme(rapRhyme),
                wordplay: this.scoreRapWordplay(rapWordplay),
                technical: this.scoreRapTechnical(rapTechnical),
                authenticity: this.scoreRapAuthenticity(authenticity)
            };
        } else {
            breakdown = {
                lyricalContent: this.scoreLyricalContent(content),
                structure: this.scoreStructure(structure),
                rhymeScheme: this.scoreRhymeScheme(rhyme),
                wordplay: this.scoreWordplay(wordplay),
                emotion: this.scoreEmotion(emotion),
                technical: this.scoreTechnical(technical)
            };
        }

        const overallScore = this.calculateWeightedScore(breakdown, isRap);

        return {
            originalLyrics: lyrics,
            actualLines: actualLines,
            songPurpose: songPurpose,
            stats,
            structure,
            rhyme,
            wordplay,
            emotion,
            content,
            technical,
            breakdown,
            overallScore,
            rapSpecific
        };
    }

    /**
     * Preprocess lyrics for analysis
     */
    preprocessLyrics(lyrics) {
        return lyrics
            .replace(/\[.*?\]/g, '') // Remove structure markers
            .replace(/\(\d{2}:\d{2}\)/g, '') // Remove timestamps
            .replace(/[^\w\s\n.,!?;:'"()-]/g, '') // Keep only essential punctuation
            .toLowerCase()
            .trim();
    }

    /**
     * Detect song purpose and context for intelligent feedback
     */
    detectSongPurpose(lyrics) {
        const cleanLyrics = lyrics.toLowerCase();
        const purposes = {
            love_song: 0,
            diss_track: 0,
            storytelling: 0,
            party_anthem: 0,
            motivational: 0,
            sad_ballad: 0,
            braggadocious: 0,
            social_commentary: 0,
            fictional_narrative: 0,
            personal_experience: 0
        };

        // Love song indicators
        const loveWords = ['love', 'heart', 'kiss', 'forever', 'together', 'romance', 'baby', 'honey', 'darling', 'beautiful', 'gorgeous', 'miss you', 'need you', 'want you'];
        loveWords.forEach(word => {
            if (cleanLyrics.includes(word)) purposes.love_song += 2;
        });

        // Diss track indicators
        const dissWords = ['fake', 'weak', 'trash', 'pathetic', 'loser', 'clown', 'wannabe', 'fraud', 'exposed', 'destroyed', 'murdered', 'killed', 'bodied', 'you ain\'t', 'you\'re not'];
        dissWords.forEach(word => {
            if (cleanLyrics.includes(word)) purposes.diss_track += 3;
        });

        // Storytelling indicators
        const storyWords = ['once upon', 'back in', 'remember when', 'there was a', 'he said', 'she said', 'then he', 'then she', 'chapter', 'story', 'tale'];
        storyWords.forEach(word => {
            if (cleanLyrics.includes(word)) purposes.storytelling += 2;
        });

        // Party anthem indicators
        const partyWords = ['party', 'dance', 'club', 'tonight', 'turn up', 'hands up', 'everybody', 'let\'s go', 'feel the beat', 'move your body', 'celebration'];
        partyWords.forEach(word => {
            if (cleanLyrics.includes(word)) purposes.party_anthem += 2;
        });

        // Motivational indicators
        const motivationalWords = ['never give up', 'keep going', 'believe', 'dream', 'achieve', 'success', 'winner', 'champion', 'overcome', 'rise up', 'fight'];
        motivationalWords.forEach(word => {
            if (cleanLyrics.includes(word)) purposes.motivational += 2;
        });

        // Sad ballad indicators
        const sadWords = ['cry', 'tears', 'pain', 'hurt', 'broken', 'lonely', 'empty', 'lost', 'gone', 'goodbye', 'sorry', 'regret'];
        sadWords.forEach(word => {
            if (cleanLyrics.includes(word)) purposes.sad_ballad += 2;
        });

        // Braggadocious indicators
        const bragWords = ['best', 'greatest', 'king', 'queen', 'boss', 'legend', 'goat', 'number one', 'top of', 'better than', 'superior'];
        bragWords.forEach(word => {
            if (cleanLyrics.includes(word)) purposes.braggadocious += 2;
        });

        // Social commentary indicators
        const socialWords = ['society', 'system', 'government', 'politics', 'injustice', 'freedom', 'equality', 'change the world', 'wake up', 'truth'];
        socialWords.forEach(word => {
            if (cleanLyrics.includes(word)) purposes.social_commentary += 2;
        });

        // Fictional narrative indicators
        const fictionWords = ['character', 'protagonist', 'villain', 'kingdom', 'magic', 'dragon', 'princess', 'hero', 'quest', 'adventure'];
        fictionWords.forEach(word => {
            if (cleanLyrics.includes(word)) purposes.fictional_narrative += 3;
        });

        // Personal experience indicators
        const personalWords = ['my life', 'i remember', 'when i was', 'my story', 'i grew up', 'my family', 'my mother', 'my father', 'real talk', 'true story'];
        personalWords.forEach(word => {
            if (cleanLyrics.includes(word)) purposes.personal_experience += 3;
        });

        // Check for third person vs first person
        const firstPersonCount = (cleanLyrics.match(/\b(i|me|my|mine)\b/g) || []).length;
        const thirdPersonCount = (cleanLyrics.match(/\b(he|she|they|him|her|them)\b/g) || []).length;
        
        if (thirdPersonCount > firstPersonCount * 1.5) {
            purposes.storytelling += 5;
            purposes.fictional_narrative += 3;
        } else if (firstPersonCount > thirdPersonCount * 2) {
            purposes.personal_experience += 4;
        }

        // Find the highest scoring purpose
        const topPurpose = Object.entries(purposes).reduce((a, b) => purposes[a[0]] > purposes[b[0]] ? a : b);
        
        return {
            primary: topPurpose[0],
            score: topPurpose[1],
            all: purposes,
            confidence: topPurpose[1] > 8 ? 'high' : topPurpose[1] > 4 ? 'medium' : 'low'
        };
    }

    /**
     * Better line detection that respects actual line breaks
     */
    getActualLines(lyrics) {
        // Split on actual line breaks and filter empty lines
        return lyrics.split(/\r?\n/).filter(line => line.trim().length > 0);
    }

    /**
     * Calculate basic statistics
     */
    calculateBasicStats(lyrics, actualLines = null) {
        const lines = actualLines || lyrics.split('\n').filter(line => line.trim());
        const words = lyrics.split(/\s+/).filter(word => word.length > 0);
        const uniqueWords = new Set(words.map(word => word.replace(/[^\w]/g, '')));

        return {
            lineCount: lines.length,
            wordCount: words.length,
            uniqueWords: uniqueWords.size,
            averageLineLength: words.length / lines.length || 0,
            vocabularyRichness: uniqueWords.size / words.length || 0,
            lines: lines,
            words: words
        };
    }

    /**
     * Analyze song structure
     */
    analyzeStructure(lyrics) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        const sections = this.identifySections(lyrics);
        
        return {
            detected: sections.length > 0,
            sections: sections,
            hasVerse: sections.some(s => s.type === 'verse'),
            hasChorus: sections.some(s => s.type === 'chorus'),
            hasBridge: sections.some(s => s.type === 'bridge'),
            organization: this.evaluateOrganization(sections),
            flow: this.evaluateFlow(lines),
            transitions: this.evaluateTransitions(sections)
        };
    }

    /**
     * Analyze rhyme scheme
     */
    analyzeRhymeScheme(lyrics) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        const rhymePattern = this.detectRhymePattern(lines);
        
        return {
            pattern: rhymePattern,
            consistency: this.evaluateRhymeConsistency(rhymePattern),
            creativity: this.evaluateRhymeCreativity(lines),
            naturalness: this.evaluateRhymeNaturalness(lines)
        };
    }

    /**
     * Analyze wordplay and literary devices
     */
    analyzeWordplay(lyrics) {
        const metaphors = this.detectMetaphors(lyrics);
        const alliteration = this.detectAlliteration(lyrics);
        const wordChoice = this.evaluateWordChoice(lyrics);
        
        return {
            metaphors: metaphors,
            alliteration: alliteration,
            wordChoice: wordChoice,
            cleverness: this.evaluateCleverness(lyrics)
        };
    }

    /**
     * Analyze emotional content
     */
    analyzeEmotion(lyrics) {
        const emotions = this.detectEmotions(lyrics);
        const authenticity = this.evaluateAuthenticity(lyrics);
        const impact = this.evaluateEmotionalImpact(lyrics);
        
        return {
            primaryEmotion: emotions.primary,
            emotionalRange: emotions.range,
            authenticity: authenticity,
            impact: impact,
            consistency: this.evaluateEmotionalConsistency(lyrics)
        };
    }

    /**
     * Analyze lyrical content quality
     */
    analyzeLyricalContent(lyrics, stats) {
        return {
            originality: this.evaluateOriginality(lyrics),
            depth: this.evaluateDepth(lyrics, stats),
            storytelling: this.evaluateStorytelling(lyrics),
            imagery: this.evaluateImagery(lyrics)
        };
    }

    /**
     * Analyze technical aspects
     */
    analyzeTechnical(lyrics, stats) {
        return {
            syllableCount: this.evaluateSyllableConsistency(lyrics),
            rhythm: this.evaluateRhythm(lyrics),
            pronunciation: this.evaluatePronunciation(lyrics)
        };
    }

    /**
     * Score lyrical content (0-100)
     */
    scoreLyricalContent(content) {
        const criteria = this.gradingCriteria.lyricalContent.subcriteria;
        return (
            content.originality * criteria.originality +
            content.depth * criteria.depth +
            content.storytelling * criteria.storytelling +
            content.imagery * criteria.imagery
        );
    }

    /**
     * Score structure (0-100)
     */
    scoreStructure(structure) {
        const criteria = this.gradingCriteria.structure.subcriteria;
        return (
            structure.organization * criteria.organization +
            structure.flow * criteria.flow +
            structure.transitions * criteria.transitions
        );
    }

    /**
     * Score rhyme scheme (0-100)
     */
    scoreRhymeScheme(rhyme) {
        const criteria = this.gradingCriteria.rhymeScheme.subcriteria;
        return (
            rhyme.consistency * criteria.consistency +
            rhyme.creativity * criteria.creativity +
            rhyme.naturalness * criteria.naturalness
        );
    }

    /**
     * Score wordplay (0-100)
     */
    scoreWordplay(wordplay) {
        const criteria = this.gradingCriteria.wordplay.subcriteria;
        return (
            wordplay.metaphors * criteria.metaphors +
            wordplay.wordChoice * criteria.wordChoice +
            wordplay.cleverness * criteria.cleverness +
            wordplay.alliteration * criteria.alliteration
        );
    }

    /**
     * Score emotion (0-100)
     */
    scoreEmotion(emotion) {
        const criteria = this.gradingCriteria.emotion.subcriteria;
        return (
            emotion.authenticity * criteria.authenticity +
            emotion.impact * criteria.impact +
            emotion.consistency * criteria.consistency
        );
    }

    /**
     * Score technical aspects (0-100)
     */
    scoreTechnical(technical) {
        const criteria = this.gradingCriteria.technical.subcriteria;
        return (
            technical.syllableCount * criteria.syllableCount +
            technical.rhythm * criteria.rhythm +
            technical.pronunciation * criteria.pronunciation
        );
    }

    /**
     * Calculate weighted overall score
     */
    calculateWeightedScore(breakdown, isRap = false) {
        const weights = isRap ? this.rapGradingCriteria : this.gradingCriteria;
        
        if (isRap) {
            return (
                breakdown.lyricalContent * weights.lyricalContent.weight +
                breakdown.flow * weights.flow.weight +
                breakdown.rhymeScheme * weights.rhymeScheme.weight +
                breakdown.wordplay * weights.wordplay.weight +
                breakdown.technical * weights.technical.weight +
                breakdown.authenticity * weights.authenticity.weight
            ) * 100;
        } else {
            return (
                breakdown.lyricalContent * weights.lyricalContent.weight +
                breakdown.structure * weights.structure.weight +
                breakdown.rhymeScheme * weights.rhymeScheme.weight +
                breakdown.wordplay * weights.wordplay.weight +
                breakdown.emotion * weights.emotion.weight +
                breakdown.technical * weights.technical.weight
            ) * 100;
        }
    }

    // RAP-SPECIFIC SCORING METHODS

    /**
     * Score rap lyrical content
     */
    scoreRapLyricalContent(content, rapWordplay) {
        const criteria = this.rapGradingCriteria.lyricalContent.subcriteria;
        return (
            content.originality * criteria.originality +
            content.storytelling * criteria.storytelling +
            rapWordplay.density * criteria.wordplay +
            rapWordplay.punchlines * criteria.punchlines
        );
    }

    /**
     * Score rap flow
     */
    scoreRapFlow(flow) {
        const criteria = this.rapGradingCriteria.flow.subcriteria;
        return (
            flow.syllablePattern * criteria.syllablePattern +
            flow.rhythmConsistency * criteria.rhythmConsistency +
            flow.delivery * criteria.delivery +
            flow.pocketRiding * criteria.pocketRiding
        );
    }

    /**
     * Score rap rhyme scheme
     */
    scoreRapRhymeScheme(rapRhyme) {
        const criteria = this.rapGradingCriteria.rhymeScheme.subcriteria;
        return (
            rapRhyme.internalRhymes * criteria.internalRhymes +
            rapRhyme.multisyllabicRhymes * criteria.multisyllabicRhymes +
            rapRhyme.rhymeDensity * criteria.rhymeDensity
        );
    }

    /**
     * Score rap wordplay
     */
    scoreRapWordplay(rapWordplay) {
        const criteria = this.rapGradingCriteria.wordplay.subcriteria;
        return (
            rapWordplay.metaphors * criteria.metaphors +
            rapWordplay.doubleEntendres * criteria.doubleEntendres +
            rapWordplay.alliteration * criteria.alliteration +
            rapWordplay.puns * criteria.puns +
            rapWordplay.vocabulary * criteria.vocabulary
        );
    }

    /**
     * Score rap technical execution
     */
    scoreRapTechnical(rapTechnical) {
        const criteria = this.rapGradingCriteria.technical.subcriteria;
        return (
            rapTechnical.syllableCount * criteria.syllableCount +
            rapTechnical.stressPatterns * criteria.stressPatterns +
            rapTechnical.breathControl * criteria.breathControl +
            rapTechnical.enunciation * criteria.enunciation
        );
    }

    /**
     * Score rap authenticity
     */
    scoreRapAuthenticity(authenticity) {
        const criteria = this.rapGradingCriteria.authenticity.subcriteria;
        return (
            authenticity.voice * criteria.voice +
            authenticity.credibility * criteria.credibility
        );
    }

    /**
     * Convert score to letter grade
     */
    calculateOverallGrade(analysis) {
        const score = analysis.overallScore;
        
        for (const [grade, threshold] of Object.entries(this.gradeThresholds)) {
            if (score >= threshold) {
                return grade;
            }
        }
        return 'F';
    }

    /**
     * Generate detailed critical feedback with specific examples and brutal honesty
     */
    generateDetailedFeedback(analysis, grade, isRap = false) {
        const lyrics = analysis.originalLyrics || '';
        
        let feedback;
        
        if (isRap) {
            feedback = {
                overall: this.getRapOverallFeedback(grade, analysis.overallScore),
                lyricalContent: this.getRapLyricalContentFeedback(analysis.content, analysis.rapSpecific.rapWordplay, analysis.breakdown.lyricalContent, lyrics),
                flow: this.getRapFlowFeedback(analysis.rapSpecific.flow, analysis.breakdown.flow, lyrics),
                rhymeScheme: this.getRapRhymeFeedback(analysis.rapSpecific.rapRhyme, analysis.breakdown.rhymeScheme, lyrics),
                wordplay: this.getRapWordplayFeedback(analysis.rapSpecific.rapWordplay, analysis.breakdown.wordplay, lyrics),
                technical: this.getRapTechnicalFeedback(analysis.rapSpecific.rapTechnical, analysis.breakdown.technical, lyrics),
                authenticity: this.getRapAuthenticityFeedback(analysis.rapSpecific.authenticity, analysis.breakdown.authenticity, lyrics),
                specificIssues: this.identifyRapSpecificIssues(lyrics, analysis),
                lineByLineBreakdown: this.generateRapLineByLineBreakdown(lyrics, analysis)
            };
        } else {
            feedback = {
                overall: this.getOverallFeedback(grade, analysis.overallScore),
                lyricalContent: this.getLyricalContentFeedback(analysis.content, analysis.breakdown.lyricalContent, lyrics),
                structure: this.getStructureFeedback(analysis.structure, analysis.breakdown.structure, lyrics),
                rhymeScheme: this.getRhymeFeedback(analysis.rhyme, analysis.breakdown.rhymeScheme, lyrics),
                wordplay: this.getWordplayFeedback(analysis.wordplay, analysis.breakdown.wordplay, lyrics),
                emotion: this.getEmotionFeedback(analysis.emotion, analysis.breakdown.emotion, lyrics),
                technical: this.getTechnicalFeedback(analysis.technical, analysis.breakdown.technical, lyrics),
                specificIssues: this.identifySpecificIssues(lyrics, analysis),
                lineByLineBreakdown: this.generateLineByLineBreakdown(lyrics, analysis)
            };
        }

        return feedback;
    }

    // RAP-SPECIFIC FEEDBACK METHODS

    getRapOverallFeedback(grade, score) {
        if (grade === 'A+') {
            return `🔥 LEGENDARY! Your rap skills are at ${score.toFixed(1)}% - This is FIRE! You've got the flow, the bars, and the technical skills of a professional MC.`;
        } else if (grade.startsWith('A')) {
            return `💯 DOPE! Solid rap with ${score.toFixed(1)}% - You've got skills but need to tighten up a few areas to reach legendary status.`;
        } else if (grade.startsWith('B')) {
            return `👍 DECENT! ${score.toFixed(1)}% - You can rap, but you're not ready for the cypher yet. Work on your craft.`;
        } else if (grade.startsWith('C')) {
            return `😬 WEAK! ${score.toFixed(1)}% - Your bars need serious work. This wouldn't survive a battle.`;
        } else {
            return `💀 TRASH! ${score.toFixed(1)}% - This is not rap. Go back to the drawing board and study the greats.`;
        }
    }

    getRapLyricalContentFeedback(content, rapWordplay, score, lyrics) {
        const issues = [];
        const examples = [];
        
        if (score < 90) {
            const rapCliches = this.findRapCliches(lyrics);
            if (rapCliches.length > 0) {
                issues.push(`RAP CLICHÉS: Found ${rapCliches.length} overused rap phrases - you sound like every other wannabe`);
                examples.push(`"${rapCliches[0]}" is played out - find your own voice!`);
            }
            
            if (rapWordplay.punchlines < 60) {
                issues.push("NO PUNCHLINES: Where are the bars that make people go 'OHHH!'?");
                examples.push("Add setup-punchline combos: 'They say I'm broke, but my spirit's rich / While they count pennies, I count my wins'");
            }
            
            if (content.storytelling < 70) {
                issues.push("WEAK STORYTELLING: You're just saying words, not painting pictures");
                examples.push("Tell a story: Where you came from, where you're going, what you've seen");
            }
        }
        
        let feedback = "";
        if (score >= 90) {
            feedback = "🔥 FIRE CONTENT: Your lyrics are original and hit hard!";
        } else if (score >= 80) {
            feedback = "💯 SOLID BARS: Good content but could use more punch.";
        } else if (score >= 70) {
            feedback = "😐 BASIC: Your lyrics are okay but nothing special.";
        } else {
            feedback = "💀 TRASH BARS: These lyrics are weak and unoriginal.";
        }
        
        return {
            summary: feedback,
            issues: issues,
            examples: examples,
            score: score
        };
    }

    getRapFlowFeedback(flow, score, lyrics) {
        const issues = [];
        const examples = [];
        
        if (score < 90) {
            if (flow.syllablePattern < 70) {
                issues.push("BROKEN FLOW: Your syllable count is all over the place");
                examples.push(`Keep consistent patterns: 8-8-8-8 or 12-12-12-12 syllables per bar`);
            }
            
            if (flow.rhythmConsistency < 60) {
                issues.push("OFF-BEAT: You're not riding the pocket - sounds choppy");
                examples.push("Practice with a metronome - your flow should lock into the beat");
            }
            
            if (flow.delivery < 70) {
                issues.push("BORING DELIVERY: No flow switches or dynamic changes");
                examples.push("Switch up your flow: fast-slow-fast or triplets to straight time");
            }
        }
        
        let feedback = "";
        if (score >= 90) {
            feedback = "🌊 SMOOTH FLOW: Your rhythm is locked in and sounds professional!";
        } else if (score >= 80) {
            feedback = "👍 DECENT FLOW: Good rhythm but could use more variation.";
        } else if (score >= 70) {
            feedback = "😬 CHOPPY: Your flow needs work to sound smooth.";
        } else {
            feedback = "💀 NO FLOW: This doesn't sound like rap - work on your rhythm.";
        }
        
        return {
            summary: feedback,
            issues: issues,
            examples: examples,
            score: score
        };
    }

    getRapRhymeFeedback(rapRhyme, score, lyrics) {
        const issues = [];
        const examples = [];
        
        if (score < 90) {
            if (rapRhyme.internalRhymes < 60) {
                issues.push("NO INTERNAL RHYMES: You're only rhyming at the end of bars like a beginner");
                examples.push("Add internal rhymes: 'I SPIT fire while I SPLIT wires, my GRIT higher than your QUIT desires'");
            }
            
            if (rapRhyme.multisyllabicRhymes < 50) {
                issues.push("BASIC RHYMES: Single syllable rhymes are elementary");
                examples.push("Use multisyllabic rhymes: 'EDUCATION / DEDICATION' or 'INCREDIBLE / UNFORGETTABLE'");
            }
            
            if (rapRhyme.rhymeDensity < 70) {
                issues.push("LOW RHYME DENSITY: Not enough rhymes per bar");
                examples.push("Pack more rhymes: Every 2-4 words should connect sonically");
            }
        }
        
        let feedback = "";
        if (score >= 90) {
            feedback = "🎯 RHYME MASTER: Complex rhyme schemes that show real skill!";
        } else if (score >= 80) {
            feedback = "👌 GOOD RHYMES: Solid rhyming but could be more complex.";
        } else if (score >= 70) {
            feedback = "😐 BASIC RHYMES: Predictable rhyme patterns.";
        } else {
            feedback = "💀 WEAK RHYMES: Forced and basic - sounds amateur.";
        }
        
        return {
            summary: feedback,
            issues: issues,
            examples: examples,
            score: score
        };
    }

    getRapWordplayFeedback(rapWordplay, score, lyrics) {
        const issues = [];
        const examples = [];
        
        if (score < 90) {
            if (rapWordplay.metaphors < 60) {
                issues.push("NO METAPHORS: Your bars are literal and boring");
                examples.push("Use metaphors: 'My flow's a river, yours is a puddle' or 'I'm a lion, you're a poodle'");
            }
            
            if (rapWordplay.doubleEntendres < 50) {
                issues.push("NO DOUBLE MEANINGS: Missing the wordplay that makes rap clever");
                examples.push("Double entendres: 'I'm BANKING on success' (money + relying on)");
            }
            
            if (rapWordplay.vocabulary < 70) {
                issues.push("LIMITED VOCABULARY: Using basic words like a amateur");
                examples.push("Expand vocabulary: 'devastated' instead of 'sad', 'annihilate' instead of 'beat'");
            }
        }
        
        let feedback = "";
        if (score >= 90) {
            feedback = "🧠 WORDPLAY GENIUS: Clever bars that show real lyrical skill!";
        } else if (score >= 80) {
            feedback = "💭 SMART BARS: Good wordplay but could be more clever.";
        } else if (score >= 70) {
            feedback = "😐 BASIC WORDPLAY: Some attempts but nothing impressive.";
        } else {
            feedback = "💀 NO WORDPLAY: Literal bars with no cleverness.";
        }
        
        return {
            summary: feedback,
            issues: issues,
            examples: examples,
            score: score
        };
    }

    getRapTechnicalFeedback(rapTechnical, score, lyrics) {
        const issues = [];
        const examples = [];
        
        if (score < 90) {
            if (rapTechnical.syllableCount < 70) {
                issues.push("INCONSISTENT SYLLABLES: Your bar lengths are random");
                examples.push("Count syllables: 16 syllables = 4 beats in 4/4 time");
            }
            
            if (rapTechnical.breathControl < 60) {
                issues.push("POOR BREATH CONTROL: Lines too long to rap smoothly");
                examples.push("Break up long lines or practice breath control exercises");
            }
            
            if (rapTechnical.enunciation < 70) {
                issues.push("HARD TO UNDERSTAND: Too many consonant clusters");
                examples.push("Avoid tongue twisters unless intentional for effect");
            }
        }
        
        let feedback = "";
        if (score >= 90) {
            feedback = "⚙️ TECHNICAL MASTER: Flawless execution that sounds professional!";
        } else if (score >= 80) {
            feedback = "🔧 SOLID TECHNIQUE: Good technical skills with minor issues.";
        } else if (score >= 70) {
            feedback = "😬 TECHNICAL ISSUES: Noticeable problems with execution.";
        } else {
            feedback = "💀 TECHNICAL DISASTER: Major issues that make it hard to listen to.";
        }
        
        return {
            summary: feedback,
            issues: issues,
            examples: examples,
            score: score
        };
    }

    getRapAuthenticityFeedback(authenticity, score, lyrics) {
        const issues = [];
        const examples = [];
        
        if (score < 90) {
            if (authenticity.voice < 70) {
                issues.push("NO UNIQUE VOICE: You sound like every other rapper");
                examples.push("Develop your own style - what makes YOU different?");
            }
            
            if (authenticity.credibility < 60) {
                issues.push("NOT CREDIBLE: Using too many played-out rap clichés");
                examples.push("Rap about YOUR life, not what you think rap should sound like");
            }
        }
        
        let feedback = "";
        if (score >= 90) {
            feedback = "💯 AUTHENTIC: You have a unique voice and sound credible!";
        } else if (score >= 80) {
            feedback = "👤 DEVELOPING VOICE: Good authenticity but could be more unique.";
        } else if (score >= 70) {
            feedback = "😐 GENERIC: Sounds like other rappers, not distinctive.";
        } else {
            feedback = "💀 FAKE: Inauthentic and using tired rap clichés.";
        }
        
        return {
            summary: feedback,
            issues: issues,
            examples: examples,
            score: score
        };
    }

    // RAP-SPECIFIC ISSUE DETECTION

    identifyRapSpecificIssues(lyrics, analysis) {
        const issues = [];
        
        // Find rap clichés
        const rapCliches = this.findRapClichesWithLines(lyrics);
        if (rapCliches.length > 0) {
            issues.push({
                type: 'RAP CLICHÉS',
                severity: 'HIGH',
                count: rapCliches.length,
                examples: rapCliches.slice(0, 3),
                fix: 'Replace with original bars that reflect YOUR story and experience'
            });
        }
        
        // Find weak flow patterns
        const flowIssues = this.findFlowIssues(lyrics);
        if (flowIssues.length > 0) {
            issues.push({
                type: 'FLOW PROBLEMS',
                severity: 'HIGH',
                count: flowIssues.length,
                examples: flowIssues.slice(0, 3),
                fix: 'Practice consistent syllable counts and rhythm patterns'
            });
        }
        
        // Find missing internal rhymes
        const internalRhymeIssues = this.findMissingInternalRhymes(lyrics);
        if (internalRhymeIssues.length > 0) {
            issues.push({
                type: 'MISSING INTERNAL RHYMES',
                severity: 'MEDIUM',
                count: internalRhymeIssues.length,
                examples: internalRhymeIssues.slice(0, 3),
                fix: 'Add rhymes within bars, not just at the end'
            });
        }
        
        // Find weak punchlines
        const punchlineIssues = this.findWeakPunchlines(lyrics);
        if (punchlineIssues.length > 0) {
            issues.push({
                type: 'WEAK PUNCHLINES',
                severity: 'HIGH',
                count: punchlineIssues.length,
                examples: punchlineIssues.slice(0, 3),
                fix: 'Create setup-punchline combinations that surprise the listener'
            });
        }
        
        return issues;
    }

    generateRapLineByLineBreakdown(lyrics, analysis) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        const breakdown = [];
        
        lines.forEach((line, index) => {
            const lineAnalysis = this.analyzeRapLine(line, index, lines);
            breakdown.push({
                lineNumber: index + 1,
                text: line.trim(),
                issues: lineAnalysis.issues,
                suggestions: lineAnalysis.suggestions,
                score: lineAnalysis.score,
                strengths: lineAnalysis.strengths,
                rapMetrics: lineAnalysis.rapMetrics
            });
        });
        
        return breakdown;
    }

    analyzeRapLine(line, index, allLines) {
        const issues = [];
        const suggestions = [];
        const strengths = [];
        let score = 100;
        
        const cleanLine = line.trim().toLowerCase();
        const syllables = this.countSyllables(line);
        
        // Rap-specific analysis
        const rapMetrics = {
            syllables: syllables,
            internalRhymes: this.countLineInternalRhymes(line),
            multisyllabicWords: this.countMultisyllabicWords(line),
            rapVocab: this.countRapVocab(line)
        };
        
        // Check for rap clichés
        for (const cliche of this.rapCliches) {
            if (cleanLine.includes(cliche)) {
                issues.push(`Rap cliché: "${cliche}"`);
                suggestions.push(`Replace "${cliche}" with original bars about your experience`);
                score -= 25;
            }
        }
        
        // Check syllable consistency for flow
        if (index > 0) {
            const prevSyllables = this.countSyllables(allLines[index - 1]);
            if (Math.abs(syllables - prevSyllables) > 4) {
                issues.push(`Flow break: ${syllables} syllables vs ${prevSyllables} in previous bar`);
                suggestions.push(`Adjust to match flow pattern (${prevSyllables} syllables)`);
                score -= 15;
            } else if (Math.abs(syllables - prevSyllables) <= 1) {
                strengths.push('Consistent flow pattern');
                score += 5;
            }
        }
        
        // Check for internal rhymes
        if (rapMetrics.internalRhymes > 0) {
            strengths.push(`${rapMetrics.internalRhymes} internal rhymes - good technique!`);
            score += rapMetrics.internalRhymes * 5;
        } else if (line.split(' ').length > 6) {
            issues.push('No internal rhymes in long bar');
            suggestions.push('Add internal rhymes: "I SPIT fire while I SPLIT wires"');
            score -= 10;
        }
        
        // Check for multisyllabic words (shows vocabulary)
        if (rapMetrics.multisyllabicWords > 2) {
            strengths.push('Good vocabulary complexity');
            score += 5;
        }
        
        // Check for rap vocabulary
        if (rapMetrics.rapVocab > 0) {
            strengths.push('Using authentic rap vocabulary');
            score += 3;
        }
        
        // Check for weak endings
        const lastWord = line.trim().split(' ').pop()?.toLowerCase();
        const weakEndings = ['me', 'be', 'see', 'free', 'we'];
        if (weakEndings.includes(lastWord)) {
            issues.push(`Weak rhyme ending: "${lastWord}"`);
            suggestions.push('Use stronger, more creative rhyme words');
            score -= 8;
        }
        
        return {
            issues,
            suggestions,
            score: Math.max(0, Math.min(100, score)),
            strengths,
            rapMetrics
        };
    }

    // RAP HELPER METHODS

    findRapCliches(lyrics) {
        const found = [];
        for (const cliche of this.rapCliches) {
            if (lyrics.toLowerCase().includes(cliche)) {
                found.push(cliche);
            }
        }
        return found;
    }

    findRapClichesWithLines(lyrics) {
        const lines = lyrics.split('\n');
        const found = [];
        
        lines.forEach((line, index) => {
            const cleanLine = line.toLowerCase();
            for (const cliche of this.rapCliches) {
                if (cleanLine.includes(cliche)) {
                    found.push({
                        line: index + 1,
                        text: line.trim(),
                        cliche: cliche,
                        suggestion: `Replace "${cliche}" with original content about your life`
                    });
                }
            }
        });
        
        return found;
    }

    findFlowIssues(lyrics) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        const issues = [];
        
        const syllableCounts = lines.map(line => this.countSyllables(line));
        const variance = this.calculateVariance(syllableCounts);
        
        if (variance > 6) {
            for (let i = 1; i < lines.length; i++) {
                if (Math.abs(syllableCounts[i] - syllableCounts[i-1]) > 4) {
                    issues.push({
                        lines: [i, i + 1],
                        text: [lines[i-1], lines[i]],
                        issue: `Flow break: ${syllableCounts[i-1]} vs ${syllableCounts[i]} syllables`,
                        suggestion: 'Adjust syllable count to maintain consistent flow'
                    });
                }
            }
        }
        
        return issues;
    }

    findMissingInternalRhymes(lyrics) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        const issues = [];
        
        lines.forEach((line, index) => {
            const words = line.split(' ');
            if (words.length > 6 && this.countLineInternalRhymes(line) === 0) {
                issues.push({
                    line: index + 1,
                    text: line.trim(),
                    issue: 'Long bar with no internal rhymes',
                    suggestion: 'Add internal rhymes to improve flow and complexity'
                });
            }
        });
        
        return issues;
    }

    findWeakPunchlines(lyrics) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        const issues = [];
        
        // Look for missed punchline opportunities
        for (let i = 0; i < lines.length - 1; i++) {
            const line1 = lines[i].toLowerCase();
            const line2 = lines[i + 1].toLowerCase();
            
            // Check for setup without payoff
            if (this.isSetupLine(line1) && !this.isPunchlineLine(line2)) {
                issues.push({
                    lines: [i + 1, i + 2],
                    text: [lines[i], lines[i + 1]],
                    issue: 'Setup line without strong punchline',
                    suggestion: 'Follow setup with a clever punchline or wordplay'
                });
            }
        }
        
        return issues;
    }

    countLineInternalRhymes(line) {
        const words = line.split(' ').filter(w => w.length > 2);
        let count = 0;
        
        for (let i = 0; i < words.length - 1; i++) {
            for (let j = i + 1; j < words.length; j++) {
                if (this.wordsRhyme(words[i], words[j])) {
                    count++;
                }
            }
        }
        
        return count;
    }

    countMultisyllabicWords(line) {
        const words = line.split(' ');
        return words.filter(word => this.countSyllables(word) > 2).length;
    }

    countRapVocab(line) {
        const cleanLine = line.toLowerCase();
        return Array.from(this.rapKeywords).reduce((count, word) => 
            count + (cleanLine.includes(word) ? 1 : 0), 0);
    }

    isSetupLine(line) {
        const setupWords = ['when', 'if', 'they say', 'people think', 'you might'];
        return setupWords.some(word => line.includes(word));
    }

    isPunchlineLine(line) {
        const punchlineWords = ['but', 'so', 'that\'s why', 'boom', 'bam'];
        return punchlineWords.some(word => line.includes(word));
    }

    /**
     * Generate improvement suggestions to reach A+
     */
    generateImprovementSuggestions(analysis, grade, isRap = false) {
        const suggestions = [];
        const breakdown = analysis.breakdown;
        const songPurpose = analysis.songPurpose;

        // Critical improvements needed for A+
        if (breakdown.lyricalContent < 90) {
            suggestions.push({
                category: 'Lyrical Content',
                priority: 'HIGH',
                issue: 'Content lacks depth and originality',
                suggestion: 'Develop more unique perspectives, avoid clichés, and add personal experiences or fresh metaphors',
                examples: ['Instead of "broken heart" try "heart like shattered glass, reflecting fragments of what we used to be"']
            });
        }

        if (breakdown.structure < 85) {
            suggestions.push({
                category: 'Song Structure',
                priority: 'HIGH',
                issue: 'Poor organization and flow',
                suggestion: 'Follow proven structures: Verse-Chorus-Verse-Chorus-Bridge-Chorus, ensure smooth transitions',
                examples: ['Add transitional lines between sections', 'Use consistent meter and rhythm patterns']
            });
        }

        if (breakdown.rhymeScheme < 80) {
            suggestions.push({
                category: 'Rhyme Scheme',
                priority: 'MEDIUM',
                issue: 'Inconsistent or forced rhymes',
                suggestion: 'Develop natural-sounding rhymes, experiment with internal rhymes and slant rhymes',
                examples: ['Use ABAB or AABB patterns consistently', 'Try internal rhymes: "I find my mind in a bind"']
            });
        }

        if (breakdown.wordplay < 75) {
            suggestions.push({
                category: 'Wordplay',
                priority: 'MEDIUM',
                issue: 'Limited use of literary devices',
                suggestion: 'Incorporate metaphors, similes, alliteration, and clever word choices',
                examples: ['Add metaphors: "Life is a highway" → "Life is a maze with no exit signs"']
            });
        }

        if (breakdown.emotion < 80) {
            // Context-aware emotional feedback
            let emotionSuggestion = 'Write from personal experience, use specific details, show don\'t tell emotions';
            let emotionExamples = ['Instead of "I\'m sad" try "Rain tastes like the tears I can\'t cry anymore"'];
            
            if (songPurpose.primary === 'diss_track') {
                emotionSuggestion = 'Channel your anger and frustration into specific, cutting lines that expose your target';
                emotionExamples = ['Instead of "you\'re fake" try "You switch faces more than a broken TV channel"'];
            } else if (songPurpose.primary === 'fictional_narrative' || songPurpose.primary === 'storytelling') {
                emotionSuggestion = 'Develop the emotional journey of your characters, not necessarily your own experience';
                emotionExamples = ['Show character emotions through actions: "His hands trembled as he read the letter"'];
            } else if (songPurpose.primary === 'party_anthem') {
                emotionSuggestion = 'Focus on energy and excitement rather than deep personal emotions';
                emotionExamples = ['Create infectious energy: "Feel the bass drop, hearts stop, then we rise up"'];
            }
            
            suggestions.push({
                category: 'Emotional Impact',
                priority: 'HIGH',
                issue: 'Lacks authentic emotional connection',
                suggestion: emotionSuggestion,
                examples: emotionExamples
            });
        }

        if (breakdown.technical < 70) {
            suggestions.push({
                category: 'Technical Execution',
                priority: 'LOW',
                issue: 'Inconsistent rhythm and syllable count',
                suggestion: 'Count syllables per line, maintain consistent meter, practice reading aloud',
                examples: ['Keep verses at 8-10 syllables per line', 'Use stressed/unstressed syllable patterns']
            });
        }

        // Add specific A+ requirements
        suggestions.push({
            category: 'A+ Excellence',
            priority: 'CRITICAL',
            issue: 'Missing elements for top-tier songwriting',
            suggestion: 'To achieve A+: Create a unique voice, tell a compelling story, use sophisticated wordplay, evoke strong emotions, and maintain perfect technical execution',
            examples: [
                'Develop a signature style that\'s recognizably yours',
                'Create vivid scenes that listeners can visualize',
                'Use unexpected but perfect word combinations',
                'Make every line serve the song\'s purpose'
            ]
        });

        return suggestions.sort((a, b) => {
            const priorityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    /**
     * Identify song strengths
     */
    identifyStrengths(analysis) {
        const strengths = [];
        const breakdown = analysis.breakdown;

        if (breakdown.lyricalContent >= 85) strengths.push('Strong lyrical content with good depth and originality');
        if (breakdown.structure >= 85) strengths.push('Well-organized structure with smooth flow');
        if (breakdown.rhymeScheme >= 85) strengths.push('Excellent rhyme scheme with creative patterns');
        if (breakdown.wordplay >= 85) strengths.push('Sophisticated wordplay and literary devices');
        if (breakdown.emotion >= 85) strengths.push('Authentic emotional impact and connection');
        if (breakdown.technical >= 85) strengths.push('Strong technical execution and rhythm');

        if (strengths.length === 0) {
            strengths.push('Shows potential for improvement across all areas');
        }

        return strengths;
    }

    /**
     * Identify major weaknesses
     */
    identifyWeaknesses(analysis) {
        const weaknesses = [];
        const breakdown = analysis.breakdown;

        if (breakdown.lyricalContent < 70) weaknesses.push('Lyrical content needs significant improvement - lacks originality and depth');
        if (breakdown.structure < 70) weaknesses.push('Song structure is poorly organized with weak transitions');
        if (breakdown.rhymeScheme < 70) weaknesses.push('Rhyme scheme is inconsistent and often forced');
        if (breakdown.wordplay < 70) weaknesses.push('Limited wordplay and literary devices');
        if (breakdown.emotion < 70) weaknesses.push('Lacks emotional authenticity and impact');
        if (breakdown.technical < 70) weaknesses.push('Technical execution needs work - rhythm and meter issues');

        return weaknesses;
    }

    // Helper methods for specific analysis tasks

    evaluateOriginality(lyrics) {
        const clicheCount = Array.from(this.clichePhrases).reduce((count, phrase) => {
            return count + (lyrics.toLowerCase().includes(phrase) ? 1 : 0);
        }, 0);
        
        const totalPhrases = lyrics.split(/[.!?]+/).length;
        const clicheRatio = clicheCount / Math.max(totalPhrases, 1);
        
        return Math.max(0, 100 - (clicheRatio * 200)); // Heavily penalize clichés
    }

    evaluateDepth(lyrics, stats) {
        const abstractWords = ['love', 'life', 'time', 'soul', 'heart', 'mind', 'dream', 'hope', 'fear', 'pain'];
        const concreteWords = ['rain', 'street', 'window', 'car', 'phone', 'door', 'light', 'shadow', 'fire', 'water'];
        
        const abstractCount = abstractWords.reduce((count, word) => 
            count + (lyrics.includes(word) ? 1 : 0), 0);
        const concreteCount = concreteWords.reduce((count, word) => 
            count + (lyrics.includes(word) ? 1 : 0), 0);
        
        const balance = Math.min(abstractCount, concreteCount) / Math.max(abstractCount, concreteCount, 1);
        const complexity = stats.vocabularyRichness * 100;
        
        return (balance * 50) + (complexity * 50);
    }

    evaluateStorytelling(lyrics) {
        const storyElements = {
            character: /\b(he|she|they|i|we|you|him|her|them|me|us)\b/gi,
            setting: /\b(in|at|on|under|over|through|across|behind|beside)\b/gi,
            action: /\b(walk|run|drive|fly|dance|sing|cry|laugh|fight|love)\b/gi,
            time: /\b(when|then|now|before|after|while|during|until)\b/gi
        };
        
        let score = 0;
        for (const [element, regex] of Object.entries(storyElements)) {
            const matches = lyrics.match(regex) || [];
            score += Math.min(matches.length * 5, 25); // Max 25 points per element
        }
        
        return Math.min(score, 100);
    }

    evaluateImagery(lyrics) {
        const sensoryWords = {
            visual: ['see', 'look', 'watch', 'bright', 'dark', 'color', 'light', 'shadow', 'shine', 'glow'],
            auditory: ['hear', 'sound', 'loud', 'quiet', 'whisper', 'scream', 'music', 'noise', 'silence'],
            tactile: ['feel', 'touch', 'soft', 'hard', 'warm', 'cold', 'smooth', 'rough', 'sharp'],
            olfactory: ['smell', 'scent', 'fragrance', 'aroma', 'stink', 'fresh'],
            gustatory: ['taste', 'sweet', 'bitter', 'sour', 'salty', 'flavor']
        };
        
        let totalImagery = 0;
        for (const [sense, words] of Object.entries(sensoryWords)) {
            const count = words.reduce((acc, word) => 
                acc + (lyrics.includes(word) ? 1 : 0), 0);
            totalImagery += count;
        }
        
        return Math.min(totalImagery * 10, 100);
    }

    detectRhymePattern(lines) {
        // Simplified rhyme detection - gets last word of each line
        const endWords = lines.map(line => {
            const words = line.trim().split(/\s+/);
            return words[words.length - 1]?.replace(/[^\w]/g, '').toLowerCase() || '';
        });
        
        // Basic rhyme scheme detection (simplified)
        const rhymeMap = new Map();
        let currentLetter = 'A';
        const pattern = [];
        
        for (const word of endWords) {
            if (!word) {
                pattern.push('');
                continue;
            }
            
            let found = false;
            for (const [rhymeWord, letter] of rhymeMap.entries()) {
                if (this.wordsRhyme(word, rhymeWord)) {
                    pattern.push(letter);
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                rhymeMap.set(word, currentLetter);
                pattern.push(currentLetter);
                currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
            }
        }
        
        return pattern.join('');
    }

    wordsRhyme(word1, word2) {
        // Simplified rhyme detection - checks if words end with similar sounds
        if (word1.length < 2 || word2.length < 2) return false;
        
        const ending1 = word1.slice(-2);
        const ending2 = word2.slice(-2);
        
        return ending1 === ending2 || 
               word1.slice(-3) === word2.slice(-3) ||
               this.phoneticSimilarity(word1, word2) > 0.7;
    }

    phoneticSimilarity(word1, word2) {
        // Simplified phonetic similarity
        const vowels = 'aeiou';
        const getVowelPattern = (word) => word.split('').filter(c => vowels.includes(c)).join('');
        
        const pattern1 = getVowelPattern(word1);
        const pattern2 = getVowelPattern(word2);
        
        if (pattern1 === pattern2) return 1;
        if (pattern1.slice(-1) === pattern2.slice(-1)) return 0.7;
        return 0;
    }

    evaluateRhymeConsistency(pattern) {
        if (!pattern) return 50;
        
        const letters = pattern.split('');
        const letterCounts = {};
        
        for (const letter of letters) {
            if (letter) letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        }
        
        const rhymePairs = Object.values(letterCounts).filter(count => count > 1).length;
        const totalLines = letters.filter(l => l).length;
        
        return Math.min((rhymePairs / totalLines) * 200, 100);
    }

    detectMetaphors(lyrics) {
        const metaphorPatterns = [
            /is (a|an|the) /gi,
            /like (a|an|the) /gi,
            /as (a|an|the) /gi,
            /(heart|soul|mind|life) (is|was|becomes?) /gi
        ];
        
        let metaphorCount = 0;
        for (const pattern of metaphorPatterns) {
            const matches = lyrics.match(pattern) || [];
            metaphorCount += matches.length;
        }
        
        return Math.min(metaphorCount * 15, 100);
    }

    detectAlliteration(lyrics) {
        const words = lyrics.split(/\s+/);
        let alliterationCount = 0;
        
        for (let i = 0; i < words.length - 1; i++) {
            const word1 = words[i].replace(/[^\w]/g, '').toLowerCase();
            const word2 = words[i + 1].replace(/[^\w]/g, '').toLowerCase();
            
            if (word1[0] && word1[0] === word2[0] && word1[0] !== word2[0]) {
                alliterationCount++;
            }
        }
        
        return Math.min(alliterationCount * 10, 100);
    }

    evaluateWordChoice(lyrics) {
        const words = lyrics.split(/\s+/).map(w => w.replace(/[^\w]/g, '').toLowerCase());
        const uniqueWords = new Set(words);
        const commonWordCount = words.filter(word => this.commonWords.has(word)).length;
        
        const vocabularyScore = (uniqueWords.size / words.length) * 100;
        const sophisticationScore = Math.max(0, 100 - (commonWordCount / words.length) * 100);
        
        return (vocabularyScore + sophisticationScore) / 2;
    }

    detectEmotions(lyrics) {
        const emotionWords = {
            joy: ['happy', 'joy', 'smile', 'laugh', 'bright', 'sunshine', 'celebrate', 'dance'],
            sadness: ['sad', 'cry', 'tears', 'pain', 'hurt', 'broken', 'lonely', 'empty'],
            anger: ['angry', 'mad', 'rage', 'hate', 'fury', 'fight', 'scream', 'burn'],
            love: ['love', 'heart', 'kiss', 'embrace', 'forever', 'together', 'soul', 'passion'],
            fear: ['afraid', 'scared', 'fear', 'terror', 'nightmare', 'dark', 'shadow', 'run']
        };
        
        const emotionScores = {};
        for (const [emotion, words] of Object.entries(emotionWords)) {
            emotionScores[emotion] = words.reduce((count, word) => 
                count + (lyrics.includes(word) ? 1 : 0), 0);
        }
        
        const primaryEmotion = Object.entries(emotionScores)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const totalEmotions = Object.values(emotionScores).reduce((a, b) => a + b, 0);
        const range = Object.values(emotionScores).filter(score => score > 0).length;
        
        return {
            primary: primaryEmotion,
            range: range,
            intensity: totalEmotions
        };
    }

    getOverallFeedback(grade, score) {
        if (grade === 'A+') {
            return `Exceptional work! Your song demonstrates mastery across all areas with a score of ${score.toFixed(1)}%. This is professional-level songwriting.`;
        } else if (grade.startsWith('A')) {
            return `Excellent songwriting with a score of ${score.toFixed(1)}%. You're very close to perfection - just a few tweaks needed.`;
        } else if (grade.startsWith('B')) {
            return `Good work with a score of ${score.toFixed(1)}%. Your song has solid foundations but needs improvement in key areas.`;
        } else if (grade.startsWith('C')) {
            return `Average songwriting with a score of ${score.toFixed(1)}%. Significant improvements needed across multiple areas.`;
        } else {
            return `Below average with a score of ${score.toFixed(1)}%. This song needs major revisions to reach professional standards.`;
        }
    }

    getLyricalContentFeedback(content, score, lyrics) {
        const issues = [];
        const examples = [];
        
        if (score < 90) {
            const cliches = this.findCliches(lyrics);
            if (cliches.length > 0) {
                issues.push(`CLICHÉ OVERLOAD: Found ${cliches.length} overused phrases`);
                examples.push(`Replace "${cliches[0]}" with something personal and specific`);
            }
            
            if (content.depth < 70) {
                issues.push("SHALLOW CONTENT: Lacks emotional depth and meaningful substance");
                examples.push("Instead of 'I love you so much' try 'Your laugh echoes in empty rooms long after you've gone'");
            }
            
            if (content.originality < 60) {
                issues.push("UNORIGINAL: Sounds like every other song in this genre");
                examples.push("Find your unique voice - what's YOUR story that no one else can tell?");
            }
        }
        
        let feedback = "";
        if (score >= 90) {
            feedback = "🏆 EXCEPTIONAL: Outstanding lyrical content with masterful depth and originality.";
        } else if (score >= 80) {
            feedback = "✅ STRONG: Good lyrical foundation, but missing that spark of genius.";
        } else if (score >= 70) {
            feedback = "⚠️ MEDIOCRE: Relies on tired themes and predictable phrases.";
        } else {
            feedback = "❌ WEAK: Generic, clichéd content that won't stand out.";
        }
        
        return {
            summary: feedback,
            issues: issues,
            examples: examples,
            score: score
        };
    }

    getStructureFeedback(structure, score, lyrics) {
        const issues = [];
        const examples = [];
        
        if (score < 90) {
            if (!structure.hasVerse) {
                issues.push("MISSING VERSES: No clear verse structure detected");
                examples.push("Add verses that tell your story: Verse 1 → Chorus → Verse 2 → Chorus → Bridge → Chorus");
            }
            
            if (!structure.hasChorus) {
                issues.push("NO HOOK: Missing a memorable, repeatable chorus");
                examples.push("Create a chorus that people will sing along to - your main message in 2-4 lines");
            }
            
            if (structure.flow < 70) {
                issues.push("CHOPPY FLOW: Lines don't connect smoothly");
                examples.push("Use transitional phrases: 'But then...', 'So when...', 'And now...'");
            }
        }
        
        let feedback = "";
        if (score >= 90) {
            feedback = "🏆 PERFECT STRUCTURE: Masterful organization with seamless flow.";
        } else if (score >= 80) {
            feedback = "✅ SOLID: Good structure but transitions need polish.";
        } else if (score >= 70) {
            feedback = "⚠️ BASIC: Recognizable structure but lacks sophistication.";
        } else {
            feedback = "❌ MESSY: Confusing organization that loses the listener.";
        }
        
        return {
            summary: feedback,
            issues: issues,
            examples: examples,
            score: score
        };
    }

    getRhymeFeedback(rhyme, score, lyrics) {
        const issues = [];
        const examples = [];
        
        if (score < 90) {
            const forcedRhymes = this.findForcedRhymes(lyrics);
            if (forcedRhymes.length > 0) {
                issues.push(`FORCED RHYMES: ${forcedRhymes.length} awkward rhymes detected`);
                examples.push(`"${forcedRhymes[0]}" sounds unnatural - try slant rhymes or rewrite the line`);
            }
            
            if (rhyme.consistency < 70) {
                issues.push("INCONSISTENT PATTERN: Rhyme scheme is all over the place");
                examples.push("Pick a pattern (ABAB, AABB, ABCB) and stick to it throughout each section");
            }
            
            if (rhyme.creativity < 60) {
                issues.push("BORING RHYMES: Using the most obvious rhyme choices");
                examples.push("Instead of love/above try love/enough or love/rough for more interesting sounds");
            }
        }
        
        let feedback = "";
        if (score >= 90) {
            feedback = "🏆 MASTERFUL: Creative, natural rhymes that enhance the song.";
        } else if (score >= 80) {
            feedback = "✅ GOOD: Solid rhyming with occasional forced moments.";
        } else if (score >= 70) {
            feedback = "⚠️ BASIC: Predictable rhymes that don't add much.";
        } else {
            feedback = "❌ POOR: Forced, awkward rhymes that hurt the flow.";
        }
        
        return {
            summary: feedback,
            issues: issues,
            examples: examples,
            score: score
        };
    }

    getWordplayFeedback(wordplay, score, lyrics) {
        const issues = [];
        const examples = [];
        
        if (score < 90) {
            if (wordplay.metaphors < 50) {
                issues.push("NO METAPHORS: Missing creative comparisons and imagery");
                examples.push("Add metaphors: 'Your words are bullets' or 'Time is a thief stealing our moments'");
            }
            
            if (wordplay.wordChoice < 60) {
                issues.push("BASIC VOCABULARY: Using simple, common words");
                examples.push("Replace 'very sad' with 'devastated', 'broken', or 'shattered'");
            }
            
            if (wordplay.cleverness < 50) {
                issues.push("NO WORDPLAY: Missing puns, double meanings, or clever phrases");
                examples.push("Try double meanings: 'I'm falling for you' (love + literally falling)");
            }
        }
        
        let feedback = "";
        if (score >= 90) {
            feedback = "🏆 BRILLIANT: Sophisticated wordplay that impresses and delights.";
        } else if (score >= 80) {
            feedback = "✅ CLEVER: Good use of language with room for more creativity.";
        } else if (score >= 70) {
            feedback = "⚠️ SIMPLE: Basic word choices without much flair.";
        } else {
            feedback = "❌ BLAND: Boring language that doesn't engage the listener.";
        }
        
        return {
            summary: feedback,
            issues: issues,
            examples: examples,
            score: score
        };
    }

    getEmotionFeedback(emotion, score, lyrics) {
        const issues = [];
        const examples = [];
        
        if (score < 90) {
            if (emotion.authenticity < 70) {
                issues.push("FAKE EMOTIONS: Doesn't feel genuine or personal");
                examples.push("Write from real experience - what did heartbreak actually FEEL like for you?");
            }
            
            if (emotion.impact < 60) {
                issues.push("NO EMOTIONAL PUNCH: Doesn't make the listener feel anything");
                examples.push("Show, don't tell: Instead of 'I'm sad' try 'I count the ceiling tiles at 3 AM'");
            }
            
            if (emotion.consistency < 70) {
                issues.push("EMOTIONAL CONFUSION: Mixed emotions without clear purpose");
                examples.push("Pick one main emotion per song and explore it fully");
            }
        }
        
        let feedback = "";
        if (score >= 90) {
            feedback = "🏆 POWERFUL: Raw, authentic emotion that moves the listener.";
        } else if (score >= 80) {
            feedback = "✅ TOUCHING: Good emotional content but could be more specific.";
        } else if (score >= 70) {
            feedback = "⚠️ SURFACE: Emotions feel generic and predictable.";
        } else {
            feedback = "❌ EMPTY: No real emotional connection or impact.";
        }
        
        return {
            summary: feedback,
            issues: issues,
            examples: examples,
            score: score
        };
    }

    getTechnicalFeedback(technical, score, lyrics) {
        const issues = [];
        const examples = [];
        
        if (score < 90) {
            if (technical.syllableCount < 70) {
                issues.push("INCONSISTENT METER: Syllable counts vary wildly between lines");
                examples.push("Count syllables: 'I love you so' (5) should match 'You mean the world' (4) - add 'to me' (2)");
            }
            
            if (technical.rhythm < 60) {
                issues.push("BROKEN RHYTHM: Lines don't flow when spoken aloud");
                examples.push("Read your lyrics out loud - if you stumble, rewrite that line");
            }
            
            if (technical.pronunciation < 70) {
                issues.push("HARD TO SING: Awkward word combinations or tongue twisters");
                examples.push("Avoid: 'She sells seashells' - hard to sing quickly");
            }
        }
        
        let feedback = "";
        if (score >= 90) {
            feedback = "🏆 FLAWLESS: Perfect technical execution that's easy to perform.";
        } else if (score >= 80) {
            feedback = "✅ SOLID: Good technical skills with minor issues.";
        } else if (score >= 70) {
            feedback = "⚠️ ROUGH: Technical problems that distract from the message.";
        } else {
            feedback = "❌ BROKEN: Major technical issues that make it hard to perform.";
        }
        
        return {
            summary: feedback,
            issues: issues,
            examples: examples,
            score: score
        };
    }

    /**
     * Identify specific issues with examples from the lyrics
     */
    identifySpecificIssues(lyrics, analysis) {
        const issues = [];
        const lines = lyrics.split('\n').filter(line => line.trim());
        
        // Find clichés with line numbers
        const cliches = this.findClichesWithLines(lyrics);
        if (cliches.length > 0) {
            issues.push({
                type: 'CLICHÉS',
                severity: 'HIGH',
                count: cliches.length,
                examples: cliches.slice(0, 3),
                fix: 'Replace with personal, specific imagery that only you could write'
            });
        }
        
        // Find forced rhymes
        const forcedRhymes = this.findForcedRhymesWithLines(lyrics);
        if (forcedRhymes.length > 0) {
            issues.push({
                type: 'FORCED RHYMES',
                severity: 'MEDIUM',
                count: forcedRhymes.length,
                examples: forcedRhymes.slice(0, 3),
                fix: 'Rewrite lines to make rhymes sound natural, or use slant rhymes'
            });
        }
        
        // Find repetitive words
        const repetitiveWords = this.findRepetitiveWords(lyrics);
        if (repetitiveWords.length > 0) {
            issues.push({
                type: 'WORD REPETITION',
                severity: 'LOW',
                count: repetitiveWords.length,
                examples: repetitiveWords.slice(0, 3),
                fix: 'Use synonyms or rephrase to avoid overusing the same words'
            });
        }
        
        // Find weak verbs
        const weakVerbs = this.findWeakVerbs(lyrics);
        if (weakVerbs.length > 0) {
            issues.push({
                type: 'WEAK VERBS',
                severity: 'MEDIUM',
                count: weakVerbs.length,
                examples: weakVerbs.slice(0, 3),
                fix: 'Replace with stronger, more specific action words'
            });
        }
        
        // Find vague language
        const vagueLanguage = this.findVagueLanguage(lyrics);
        if (vagueLanguage.length > 0) {
            issues.push({
                type: 'VAGUE LANGUAGE',
                severity: 'HIGH',
                count: vagueLanguage.length,
                examples: vagueLanguage.slice(0, 3),
                fix: 'Be specific - replace general words with concrete details'
            });
        }
        
        return issues;
    }

    /**
     * Generate line-by-line breakdown with specific feedback
     */
    generateLineByLineBreakdown(lyrics, analysis) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        const breakdown = [];
        
        lines.forEach((line, index) => {
            const lineAnalysis = this.analyzeSingleLine(line, index, lines);
            breakdown.push({
                lineNumber: index + 1,
                text: line.trim(),
                issues: lineAnalysis.issues,
                suggestions: lineAnalysis.suggestions,
                score: lineAnalysis.score,
                strengths: lineAnalysis.strengths
            });
        });
        
        return breakdown;
    }

    /**
     * Analyze a single line for issues and strengths
     */
    analyzeSingleLine(line, index, allLines) {
        const issues = [];
        const suggestions = [];
        const strengths = [];
        let score = 100;
        
        const cleanLine = line.trim().toLowerCase();
        
        // Check for clichés
        for (const cliche of this.clichePhrases) {
            if (cleanLine.includes(cliche)) {
                issues.push(`Contains cliché: "${cliche}"`);
                suggestions.push(`Replace "${cliche}" with something personal and specific`);
                score -= 20;
            }
        }
        
        // Check syllable count consistency
        const syllables = this.countSyllables(line);
        if (index > 0) {
            const prevSyllables = this.countSyllables(allLines[index - 1]);
            if (Math.abs(syllables - prevSyllables) > 3) {
                issues.push(`Syllable mismatch: ${syllables} vs ${prevSyllables} in previous line`);
                suggestions.push(`Adjust to match previous line's rhythm (${prevSyllables} syllables)`);
                score -= 10;
            }
        }
        
        // Check for weak words
        const weakWords = ['very', 'really', 'quite', 'pretty', 'kind of', 'sort of'];
        for (const weak of weakWords) {
            if (cleanLine.includes(weak)) {
                issues.push(`Weak modifier: "${weak}"`);
                suggestions.push(`Remove "${weak}" and use a stronger adjective instead`);
                score -= 5;
            }
        }
        
        // Check for strong imagery
        const imageryWords = ['see', 'hear', 'feel', 'taste', 'smell', 'touch', 'bright', 'dark', 'loud', 'quiet'];
        for (const imagery of imageryWords) {
            if (cleanLine.includes(imagery)) {
                strengths.push(`Good sensory word: "${imagery}"`);
                score += 5;
            }
        }
        
        // Check for metaphors
        if (cleanLine.includes(' is ') || cleanLine.includes(' like ') || cleanLine.includes(' as ')) {
            strengths.push('Contains comparison/metaphor');
            score += 10;
        }
        
        // Check line length
        if (line.trim().length < 10) {
            issues.push('Line too short - lacks substance');
            suggestions.push('Add more detail or combine with another line');
            score -= 15;
        } else if (line.trim().length > 80) {
            issues.push('Line too long - may be hard to sing');
            suggestions.push('Break into two lines or remove unnecessary words');
            score -= 10;
        }
        
        return {
            issues,
            suggestions,
            score: Math.max(0, Math.min(100, score)),
            strengths
        };
    }

    // Helper methods for specific issue detection
    findClichesWithLines(lyrics) {
        const lines = lyrics.split('\n');
        const found = [];
        
        lines.forEach((line, index) => {
            const cleanLine = line.toLowerCase();
            for (const cliche of this.clichePhrases) {
                if (cleanLine.includes(cliche)) {
                    found.push({
                        line: index + 1,
                        text: line.trim(),
                        cliche: cliche,
                        suggestion: this.getClicheReplacement(cliche)
                    });
                }
            }
        });
        
        return found;
    }

    findForcedRhymesWithLines(lyrics) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        const forced = [];
        
        for (let i = 0; i < lines.length - 1; i++) {
            const line1 = lines[i].trim();
            const line2 = lines[i + 1].trim();
            
            if (this.isForcedRhyme(line1, line2)) {
                forced.push({
                    lines: [i + 1, i + 2],
                    text: [line1, line2],
                    issue: 'Rhyme sounds unnatural or forced',
                    suggestion: 'Rewrite one line to make the rhyme flow naturally'
                });
            }
        }
        
        return forced;
    }

    findRepetitiveWords(lyrics) {
        const words = lyrics.toLowerCase().split(/\s+/);
        const wordCount = {};
        const repetitive = [];
        
        words.forEach(word => {
            const clean = word.replace(/[^\w]/g, '');
            if (clean.length > 3 && !this.commonWords.has(clean)) {
                wordCount[clean] = (wordCount[clean] || 0) + 1;
            }
        });
        
        for (const [word, count] of Object.entries(wordCount)) {
            if (count > 3) {
                repetitive.push({
                    word: word,
                    count: count,
                    suggestion: `Use synonyms for "${word}" to add variety`
                });
            }
        }
        
        return repetitive;
    }

    findWeakVerbs(lyrics) {
        const weakVerbs = ['is', 'was', 'are', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 'get', 'got', 'go', 'went'];
        const lines = lyrics.split('\n');
        const weak = [];
        
        lines.forEach((line, index) => {
            const words = line.toLowerCase().split(/\s+/);
            words.forEach(word => {
                const clean = word.replace(/[^\w]/g, '');
                if (weakVerbs.includes(clean)) {
                    weak.push({
                        line: index + 1,
                        text: line.trim(),
                        verb: clean,
                        suggestion: this.getStrongVerbSuggestion(clean)
                    });
                }
            });
        });
        
        return weak.slice(0, 5); // Limit to avoid overwhelming
    }

    findVagueLanguage(lyrics) {
        const vagueWords = ['thing', 'stuff', 'something', 'anything', 'everything', 'nothing', 'someone', 'anyone', 'everyone'];
        const lines = lyrics.split('\n');
        const vague = [];
        
        lines.forEach((line, index) => {
            const cleanLine = line.toLowerCase();
            vagueWords.forEach(word => {
                if (cleanLine.includes(word)) {
                    vague.push({
                        line: index + 1,
                        text: line.trim(),
                        vague: word,
                        suggestion: `Replace "${word}" with something specific`
                    });
                }
            });
        });
        
        return vague;
    }

    getClicheReplacement(cliche) {
        const replacements = {
            'broken heart': 'heart like shattered glass',
            'forever': 'until the stars burn out',
            'meant to be': 'written in the constellations',
            'baby': 'your name (be specific!)',
            'perfect': 'flawless in your imperfections'
        };
        return replacements[cliche] || 'something more personal and unique';
    }

    getStrongVerbSuggestion(weakVerb) {
        const suggestions = {
            'is': 'becomes, transforms, stands',
            'was': 'existed, lived, breathed',
            'go': 'rush, wander, escape, flee',
            'get': 'grab, seize, discover, find',
            'have': 'possess, hold, embrace, carry'
        };
        return suggestions[weakVerb] || 'use a more specific action word';
    }

    isForcedRhyme(line1, line2) {
        // Simplified forced rhyme detection
        const words1 = line1.split(/\s+/);
        const words2 = line2.split(/\s+/);
        const end1 = words1[words1.length - 1]?.replace(/[^\w]/g, '').toLowerCase();
        const end2 = words2[words2.length - 1]?.replace(/[^\w]/g, '').toLowerCase();
        
        if (!end1 || !end2) return false;
        
        // Check if rhyme is too obvious or forced
        const obviousRhymes = [
            ['love', 'above'], ['heart', 'apart'], ['night', 'light'], 
            ['day', 'way'], ['time', 'rhyme'], ['true', 'you']
        ];
        
        return obviousRhymes.some(([w1, w2]) => 
            (end1 === w1 && end2 === w2) || (end1 === w2 && end2 === w1)
        );
    }

    countSyllables(line) {
        // Simplified syllable counting
        const word = line.toLowerCase().replace(/[^\w\s]/g, '');
        const vowels = 'aeiouy';
        let count = 0;
        let prevWasVowel = false;
        
        for (let i = 0; i < word.length; i++) {
            const isVowel = vowels.includes(word[i]);
            if (isVowel && !prevWasVowel) {
                count++;
            }
            prevWasVowel = isVowel;
        }
        
        return Math.max(1, count);
    }

    // RAP-SPECIFIC ANALYSIS METHODS

    /**
     * Analyze rap flow patterns and rhythm
     */
    analyzeRapFlow(lyrics, stats) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        
        // Analyze syllable patterns
        const syllableCounts = lines.map(line => this.countSyllables(line));
        const avgSyllables = syllableCounts.reduce((a, b) => a + b, 0) / syllableCounts.length;
        const syllableVariance = this.calculateVariance(syllableCounts);
        
        // Check for consistent patterns (good flow)
        const consistentPattern = syllableVariance < 4;
        
        // Analyze stress patterns
        const stressPatterns = this.analyzeStressPatterns(lines);
        
        // Check for pocket riding (staying on beat)
        const pocketRiding = this.analyzePocketRiding(lines);
        
        // Delivery analysis
        const delivery = this.analyzeDelivery(lyrics);
        
        return {
            syllablePattern: consistentPattern ? 85 : Math.max(30, 85 - syllableVariance * 5),
            rhythmConsistency: this.calculateRhythmConsistency(syllableCounts),
            delivery: delivery,
            pocketRiding: pocketRiding,
            avgSyllables: avgSyllables,
            syllableVariance: syllableVariance,
            stressPatterns: stressPatterns
        };
    }

    /**
     * Analyze rap-specific rhyme schemes
     */
    analyzeRapRhymeScheme(lyrics) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        
        // Internal rhymes analysis
        const internalRhymes = this.analyzeInternalRhymes(lines);
        
        // Multisyllabic rhymes
        const multisyllabicRhymes = this.analyzeMultisyllabicRhymes(lines);
        
        // Rhyme density
        const rhymeDensity = this.calculateRhymeDensity(lines);
        
        return {
            internalRhymes: internalRhymes,
            multisyllabicRhymes: multisyllabicRhymes,
            rhymeDensity: rhymeDensity,
            complexity: (internalRhymes + multisyllabicRhymes + rhymeDensity) / 3
        };
    }

    /**
     * Analyze rap wordplay and literary devices
     */
    analyzeRapWordplay(lyrics) {
        const metaphors = this.detectRapMetaphors(lyrics);
        const doubleEntendres = this.detectDoubleEntendres(lyrics);
        const punchlines = this.detectPunchlines(lyrics);
        const vocabulary = this.analyzeRapVocabulary(lyrics);
        const alliteration = this.detectAlliteration(lyrics);
        const puns = this.detectPuns(lyrics);
        
        return {
            metaphors: metaphors,
            doubleEntendres: doubleEntendres,
            punchlines: punchlines,
            vocabulary: vocabulary,
            alliteration: alliteration,
            puns: puns,
            density: this.calculateWordplayDensity(lyrics)
        };
    }

    /**
     * Analyze rap technical execution
     */
    analyzeRapTechnical(lyrics, stats) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        
        // Syllable count consistency
        const syllableConsistency = this.analyzeRapSyllableConsistency(lines);
        
        // Stress patterns
        const stressPatterns = this.analyzeStressPatterns(lines);
        
        // Breath control analysis
        const breathControl = this.analyzeBreathControl(lines);
        
        // Enunciation difficulty
        const enunciation = this.analyzeEnunciation(lyrics);
        
        return {
            syllableCount: syllableConsistency,
            stressPatterns: stressPatterns,
            breathControl: breathControl,
            enunciation: enunciation
        };
    }

    /**
     * Analyze rap authenticity and voice
     */
    analyzeRapAuthenticity(lyrics) {
        const voice = this.analyzeRapVoice(lyrics);
        const credibility = this.analyzeRapCredibility(lyrics);
        
        return {
            voice: voice,
            credibility: credibility
        };
    }

    // RAP ANALYSIS HELPER METHODS

    calculateVariance(numbers) {
        const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
        return squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
    }

    calculateRhythmConsistency(syllableCounts) {
        if (syllableCounts.length < 2) return 50;
        
        const variance = this.calculateVariance(syllableCounts);
        return Math.max(0, 100 - variance * 10);
    }

    analyzeInternalRhymes(lines) {
        let internalRhymeCount = 0;
        let totalWords = 0;
        
        lines.forEach(line => {
            const words = line.split(' ').filter(w => w.length > 2);
            totalWords += words.length;
            
            for (let i = 0; i < words.length - 1; i++) {
                for (let j = i + 1; j < words.length; j++) {
                    if (this.wordsRhyme(words[i], words[j])) {
                        internalRhymeCount++;
                    }
                }
            }
        });
        
        const density = totalWords > 0 ? (internalRhymeCount / totalWords) * 100 : 0;
        return Math.min(100, density * 20);
    }

    analyzeMultisyllabicRhymes(lines) {
        let multisyllabicCount = 0;
        
        for (let i = 0; i < lines.length - 1; i++) {
            const words1 = lines[i].split(' ');
            const words2 = lines[i + 1].split(' ');
            
            // Check for 2+ syllable rhymes
            for (let j = 0; j < Math.min(words1.length, words2.length); j++) {
                const word1 = words1[words1.length - 1 - j];
                const word2 = words2[words2.length - 1 - j];
                
                if (word1 && word2 && this.countSyllables(word1) > 1 && this.wordsRhyme(word1, word2)) {
                    multisyllabicCount++;
                }
            }
        }
        
        return Math.min(100, (multisyllabicCount / lines.length) * 50);
    }

    calculateRhymeDensity(lines) {
        let rhymeCount = 0;
        let totalLines = lines.length;
        
        for (let i = 0; i < lines.length - 1; i++) {
            if (this.linesRhyme(lines[i], lines[i + 1])) {
                rhymeCount++;
            }
        }
        
        return totalLines > 1 ? (rhymeCount / (totalLines - 1)) * 100 : 0;
    }

    detectRapMetaphors(lyrics) {
        const rapMetaphorPatterns = [
            /like (a|an|the) .*(king|beast|god|machine|weapon|fire|ice|storm)/gi,
            /(flow|bars|rhymes) (like|as) /gi,
            /(spit|drop|serve) (fire|heat|flames|ice|cold)/gi
        ];
        
        let metaphorCount = 0;
        rapMetaphorPatterns.forEach(pattern => {
            const matches = lyrics.match(pattern) || [];
            metaphorCount += matches.length;
        });
        
        return Math.min(100, metaphorCount * 20);
    }

    detectDoubleEntendres(lyrics) {
        // Simplified double entendre detection
        const doubleEntendreWords = ['bank', 'green', 'paper', 'bread', 'dough', 'ice', 'rock', 'blow', 'hit', 'shot'];
        let count = 0;
        
        doubleEntendreWords.forEach(word => {
            if (lyrics.toLowerCase().includes(word)) count++;
        });
        
        return Math.min(100, count * 15);
    }

    detectPunchlines(lyrics) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        let punchlineCount = 0;
        
        // Look for setup-punchline patterns
        for (let i = 0; i < lines.length - 1; i++) {
            const line1 = lines[i].toLowerCase();
            const line2 = lines[i + 1].toLowerCase();
            
            // Simple punchline detection based on contrast or wordplay
            if (this.isPunchline(line1, line2)) {
                punchlineCount++;
            }
        }
        
        return Math.min(100, (punchlineCount / lines.length) * 100);
    }

    analyzeRapVocabulary(lyrics) {
        const words = lyrics.toLowerCase().split(/\s+/);
        const uniqueWords = new Set(words);
        const rapVocabCount = Array.from(this.rapKeywords).reduce((count, word) => 
            count + (lyrics.toLowerCase().includes(word) ? 1 : 0), 0);
        
        const vocabularyRichness = uniqueWords.size / words.length;
        const rapRelevance = rapVocabCount / words.length;
        
        return Math.min(100, (vocabularyRichness * 50) + (rapRelevance * 200));
    }

    detectPuns(lyrics) {
        // Simplified pun detection
        const punIndicators = ['sound like', 'sounds like', 'play on words'];
        let punCount = 0;
        
        punIndicators.forEach(indicator => {
            if (lyrics.toLowerCase().includes(indicator)) punCount++;
        });
        
        return Math.min(100, punCount * 25);
    }

    calculateWordplayDensity(lyrics) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        const words = lyrics.split(/\s+/).length;
        
        // Count various wordplay elements
        const metaphors = (lyrics.match(/like|as|is a|becomes/gi) || []).length;
        const alliteration = this.countAlliteration(lyrics);
        const internalRhymes = this.countInternalRhymes(lyrics);
        
        const totalWordplay = metaphors + alliteration + internalRhymes;
        return Math.min(100, (totalWordplay / words) * 500);
    }

    analyzeStressPatterns(lines) {
        // Simplified stress pattern analysis
        let consistentStress = 0;
        
        lines.forEach(line => {
            const words = line.split(' ');
            // Check for consistent stress patterns (simplified)
            if (words.length > 0 && words.length % 2 === 0) {
                consistentStress++;
            }
        });
        
        return lines.length > 0 ? (consistentStress / lines.length) * 100 : 0;
    }

    analyzePocketRiding(lines) {
        // Analyze how well the flow stays "in the pocket" (on beat)
        const syllableCounts = lines.map(line => this.countSyllables(line));
        const variance = this.calculateVariance(syllableCounts);
        
        return Math.max(0, 100 - variance * 8);
    }

    analyzeDelivery(lyrics) {
        // Analyze delivery complexity and flow switches
        const lines = lyrics.split('\n').filter(line => line.trim());
        let deliveryScore = 70; // Base score
        
        // Check for flow switches
        const syllableCounts = lines.map(line => this.countSyllables(line));
        const flowSwitches = this.countFlowSwitches(syllableCounts);
        
        deliveryScore += flowSwitches * 5;
        
        return Math.min(100, deliveryScore);
    }

    analyzeRapSyllableConsistency(lines) {
        const syllableCounts = lines.map(line => this.countSyllables(line));
        const variance = this.calculateVariance(syllableCounts);
        
        return Math.max(0, 100 - variance * 6);
    }

    analyzeBreathControl(lines) {
        // Analyze line length for breath control difficulty
        const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
        const longLines = lines.filter(line => line.length > avgLineLength * 1.5).length;
        
        const breathControlScore = 100 - (longLines / lines.length) * 30;
        return Math.max(0, breathControlScore);
    }

    analyzeEnunciation(lyrics) {
        // Check for difficult consonant clusters and tongue twisters
        const difficultPatterns = /([bcdfghjklmnpqrstvwxyz]{3,})/gi;
        const matches = lyrics.match(difficultPatterns) || [];
        
        const difficultyScore = Math.min(50, matches.length * 5);
        return 100 - difficultyScore;
    }

    analyzeRapVoice(lyrics) {
        // Analyze uniqueness and personality in the voice
        const personalPronouns = (lyrics.match(/\b(i|me|my|mine)\b/gi) || []).length;
        const totalWords = lyrics.split(/\s+/).length;
        const personalityRatio = personalPronouns / totalWords;
        
        return Math.min(100, personalityRatio * 300);
    }

    analyzeRapCredibility(lyrics) {
        // Check for authentic rap themes vs clichés
        const clicheCount = Array.from(this.rapCliches).reduce((count, cliche) => 
            count + (lyrics.toLowerCase().includes(cliche) ? 1 : 0), 0);
        
        const lines = lyrics.split('\n').filter(line => line.trim());
        const clicheRatio = clicheCount / lines.length;
        
        return Math.max(0, 100 - clicheRatio * 150);
    }

    // HELPER METHODS

    linesRhyme(line1, line2) {
        const words1 = line1.split(' ');
        const words2 = line2.split(' ');
        const lastWord1 = words1[words1.length - 1]?.replace(/[^\w]/g, '').toLowerCase();
        const lastWord2 = words2[words2.length - 1]?.replace(/[^\w]/g, '').toLowerCase();
        
        return lastWord1 && lastWord2 && this.wordsRhyme(lastWord1, lastWord2);
    }

    isPunchline(line1, line2) {
        // Simplified punchline detection
        const setupWords = ['when', 'if', 'but', 'so', 'then'];
        const punchlineWords = ['that', 'now', 'boom', 'bam', 'pow'];
        
        const hasSetup = setupWords.some(word => line1.includes(word));
        const hasPunchline = punchlineWords.some(word => line2.includes(word));
        
        return hasSetup && hasPunchline;
    }

    countAlliteration(lyrics) {
        const words = lyrics.split(/\s+/);
        let count = 0;
        
        for (let i = 0; i < words.length - 1; i++) {
            const word1 = words[i].replace(/[^\w]/g, '').toLowerCase();
            const word2 = words[i + 1].replace(/[^\w]/g, '').toLowerCase();
            
            if (word1[0] && word1[0] === word2[0]) {
                count++;
            }
        }
        
        return count;
    }

    countInternalRhymes(lyrics) {
        const lines = lyrics.split('\n');
        let count = 0;
        
        lines.forEach(line => {
            const words = line.split(' ');
            for (let i = 0; i < words.length - 1; i++) {
                for (let j = i + 1; j < words.length; j++) {
                    if (this.wordsRhyme(words[i], words[j])) {
                        count++;
                    }
                }
            }
        });
        
        return count;
    }

    countFlowSwitches(syllableCounts) {
        let switches = 0;
        let currentPattern = syllableCounts[0];
        
        for (let i = 1; i < syllableCounts.length; i++) {
            if (Math.abs(syllableCounts[i] - currentPattern) > 2) {
                switches++;
                currentPattern = syllableCounts[i];
            }
        }
        
        return switches;
    }

    findRepeatedLines(lines) {
        const lineCount = {};
        const repeated = [];
        
        lines.forEach(line => {
            const cleanLine = line.trim().toLowerCase();
            if (cleanLine.length > 5) {
                lineCount[cleanLine] = (lineCount[cleanLine] || 0) + 1;
            }
        });
        
        Object.entries(lineCount).forEach(([line, count]) => {
            if (count > 1) {
                repeated.push({ line, count });
            }
        });
        
        return repeated;
    }

    getErrorAnalysis() {
        return {
            grade: 'F',
            overallScore: 0,
            breakdown: {},
            feedback: { overall: 'Unable to analyze lyrics. Please check the input and try again.' },
            improvements: [],
            strengths: [],
            weaknesses: ['Analysis failed'],
            metadata: {}
        };
    }

    // Additional helper methods for more sophisticated analysis
    identifySections(lyrics) {
        const sections = [];
        const lines = lyrics.split('\n');
        
        // Simple section detection based on repetition and structure
        // This is a simplified version - real implementation would be more sophisticated
        
        return sections;
    }

    evaluateOrganization(sections) {
        // Evaluate how well the song is organized
        return 75; // Placeholder
    }

    evaluateFlow(lines) {
        // Evaluate how well lines flow together
        return 75; // Placeholder
    }

    evaluateTransitions(sections) {
        // Evaluate transitions between sections
        return 75; // Placeholder
    }

    evaluateRhymeCreativity(lines) {
        // Evaluate creativity of rhyme choices
        return 75; // Placeholder
    }

    evaluateRhymeNaturalness(lines) {
        // Evaluate how natural the rhymes sound
        return 75; // Placeholder
    }

    evaluateCleverness(lyrics) {
        // Evaluate cleverness of wordplay
        return 75; // Placeholder
    }

    evaluateAuthenticity(lyrics) {
        // Evaluate emotional authenticity
        return 75; // Placeholder
    }

    evaluateEmotionalImpact(lyrics) {
        // Evaluate emotional impact
        return 75; // Placeholder
    }

    evaluateEmotionalConsistency(lyrics) {
        // Evaluate emotional consistency
        return 75; // Placeholder
    }

    evaluateSyllableConsistency(lyrics) {
        // Evaluate syllable count consistency
        return 75; // Placeholder
    }

    evaluateRhythm(lyrics) {
        // Evaluate rhythmic patterns
        return 75; // Placeholder
    }

    evaluatePronunciation(lyrics) {
        // Evaluate pronunciation and flow
        return 75; // Placeholder
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.SongAnalysisEngine = SongAnalysisEngine;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SongAnalysisEngine;
}