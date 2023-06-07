# https://superuser.com/questions/835587/how-to-include-environment-variable-in-bash-line-curl

curl -X POST "https://api.notion.com/v1/pages" \
  -H "Authorization: Bearer ${NOTION_TOKEN}" \
  -H "Content-Type: application/json" \
  -H "Notion-Version: 2022-06-28" \
  --data '{
        "parent": {
            "database_id": "'"$NOTION_DEMO_DB_ID"'"
        },
        "properties": {
            "Name": {
               "title": [{
                   "text": {
                       "content": "haha"
                    }
                }]
            },
           "Date": {
               "date": {
                   "start": "2023-06-07T09:18:50.451Z"
                }
            },
           "Amount": {
               "number": 101
            },
           "Category": {
               "multi_select": [
                    { "name": "Elephant" },
                    { "name": "Hal" }
                ]
            },
           "Comment": {
               "rich_text": [{
                   "text": {
                       "content": "Yoyo ma"
                    }
                }]
            }
        }
    }'
