// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "ping",
    description: "Check the ping of the slash commands."
};


import { editMessage, beautifyNumber } from "../utils";


export async function handlePing(request, requestBody) {
    // Get the time in milliseconds when we send the request
    const begin = Date.now();
    const response = await editMessage({
        embeds: [
            {
                title: "Pong! 🏓",
                description: "Checking ping...",
                color: parseInt("76cc00", 16)
            }
        ]
    }, requestBody.token);

    // Get the returned message object that Discord gives you
    const message = await response.json();

    // Calculate ping based on the timestamp when the message was posted and when we sent it
    const ping = beautifyNumber(new Date(message.timestamp).valueOf() - begin);

    
    // Return the result!
    await editMessage({
        embeds: [
            {
                title: "Pong 🏓", 
                description: "The ping is **" + ping + "ms**.\n```\nCommand handled ⎯⎯⎯⎯ " + ping + "ms ⎯⎯⎯> Message posted\n```",
                color: parseInt("76cc00", 16),
                footer: {
                    text: "Handled by colo " + request.cf.colo 
                }
            }
        ]
    }, requestBody.token);
}