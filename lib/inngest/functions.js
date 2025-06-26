import { GoogleGenerativeAI } from "@google/generative-ai";
import { createAgent, anthropic, gemini } from "@inngest/agent-kit";
import { db } from "../prisma";
import { inngest } from "./client";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

export const generateIndustryInsights = inngest.createFunction(
    { name: "Generate Industry Insights" },
    { cron: "0 0 * * 0" },
    async ({step}) => {
        const industries = await step.run("Fetch industries", async () => {
            return await db.industryInsight.findMany({
                select: { industry: true },
            });
        });

        for(const {industry} of industries){
            const prompt =
                `Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
                {
                    "salaryRanges": [
                        {   "role": "string", "min": number, "max": number, "median": number, "location": "string" }
                    ],
                    "growthRate": number,
                    "demandLevel": "HIGH" | "MEDIUM" | "LOW",
                    "topSkills": ["skill1", "skill2"],
                    "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
                    "keyTrends": ["trend1", "trend2"],
                    "recommendedSkills": ["skill1", "skill2"]
                }
                
                IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdowm formatting.
                Include at least 5 common roles for salary ranges.
                Growth rate should be a percentage.
                Include at least 5 skills and trends.`
            ;

            const res = await step.ai.wrap("gemini", async (p) => {
                return await model.generateContent(p);
            }, prompt);

            const text = res.response.candidates[0].content.parts[0].text || "";
            const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
            const insights = JSON.parse(cleanedText);

            await step.run(`Update ${industry} insights`, async () => {
                await db.industryInsight.update({
                    where: { industry },
                    data: {
                        ...insights,
                        lastUpdated: new Date(),
                        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    },
                });
            });
        }
    }
);

export const AICareerChatAgent = createAgent({
    name:'AICareerChatAgent',
    description:'An AI Agent that answers career related questions',
    system:`You are a helpful, professional AI Career Coach. Your role is to guide users with questions related to careers, including job search advice,
    interview preparation, resume improvement, skill development, career transitions and industry trends.
    
    Always respond with clarity, encouragement, and actionable advice tailored to the user's needs. 
     Format your response with clear headings and ensure there is **one empty line** (i.e., two newline characters) **after every bullet point or paragraph** to make the message easy to read. 
    If the user asks something unrelated to careers(e.g., topics like health, relationships, coding help, or general trivia),
    gently inform them that you are a career coach and suggest relevant career-focused questions instead.`,
    model: gemini({
        model: "gemini-1.5-flash",
        apiKey: process.env.GEMINI_API_KEY,
  }),
})

export const AiCareerAgent = inngest.createFunction(
    {id:'AiCareerAgent'},
    {event:'AiCareerAgent'},
    async({event, step}) => {
        const {userInput} = await event?.data;
        const result = await AICareerChatAgent.run(userInput);
        return result;
    }
)