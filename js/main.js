/**
 * AI Wedding Calc - Frontend JavaScript
 * Handles: calculator interactions, FAQ, navigation, AI suggestions display
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFAQ();
  initCalculators();
  initCategoryTabs();
});

// =================== NAVIGATION ===================
function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      const expanded = nav.classList.contains('active');
      toggle.setAttribute('aria-expanded', expanded);
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('active');
      }
    });
  }
}

// =================== FAQ ACCORDION ===================
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      // Close all in same section
      item.closest('.faq-list')?.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

// =================== CATEGORY TABS ===================
function initCategoryTabs() {
  const tabs = document.querySelectorAll('.category-tab');
  const cards = document.querySelectorAll('.tool-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.category;
      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// =================== CALCULATOR LOGIC ===================
function initCalculators() {
  const form = document.getElementById('calcForm');
  if (!form) return;

  const toolId = form.dataset.toolId;
  const resultType = form.dataset.resultType;
  const resultsPanel = document.getElementById('resultsPanel');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculate(toolId, resultType, form, resultsPanel);
  });

  // Auto-calculate on input change for real-time feel
  let debounceTimer;
  form.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (form.checkValidity()) {
          calculate(toolId, resultType, form, resultsPanel);
        }
      }, 600);
    });
  });
}

function calculate(toolId, resultType, form, resultsPanel) {
  const values = {};
  form.querySelectorAll('input, select').forEach(field => {
    if (field.type === 'number') {
      values[field.id] = parseFloat(field.value) || 0;
    } else {
      values[field.id] = field.value;
    }
  });

  const engine = new CalculatorEngine();
  let result;

  // Route to correct calculator
  switch(toolId) {
    case 'wedding-budget-calculator': result = engine.weddingBudget(values); break;
    case 'wedding-cost-estimator': result = engine.weddingCostEstimator(values); break;
    case 'wedding-savings-calculator': result = engine.weddingSavings(values); break;
    case 'honeymoon-budget-calculator': result = engine.honeymoonBudget(values); break;
    case 'wedding-emergency-fund-calculator': result = engine.weddingEmergencyFund(values); break;
    case 'wedding-guest-list-calculator': result = engine.guestList(values); break;
    case 'wedding-rsvp-calculator': result = engine.rsvpCalc(values); break;
    case 'wedding-plus-one-calculator': result = engine.plusOne(values); break;
    case 'wedding-seating-chart-planner': result = engine.seatingChart(values); break;
    case 'wedding-table-size-calculator': result = engine.tableSize(values); break;
    case 'wedding-catering-calculator': result = engine.catering(values); break;
    case 'wedding-alcohol-calculator': result = engine.alcohol(values); break;
    case 'wedding-bar-cost-calculator': result = engine.barCost(values); break;
    case 'wedding-cake-calculator': result = engine.cake(values); break;
    case 'wedding-appetizer-calculator': result = engine.appetizer(values); break;
    case 'wedding-dinner-cost-calculator': result = engine.dinnerCost(values); break;
    case 'wedding-dessert-calculator': result = engine.dessert(values); break;
    case 'wedding-venue-cost-calculator': result = engine.venueCost(values); break;
    case 'wedding-flower-cost-calculator': result = engine.flowerCost(values); break;
    case 'wedding-gift-calculator': result = engine.gift(values); break;
    case 'wedding-registry-calculator': result = engine.registry(values); break;
    case 'wedding-venue-capacity-calculator': result = engine.venueCapacity(values); break;
    case 'wedding-tent-size-calculator': result = engine.tentSize(values); break;
    default: result = engine.genericTotal(values, toolId); break;
  }

  renderResults(result, resultType, resultsPanel, engine);
}

function renderResults(result, resultType, panel, engine) {
  if (!panel) return;
  let html = '<h2><span class="result-icon">📊</span> Your Results</h2>';

  switch(resultType) {
    case 'breakdown':
      html += renderBreakdown(result, engine);
      break;
    case 'total':
      html += renderTotal(result, engine);
      break;
    case 'savings':
      html += renderSavings(result, engine);
      break;
    case 'guestlist':
      html += renderGuestList(result, engine);
      break;
    case 'attendance':
      html += renderAttendance(result, engine);
      break;
    case 'seating':
      html += renderSeating(result, engine);
      break;
    case 'alcohol':
      html += renderAlcohol(result, engine);
      break;
    case 'giftrange':
      html += renderGiftRange(result, engine);
      break;
    case 'registry':
      html += renderRegistry(result, engine);
      break;
    case 'capacity':
      html += renderCapacity(result, engine);
      break;
    case 'tent':
      html += renderTent(result, engine);
      break;
    case 'cake':
      html += renderCake(result, engine);
      break;
    case 'appetizer':
      html += renderAppetizer(result, engine);
      break;
    case 'dessert':
      html += renderDessert(result, engine);
      break;
    case 'comparison':
      html += renderComparison(result, engine);
      break;
    case 'roi':
      html += renderROI(result, engine);
      break;
    case 'timeline':
      html += renderTimeline(result, engine);
      break;
    case 'checklist':
      html += renderChecklist(result, engine);
      break;
    default:
      html += renderTotal(result, engine);
  }

  // AI Suggestions
  if (result.suggestions && result.suggestions.length > 0) {
    html += renderAISuggestions(result.suggestions);
  }

  panel.innerHTML = html;
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderBreakdown(result, engine) {
  const total = result.total || 0;
  let html = `<div class="result-total"><div class="amount">${engine.formatCurrency(total)}</div><div class="label">Estimated Total</div></div>`;
  if (result.breakdown) {
    html += '<ul class="breakdown-list">';
    result.breakdown.forEach(item => {
      html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>${item.name}</span><span class="value">${engine.formatCurrency(item.amount)} <span class="pct">${item.pct}%</span></span></li>`;
      html += `<li class="breakdown-item" style="border:none;padding:2px 0 8px"><div class="breakdown-bar"><div class="breakdown-bar-fill" style="width:${item.pct}%"></div></div></li>`;
    });
    html += '</ul>';
  }
  if (result.perGuest) {
    html += `<div style="text-align:center;margin-top:1rem;padding-top:1rem;border-top:1px solid #f0f0f0;font-size:0.85rem;color:#737373;">That's approximately <strong style="color:#b76e79">${engine.formatCurrency(result.perGuest)}</strong> per guest</div>`;
  }
  return html;
}

function renderTotal(result, engine) {
  const total = result.total || 0;
  let html = `<div class="result-total"><div class="amount">${engine.formatCurrency(total)}</div><div class="label">Estimated Total</div></div>`;
  if (result.items) {
    html += '<ul class="breakdown-list">';
    result.items.forEach(item => {
      html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>${item.name}</span><span class="value">${engine.formatCurrency(item.amount)}</span></li>`;
    });
    html += '</ul>';
  }
  if (result.low !== undefined) {
    html += `<div style="text-align:center;margin-top:1rem;padding-top:1rem;border-top:1px solid #f0f0f0;font-size:0.85rem;color:#737373;">Typical range: <strong>${engine.formatCurrency(result.low)}</strong> — <strong>${engine.formatCurrency(result.high)}</strong></div>`;
  }
  if (result.perPerson) {
    html += `<div style="text-align:center;margin-top:0.5rem;font-size:0.85rem;color:#737373;">Per person: <strong style="color:#b76e79">${engine.formatCurrency(result.perPerson)}</strong></div>`;
  }
  return html;
}

function renderSavings(result, engine) {
  let html = `<div class="result-total"><div class="amount">${engine.formatCurrency(result.monthlySavings)}</div><div class="label">Monthly Savings Needed</div></div>`;
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Weekly Savings</span><span class="value">${engine.formatCurrency(result.weeklySavings)}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Bi-Weekly Savings</span><span class="value">${engine.formatCurrency(result.biweeklySavings)}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Total Amount Needed</span><span class="value">${engine.formatCurrency(result.totalNeeded)}</span></li>`;
  html += '</ul>';
  if (result.surplus) {
    html += '<div style="text-align:center;margin-top:1rem;padding:0.75rem;background:#e8f5e9;border-radius:8px;font-size:0.85rem;color:#2e7d32;">✅ Your current savings and contributions cover your wedding budget!</div>';
  }
  return html;
}

function renderGuestList(result, engine) {
  let html = `<div class="result-total"><div class="amount">${result.totalInvited}</div><div class="label">Total Guests Invited</div></div>`;
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Expected to Attend</span><span class="value">${result.expectedAttend}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Budget Allows</span><span class="value">${result.budgetCapacity} guests</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Venue Capacity</span><span class="value">${result.venueCapacity} guests</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Cost Per Guest</span><span class="value">${engine.formatCurrency(result.costPP)}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Total Cost</span><span class="value">${engine.formatCurrency(result.totalCost)}</span></li>`;
  html += '</ul>';
  if (result.overBudget) {
    html += `<div style="text-align:center;margin-top:1rem;padding:0.75rem;background:#fff3e0;border-radius:8px;font-size:0.85rem;color:#e65100;">⚠️ You need to trim ${result.cutNeeded} guests to fit your budget and venue</div>`;
  }
  return html;
}

function renderAttendance(result, engine) {
  let html = `<div class="result-total"><div class="amount">${result.totalAttend}</div><div class="label">Expected Attendees</div></div>`;
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Local Guests</span><span class="value">${result.localAttend}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Out-of-Town Guests</span><span class="value">${result.ootAttend}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>International Guests</span><span class="value">${result.intlAttend}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Expected Decline Rate</span><span class="value">${result.declineRate}%</span></li>`;
  html += '</ul>';
  return html;
}

function renderSeating(result, engine) {
  let html = `<div class="result-total"><div class="amount">${result.totalTables}</div><div class="label">Total Tables Needed</div></div>`;
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Guest Tables</span><span class="value">${result.regularTables} (${result.seatsPerTable} per table)</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Head Table</span><span class="value">${result.headTableGuests} seats</span></li>`;
  if (result.extraTables > 0) html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Cake/Gift Tables</span><span class="value">${result.extraTables}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Total Seating Capacity</span><span class="value">${result.totalSeats} guests</span></li>`;
  html += '</ul>';
  return html;
}

function renderAlcohol(result, engine) {
  let html = `<div class="result-total"><div class="amount">${result.totalDrinks}</div><div class="label">Total Drinks Needed</div></div>`;
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Beer</span><span class="value">${result.beer} drinks</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Wine</span><span class="value">${result.wine} drinks</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Cocktails</span><span class="value">${result.cocktails} drinks</span></li>`;
  html += '</ul>';
  html += '<div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #f0f0f0">';
  html += '<div style="font-weight:600;font-size:0.85rem;margin-bottom:0.5rem">To Purchase:</div>';
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Beer</span><span class="value">${result.bottles.beer} bottles/cans</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Wine</span><span class="value">${result.bottles.wineBottles} bottles</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Liquor</span><span class="value">${result.bottles.liquorBottles} bottles</span></li>`;
  html += '</ul></div>';
  if (result.totalCost > 0) {
    html += `<div style="text-align:center;margin-top:1rem;padding-top:1rem;border-top:1px solid #f0f0f0;font-size:0.85rem;color:#737373;">Estimated bar cost: <strong style="color:#b76e79">${engine.formatCurrency(result.totalCost)}</strong></div>`;
  }
  return html;
}

function renderGiftRange(result, engine) {
  let html = `<div class="result-total"><div class="amount">${engine.formatCurrency(result.recommended)}</div><div class="label">Suggested Gift Amount</div></div>`;
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Conservative</span><span class="value">${engine.formatCurrency(result.low)}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Recommended</span><span class="value" style="color:#b76e79">${engine.formatCurrency(result.recommended)}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Generous</span><span class="value">${engine.formatCurrency(result.high)}</span></li>`;
  html += '</ul>';
  return html;
}

function renderRegistry(result, engine) {
  let html = `<div class="result-total"><div class="amount">${result.totalItems}</div><div class="label">Items to Register For</div></div>`;
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Under $50</span><span class="value">${result.under50} items</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>$50 - $150</span><span class="value">${result.midRange} items</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>$150 - $300</span><span class="value">${result.highEnd} items</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>$300+</span><span class="value">${result.premium} items</span></li>`;
  html += '</ul>';
  return html;
}

function renderCapacity(result, engine) {
  let html = `<div class="result-total"><div class="amount">${result.capacity}</div><div class="label">Maximum Guest Capacity</div></div>`;
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Usable Space</span><span class="value">${engine.formatNumber(result.usableSqft)} sq ft</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Space Per Guest</span><span class="value">${result.sqftPP} sq ft</span></li>`;
  html += '</ul>';
  return html;
}

function renderTent(result, engine) {
  let html = `<div class="result-total"><div class="amount">${engine.formatNumber(result.totalSqft)} sq ft</div><div class="label">Tent Size Needed</div></div>`;
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Dimensions</span><span class="value">${result.dimensions} ft</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Estimated Cost</span><span class="value">${engine.formatCurrency(result.cost)}</span></li>`;
  html += '</ul>';
  return html;
}

function renderCake(result, engine) {
  let html = `<div class="result-total"><div class="amount">${engine.formatCurrency(result.total)}</div><div class="label">Estimated Cake Cost</div></div>`;
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Servings</span><span class="value">${result.servings}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Cost Per Slice</span><span class="value">${engine.formatCurrency(result.costPerSlice)}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Tiers</span><span class="value">${result.tiers}</span></li>`;
  html += '</ul>';
  return html;
}

function renderAppetizer(result, engine) {
  let html = `<div class="result-total"><div class="amount">${result.total}</div><div class="label">Total Appetizers Needed</div></div>`;
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Per Person</span><span class="value">${result.perPerson}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Varieties</span><span class="value">${result.varieties} options</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Per Variety</span><span class="value">${result.perVariety} pieces</span></li>`;
  html += '</ul>';
  return html;
}

function renderDessert(result, engine) {
  let html = `<div class="result-total"><div class="amount">${engine.formatCurrency(result.total)}</div><div class="label">Estimated Dessert Cost</div></div>`;
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Per Person</span><span class="value">${engine.formatCurrency(result.perPerson)}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Total Mini Desserts</span><span class="value">${result.items}</span></li>`;
  html += '</ul>';
  return html;
}

function renderComparison(result, engine) {
  return renderTotal(result, engine);
}

function renderROI(result, engine) {
  return renderTotal(result, engine);
}

function renderTimeline(result, engine) {
  return renderTotal(result, engine);
}

function renderChecklist(result, engine) {
  return renderTotal(result, engine);
}

function renderAISuggestions(suggestions) {
  let html = '<div class="ai-suggestion">';
  html += '<div class="ai-suggestion-header"><span class="ai-icon">AI</span> AI-Powered Suggestions</div>';
  html += '<ul>';
  suggestions.forEach(tip => {
    html += `<li>${tip}</li>`;
  });
  html += '</ul></div>';
  return html;
}
