```mermaid
  sequenceDiagram
      participant User
      participant App as App.vue
      participant Chart as TransactionChart.vue
      participant List as RecentTransactionList.vue
      participant WS as WebSocket Connection
      participant API as Server API

      User->>App: Open application
      App->>WS: Establish WebSocket connection
      App->>Chart: Create and mount
      App->>List: Create and mount
      
      App->>WS: Request initial data
      WS-->>App: Send initial transaction data
      App->>Chart: Update with initial data
      App->>List: Update with initial data

      User->>App: Fill new transaction form
      User->>App: Submit new transaction
      App->>API: POST /api/addTransaction
      API-->>App: Confirm transaction added
      API->>WS: Broadcast new transaction

      WS-->>Chart: Receive new transaction data
      Chart->>Chart: Update chart
      WS-->>List: Receive new transaction data
      List->>List: Update transaction list

      User->>List: Click "Edit" on today's transaction
      List->>List: Open edit modal
      User->>List: Modify transaction
      User->>List: Save changes
      List->>API: PUT /api/updateTransaction/:id
      API-->>List: Confirm transaction updated
      API->>WS: Broadcast updated transaction

      WS-->>Chart: Receive updated transaction data
      Chart->>Chart: Update chart
      WS-->>List: Receive updated transaction data
      List->>List: Update transaction list

      API->>WS: Send error (if any)
      WS-->>App: Receive error
      App->>App: Display error message