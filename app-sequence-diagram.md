:::mermaid
sequenceDiagram
    participant User
    participant UI as User Interface (Vue Components)
    participant TransactionStore as Pinia TransactionStore
    participant API as API Endpoints
    participant DB as SQLite Database

    Note over User,DB: App Startup (12:00 AM to 11:59 PM)
    UI->>TransactionStore: Initialize
    TransactionStore->>TransactionStore: Check for yesterday's data
    alt Yesterday's data exists and not synced
        TransactionStore->>API: POST /api/addTransactions (yesterday's data)
        API->>DB: Insert transactions
        DB-->>API: Confirm insertion
        API-->>TransactionStore: Confirm transactions saved
        TransactionStore->>TransactionStore: Mark yesterday's data as synced
    end

    User->>UI: Interact with CashIn/CashOut form
    UI->>TransactionStore: Add transaction
    TransactionStore->>TransactionStore: Store transaction for today

    User->>UI: Request transaction list
    UI->>TransactionStore: Get transactions (7 days)
    TransactionStore-->>UI: Return transactions
    UI->>User: Display transaction list (Today editable, others read-only)

    User->>UI: Edit today's transaction
    UI->>TransactionStore: Update transaction
    TransactionStore->>TransactionStore: Update local transaction
    UI->>User: Show updated transaction

    Note over TransactionStore: Daily maintenance (e.g., at app startup)
    TransactionStore->>TransactionStore: Remove data older than 8 days
    TransactionStore->>TransactionStore: Shift 'editable' status to new day
:::

# Optimized Approach for Local Financial Tracker

## Overview

This document outlines an optimized approach for a financial tracking application that prioritizes local environment efficiency while maintaining server-side record-keeping.

## Key Components

### 1. Single Pinia Store (TransactionStore)
- Manages all transactions (Cash In and Cash Out) locally.
- Stores data for 8 continuous days, including today.
- Today's transactions are editable; previous days are read-only.

### 2. One-way Sync to Server
- During the first app startup of the day (12:00 AM to 11:59 PM):
  - Checks for yesterday's unsynchronized data.
  - If present, sends it to the server via a single API call (/api/syncTransactions).
  - Marks yesterday's data as synced after successful upload.

### 3. Local Data Management
- Removes data older than 8 days during daily maintenance.
- Shifts the 'editable' status to the new day at the start of each day.

### 4. User Interface
- Allows adding and editing transactions for the current day only.
- Displays 8 days of transaction data, clearly indicating which are editable.

## Benefits for Local Environment Optimization

1. **Minimal Server Interaction**
   - Reduces server load by limiting API calls to once per day.
   - Minimizes dependency on constant internet connectivity.

2. **Bandwidth Efficiency**
   - Only uploads necessary data (yesterday's transactions) to the server.
   - No data fetching from the server, saving bandwidth.

3. **Enhanced Offline Functionality**
   - App can function entirely offline for up to 7 days.
   - Only requires connectivity to sync yesterday's data.

4. **Improved Local Performance**
   - Limited dataset (7 days) in the local store ensures fast operations.
   - Efficient for filtering, displaying, and managing transactions.

5. **Clear User Experience**
   - Users can only edit today's transactions, reducing accidental modifications to historical data.
   - Provides a consistent and intuitive interaction model.

6. **Efficient Use of Local Storage**
   - Prevents indefinite growth of local data store.
   - Maintains optimal app performance over time.

7. **Simplified Data Management**
   - Avoids complex bi-directional syncing scenarios.
   - Minimizes potential for data conflicts between local and server data.

8. **Responsive User Interface**
   - All data for display and editing is immediately available locally.
   - No waiting for server responses during normal operation.

## Conclusion

This optimized approach provides an excellent balance between local app performance, data integrity, and minimal server interaction. It prioritizes the user's local experience while still maintaining necessary server-side records, making it ideal for a financial tracking application that needs to be responsive and functional in various connectivity scenarios.