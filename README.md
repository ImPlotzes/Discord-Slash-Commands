# Plotzes Commands
Plotzes Commands is a Discord application providing [application commands](https://discord.com/developers/docs/interactions/application-commands "application commands"). This project is hosted on [Cloudflare Workers](https://developers.cloudflare.com/workers/ "Cloudflare Workers").

## Deploy it yourself
If you want to deploy this bot yourself then you will need [wrangler 2.0](https://github.com/cloudflare/wrangler2). This is the CLI to deploy and manage Cloudflare Workers. You can't use wrangler 1.0 since it doesn't automatically bundle all the files. After you've cloned this repository you will need to edit the details in `wrangler.toml`. Then you can do `wrangler publish` to deploy the worker to Cloudflare Workers (assuming you've logged in with `wrangler login` beforehand).

**Note:** You will first need to manually register all the commands as global or guild commands, then they'll be available in Discord. The POST request body of each command can be found at the top of their JavaScript files. You can see how to do that in [Discord's documentation](https://discord.com/developers/docs/interactions/application-commands#registering-a-command).

## How to use the bot
You can use these commands when you join [my Discord server](https://www.plotzes.ml/discord "my Discord server"). You can also add these application commands to your own server by using the `/invite` command (or clicking [here](https://discord.com/api/oauth2/authorize?client_id=865321519605612554&scope=applications.commands "here")).

Once you're in a server with the application commands you can use them by typing `/` and then choosing one of the suggested commands. You can find all commands by scrolling throught the suggested commands in Discord or [here](https://github.com/ImPlotzes/Discord-Slash-Commands/tree/main/commands "here").

<br>

### Other notes
If you find any bugs or have any questions then you can find support in [my Discord server](https://www.plotzes.ml/discord "my Discord server") ([https://www.plotzes.ml/discord](https://www.plotzes.ml/discord "https://www.plotzes.ml/discord")). 
