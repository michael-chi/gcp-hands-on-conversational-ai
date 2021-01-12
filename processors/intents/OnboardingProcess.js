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
        function getExistingIntents(conv){
            const slotFillingRegex = /.*contexts\/(?<contextName>.*dialog_params.*)/;
            let existingSlotFillingContexts = [];
            for (const context of conv.contexts) {
                const isSlotFillingContext = slotFillingRegex.test(context.name);
                if (isSlotFillingContext) {
                    const match = slotFillingRegex.exec(context.name);
                    existingSlotFillingContexts.push(match.groups.contextName);
                }
            }
            return existingSlotFillingContexts;
        }
        function updateContexts(conv, existingSlotFillingContexts, parameter_intent_name, follow_up_intentName, idDialogContextIntent, nameDialogContext, paramaters){
            // Delete slot filling contexts for other parameters
            existingSlotFillingContexts.forEach(contextName => conv.contexts.delete(contextName));
            
            conv.contexts.set(parameter_intent_name, 1, paramaters);
            conv.contexts.set(follow_up_intentName, 1, paramaters);
            conv.contexts.set(idDialogContextIntent, 2, paramaters);
            conv.contexts.set(nameDialogContext, 2, paramaters);
        }
        //  Customer is requesting a Taxi
        //  1.  Construct destination information
        //  2.  Get destination location via Google Map API and respond to user
        //  3.  Wait user confirmation
        app.intent('automation.new-hire.onboarding', async (conv, params) => {

            try {
                console.log('====>conv.body.queryResult.intent');
                console.log(conv.body.queryResult.intent.name);
            } catch {

            }

            const intentName = conv.intent
                .trim()
                .toLowerCase()
                .replace(/\s/g, "_");

            let intentNames = conv.body.queryResult.intent.name.split('/');

            let idDialogContext = `${intentNames[intentNames.length - 1]}_id_dialog_context`;
            let nameDialogContext = `${intentName}_id_dialog_context`;
            //let nameDialogContext2 = `${conv.intent}_dialog_context`;

            console.log(`context=>>${idDialogContext}|${nameDialogContext}`);
            const [name, datetime, user_dep] = [params['user_name'], params['date-time'], params['user_dep']];
            console.log(`${name}|${datetime}|${user_dep}`);
            let missingSlots = [];
            var missing_prompt = '';

            var paramaters = {
                'user_name': name,
                'user_name.original': name,
                'user_dep': user_dep,
                'user_dep.original': user_dep,
                'date-time': datetime,
                'date-time.original': datetime
            };
            
            existingSlotFillingContexts = getExistingIntents(conv);

            if (name == '王大一') {
                console.log('name is Invalid');

                conv.ask(`${name}已經報到過了, 請提供正確的姓名`);
                paramaters.user_name = '';
                paramaters.user_name.original = '';
                updateContexts(conv, existingSlotFillingContexts,
                    'automation_new-hire_onboarding_dialog_params_user_name',
                    'automationnew-hireonboarding-followup',
                    idDialogContext,
                    nameDialogContext,
                    paramaters);

            } else if (!name) {
                missingSlots.push('user_name');
                missing_prompt += '姓名,';

                updateContexts(conv, existingSlotFillingContexts,
                    'automation_new-hire_onboarding_dialog_params_user_name',
                    'automationnew-hireonboarding-followup',
                    idDialogContext,
                    nameDialogContext,
                    paramaters);
                conv.ask('請提供以下資訊：' + missing_prompt);
            }
            else if (!datetime) {
                missingSlots.push('date-time');
                missing_prompt += '報到時間,';

                updateContexts(conv, existingSlotFillingContexts,
                    'automation_new-hire_onboarding_dialog_params_date-time',
                    'automationnew-hireonboarding-followup',
                    idDialogContext,
                    nameDialogContext,
                    paramaters);
                conv.ask('請提供以下資訊：' + missing_prompt);
            }
            else if (!user_dep) {
                missingSlots.push('user_dep');
                missing_prompt += '部門,';

                updateContexts(conv, existingSlotFillingContexts,
                    'automation_new-hire_onboarding_dialog_params_user_dep',
                    'automationnew-hireonboarding-followup',
                    idDialogContext,
                    nameDialogContext,
                    paramaters);
                conv.ask('請提供以下資訊：' + missing_prompt);                
                
            }
            else {
                conv.ask(`<speak>了解, ${name}將於<say-as interpret-as="date" format="yyyymmdd" detail="1">${datetime}</say-as>向<say-as interpret-as="characters">${user_dep}</say-as>報到, 請問這個資訊正確嗎？</speak>`);
            }
        });
    }
}