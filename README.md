# ⚠️ Project Status: Proof of Concept (POC)

**This project is a proof of concept (POC) and is _not_ a maintained plugin.**

While it may be useful for others exploring cookie consent solutions with Payload CMS and Next.js, please note that it is not production-ready or actively maintained. I'm new to both Next.js and Payload CMS—feedback, contributions, pull requests, and advice on architecture or technology choices are very welcome!

---

# Payload CMS Cookie Consent Plugin

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/your-repo/payloadcms-cookieconsent-plugin/blob/main/LICENSE)

---

**About this plugin**

This plugin combines the power of [CookieConsent v3](https://cookieconsent.orestbida.com/) for frontend consent management with [Payload CMS](https://payloadcms.com/) for backend configuration and consent logging. 

- **Frontend:** Uses CookieConsent v3 under the hood to display the consent banner, manage user choices, and block/unblock scripts according to user consent. All script blocking and consent UI logic is handled by CookieConsent v3, a robust and widely adopted open-source solution.
- **Backend:** Leverages Payload CMS to provide an admin UI for configuring categories, scripts, and banner content, and to log user consent actions for compliance (e.g., GDPR).

With this approach, you get a modern, customizable, and self-hosted cookie consent solution that is easy to manage and fully compliant.

---

## Features

- **Self-Hosted & Independent**: No external dependencies on third-party services. Keep all your data in-house.
- **Granular Consent Management**: Define script categories (e.g., necessary, marketing, analytics) and let users choose what they consent to.
- **Payload-Native UI**: Manage all settings directly from your Payload admin panel.
- **Developer Friendly**: Easy to configure and integrate into your Payload project.
- **Customizable Banner**: The consent banner can be styled to match your website's design.
- **Consent Logging**: Keep a record of user consent choices.
- **Multi-language support**: Integrates with Payload's localization to display the banner in the user's language.


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

## 4. Adding Scripts Requiring Consent

To add scripts that respect user consent, simply use native script tags with the correct attributes, as recommended by [CookieConsent v3](https://cookieconsent.orestbida.com/advanced/manage-scripts.html):

```html
<!-- Analytics script blocked until the user has given consent -->
<script
  type="text/plain"
  data-category="analytics"
  data-service="Google Analytics"
  src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXX-Y"
></script>

<!-- Inline marketing script -->
<script type="text/plain" data-category="marketing">
  // Your marketing code here
</script>

<!-- Necessary script (always loaded) -->
<script data-category="necessary">
  // Your necessary code here
</script>
```

- `type="text/plain"` blocks execution until the user has given consent.
- `data-category` specifies the consent category ("necessary", "analytics", "marketing", etc.).
- `data-service` (optional) specifies the service (e.g., "Google Analytics").
- Use `src` for external scripts or inline content as needed.

For more examples and advanced options, see the [official CookieConsent v3 documentation](https://cookieconsent.orestbida.com/advanced/manage-scripts.html).

## 5. Using Custom Attributes to Control the Consent Banner

CookieConsent v3 provides a convenient way to control the consent banner and modals using custom HTML attributes, without writing any JavaScript. You can use the `data-cc` attribute on any button or link to trigger core consent actions.

**Examples:**

```html
<!-- Open the preferences modal -->
<button type="button" data-cc="show-preferencesModal">Manage cookie preferences</button>

<!-- Open the consent modal -->
<button type="button" data-cc="show-consentModal">Show consent banner</button>

<!-- Accept all categories -->
<button type="button" data-cc="accept-all">Accept all cookies</button>

<!-- Accept only necessary categories -->
<button type="button" data-cc="accept-necessary">Accept only necessary</button>

<!-- Accept the current selection in the preferences modal -->
<button type="button" data-cc="accept-custom">Accept selection</button>
```

For a full list of available actions and more details, see the [CookieConsent v3 Custom Attribute documentation](https://cookieconsent.orestbida.com/advanced/custom-attribute.html).

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
