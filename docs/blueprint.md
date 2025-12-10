# **App Name**: SwiftPOS

## Core Features:

- Admin Authentication: Secure login for administrators using credentials stored in .env with a registration option if no account exists.
- Employee Account Management: Admin tool for creating employee accounts, each functioning as a container for multiple staff profiles.
- Staff Login via PIN: Staff members log in using unique PIN codes tied to their individual profiles under the employee account.
- Kitchen Account: Admin tool for creating a kitchen display system (KDS) account.
- Transaction History: Detailed record of all transactions processed through the POS system.
- Reporting and Analytics: Comprehensive reports and analytics dashboard, giving a summary of total revenue or profit for any given day. Uses an LLM to determine which business metrics are best suited for a summary dashboard. The LLM is a tool that decides which data will provide value in reports based on prior observations of usage data. Generates insight into sales trends.
- Settings with Logout: Settings page to include logout functionality for all account types (admin, employee, staff).

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) for a professional and trustworthy feel.
- Background color: Very light lavender (#F0F2FA).
- Accent color: Vibrant Purple (#00008D) to highlight key interactive elements and call-to-action buttons.
- Body and headline font: 'Inter', a sans-serif font for a modern and clean user experience.
- Fully responsive layout, ensuring optimal viewing and interaction experience on devices of all sizes.
- Use clear, modern icons to represent various functions and settings, improving usability.
- Subtle transitions and animations to provide visual feedback and enhance user engagement.