'use strict';

//import {Translator} from '../processors/cloud_translator'
const Translator = require('../processors/Translator');
const projectId = 'healthy-genre-254502';
const location = 'global';
const GetLanguageCode = require('../processors/LanguageCodeConverter');

var translator = new Translator(
    {
        targetLanguageCode:GetLanguageCode('日語'),
        projectId:projectId, 
        location:location,
        keyFile:'../keys/QiwiLab - Sample Project - Translation API - 2c2b3f00d59d.json'
    });
translator.translateText('我愛你').then(v => console.log(`got:${v}`));

