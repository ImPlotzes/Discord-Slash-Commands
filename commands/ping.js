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

    // Post a message to check the ping
    const response = await editMessage({
        embeds: [
            {
                title: "Pong! 🏓",
                description: "Checking ping...",
                color: parseInt("76cc00", 16)
            }
        ]
    }, requestBody.token);

    const end = Date.now();

    // Get the returned message object that Discord gives you
    const message = await response.json();

    // Calculate ping based on the timestamp when the message was posted and when we sent it
    const discordBasedPing = beautifyNumber(new Date(message.timestamp).valueOf() - begin);

    // Calculate based on how long it took for the code to continue
    const workerBasedPing = beautifyNumber(end - begin);

    
    // Return the result!
    await editMessage({
        embeds: [
            {
                title: "Pong 🏓", 
                description: "The time it took to post a message was **" + workerBasedPing + "ms**.\nThe time between sending a message and Discord posting it was **" + discordBasedPing + "ms**.\n```d\n|  Start command handling (0ms)\n|\n|\n|  Message posted (" + discordBasedPing + "ms)\n|\n|\nV  Code continuing (" + workerBasedPing + "ms)\n```",
                color: parseInt("76cc00", 16),
                footer: {
                    text: "Handled by colo " + request.cf.colo 
                }
            }
        ]
    }, requestBody.token);
}