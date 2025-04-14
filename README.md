# SENW Real Estate CRM

A comprehensive CRM system for real estate brokers.

## Integrated Supabase Storage

The application includes Supabase integration for:

1. **Document Management System**
   - Upload documents related to properties, clients, and transactions
   - Categorize documents by type
   - Associate documents with specific properties
   - Download and manage documents securely

2. **Team Management System**
   - Store team member profiles with avatars
   - Categorize by roles (Agents, Managers, Admins)
   - Manage team member status and contact information
   - Visual card and table views for team members

## Setup

1. Ensure your Supabase project is set up with the proper environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

2. Run the setup script to create the necessary storage buckets and guide you through database table creation:
   ```
   npm run setup:supabase
   # or
   pnpm run setup:supabase
   ```

3. Create the required database tables using the SQL provided by the setup script:
   - `documents` table for document metadata
   - `team_members` table for team member information

4. Configure storage policies for the `documents` and `avatars` buckets in the Supabase dashboard.

5. Start the development server:
   ```
   npm run dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to start using the application.

## Features

- **Lead Management**: Track and manage potential clients
- **Property Listings**: Manage real estate listings with detailed information
- **Document Management**: Store and organize important documents with Supabase
- **Team Management**: Manage team members with profile pictures stored in Supabase
- **Transaction Tracking**: Monitor deals from offer to closing
- **Calendar**: Schedule property showings and client meetings

## Technology Stack

- Next.js 15+
- React 19
- TypeScript
- Tailwind CSS
- Supabase (Authentication, Database, Storage) 