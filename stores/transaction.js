// stores/transaction.js
import { defineStore } from "pinia";

export const useTransactionStore = defineStore("transaction", {
  state: () => ({
    transactions: [],
  }),
  actions: {
    addTransaction(transaction) {
      this.transactions.push(transaction);
    },
    updateTransaction(updatedTransaction) {
      const index = this.transactions.findIndex(
        (t) => t.timestamp === updatedTransaction.oldTimestamp
      );
      if (index !== -1) {
        // Use Vue's reactivity system to update the array
        this.transactions[index] = {
          ...updatedTransaction,
          timestamp: updatedTransaction.newTimestamp,
        };
      }
    },
  },
  persist: true,
});
