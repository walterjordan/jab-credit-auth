{
  "name": "JaB Credit Auth → Businesses link → Credit Authorizations",
  "flow": {
    "rootModuleId": "1",
    "modules": [
      {
        "id": "1",
        "module": "webhooks",
        "version": 2,
        "name": "Webhook — JaB Credit Auth",
        "operation": "customWebhook",
        "parameters": { "hookName": "JaB Credit Auth" }
      },
      {
        "id": "2",
        "module": "airtable",
        "version": 2,
        "name": "Airtable — Search Business by Name",
        "operation": "searchRecords",
        "parameters": {
          "baseId": "",
          "tableId": "",
          "formula": "Name = \"{{1.output.body.business}}\"",
          "maxRecords": 1
        }
      },
      {
        "id": "3",
        "module": "router",
        "version": 1,
        "name": "Router"
      },
      {
        "id": "4",
        "module": "airtable",
        "version": 2,
        "name": "Airtable — Create Business (if not found)",
        "operation": "createRecord",
        "parameters": {
          "baseId": "",
          "tableId": "",
          "typecast": true,
          "record": {
            "map": true,
            "fields": {
              "Name": "{{1.output.body.business}}"
            }
          }
        }
      },
      {
        "id": "5",
        "module": "airtable",
        "version": 2,
        "name": "Airtable — Create Credit Authorization",
        "operation": "createRecord",
        "parameters": {
          "baseId": "",
          "tableId": "",
          "typecast": true,
          "record": {
            "map": true,
            "fields": {
              "Business": [
                { "id": "{{2[1].id || 4.id}}" }
              ],
              "Purpose": "{{1.output.body.purpose}}",
              "Full Name": "{{1.output.body.fullName}}",
              "Billing Address": "{{1.output.body.billingAddress}}",
              "City, State, ZIP": "{{1.output.body.cityStateZip}}",
              "Phone": "{{1.output.body.phone}}",
              "Email": "{{1.output.body.email}}",
              "Card Type": "{{1.output.body.cardType}}",
              "Name on Card": "{{1.output.body.nameOnCard}}",
              "Expiration": "{{1.output.body.expiration}}",
              "Amount": "{{1.output.body.amount}}",
              "Date": "{{1.output.body.date}}",
              "Description": "{{1.output.body.description}}",
              "Recurring": "{{1.output.body.recurring}}",
              "Card Number Last 4": "{{1.output.body.cardNumberLast4}}",
              "App": "{{1.output.body.app}}",
              "Timestamp": "{{1.output.body.ts}}"
            }
          }
        }
      }
    ],
    "links": [
      { "from_module": "1", "to_module": "2" },
      { "from_module": "2", "to_module": "3" },
      { "from_module": "3", "to_module": "5", "condition": { "type": "if", "script": "length(module[2].output) > 0" } },
      { "from_module": "3", "to_module": "4", "condition": { "type": "else" } },
      { "from_module": "4", "to_module": "5" }
    ]
  },
  "metadata": {
    "instant": true,
    "version": 1
  }
}
