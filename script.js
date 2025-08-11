// --- ОБЪЕКТ С ПЕРЕВОДАМИ ---
const translations = {
  ru: {
    subtitle_text: 'Оптимизация продажи резонаторов и ископаемых',
    resonator_tab_text: 'Резонаторы',
    fossil_tab_text: 'Ископаемые',
    calc_params_title: 'Параметры расчёта',
    azurite_amount_label: 'Количество азурита',
    azurite_amount_tooltip: 'Общее количество азурита, которое вы хотите потратить на покупку резонаторов',
    resonator_table_header: 'Резонатор',
    cost_table_header: 'Стоимость',
    sale_price_table_header: 'Цена продажи',
    chaos_label: 'хаос',
    initial_calc_title: 'Готов к расчёту',
    initial_calc_text: 'Введите количество азурита и цены резонаторов для расчёта оптимальной стратегии',
    top_fossils_title: 'Топ‑5 ископаемых по цене',
    loading_leagues_text: 'Загрузка лиг...',
    refresh_button: 'Обновить',
    fossil_table_header: 'Ископаемое',
    price_table_header: 'Цена',
    change_table_header: 'Изменение 7д',
    biome_table_header: 'Биом',
    loading_data_text: 'Загрузка данных с poe.ninja',
    last_updated_prefix: 'Последнее обновление:',
    source_text: 'Источник: poe.ninja',
    
    // Resonator names for results
    powerful_resonator_name: 'Мощный резонатор',
    active_resonator_name: 'Активный резонатор',
    simple_resonator_name: 'Простой резонатор',
    combo_strategy_name: 'Комбинированная стратегия',
    quantity_label: 'Количество:',
    combo_composition_label: 'Состав:',
    total_profit_label: 'Общая прибыль:',
    best_strategy_badge: 'ЛУЧШИЙ',
    per_piece_text: 'шт',
    combo_short_active: 'акт.',
    combo_short_simple: 'прост.',
  },
  en: {
    subtitle_text: 'Optimizing Resonator and Fossil Sales',
    resonator_tab_text: 'Resonators',
    fossil_tab_text: 'Fossils',
    calc_params_title: 'Calculation Parameters',
    azurite_amount_label: 'Azurite Amount',
    azurite_amount_tooltip: 'The total amount of Azurite you want to spend on resonators',
    resonator_table_header: 'Resonator',
    cost_table_header: 'Cost',
    sale_price_table_header: 'Sale Price',
    chaos_label: 'chaos',
    initial_calc_title: 'Ready for Calculation',
    initial_calc_text: 'Enter Azurite amount and resonator prices to calculate the optimal strategy',
    top_fossils_title: 'Top 5 Fossils by Price',
    loading_leagues_text: 'Loading leagues...',
    refresh_button: 'Refresh',
    fossil_table_header: 'Fossil',
    price_table_header: 'Price',
    change_table_header: '7d Change',
    biome_table_header: 'Biome',
    loading_data_text: 'Loading data from poe.ninja',
    last_updated_prefix: 'Last updated:',
    source_text: 'Source: poe.ninja',
    
    // Resonator names for results
    powerful_resonator_name: 'Powerful Resonator',
    active_resonator_name: 'Potent Resonator',
    simple_resonator_name: 'Simple Resonator',
    combo_strategy_name: 'Combined Strategy',
    quantity_label: 'Quantity:',
    combo_composition_label: 'Composition:',
    total_profit_label: 'Total Profit:',
    best_strategy_badge: 'BEST',
    per_piece_text: 'pcs',
    combo_short_active: 'potent',
    combo_short_simple: 'simple',
  }
};
// ----------------------------------------------------------------------


// --- ГЛОБАЛЬНАЯ ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ ЯЗЫКА ---
let currentLanguage = 'ru';

function updateLanguage(calculator, market) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key];
    }
  });

  const tooltipElements = document.querySelectorAll('[data-tooltip-i18n]');
  tooltipElements.forEach(element => {
    const key = element.getAttribute('data-tooltip-i18n');
    if (translations[currentLanguage][key]) {
      element.setAttribute('data-tooltip', translations[currentLanguage][key]);
    }
  });
  
  // Обновляем тексты, которые создаются динамически
  const lang = currentLanguage;
  const powerfulNameSpan = document.querySelector('img[alt="Powerful"]').nextElementSibling;
  powerfulNameSpan.textContent = translations[lang].powerful_resonator_name;
  
  const activeNameSpan = document.querySelector('img[alt="Potent"]').nextElementSibling;
  activeNameSpan.textContent = translations[lang].active_resonator_name;
  
  const simpleNameSpan = document.querySelector('img[alt="Prime"]').nextElementSibling;
  simpleNameSpan.textContent = translations[lang].simple_resonator_name;

  const lastUpdatedElement = document.getElementById('lastUpdated');
  if (lastUpdatedElement) {
      lastUpdatedElement.innerHTML = `<span data-i18n="last_updated_prefix">${translations[lang].last_updated_prefix}</span> —`;
  }
  
  // Пересчитываем результаты, чтобы обновить текст
  calculator.renderResonatorCosts();
  calculator.calculate();

  // Обновляем ископаемые
  if (market) {
    market.renderFossilData(market.currentFossilData);
  }
}
// ----------------------------------------------------------------------


