let speech = new SpeechSynthesisUtterance(); // Create a new speech synthesis instance
let voices = []; // Array to hold available voices
let voiceSelect = document.getElementById('select'); // Get the select element

// Speech-to-Text variables
let recognition;
let isRecognizing = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    // Check if the SpeechRecognition API is available in the browser
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US'; // Default language (can be changed)
    recognition.interimResults = false; // Don't show partial results
    recognition.maxAlternatives = 1; // Limit results to 1
    
    recognition.onstart = () => {
        console.log("Speech recognition started");
        isRecognizing = true;
    };

    recognition.onend = () => {
        console.log("Speech recognition ended");
        isRecognizing = false;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('text').value = transcript; // Display recognized text in textarea
    };
}

// Listen for changes to voices
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices(); // Get available voices

    // Clear existing options in the select dropdown
    voiceSelect.innerHTML = "";

    // Populate the select dropdown with available voices and languages
    voices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`; // Display name and language
        option.value = i; // Set option value to voice index
        voiceSelect.appendChild(option);
    });

    // Set default voice to the first voice in the list
    speech.voice = voices[0];

    // Update speech voice when user selects a new voice
    voiceSelect.addEventListener('change', () => {
        speech.voice = voices[voiceSelect.value];
    });
};

// Listen for the play button click to play the text-to-speech
document.getElementById('button').addEventListener('click', () => {
    speech.text = document.getElementById('text').value; // Get text from the textarea
    window.speechSynthesis.speak(speech); // Speak the text using SpeechSynthesis
});

// Listen for the mic button click to start speech-to-text
document.getElementById('mic-button').addEventListener('click', () => {
    if (isRecognizing) {
        recognition.stop(); // Stop recognition if it's already active
    } else {
        recognition.start(); // Start speech recognition
    }
});
