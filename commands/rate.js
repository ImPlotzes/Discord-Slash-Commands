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

// Things that deserve the absolute best rating!
const bestThings = [
    "kumo",
    "july",
    "haru",
    "hayden",
    "bolt",
    "erza",
    "ranch"
];


export async function handleRate(request, requestBody) {
    // Generate a random rating (Shhh don't tell anyone it's random ;D)
    let rating = Math.round(Math.random() * 10);

    // Choose embed colour based on rating
    // 10  ==> #25dc10
    // 1-9 ==> interpolated between #dc1010 and #25dc10
    // 0   ==> #dc1010
    let colour = parseInt(getInterpolatedColour("dc1010", "25dc10", rating / 10), 16);

    // Get the thing to rate
    const subject = requestBody.data.options[0].value;

    // If it's one of the best things then change the rating and embed colour
    if(bestThings.includes(subject.toLowerCase().replace(/\s+/g, ""))) {
        rating = "∞";
        colour = parseInt("36393f", 16)
    }

    // Return the embed stucture
    await editMessage({
        embeds: [
            {
                title: "Rating",
                description: "I rate `" + subject + "` **" + rating + "** out of 10",
                color: colour,
                footer: {
                    text: "Official rating"
                }
            }
        ]
    }, requestBody.token);
}


function getInterpolatedColour(colour1, colour2, percentage) {
    // Parse the two hex colours
    let colour1Hex = parseInt(colour1, 16);
    let colour2Hex = parseInt(colour2, 16);

    // Get the red, green and blue values for each colour
    let colour1Red = (colour1Hex >> 16) & 255;
    let colour1Green = (colour1Hex >> 8) & 255;
    let colour1Blue = colour1Hex & 255;

    let colour2Red = (colour2Hex >> 16) & 255;
    let colour2Green = (colour2Hex >> 8) & 255;
    let colour2Blue = colour2Hex & 255;

    // Interpolate the red, green and blue values
    let red = Math.round(colour1Red + (colour2Red - colour1Red) * percentage);
    let green = Math.round(colour1Green + (colour2Green - colour1Green) * percentage);
    let blue = Math.round(colour1Blue + (colour2Blue - colour1Blue) * percentage);

    // Convert the red, green and blue values to hex
    red = red.toString(16);
    green = green.toString(16);
    blue = blue.toString(16);

    // Add a 0 to the start of the hex value if it's only one character long
    if(red.length == 1) {
        red = "0" + red;
    }
    if(green.length == 1) {
        green = "0" + green;
    }
    if(blue.length == 1) {
        blue = "0" + blue;
    }

    // Return the hex value
    return red + green + blue;
}
