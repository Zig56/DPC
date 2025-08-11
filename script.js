// --- ДОБАВЛЕН ОБЪЕКТ С ПЕРЕВОДАМИ ---
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


// --- ДОБАВЛЕНА ГЛОБАЛЬНАЯ ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ ЯЗЫКА ---
let currentLanguage = 'ru';

function updateLanguage() {
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

  document.getElementById('lastUpdated').innerHTML = `<span data-i18n="last_updated_prefix">${translations[lang].last_updated_prefix}</span> —`;

  // Пересчитываем результаты, чтобы обновить текст
  const calculator = new ResonatorCalculator();
  calculator.calculate();

  // Обновляем ископаемые
  const market = new FossilMarket();
  market.renderFossilData(market.currentFossilData);
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
  updateLanguage();
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
      element.addEventListener('input', () => this.calculate());
      element.addEventListener('keyup', () => this.calculate());
    });
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
            <span class="result-value">${strategy.details}</span>
          </div>
        `;
      } else {
        detailsHtml = `
          <div class="result-row">
            <span class="result-label">${translations[lang].quantity_label}</span>
            <span class="result-value">${strategy.quantity.toLocaleString()} ${translations[lang].per_piece_text}</span>
          </div>
        `;
      }
      
      return `
        <div class="result-card ${strategy.isBest ? 'best' : ''}">
          <div class="result-title">
            ${strategy.isBest ? '👑 ' : strategy.type === 'combo' ? '🔄 ' : '🔮 '}${strategy.name}
          </div>
          ${detailsHtml}
          <div class="result-row total">
            <span class="result-label">${translations[lang].total_profit_label}</span>
            <span class="result-value">${strategy.profit.toFixed(2)} ${translations[lang].chaos_label}</span>
          </div>
        </div>
      `;
    }).join('');
    
    container.innerHTML = html;
  }
  
  showInitialState() {
    const container = document.getElementById('calculatorResults');
    const lang = currentLanguage;
    container.innerHTML = `
      <div class="result-card">
        <div class="result-title">📊 ${translations[lang].initial_calc_title}</div>
        <p class="text-center status-neutral">${translations[lang].initial_calc_text}</p>
      </div>
    `;
  }
}

// Fossil Market Data
class FossilMarket {
  constructor() {
    this.FOSSIL_BIOME_RU = {
      "Hollow Fossil": "🕳️ Глубины Бездны",
      "Bound Fossil": "🕳️🌳 Окаменевший лес / Глубины Бездны",
      "Jagged Fossil": "🌳 Окаменевший лес",
      "Dense Fossil": "🍄 Грибные пещеры",
      "Aberrant Fossil": "🍄🕳️ Грибные пещеры / Глубины Бездны",
      "Pristine Fossil": "⛏️🔥 Шахты / Магмовый разлом",
      "Metallic Fossil": "⛏️ Шахты",
      "Serrated Fossil": "⛏️❄️ Шахты / Мёрзлая полость",
      "Aetheric Fossil": "⛏️♨️ Шахты / Серные выходы",
      "Frigid Fossil": "❄️ Мёрзлая полость",
      "Prismatic Fossil": "❄️🔥 Мёрзлая полость / Магмовый разлом",
      "Scorched Fossil": "🔥 Магмовый разлом",
      "Deft Fossil": "🔥 Магмовый разлом",
      "Fundamental Fossil": "🔥♨️ Магмовый разлом / Серные выходы",
      "Lucent Fossil": "🕳️ Глубины Бездны",
      "Perfect Fossil": "🍄♨️ Грибные пещеры / Серные выходы",
      "Corroded Fossil": "🍄🌳 Грибные пещеры / Окаменевший лес",
      "Gilded Fossil": "🍄🕳️ Грибные пещеры / Глубины Бездны",
      "Encrusted Fossil": "🔥 Магмовый разлом",
      "Sanctified Fossil": "🍄 Грибные пещеры",
      "Tangled Fossil": "⛏️ Шахты",
      "Glyphic Fossil": "⏳ Затерянная во времени пещера",
      "Volatile Fossil": "🌋 Расплавленная полость",
      "Shuddering Fossil": "💧 Отсыревшая трещина",
      "Bloodstained Fossil": "🌋 Расплавленная полость",
      "Fractured Fossil": "🌳 Окаменевший лес"
    };

    this.FOSSIL_BIOME_EN = {
      "Hollow Fossil": "🕳️ Abyssal Depths",
      "Bound Fossil": "🕳️🌳 Petrified Forest / Abyssal Depths",
      "Jagged Fossil": "🌳 Petrified Forest",
      "Dense Fossil": "🍄 Fungal Caverns",
      "Aberrant Fossil": "🍄🕳️ Fungal Caverns / Abyssal Depths",
      "Pristine Fossil": "⛏️🔥 Mines / Magma Fissure",
      "Metallic Fossil": "⛏️ Mines",
      "Serrated Fossil": "⛏️❄️ Mines / Frozen Hollow",
      "Aetheric Fossil": "⛏️♨️ Mines / Sulphur Vents",
      "Frigid Fossil": "❄️ Frozen Hollow",
      "Prismatic Fossil": "❄️🔥 Frozen Hollow / Magma Fissure",
      "Scorched Fossil": "🔥 Magma Fissure",
      "Deft Fossil": "🔥 Magma Fissure",
      "Fundamental Fossil": "🔥♨️ Magma Fissure / Sulphur Vents",
      "Lucent Fossil": "🕳️ Abyssal Depths",
      "Perfect Fossil": "🍄♨️ Fungal Caverns / Sulphur Vents",
      "Corroded Fossil": "🍄🌳 Fungal Caverns / Petrified Forest",
      "Gilded Fossil": "🍄🕳️ Fungal Caverns / Abyssal Depths",
      "Encrusted Fossil": "🔥 Magma Fissure",
      "Sanctified Fossil": "🍄 Fungal Caverns",
      "Tangled Fossil": "⛏️ Mines",
      "Glyphic Fossil": "⏳ Lost in Time Cave",
      "Volatile Fossil": "🌋 Molten Cavity",
      "Shuddering Fossil": "💧 Soggy Fissure",
      "Bloodstained Fossil": "🌋 Molten Cavity",
      "Fractured Fossil": "🌳 Petrified Forest"
    };

    this.FOSSIL_RU_NAMES = {
      "Hollow Fossil": "Пустотное ископаемое",
      "Bound Fossil": "Связанное ископаемое",
      "Jagged Fossil": "Зазубренное ископаемое",
      "Dense Fossil": "Плотное ископаемое",
      "Aberrant Fossil": "Искаженное ископаемое",
      "Pristine Fossil": "Первозданное ископаемое",
      "Metallic Fossil": "Металлическое ископаемое",
      "Serrated Fossil": "Зазубренное ископаемое",
      "Aetheric Fossil": "Эфирное ископаемое",
      "Frigid Fossil": "Мерзлое ископаемое",
      "Prismatic Fossil": "Призматическое ископаемое",
      "Scorched Fossil": "Опаленное ископаемое",
      "Deft Fossil": "Ловкое ископаемое",
      "Fundamental Fossil": "Фундаментальное ископаемое",
      "Lucent Fossil": "Светящееся ископаемое",
      "Perfect Fossil": "Идеальное ископаемое",
      "Corroded Fossil": "Разъеденное ископаемое",
      "Gilded Fossil": "Позолоченное ископаемое",
      "Encrusted Fossil": "Инкрустированное ископаемое",
      "Sanctified Fossil": "Освященное ископаемое",
      "Tangled Fossil": "Запутанное ископаемое",
      "Glyphic Fossil": "Глифическое ископаемое",
      "Volatile Fossil": "Изменчивое ископаемое",
      "Shuddering Fossil": "Дрожащее ископаемое",
      "Bloodstained Fossil": "Окровавленное ископаемое",
      "Fractured Fossil": "Расколотое ископаемое"
    };

    this.FOSSIL_EN_NAMES = {
      "Hollow Fossil": "Hollow Fossil",
      "Bound Fossil": "Bound Fossil",
      "Jagged Fossil": "Jagged Fossil",
      "Dense Fossil": "Dense Fossil",
      "Aberrant Fossil": "Aberrant Fossil",
      "Pristine Fossil": "Pristine Fossil",
      "Metallic Fossil": "Metallic Fossil",
      "Serrated Fossil": "Serrated Fossil",
      "Aetheric Fossil": "Aetheric Fossil",
      "Frigid Fossil": "Frigid Fossil",
      "Prismatic Fossil": "Prismatic Fossil",
      "Scorched Fossil": "Scorched Fossil",
      "Deft Fossil": "Deft Fossil",
      "Fundamental Fossil": "Fundamental Fossil",
      "Lucent Fossil": "Lucent Fossil",
      "Perfect Fossil": "Perfect Fossil",
      "Corroded Fossil": "Corroded Fossil",
      "Gilded Fossil": "Gilded Fossil",
      "Encrusted Fossil": "Encrusted Fossil",
      "Sanctified Fossil": "Sanctified Fossil",
      "Tangled Fossil": "Tangled Fossil",
      "Glyphic Fossil": "Glyphic Fossil",
      "Volatile Fossil": "Volatile Fossil",
      "Shuddering Fossil": "Shuddering Fossil",
      "Bloodstained Fossil": "Bloodstained Fossil",
      "Fractured Fossil": "Fractured Fossil"
    };

    this.currentFossilData = null; // Для сохранения данных после загрузки
    this.init();
  }
  
  async init() {
    await this.loadLeagues();
    await this.loadFossilData();
    
    document.getElementById('leagueSelect').addEventListener('change', () => this.loadFossilData());
    document.getElementById('refreshBtn').addEventListener('click', () => this.loadFossilData());
  }
  
  async loadLeagues() {
    const endpoints = [
      'https://poe.ninja/api/data/getindexstate',
      'https://www.poe.ninja/api/data/getindexstate',
      'https://api.allorigins.win/raw?url=https://poe.ninja/api/data/getindexstate',
      'https://api.codetabs.com/v1/proxy?quest=https://poe.ninja/api/data/getindexstate'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, { 
          cache: 'no-store',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const leagues = data.economyLeagues || [];
        
        if (leagues.length > 0) {
          const select = document.getElementById('leagueSelect');
          select.innerHTML = '';
          
          leagues.forEach(league => {
            if (!league.match(/ruthless/i)) {
              const option = document.createElement('option');
              option.value = league;
              option.textContent = league;
              select.appendChild(option);
            }
          });
          
          const currentLeague = leagues.find(l => !l.toLowerCase().includes('hardcore')) || leagues[0];
          if (currentLeague) {
            select.value = currentLeague;
          }
          return;
        }
      } catch (error) {
        console.warn(`Failed to load leagues from ${endpoint}:`, error);
        continue;
      }
    }
    
    const select = document.getElementById('leagueSelect');
    select.innerHTML = '<option value="Mercenaries">Mercenaries</option><option value="Hardcore Mercenaries">Hardcore Mercenaries</option>';
  }
  
  async loadFossilData() {
    const tbody = document.getElementById('fossilTableBody');
    const lastUpdated = document.getElementById('lastUpdated');
    
    tbody.innerHTML = '<tr><td colspan="5"><div class="progress-container"><span data-i18n="loading_data_text">Загрузка данных с poe.ninja</span><div class="progress-bar"></div></div></td></tr>';
    
    const league = document.getElementById('leagueSelect').value;
    
    const endpoints = [
      `https://poe.ninja/api/data/itemoverview?league=${encodeURIComponent(league)}&type=Fossil`,
      `https://www.poe.ninja/api/data/itemoverview?league=${encodeURIComponent(league)}&type=Fossil`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://poe.ninja/api/data/itemoverview?league=${league}&type=Fossil`)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://poe.ninja/api/data/itemoverview?league=${league}&type=Fossil`)}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, { 
          cache: 'no-store',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) continue;
        
        const data = await response.json();
        
        if (data && data.lines && Array.isArray(data.lines) && data.lines.length > 0) {
          this.currentFossilData = data.lines;
          this.renderFossilData(data.lines);
          const lang = currentLanguage;
          lastUpdated.innerHTML = `<span data-i18n="last_updated_prefix">${translations[lang].last_updated_prefix}</span> ${new Date().toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US')}`;
          return;
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${endpoint}:`, error);
        continue;
      }
    }
    
    tbody.innerHTML = '<tr><td colspan="5" class="text-center status-negative">❌ <span data-i18n="loading_error_text">Не удалось загрузить данные. Проверьте подключение или попробуйте позже.</span></td></tr>';
  }
  
  renderFossilData(lines) {
    const tbody = document.getElementById('fossilTableBody');
    const lang = currentLanguage;
    const biomeMap = lang === 'ru' ? this.FOSSIL_BIOME_RU : this.FOSSIL_BIOME_EN;
    const nameMap = lang === 'ru' ? this.FOSSIL_RU_NAMES : this.FOSSIL_EN_NAMES;
    
    const topFossils = lines
      .filter(item => item.chaosValue > 0)
      .sort((a, b) => b.chaosValue - a.chaosValue)
      .slice(0, 5);
    
    if (topFossils.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center status-neutral" data-i18n="no_data_text">Нет данных для выбранной лиги</td></tr>`;
      return;
    }
    
    const html = topFossils.map((fossil, index) => {
      const change = fossil.sparkline?.totalChange || 0;
      const changeClass = change > 3 ? 'status-positive' : change < -3 ? 'status-negative' : 'status-neutral';
      const changeText = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
      
      const biome = biomeMap[fossil.name] || '—';
      const sparklineSvg = this.generateSparkline(fossil.sparkline?.data);
      
      const rankNumber = index + 1;
      
      const fossilName = nameMap[fossil.name] || fossil.name;
      
      return `
        <tr>
          <td class="text-center">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span style="font-weight: 600; color: var(--text-secondary); font-size: 0.9rem;">${rankNumber}.</span>
              <img src="${fossil.icon}" class="icon" alt="${fossil.name}" onerror="this.style.display='none'">
            </div>
          </td>
          <td class="font-bold">${fossilName}</td>
          <td class="status-positive font-bold">${fossil.chaosValue.toFixed(1)} ${translations[lang].chaos_label}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              ${sparklineSvg}
              <span class="${changeClass} font-bold">${changeText}</span>
            </div>
          </td>
          <td>
            <span style="display: inline-block; padding: 4px 8px; border: 1px solid var(--border-secondary); border-radius: 16px; font-size: 0.75rem; color: var(--text-secondary); background: rgba(255,255,255,0.05); white-space: nowrap;">
              ${biome}
            </span>
          </td>
        </tr>
      `;
    }).join('');
    
    tbody.innerHTML = html;
  }

  generateSparkline(data) {
    if (!data || data.length === 0) return '';
    
    const filteredData = data.filter(d => d !== null);
    if (filteredData.length < 2) return '';

    const width = 60;
    const height = 30;
    const padding = 2;
    const max = Math.max(...filteredData);
    const min = Math.min(...filteredData);
    const range = max - min;
    
    if (range === 0) return '';
    
    const points = filteredData.map((d, i) => {
      const x = i / (filteredData.length - 1) * (width - padding * 2) + padding;
      const y = (1 - (d - min) / range) * (height - padding * 2) + padding;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const lastPoint = points.split(' ').pop().split(',');
    const trend = filteredData[filteredData.length - 1] > filteredData[0] ? 'up' : 'down';
    const strokeColor = trend === 'up' ? 'var(--accent-green)' : 'var(--accent-red)';

    return `
      <div class="sparkline">
        <svg width="${width}" height="${height}">
          <polyline points="${points}" style="fill: none; stroke: ${strokeColor}; stroke-width: 1.5;" />
          <circle cx="${lastPoint[0]}" cy="${lastPoint[1]}" r="2" style="fill: ${strokeColor}; stroke: none;" />
        </svg>
      </div>
    `;
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  new ResonatorCalculator();
  const fossilMarket = new FossilMarket();
  document.getElementById('language-switcher').value = currentLanguage;
  updateLanguage();
});