// Tab Navigation
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.dataset.tab;
    
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(targetTab).classList.add('active');
  });
});

// --- СЛУШАТЕЛЬ ДЛЯ ПЕРЕКЛЮЧАТЕЛЯ ЯЗЫКОВ ---
document.getElementById('language-switcher').addEventListener('change', (event) => {
  currentLanguage = event.target.value;
  const calculator = new ResonatorCalculator();
  const fossilMarket = new FossilMarket();
  updateLanguage(calculator, fossilMarket);
});
// ----------------------------------------------------------------------


// Resonator Calculator
class ResonatorCalculator {
  constructor() {
    this.resonators = {
      powerful: { cost: 3750, name: translations[currentLanguage].powerful_resonator_name },
      active: { cost: 750, name: translations[currentLanguage].active_resonator_name },
      simple: { cost: 300, name: translations[currentLanguage].simple_resonator_name }
    };
    
    this.init();
  }
  
  init() {
    const inputs = ['azuriteAmount', 'powerfulPrice', 'activePrice', 'simplePrice'];
    inputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => this.calculate());
        element.addEventListener('keyup', () => this.calculate());
      }
    });
  }
  
  renderResonatorCosts() {
    const powerfulCostElement = document.querySelector('img[alt="Powerful"]').closest('tr').querySelector('td:nth-child(2) span');
    const activeCostElement = document.querySelector('img[alt="Potent"]').closest('tr').querySelector('td:nth-child(2) span');
    const simpleCostElement = document.querySelector('img[alt="Prime"]').closest('tr').querySelector('td:nth-child(2) span');

    if (powerfulCostElement) powerfulCostElement.textContent = this.resonators.powerful.cost;
    if (activeCostElement) activeCostElement.textContent = this.resonators.active.cost;
    if (simpleCostElement) simpleCostElement.textContent = this.resonators.simple.cost;
  }
  
  calculate() {
    const azurite = parseInt(document.getElementById('azuriteAmount').value) || 0;
    const prices = {
      powerful: parseFloat(document.getElementById('powerfulPrice').value) || 0,
      active: parseFloat(document.getElementById('activePrice').value) || 0,
      simple: parseFloat(document.getElementById('simplePrice').value) || 0
    };
    
    if (azurite <= 0 || Object.values(prices).every(p => p <= 0)) {
      this.showInitialState();
      return;
    }
    
    const results = this.calculateStrategies(azurite, prices);
    this.renderResults(results);
  }
  
  calculateStrategies(azurite, prices) {
    const strategies = [];
    
    Object.keys(this.resonators).forEach(key => {
      if (prices[key] > 0) {
        const resonator = this.resonators[key];
        const quantity = Math.floor(azurite / resonator.cost);
        const profit = quantity * prices[key];
        
        strategies.push({
          type: key,
          name: resonator.name,
          quantity,
          profit: profit,
          details: `${quantity.toLocaleString()} ${translations[currentLanguage].per_piece_text} × ${prices[key].toFixed(1)} ${translations[currentLanguage].chaos_label}`
        });
      }
    });
    
    if (prices.active > 0 && prices.simple > 0) {
      const maxActive = Math.floor(azurite / this.resonators.active.cost);
      const remaining = azurite - (maxActive * this.resonators.active.cost);
      const maxSimple = Math.floor(remaining / this.resonators.simple.cost);
      const comboProfit = (maxActive * prices.active) + (maxSimple * prices.simple);
      
      strategies.push({
        type: 'combo',
        name: translations[currentLanguage].combo_strategy_name,
        quantity: maxActive + maxSimple,
        profit: comboProfit,
        details: `${maxActive.toLocaleString()} ${translations[currentLanguage].combo_short_active}. + ${maxSimple.toLocaleString()} ${translations[currentLanguage].combo_short_simple}.`
      });
    }
    
    if (strategies.length === 0) {
      this.showInitialState();
      return [];
    }
    
    const bestStrategy = strategies.reduce((best, current) => 
      current.profit > best.profit ? current : best
    );
    
    return strategies.map(s => ({
      ...s,
      isBest: s === bestStrategy
    }));
  }
  
  renderResults(strategies) {
    const container = document.getElementById('calculatorResults');
    const lang = currentLanguage;
    
    if (!container) return;

    if (strategies.length === 0) {
      this.showInitialState();
      return;
    }
    
    const html = strategies.map(strategy => {
      let detailsHtml = '';
      if (strategy.type === 'combo') {
        detailsHtml = `
          <div class="result-row">
            <span class="result-label">${translations[lang].combo_composition_label}</span>
