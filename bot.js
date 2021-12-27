// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');

// Create a new client instance


const TOKEN = "ODU5OTI5MjM5MTkyMjA3Mzcw.YNz1gw.BtSl8hK1_rp5V7WYNAYj-CrZ4rE";
const prefix = "sh!";

// import ytdl-core
const ytdl = require('ytdl-core');



//login to discord
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.login(TOKEN);

//display success message after logging in
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("mój prefix to: sh!", { type: "PLAYING" });
});

//create a command with correct intents
client.on('message', msg => {
    if (msg.content.startsWith(prefix + 'play')) {
        if (msg.member.voice.channel) {
            msg.member.voice.channel.join().then(connection => {
                const stream = ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { filter: 'audioonly' });
                const dispatcher = connection.play(stream);
                dispatcher.on('end', () => {
                    connection.disconnect();
                });
            });

        } else {
            msg.reply('You need to join a voice channel first!');
        }
    }
});


// listen for messages
client.on('message', msg => {
    // ignore messages that aren't from a guild
    // if (!msg.guild) return;

    //set bot status
    client.user.setPresence({ activities: [{ name: 'mój prefix to: sh!' }], status: 'idle' });

    // ignore messages that don't start with the prefix
    if (!msg.content.startsWith(prefix)) return;

    // parse the command
    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // create a command that responds to the ping command
    if (command === 'ping') {
        msg.reply('pong');
    }

    // create a command that responds with user avatar with a embed
    if (command === 'avatar') {
        const embed = new Discord.MessageEmbed()
            .setTitle(`${msg.author.username}'s pfp`)
            .setImage(msg.author.avatarURL())
            .setColor(0x00AE86)
        msg.channel.send({ embed });
    }

    // create a command that kicks the person is in the arguments of command
    if (command === 'kick') {
        // check if the user has the permission to kick
        if (!msg.member.hasPermission('KICK_MEMBERS')) {
            msg.reply('Nie masz uprawnień do wyrzucania członków!');
            return;
        }
        // check if the user has the permission to kick the person in the arguments of command
        if (!msg.guild.me.hasPermission('KICK_MEMBERS')) {
            msg.reply('Nie mam pozwolenia na wyrzucanie członków!');
            return;
        }
        // check if the person in the arguments of command is a member of the server
        if (!msg.mentions.members.first()) {
            msg.reply('Musisz określić użytkownika do wyrzucenia!');
            return;
        }
        // kick the person in the arguments of command
        msg.mentions.members.first().kick();
        msg.reply(`Kicked ${msg.mentions.members.first().user.username}`);
    }

    // create a command that bans the person is in the arguments of command
    if (command === 'ban') {
        // check if the user has the permission to ban
        if (!msg.member.hasPermission('BAN_MEMBERS')) {
            msg.reply('Nie masz uprawnień do banowania członków!');
            return;
        }
        // check if the user has the permission to ban the person in the arguments of command
        if (!msg.guild.me.hasPermission('BAN_MEMBERS')) {
            msg.reply('Nie mam uprawnień do banowania członków!');
            return;
        }
        // check if the person in the arguments of command is a member of the server
        if (!msg.mentions.members.first()) {
            msg.reply('Musisz określić użytkownika, którego chcesz zbanować!');
            return;
        }
        // ban the person in the arguments of command
        msg.mentions.members.first().ban();
        msg.reply(`Zbanowano użytkownika: ${msg.mentions.members.first().user.username}`);
    }

    // mute the person is in the arguments of command
    if (command === 'mute') {
        // check if the user has the permission to mute
        if (!msg.member.hasPermission('MANAGE_ROLES')) {
            msg.reply('You do not have permission to mute members!');
            return;
        }
        // check if the user has the permission to mute the person in the arguments of command
        if (!msg.guild.me.hasPermission('MANAGE_ROLES')) {
            msg.reply('I do not have permission to mute members!');
            return;
        }
        // check if the person in the arguments of command is a member of the server
        if (!msg.mentions.members.first()) {
            msg.reply('You need to specify a user to mute!');
            return;
        }
        // mute the person in the arguments of command
        const mutedRole = msg.guild.roles.cache.find(role => role.name === 'Muted');
        msg.mentions.members.first().roles.add(mutedRole);
        msg.reply(`Muted ${msg.mentions.members.first().user.username}`);
    }

    //join a voicechannel that the user is in
    if (command === 'join') {
        // check if the user has the permission to join the voicechannel
        if (!msg.member.voice.channel) {
            msg.reply('You need to be in a voice channel to join!');
            return;
        }
        // join the user's voicechannel
        msg.member.voice.channel.join()
    }

    // send user stats in an embed
    if (command === '!stats') {
        const embed = new Discord.MessageEmbed()
            .setTitle(`${msg.author.username}'s stats`)
            .setColor(0x00AE86)
            .addField('ID', msg.author.id)
            .addField('Created At', msg.author.createdAt)
            .addField('Joined At', msg.member.joinedAt)
            .addField('Status', msg.author.presence.status)
            .addField('Game', msg.author.presence.game)
            .addField('Roles', msg.member.roles.cache.map(role => role.name).join(', '))
            .setThumbnail(msg.author.avatarURL())
        msg.channel.send({ embed });
    }

    // join the voice channel that the user is in and play music from user provided url
    if (command === 'play') {  
        // check if the user has the permission to join the voicechannel
        if (!msg.member.voice.channel) {
            msg.reply('Aby odtwarzać muzykę, musisz być na kanale głosowym!');
            return;
        }
        // join the user's voicechannel
        msg.member.voice.channel.join()
            .then(connection => {
                // play music
                const stream = ytdl(args[0], { filter: 'audioonly' });
                const dispatcher = connection.play(stream);
                dispatcher.on('end', () => {
                    msg.member.voice.channel.leave();
                });
            }) 
            .catch(console.error);
            msg.channel.send(console.error);
    }         

    //create a command that pauses the music
    if (command === 'pause') {
        // check if the user has the permission to pause the music
        if (!msg.member.voice.channel) {
            msg.reply('Aby zatrzymać muzykę, musisz być na kanale głosowym!');
            return;
        }
        msg.member.voice.channel.join()
            // pause the music
            .then(connection => {
                const stream = ytdl(args[0], { filter: 'audioonly' });
                const dispatcher = connection.play(stream);
                dispatcher.pause()   // pause the music
            })
            .catch(console.error);
            msg.channel.send(console.error);

    }

    //create a command that resumes the music
    if (command === 'resume') {
        // check if the user has the permission to resume the music
        if (!msg.member.voice.channel) {
            msg.reply('Aby wznowić muzykę, musisz być na kanale głosowym!');
            return;
        }
        msg.member.voice.channel.join()
            // resume the music
            .then(connection => {
                const stream = ytdl(args[0], { filter: 'audioonly' });
                const dispatcher = connection.play(stream);
                dispatcher.resume(true)   // resume the music
            })
            .catch(console.error);
            msg.channel.send(console.error);
    }



    // leave the voice channel that the user is in
    if (command === 'leave') {
        // check if the user has the permission to join the voicechannel
        if (!msg.member.voice.channel) {
            msg.reply('You need to be in a voice channel to leave!');
            return;
        }
        // leave the user's voicechannel
        msg.member.voice.channel.leave();
        msg.reply('Opuszono kanał głosowy!');
    }

    //display server info in an embed
    if (command === 'serverinfo') {
        const embed = new Discord.MessageEmbed()
            .setTitle(`${msg.guild.name}'s info`)
            .setColor(0x00AE86)
            .addField('ID', msg.guild.id)
            .addField('Created At', msg.guild.createdAt)
            .addField('Owner', msg.guild.owner)
            .addField('Region', msg.guild.region)
            .addField('Members', msg.guild.memberCount)
            .addField('Roles', msg.guild.roles.cache.map(role => role.name).join(', '))
            .setThumbnail(msg.guild.iconURL())
        msg.channel.send({ embed });
    }

    //create a help command in a embed
    if (command === 'help') {
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Help')
            .setDescription('This is a list of commands!')
            .addFields(
                { name: 'sh!ping', value: 'Pings the bot!' },
                { name: 'sh!kick', value: 'wyrzuca osobe z serwera' },
                { name: 'sh!ban', value: 'Banuje osobe z serwera!' },
                { name: 'sh!mute', value: 'Wiczisza osobe' },
                { name: 'sh!serverinfo', value: 'wyświetla informacje o serwerze' },
                { name: 'sh!join', value: 'Plays music in the arguments of command!' },
                { name: 'sh!play', value: 'Plays music in the arguments of command!' },
                { name: 'sh!leave', value: 'Leaves the voicechannel that the user is in!' },
                { name: 'sh!help', value: 'Shows this help!' }
            )
            .setTimestamp()
            .setFooter('bot stworzony przez shadow man™#');
        msg.channel.send(embed);
    }

});



