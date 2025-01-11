// // import  OpenAIApi from 'openai';
// // import dotenv from 'dotenv';
// // dotenv.config();

// // // Initialize the OpenAI client
// // const openaiClient = new OpenAIApi({
// //     apiKey: process.env.OPENAI_API_KEY,
// // });
// // // const openaiClient = new OpenAIApi(configuration);

// // export async function callAssistant() {
// //     try {
// //         const assistant = await Assistant.findOne();
// //         if (!assistant) {
// //             console.error('No assistant found in the database.');
// //             return;
// //         }
// //         // console.log("assistantId-------------",assistant)
// //         const assistantId = assistant.id; 

// //         console.log("assistantId-------------",assistantId)

// //         const response = await openaiClient.chat.completions.create({
// //             model: 'gpt-3.5-turbo',
// //             messages: [
// //                 { role: 'user', content: 'Hello, assistant!' },
// //             ],
// //         });

// //         console.log("response--------------", response);

// //         const assistantReply = response;
// //         console.log('Assistant:', assistantReply);
// //         return assistantReply;

// //     } catch (error) {
// //         console.error('Error calling the assistant:', error.response ? error.response.data : error.message);
// //     }
// // }

// // callAssistant();

// const leadData = {
//     // phone: "123-456-7890",
//     // email: "contact@business.com",
//     // address: "123 Main St, Mumbai",
//     // industry: "restaurant",
//     // size: "medium",
//     // locations: 3,
//     // paymentVolume: "high",
//     // contactPerson: "John Doe",
//     // decisionMaker: true,

//     "name": "logging Test ",
//     "phoneNumber":"9999087650",
//     "emailAddress":"ghyg5ssaaaas@gmail.com",
//     "source":"SourceCreate",
//     // "dateDiscovered":"2024-08-08",
//     "businessType":"property",
//     "riskLevel":"LOW",
//     "ageOfBusiness":"5",
//     "interestLevel":"high",
//     "currentProcessor":"in progress",
//     "timeframeToSwitch":"5 min",
//     "contactReason":"property",
// };

// function formatJson(json) {
//     return Object.entries(json)
//         .map(([key, value]) => `${key}: ${value.toString().toLowerCase()}`)
//         .join(', ');
// }


// const OpenAIApi  = require('openai');
// const dotenv = require('dotenv');
// dotenv.config();

// const openaiClient = new OpenAIApi({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// const callAssistant = async (leadData) => {
//     try {
//         // const assistant = await openaiClient.beta.assistants.create({
//         //     name: "Code Instructor",
//         //     instructions: "You are a personal code instructor. Write and run code to answer coding questions.",
//         //     tools: [{ type: "code_interpreter" }],
//         //     model: "gpt-3.5-turbo",
//         // });

//         // console.log("Assistant created:", assistant);
// const stringObj = formatJson(leadData);

//         const assistant = process.env.OPENAI_ASSISTANT_ID;

//             console.log('assistant------------',assistant)
//         if (!threadId || threadId.length === 0) {
//             const thread = await openaiClient.beta.threads.create();
//             threadId = thread.id;
//         }

//          const threads=await openaiClient.beta.threads.messages.create(threadId, {
//             role: "user",
//             content: "You need to score every lead I will send you for Host Merchant Services. We target business owners or financial decision-makers for businesses of various sizes, focusing on industries like professional services, restaurants, retail shops, gas stations, or any business that accepts card or ACH payments. We value businesses with multiple locations, higher payment volumes, and verified contact information. The score should be on a scale from 1 to 100, where 100 represents the best fit. The system should check if the provided phone number, email address, and physical address match the business information if these fields are provided. The output should be in JSON format, including the lead score and an explanation for why the score was given. The key factors for scoring should include: Industry fit (preferred industries like restaurants, retail, gas stations, etc.). Business size (small, medium, large). Number of locations (more locations score higher). Payment volume (high transaction volume leads score higher). Matching contact information (phone, email, address). Decision-making authority of the contact person. Return only JSON with the lead scoring information and justification.",
//         });

