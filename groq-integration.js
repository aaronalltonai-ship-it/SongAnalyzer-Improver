/**
 * Enhanced Groq API Integration for Lyric Transcription
 * This file provides the actual integration with Groq's API
 */

class GroqLyricTranscriptionService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.groq.com/openai/v1';
        this.model = 'openai/gpt-oss-120b';
    }

    /**
     * Main transcription method that handles the complete workflow
     */
    async transcribeLyrics(params, onProgress, onStream) {
        try {
            // Step 1: Validate audio URL
            onProgress(10, 'Validating audio source...');
            await this.validateAudioUrl(params.audio_url);

            // Step 2: Prepare the transcription request
            onProgress(25, 'Preparing transcription request...');
            const requestPayload = this.buildTranscriptionRequest(params);

            // Step 3: Make the API call with streaming
            onProgress(40, 'Starting transcription...');
            const response = await this.makeStreamingRequest(requestPayload);

            // Step 4: Process streaming response
            onProgress(60, 'Processing transcription...');
            const transcription = await this.processStreamingResponse(response, onStream, onProgress);

            onProgress(100, 'Transcription complete!');
            return transcription;

        } catch (error) {
            console.error('Transcription service error:', error);
            throw new Error(`Transcription failed: ${error.message}`);
        }
    }

    /**
     * Build the complete request payload for Groq API
     */
    buildTranscriptionRequest(params) {
        const systemPrompt = this.buildSystemPrompt();
        const userPrompt = this.buildUserPrompt(params);

        return {
            model: this.model,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            temperature: params.temperature || 1,
            max_completion_tokens: params.max_tokens || 8192,
            top_p: 1,
            reasoning_effort: "medium",
            stream: true,
            tools: [
                {
                    type: "function",
                    function: {
                        name: "Song_Lyric_Transcriber",
                        description: "Advanced song lyric transcription with structure analysis",
                        parameters: {
                            "$schema": "http://json-schema.org/draft-07/schema#",
                            "title": "SongLyricsTranscriber",
                            "type": "object",
                            "required": ["audio_url"],
                            "properties": {
                                "audio_url": {
                                    "type": "string",
                                    "format": "uri",
                                    "description": "URL of the audio file containing the song."
                                },
                                "language": {
                                    "type": "string",
                                    "description": "Optional language hint for the lyrics (e.g., 'en', 'es', 'fr')."
                                },
                                "include_structure": {
                                    "type": "boolean",
                                    "description": "If true, output includes song structure markers (Verse, Chorus, Bridge, etc.).",
                                    "default": true
                                },
                                "timestamping": {
                                    "type": "string",
                                    "enum": ["none", "line"],
                                    "description": "Timestamp format: 'none' for no timestamps, 'line' for line-by-line timestamps.",
                                    "default": "none"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                },
                {
                    "type": "code_interpreter"
                }
            ]
        };
    }

    /**
     * Build system prompt for optimal transcription
     */
    buildSystemPrompt() {
        return `You are an expert music transcription AI specializing in accurate lyric extraction from audio files. Your capabilities include:

1. **Audio Analysis**: Process various audio formats and quality levels
2. **Language Detection**: Automatically detect song language when not specified
3. **Structure Recognition**: Identify song sections (Verse, Chorus, Bridge, Outro, etc.)
4. **Timing Analysis**: Provide precise timestamps when requested
5. **Quality Assurance**: Ensure clean, readable, and accurate transcriptions

**Output Guidelines:**
- Provide clean, properly formatted lyrics
- Use consistent capitalization and punctuation
- Include song structure markers when requested
- Add timestamps in [MM:SS] format when specified
- Handle multiple languages and accents accurately
- Preserve artistic elements like repetitions and ad-libs
- Indicate unclear sections with [unclear] or [instrumental]

**Quality Standards:**
- Accuracy: Prioritize correctness over speed
- Completeness: Transcribe all audible lyrics
- Formatting: Use clear, readable structure
- Context: Maintain song's artistic intent`;
    }

    /**
     * Build user prompt with specific parameters
     */
    buildUserPrompt(params) {
        let prompt = `Please transcribe the lyrics from this audio file: ${params.audio_url}\n\n`;
        
        prompt += "**Transcription Requirements:**\n";
        
        if (params.language) {
            prompt += `- Language: ${this.getLanguageName(params.language)}\n`;
        } else {
            prompt += "- Language: Auto-detect\n";
        }
        
        if (params.include_structure) {
            prompt += "- Structure: Include section markers (Verse, Chorus, Bridge, etc.)\n";
        } else {
            prompt += "- Structure: Plain text without section markers\n";
        }
        
        if (params.timestamping === 'line') {
            prompt += "- Timestamps: Include [MM:SS] timestamps for each line\n";
        } else {
            prompt += "- Timestamps: No timestamps needed\n";
        }
        
        prompt += "\n**Output Format:**\n";
        if (params.include_structure) {
            prompt += "```\n[Verse 1]\nLyric line 1\nLyric line 2\n\n[Chorus]\nChorus line 1\nChorus line 2\n```\n";
        }
        
        if (params.timestamping === 'line') {
            prompt += "Include timestamps like: [00:15] First line of lyrics\n";
        }
        
        prompt += "\nPlease provide the most accurate transcription possible, maintaining the song's original structure and meaning.";
        
        return prompt;
    }

    /**
     * Make streaming request to Groq API
     */
    async makeStreamingRequest(payload) {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API request failed: ${response.statusText}`);
        }

        return response;
    }

    /**
     * Process streaming response from Groq API
     */
    async processStreamingResponse(response, onStream, onProgress) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullTranscription = '';
        let progressStep = 60;

        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        
                        if (data === '[DONE]') {
                            onProgress(100, 'Transcription complete!');
                            return fullTranscription;
                        }
                        
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content;
                            
                            if (content) {
                                fullTranscription += content;
                                onStream(content);
                                
                                // Update progress based on content length
                                progressStep = Math.min(95, progressStep + 0.5);
                                onProgress(progressStep, 'Streaming transcription...');
                            }
                        } catch (parseError) {
                            console.warn('Failed to parse streaming data:', parseError);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

        return fullTranscription;
    }

    /**
     * Validate audio URL accessibility
     */
    async validateAudioUrl(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            
            if (!response.ok) {
                throw new Error(`Audio file not accessible: ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && !contentType.startsWith('audio/')) {
                console.warn(`Warning: Content type is ${contentType}, expected audio/*`);
            }
            
            return true;
        } catch (error) {
            throw new Error(`Cannot access audio file: ${error.message}`);
        }
    }

    /**
     * Get full language name from code
     */
    getLanguageName(code) {
        const languages = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese',
            'ru': 'Russian',
            'ar': 'Arabic',
            'hi': 'Hindi'
        };
        
        return languages[code] || code;
    }

    /**
     * Format transcription with enhanced structure
     */
    formatTranscription(rawText, params) {
        let formatted = rawText.trim();
        
        // Clean up common transcription artifacts
        formatted = formatted
            .replace(/\[MUSIC\]/gi, '[Instrumental]')
            .replace(/\[SINGING\]/gi, '')
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n\s*\n/g, '\n\n');
        
        // Add structure if requested but not present
        if (params.include_structure && !formatted.includes('[')) {
            formatted = this.addBasicStructure(formatted);
        }
        
        return formatted;
    }

    /**
     * Add basic structure to unstructured lyrics
     */
    addBasicStructure(lyrics) {
        const lines = lyrics.split('\n').filter(line => line.trim());
        let structured = '';
        let sectionCount = 1;
        
        for (let i = 0; i < lines.length; i++) {
            if (i === 0) {
                structured += '[Verse 1]\n';
            } else if (i === Math.floor(lines.length / 2)) {
                structured += '\n[Chorus]\n';
            } else if (i === Math.floor(lines.length * 0.75)) {
                structured += '\n[Verse 2]\n';
            }
            
            structured += lines[i] + '\n';
        }
        
        return structured;
    }

    /**
     * Error handling and retry logic
     */
    async withRetry(operation, maxRetries = 3, delay = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }
                
                console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error.message);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.GroqLyricTranscriptionService = GroqLyricTranscriptionService;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GroqLyricTranscriptionService;
}