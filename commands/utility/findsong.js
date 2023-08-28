const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require ('dotenv')
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1'
const accessToken = process.env.ACCESS_TOKEN

module.exports = {
    data : new SlashCommandBuilder()
    .setName('findsong')
    .setDescription('Find a song using spotift API')
    .addStringOption(option => option.setName('name').setDescription('Name of music')),
    async execute(interaction){
        const pilihan = interaction.options.getString('name');

        try {
            const response = await axios.get(
                `${SPOTIFY_API_BASE_URL}/search?q=${encodeURIComponent(pilihan)}&type=track`,
                {
                    headers : {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )

            const track = response.data.tracks.items[0];
            console.log(track)
            if(track){
                const found = new EmbedBuilder() 
                .setTitle('Spotify Song Search')
                .addFields(
                    {name: 'Song', value: track.name},
                    {name: 'Artist', value: track.artists.map(artist => artist.name).join(', ')},
                    {name: 'Album', value: track.album.name},
                    {name: 'Preview URL', value: track.preview_url})
                    .setThumbnail(track.album.images[1].url)
                    .setTimestamp()
                    .setColor('#00FF00')
			        .setFooter({ text: `requested by ${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` });
                return interaction.reply({ embeds: [found] });
            } else {
                return interaction.reply("data tidak di temukan")
            }

        
        } catch (error) {
            console.error('Error searching for song:', error);
            interaction.reply('An error occurred while searching for the song.');
        }
    }


}