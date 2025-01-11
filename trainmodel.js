const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse form data

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Step 1: Preprocess Data
function preprocessData(messages) {
    const vocabSet = new Set();
    const tokenizedMessages = [];

    messages.forEach(msg => {
        const tokens = msg.text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
        tokenizedMessages.push(tokens);
        tokens.forEach(token => vocabSet.add(token));
    });

    const vocab = Array.from(vocabSet);
    const wordIndex = vocab.reduce((acc, word, idx) => {
        acc[word] = idx + 1; // Reserve 0 for padding
        return acc;
    }, {});

    return { tokenizedMessages, wordIndex };
}

function generatePaddedSequences(tokenizedMessages, wordIndex, maxLength = 10) {
    const sequences = tokenizedMessages.map(tokens => tokens.map(token => wordIndex[token] || 0));
    const paddedSequences = sequences.map(seq => {
        const padding = Array(Math.max(0, maxLength - seq.length)).fill(0);
        return [...seq, ...padding].slice(0, maxLength);
    });

    return paddedSequences;
}

async function trainDynamicModel(messages) {
    const { tokenizedMessages, wordIndex } = preprocessData(messages);
    const vocabSize = Object.keys(wordIndex).length + 1; // Include padding token
    const maxLength = 10;

    const paddedSequences = generatePaddedSequences(tokenizedMessages, wordIndex, maxLength);
    const labels = messages.map(msg => msg.label);

    const xs = tf.tensor2d(paddedSequences);
    const ys = tf.tensor1d(labels, 'int32');

    const model = tf.sequential();
    model.add(tf.layers.embedding({ inputDim: vocabSize, outputDim: 16, inputLength: maxLength }));
    model.add(tf.layers.lstm({ units: 64, returnSequences: false }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy'],
    });

    console.log("Training model...");
    await model.fit(xs, ys, {
        epochs: 30,
        validationSplit: 0.2,
        batchSize: 1, 
        shuffle: false,
    });

    console.log("Model trained successfully!");

    const savePath = path.join(__dirname, 'model');
    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath);
    }

    await model.save(`file://${savePath}`);
    console.log(`Model saved to ${savePath}`);

    return { model, wordIndex };
}

// Step 4: Predict Offensive Language
async function predictOffensiveLanguage(model, wordIndex, text) {
    const tokens = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const sequence = tokens.map(token => wordIndex[token] || 0);
    const paddedSequence = [...sequence, ...Array(10 - sequence.length).fill(0)].slice(0, 10);
    const input = tf.tensor2d([paddedSequence]);

    const prediction = await model.predict(input).data();
    return prediction[0] > 0.3 ? "This sentence is offensive" : "This sentence is not offensive";
}

let model, wordIndex;
(async () => {
    const messages = [
        { text: "This is a bad message", label: 1 },
        { text: "What a wonderful day", label: 0 },
        { text: "Terrible things are happening", label: 1 },
        { text: "Great work everyone", label: 0 },
        { text: "This is awful", label: 1 },
        { text: "I love this", label: 0 },
        { text: "Horrible experience", label: 1 },
        { text: "Fantastic effort", label: 0 },
    ];

    const { model: trainedModel, wordIndex: trainedWordIndex } = await trainDynamicModel(messages);
    model = trainedModel;
    wordIndex = trainedWordIndex;
    console.log('Model loaded and ready for predictions');
})();

// Serve the index page
app.get('/', (req, res) => {
    res.render('index', { prediction: null });
});

// Handle form submission and prediction
app.post('/predict', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const prediction = await predictOffensiveLanguage(model, wordIndex, userMessage);
        console.log("prediction------------",prediction)
        res.render('index', { prediction: { text: userMessage, prediction } });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error predicting offensive language.");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});






// const express = require('express');
// const bodyParser = require('body-parser');
// const { exec } = require('child_process');
// const path = require('path');
// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

// // Function to check if the message is offensive
// function checkMessageOffensive(message) {
//     return new Promise((resolve, reject) => {
//         // Path to the downloaded .pth model
//         const modelPath = path.resolve(__dirname, '.llama', 'checkpoints', 'Llama3.3-70B-Instruct', 'consolidated.00.pth');
        
//         // Path to the llama.cpp binary
//         const mainBinaryPath = path.resolve(__dirname, 'llama.cpp', 'build', 'main');

//         // Prepare the command to run the model with llama.cpp
//         const command = `${mainBinaryPath} -m ${modelPath} -p "Determine if the following message is offensive:\n\n${message}\n\nResponse:"`;

//         exec(command, { cwd: path.resolve(__dirname, 'llama.cpp'), shell: '/bin/bash' }, (error, stdout, stderr) => {
//             if (error || stderr) {
//                 return reject(new Error('Error running llama.cpp: ' + (stderr || error.message)));
//             }
            
//             // Processing output of llama model
//             const output = stdout.toLowerCase();
//             if (output.includes('offensive')) {
//                 resolve(true);
//             } else {
//                 resolve(false);
//             }
//         });
//     });
// }

// // Predefined message to check
// const predefinedMessage = "You are an idiot";  // Define a message to check here

// // Check the message when the server starts
// checkMessageOffensive(predefinedMessage)
//     .then((isOffensive) => {
//         console.log(`Message: "${predefinedMessage}" is offensive: ${isOffensive}`);
//     })
//     .catch((error) => {
//         console.error('Error checking message:', error);
//     });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

//-------------------------------------------------------------------------
// const tf = require('@tensorflow/tfjs-node');
// const { pipeline, AutoTokenizer, AutoModelForSequenceClassification } = require('@huggingface/transformers');

// async function loadDistilBertModel() {
//     console.log("Loading DistilBERT model...");
//     const tokenizer = await AutoTokenizer.fromPretrained('distilbert-base-uncased');
//     const model = await AutoModelForSequenceClassification.fromPretrained(
//         'unitary/toxic-bert', // Pre-trained model for toxicity classification
//     );
//     console.log("DistilBERT model loaded successfully!");
//     return { tokenizer, model };
// }

// async function predictOffensiveLanguageWithDistilBERT(tokenizer, model, text) {
//     const inputs = tokenizer.encode(text, { addSpecialTokens: true, returnTensors: 'tf' });
//     const predictions = model.predict(inputs);
//     const probabilities = tf.softmax(predictions.logits, axis=1).arraySync()[0];

//     // Assuming binary classification: 0 (not offensive), 1 (offensive)
//     const offensiveScore = probabilities[1];
//     console.log(`Prediction for "${text}":`, offensiveScore);

//     return offensiveScore > 0.5 ? "This sentence is offensive" : "This sentence is not offensive";
// }

// // Example Usage
// (async () => {
//     try {
//         const { tokenizer, model } = await loadDistilBertModel();

//         const testText1 = "This is a bad message";
//         const result1 = await predictOffensiveLanguageWithDistilBERT(tokenizer, model, testText1);
//         console.log(result1);

//         const testText2 = "What a wonderful day!";
//         const result2 = await predictOffensiveLanguageWithDistilBERT(tokenizer, model, testText2);
//         console.log(result2);
//     } catch (err) {
//         console.error("Error:", err);
//     }
// })();
//-------------------------------------------------------------------------

