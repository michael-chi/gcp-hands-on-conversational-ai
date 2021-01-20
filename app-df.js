
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
var express = require('express')
var bodyParser = require('body-parser')

const expressApp = express().use(bodyParser.json());
function getExistingIntents(conv) {
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
function updateContexts(agent, existingSlotFillingContexts, parameter_intent_name, follow_up_intentName, idDialogContextIntent, nameDialogContext, paramaters) {
    // Delete slot filling contexts for other parameters
    existingSlotFillingContexts.forEach(contextName => agent.deleteContext(contextName));
    // agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }}); 
    agent.setContext({name:parameter_intent_name, lifespan:1, parameters:paramaters});
    agent.setContext({name:follow_up_intentName, lifespan:1, parameters:paramaters});
    agent.setContext({name:idDialogContextIntent, lifespan:2, parameters:paramaters});
    agent.setContext({name:nameDialogContext, lifespan:2, parameters:paramaters});
}
function onboarding(agent) {
    let conv = agent.conv(); // Get Actions on Google library conv instance
    params = agent.request_.body.queryResult.outputContexts[0].parameters;
    console.log(JSON.stringify(params));

    const intentName = conv.intent
        .trim()
        .toLowerCase()
        .replace(/\s/g, "_");
    
        console.log(intentName);

    let intentNames = conv.body.queryResult.intent.name.split('/');

    let idDialogContext = `${intentNames[intentNames.length - 1]}_id_dialog_context`;
    let nameDialogContext = `${intentName}_id_dialog_context`;

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

        agent.add(`${name}已經報到過了, 請提供正確的姓名`);
        paramaters.user_name = '';
        paramaters.user_name.original = '';
        updateContexts(agent, existingSlotFillingContexts,
            'automation_new-hire_onboarding_dialog_params_user_name',
            'automationnew-hireonboarding-followup',
            idDialogContext,
            nameDialogContext,
            paramaters);

    } else if (!name) {
        missingSlots.push('user_name');
        missing_prompt += '姓名,';

        updateContexts(agent, existingSlotFillingContexts,
            'automation_new-hire_onboarding_dialog_params_user_name',
            'automationnew-hireonboarding-followup',
            idDialogContext,
            nameDialogContext,
            paramaters);
        agent.add('請提供以下資訊：' + missing_prompt);
    }
    else if (!datetime) {
        missingSlots.push('date-time');
        missing_prompt += '報到時間,';

        updateContexts(agent, existingSlotFillingContexts,
            'automation_new-hire_onboarding_dialog_params_date-time',
            'automationnew-hireonboarding-followup',
            idDialogContext,
            nameDialogContext,
            paramaters);
        agent.add('請提供以下資訊：' + missing_prompt);
    }
    else if (!user_dep) {
        missingSlots.push('user_dep');
        missing_prompt += '部門,';
        updateContexts(agent, existingSlotFillingContexts,
            'automation_new-hire_onboarding_dialog_params_user_dep',
            'automationnew-hireonboarding-followup',
            idDialogContext,
            nameDialogContext,
            paramaters);
        agent.add('請提供以下資訊：' + missing_prompt);

    }
    else {
        agent.add(`<speak>了解, ${name}將於<say-as interpret-as="date" format="yyyymmdd" detail="1">${datetime}</say-as>向<say-as interpret-as="characters">${user_dep}</say-as>報到, 請問這個資訊正確嗎？</speak>`);
    }
    agent.add(conv);
}





expressApp.post('/fulfillment', (req,res) => {
    console.log(JSON.stringify(req.body));
    const agent = new WebhookClient({
        request: req,
        response: res
      });
    let intentMap = new Map();
    intentMap.set('automation.new-hire.onboarding', onboarding);
    agent.handleRequest(intentMap);
});
expressApp.listen(8080);    //  Cloud Run now only supports port 8080
console.log(`express server listening on port 80...`);