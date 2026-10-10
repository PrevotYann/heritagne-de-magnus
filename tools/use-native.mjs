import fs from 'node:fs';import {createHash}from 'node:crypto';
const draft=JSON.parse(fs.readFileSync('content/adventure.json')).documents[0];
const hash=createHash('sha256').update(JSON.stringify(draft)).digest('hex');
if(!fs.existsSync('sources/native/fingerprint.txt')||fs.readFileSync('sources/native/fingerprint.txt','utf8').trim()!==hash)throw Error('Contenu modifié : exécuter build:draft puis build:native dans le monde de validation Foundry avant la distribution.');
fs.copyFileSync('sources/native/adventure.json','content/adventure.json');console.log('Adventure native vérifiée restaurée.');
