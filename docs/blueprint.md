# **App Name**: RetailSync

## Core Features:

- Add/Edit Products: Admin can add products (name, unit, price) and edit the price, triggering realtime updates.
- Product Grid: Employees can view a read-only product grid with name, unit, and price, updated in realtime.
- Print/Share Product Card: Generate a product card for printing (ink-efficient, large font) or sharing via the Web Share API.
- Submit Daily Report: Employees can submit daily reports (shop name, salesman name, total sales, total expenses).
- Request Stock: Employees can request stock: select products, increment quantities, and submit.
- View Employee Reports: Admin can view employee daily reports, showing shop name, salesman name, total sales, total expenses.
- Merge Stock Requests: Can view stock requests per shop → merge them into one mega shopping list. Admin
- PWA Installable: PWA installable on both IOS and Android
- Live Shopping List: Admin can create and share a live shopping list link; both co-buyers tick items in real-time; checked items disappear instantly on all clients; admin inputs total purchase cost → saved to purchasing_history.
- Database Sync: database write all function correctly like merge list to make one real time sync and submit all and provide SQL script to run in supabase for genrating table accordingly (one product list on backend with name price unit have to use on both sides just edit and add buttons render admin side & uses for stock request drop down on employess but with just product name )

## Style Guidelines:

- Primary color: Deep Blue (#3F51B5) evoking trust and reliability for retail operations.
- Background color: glowing blue (#E8EAF6) for a clean and professional look.
- Accent color: (teal greenish) to draw attention to important actions or real-time updates.
- Font: 'PT Sans' (open-sans) for body text and headlines, ensuring readability and a modern aesthetic.
- Use clear, simple icons from a consistent set (e.g., Material Design Icons) to represent actions and categories.
- Grid-based layout with clearly defined cards for products, reports, and shopping list items for ease of use.
- Subtle animations for realtime updates (e.g., a brief highlight on price changes) dissaparnce of product when admin and co doing shopping and check any product to provide visual feedback.