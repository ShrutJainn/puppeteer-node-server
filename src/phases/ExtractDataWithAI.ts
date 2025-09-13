import OpenAI from "openai";

export class ExtractDataWithAI {
  static async execute(inputs: Record<string, any>): Promise<string> {
    const credentials = inputs["Credentials"];
    const prompt = inputs["Prompt"];
    const content = inputs["Content"];

    if (!credentials || !prompt || !content) throw new Error("Invalid Inputs");

    const openai = new OpenAI({
      apiKey: credentials,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text of HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided contect and ensure the output is always a valid JSON array without any surrounding text",
        },
        {
          role: "user",
          content: content,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1,
    });
    const result = response.choices[0].message?.content;
    if (!result) throw new Error("Empty response from AI");
    return result;
  }
}
