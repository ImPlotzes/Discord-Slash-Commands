// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "stats",
    description: "Get the TNT Games stats of any user.",
    options: [
        {
            name: "username",
            description: "The username of the player who's stats you want. (You can also use their UUID)",
            type: 3,
            required: true
        }
    ]
};


// To convert games to their readable string
const gameTypes = {
    QUAKECRAFT: "Quake",
    WALLS: "Walls",
    PAINTBALL: "Paintball",
    SURVIVAL_GAMES: "Blitz Survival Games",
    TNTGAMES: "TNT Games",
    VAMPIREZ: "VampireZ",
    WALLS3: "Mega Walls",
    ARCADE: "Arcade",
    ARENA: "Arena",
    UHC: "UHC Champions",
    MCGO: "Cops and Crims",
    BATTLEGROUND: "Warlords",
    SUPER_SMASH: "Smash Heroes",
    GINGERBREAD: "Turbo Kart Racers",
    HOUSING: "Housing",
    SKYWARS: "SkyWars",
    TRUE_COMBAT: "Crazy Walls",
    SPEED_UHC: "Speed UHC",
    SKYCLASH: "SkyClash",
    LEGACY: "Classic Games",
    PROTOTYPE: "Prototype",
    BEDWARS: "Bed Wars",
    MURDER_MYSTERY: "Murder Mystery",
    BUILD_BATTLE: "Build Battle",
    DUELS: "Duels",
    SKYBLOCK: "SkyBlock",
    PIT: "Pit"
}


