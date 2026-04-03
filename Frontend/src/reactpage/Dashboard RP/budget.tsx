import React, { useState, useEffect } from "react";
import { Sidebar, Topbar } from "./dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import "../../styles/dashboard-css/budget.css";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getCategories,
  getBudgetStatus,
  setBudgetLimit,
} from "../../services/api";

interface Category {
  id: number;
  name: string;
  type: string;
  icon: string;
}

interface Transaction {
  id: number;
  amount: number;
  description: string;
  transaction_date: string;
  category: Category;
}

interface BudgetStatus {
  budget: { id: number; amount: number; category: Category };
  spent: number;
  remaining: number;
  percentage_used: number;
  status: string;
}

export default function Budget() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgetStatus, setBudgetStatusData] = useState<BudgetStatus[]>([]);
  const [loading, setLoading] = useState(true);

  // Summary State
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Transaction
  const [txForm, setTxForm] = useState({
    type: "expense",
    category_id: "",
    amount: "",
    description: "",
    transaction_date: new Date().toISOString().split("T")[0],
  });

  // Budget Limit
  const [limitForm, setLimitForm] = useState({
    category_id: "",
    amount: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [txData, catData, statusData] = await Promise.all([
        getTransactions(),
        getCategories(),
        getBudgetStatus(currentMonth, currentYear),
      ]);

      const fetchedTx = Array.isArray(txData) ? txData : [];
      setTransactions(fetchedTx);
      setCategories(Array.isArray(catData) ? catData : []);

      if (statusData && statusData.budgets) {
        setBudgetStatusData(statusData.budgets);
      }

      // Calculate summaries for current month
      let inc = 0;
      let exp = 0;
      fetchedTx.forEach((t: Transaction) => {
        const tDate = new Date(t.transaction_date);
        if (tDate.getMonth() + 1 === currentMonth && tDate.getFullYear() === currentYear) {
          if (t.category.type === "income") inc += t.amount;
          if (t.category.type === "expense") exp += t.amount;
        }
      });
      setSummary({ income: inc, expenses: exp, balance: inc - exp });
    } catch (error) {
      console.error("Failed to load budget data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.category_id || !txForm.amount) return;

    try {
      await addTransaction({
        category_id: parseInt(txForm.category_id),
        amount: parseFloat(txForm.amount),
        description: txForm.description,
        transaction_date: txForm.transaction_date,
      });

      setTxForm({ ...txForm, amount: "", description: "" });
      fetchData();
    } catch (error) {
      console.error("Failed to add transaction:", error);
      alert("Failed to add transaction.");
    }
  };

  const handleSetLimit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!limitForm.category_id || !limitForm.amount) return;

    try {
      await setBudgetLimit({
        category_id: parseInt(limitForm.category_id),
        amount: parseFloat(limitForm.amount),
        month: currentMonth,
        year: currentYear,
      });

      setLimitForm({ category_id: "", amount: "" });
      fetchData();
    } catch (error: any) {
      console.error("Failed to set limit:", error);
      alert(error.message || "Failed to set budget limit.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      fetchData();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === txForm.type);
  const expenseCategories = categories.filter((c) => c.type === "expense");

  // chart data
  const cashFlowData = [
    { name: "Income", value: summary.income },
    { name: "Expenses", value: summary.expenses },
  ];
  const cashFlowColors = ["#2563eb", "#e11d48"];

  const expenseBreakdown = Object.values(
    transactions
      .filter((t) => {
        const tDate = new Date(t.transaction_date);
        return (
          t.category.type === "expense" &&
          tDate.getMonth() + 1 === currentMonth &&
          tDate.getFullYear() === currentYear
        );
      })
      .reduce(
        (acc, t) => {
          if (!acc[t.category.name]) {
            acc[t.category.name] = { name: t.category.name, value: 0 };
          }
          acc[t.category.name].value += t.amount;
          return acc;
        },
        {} as Record<string, { name: string; value: number }>
      )
  );
  const EXPENSE_COLORS = ["#38bdf8", "#a855f7", "#f59e0b", "#14b8a6", "#ec4899", "#f97316"];

  return (
    <div className="app">
      <Sidebar />
      <Topbar />

      <main className="budget-main">
        <header className="budget-header">
          <h2>Financial Dashboard</h2>
          <p>Track your income, expenses, and monthly budget limits.</p>
        </header>

        <section className="budget-summary-grid">
          <div className="summary-card">
            <h3>Monthly Income</h3>
            <p className="summary-amount amount-income">£{summary.income.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h3>Monthly Expenses</h3>
            <p className="summary-amount amount-expense">£{summary.expenses.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h3>Remaining Balance</h3>
            <p
              className={`summary-amount amount-balance ${summary.balance >= 0 ? "positive" : "negative"}`}
            >
              £{summary.balance.toFixed(2)}
            </p>
          </div>
        </section>

        <section className="budget-content-grid">
          <div className="budget-panel">
            <div className="panel-head panel-head-row">
              <h3>Add Transaction</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className={`table-btn ${txForm.type === "income" ? "btn-income" : "secondary-btn"}`}
                  onClick={() => setTxForm({ ...txForm, type: "income", category_id: "" })}
                >
                  Income
                </button>
                <button
                  type="button"
                  className={`table-btn ${txForm.type === "expense" ? "btn-expense" : "secondary-btn"}`}
                  onClick={() => setTxForm({ ...txForm, type: "expense", category_id: "" })}
                >
                  Expense
                </button>
              </div>
            </div>

            <form className="budget-form" onSubmit={handleAddTransaction}>
              <label>Description / Source</label>
              <input
                type="text"
                placeholder="e.g. Part-time job or Food shopping"
                value={txForm.description}
                onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
                required
              />

              <label>Amount (£)</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 50.00"
                value={txForm.amount}
                onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                required
              />

              <label>Category</label>
              <select
                value={txForm.category_id}
                onChange={(e) => setTxForm({ ...txForm, category_id: e.target.value })}
                required
              >
                <option value="">Select category...</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>

              <label>Date</label>
              <input
                type="date"
                value={txForm.transaction_date}
                onChange={(e) => setTxForm({ ...txForm, transaction_date: e.target.value })}
                required
              />

              <button
                type="submit"
                className={`budget-btn ${txForm.type === "income" ? "btn-income" : "btn-expense"}`}
                style={{ marginTop: "12px" }}
              >
                Add {txForm.type.charAt(0).toUpperCase() + txForm.type.slice(1)}
              </button>
            </form>
          </div>

          {/* Set Budget Limit Form */}
          <div className="budget-panel">
            <div className="panel-head">
              <h3>Set Category Budget Limit</h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted)",
                  marginTop: "4px",
                }}
              >
                Control your spending by setting strict monthly limits.
              </p>
            </div>

            <form className="budget-form" onSubmit={handleSetLimit}>
              <label>Expense Category</label>
              <select
                value={limitForm.category_id}
                onChange={(e) => setLimitForm({ ...limitForm, category_id: e.target.value })}
                required
              >
                <option value="">Select expense category...</option>
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>

              <label>Monthly Limit (£)</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 150.00"
                value={limitForm.amount}
                onChange={(e) => setLimitForm({ ...limitForm, amount: e.target.value })}
                required
              />

              <button type="submit" className="budget-btn" style={{ marginTop: "12px" }}>
                Save Limit
              </button>
            </form>
          </div>
        </section>

        <section className="budget-content-grid">
          {/* Cash Flow Chart */}
          <div className="budget-panel">
            <div className="panel-head">
              <h3>Cash Flow</h3>
            </div>
            <div style={{ height: "250px", width: "100%" }}>
              {summary.income === 0 && summary.expenses === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    paddingTop: "100px",
                  }}
                >
                  No data to display.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cashFlowData}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {cashFlowData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={cashFlowColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `£${Number(value).toFixed(2)}`} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Expense Breakdown Chart */}
          <div className="budget-panel">
            <div className="panel-head">
              <h3>Expense Breakdown</h3>
            </div>
            <div style={{ height: "250px", width: "100%" }}>
              {expenseBreakdown.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    paddingTop: "100px",
                  }}
                >
                  No expenses this month.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseBreakdown.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `£${Number(value).toFixed(2)}`} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        <section className="budget-content-grid">
          {/* Spend vs Limits Status */}
          <div className="budget-panel">
            <div className="panel-head">
              <h3>Spend vs. Limits</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {budgetStatus.length === 0 ? (
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--muted)",
                    textAlign: "center",
                    padding: "20px 0",
                  }}
                >
                  No budget limits set for this month.
                </p>
              ) : (
                budgetStatus.map((stat, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span>
                          {stat.budget.category.icon} {stat.budget.category.name}
                        </span>
                        {stat.status === "exceeded" && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#dc2626",
                              background: "rgba(239, 68, 68, 0.1)",
                              padding: "2px 6px",
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            🛑 Exceeded
                          </span>
                        )}
                        {stat.status === "warning" && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#d97706",
                              background: "rgba(245, 158, 11, 0.1)",
                              padding: "2px 6px",
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            ⚠️ Nearing Limit
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          color:
                            stat.status === "exceeded"
                              ? "var(--expense-color)"
                              : stat.status === "warning"
                                ? "#d97706"
                                : "var(--text)",
                        }}
                      >
                        £{stat.spent.toFixed(2)} / £{stat.budget.amount.toFixed(2)}
                      </span>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "10px",
                        background: "var(--panel-2)",
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min(stat.percentage_used, 100)}%`,
                          background:
                            stat.status === "exceeded"
                              ? "var(--expense-color)"
                              : stat.status === "warning"
                                ? "#f59e0b"
                                : "var(--primary)",
                          borderRadius: "999px",
                          transition: "width 0.4s ease",
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--muted)",
                        textAlign: "right",
                        marginTop: "-2px",
                      }}
                    >
                      {stat.percentage_used.toFixed(0)}% used
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="budget-panel transaction-panel" style={{ marginBottom: 0 }}>
            <div className="panel-head">
              <h3>Recent Transactions</h3>
            </div>

            <div className="transaction-table-wrap">
              {loading ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    fontSize: "13px",
                    padding: "20px",
                  }}
                >
                  Loading...
                </p>
              ) : (
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="empty-row">
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      transactions.slice(0, 10).map((t) => (
                        <tr key={t.id}>
                          <td>
                            <span
                              className={`pill-type ${t.category.type === "income" ? "pill-income" : "pill-expense"}`}
                            >
                              {t.category.type.charAt(0).toUpperCase() + t.category.type.slice(1)}
                            </span>
                          </td>
                          <td style={{ fontWeight: "600" }}>{t.description}</td>
                          <td style={{ color: "var(--muted)" }}>
                            {t.category.icon} {t.category.name}
                          </td>
                          <td
                            style={{ fontWeight: "700" }}
                            className={
                              t.category.type === "income" ? "amount-income" : "amount-expense"
                            }
                          >
                            {t.category.type === "income" ? "+" : "-"}£{t.amount.toFixed(2)}
                          </td>
                          <td style={{ color: "var(--muted)", fontSize: "12px" }}>
                            {new Date(t.transaction_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td>
                            <button
                              className="table-btn delete-btn"
                              onClick={() => handleDelete(t.id)}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
