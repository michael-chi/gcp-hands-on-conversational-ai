'use strict';

//import {Translator} from '../processors/cloud_translator'
const Translator = require('../processors/Translator');
const projectId = 'kalschi-demo-001';
const location = 'global';
const GetLanguageCode = require('../processors/LanguageCodeConverter');

var translator = new Translator(
    {
        targetLanguageCode:GetLanguageCode('日語'),
        projectId:projectId, 
        location:location,
        keyFile:'../keys/kalschi-demo-001-1ed2581b433f.json'
    });
translator.translateText('我愛你').then(v => console.log(`got:${v}`));

