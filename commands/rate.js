// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "rate",
    description: "Get the rating of a random subject.",
    options: [
        {
            name: "subject",
            description: "The subject to rate.",
            type: 3,
            required: true
        }
    ]
};


// Import the utils
import { editMessage } from "../utils"


export async function handleRate(request, requestBody) {
    // Generate a random rating (Shhh don't tell anyone it's random ;D)
    const rating = Math.round(Math.random() * 10);

    // Choose embed colour based on rating
    // Higher than 5   ==>    Green  (#25dc10)
    // Equal to 5      ==>    Orange (#dc7e10)
    // Lower than 5    ==>    Red    (#dc1010)
    let colour;
    if(rating > 5) {
        colour = parseInt("25dc10", 16);
    } else if(rating == 5) {
        colour = parseInt("dc7e10", 16);
    } else {
        colour = parseInt("dc1010", 16);
    }

    // Return the embed stucture
    await editMessage({
        embeds: [
            {
                title: "Rating",
                description: "I rate `" + requestBody.data.options[0].value + "` **" + rating + "** out of 10",
                color: colour,
                footer: {
                    text: "Official rating"
                }
            }
        ]
    }, requestBody.token);
}