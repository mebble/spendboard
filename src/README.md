<!-- This README file is going to be the one displayed on the Grafana.com website for your plugin -->

# Spendboard

A datasource for your expenses on notion.

## Features

- Get timeseries data of your expenses from a Notion database.
- Filter expenses based on tags
- Get your expenses in daily-amortised form
- Comes with a dashboard having preset panels

## Installation

1. Create a Notion database with the following schema and copy the database ID from the URL.

![Notion schema](https://raw.githubusercontent.com/mebble/spendboard/main/src/img/notion-schema.png)

2. Create a [Notion internal integration](https://www.notion.so/help/create-integrations-with-the-notion-api#create-an-internal-integration) and copy the integration secret. Then [connect the integration](https://www.notion.so/help/add-and-manage-connections-with-the-api#add-connections-to-pages) to the database you created above.
3. In the plugin setup page, enter your Notion database ID and Notion integration secret.

![Plugin setup page](https://raw.githubusercontent.com/mebble/spendboard/main/src/img/plugin-setup.png)

4. Optionally, you can download a sample dashboard that demonstrates several of the possible panels that can be created.

## Usage

When setting up a panel, you can query the Spendboard datasource through the query editor.

- By default, each query will return all expenses from Notion within the given time range in descending order.

![Graph of all expenses](https://raw.githubusercontent.com/mebble/spendboard/main/src/img/expenses-all.png)

- You can filter the expenses based on their tags and their name. The tags dropdown menu will display all the tags found in your Notion database.

![Graph of filtered expenses](https://raw.githubusercontent.com/mebble/spendboard/main/src/img/expenses-filtered.png)

- You can also transform the expenses to a daily-amortised form.

![Graph of amortised expenses](https://raw.githubusercontent.com/mebble/spendboard/main/src/img/expenses-amortised.png)
