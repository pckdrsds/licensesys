import { SlashCommandBuilder } from 'discord.js';

import * as fs from "fs";
import request from "request";
import { PackTweaks } from "../index.js"
function download(url, filename){
    request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream(filename));
}
const choices = [
    { name: "ICON", value: "ICON" },
    { name: "ENTITIES", value: "ENTITIES" },
    { name: "FONT", value: "FONT" },
    { name: "SOUNDS", value: "SOUNDS" },
    { name: "MISC", value: "MISC" },
    { name: "SKY", value: "SKY" },
    { name: "PARTICLES", value: "PARTICLES" },
    { name: "ITEMS", value: "ITEMS" }, // This line adds the choice for "ITEMS"
    { name: "BLOCKS", value: "BLOCKS" },
    { name: "GUI", value: "GUI" },
    { name: "OPTIFINE", value: "OPTIFINE" },
    { name: "MODELS", value: "MODELS" },
    { name: "OTHER", value: "OTHER" }
  ];

export const data = new SlashCommandBuilder()
		.setName('createpacktweak')
		.setDescription('Create a Pack Tweak')
    
        .addStringOption(option =>
            option.setName("name")
                .setDescription("Name of the packtweak")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("description")
                .setDescription("Description of the packtweak")
                .setRequired(true)) 
        .addStringOption(option => {
            option.setName("type")
                .setDescription("Type of the packtweak")
                .setRequired(true)
        
            choices.forEach(val => {
                option.addChoices(val);
            })
            
            return option;
        })
        .addNumberOption(option => 
            option.setName("packformat")
                .setDescription("Pack format")
                .setRequired(true))
        .addAttachmentOption(option =>
                option.setName("image")
                    .setDescription("Image of the packtweak")
                    .setRequired(true)) 
        .addAttachmentOption(option =>
            option.setName("file")
                .setDescription("file of the packtweak")
                .setRequired(true)) 
export async function execute(interaction) {
        let lastindex = 0;
        for(let i = 0; i < 1_000_000_000; i++) {
            let s = ""+i
            if(!PackTweaks.getObject()[s]) {
                break;
            };
            lastindex = i;
        }
        /*
        '32': {
    name: 'DiamondBreakingAnimations',
    type: 'BLOCKS',
    filename: 'DiamondBreakingAnimations.zip',
    description: '§cDiamond §7Breaking §fOverlay\n§7Block breaking overlay.',
    'mini-image': 'https://i.imgur.com/lrbDCee.png',
    'pack-format': 1
  }
  */
        let name = interaction.options.getString("name")
        let type = interaction.options.getString("type")
        let file = interaction.options.getAttachment("file");
        let fileURL = file.url;
        let filename = file.name;
        download(fileURL, "./packcreator/packs/"+filename)
        let description = interaction.options.getString("description")
        let imageraw = interaction.options.getAttachment("image")
        if(!imageraw.contentType.includes('image')) {
            await interaction.reply('Wrong image!');
            return;
        }
        let image = imageraw.url;
        let pack_format = interaction.options.getNumber("packformat")

        const obj = {
            "name": name,
            "type": type,
            "filename": filename, 
            "description": description, 
            "mini-image": image,
            "pack-format": pack_format
        }
        PackTweaks.add(lastindex+1, obj);

		await interaction.reply('Done!');
	}
