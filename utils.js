export async function editMessage(newMessage, token) {
    const editURL = "https://discord.com/api/v8/webhooks/865321519605612554/" + token + "/messages/@original";

    // Edit the thinking message with the generated one and return the response
    return await fetch(editURL, {
        method: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(newMessage),
    });
}


// Add the thousands separators to make a number more readable
export function beautifyNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}