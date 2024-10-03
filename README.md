# Transaction Manager

A simple web application for managing daily financial transactions, built with Vue.js and Nuxt.

## Description

Transaction Manager helps you keep track of your daily cash flow. It allows you to add, view, and edit transactions, categorizing them as either "Cash In" or "Cash Out". The app provides a visual representation of your transactions over the past week and a list of recent transactions.

## Features

- Add new transactions with details (date, amount, type, category, and note)
- View a bar chart of Cash In and Cash Out transactions for the past 7 days
- Display a list of recent transactions
- Edit today's transactions
- Responsive design for desktop and mobile use (almost ;p)

## Data Flow Diagram

```mermaid
   sequenceDiagram
    participant User
    participant App as App.vue
    participant Chart as TransactionChart.vue
    participant List as RecentTransactionList.vue
    participant API as Server API

    User->>App: Open application
    App->>Chart: Create and mount
    App->>List: Create and mount
    
    Chart->>API: GET /api/getRecentTransactions
    API-->>Chart: Return recent transactions
    Chart->>Chart: Render chart

    List->>API: GET /api/getRecentTransactions
    API-->>List: Return recent transactions
    List->>List: Display transactions

    User->>App: Fill new transaction form
    User->>App: Submit new transaction
    App->>API: POST /api/addTransaction
    API-->>App: Confirm transaction added
    App->>App: Update refreshTrigger

    App->>Chart: Propagate refreshTrigger
    Chart->>API: GET /api/getRecentTransactions
    API-->>Chart: Return updated transactions
    Chart->>Chart: Update chart

    App->>List: Propagate refreshTrigger
    List->>API: GET /api/getRecentTransactions
    API-->>List: Return updated transactions
    List->>List: Update transaction list

    User->>List: Click "Edit" on today's transaction
    List->>List: Open edit modal
    User->>List: Modify transaction
    User->>List: Save changes
    List->>API: PUT /api/updateTransaction/:id
    API-->>List: Confirm transaction updated
    List->>API: GET /api/getRecentTransactions
    API-->>List: Return updated transactions
    List->>List: Update transaction list

    List->>App: Emit error (if any)
    App->>App: Display error message
```

## Usage

- To add a new transaction, fill out the form at the top of the page and click "Submit"
- View your transaction history in the chart and list below the form
- To edit a transaction from today, click the "Edit" button next to the transaction in the list
- Transactions from previous days are marked as "Synced" and cannot be edited


## Technologies Used

- Vue.js 3
- Nuxt 3
- Chart.js (for data visualization)
- SQLite (for data storage)

## API Endpoints

- `GET /api/getRecentTransactions`: Fetch recent transactions
- `POST /api/addTransaction`: Add a new transaction
- `PUT /api/updateTransaction/:id`: Update an existing transaction

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
