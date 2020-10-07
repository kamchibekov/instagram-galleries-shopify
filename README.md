# instagram-galleries-shopify
Show Instagram pictures as a gallery on your Shopify website

### 1. npm install

### 2 .env file should be created in the root folder with these constants in it:

```
DOMAIN="your domain"
DB_URL="Mongo DB url. We used Mlab"
SHOPIFY_API_KEY="Your app's API KEY from Shopify Partner Dashboard"
SHOPIFY_API_SECRET="Your app's SECRET KEY from Shopify Partner Dashboard"
SHOPIFY_SCOPES="write_content,write_themes,read_products,read_customers,write_script_tags"
PORT="Example: 3000"
ENVIRONMENT="development or production"
FB_API_KEY="Facebook API KEY"
FB_API_SECRET="Facebook SECRET KEY"
FB_CALLBACK="your domain/fb/callback"
FB_SCOPES="instagram_basic,pages_manage_ads,pages_manage_metadata,pages_read_engagement,pages_read_user_content,instagram_manage_insights,pages_show_list"
FB_GRAPH_URL="https://graph.facebook.com/"
FB_GRAPH_VERSION="v7.0"
SENTRY_DSN="This is optional. If you want you can track bugs"
```

### 3. npm start


