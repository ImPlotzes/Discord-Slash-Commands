// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "8ball",
    description: "The Magic 8 Ball that will answer all your questions.",
    options: [
        {
            name: "question",
            description: "To what would you like an answer?",
            type: 3,
            required: true
        }
    ]
};


// Import the utils
import { editMessage } from "../utils"


const answers = [
    // Positive answers
    "It is certain",
    "Without a doubt",
    "You may rely on it",
    "Yes definitely",
    "It is decidedly so",
    "As I see it, yes",
    "Most likely",
    "Yes",
    "Outlook good",
    "Signs point to yes",
    
    // Neutral answers
    "Reply hazy try again",
    "Better not tell you now",
    "Ask again later",
    "Cannot predict now",
    "Concentrate and ask again",

    // Negative answers
    "Don’t count on it",
    "Outlook not so good",
    "My sources say no",
    "Very doubtful",
    "My reply is no",
]


export async function handle8Ball(request, requestBody) {
    // Get the question
    const question = requestBody.data.options[0].value;

    // Use the magic of The Magic 8 Ball to generate an answer
    const answer = answers[Math.round(Math.random() * (answers.length - 1))];

    // Return the result
    await editMessage({
        embeds: [
            {
                title: "The Magic 8 Ball has answered!",
                description: "Dear clodhopper,\n\nYou're lucky I've answered your question! I don't normally do that for peasants like you. Next time try to ask something worth my time!\n\nHere is my answer.",
                color: parseInt("020035", 16),
                thumbnail: {
                    url: "https://cdn.wallpapersafari.com/36/49/kKh94s.png"
                },
                fields: [
                    {
                        name: question,
                        value: "`" + answer + "`"
                    }
                ]
            }
        ]
    }, requestBody.token);
}


