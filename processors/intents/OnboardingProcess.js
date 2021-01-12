const {
    Image,
    BasicCard,
    Button,
    Confirmation,
    Suggestions
} = require('actions-on-google');

//  https://github.com/actions-on-google/actions-on-google-nodejs/issues/345
module.exports = {
    setup: async function (app) {
        //  Customer is requesting a Taxi
        //  1.  Construct destination information
        //  2.  Get destination location via Google Map API and respond to user
        //  3.  Wait user confirmation
        app.intent('automation.new-hire.onboarding', async (conv, params) => {
            console.log('====>conv');
            console.log(`${a} | ${b} | ${c}`)
            console.log(JSON.stringify(conv));
            console.log('====>conv 2');
            console.log(`${conv}`);
            try{
                console.log('====>conv.body');
                console.log(conv.body);
                console.log('====>conv.body.queryResult.intent');
                console.log(conv.body.queryResult.intent);            
            }catch{

            }
            console.log('====>app');
            console.log(JSON.stringify(app));
            console.log('====>');
            const intentName = conv.intent
                    .trim()
                    .toLowerCase()
                    .replace(/\s/g, "_");
            //let idDialogContext = `${conv.intent.}_id_dialog_context`;
            let nameDialogContext = `${intentName}_dialog_context`;

            const [name, datetime, user_dep] = [params['user_name'], params['date-time'], params['user_dep']];
            console.log(`${name}|${datetime}|${user_dep}`);
            let missingSlots = [];
            var missing_prompt = '';
            if (!name) {
                missingSlots.push('user_name');
                missing_prompt += '姓名,';
                conv.contexts.set('automation_new-hire_onboarding_dialog_params_user_name', 1, { 'user_name': '' });
                //conv.contexts.set(idDialogContext, 2);
                conv.contexts.set(nameDialogContext, 2);
                conv.ask('請提供以下資訊：' + missing_prompt);
            }
            else if (!datetime) {
                missingSlots.push('date-time');
                missing_prompt += '報到時間,';
                conv.contexts.set('automation_new-hire_onboarding_dialog_params_date-time', 1, { 'date-time': '' });
                //conv.contexts.set(idDialogContext, 2);
                conv.contexts.set(nameDialogContext, 2);
                conv.ask('請提供以下資訊：' + missing_prompt);
            }
            else if (!user_dep) {
                missingSlots.push('user_dep'); 
                missing_prompt += '部門,';
                conv.contexts.set('automation_new-hire_onboarding_dialog_params_user_dep', 1, { 'user_dep': '' });
                //conv.contexts.set(idDialogContext, 2);
                conv.contexts.set(nameDialogContext, 2);
                conv.ask('請提供以下資訊：' + missing_prompt);
            }
            else if (name == '王大一') {
                console.log('name is Invalid');
                conv.ask(`${name}已經報到過了, 請提供正確的姓名`);
                params['user_name'] = '';
                conv.contexts.set('automation_new-hire_onboarding_dialog_params_user_name', 1, { 'user_name': '' });
                //conv.contexts.set(idDialogContext, 2);
                conv.contexts.set(nameDialogContext, 2);
                
            } else {
                conv.ask(`<speak>了解, ${name}將於<say-as interpret-as="date" format="yyyymmdd" detail="1">${datetime}</say-as>向<say-as interpret-as="characters">${user_dep}</say-as>報到, 請問這個資訊正確嗎？</speak>`);
            }
        });
    }
}