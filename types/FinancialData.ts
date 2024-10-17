// /src/types/FinancialData.ts

export interface FinancialData {
    id: number;
    documentId: string;
    activo: string;
    inicio: string; // O Date si prefieres
    fin: string;    // O Date si prefieres
    resultado: Resultado;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
  }
  
  export interface Resultado {
    income_status: IncomeStatus;
    margins: Margins;
    balance_sheet: BalanceSheet;
    financial_ratios: FinancialRatios;
    stock_information: StockInformation;
  }
  
  export interface IncomeStatus {
    annual_revenue: string;
    annual_revenue_prior_year: string;
    sales_growth: string;
    gross_profit: string;
    gross_profit_prior_year: string;
    gross_profit_growth: string;
    operating_profit: string;
    operating_profit_prior_year: string;
    operating_profit_growth: string;
    net_income: string;
    net_income_prior_year: string;
    net_income_growth: string;
  }
  
  export interface Margins {
    gross_margin: string;
    operating_margin: string;
    net_margin: string;
  }
  
  export interface BalanceSheet {
    cash: string;
    total_debt: string;
    current_assets: string;
    current_liabilities: string;
    total_assets: string;
    total_liabilities: string;
    equity: string;
    equity_prior_year: string;
    equity_growth: string;
  }
  
  export interface FinancialRatios {
    'CA/CL': string;
    'acid_test': string;
    'TL/TA': string;
    'cash/equity': string;
    'total_debt/equity': string;
    'ROA': string;
    'ROE': string;
  }
  
  export interface StockInformation {
    common_stock_outstanding: string;
    stock_price: string;
    market_cap: string;
    'EPS': string;
    'P/E': string;
    book_value: string;
    'P/B': string;
    sales_per_share: string;
    'P/S': string;
    annual_dividend: string;
    dividend_yield: string;
  }
  