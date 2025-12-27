# Groq Lyric Transcriber 🎵

A modern, AI-powered web application for transcribing song lyrics from audio files using Groq's GPT-OSS-120B model. Features a sleek dark interface with real-time streaming transcription and advanced configuration options.

## ✨ Features

### 🎯 Core Functionality
- **Real-time Streaming**: Watch lyrics appear as they're transcribed
- **Dual Input Methods**: Support for both URL input and file upload
- **AI-Powered Accuracy**: Leverages Groq's GPT-OSS-120B model
- **Smart Structure Detection**: Automatically identifies verses, choruses, and bridges
- **Multi-language Support**: Auto-detection and manual language hints
- **Timestamp Integration**: Optional line-by-line timestamps

### 🎨 User Experience
- **Modern Dark Theme**: Professional gradient-based design
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Drag & Drop Upload**: Intuitive file handling
- **Progress Indicators**: Real-time feedback during processing
- **Copy & Download**: Easy export of transcribed lyrics
- **Settings Persistence**: Remembers your preferences

### ⚙️ Advanced Configuration
- **Temperature Control**: Fine-tune AI creativity (0.0 - 2.0)
- **Token Limits**: Configurable response length (1 - 32,768)
- **Language Hints**: Support for 12+ languages
- **Structure Options**: Toggle song section markers
- **Timestamping Modes**: None or line-by-line timestamps

## 🚀 Quick Start

### Prerequisites
- Modern web browser with JavaScript enabled
- Groq API key ([Get one here](https://console.groq.com/))
- Audio files in supported formats (MP3, WAV, M4A, AAC, OGG, FLAC, WebM)

### Installation
1. **Clone or Download** this repository
2. **Open** `index.html` in your web browser
3. **Enter** your Groq API key in the settings panel
4. **Upload** an audio file or provide a URL
5. **Click** "Start Transcription" and watch the magic happen!

### Supported Audio Formats
- **MP3** - Most common format
- **WAV** - Uncompressed audio
- **M4A** - Apple's audio format
- **AAC** - Advanced Audio Coding
- **OGG** - Open-source format
- **FLAC** - Lossless compression
- **WebM** - Web-optimized format

## 🛠️ Technical Architecture

### File Structure
```
groq-lyric-transcriber/
├── index.html              # Main application interface
├── styles.css              # Modern dark theme styling
├── script.js               # Core application logic
├── groq-integration.js     # Advanced Groq API integration
└── README.md              # This documentation
```

### Key Components

#### 1. **GroqLyricTranscriber** (Main Class)
- Handles UI interactions and state management
- Manages file uploads and URL validation
- Coordinates transcription workflow
- Provides real-time progress updates

#### 2. **GroqLyricTranscriptionService** (API Integration)
- Direct integration with Groq's streaming API
- Advanced error handling and retry logic
- Smart prompt engineering for optimal results
- Response processing and formatting

#### 3. **Responsive UI System**
- CSS Grid-based layout for optimal responsiveness
- Custom form controls with dark theme
- Smooth animations and transitions
- Progressive enhancement approach

## 🔧 Configuration Options

### API Settings
```javascript
{
  apiKey: "your-groq-api-key",
  model: "openai/gpt-oss-120b",
  temperature: 1.0,           // Creativity level (0.0-2.0)
  maxTokens: 8192,           // Response length limit
  topP: 1,                   // Nucleus sampling
  reasoningEffort: "medium"   // Processing intensity
}
```

### Transcription Parameters
```javascript
{
  audio_url: "https://example.com/song.mp3",
  language: "en",            // Optional language hint
  include_structure: true,   // Add [Verse], [Chorus] markers
  timestamping: "line"       // "none" or "line"
}
```

### Language Support
- **English** (en) - Default
- **Spanish** (es)
- **French** (fr)
- **German** (de)
- **Italian** (it)
- **Portuguese** (pt)
- **Japanese** (ja)
- **Korean** (ko)
- **Chinese** (zh)
- **Russian** (ru)
- **Arabic** (ar)
- **Hindi** (hi)

## 🎵 Usage Examples

### Basic Transcription
1. Enter your Groq API key
2. Upload an audio file or paste a URL
3. Click "Start Transcription"
4. Watch real-time streaming results

### Advanced Configuration
1. Set language hint for better accuracy
2. Enable structure detection for organized output
3. Add timestamps for karaoke-style display
4. Adjust temperature for creative vs. literal transcription

### Sample Output (with structure)
```
[Verse 1]
In the silence of the night
I hear your voice calling out
Through the darkness and the light
Love will find its way somehow

[Chorus]
We are stronger than we know
Hearts that beat as one
In this moment we will grow
Until the rising sun
```

### Sample Output (with timestamps)
```
[00:15] In the silence of the night
[00:18] I hear your voice calling out
[00:22] Through the darkness and the light
[00:25] Love will find its way somehow
```

## 🔒 Security & Privacy

### Data Handling
- **No Server Storage**: All processing happens client-side
- **Secure API Calls**: Direct HTTPS communication with Groq
- **Local Settings**: Preferences stored in browser localStorage
- **No Audio Upload**: Files processed via URL references only

### API Key Security
- Keys stored locally in browser only
- Toggle visibility for secure entry
- No transmission except to Groq's official API
- Clear instructions for key management

## 🐛 Troubleshooting

### Common Issues

#### "API request failed"
- **Check API Key**: Ensure your Groq API key is valid
- **Verify Permissions**: Confirm API key has transcription access
- **Network Issues**: Check internet connection

#### "Audio file not accessible"
- **URL Validation**: Ensure audio URL is publicly accessible
- **CORS Issues**: Some servers block cross-origin requests
- **File Format**: Verify audio format is supported

#### "Transcription incomplete"
- **File Length**: Very long files may hit token limits
- **Audio Quality**: Poor quality may affect accuracy
- **Language Detection**: Try setting manual language hint

### Performance Tips
- **Optimal File Size**: 5-50MB for best performance
- **Clear Audio**: Minimize background noise
- **Stable Connection**: Ensure reliable internet for streaming
- **Browser Compatibility**: Use modern browsers (Chrome, Firefox, Safari, Edge)

## 🚀 Advanced Features

### Custom Prompting
The system uses sophisticated prompt engineering to optimize transcription quality:

```javascript
// System prompt includes:
- Audio analysis expertise
- Language detection capabilities
- Structure recognition training
- Quality assurance protocols
- Artistic preservation guidelines
```

### Streaming Architecture
Real-time transcription display using Server-Sent Events:

```javascript
// Streaming workflow:
1. Establish connection to Groq API
2. Process audio in chunks
3. Stream partial results to UI
4. Update progress indicators
5. Finalize complete transcription
```

### Error Recovery
Robust error handling with automatic retry:

```javascript
// Retry logic:
- Exponential backoff (1s, 2s, 4s)
- Maximum 3 attempts
- Detailed error reporting
- Graceful degradation
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add comments for complex functionality
- Test across multiple browsers
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for providing the powerful GPT-OSS-120B model
- **Font Awesome** for the beautiful icons
- **Google Fonts** for Inter and JetBrains Mono typefaces
- **Open Source Community** for inspiration and best practices

## 📞 Support

Need help? Here are your options:

- **Documentation**: Check this README for detailed information
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions
- **API Support**: Contact Groq for API-related questions

---

**Made with ❤️ for the music community**

Transform your audio into text with the power of AI. Start transcribing today! 🎵✨