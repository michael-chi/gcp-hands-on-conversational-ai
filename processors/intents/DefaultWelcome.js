const {
    Permission
} = require('actions-on-google');

module.exports = {
    setup: function (app) {
        app.intent('Default Welcome Intent', (conv) => {
            const permissions = ['NAME'];
            // https://developers.google.com/actions/assistant/guest-users
            if (conv.user.verification === 'VERIFIED') {
                // Could use DEVICE_COARSE_LOCATION instead for city, zip code
                permissions.push('DEVICE_PRECISE_LOCATION');
            }
            let context = '';
            const options = {
                context,
                permissions,
            };
            conv.ask(new Permission(options));
        });

        app.intent('Default Welcome Intent - yes', (conv, params, confirmationGranted) => {
            //  ** This Event handler is triggered by Event setting in an Intent
            console.log(JSON.stringify(conv));
            const { location } = conv.device;
            const { name } = conv.user;
            if (confirmationGranted && name && location) {
                conv.ask(`好的， ${name.display}, 我將您的上車地點設定為 ` +
                    `${location.formattedAddress}`);
                conv.ask(`請告訴我您的目的地`);
            } else {
                conv.ask(`很抱歉，我需要您的地址才能為您服務`);
                conv.close();
            }
        });
    }
}