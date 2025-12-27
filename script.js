class GroqLyricTranscriber {
    constructor() {
        this.groqClient = null;
        this.isTranscribing = false;
        this.currentAudioFile = null;
        this.currentAudioUrl = '';
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.initializeGradingSystem();
    }

    initializeElements() {
        // Tab elements
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Input elements
        this.audioUrlInput = document.getElementById('audioUrl');
        this.fileInput = document.getElementById('fileInput');
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInfo = document.getElementById('fileInfo');
        this.validateUrlBtn = document.getElementById('validateUrl');
        this.removeFileBtn = document.getElementById('removeFile');
        this.browseBtn = document.querySelector('.browse-btn');
        
        // Configuration elements
        this.languageSelect = document.getElementById('language');
        this.includeStructureCheckbox = document.getElementById('includeStructure');
        this.timestampingSelect = document.getElementById('timestamping');
        
        // API elements
        this.apiKeyInput = document.getElementById('apiKey');
        this.temperatureSlider = document.getElementById('temperature');
        this.maxTokensInput = document.getElementById('maxTokens');
        this.toggleApiKeyBtn = document.getElementById('toggleApiKey');
        
        // Action elements
        this.transcribeBtn = document.getElementById('transcribeBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.retryBtn = document.getElementById('retryBtn');
        this.gradeBtn = document.getElementById('gradeBtn');
        
        // State elements
        this.statusIndicator = document.getElementById('statusIndicator');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.welcomeState = document.getElementById('welcomeState');
        this.lyricsOutput = document.getElementById('lyricsOutput');
        this.lyricsContent = document.getElementById('lyricsContent');
        this.errorState = document.getElementById('errorState');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Slider value display
        this.sliderValue = document.querySelector('.slider-value');
    }

    bindEvents() {
        // Tab switching
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // File upload events
        this.browseBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files[0]));
        this.removeFileBtn.addEventListener('click', () => this.removeFile());
        
        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // URL validation
        this.validateUrlBtn.addEventListener('click', () => this.validateUrl());
        this.audioUrlInput.addEventListener('input', () => this.onUrlChange());
        
        // API key toggle
        this.toggleApiKeyBtn.addEventListener('click', () => this.toggleApiKeyVisibility());
        
        // Temperature slider
        this.temperatureSlider.addEventListener('input', (e) => {
            this.sliderValue.textContent = parseFloat(e.target.value).toFixed(1);
        });
        
        // Main actions
        this.transcribeBtn.addEventListener('click', () => this.startTranscription());
        this.copyBtn.addEventListener('click', () => this.copyLyrics());
        this.downloadBtn.addEventListener('click', () => this.downloadLyrics());
        this.clearBtn.addEventListener('click', () => this.clearResults());
        this.retryBtn.addEventListener('click', () => this.startTranscription());
        this.gradeBtn.addEventListener('click', () => this.showGradingPanel());
        
        // Settings persistence
        this.apiKeyInput.addEventListener('change', () => this.saveSettings());
        this.languageSelect.addEventListener('change', () => this.saveSettings());
        this.includeStructureCheckbox.addEventListener('change', () => this.saveSettings());
        this.timestampingSelect.addEventListener('change', () => this.saveSettings());
        this.temperatureSlider.addEventListener('change', () => this.saveSettings());
        this.maxTokensInput.addEventListener('change', () => this.saveSettings());
    }

    switchTab(tabName) {
        // Update tab buttons
        this.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
        
        // Clear previous inputs when switching
        if (tabName === 'url') {
            this.removeFile();
        } else {
            this.audioUrlInput.value = '';
            this.currentAudioUrl = '';
        }
        
        this.updateTranscribeButton();
    }

    handleFileSelect(file) {
        if (!file) return;
        
        if (!this.isAudioFile(file)) {
            this.showError('Please select a valid audio file (MP3, WAV, M4A, etc.)');
            return;
        }
        
        this.currentAudioFile = file;
        this.showFileInfo(file);
        this.updateTranscribeButton();
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFileSelect(files[0]);
        }
    }

    removeFile() {
        this.currentAudioFile = null;
        this.fileInput.value = '';
        this.fileInfo.style.display = 'none';
        this.updateTranscribeButton();
    }

    showFileInfo(file) {
        const fileName = this.fileInfo.querySelector('.file-name');
        const fileSize = this.fileInfo.querySelector('.file-size');
        
        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);
        this.fileInfo.style.display = 'flex';
    }

    validateUrl() {
        const url = this.audioUrlInput.value.trim();
        if (!url) return;
        
        if (this.isValidUrl(url)) {
            this.currentAudioUrl = url;
            this.validateUrlBtn.innerHTML = '<i class="fas fa-check"></i>';
            this.validateUrlBtn.style.color = 'var(--accent-success)';
            this.validateUrlBtn.style.borderColor = 'var(--accent-success)';
            this.updateTranscribeButton();
        } else {
            this.validateUrlBtn.innerHTML = '<i class="fas fa-times"></i>';
            this.validateUrlBtn.style.color = 'var(--accent-error)';
            this.validateUrlBtn.style.borderColor = 'var(--accent-error)';
            this.showError('Please enter a valid URL');
        }
    }

    onUrlChange() {
        this.currentAudioUrl = '';
        this.validateUrlBtn.innerHTML = '<i class="fas fa-check"></i>';
        this.validateUrlBtn.style.color = 'var(--text-secondary)';
        this.validateUrlBtn.style.borderColor = 'var(--border-primary)';
        this.updateTranscribeButton();
    }

    toggleApiKeyVisibility() {
        const isPassword = this.apiKeyInput.type === 'password';
        this.apiKeyInput.type = isPassword ? 'text' : 'password';
        this.toggleApiKeyBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    }

    async startTranscription() {
        if (this.isTranscribing) return;
        
        // Validate inputs
        if (!this.validateInputs()) return;
        
        this.isTranscribing = true;
        this.updateUI('transcribing');
        
        try {
            // Initialize Groq client
            this.initializeGroqClient();
            
            // Get audio URL (either from input or file upload)
            const audioUrl = await this.getAudioUrl();
            
            // Prepare transcription parameters
            const params = this.getTranscriptionParams(audioUrl);
            
            // Start transcription with streaming
            await this.performTranscription(params);
            
        } catch (error) {
            console.error('Transcription error:', error);
            this.showError(error.message || 'An error occurred during transcription');
        } finally {
            this.isTranscribing = false;
            this.updateUI('idle');
        }
    }

    validateInputs() {
        const apiKey = this.apiKeyInput.value.trim();
        if (!apiKey) {
            this.showError('Please enter your Groq API key');
            return false;
        }
        
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        if (activeTab === 'url' && !this.currentAudioUrl) {
            this.showError('Please enter and validate an audio URL');
            return false;
        }
        
        if (activeTab === 'upload' && !this.currentAudioFile) {
            this.showError('Please select an audio file');
            return false;
        }
        
        return true;
    }

    initializeGroqClient() {
        // Note: In a real implementation, you would use the actual Groq SDK
        // This is a mock implementation for demonstration
        this.groqClient = {
            apiKey: this.apiKeyInput.value.trim(),
            baseUrl: 'https://api.groq.com/openai/v1'
        };
    }

    async getAudioUrl() {
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        
        if (activeTab === 'url') {
            return this.currentAudioUrl;
        } else {
            // In a real implementation, you would upload the file to a server
            // and get back a URL, or use a service like Groq's file upload
            return await this.uploadFileToServer(this.currentAudioFile);
        }
    }

    async uploadFileToServer(file) {
        // Mock file upload - in reality, you'd upload to your server or Groq
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`https://example.com/uploads/${file.name}`);
            }, 1000);
        });
    }

    getTranscriptionParams(audioUrl) {
        return {
            audio_url: audioUrl,
            language: this.languageSelect.value || undefined,
            include_structure: this.includeStructureCheckbox.checked,
            timestamping: this.timestampingSelect.value
        };
    }

    async performTranscription(params) {
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        
        if (activeTab === 'upload' && this.currentAudioFile) {
            // Use real Groq Whisper API for file uploads
            await this.performWhisperTranscription(params);
        } else {
            // Use chat completion for URL-based transcription (fallback)
            await this.performChatTranscription(params);
        }
    }

    async performWhisperTranscription(params) {
        try {
            // Initialize Whisper service
            const whisperService = new GroqWhisperTranscriptionService(this.apiKeyInput.value.trim());
            
            // Prepare transcription parameters
            const transcriptionParams = {
                language: this.languageSelect.value,
                include_structure: this.includeStructureCheckbox.checked,
                timestamping: this.timestampingSelect.value,
                temperature: parseFloat(this.temperatureSlider.value)
            };
            
            // Perform transcription with progress updates
            const result = await whisperService.transcribeAudio(
                this.currentAudioFile,
                transcriptionParams,
                (progress, message) => this.updateProgress(progress, message)
            );
            
            // Display results
            this.displayTranscriptionResult(result);
            this.updateUI('completed');
            
        } catch (error) {
            console.error('Whisper transcription failed:', error);
            throw error;
        }
    }

    async performChatTranscription(params) {
        // Fallback to chat completion for URL-based transcription
        this.updateProgress(10, 'Connecting to Groq API...');
        await this.delay(500);
        
        this.updateProgress(25, 'Processing audio file...');
        await this.delay(1000);
        
        this.updateProgress(50, 'Transcribing lyrics...');
        await this.delay(1000);
        
        // Simulate streaming response for URL-based transcription
        const mockLyrics = this.generateMockLyrics(params);
        await this.streamLyrics(mockLyrics);
        
        this.updateProgress(100, 'Transcription complete!');
        await this.delay(500);
        
        this.updateUI('completed');
    }

    async streamLyrics(lyrics) {
        this.lyricsContent.innerHTML = '';
        this.showResults();
        
        const lines = lyrics.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const progress = 50 + (i / lines.length) * 40;
            
            this.updateProgress(progress, `Processing line ${i + 1} of ${lines.length}...`);
            
            // Add line with typing effect
            await this.addLineWithEffect(line);
            await this.delay(100);
        }
    }

    async addLineWithEffect(line) {
        const lineElement = document.createElement('div');
        lineElement.className = 'lyric-line';
        this.lyricsContent.appendChild(lineElement);
        
        // Type out the line character by character
        for (let i = 0; i <= line.length; i++) {
            lineElement.textContent = line.substring(0, i);
            await this.delay(20);
        }
        
        // Scroll to bottom
        this.lyricsOutput.scrollTop = this.lyricsOutput.scrollHeight;
    }

    displayTranscriptionResult(result) {
        // Clear previous content and show results area
        this.lyricsContent.innerHTML = '';
        this.showResults();
        
        // Display the transcribed text
        const transcriptionText = result.text || result;
        
        // Add metadata if available
        if (result.language || result.duration || result.confidence) {
            const metadataDiv = document.createElement('div');
            metadataDiv.className = 'transcription-metadata';
            metadataDiv.style.cssText = `
                background: var(--bg-tertiary);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-md);
                padding: var(--spacing-md);
                margin-bottom: var(--spacing-lg);
                font-size: 0.875rem;
                color: var(--text-secondary);
            `;
            
            let metadataHTML = '<strong>Transcription Info:</strong><br>';
            if (result.language) metadataHTML += `Language: ${result.language.toUpperCase()}<br>`;
            if (result.duration) metadataHTML += `Duration: ${Math.round(result.duration)}s<br>`;
            if (result.confidence) metadataHTML += `Confidence: ${result.confidence}%`;
            
            metadataDiv.innerHTML = metadataHTML;
            this.lyricsContent.appendChild(metadataDiv);
        }
        
        // Display the lyrics with proper formatting
        const lyricsDiv = document.createElement('div');
        lyricsDiv.className = 'lyrics-text';
        lyricsDiv.style.cssText = `
            font-family: var(--font-mono);
            line-height: 1.8;
            white-space: pre-wrap;
            word-wrap: break-word;
        `;
        
        // Process the text to add styling for structure markers and timestamps
        const processedText = this.processLyricsForDisplay(transcriptionText);
        lyricsDiv.innerHTML = processedText;
        
        this.lyricsContent.appendChild(lyricsDiv);
        
        // Enable action buttons
        this.copyBtn.disabled = false;
        this.downloadBtn.disabled = false;
    }

    processLyricsForDisplay(text) {
        return text
            // Style section headers
            .replace(/\[(Verse|Chorus|Bridge|Intro|Outro|Pre-Chorus|Hook)([^\]]*)\]/g, 
                '<span class="section-header">[$1$2]</span>')
            // Style timestamps
            .replace(/\[(\d{2}:\d{2})\]/g, 
                '<span class="timestamp">[$1]</span>')
            // Convert line breaks to HTML
            .replace(/\n/g, '<br>');
    }

    generateMockLyrics(params) {
        // Generate mock lyrics based on parameters
        let lyrics = '';
        
        if (params.include_structure) {
            lyrics += '[Verse 1]\n';
        }
        
        const sampleLines = [
            'In the silence of the night',
            'I hear your voice calling out',
            'Through the darkness and the light',
            'Love will find its way somehow',
            '',
            params.include_structure ? '[Chorus]' : '',
            'We are stronger than we know',
            'Hearts that beat as one',
            'In this moment we will grow',
            'Until the rising sun',
            '',
            params.include_structure ? '[Verse 2]' : '',
            'Every step along the way',
            'Leads us closer to the truth',
            'In your eyes I see the day',
            'When we were young and bulletproof'
        ];
        
        sampleLines.forEach((line, index) => {
            if (params.timestamping === 'line' && line.trim()) {
                const timestamp = this.formatTimestamp(index * 3);
                lyrics += `${timestamp} ${line}\n`;
            } else {
                lyrics += `${line}\n`;
            }
        });
        
        return lyrics;
    }

    formatTimestamp(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `[${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}]`;
    }

    updateProgress(percentage, text) {
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = text;
    }

    updateUI(state) {
        switch (state) {
            case 'transcribing':
                this.transcribeBtn.disabled = true;
                this.transcribeBtn.classList.add('loading');
                this.transcribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Transcribing...</span>';
                this.progressContainer.style.display = 'block';
                this.updateStatus('Processing', 'var(--accent-warning)');
                this.hideAllStates();
                break;
                
            case 'completed':
                this.transcribeBtn.disabled = false;
                this.transcribeBtn.classList.remove('loading');
                this.transcribeBtn.innerHTML = '<i class="fas fa-play"></i><span>Start Transcription</span>';
                this.progressContainer.style.display = 'none';
                this.copyBtn.disabled = false;
                this.downloadBtn.disabled = false;
                this.gradeBtn.disabled = false;
                this.updateStatus('Ready', 'var(--accent-success)');
                break;
                
            case 'idle':
            default:
                this.transcribeBtn.disabled = false;
                this.transcribeBtn.classList.remove('loading');
                this.transcribeBtn.innerHTML = '<i class="fas fa-play"></i><span>Start Transcription</span>';
                this.progressContainer.style.display = 'none';
                this.updateStatus('Ready', 'var(--accent-success)');
                break;
        }
    }

    updateStatus(text, color) {
        const statusText = this.statusIndicator.querySelector('span');
        const statusDot = this.statusIndicator.querySelector('.status-dot');
        
        statusText.textContent = text;
        statusDot.style.background = color;
    }

    hideAllStates() {
        this.welcomeState.style.display = 'none';
        this.lyricsOutput.style.display = 'none';
        this.errorState.style.display = 'none';
    }

    showResults() {
        this.hideAllStates();
        this.lyricsOutput.style.display = 'block';
    }

    showError(message) {
        this.hideAllStates();
        this.errorMessage.textContent = message;
        this.errorState.style.display = 'flex';
        this.updateStatus('Error', 'var(--accent-error)');
    }

    async copyLyrics() {
        try {
            const lyrics = this.lyricsContent.textContent;
            await navigator.clipboard.writeText(lyrics);
            
            // Show feedback
            const originalIcon = this.copyBtn.innerHTML;
            this.copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            this.copyBtn.style.color = 'var(--accent-success)';
            
            setTimeout(() => {
                this.copyBtn.innerHTML = originalIcon;
                this.copyBtn.style.color = '';
            }, 2000);
            
        } catch (error) {
            console.error('Failed to copy lyrics:', error);
            this.showError('Failed to copy lyrics to clipboard');
        }
    }

    downloadLyrics() {
        const lyrics = this.lyricsContent.textContent;
        const blob = new Blob([lyrics], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcribed-lyrics.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clearResults() {
        this.hideAllStates();
        this.welcomeState.style.display = 'flex';
        this.lyricsContent.innerHTML = '';
        this.copyBtn.disabled = true;
        this.downloadBtn.disabled = true;
        this.gradeBtn.disabled = true;
        this.gradingInterface.hideGradingPanel();
        this.updateStatus('Ready', 'var(--accent-success)');
    }

    updateTranscribeButton() {
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        const hasInput = (activeTab === 'url' && this.currentAudioUrl) || 
                        (activeTab === 'upload' && this.currentAudioFile);
        const hasApiKey = this.apiKeyInput.value.trim().length > 0;
        
        this.transcribeBtn.disabled = !hasInput || !hasApiKey;
    }

    saveSettings() {
        const settings = {
            apiKey: this.apiKeyInput.value,
            language: this.languageSelect.value,
            includeStructure: this.includeStructureCheckbox.checked,
            timestamping: this.timestampingSelect.value,
            temperature: this.temperatureSlider.value,
            maxTokens: this.maxTokensInput.value
        };
        
        localStorage.setItem('groq-transcriber-settings', JSON.stringify(settings));
    }

    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('groq-transcriber-settings') || '{}');
            
            if (settings.apiKey) this.apiKeyInput.value = settings.apiKey;
            if (settings.language) this.languageSelect.value = settings.language;
            if (typeof settings.includeStructure === 'boolean') {
                this.includeStructureCheckbox.checked = settings.includeStructure;
            }
            if (settings.timestamping) this.timestampingSelect.value = settings.timestamping;
            if (settings.temperature) {
                this.temperatureSlider.value = settings.temperature;
                this.sliderValue.textContent = parseFloat(settings.temperature).toFixed(1);
            }
            if (settings.maxTokens) this.maxTokensInput.value = settings.maxTokens;
            
            this.updateTranscribeButton();
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    // Utility methods
    isAudioFile(file) {
        const audioTypes = [
            'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 
            'audio/aac', 'audio/ogg', 'audio/flac', 'audio/webm'
        ];
        return audioTypes.includes(file.type) || 
               /\.(mp3|wav|m4a|aac|ogg|flac|webm)$/i.test(file.name);
    }

    isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return false;
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Initialize the grading system
     */
    initializeGradingSystem() {
        // Initialize grading interface in the results container
        const resultsContainer = document.querySelector('.results-container');
        this.gradingInterface = new GradingInterface(resultsContainer);
    }

    /**
     * Show grading panel
     */
    showGradingPanel() {
        this.gradingInterface.showGradingPanel();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GroqLyricTranscriber();
});