//         console.log("thread-----------:", threads);

//         const run = await openaiClient.beta.threads.runs.create(threadId, {
//             assistant_id: assistant,
//             instructions: "Please address the user as Jane Doe. The user has a premium account.",
//         });

//         console.log("run----------",run)

//         const asstRun = await openaiClient.beta.threads.runs.retrieve(threadId, run.id);

//         const messages = await openaiClient.beta.threads.messages.list(threadId);

//         const response = await openaiClient.chat.completions.create({
//             model: 'gpt-3.5-turbo',
//             messages: [
//                 { role: 'user', content: ` here is the lead data ${stringObj}, could you please provide the score for this lead` }

//             ],
//         });


//         console.log("Response from gpt-3.5-turbo:", response);

//         const assistantReply = response.choices[0].message.content;
//         console.log('Assistant Reply:', assistantReply);

//         return { messages: messages.data, assistantReply }; 
//     } catch (error) {
//         console.error('Error calling the assistant:', error.response ? error.response.data : error.message);
//     }
// };

// // const threadId = ''; 
// // const prompt = "prompt create "; 

// // module.exports = { callAssistant };


// const threadId = ''; // Leave empty for a new thread
// // const prompt = "prompt create "; 

// callAssistant(leadData)
//     .then(result => {
//         console.log("Assistant's Messages:", result.messages);
//         console.log("Assistant's Reply from gpt-3.5-turbo:", result.assistantReply);
//     })
//     .catch(err => {
//         console.error("Error executing assistant:", err);
//     });

//   otp generator--------------------------------------------------------------

// server.jsconst express = require('express');
// const bodyParser = require('body-parser');
// const otpGenerator = require('otp-generator');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const readline = require('readline');
// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());
// app.use(cors());

// let otpStorage = {};

// const predefinedEmail = 'abc@gmail.com'; // Replace with your email

// const sendOtp = async (email) => {
//     const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

//     otpStorage = { otp, createdAt: Date.now() };

//     try {
//         const transporter = nodemailer.createTransport({
//             host: 'smtp.ethereal.email',
//             port: 587,
//             auth: {
//                 user: 'evan.schiller29@ethereal.email',
//                 pass: 'tTBThWhUQ3xQg9J96p'
//             }
//         });
//         // Send OTP email
//         await transporter.sendMail({
//             from: 'evan.schiller29@ethereal.email',
//             to: email,
//             subject: 'OTP Verification',
//             text: `Your OTP for verification is: ${otp}`
//         });

//         console.log(`OTP sent successfully to ${email}`);
//         promptOtpVerification(); // Prompt user to enter OTP in the terminal
//     } catch (error) {
//         console.error("Error sending OTP:", error);
//     }
// };

// // Prompt the user to enter OTP for verification
// const promptOtpVerification = () => {
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });

//     rl.question('Enter the OTP sent to your email: ', (inputOtp) => {
//         const { otp, createdAt } = otpStorage;

//         if (otp && inputOtp === otp && (Date.now() - createdAt) < 5 * 60 * 1000) {
//             console.log('OTP verified successfully!');
//         } else {
//             console.log('Invalid or expired OTP.');
//         }
//         rl.close();
//     });
// };

// sendOtp(predefinedEmail);

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// ---------------------------------------------------
// pdf password generator






// const fs = require('fs');
// const path = require('path');
// const express = require('express');
// const Qpdf = require('node-qpdf');

// const app = express();
// const PORT = 3000;

// app.use('/secured-pdfs', express.static(path.join(__dirname, 'secured-pdfs')));

// const encryptPDF = (inputFilePath, outputFilePath, password) => {
//   if (!password) {
//     console.error("Password is missing.");
//     return handleError(new Error('Password missing'));
//   }

//   const options = {
//     keyLength: 128, 
//     password: password 
//   };

//   console.log("Encrypting PDF with options:", options); 

