import React, { useState, useEffect, useMemo } from "react";
import { Sidebar, Topbar } from "./dashboard";
import "../../styles/dashboard-css/budget.css";
import {
  getTransactions,
  addTransaction,
  getCategories,
  deleteTransaction,
} from "../../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Category {
  id: number;
  name: string;
  type: string;
  icon?: string;
}

interface Transaction {
  id: string | number;
  user_id: string;
  category_id: number;
  amount: number;
  description: string;
  transaction_date: string;
  is_recurring: boolean;
  category?: Category;
}

export default function Budget() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [incomeForm, setIncomeForm] = useState({
    title: "",
    amount: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
  });

  // --- INITIAL LOAD FROM BACKEND ---
  useEffect(() => {
    async function loadData() {
      try {
        const [transData, catsData] = await Promise.all([
          getTransactions(),
          getCategories(),
        ]);

        setTransactions(Array.isArray(transData) ? transData : []);
        setCategories(Array.isArray(catsData) ? catsData : []);
      } catch (err) {
        console.error("Failed to load budget data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- DERIVED STATE (Summaries & Chart Data) ---
  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const summary = useMemo(() => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((t) => {
      if (t.category?.type === "income") {
        incomeTotal += Number(t.amount);
      } else if (t.category?.type === "expense") {
        expenseTotal += Number(t.amount);
      }
    });

    return {
      income: incomeTotal,
      expense: expenseTotal,
      balance: incomeTotal - expenseTotal,
    };
  }, [transactions]);

  // Chart 1: Income vs Expense
  const overviewData = useMemo(() => {
    return [
      { name: "Income", value: summary.income },
      { name: "Expenses", value: summary.expense },
    ].filter((item) => item.value > 0);
  }, [summary]);

  const OVERVIEW_COLORS = ["var(--chart-income)", "var(--chart-expense)"];

  // Chart 2: Expenses by Category
  const expenseBreakdownData = useMemo(() => {
    const expenses = transactions.filter((t) => t.category?.type === "expense");
    const grouped = expenses.reduce(
      (acc, curr) => {
        const catName = curr.category?.name || "Uncategorized";
        acc[catName] = (acc[catName] || 0) + Number(curr.amount);
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const CATEGORY_COLORS = [
    "var(--chart-cat-1)",
    "var(--chart-cat-2)",
    "var(--chart-cat-3)",
    "var(--chart-cat-4)",
    "var(--chart-cat-5)",
    "var(--chart-cat-6)",
  ];

  const formatCurrency = (amount: number) => {
    return "£" + amount.toFixed(2);
  };

  // --- EVENT HANDLERS ---
  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTransaction = await addTransaction({
        category_id: Number(incomeForm.categoryId),
        amount: Number(incomeForm.amount),
        description: incomeForm.title,
        transaction_date: incomeForm.date,
      });

      const cat = categories.find(
        (c) => c.id === Number(incomeForm.categoryId),
      );
      newTransaction.category = cat;

      setTransactions([newTransaction, ...transactions]);
      setIncomeForm({ ...incomeForm, title: "", amount: "", categoryId: "" });
    } catch (err) {
      alert("Error adding income transaction.");
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTransaction = await addTransaction({
        category_id: Number(expenseForm.categoryId),
        amount: Number(expenseForm.amount),
        description: expenseForm.title,
        transaction_date: expenseForm.date,
      });

      const cat = categories.find(
        (c) => c.id === Number(expenseForm.categoryId),
      );
      newTransaction.category = cat;

      setTransactions([newTransaction, ...transactions]);
      setExpenseForm({ ...expenseForm, title: "", amount: "", categoryId: "" });
    } catch (err) {
      alert("Error adding expense transaction.");
    }
  };

  // --- DATABASE DELETE HANDLERS ---
  const handleClearAll = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete ALL transactions?",
      )
    ) {
      try {
        for (const t of transactions) {
          await deleteTransaction(t.id);
        }
        setTransactions([]);
      } catch (err) {
        alert("Error clearing some transactions.");
      }
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err) {
      alert("Error deleting transaction.");
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <Topbar />

      <main className="budget-main">
        {loading ? (
          <div
            className="empty-row"
            style={{ padding: "40px", textAlign: "center" }}
          >
            Loading your financial data...
          </div>
        ) : (
          <>
            <section className="budget-header">
              <div>
                <h2>Budget Overview</h2>
                <p>Track income, expenses and monthly balance</p>
              </div>
            </section>

            {/* SUMMARY CARDS */}
            <section className="budget-summary-grid">
              <article className="summary-card">
                <h3>Monthly Income</h3>
                <p className="summary-amount amount-income">
                  {formatCurrency(summary.income)}
                </p>
              </article>

              <article className="summary-card">
                <h3>Monthly Expenses</h3>
                <p className="summary-amount amount-expense">
                  {formatCurrency(summary.expense)}
                </p>
              </article>

              <article className="summary-card">
                <h3>Remaining Balance</h3>
                <p
                  className={`summary-amount amount-balance ${summary.balance < 0 ? "negative" : "positive"}`}
                >
                  {formatCurrency(summary.balance)}
                </p>
              </article>
            </section>

            {/* INPUT FORMS */}
            <section
              className="budget-content-grid"
              style={{ marginBottom: "18px" }}
            >
              <div className="budget-panel">
                <div className="panel-head">
                  <h3>Add Income</h3>
                </div>

                <form className="budget-form" onSubmit={handleIncomeSubmit}>
                  <label>Income source</label>
                  <input
                    type="text"
                    placeholder="e.g. Part-time job"
                    value={incomeForm.title}
                    onChange={(e) =>
                      setIncomeForm({ ...incomeForm, title: e.target.value })
                    }
                    required
                  />

                  <label>Amount (£)</label>
                  <input
                    type="number"
                    placeholder="e.g. 250"
                    step="0.01"
                    min="0"
                    value={incomeForm.amount}
                    onChange={(e) =>
                      setIncomeForm({ ...incomeForm, amount: e.target.value })
                    }
                    required
                  />

                  <label>Category</label>
                  <select
                    value={incomeForm.categoryId}
                    onChange={(e) =>
                      setIncomeForm({
                        ...incomeForm,
                        categoryId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select category</option>
                    {incomeCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>

                  <label>Date</label>
                  <input
                    type="date"
                    value={incomeForm.date}
                    onChange={(e) =>
                      setIncomeForm({ ...incomeForm, date: e.target.value })
                    }
                    required
                  />

                  <button type="submit" className="budget-btn btn-income">
                    Add Income
                  </button>
                </form>
              </div>

              <div className="budget-panel">
                <div className="panel-head">
                  <h3>Add Expense</h3>
                </div>

                <form className="budget-form" onSubmit={handleExpenseSubmit}>
                  <label>Expense name</label>
                  <input
                    type="text"
                    placeholder="e.g. Food shopping"
                    value={expenseForm.title}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, title: e.target.value })
                    }
                    required
                  />

                  <label>Amount (£)</label>
                  <input
                    type="number"
                    placeholder="e.g. 45"
                    step="0.01"
                    min="0"
                    value={expenseForm.amount}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, amount: e.target.value })
                    }
                    required
                  />

                  <label>Category</label>
                  <select
                    value={expenseForm.categoryId}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        categoryId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select category</option>
                    {expenseCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>

                  <label>Date</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, date: e.target.value })
                    }
                    required
                  />

                  <button type="submit" className="budget-btn btn-expense">
                    Add Expense
                  </button>
                </form>
              </div>
            </section>

            {/* INTERACTIVE CHARTS */}
            <section
              className="budget-content-grid"
              style={{ marginBottom: "18px" }}
            >
              <div
                className="budget-panel"
                style={{
                  height: "320px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="panel-head">
                  <h3>Cash Flow</h3>
                </div>
                <div style={{ flex: 1, width: "100%" }}>
                  {overviewData.length === 0 ? (
                    <div className="empty-row" style={{ marginTop: "60px" }}>
                      No data to display
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={overviewData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {overviewData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                OVERVIEW_COLORS[index % OVERVIEW_COLORS.length]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) =>
                            formatCurrency(Number(value))
                          }
                          contentStyle={{
                            backgroundColor: "var(--panel)",
                            borderColor: "var(--border)",
                            color: "var(--text)",
                          }}
                          itemStyle={{ color: "var(--text)" }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          wrapperStyle={{ color: "var(--text)" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div
                className="budget-panel"
                style={{
                  height: "320px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="panel-head">
                  <h3>Expense Breakdown</h3>
                </div>
                <div style={{ flex: 1, width: "100%" }}>
                  {expenseBreakdownData.length === 0 ? (
                    <div className="empty-row" style={{ marginTop: "60px" }}>
                      No expenses recorded
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseBreakdownData}
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          dataKey="value"
                          stroke="none"
                          label={({ name, percent }) =>
                            `${name} ${((percent || 0) * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {expenseBreakdownData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) =>
                            formatCurrency(Number(value))
                          }
                          contentStyle={{
                            backgroundColor: "var(--panel)",
                            borderColor: "var(--border)",
                            color: "var(--text)",
                          }}
                          itemStyle={{ color: "var(--text)" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </section>

            {/* TRANSACTION TABLE */}
            <section className="budget-panel transaction-panel">
              <div className="panel-head panel-head-row">
                <h3>Transaction List</h3>
                <button
                  className="budget-btn secondary-btn"
                  type="button"
                  onClick={handleClearAll}
                >
                  Clear All
                </button>
              </div>

              <div className="transaction-table-wrap">
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Title</th>
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
                          No transactions added yet
                        </td>
                      </tr>
                    ) : (
                      transactions.map((t) => (
                        <tr key={t.id}>
                          <td>
                            <span
                              className={`pill-type ${t.category?.type === "income" ? "pill-income" : "pill-expense"}`}
                            >
                              {t.category?.type === "income"
                                ? "Income"
                                : "Expense"}
                            </span>
                          </td>
                          <td style={{ fontWeight: 500 }}>{t.description}</td>
                          <td style={{ color: "var(--muted)" }}>
                            {t.category?.icon} {t.category?.name || "-"}
                          </td>
                          <td
                            style={{ fontWeight: "bold" }}
                            className={
                              t.category?.type === "income"
                                ? "amount-income"
                                : "amount-expense"
                            }
                          >
                            {t.category?.type === "expense" ? "-" : "+"}
                            {formatCurrency(Number(t.amount))}
                          </td>
                          <td style={{ color: "var(--muted)" }}>
                            {new Date(t.transaction_date).toLocaleDateString()}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              onClick={() => handleDelete(t.id)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--expense-color)",
                                cursor: "pointer",
                                fontSize: "16px",
                                opacity: 0.8,
                              }}
                              title="Delete Transaction"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
