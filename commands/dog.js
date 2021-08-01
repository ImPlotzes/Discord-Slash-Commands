// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "dog",
    description: "Get a random dog picture or gif! :D",
    options: [
        {
            type: 5,
            name: "gif",
            description: "If true, then it will return a gif."
        }
    ]
};


// Import the utils
import { editMessage } from "../utils"


export async function handleDog(request, requestBody) {
    // Define the base URL
    let url = "http://thedogapi.com/api/images/get";

    // If the user wants a gif then we glue '?type=gif' to the end of the url
    if(requestBody.data.options && requestBody.data.options[0].value) {
        url += "?type=gif";
    }

    // Make a request to the URL and get the URL to which it redirected
    const response = await fetch(url);
    const permUrl = response.url;


    // Now we can return the embed
    await editMessage({
        embeds: [
            {
                title: "Dog",
                image: {
                    url: permUrl
                },
                color: parseInt("76cc00", 16)
            }
        ]
    }, requestBody.token);
}