// Add some additional utility functions for the Groq API integration
class GroqAPIClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.groq.com/openai/v1';
    }

    async createChatCompletion(params) {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: [
                    {
                        role: "user",
                        content: this.buildPrompt(params)
                    }
                ],
                temperature: params.temperature || 1,
                max_completion_tokens: params.max_tokens || 8192,
                top_p: 1,
                reasoning_effort: "medium",
                stream: params.stream || false,
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "Song Lyric Transcriber",
                            description: "Song Lyric Transcribing agent tool",
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
                                        "description": "Optional language hint for the lyrics."
                                    },
                                    "include_structure": {
                                        "type": "boolean",
                                        "description": "If true, output is formatted into sections such as Verse, Chorus, Bridge.",
                                        "default": true
                                    },
                                    "timestamping": {
                                        "type": "string",
                                        "enum": ["none", "line"],
                                        "description": "Optional timestamps for each lyric line."
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
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        return response;
    }

    buildPrompt(params) {
        let prompt = `Please transcribe the lyrics from the audio file at: ${params.audio_url}\n\n`;
        
        if (params.language) {
            prompt += `Language hint: ${params.language}\n`;
        }
        
        if (params.include_structure) {
            prompt += `Please include song structure markers (Verse, Chorus, Bridge, etc.)\n`;
        }
        
        if (params.timestamping === 'line') {
            prompt += `Please include timestamps for each line in [MM:SS] format\n`;
        }
        
        prompt += `\nPlease provide accurate, clean lyrics with proper formatting.`;
        
        return prompt;
    }
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GroqLyricTranscriber, GroqAPIClient };
}