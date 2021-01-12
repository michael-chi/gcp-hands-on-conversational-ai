const {
    Image,
    BasicCard,
    Button,
    Confirmation,
    Suggestions
} = require('actions-on-google');


module.exports = {
    setup: async function (app) {
        //  Customer is requesting a Taxi
        //  1.  Construct destination information
        //  2.  Get destination location via Google Map API and respond to user
        //  3.  Wait user confirmation
        app.intent('automation.new-hire.onboarding', async (conv, params) => {
            console.log('====>automation.new-hire.onboarding');
            const [name, datetime, user_dep] = [params['user_name'], params['date-time'], params['user_dep']];
            console.log(`${name}|${datetime}|${user_dep}`);
            let missingSlots = [];
            var missing_prompt = '';
            if (!name) { missingSlots.push('user_name'); missing_prompt += '姓名,'; }
            if (!datetime) { missingSlots.push('date-time'); missing_prompt += '報到時間,'; }
            if (!user_dep) { missingSlots.push('user_dep'); missing_prompt += '部門,'; }
            if (missing_prompt != '') {
                conv.ask('請提供' + missing_prompt);
            } else if (name == '王大一') {
                console.log('name is Invalid');
                conv.ask(`${name}已經onboard了`);
                params['user_name'] = '';
                app.setContext({'name':'automation_new-hire_onboarding_dialog_params_user_dep', 'lifespan': 1});
            } else {
                conv.ask('好的！');
            }
        });
    }
}