
// Imports the Google Cloud Translation library
const {TranslationServiceClient} = require('@google-cloud/translate').v3beta1;
const fs = require('fs');
// Instantiates a client
class Translator {
    //keyFilename
    constructor(config) { 
        this.targetLanguageCode = config.targetLanguageCode;
        this.projectId = config.projectId;
        this.location = config.location;
        this.keyFile = config.keyFile;
        
        if(this.keyFile && fs.existsSync(this.keyFile))
            this.translationClient = new TranslationServiceClient({keyFilename:this.keyFile});
        else
            this.translationClient = new TranslationServiceClient();
    }
    async translateText(text) {
        // Construct request
        console.log(`${this.projectId} - ${this.location}`);
        const request = {
            parent: this.translationClient.locationPath(this.projectId, this.location),
            contents: [text],
            mimeType: 'text/plain', // mime types: text/plain, text/html
            /*sourceLanguageCode: 'en-US',*/
            targetLanguageCode: this.targetLanguageCode,
        };

        // Run request
        const [response] = await this.translationClient.translateText(request);

        for (const translation of response.translations) {
            console.log(`Translation: ${translation.translatedText}`);

            return `${translation.translatedText}`;
        }
    }
}
module.exports = Translator;