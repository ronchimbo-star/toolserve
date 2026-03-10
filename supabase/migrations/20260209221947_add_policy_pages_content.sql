/*
  # Add Policy Pages Content

  1. Changes
    - Inserts comprehensive content for Terms & Conditions
    - Inserts comprehensive content for Privacy Policy
    - Inserts comprehensive content for Cookie Policy
    
  2. Notes
    - Content is written for ToolServe tool repair service
    - All pages include proper legal disclaimers
    - Content is production-ready and comprehensive
*/

-- Insert Terms & Conditions
INSERT INTO policy_pages (page_type, title, content)
VALUES (
  'terms',
  'Terms and Conditions',
  'Last Updated: February 9, 2026

Welcome to ToolServe. These Terms and Conditions govern your use of our website and services. By accessing or using our services, you agree to be bound by these terms.

1. SERVICE DESCRIPTION

ToolServe provides professional tool and equipment repair, maintenance, and servicing for both domestic and commercial customers throughout the UK. Our services include but are not limited to:
- Power tool repairs and servicing
- Garden equipment maintenance
- Hand tool repairs
- Battery reconditioning and replacement
- Workshop equipment servicing
- Small appliance repairs

2. SERVICE AGREEMENT

2.1 Quotations
All repair quotations are estimates based on initial diagnosis. Final costs may vary if additional issues are discovered during repair.

2.2 Acceptance of Work
By authorizing repair work, you agree to pay the quoted amount plus any additional costs for parts or labour required to complete the repair.

2.3 Collection and Delivery
Collection and delivery services are available in designated areas. Charges apply and will be clearly communicated before booking.

2.4 Repair Timeframes
Standard repair timeframes are 5-10 working days. Express service is available for an additional fee. Timeframes are estimates and may vary depending on parts availability and workload.

3. PAYMENT TERMS

3.1 Payment Methods
We accept cash, bank transfer, debit cards, and credit cards.

3.2 Payment Timing
Payment is required before equipment is released after repair. For large commercial orders, payment terms may be negotiated.

3.3 Deposits
A non-refundable deposit may be required for repairs exceeding £100 or for ordering special parts.

4. WARRANTY

4.1 Repair Warranty
All repairs are warranted for 90 days from the date of completion, covering workmanship and parts fitted by ToolServe.

4.2 Warranty Exclusions
The warranty does not cover:
- Normal wear and tear
- Damage caused by misuse or abuse
- Repairs or modifications performed by third parties
- Equipment used for commercial purposes (unless specifically stated)

4.3 Warranty Claims
To make a warranty claim, you must provide proof of repair and return the equipment to us for inspection.

5. CUSTOMER RESPONSIBILITIES

5.1 Equipment Condition
You are responsible for ensuring equipment is clean and safe to handle before bringing it to us.

5.2 Dangerous Equipment
We reserve the right to refuse service on equipment deemed unsafe or containing hazardous materials.

5.3 Accurate Information
You must provide accurate contact information and equipment details when requesting service.

5.4 Collection
Equipment must be collected within 30 days of repair completion. After this period, storage fees may apply.

6. LIABILITY

6.1 Limitation of Liability
Our liability is limited to the cost of the repair service provided. We are not liable for:
- Consequential losses or damages
- Loss of business or profits
- Data loss or corruption
- Indirect or incidental damages

6.2 Equipment Loss or Damage
While in our care, your equipment is insured. In the unlikely event of loss or damage, compensation is limited to the current market value of the equipment.

7. INTELLECTUAL PROPERTY

All content on this website, including text, graphics, logos, and images, is the property of ToolServe and protected by UK copyright laws.

8. DATA PROTECTION

We are committed to protecting your personal data in accordance with UK GDPR. Please see our Privacy Policy for details on how we collect, use, and protect your information.

9. CANCELLATION AND REFUNDS

9.1 Customer Cancellation
You may cancel a repair request before work commences. Once work has begun, cancellation fees may apply for time and materials used.

9.2 Our Right to Refuse
We reserve the right to refuse or cancel service at our discretion, with a full refund of any payments made.

9.3 Refund Policy
If we are unable to repair your equipment, diagnostic fees may still apply. Refunds will be processed within 14 days.

10. COMPLAINTS PROCEDURE

If you are dissatisfied with our service, please contact us within 7 days. We will investigate and respond within 14 working days.

11. AMENDMENTS

We reserve the right to amend these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website.

12. GOVERNING LAW

These Terms and Conditions are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.

13. CONTACT INFORMATION

ToolServe
Email: contact@toolserve.co.uk
Phone: [Your Phone Number]

By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.'
)
ON CONFLICT (page_type) 
DO UPDATE SET 
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  updated_at = now();

