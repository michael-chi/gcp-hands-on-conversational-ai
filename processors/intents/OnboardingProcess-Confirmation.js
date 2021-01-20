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

        app.intent('automation.new-hire.onboarding - no', async (conv, params) => {
            var paramaters = {
                'user_name': "",
                'user_name.original': "",
                'user_dep': "",
                'user_dep.original': "",
                'date-time': "",
                'date-time.original': ""
            };
            conv.ask('好的, 那麼請重新提供資料');
            conv.followup('get_user_info',paramaters);
        });
    }
}