/**
 * Suno API Integration for Remix Generation
 * Generates improved versions of songs based on analysis feedback
 */

class SunoRemixGenerator {
    constructor() {
        this.apiKey = null;
        this.baseUrl = 'https://api.sunoapi.org/v1';
        this.isConfigured = false;
    }

    /**
     * Configure Suno API
     */
    configure(apiKey) {
        this.apiKey = apiKey;
        this.isConfigured = !!apiKey;
        return this.isConfigured;
    }

    /**
     * Generate improved version based on analysis
     */
    async generateImprovedVersion(lyrics, analysis, audioFile = null) {
        if (!this.isConfigured) {
            throw new Error('Suno API not configured. Please add your API key.');
        }

        try {
            const remixPrompt = this.generateRemixPrompt(analysis);
            const style = this.selectOptimalStyle(analysis);
            const persona = this.selectPersona(analysis);

            let result;
            
            if (audioFile) {
                // Remix existing audio
                result = await this.remixExistingAudio(audioFile, remixPrompt, style, persona);
            } else {
                // Generate new song from lyrics
                result = await this.generateFromLyrics(lyrics, remixPrompt, style, persona);
            }

            return {
                success: true,
                jobId: result.id,
                remixPrompt: remixPrompt,
                style: style,
                persona: persona,
                estimatedTime: '2-3 minutes',
                improvements: this.getImprovementExplanation(analysis)
            };
        } catch (error) {
            console.error('Suno remix generation failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate remix prompt based on analysis weaknesses
     */
    generateRemixPrompt(analysis) {
        const breakdown = analysis.breakdown;
        const songPurpose = analysis.songPurpose;
        const isRap = analysis.isRap;
        
        let prompt = '';
        const improvements = [];

        // Genre-specific improvements
        if (isRap) {
            if (breakdown.flow < 70) {
                improvements.push('tighter flow with consistent rhythm');
            }
            if (breakdown.rhymeScheme < 70) {
                improvements.push('more complex internal rhymes');
            }
            if (breakdown.wordplay < 70) {
                improvements.push('clever wordplay and punchlines');
            }
            if (breakdown.technical < 70) {
                improvements.push('better syllable patterns and delivery');
            }
        } else {
            if (breakdown.structure < 70) {
                improvements.push('clearer verse-chorus structure');
            }
            if (breakdown.emotion < 70) {
                improvements.push('more emotional depth and authenticity');
            }
            if (breakdown.rhymeScheme < 70) {
                improvements.push('natural-sounding rhyme schemes');
            }
        }

        // Purpose-specific improvements
        switch (songPurpose.primary) {
            case 'love_song':
                improvements.push('romantic melody with heartfelt vocals');
                break;
            case 'diss_track':
                improvements.push('aggressive beat with sharp delivery');
                break;
            case 'party_anthem':
                improvements.push('high-energy beat with infectious hooks');
                break;
            case 'sad_ballad':
                improvements.push('melancholic melody with emotional vocals');
                break;
            case 'motivational':
                improvements.push('uplifting beat with powerful vocals');
                break;
        }

        // Overall quality improvements
        if (analysis.overallScore < 80) {
            improvements.push('professional production quality');
            improvements.push('enhanced vocal performance');
        }

        prompt = `Create an improved version with ${improvements.join(', ')}. `;
        
        // Add style-specific instructions
        if (isRap) {
            prompt += 'Focus on tight rap delivery, complex rhyme patterns, and hard-hitting beats.';
        } else {
            prompt += 'Focus on melodic vocals, clear song structure, and emotional connection.';
        }

        return prompt;
    }

    /**
     * Select optimal musical style based on analysis
     */
    selectOptimalStyle(analysis) {
        const songPurpose = analysis.songPurpose;
        const isRap = analysis.isRap;
        const breakdown = analysis.breakdown;

        if (isRap) {
            // Rap style selection
            if (songPurpose.primary === 'diss_track') {
                return 'aggressive-hip-hop';
            } else if (songPurpose.primary === 'party_anthem') {
                return 'trap-party';
            } else if (songPurpose.primary === 'storytelling') {
                return 'conscious-rap';
            } else if (breakdown.technical > 80) {
                return 'technical-rap';
            } else {
                return 'modern-hip-hop';
            }
        } else {
            // General style selection
            switch (songPurpose.primary) {
                case 'love_song':
                    return 'romantic-pop';
                case 'sad_ballad':
                    return 'emotional-ballad';
                case 'party_anthem':
                    return 'dance-pop';
                case 'motivational':
                    return 'uplifting-rock';
                case 'social_commentary':
                    return 'alternative-rock';
                default:
                    return 'contemporary-pop';
            }
        }
    }

    /**
     * Select appropriate vocal persona
     */
    selectPersona(analysis) {
        const songPurpose = analysis.songPurpose;
        const isRap = analysis.isRap;
        const emotionalTone = this.detectEmotionalTone(analysis);

        if (isRap) {
            if (songPurpose.primary === 'diss_track') {
                return 'aggressive_male_rapper';
            } else if (emotionalTone === 'confident') {
                return 'confident_male_rapper';
            } else if (emotionalTone === 'smooth') {
                return 'smooth_male_rapper';
            } else {
                return 'versatile_male_rapper';
            }
        } else {
            if (songPurpose.primary === 'love_song') {
                return emotionalTone === 'tender' ? 'romantic_male_singer' : 'soulful_female_singer';
            } else if (songPurpose.primary === 'sad_ballad') {
                return 'emotional_singer';
            } else if (songPurpose.primary === 'party_anthem') {
                return 'energetic_singer';
            } else {
                return 'versatile_singer';
            }
        }
    }

    /**
     * Detect emotional tone from analysis
     */
    detectEmotionalTone(analysis) {
        const lyrics = analysis.originalLyrics.toLowerCase();
        
        if (lyrics.includes('confident') || lyrics.includes('boss') || lyrics.includes('king')) {
            return 'confident';
        } else if (lyrics.includes('smooth') || lyrics.includes('cool') || lyrics.includes('chill')) {
            return 'smooth';
        } else if (lyrics.includes('tender') || lyrics.includes('gentle') || lyrics.includes('soft')) {
            return 'tender';
        } else {
            return 'balanced';
        }
    }

    /**
     * Remix existing audio file
     */
    async remixExistingAudio(audioFile, prompt, style, persona) {
        const formData = new FormData();
        formData.append('audio', audioFile);
        
        const response = await fetch(`${this.baseUrl}/upload-and-cover-audio`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                audio_base64: await this.fileToBase64(audioFile),
                prompt: prompt,
                persona: persona,
                style: style,
                weirdness: 0.65,
                audio_influence: 0.85
            })
        });

        if (!response.ok) {
            throw new Error(`Suno API error: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Generate new song from lyrics
     */
    async generateFromLyrics(lyrics, prompt, style, persona) {
        const response = await fetch(`${this.baseUrl}/generate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lyrics: lyrics,
                prompt: prompt,
                persona: persona,
                style: style,
                weirdness: 0.5,
                quality: 'high'
            })
        });

        if (!response.ok) {
            throw new Error(`Suno API error: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Check generation status
     */
    async checkStatus(jobId) {
        const response = await fetch(`${this.baseUrl}/status/${jobId}`, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Status check failed: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Get improvement explanation
     */
    getImprovementExplanation(analysis) {
        const improvements = [];
        const breakdown = analysis.breakdown;
        const isRap = analysis.isRap;

        if (isRap) {
            if (breakdown.flow < 70) {
                improvements.push('🌊 **Flow Enhancement**: Tightened rhythm patterns and syllable consistency for smoother delivery');
            }
            if (breakdown.rhymeScheme < 70) {
                improvements.push('🎯 **Rhyme Upgrade**: Added internal rhymes and multisyllabic patterns for technical complexity');
            }
            if (breakdown.wordplay < 70) {
                improvements.push('🧠 **Wordplay Boost**: Enhanced metaphors, punchlines, and clever word combinations');
            }
        } else {
            if (breakdown.structure < 70) {
                improvements.push('🏗️ **Structure Fix**: Clearer verse-chorus organization with smooth transitions');
            }
            if (breakdown.emotion < 70) {
                improvements.push('❤️ **Emotional Depth**: Enhanced emotional authenticity and connection');
            }
        }

        if (breakdown.technical < 70) {
            improvements.push('⚙️ **Technical Polish**: Improved syllable patterns and vocal delivery');
        }

        improvements.push('🎵 **Production Quality**: Professional mixing, mastering, and instrumental arrangement');
        improvements.push('🎤 **Vocal Performance**: Enhanced delivery style matching the song\'s purpose and emotion');

        return improvements;
    }

    /**
     * Convert file to base64
     */
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }

    /**
     * Get available styles
     */
    getAvailableStyles() {
        return {
            rap: [
                'modern-hip-hop',
                'aggressive-hip-hop', 
                'trap-party',
                'conscious-rap',
                'technical-rap',
                'old-school-rap',
                'melodic-rap'
            ],
            general: [
                'contemporary-pop',
                'romantic-pop',
                'emotional-ballad',
                'dance-pop',
                'uplifting-rock',
                'alternative-rock',
                'indie-folk',
                'r&b-soul'
            ]
        };
    }

    /**
     * Get available personas
     */
    getAvailablePersonas() {
        return {
            rap: [
                'aggressive_male_rapper',
                'confident_male_rapper',
                'smooth_male_rapper',
                'versatile_male_rapper',
                'female_rapper'
            ],
            general: [
                'romantic_male_singer',
                'soulful_female_singer',
                'emotional_singer',
                'energetic_singer',
                'versatile_singer'
            ]
        };
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.SunoRemixGenerator = SunoRemixGenerator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SunoRemixGenerator;
}