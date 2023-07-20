export async function editMessage(newMessage, token) {
    const editURL = "https://discord.com/api/v9/webhooks/865321519605612554/" + token + "/messages/@original";

    // Edit the original message with the new message
    const response = await fetch(editURL, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newMessage)
    });

    // If the response is not 200, log the status for debugging
    if(!response.ok) {
        console.log("Error editing message: HTTP " + response.status + " " + response.statusText);
    }

    // Return the response
    return response;
}


// Add the thousands separators to make a number more readable
export function beautifyNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