//   Qpdf.encrypt(inputFilePath, outputFilePath, options, (err) => {
//     if (err) {
//       console.error('Error encrypting PDF:', err);
//     } else {
//       console.log(`PDF encrypted successfully! File saved at: ${outputFilePath}`);
//     }
//   });
// };

// const handleError = (error) => {
//   console.error(error.message);
// };

// const generatePDFWithPassword = async () => {
//   const inputFilePath = path.join(__dirname, "pdf_48811726304933.pdf");
//   const outputFilePath = path.join(__dirname, "secured-pdfs", "pdf_48811726304933.pdf");
//   const password = "1234"; 

//   console.log("Password for encryption:", password); 

//   fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });

//   encryptPDF(inputFilePath, outputFilePath, password);
// };

// app.listen(PORT, async () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
//   await generatePDFWithPassword();
// });
// chatrestricted----------------------------------------------------------------------------------

// testWithoutFirebase.js


// const PORT = process.env.PORT || 3000;

// const app = require('express')(); 
// const { isOffensiveMessage } = require("./utils/huggingFace");

// async function simulateChatMessage() {
//   const chatData = {
//     message: "This is a test  message",
//     userId: "user123",
//   };

//   try {
//     console.log("Simulated new message received:", chatData.message);

//     const isOffensive = await isOffensiveMessage(chatData.message);

//     if (isOffensive) {
//       console.log("Inappropriate message detected:", chatData.message);
//       console.log(`Simulated notification to user ${chatData.userId}: "You cannot send such messages."`);
//       console.log("Simulated message removal.");
//     } else {
//       console.log("Message is clean:", chatData.message);
//     }
//   } catch (error) {
//     console.error("Error processing simulated chat message:", error);
//   }
// }



// app.listen(PORT, async () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
//   simulateChatMessage(); 
// });


// //------------------------------------------------------------------
const tf = require('@tensorflow/tfjs-node');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const wordIndexFilePath = path.join(__dirname, 'model/model.json');

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Function to load wordIndex
function loadWordIndex() {
    try {
        const wordIndexData = fs.readFileSync(wordIndexFilePath);
        return JSON.parse(wordIndexData);
    } catch (error) {
        console.error("Error loading wordIndex:", error);
        throw error;
    }
}

// Function to load the model
async function loadModel() {
    try {
        const modelPath = path.join(__dirname, 'model', 'model.json');
        const model = await tf.loadLayersModel(`file://${modelPath}`);
        console.log("Model loaded successfully!");
        return model;
    } catch (error) {
        console.error("Error loading model:", error);
        throw error;
    }
}

// Function to preprocess text for prediction
function preprocessText(text, wordIndex) {
    const tokenizedText = text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .map(word => wordIndex[word] || 0);

    const maxLength = 10;
    const padding = Array(Math.max(0, maxLength - tokenizedText.length)).fill(0);
    const paddedSequence = [...tokenizedText, ...padding].slice(0, maxLength);

    return tf.tensor2d([paddedSequence]);
}

// Function to classify the message dynamically
async function classifyMessageDynamic(message, model) {
    const wordIndex = loadWordIndex();
    const inputTensor = preprocessText(message, wordIndex);
    const prediction = model.predict(inputTensor);

    const predictionData = prediction.dataSync();
    const score = predictionData[0];
    console.log(`Message: "${message}"`);
    console.log(`Confidence Score: ${score}`);

    return score >= 0.3 ? "Offensive" : "Non-Offensive";
}

// Route to render the input form
app.get('/', (req, res) => {
    res.render('index', { result: null });
});

// Route to handle form submission
app.post('/classify', async (req, res) => {
    const userMessage = req.body.message;  // Get user input from POST request

    try {
        const model = await loadModel();
        console.log("User Message:", userMessage);

        const result = await classifyMessageDynamic(userMessage, model);
        // res.json({ message: userMessage, classification: result });
        res.render('index', { result, message: userMessage });

    } catch (error) {
        console.error("Error during prediction:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
