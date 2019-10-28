function GetLanguageCode(language) {
    switch (language) {
        case '日文':
        case '日語':
            return 'ja-JP';
        case '韓語':
        case '韓文':
            return 'ko-KR';
        case '英文':
        case '英語':
            return 'en-US';
        case '德文':
        case '德語':
            return 'de-DE';
        case '法語':
        case '法文':
            return 'fr-FR';
        case '俄語':
        case '俄文':
            return 'ru-RU';
        case '中文':
        case '國語':
            return 'zh-TW';
    }
    return 'en-US';
}

module.exports = GetLanguageCode;