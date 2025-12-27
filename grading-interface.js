/**
 * Song Grading Interface & Feedback System
 * Provides UI components for displaying analysis results and feedback
 */

class GradingInterface {
    constructor(containerElement) {
        this.container = containerElement;
        this.analysisEngine = new SongAnalysisEngine();
        this.sunoGenerator = new SunoRemixGenerator();
        this.currentAnalysis = null;
        this.currentGenerationJob = null;
        
        this.initializeInterface();
    }

    /**
     * Initialize the grading interface
     */
    initializeInterface() {
        this.createGradingPanel();
        this.bindEvents();
    }

    /**
     * Create the main grading panel
     */
    createGradingPanel() {
        const gradingHTML = `
            <div class="grading-overlay" id="gradingOverlay" style="display: none;"></div>
            <div class="grading-panel" id="gradingPanel" style="display: none;">
                <div class="grading-header">
                    <h3><i class="fas fa-graduation-cap"></i> Song Analysis & Grade</h3>
                    <div class="grading-actions">
                        <button class="action-btn" id="analyzeBtn">
                            <i class="fas fa-search"></i>
                        </button>
                        <button class="action-btn" id="generateBetterBtn" disabled title="Generate Better Version with Suno AI">
                            <i class="fas fa-magic"></i>
                        </button>
                        <button class="action-btn" id="exportAnalysisBtn" disabled>
                            <i class="fas fa-file-export"></i>
                        </button>
                        <button class="action-btn" id="closeGradingBtn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div class="grading-content">
                    <!-- Grade Display -->
                    <div class="grade-display" id="gradeDisplay">
                        <div class="grade-circle">
                            <div class="grade-letter" id="gradeLetter">?</div>
                            <div class="grade-score" id="gradeScore">--</div>
                        </div>
                        <div class="grade-description" id="gradeDescription">
                            Click "Analyze" to grade your lyrics
                        </div>
                    </div>

                    <!-- Analysis Breakdown -->
                    <div class="analysis-breakdown" id="analysisBreakdown" style="display: none;">
                        <h4>Detailed Breakdown</h4>
                        <div class="breakdown-grid">
                            <div class="breakdown-item">
                                <span class="breakdown-label">Lyrical Content</span>
                                <div class="breakdown-bar">
                                    <div class="breakdown-fill" id="contentFill"></div>
                                    <span class="breakdown-score" id="contentScore">--</span>
                                </div>
                            </div>
                            <div class="breakdown-item">
                                <span class="breakdown-label">Structure</span>
                                <div class="breakdown-bar">
                                    <div class="breakdown-fill" id="structureFill"></div>
                                    <span class="breakdown-score" id="structureScore">--</span>
                                </div>
                            </div>
                            <div class="breakdown-item">
                                <span class="breakdown-label">Rhyme Scheme</span>
                                <div class="breakdown-bar">
                                    <div class="breakdown-fill" id="rhymeFill"></div>
                                    <span class="breakdown-score" id="rhymeScore">--</span>
                                </div>
                            </div>
                            <div class="breakdown-item">
                                <span class="breakdown-label">Wordplay</span>
                                <div class="breakdown-bar">
                                    <div class="breakdown-fill" id="wordplayFill"></div>
                                    <span class="breakdown-score" id="wordplayScore">--</span>
                                </div>
                            </div>
                            <div class="breakdown-item">
                                <span class="breakdown-label">Emotion</span>
                                <div class="breakdown-bar">
                                    <div class="breakdown-fill" id="emotionFill"></div>
                                    <span class="breakdown-score" id="emotionScore">--</span>
                                </div>
                            </div>
                            <div class="breakdown-item">
                                <span class="breakdown-label">Technical</span>
                                <div class="breakdown-bar">
                                    <div class="breakdown-fill" id="technicalFill"></div>
                                    <span class="breakdown-score" id="technicalScore">--</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Feedback Tabs -->
                    <div class="feedback-tabs" id="feedbackTabs" style="display: none;">
                        <div class="tab-buttons">
                            <button class="tab-btn active" data-tab="feedback">Feedback</button>
                            <button class="tab-btn" data-tab="issues">Specific Issues</button>
                            <button class="tab-btn" data-tab="linebyline">Line Analysis</button>
                            <button class="tab-btn" data-tab="improvements">Roadmap to A+</button>
                            <button class="tab-btn" data-tab="strengths">Strengths</button>
                        </div>

                        <div class="tab-content active" id="feedback-tab">
                            <div class="feedback-section">
                                <h5>Overall Assessment</h5>
                                <p class="feedback-text" id="overallFeedback">--</p>
                                
                                <div class="detailed-feedback" id="detailedFeedback">
                                    <!-- Detailed feedback will be populated here -->
                                </div>
                            </div>
                        </div>

                        <div class="tab-content" id="issues-tab">
                            <div class="issues-section">
                                <h5><i class="fas fa-exclamation-triangle"></i> Specific Issues Found</h5>
                                <div class="issues-list" id="issuesList">
                                    <!-- Specific issues will be populated here -->
                                </div>
                            </div>
                        </div>

                        <div class="tab-content" id="linebyline-tab">
                            <div class="linebyline-section">
                                <h5><i class="fas fa-align-left"></i> Line-by-Line Analysis</h5>
                                <div class="linebyline-container" id="linebylineContainer">
                                    <!-- Line analysis will be populated here -->
                                </div>
                            </div>
                        </div>

                        <div class="tab-content" id="improvements-tab">
                            <div class="improvements-section">
                                <h5><i class="fas fa-arrow-up"></i> Your Roadmap to A+</h5>
                                <div class="improvements-list" id="improvementsList">
                                    <!-- Improvements will be populated here -->
                                </div>
                            </div>
                        </div>

                        <div class="tab-content" id="strengths-tab">
                            <div class="strengths-section">
                                <div class="strengths-weaknesses">
                                    <div class="strengths-column">
                                        <h5><i class="fas fa-thumbs-up"></i> What's Working</h5>
                                        <ul class="strengths-list" id="strengthsList">
                                            <!-- Strengths will be populated here -->
                                        </ul>
                                    </div>
                                    <div class="weaknesses-column">
                                        <h5><i class="fas fa-thumbs-down"></i> Major Weaknesses</h5>
                                        <ul class="weaknesses-list" id="weaknessesList">
                                            <!-- Weaknesses will be populated here -->
                                        </ul>
                                    </div>
                                </div>
                                
                                <div class="metadata-section">
                                    <h5><i class="fas fa-chart-bar"></i> Song Statistics</h5>
                                    <div class="metadata-grid" id="metadataGrid">
                                        <!-- Metadata will be populated here -->
                                    </div>
                                </div>

                                <!-- Suno AI Generation Section -->
                                <div class="suno-section">
                                    <h5><i class="fas fa-magic"></i> Generate Better Version</h5>
                                    <div class="suno-config" id="sunoConfig">
                                        <div class="suno-api-key">
                                            <label for="sunoApiKey">Suno API Key (Optional)</label>
                                            <div class="input-wrapper">
                                                <input type="password" id="sunoApiKey" placeholder="Enter Suno API key for AI generation" />
                                                <button class="toggle-visibility" id="toggleSunoKey">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </div>
                                            <div class="suno-info">
                                                <a href="https://suno.com/api" target="_blank" class="api-key-link">
                                                    <i class="fas fa-external-link-alt"></i>
                                                    Get Suno API access
                                                </a>
                                            </div>
                                        </div>
                                        
                                        <div class="generation-options" id="generationOptions" style="display: none;">
                                            <div class="option-group">
                                                <label for="remixStyle">Style Override</label>
                                                <select id="remixStyle">
                                                    <option value="auto">Auto-select based on analysis</option>
                                                    <option value="modern-hip-hop">Modern Hip-Hop</option>
                                                    <option value="aggressive-hip-hop">Aggressive Hip-Hop</option>
                                                    <option value="contemporary-pop">Contemporary Pop</option>
                                                    <option value="emotional-ballad">Emotional Ballad</option>
                                                    <option value="dance-pop">Dance Pop</option>
                                                    <option value="alternative-rock">Alternative Rock</option>
                                                </select>
                                            </div>
                                            
                                            <div class="option-group">
                                                <label for="remixPersona">Vocal Style</label>
                                                <select id="remixPersona">
                                                    <option value="auto">Auto-select based on analysis</option>
                                                    <option value="confident_male_rapper">Confident Male Rapper</option>
                                                    <option value="smooth_male_rapper">Smooth Male Rapper</option>
                                                    <option value="soulful_female_singer">Soulful Female Singer</option>
                                                    <option value="emotional_singer">Emotional Singer</option>
                                                    <option value="energetic_singer">Energetic Singer</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <button class="generate-btn" id="generateBtn" disabled>
                                            <i class="fas fa-magic"></i>
                                            Generate Improved Version
                                        </button>
                                        
                                        <div class="generation-status" id="generationStatus" style="display: none;">
                                            <div class="status-content">
                                                <div class="loading-spinner"></div>
                                                <p id="statusText">Generating improved version...</p>
                                            </div>
                                        </div>
                                        
                                        <div class="generation-result" id="generationResult" style="display: none;">
                                            <h6>✨ Improved Version Generated!</h6>
                                            <div class="result-info" id="resultInfo">
                                                <!-- Generation results will be populated here -->
                                            </div>
                                            <div class="result-actions">
                                                <button class="download-result-btn" id="downloadResultBtn">
                                                    <i class="fas fa-download"></i>
                                                    Download
                                                </button>
                                                <button class="play-result-btn" id="playResultBtn">
                                                    <i class="fas fa-play"></i>
                                                    Play
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Analysis Loading -->
                    <div class="analysis-loading" id="analysisLoading" style="display: none;">
                        <div class="loading-spinner"></div>
                        <p>Analyzing your lyrics...</p>
                    </div>
                </div>
            </div>
        `;

        this.container.insertAdjacentHTML('beforeend', gradingHTML);
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Analyze button
        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.performAnalysis();
        });

        // Generate better version button
        document.getElementById('generateBetterBtn').addEventListener('click', () => {
            this.showSunoSection();
        });

        // Export analysis button
        document.getElementById('exportAnalysisBtn').addEventListener('click', () => {
            this.exportAnalysis();
        });

        // Close grading panel
        document.getElementById('closeGradingBtn').addEventListener('click', () => {
            this.hideGradingPanel();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // Suno API key toggle
        document.getElementById('toggleSunoKey').addEventListener('click', () => {
            this.toggleSunoKeyVisibility();
        });

        // Suno API key input
        document.getElementById('sunoApiKey').addEventListener('input', () => {
            this.handleSunoKeyInput();
        });

        // Generate button
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateImprovedVersion();
        });

        // Close overlay when clicked
        document.addEventListener('click', (e) => {
            if (e.target.id === 'gradingOverlay') {
                this.hideGradingPanel();
            }
        });
    }

    /**
     * Show the grading panel
     */
    showGradingPanel() {
        document.getElementById('gradingOverlay').style.display = 'block';
        document.getElementById('gradingPanel').style.display = 'block';
    }

    /**
     * Hide the grading panel
     */
    hideGradingPanel() {
        document.getElementById('gradingOverlay').style.display = 'none';
        document.getElementById('gradingPanel').style.display = 'none';
    }

    /**
     * Perform analysis on current lyrics
     */
    async performAnalysis() {
        const lyricsContent = document.getElementById('lyricsContent');
        
        if (!lyricsContent || !lyricsContent.textContent.trim()) {
            this.showError('No lyrics to analyze. Please transcribe some lyrics first.');
            return;
        }

        const lyrics = lyricsContent.textContent.trim();
        
        try {
            this.showAnalysisLoading(true);
            
            // Simulate analysis delay for better UX
            await this.delay(1500);
            
            // Perform the actual analysis
            this.currentAnalysis = this.analysisEngine.analyzeSong(lyrics);
            
            // Display results
            this.displayAnalysisResults(this.currentAnalysis);
            
            this.showAnalysisLoading(false);
            document.getElementById('exportAnalysisBtn').disabled = false;
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.showError('Analysis failed. Please try again.');
            this.showAnalysisLoading(false);
        }
    }

    /**
     * Display analysis results in the interface
     */
    displayAnalysisResults(analysis) {
        // Update grade display
        this.updateGradeDisplay(analysis.grade, analysis.overallScore);
        
        // Update breakdown
        this.updateBreakdown(analysis.breakdown);
        
        // Update feedback
        this.updateFeedback(analysis.feedback);
        
        // Update specific issues
        this.updateSpecificIssues(analysis.feedback.specificIssues || []);
        
        // Update line-by-line analysis
        this.updateLineByLineAnalysis(analysis.feedback.lineByLineBreakdown || []);
        
        // Update improvements
        this.updateImprovements(analysis.improvements);
        
        // Update strengths and weaknesses
        this.updateStrengthsWeaknesses(analysis.strengths, analysis.weaknesses);
        
        // Update metadata
        this.updateMetadata(analysis.metadata);
        
        // Show analysis sections
        document.getElementById('analysisBreakdown').style.display = 'block';
        document.getElementById('feedbackTabs').style.display = 'block';
    }

    /**
     * Update grade display
     */
    updateGradeDisplay(grade, score) {
        const gradeLetter = document.getElementById('gradeLetter');
        const gradeScore = document.getElementById('gradeScore');
        const gradeDescription = document.getElementById('gradeDescription');
        const gradeCircle = document.querySelector('.grade-circle');
        
        gradeLetter.textContent = grade;
        gradeScore.textContent = `${score.toFixed(1)}%`;
        
        // Set grade color
        gradeCircle.className = `grade-circle grade-${this.getGradeClass(grade)}`;
        
        // Set description
        gradeDescription.textContent = this.getGradeDescription(grade, score);
    }

    /**
     * Update breakdown bars
     */
    updateBreakdown(breakdown) {
        // Check if this is rap analysis
        const isRap = breakdown.hasOwnProperty('flow');
        
        let categories, breakdownKeys, labels;
        
        if (isRap) {
            categories = ['content', 'flow', 'rhyme', 'wordplay', 'technical', 'authenticity'];
            breakdownKeys = ['lyricalContent', 'flow', 'rhymeScheme', 'wordplay', 'technical', 'authenticity'];
            labels = ['Lyrical Content', 'Flow & Rhythm', 'Rhyme Scheme', 'Wordplay', 'Technical', 'Authenticity'];
        } else {
            categories = ['content', 'structure', 'rhyme', 'wordplay', 'emotion', 'technical'];
            breakdownKeys = ['lyricalContent', 'structure', 'rhymeScheme', 'wordplay', 'emotion', 'technical'];
            labels = ['Lyrical Content', 'Structure', 'Rhyme Scheme', 'Wordplay', 'Emotion', 'Technical'];
        }
        
        // Update the breakdown grid HTML for rap vs general
        this.updateBreakdownGrid(categories, breakdownKeys, labels, breakdown);
    }

    /**
     * Update breakdown grid with appropriate categories
     */
    updateBreakdownGrid(categories, breakdownKeys, labels, breakdown) {
        const breakdownGrid = document.querySelector('.breakdown-grid');
        breakdownGrid.innerHTML = '';
        
        categories.forEach((category, index) => {
            const value = breakdown[breakdownKeys[index]] || 0;
            
            const breakdownItem = document.createElement('div');
            breakdownItem.className = 'breakdown-item';
            breakdownItem.innerHTML = `
                <span class="breakdown-label">${labels[index]}</span>
                <div class="breakdown-bar">
                    <div class="breakdown-fill ${this.getScoreClass(value)}" style="width: ${value}%"></div>
                    <span class="breakdown-score">${value.toFixed(0)}%</span>
                </div>
            `;
            
            breakdownGrid.appendChild(breakdownItem);
        });
    }

    /**
     * Update feedback section with enhanced detailed feedback
     */
    updateFeedback(feedback) {
        document.getElementById('overallFeedback').textContent = feedback.overall;
        
        const detailedFeedback = document.getElementById('detailedFeedback');
        detailedFeedback.innerHTML = '';
        
        const categories = [
            { key: 'lyricalContent', label: 'Lyrical Content', icon: 'fas fa-pen-fancy' },
            { key: 'structure', label: 'Structure', icon: 'fas fa-sitemap' },
            { key: 'rhymeScheme', label: 'Rhyme Scheme', icon: 'fas fa-music' },
            { key: 'wordplay', label: 'Wordplay', icon: 'fas fa-magic' },
            { key: 'emotion', label: 'Emotion', icon: 'fas fa-heart' },
            { key: 'technical', label: 'Technical', icon: 'fas fa-cogs' }
        ];
        
        categories.forEach(category => {
            const categoryFeedback = feedback[category.key];
            if (typeof categoryFeedback === 'object') {
                // Enhanced feedback with issues and examples
                const feedbackItem = document.createElement('div');
                feedbackItem.className = 'feedback-item enhanced';
                
                const issuesHTML = categoryFeedback.issues && categoryFeedback.issues.length > 0 ? 
                    `<div class="feedback-issues">
                        <strong>❌ Issues:</strong>
                        <ul>${categoryFeedback.issues.map(issue => `<li>${issue}</li>`).join('')}</ul>
                    </div>` : '';
                
                const examplesHTML = categoryFeedback.examples && categoryFeedback.examples.length > 0 ? 
                    `<div class="feedback-examples">
                        <strong>💡 How to Fix:</strong>
                        <ul>${categoryFeedback.examples.map(example => `<li>${example}</li>`).join('')}</ul>
                    </div>` : '';
                
                feedbackItem.innerHTML = `
                    <div class="feedback-header">
                        <h6><i class="${category.icon}"></i> ${category.label}</h6>
                        <span class="feedback-score ${this.getScoreClass(categoryFeedback.score)}">${categoryFeedback.score.toFixed(0)}%</span>
                    </div>
                    <div class="feedback-summary">${categoryFeedback.summary}</div>
                    ${issuesHTML}
                    ${examplesHTML}
                `;
                detailedFeedback.appendChild(feedbackItem);
            } else {
                // Fallback for simple string feedback
                const feedbackItem = document.createElement('div');
                feedbackItem.className = 'feedback-item';
                feedbackItem.innerHTML = `
                    <h6><i class="${category.icon}"></i> ${category.label}</h6>
                    <p>${categoryFeedback}</p>
                `;
                detailedFeedback.appendChild(feedbackItem);
            }
        });
    }

    /**
     * Update specific issues section
     */
    updateSpecificIssues(issues) {
        const issuesList = document.getElementById('issuesList');
        issuesList.innerHTML = '';
        
        if (!issues || issues.length === 0) {
            issuesList.innerHTML = '<div class="no-issues">🎉 No major issues detected! Your lyrics are in good shape.</div>';
            return;
        }
        
        issues.forEach(issue => {
            const issueItem = document.createElement('div');
            issueItem.className = `issue-item severity-${issue.severity.toLowerCase()}`;
            
            const examplesHTML = issue.examples && issue.examples.length > 0 ? 
                `<div class="issue-examples">
                    <strong>Examples found:</strong>
                    <ul>${issue.examples.map(ex => `<li><strong>Line ${ex.line}:</strong> "${ex.text}" - ${ex.suggestion || ex.issue}</li>`).join('')}</ul>
                </div>` : '';
            
            issueItem.innerHTML = `
                <div class="issue-header">
                    <span class="issue-type">${issue.type}</span>
                    <span class="issue-severity severity-${issue.severity.toLowerCase()}">${issue.severity}</span>
                    <span class="issue-count">${issue.count} found</span>
                </div>
                <div class="issue-fix">
                    <strong>How to fix:</strong> ${issue.fix}
                </div>
                ${examplesHTML}
            `;
            
            issuesList.appendChild(issueItem);
        });
    }

    /**
     * Update line-by-line analysis section
     */
    updateLineByLineAnalysis(lineAnalysis) {
        const container = document.getElementById('linebylineContainer');
        container.innerHTML = '';
        
        if (!lineAnalysis || lineAnalysis.length === 0) {
            container.innerHTML = '<div class="no-analysis">No line analysis available.</div>';
            return;
        }
        
        lineAnalysis.forEach(line => {
            const lineItem = document.createElement('div');
            lineItem.className = `line-item score-${this.getScoreClass(line.score)}`;
            
            const issuesHTML = line.issues && line.issues.length > 0 ? 
                `<div class="line-issues">
                    <strong>Issues:</strong>
                    <ul>${line.issues.map(issue => `<li>${issue}</li>`).join('')}</ul>
                </div>` : '';
            
            const suggestionsHTML = line.suggestions && line.suggestions.length > 0 ? 
                `<div class="line-suggestions">
                    <strong>Suggestions:</strong>
                    <ul>${line.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}</ul>
                </div>` : '';
            
            const strengthsHTML = line.strengths && line.strengths.length > 0 ? 
                `<div class="line-strengths">
                    <strong>Strengths:</strong>
                    <ul>${line.strengths.map(strength => `<li>${strength}</li>`).join('')}</ul>
                </div>` : '';
            
            lineItem.innerHTML = `
                <div class="line-header">
                    <span class="line-number">Line ${line.lineNumber}</span>
                    <span class="line-score ${this.getScoreClass(line.score)}">${line.score}/100</span>
                </div>
                <div class="line-text">"${line.text}"</div>
                ${issuesHTML}
                ${suggestionsHTML}
                ${strengthsHTML}
            `;
            
            container.appendChild(lineItem);
        });
    }

    /**
     * Update improvements section
     */
    updateImprovements(improvements) {
        const improvementsList = document.getElementById('improvementsList');
        improvementsList.innerHTML = '';
        
        improvements.forEach(improvement => {
            const improvementItem = document.createElement('div');
            improvementItem.className = `improvement-item priority-${improvement.priority.toLowerCase()}`;
            
            const examplesHTML = improvement.examples ? 
                `<div class="improvement-examples">
                    <strong>Examples:</strong>
                    <ul>${improvement.examples.map(ex => `<li>${ex}</li>`).join('')}</ul>
                </div>` : '';
            
            improvementItem.innerHTML = `
                <div class="improvement-header">
                    <span class="improvement-category">${improvement.category}</span>
                    <span class="improvement-priority priority-${improvement.priority.toLowerCase()}">${improvement.priority}</span>
                </div>
                <div class="improvement-issue">
                    <strong>Issue:</strong> ${improvement.issue}
                </div>
                <div class="improvement-suggestion">
                    <strong>Suggestion:</strong> ${improvement.suggestion}
                </div>
                ${examplesHTML}
            `;
            
            improvementsList.appendChild(improvementItem);
        });
    }

    /**
     * Update strengths and weaknesses
     */
    updateStrengthsWeaknesses(strengths, weaknesses) {
        const strengthsList = document.getElementById('strengthsList');
        const weaknessesList = document.getElementById('weaknessesList');
        
        strengthsList.innerHTML = '';
        weaknessesList.innerHTML = '';
        
        strengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            strengthsList.appendChild(li);
        });
        
        weaknesses.forEach(weakness => {
            const li = document.createElement('li');
            li.textContent = weakness;
            weaknessesList.appendChild(li);
        });
    }

    /**
     * Update metadata section
     */
    updateMetadata(metadata) {
        const metadataGrid = document.getElementById('metadataGrid');
        metadataGrid.innerHTML = '';
        
        const metadataItems = [
            { label: 'Word Count', value: metadata.wordCount },
            { label: 'Unique Words', value: metadata.uniqueWords },
            { label: 'Avg Line Length', value: metadata.averageLineLength?.toFixed(1) },
            { label: 'Structure Detected', value: metadata.structureDetected ? 'Yes' : 'No' },
            { label: 'Rhyme Pattern', value: metadata.rhymeSchemePattern || 'None detected' }
        ];
        
        metadataItems.forEach(item => {
            const metadataItem = document.createElement('div');
            metadataItem.className = 'metadata-item';
            metadataItem.innerHTML = `
                <span class="metadata-label">${item.label}</span>
                <span class="metadata-value">${item.value}</span>
            `;
            metadataGrid.appendChild(metadataItem);
        });
    }

    /**
     * Switch between feedback tabs
     */
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
    }

    /**
     * Show/hide analysis loading
     */
    showAnalysisLoading(show) {
        const loading = document.getElementById('analysisLoading');
        const breakdown = document.getElementById('analysisBreakdown');
        const tabs = document.getElementById('feedbackTabs');
        
        if (show) {
            loading.style.display = 'block';
            breakdown.style.display = 'none';
            tabs.style.display = 'none';
        } else {
            loading.style.display = 'none';
        }
    }

    /**
     * Export analysis results
     */
    exportAnalysis() {
        if (!this.currentAnalysis) {
            this.showError('No analysis to export. Please analyze lyrics first.');
            return;
        }
        
        const exportData = {
            timestamp: new Date().toISOString(),
            grade: this.currentAnalysis.grade,
            score: this.currentAnalysis.overallScore,
            breakdown: this.currentAnalysis.breakdown,
            feedback: this.currentAnalysis.feedback,
            improvements: this.currentAnalysis.improvements,
            strengths: this.currentAnalysis.strengths,
            weaknesses: this.currentAnalysis.weaknesses,
            metadata: this.currentAnalysis.metadata
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `song-analysis-${this.currentAnalysis.grade}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Show error message
     */
    showError(message) {
        // You can integrate this with your existing error handling system
        alert(message);
    }

    /**
     * Helper methods
     */
    getGradeClass(grade) {
        if (grade === 'A+' || grade === 'A') return 'excellent';
        if (grade.startsWith('A') || grade.startsWith('B')) return 'good';
        if (grade.startsWith('C')) return 'average';
        return 'poor';
    }

    getScoreClass(score) {
        if (score >= 90) return 'excellent';
        if (score >= 80) return 'good';
        if (score >= 70) return 'average';
        return 'poor';
    }

    getGradeDescription(grade, score) {
        const descriptions = {
            'A+': 'Exceptional! Professional-level songwriting.',
            'A': 'Excellent work with minor areas for improvement.',
            'A-': 'Very good, close to excellence.',
            'B+': 'Good songwriting with room for growth.',
            'B': 'Solid foundation, needs refinement.',
            'B-': 'Decent work, several areas need attention.',
            'C+': 'Average, significant improvements needed.',
            'C': 'Below average, major revisions required.',
            'C-': 'Poor quality, extensive work needed.',
            'D+': 'Very poor, fundamental issues.',
            'D': 'Failing, complete rewrite recommended.',
            'F': 'Unacceptable quality.'
        };
        
        return descriptions[grade] || 'Grade not recognized.';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Show Suno generation section
     */
    showSunoSection() {
        // Switch to strengths tab where Suno section is located
        this.switchTab('strengths');
        
        // Scroll to Suno section
        const sunoSection = document.querySelector('.suno-section');
        if (sunoSection) {
            sunoSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Toggle Suno API key visibility
     */
    toggleSunoKeyVisibility() {
        const keyInput = document.getElementById('sunoApiKey');
        const toggleBtn = document.getElementById('toggleSunoKey');
        const icon = toggleBtn.querySelector('i');
        
        if (keyInput.type === 'password') {
            keyInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            keyInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    /**
     * Handle Suno API key input
     */
    handleSunoKeyInput() {
        const apiKey = document.getElementById('sunoApiKey').value.trim();
        const generateBtn = document.getElementById('generateBtn');
        const generationOptions = document.getElementById('generationOptions');
        
        if (apiKey) {
            this.sunoGenerator.configure(apiKey);
            generateBtn.disabled = false;
            generationOptions.style.display = 'block';
        } else {
            generateBtn.disabled = true;
            generationOptions.style.display = 'none';
        }
    }

    /**
     * Generate improved version using Suno AI
     */
    async generateImprovedVersion() {
        if (!this.currentAnalysis) {
            this.showError('No analysis available. Please analyze lyrics first.');
            return;
        }

        try {
            this.showGenerationStatus(true, 'Generating improved version...');
            
            const lyrics = this.currentAnalysis.originalLyrics || '';
            const style = document.getElementById('remixStyle').value;
            const persona = document.getElementById('remixPersona').value;
            
            // Override auto-selections if user specified
            if (style !== 'auto') {
                this.currentAnalysis.overrideStyle = style;
            }
            if (persona !== 'auto') {
                this.currentAnalysis.overridePersona = persona;
            }
            
            const result = await this.sunoGenerator.generateImprovedVersion(
                lyrics, 
                this.currentAnalysis
            );
            
            if (result.success) {
                this.currentGenerationJob = result;
                this.showGenerationStatus(true, 'Processing... This may take 2-3 minutes');
                
                // Poll for completion
                this.pollGenerationStatus(result.jobId);
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            console.error('Generation error:', error);
            this.showGenerationStatus(false);
            this.showError(`Generation failed: ${error.message}`);
        }
    }

    /**
     * Poll generation status
     */
    async pollGenerationStatus(jobId) {
        const maxAttempts = 60; // 5 minutes max
        let attempts = 0;
        
        const poll = async () => {
            try {
                attempts++;
                const status = await this.sunoGenerator.checkStatus(jobId);
                
                if (status.status === 'completed') {
                    this.showGenerationResult(status);
                } else if (status.status === 'failed') {
                    throw new Error(status.error || 'Generation failed');
                } else if (attempts < maxAttempts) {
                    // Update status message
                    const progress = Math.min(90, (attempts / maxAttempts) * 100);
                    this.showGenerationStatus(true, `Processing... ${progress.toFixed(0)}% complete`);
                    
                    // Continue polling
                    setTimeout(poll, 5000); // Poll every 5 seconds
                } else {
                    throw new Error('Generation timeout - please try again');
                }
            } catch (error) {
                this.showGenerationStatus(false);
                this.showError(`Generation failed: ${error.message}`);
            }
        };
        
        poll();
    }

    /**
     * Show generation status
     */
    showGenerationStatus(show, message = '') {
        const statusDiv = document.getElementById('generationStatus');
        const statusText = document.getElementById('statusText');
        const generateBtn = document.getElementById('generateBtn');
        
        if (show) {
            statusDiv.style.display = 'block';
            statusText.textContent = message;
            generateBtn.disabled = true;
        } else {
            statusDiv.style.display = 'none';
            generateBtn.disabled = false;
        }
    }

    /**
     * Show generation result
     */
    showGenerationResult(result) {
        this.showGenerationStatus(false);
        
        const resultDiv = document.getElementById('generationResult');
        const resultInfo = document.getElementById('resultInfo');
        
        // Display result information
        const improvements = this.currentGenerationJob.improvements || [];
        const improvementsHTML = improvements.map(imp => `<div class="improvement-item">${imp}</div>`).join('');
        
        resultInfo.innerHTML = `
            <div class="result-details">
                <div class="result-meta">
                    <strong>Style:</strong> ${this.currentGenerationJob.style}<br>
                    <strong>Persona:</strong> ${this.currentGenerationJob.persona}<br>
                    <strong>Prompt:</strong> ${this.currentGenerationJob.remixPrompt}
                </div>
                <div class="improvements-applied">
                    <strong>Improvements Applied:</strong>
                    ${improvementsHTML}
                </div>
                <div class="result-audio">
                    <audio controls style="width: 100%; margin-top: 1rem;">
                        <source src="${result.audio_url}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </div>
        `;
        
        resultDiv.style.display = 'block';
        
        // Update download and play buttons
        const downloadBtn = document.getElementById('downloadResultBtn');
        const playBtn = document.getElementById('playResultBtn');
        
        downloadBtn.onclick = () => this.downloadResult(result.audio_url);
        playBtn.onclick = () => this.playResult(result.audio_url);
    }

    /**
     * Download generated result
     */
    downloadResult(audioUrl) {
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = `improved-version-${Date.now()}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    /**
     * Play generated result
     */
    playResult(audioUrl) {
        const audio = document.querySelector('#generationResult audio');
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.GradingInterface = GradingInterface;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GradingInterface;
}