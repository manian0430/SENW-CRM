# SENW Real Estate CRM

A comprehensive CRM system for real estate brokers.

## Document Management System

The application now includes a document management system that uses Supabase for storage. This allows you to:

- Upload documents related to properties, clients, and transactions
- Categorize documents by type
- Associate documents with specific properties
- Download and manage documents securely

## Setup

1. Ensure your Supabase project is set up with the proper environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

2. Run the setup script to create the necessary storage bucket and database table:
   ```
   npm run setup:supabase
   # or
   pnpm run setup:supabase
   ```

3. Start the development server:
   ```
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to start using the application.

## Features

- **Lead Management**: Track and manage potential clients
- **Property Listings**: Manage real estate listings with detailed information
- **Document Management**: Store and organize important documents
- **Transaction Tracking**: Monitor deals from offer to closing
- **Calendar**: Schedule property showings and client meetings

## Technology Stack

- Next.js 15+
- React 19
- TypeScript
- Tailwind CSS
- Supabase (Authentication, Database, Storage) 