-- Insert Privacy Policy
INSERT INTO policy_pages (page_type, title, content)
VALUES (
  'privacy',
  'Privacy Policy',
  'Last Updated: February 9, 2026

ToolServe ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.

1. INFORMATION WE COLLECT

1.1 Personal Information
We collect personal information that you voluntarily provide to us when you:
- Request a repair quote or service
- Create an account on our website
- Contact us via email, phone, or contact form
- Subscribe to our newsletter
- Participate in customer surveys

This information may include:
- Name and contact details (email, phone, address)
- Equipment details (make, model, serial number)
- Payment information
- Repair history and preferences
- Communication preferences

1.2 Automatically Collected Information
When you visit our website, we automatically collect certain information, including:
- IP address
- Browser type and version
- Operating system
- Pages visited and time spent on pages
- Referring website addresses
- Device information

1.3 Cookies and Tracking Technologies
We use cookies and similar tracking technologies to enhance your experience. See our Cookie Policy for detailed information.

2. HOW WE USE YOUR INFORMATION

We use your information for the following purposes:

2.1 Service Delivery
- Processing repair requests and quotes
- Communicating about your repair status
- Scheduling collection and delivery
- Providing customer support
- Maintaining repair records

2.2 Business Operations
- Processing payments and maintaining financial records
- Preventing fraud and ensuring security
- Improving our services and website
- Analyzing usage patterns and trends
- Complying with legal obligations

2.3 Marketing and Communications
- Sending service updates and notifications
- Providing promotional offers (with your consent)
- Sending newsletters and tips (with your consent)
- Conducting customer satisfaction surveys

You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly.

3. LEGAL BASIS FOR PROCESSING (UK GDPR)

We process your personal data under the following legal bases:

3.1 Contract Performance
Processing necessary to fulfill our service agreement with you.

3.2 Legitimate Interests
Processing necessary for our legitimate business interests, such as improving services and preventing fraud.

3.3 Consent
Processing based on your explicit consent for marketing communications and cookies.

3.4 Legal Obligation
Processing necessary to comply with legal requirements, such as tax and accounting obligations.

4. INFORMATION SHARING AND DISCLOSURE

We do not sell your personal information. We may share your information in the following circumstances:

4.1 Service Providers
We share information with trusted third-party service providers who assist us in:
- Payment processing
- Email communications
- Website hosting and maintenance
- Analytics and reporting

All service providers are contractually bound to protect your information and use it only for specified purposes.

4.2 Legal Requirements
We may disclose information when required by law, court order, or government request, or to:
- Enforce our Terms and Conditions
- Protect our rights and property
- Prevent fraud or security threats
- Protect personal safety

4.3 Business Transfers
In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.

5. DATA RETENTION

We retain your personal information for as long as necessary to:
- Fulfill the purposes outlined in this policy
- Comply with legal obligations (e.g., tax records for 7 years)
- Resolve disputes and enforce agreements

Repair records are retained for 7 years for warranty and legal purposes. Marketing data is retained until you opt out or request deletion.

6. DATA SECURITY

We implement appropriate technical and organizational measures to protect your information, including:
- Encryption of data in transit and at rest
- Secure server infrastructure
- Access controls and authentication
- Regular security assessments
- Staff training on data protection

However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.

7. YOUR RIGHTS (UK GDPR)

Under UK data protection law, you have the following rights:

7.1 Right to Access
Request a copy of the personal information we hold about you.

7.2 Right to Rectification
Request correction of inaccurate or incomplete information.

7.3 Right to Erasure
Request deletion of your personal information, subject to legal obligations.

7.4 Right to Restriction
Request limitation on how we process your information.

7.5 Right to Data Portability
Request transfer of your information to another service provider.

7.6 Right to Object
Object to processing based on legitimate interests or for marketing purposes.

7.7 Right to Withdraw Consent
Withdraw consent for processing at any time (does not affect prior processing).

To exercise any of these rights, please contact us using the details provided below.

8. CHILDREN''S PRIVACY

Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the information promptly.

9. INTERNATIONAL TRANSFERS

Your information is stored and processed in the United Kingdom. If we transfer data outside the UK/EEA, we ensure appropriate safeguards are in place.

10. CHANGES TO THIS POLICY

We may update this Privacy Policy periodically. We will notify you of significant changes by posting the new policy on our website and updating the "Last Updated" date.

11. CONTACT US

For questions about this Privacy Policy or to exercise your rights, please contact:

ToolServe
Email: privacy@toolserve.co.uk
Phone: [Your Phone Number]

Data Protection Officer
Email: dpo@toolserve.co.uk

12. SUPERVISORY AUTHORITY

You have the right to lodge a complaint with the UK Information Commissioner''s Office (ICO):
Website: ico.org.uk
Helpline: 0303 123 1113'
)
ON CONFLICT (page_type) 
DO UPDATE SET 
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  updated_at = now();

