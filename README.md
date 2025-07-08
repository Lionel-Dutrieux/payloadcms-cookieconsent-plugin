# Payload CMS Cookie Consent Plugin

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/your-repo/payloadcms-cookieconsent-plugin/blob/main/LICENSE)

A powerful, self-hosted cookie consent solution for [Payload CMS](https://payloadcms.com/). This plugin provides a complete system for managing cookie and script consent on your website, ensuring compliance with privacy regulations without relying on external services like Cookiebot.

## Features

- **Self-Hosted & Independent**: No external dependencies on third-party services. Keep all your data in-house.
- **Granular Consent Management**: Define script categories (e.g., necessary, marketing, analytics) and let users choose what they consent to.
- **Payload-Native UI**: Manage all settings directly from your Payload admin panel.
- **Developer Friendly**: Easy to configure and integrate into your Payload project.
- **Customizable Banner**: The consent banner can be styled to match your website's design.
- **Consent Logging**: Keep a record of user consent choices.
- **Multi-language support**: Integrates with Payload's localization to display the banner in the user's language.

## Installation

```bash
pnpm install payloadcms-cookieconsent-plugin
```

## How to Use

### 1. Add the Plugin to Your Payload Config

In your `payload.config.ts` file, import and add the plugin to the `plugins` array.

```typescript
// payload.config.ts
import { buildConfig } from 'payload/config';
import { payloadcmsCookieconsentPlugin } from 'payloadcms-cookieconsent-plugin';

export default buildConfig({
  // ... your other config
  plugins: [
    payloadcmsCookieconsentPlugin({
      // Plugin options go here
    }),
  ],
});
```

### 2. Add the Provider to Your Layout

To display the cookie consent banner and inject scripts based on user consent, you need to add the `CookieConsentProvider` to your website's layout. This is typically done in your root `layout.tsx` file.

```typescript
// app/layout.tsx
import React from 'react';
import { CookieConsentProvider } from 'payloadcms-cookieconsent-plugin/rsc';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

type Args = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Args) => {
  const payload = await getPayload({ config: configPromise });

  return (
    <html>
      <body>
        {children}
        <CookieConsentProvider payload={payload} locale='en' />
      </body>
    </html>
  );
};

export default Layout;
```

### 3. Configure Scripts in the Payload Admin

After installing the plugin, you will find a new "Cookie Consent Settings" global in your Payload admin panel. Here you can:

- **Enable/Disable the consent banner.**
- **Customize the banner text and buttons.**
- **Add and categorize scripts.**

When adding a script, you can choose from the following categories, which are seeded by default:

- **Necessary**: Essential scripts that are always loaded.
- **Marketing**: Scripts for marketing and advertising purposes.
- **Analytics**: Scripts for analytics and tracking.

For each script, you can specify its content (e.g., a Google Analytics snippet) and where it should be placed (head or body).

### 4. Add Scripts Directly in Your Project (Alternative)

For scripts that are an integral part of your application, you can embed them directly using the `ConsentScript` component. This is useful for scripts that you manage within your codebase rather than in the Payload admin panel.

The component ensures that the script is only rendered if the user has given consent for the specified category.

```typescript
// app/MyComponent.tsx
import { ConsentScript } from 'payloadcms-cookieconsent-plugin/rsc';

const MyComponent = () => {
  return (
    <div>
      {/* Other component content */}
      <ConsentScript category="analytics" service="Google Analytics">
        {`
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-XXXXX-Y', 'auto');
          ga('send', 'pageview');
        `}
      </ConsentScript>
    </div>
  );
};

export default MyComponent;
```

**Props:**

*   `category`: (Required) The consent category for the script. Can be `necessary`, `analytics`, or `marketing`. The script will only be injected if consent is given for this category.
*   `service`: (Optional) The name of the service the script belongs to (e.g., "Google Analytics", "Facebook Pixel"). If provided, this name will be displayed in the cookie consent banner, allowing users to see which services are used in each category.

This approach provides a clear and maintainable way to manage consent for scripts that are tightly coupled with your application's code.

## Roadmap

- [ ] More banner customization options from the admin panel.
- [ ] Support for more script placement options.
- [ ] Detailed documentation on advanced customization.
- [ ] Theming options for the consent banner.

## GDPR, Consent Logging, and Data Privacy

This plugin helps you comply with GDPR and other privacy regulations by managing user consent for cookies and scripts. Here’s what you need to know:

### Free to Use, Manual Management

This plugin is completely free to use. However, it's important to understand that it does not automatically detect scripts on your website. You are responsible for manually adding and categorizing all scripts through the Payload admin panel or by using the `<ConsentScript>` component in your code.

This is a key difference from services like Cookiebot, which automatically scan your site and block scripts. With this plugin, you have full control, but you must be diligent in ensuring all non-essential scripts are correctly configured to respect user consent.

### What is Logged?

When a user makes a choice in the consent banner, a record is created in the "Consent Records" collection in your Payload database. For each consent action, the following information is stored:

*   **Consent ID**: A unique identifier for the user's consent session, stored in a cookie.
*   **User**: If the user is logged in, their user ID is associated with the consent record.
*   **Timestamp**: The date and time of the consent action.
*   **Action**: The type of action (e.g., granted, modified, withdrawn).
*   **Accepted & Rejected Categories**: Which script categories the user consented to or rejected.
*   **User Agent**: The user's browser information.
*   **IP Address**: The user's IP address is stored in an anonymized format.
*   **Revision**: A number that tracks changes to the consent settings.

This log provides a verifiable audit trail of consent, which is a key requirement of the GDPR.

### GDPR Compliance

While this plugin provides the tools to be GDPR compliant, compliance is ultimately your responsibility. Here are a few key points:

*   **Lawful Basis for Processing**: You must have a lawful basis for processing user data. For non-essential scripts, that basis is consent.
*   **Informed Consent**: Users must be clearly informed about what they are consenting to. Use the banner text and service descriptions to explain why you are using certain scripts.
*   **Right to Withdraw**: Users can change their consent settings at any time. The plugin handles this by allowing users to re-open the consent banner.
*   **Data Minimization**: Only collect the data you need. This plugin anonymizes IP addresses to help with this.

By using this plugin correctly and being transparent with your users, you can build a privacy-friendly website that respects user choice.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License.
