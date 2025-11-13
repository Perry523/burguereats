import { defineStore } from "pinia";
import { type Date } from "@/utils/models";
import { meses, anos } from "@/utils/date";
import dayjs from "dayjs";
import { type Order } from "~/models/order";
interface Balance {
  [key: number]: {
    [key: number]: number;
  };
}
// Filtra uma lista de finanças por uma data específica
function filterFinancesByDate(finances: Order[], date: Date): Order[] {
  return finances.filter((finance) => {
    const financeDate = dayjs(finance.created_at);
    const { month, year } = date;
    return financeDate.month() === month && financeDate.year() == year;
  });
}
// retorna o valor total das finanças para um determinado mês
function getTotalMonthValue(finances: Order[]): number {
  return finances.reduce((acc, curr) => {
    return acc + Number(curr.total);
  }, 0);
}
// retorna as finanças recorrentes para um determinado mês
function turnValueIntoFinance(value: number, date: Date): Order {
  return {
    id: Math.floor(Math.random() * 999999999999999),
    admin_id: "",
    created_at: dayjs()
      .set("month", date.month)
      .set("year", date.year)
      .startOf("month")
      .format("YYYY-MM-DD"),
    finished_at: "",
    discount: "",
    subtotal: "",
    status: "Saldo mês anterior",
    total: value.toString(),
    updated_at: "",
    user_id: "",
  };
}
export const useFinance = defineStore("finance", {
  state: () => {
    return {
      finances: [] as Order[],
      currentFinance: {} as Order,
      currentDate: getCurrentDate(),
      isEditing: false,
      isActive: false,
    };
  },
  getters: {
    // balanço dos meses
    monthsBalance(): Balance {
      const balance = {} as Balance;
      anos.forEach((ano) => {
        meses.forEach((mes) => {
          const date = {
            month: mes.id,
            year: Number(ano),
          };
          const monthFinances = filterFinancesByDate(this.finances, date);
          const monthValue = getTotalMonthValue([...monthFinances]);
          balance[date.year] = balance[date.year] || {};
          const previousMonthValue = balance[date.year][date.month - 1] || 0;
          balance[date.year][date.month] = monthValue + previousMonthValue;
        });
      });
      return balance;
    },
    // retorna financias do mês atual
    financesByMonth(): Order[] {
      const previousMonthBalance =
        this.monthsBalance[this.currentDate.year][this.currentDate.month - 1] ||
        0;
      const previousMonthFinance = turnValueIntoFinance(
        previousMonthBalance,
        this.currentDate
      );
      const monthFinances = filterFinancesByDate(
        this.finances,
        this.currentDate
      );
      const totalFinances = [previousMonthFinance, ...monthFinances];
      return totalFinances.sort((a, b) => {
        const aDate = dayjs(a.created_at);
        const bDate = dayjs(b.created_at);
        return aDate.isBefore(bDate) ? -1 : 1;
      });
    },
    // retorna o total recebido no mês atual
    totalReceived(state): (date: { month: number; year: number }) => number {
      return (date) => {
        const monthFinances = filterFinancesByDate(state.finances, date);
        return getTotalMonthValue(monthFinances);
      };
    },
    // retorna o total gasto no mês atual
    totalSpent(state): (date: { month: number; year: number }) => number {
      return (date) => {
        const monthFinances = filterFinancesByDate(state.finances, date);
        return getTotalMonthValue(monthFinances);
      };
    },
    // retorna o valor total da carteira no mês atual
    walletValue(): number {
      return getTotalMonthValue(this.financesByMonth);
    },
  },
  persist: true,
  actions: {
    //   addFinance(finance: Finance) {
    //     finance.id = Math.floor(Math.random() * 999999999999999);
    //     this.finances.push(finance);
    //   },
    //   setEditing(finance: Finance) {
    //     this.isEditing = true;
    //     this.currentFinance = finance;
    //   },
    //   updateFinance(finance: Finance) {
    //     const index = this.finances.findIndex(
    //       (f) => f.id === this.currentFinance.id
    //     );
    //     finance.id = this.currentFinance.id;
    //     this.finances[index] = finance;
    //     this.isEditing = false;
    //     this.currentFinance = {} as Finance;
    //   },
    //   deleteFinance(finance: Finance) {
    //     const index = this.finances.findIndex((f) => f.id === finance.id);
    //     this.finances.splice(index, 1);
    //   },
    //   cancelEditing() {
    //     this.isEditing = false;
    //     this.currentFinance = {} as Finance;
    //   },
  },
});
function getCurrentDate(): Date {
  const currentDate = dayjs();
  return {
    month: currentDate.month(),
    year: currentDate.year(),
  };
}