-- Insert Cookie Policy
INSERT INTO policy_pages (page_type, title, content)
VALUES (
  'cookies',
  'Cookie Policy',
  'Last Updated: February 9, 2026

This Cookie Policy explains how ToolServe ("we", "our", or "us") uses cookies and similar technologies on our website.

1. WHAT ARE COOKIES?

Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember your preferences and improve your browsing experience.

2. HOW WE USE COOKIES

We use cookies for the following purposes:

2.1 Essential Cookies (Always Active)
These cookies are necessary for the website to function properly. They enable core functionality such as:
- Security and authentication
- Load balancing
- Remembering your cookie preferences
- Maintaining your session

You cannot opt out of essential cookies as the website will not function properly without them.

2.2 Performance Cookies
These cookies help us understand how visitors interact with our website by collecting anonymous information about:
- Pages visited
- Time spent on pages
- Navigation paths
- Error messages encountered

This information helps us improve our website''s performance and user experience.

2.3 Functionality Cookies
These cookies enable enhanced functionality and personalization, such as:
- Remembering your preferences (e.g., language, region)
- Saving your repair tracking searches
- Customizing content based on your interests

2.4 Marketing Cookies
With your consent, we use marketing cookies to:
- Track the effectiveness of our advertising campaigns
- Display relevant advertisements on third-party websites
- Provide personalized content based on your interests
- Analyze which marketing channels bring visitors to our site

3. THIRD-PARTY COOKIES

We use services from trusted third-party providers that may set their own cookies:

3.1 Analytics Services
- Google Analytics: Tracks website usage and visitor behavior
- Privacy Policy: policies.google.com/privacy

3.2 Social Media
If we include social media features (share buttons), these platforms may set cookies to track your activity.

3.3 Payment Processing
Our payment processors may use cookies to facilitate secure transactions.

4. TYPES OF COOKIES WE USE

Session Cookies
Temporary cookies that expire when you close your browser. Used for essential website functions.

Persistent Cookies
Remain on your device for a set period or until manually deleted. Used to remember your preferences.

First-Party Cookies
Set by ToolServe directly.

Third-Party Cookies
Set by external service providers we use.

5. MANAGING YOUR COOKIE PREFERENCES

5.1 Cookie Consent Manager
When you first visit our website, you will see a cookie consent banner. You can manage your preferences by:
- Accepting all cookies
- Rejecting non-essential cookies
- Customizing your cookie preferences

You can change your preferences at any time by clicking the "Cookie Settings" link in our website footer.

5.2 Browser Settings
Most web browsers allow you to manage cookies through their settings. You can:
- Block all cookies
- Delete existing cookies
- Set preferences for specific websites
- Receive notifications when cookies are set

How to manage cookies in popular browsers:
- Chrome: Settings > Privacy and security > Cookies
- Firefox: Settings > Privacy & Security > Cookies
- Safari: Preferences > Privacy > Cookies
- Edge: Settings > Privacy, search, and services > Cookies

5.3 Opt-Out Links
You can opt out of certain third-party cookies:
- Google Analytics: tools.google.com/dlpage/gaoptout

6. CONSEQUENCES OF DISABLING COOKIES

If you disable cookies, some features of our website may not function properly:
- You may need to re-enter information more frequently
- Personalized features will not work
- We cannot remember your preferences
- Some pages may not display correctly

Essential cookies cannot be disabled, as they are necessary for the website to function.

7. DO NOT TRACK SIGNALS

Some browsers include a "Do Not Track" (DNT) feature. Our website does not currently respond to DNT signals, but you can control cookies through your browser settings and our cookie consent manager.

8. UPDATES TO THIS POLICY

We may update this Cookie Policy to reflect changes in technology, legislation, or our practices. The "Last Updated" date at the top indicates when the policy was last revised.

9. MORE INFORMATION

For more information about cookies, visit:
- All About Cookies: allaboutcookies.org
- ICO Cookie Guidance: ico.org.uk/for-organisations/guide-to-pecr/cookies

10. CONTACT US

If you have questions about our use of cookies, please contact:

ToolServe
Email: privacy@toolserve.co.uk
Phone: [Your Phone Number]

You can also manage your cookie preferences at any time through our Cookie Settings in the website footer.'
)
ON CONFLICT (page_type) 
DO UPDATE SET 
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  updated_at = now();