export async function handleStatsCommand(request, requestBody) {
    // Get the user (this can be their name OR their UUID)
    const user = requestBody.data.options[0].value;

    let uuid;

    // If the user is a name (16 characters or less) then first get their UUID
    if(user.length <= 16) {
        // Try to get the account data
        const accountRes = await fetch("https://api.ashcon.app/mojang/v1/user/" + user);

        // If the fetch wasn't successful then send their response back as to why it wasn't successful
        if(!accountRes.ok) {
            return {
                embeds: [
                    {
                        title: "Not successful",
                        description: "Couldn't get their UUID.\n```\n" + accountRes.statusText + "\n```",
                        color: parseInt("F12525", 16)
                    }
                ]
            };
        }

        try {
            // Try to parse the response body into a JSON object
            const accountData = await accountRes.json();

            // Get their UUID
            uuid = accountData.uuid;
        } catch(e) {
            // For some reason the API didn't return JSON... so return an error message
            return {
                embeds: [
                    {
                        title: "Not successful",
                        description: "Couldn't get their UUID. Got an unexpected response.",
                        color: parseInt("F12525", 16)
                    }
                ]
            };
        }
    } else {
        // The provided user is longer than 16 characters so it should already be an UUID
        uuid = user;
    }

    // Get the data from Hypixel
    const res = await fetch("https://api.hypixel.net/player?uuid=" + uuid + "&key=" + HYPIXEL_API_KEY);

    // Try to parse the response from Hypixel into JSON (can fail if Hypixel is down).
    // If the parsing indeed fails, then send an error message.
    let data;
    try {
        data = await res.json();
    } catch(e) {
        return {
            embeds: [
                {
                    title: "Not successful",
                    description: "Couldn't get the data from Hypixel. It might be offline.",
                    color: parseInt("F12525", 16)
                }
            ]
        };
    }
    

    // If the call wasn't successful then reply with a message as to why
    if(!res.ok || !data.success || !data.player) {
        return {
            embeds: [
                {
                    title: "Not successful",
                    description: "Couldn't get the data from Hypixel.\n```\n" + (data.cause || "No player data") + "\n```",
                    color: parseInt("F12525", 16)
                }
            ]
        };
    }

    const username = data.player.displayname;

    // The player might have data, but not TNT Games stats. So check for TNT Games stats and if they're
    // not there then return an error message.
    if(!data.player.stats || !data.player.stats.TNTGames) {
        return {
            embeds: [
                {
                    title: "Not successful",
                    description: username + " doesn't have any TNT Games stats.",
                    color: parseInt("F12525", 16)
                }
            ]
        };
    }

    // OK so the player has stats and we have them

    // Lets cache the data                               [DISABLED FOR NOW]
    //let cache = caches.default;                        [DISABLED FOR NOW]
    //await cache.put(requestBody.token + uuid, res);    [DISABLED FOR NOW]


    // Time to define all the stats we want to show 


    // Get the their rank
    let prefix = data.player.prefix;
    let rank = data.player.rank;
    let monthlyPackageRank = data.player.monthlyPackageRank;
    let packageRank = data.player.newPackageRank || data.player.packageRank;
    let rankPrefix = "";
    switch(packageRank) {
        case "VIP":
            rankPrefix = "[VIP] ";
            break;
        case "VIP_PLUS":
            rankPrefix = "[VIP+] ";
            break;
        case "MVP":
            rankPrefix = "[MVP] ";
            break;
        case "MVP_PLUS":
            rankPrefix = "[MVP+] ";
            break;
        default:
            break;
    }
    switch(monthlyPackageRank) {
        case "SUPERSTAR":
            rankPrefix = "[MVP++] ";
            break;
        default: 
            break;
    }
    switch(rank) {
        case "YOUTUBER":
            rankPrefix = "[YOUTUBE] ";
            break;
        case "HELPER":
            rankPrefix = "[HELPER] ";
            break;
        case "MODERATOR":
            rankPrefix = "[MOD] ";
            break;
        case "GAME_MASTER":
            rankPrefix = "[GM] ";
            break;
        case "ADMIN":
            rankPrefix = "[ADMIN] ";
            break;
        default:
            break;
    }
    if(prefix) {
        prefix = prefix.replace(/§./g, "");
        rankPrefix = prefix + " ";
    }
    
    // What their last played game was
    const lastPlayed = gameTypes[data.player.mostRecentGameType] || "Unknown";

    // When they logged in for the last time
    let lastLogin;
    if(data.player.lastLogin) {
        lastLogin = Math.round(data.player.lastLogin / 1000);
    }

    // We get the playtime from the TNT Triathlon achievement which counts playtime in seconds
    let playtime = "0 minutes";
    if(data.player.achievements && data.player.achievements.tntgames_tnt_triathlon) {
        const time = data.player.achievements.tntgames_tnt_triathlon;
        const h = Math.floor(time / 60);
        const m = Math.floor(time % 60);

        const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        const mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
        playtime = hDisplay + mDisplay;
    }

    data = data.player.stats.TNTGames;

    let wins = data.wins || 0;
    wins += (data.wins_pvprun || 0); // For some weird reason PVP Run wins aren't counted into the total wins...

    const winstreak = data.winstreak || 0;
    const coins = data.coins || 0;
    const particleEffect = data.new_active_particle_effect || "-";

    // All these effects are made a bit more readable right here
    let deathEffect = "-";
    if(data.new_active_death_effect) {
        let effect = data.new_active_death_effect.replaceAll("_", " ");
        deathEffect = effect.charAt(0).toUpperCase() + effect.slice(1);
    }
    let doubleJumpEffect = "-";
    if(data.new_double_jump_effect) {
        let effect = data.new_double_jump_effect.replaceAll("dje_", "");
        effect = effect.replaceAll("_", " ");
        doubleJumpEffect = effect.charAt(0).toUpperCase() + effect.slice(1);
    }
    let voidMessage = "-";
    if(data.active_void_message) {
        let message =  data.active_void_message.replaceAll("_", " ");
        voidMessage = message.charAt(0).toUpperCase() + message.slice(1);
    }
    let selectedHat = "-";
    if(data.new_selected_hat) {
        let hat = data.new_selected_hat.replaceAll("_", " ");
        selectedHat = hat.charAt(0).toUpperCase() + hat.slice(1);
    }

    // Now time for the settings
    // Currently all values default to 'true' but I'm not sure if some settings are turned off by default.
    // Please message me (Discord: Plotzes#8332; https://www.plotzes.ml/discord) if this isn't true
    data = data.flags || {};
    const actionBarWiz = data.show_wizards_actionbar_info != undefined ? data.show_wizards_actionbar_info : true;
    const actionBarRun = data.show_tntrun_actionbar_info != undefined ? data.show_tntrun_actionbar_info : true;
    const actionBarTag = data.show_tnttag_actionbar_info != undefined ? data.show_tnttag_actionbar_info : true;
    const tipHolograms = data.show_tip_holograms != undefined ? data.show_tip_holograms : true;
    const cooldownMessageWiz = data.show_wizards_cooldown_notifications != undefined ? data.show_wizards_cooldown_notifications : true;
    const doubleJumpFeather = data.give_dj_feather != undefined ? data.give_dj_feather : true;
    const prestigeParticlesWiz = data.show_wiz_pres != undefined ? data.show_wiz_pres : true;


    // Ok now we have all info and we can return the embed
    return {
        embeds: [
            {
                title: rankPrefix + username + "'s TNT Games stats",
                description: "These are the general TNT Games stats of " + username + ".",
                url: "https://www.plotzes.ml/stats/" + uuid,
                color: parseInt("0076cc", 16),
                fields: [
                    {
                        name: "Last Login",
                        value: (lastLogin ? "<t:" + lastLogin + ":R>" : "`Unknown`"),
                        inline: true
                    },
                    {
                        name: "Last Played Game",
                        value: "`" + lastPlayed + "`",
                        inline: true
                    },
                    {
                        name: "Wins",
                        value: "`" + beautifyNumber(wins) + "`",
                        inline: true
                    },
                    {
                        name: "Win Streak",
                        value: "`" + beautifyNumber(winstreak) + "`",
                        inline: true
                    },
                    {
                        name: "Coins",
                        value: "`" + beautifyNumber(coins) + "`",
                        inline: true
                    },
                    {
                        name: "Playtime",
                        value: "`" + playtime + "`",
                        inline: true
                    },
                    {
                        name: "Cosmetics",
                        value: "```yml\nParticle effect: " + particleEffect + "\nDeath effect: " + deathEffect + "\nDouble jump effect: " + doubleJumpEffect + "\nVoid message: " + voidMessage + "\nSelected hat: " + selectedHat + "\n```"
                    },
                    {
                        name: "Settings",
                        value: "```yml\nAction bar in Wizards: " + actionBarWiz + "\nAction bar in TNT/PVP Run: " + actionBarRun + "\nAction bar in TNT Tag: " + actionBarTag + "\nTip holograms: " + tipHolograms + "\nCooldown messages in Wizards: " + cooldownMessageWiz + "\nDouble jump feather: " + doubleJumpFeather + "\nShow prestige particles in Wizards: " + prestigeParticlesWiz + "\n```"
                    }
                ],
                thumbnail: {
                    url: "https://www.mc-heads.net/body/" + uuid + "/left"
                },
                footer: {
                    text: "TNT Game specific stats coming soon..."
                }
            }
        ]
    };
}


function beautifyNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
