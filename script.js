// Tab Navigation
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.dataset.tab;
    
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update active panel
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(targetTab).classList.add('active');
  });
});

// Resonator Calculator
class ResonatorCalculator {
  constructor() {
    this.resonators = {
      powerful: { cost: 3750, name: 'Мощный резонатор' },
      active: { cost: 750, name: 'Активный резонатор' },
      simple: { cost: 300, name: 'Простой резонатор' }
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
    
    // Single resonator strategies
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
          details: `${quantity.toLocaleString()} шт × ${prices[key].toFixed(1)} хаос`
        });
      }
    });
    
    // Combo strategy (Active + Simple)
    if (prices.active > 0 && prices.simple > 0) {
      const maxActive = Math.floor(azurite / this.resonators.active.cost);
      const remaining = azurite - (maxActive * this.resonators.active.cost);
      const maxSimple = Math.floor(remaining / this.resonators.simple.cost);
      const comboProfit = (maxActive * prices.active) + (maxSimple * prices.simple);
      
      strategies.push({
        type: 'combo',
        name: 'Комбинированная стратегия',
        quantity: maxActive + maxSimple,
        profit: comboProfit,
        details: `${maxActive.toLocaleString()} акт. + ${maxSimple.toLocaleString()} прост.`
      });
    }
    
    if (strategies.length === 0) {
      this.showInitialState();
      return [];
    }
    
    // Find best strategy
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
    
    if (strategies.length === 0) {
      this.showInitialState();
      return;
    }
    
    const html = strategies.map(strategy => {
      let detailsHtml = '';
      if (strategy.type === 'combo') {
        detailsHtml = `
          <div class="result-row">
            <span class="result-label">Состав:</span>
            <span class="result-value">${strategy.details}</span>
          </div>
        `;
      } else {
        detailsHtml = `
          <div class="result-row">
            <span class="result-label">Количество:</span>
            <span class="result-value">${strategy.quantity.toLocaleString()} шт</span>
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
            <span class="result-label">Общая прибыль:</span>
            <span class="result-value">${strategy.profit.toFixed(2)} хаос</span>
          </div>
        </div>
      `;
    }).join('');
    
    container.innerHTML = html;
  }
  
  showInitialState() {
    const container = document.getElementById('calculatorResults');
    container.innerHTML = `
      <div class="result-card">
        <div class="result-title">📊 Готов к расчёту</div>
        <p class="text-center status-neutral">Введите количество азурита и цены резонаторов для расчёта оптимальной стратегии</p>
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

    // --- ДОБАВЛЕН НОВЫЙ ОБЪЕКТ ДЛЯ ПЕРЕВОДА НАЗВАНИЙ ---
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
    // ---------------------------------------------------
    
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
    
    tbody.innerHTML = '<tr><td colspan="5"><div class="progress-container">Загрузка данных с poe.ninja<div class="progress-bar"></div></div></td></tr>';
    
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
          this.renderFossilData(data.lines);
          lastUpdated.textContent = `Последнее обновление: ${new Date().toLocaleString('ru-RU')}`;
          return;
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${endpoint}:`, error);
        continue;
      }
    }
    
    tbody.innerHTML = '<tr><td colspan="5" class="text-center status-negative">❌ Не удалось загрузить данные. Проверьте подключение или попробуйте позже.</td></tr>';
  }
  
  renderFossilData(lines) {
    const tbody = document.getElementById('fossilTableBody');
    
    const topFossils = lines
      .filter(item => item.chaosValue > 0)
      .sort((a, b) => b.chaosValue - a.chaosValue)
      .slice(0, 5);
    
    if (topFossils.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center status-neutral">Нет данных для выбранной лиги</td></tr>';
      return;
    }
    
    const html = topFossils.map((fossil, index) => {
      const change = fossil.sparkline?.totalChange || 0;
      const changeClass = change > 3 ? 'status-positive' : change < -3 ? 'status-negative' : 'status-neutral';
      const changeText = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
      
      const biome = this.FOSSIL_BIOME_RU[fossil.name] || '—';
      const sparklineSvg = this.generateSparkline(fossil.sparkline?.data);
      
      const rankNumber = index + 1;
      
      // --- ИЗМЕНЕНА СТРОКА ДЛЯ ВЫВОДА НАЗВАНИЯ ИСКОПАЕМОГО ---
      const fossilNameRu = this.FOSSIL_RU_NAMES[fossil.name] || fossil.name;
      
      return `
        <tr>
          <td class="text-center">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span style="font-weight: 600; color: var(--text-secondary); font-size: 0.9rem;">${rankNumber}.</span>
              <img src="${fossil.icon}" class="icon" alt="${fossil.name}" onerror="this.style.display='none'">
            </div>
          </td>
          <td class="font-bold">${fossilNameRu}</td>
          <td class="status-positive font-bold">${fossil.chaosValue.toFixed(1)} хаос</td>
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
  new FossilMarket();
});
