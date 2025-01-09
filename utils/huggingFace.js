// utils/huggingface.js
const { HfInference } = require("@huggingface/inference");
const dotenv = require("dotenv");

dotenv.config();

const hf = new HfInference(process.env.HF_API_KEY);

async function isOffensiveMessage(message) {
  try {
    const result = await hf.textClassification({
      model: "cardiffnlp/twitter-roberta-base-offensive",
      inputs: message,
    });

    const offensiveLabel = result[0]?.label?.toLowerCase();
    return offensiveLabel === "offensive" || offensiveLabel === "toxic";
  } catch (error) {
    console.error("Error analyzing message with Hugging Face:", error);
    return false;
  }
}

module.exports = { isOffensiveMessage };
