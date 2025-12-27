/**
 * Enhanced Groq Whisper Audio Transcription Integration
 * This file provides real audio transcription using Groq's Whisper API
 */

class GroqWhisperTranscriptionService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.groq.com/openai/v1';
        this.model = 'whisper-large-v3-turbo';
        this.maxFileSize = 25 * 1024 * 1024; // 25MB limit for Groq API
    }

    /**
     * Main transcription method using Groq's Whisper API
     */
    async transcribeAudio(audioFile, params, onProgress) {
        try {
            // Step 1: Validate file
            onProgress(10, 'Validating audio file...');
            this.validateAudioFile(audioFile);

            // Step 2: Prepare file for upload
            onProgress(25, 'Preparing audio file...');
            const formData = await this.prepareFormData(audioFile, params);

            // Step 3: Upload and transcribe
            onProgress(50, 'Uploading and transcribing...');
            const transcription = await this.performTranscription(formData);

            // Step 4: Process and format results
            onProgress(80, 'Processing transcription...');
            const formattedResult = this.formatTranscription(transcription, params);

            onProgress(100, 'Transcription complete!');
            return formattedResult;

        } catch (error) {
            console.error('Whisper transcription error:', error);
            throw new Error(`Transcription failed: ${error.message}`);
        }
    }

    /**
     * Validate audio file before processing
     */
    validateAudioFile(file) {
        if (!file) {
            throw new Error('No audio file provided');
        }

        if (file.size > this.maxFileSize) {
            throw new Error(`File size (${this.formatFileSize(file.size)}) exceeds the 25MB limit`);
        }

        const supportedTypes = [
            'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 
            'audio/aac', 'audio/ogg', 'audio/flac', 'audio/webm'
        ];

        const isValidType = supportedTypes.includes(file.type) || 
                           /\.(mp3|wav|m4a|aac|ogg|flac|webm)$/i.test(file.name);

        if (!isValidType) {
            throw new Error(`Unsupported file type: ${file.type || 'unknown'}. Supported formats: MP3, WAV, M4A, AAC, OGG, FLAC, WebM`);
        }
    }

    /**
     * Prepare FormData for Groq API
     */
    async prepareFormData(audioFile, params) {
        const formData = new FormData();
        
        // Add the audio file
        formData.append('file', audioFile, audioFile.name);
        
        // Add model
        formData.append('model', this.model);
        
        // Add optional parameters
        if (params.language && params.language !== '') {
            formData.append('language', params.language);
        }
        
        // Temperature for transcription consistency
        formData.append('temperature', params.temperature || 0);
        
        // Response format
        formData.append('response_format', 'verbose_json');
        
        // Add timestamps if requested
        if (params.timestamping === 'line') {
            formData.append('timestamp_granularities[]', 'word');
        }

        return formData;
    }

    /**
     * Perform the actual transcription using Groq's API
     */
    async performTranscription(formData) {
        const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
                // Don't set Content-Type - let browser set it with boundary for FormData
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `API request failed: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    }

    /**
     * Format transcription results with structure and timestamps
     */
    formatTranscription(transcriptionData, params) {
        let formattedText = transcriptionData.text || '';
        
        // If we have word-level timestamps and line timestamps are requested
        if (params.timestamping === 'line' && transcriptionData.words) {
            formattedText = this.addLineTimestamps(transcriptionData);
        }
        
        // Add structure if requested
        if (params.include_structure) {
            formattedText = this.addSongStructure(formattedText);
        }
        
        // Clean up the text
        formattedText = this.cleanTranscription(formattedText);
        
        return {
            text: formattedText,
            language: transcriptionData.language || 'unknown',
            duration: transcriptionData.duration || 0,
            confidence: this.calculateConfidence(transcriptionData)
        };
    }

    /**
     * Add line-by-line timestamps using word data
     */
    addLineTimestamps(transcriptionData) {
        if (!transcriptionData.words || transcriptionData.words.length === 0) {
            return transcriptionData.text;
        }

        const words = transcriptionData.words;
        const lines = transcriptionData.text.split('\n');
        let result = '';
        let wordIndex = 0;

        for (const line of lines) {
            if (line.trim() === '') {
                result += '\n';
                continue;
            }

            // Find the timestamp for the first word of this line
            const lineWords = line.trim().split(/\s+/);
            if (lineWords.length > 0 && wordIndex < words.length) {
                const timestamp = this.formatTimestamp(words[wordIndex].start);
                result += `${timestamp} ${line}\n`;
                
                // Advance word index by the number of words in this line
                wordIndex += lineWords.length;
            } else {
                result += `${line}\n`;
            }
        }

        return result;
    }

    /**
     * Add basic song structure markers
     */
    addSongStructure(text) {
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length === 0) return text;

        let structured = '';
        let currentSection = 1;
        const linesPerSection = Math.max(4, Math.floor(lines.length / 4));

        for (let i = 0; i < lines.length; i++) {
            // Add section markers at logical breaks
            if (i === 0) {
                structured += '[Verse 1]\n';
            } else if (i === linesPerSection) {
                structured += '\n[Chorus]\n';
            } else if (i === linesPerSection * 2) {
                structured += '\n[Verse 2]\n';
            } else if (i === linesPerSection * 3) {
                structured += '\n[Bridge]\n';
            }

            structured += lines[i] + '\n';
        }

        return structured;
    }

    /**
     * Clean up transcription text
     */
    cleanTranscription(text) {
        return text
            .replace(/\s+/g, ' ')                    // Normalize whitespace
            .replace(/\n\s*\n\s*\n/g, '\n\n')       // Remove excessive line breaks
            .replace(/([.!?])\s*([a-z])/g, '$1 $2') // Fix punctuation spacing
            .trim();
    }

    /**
     * Calculate confidence score from transcription data
     */
    calculateConfidence(transcriptionData) {
        if (transcriptionData.words && transcriptionData.words.length > 0) {
            // Average confidence from word-level data if available
            const totalConfidence = transcriptionData.words.reduce((sum, word) => {
                return sum + (word.confidence || 0.8); // Default confidence if not provided
            }, 0);
            return Math.round((totalConfidence / transcriptionData.words.length) * 100);
        }
        
        // Estimate confidence based on text quality
        const text = transcriptionData.text || '';
        if (text.length > 100) return 85;
        if (text.length > 50) return 75;
        return 65;
    }

    /**
     * Format timestamp from seconds to MM:SS
     */
    formatTimestamp(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `[${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}]`;
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Check API key validity
     */
    async validateApiKey() {
        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get supported models
     */
    async getSupportedModels() {
        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.data.filter(model => model.id.includes('whisper'));
            }
        } catch (error) {
            console.error('Failed to fetch models:', error);
        }
        
        return [{ id: this.model, name: 'Whisper Large V3 Turbo' }];
    }

    /**
     * Retry mechanism for failed requests
     */
    async withRetry(operation, maxRetries = 3, delay = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }
                
                // Don't retry on client errors (4xx)
                if (error.message.includes('400') || error.message.includes('401') || 
                    error.message.includes('403') || error.message.includes('413')) {
                    throw error;
                }
                
                console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error.message);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }

    /**
     * Process large files by chunking (if needed in future)
     */
    async processLargeFile(audioFile, params, onProgress) {
        // For now, we'll use the direct API approach
        // In the future, this could implement chunking for very large files
        return this.transcribeAudio(audioFile, params, onProgress);
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.GroqWhisperTranscriptionService = GroqWhisperTranscriptionService;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GroqWhisperTranscriptionService;
}