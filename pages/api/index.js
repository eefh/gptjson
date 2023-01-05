// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
    try {
        let token = req.rawHeaders
            .find((str) => str.match(/^Bearer/))
            .replace(/^Bearer /, "");
        const configuration = new Configuration({
            apiKey: token,
        });

        const openai = new OpenAIApi(configuration);
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt(req.body.request),
            max_tokens: 3000,
        });
        let response = completion.data.choices[0].text;
        response = response.replace(/\\n/g, "");
        const clean = JSON.parse(response);
        res.status(200).json(clean);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: `An error occurred: ${error.message}`,
        });
    }
}

const generatePrompt = (prompt) => {
    return `"${prompt}" return a sample JSON object that is a collection of generated data based on these specs:`;
};
