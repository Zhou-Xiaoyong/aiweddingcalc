/**
 * AI Wedding Calc - Frontend JavaScript
 * Handles: calculator interactions, FAQ, navigation, AI suggestions display
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFAQ();
  initCalculators();
  initCategoryTabs();
  initResultActions();
  initNewsletter();
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
  const form = document.getElementById('calcForm');
  const toolId = form?.dataset.toolId || '';
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
    case 'alcohol-bar':
      html += renderAlcoholBar(result, engine);
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

  // Amazon Product Recommendations
  if (toolId && engine.getRecommendedProducts) {
    const amazonProducts = engine.getRecommendedProducts(toolId, 3);
    if (amazonProducts && amazonProducts.length > 0) {
      html += renderAmazonProducts(amazonProducts, 'Shop Wedding Essentials on Amazon');
    }
  }

  panel.innerHTML = html;
  panel.style.display = 'block';

  // Switch layout to full-width when results are shown
  const calcLayout = panel.closest('.calc-layout');
  if (calcLayout) {
    calcLayout.classList.add('has-results');
  }

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
  if (result.perPerson || result.perGuest) {
    const perPerson = result.perPerson || result.perGuest;
    html += `<div style="text-align:center;margin-top:1rem;padding-top:1rem;border-top:1px solid #f0f0f0;font-size:0.85rem;color:#737373;">That's approximately <strong style="color:#b76e79">${engine.formatCurrency(perPerson)}</strong> per person</div>`;
  }
  if (result.styleComparison) {
    html += '<div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid #f0f0f0">';
    html += '<div style="font-weight:600;font-size:0.9rem;margin-bottom:0.75rem;color:#333">📊 Service Style Comparison</div>';
    html += '<ul class="breakdown-list">';
    const form = document.getElementById('calcForm');
    const currentStyle = form?.querySelector('#serviceStyle')?.value || '';
    Object.entries(result.styleComparison).forEach(([style, data]) => {
      const isSelected = style === currentStyle;
      const highlight = isSelected ? ' style="background:#fdf2f4;border-radius:8px;padding:0.5rem;margin:-0.25rem -0.5rem"' : '';
      html += `<li class="breakdown-item"${highlight}><span class="name"><span class="dot"></span>${style}${isSelected ? ' <span style="font-size:0.7rem;color:#b76e79;font-weight:600">(selected)</span>' : ''}</span><span class="value">${engine.formatCurrency(data.perPerson)}/pp <span class="pct">${engine.formatCurrency(data.total)}</span></span></li>`;
    });
    html += '</ul></div>';
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

  if (result.venueSqft && result.maxCapacity) {
    html += '<div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid #f0f0f0">';
    html += '<div style="font-weight:600;font-size:0.9rem;margin-bottom:0.75rem;color:#333">📐 Space & Venue Analysis</div>';
    html += '<ul class="breakdown-list">';
    html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Venue Size</span><span class="value">${engine.formatNumber(result.venueSqft)} sq ft</span></li>`;
    html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Max Venue Capacity</span><span class="value">${result.maxCapacity} guests</span></li>`;
    html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Space Needed</span><span class="value">${engine.formatNumber(result.requiredSqft)} sq ft</span></li>`;
    html += '</ul>';
    if (result.fitsInVenue) {
      html += '<div style="text-align:center;margin-top:0.75rem;padding:0.75rem;background:#e8f5e9;border-radius:8px;font-size:0.85rem;color:#2e7d32;">✅ Your guests fit comfortably in the venue</div>';
    } else {
      html += '<div style="text-align:center;margin-top:0.75rem;padding:0.75rem;background:#fff3e0;border-radius:8px;font-size:0.85rem;color:#e65100;">⚠️ Venue may be tight — consider smaller tables or cocktail style</div>';
    }
    html += '</div>';
  }

  if (result.tableOptions && Object.keys(result.tableOptions).length > 0) {
    html += '<div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid #f0f0f0">';
    html += '<div style="font-weight:600;font-size:0.9rem;margin-bottom:0.75rem;color:#333">🪑 Table Size Options</div>';
    html += '<ul class="breakdown-list">';
    Object.values(result.tableOptions).forEach(table => {
      html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>${table.label}</span><span class="value">${table.count} tables (${table.seats} guests each)</span></li>`;
    });
    html += '</ul></div>';
  }

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

function renderAlcoholBar(result, engine) {
  let html = `<div class="result-total"><div class="amount">${engine.formatCurrency(result.totalCost)}</div><div class="label">Estimated Bar Cost</div></div>`;
  html += `<div style="text-align:center;margin-top:0.5rem;font-size:0.85rem;color:#737373;">Per person: <strong style="color:#b76e79">${engine.formatCurrency(result.perPersonPackage)}</strong> · ${result.totalDrinks} total drinks</div>`;

  html += '<div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #f0f0f0">';
  html += '<div style="font-weight:600;font-size:0.85rem;margin-bottom:0.5rem">🥤 Drink Breakdown:</div>';
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Beer</span><span class="value">${result.beer} drinks</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Wine</span><span class="value">${result.wine} drinks</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Cocktails</span><span class="value">${result.cocktails} drinks</span></li>`;
  html += `<li class="breakdown-item" style="font-weight:600"><span class="name"><span class="dot"></span>Total Drinks</span><span class="value">${result.totalDrinks}</span></li>`;
  html += '</ul></div>';

  html += '<div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #f0f0f0">';
  html += '<div style="font-weight:600;font-size:0.85rem;margin-bottom:0.5rem">🛒 To Purchase:</div>';
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Beer</span><span class="value">${result.bottles.beer} bottles/cans</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Wine</span><span class="value">${result.bottles.wineBottles} bottles</span></li>`;
  if (result.bottles.liquorBottles > 0) {
    html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Liquor</span><span class="value">${result.bottles.liquorBottles} bottles</span></li>`;
  }
  html += '</ul></div>';

  html += '<div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #f0f0f0">';
  html += '<div style="font-weight:600;font-size:0.85rem;margin-bottom:0.5rem">💰 Cost Summary:</div>';
  html += '<ul class="breakdown-list">';
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Package Type</span><span class="value">${result.barPackage}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Premium Spirits</span><span class="value">${result.premiumSpirits === 'Yes' ? 'Yes (+30%)' : 'No'}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Drinking Guests</span><span class="value">${result.drinkers} guests</span></li>`;
  html += `<li class="breakdown-item" style="font-weight:600"><span class="name"><span class="dot"></span>Total Cost</span><span class="value" style="color:#b76e79">${engine.formatCurrency(result.totalCost)}</span></li>`;
  html += '</ul></div>';

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
  let html = `<div class="result-total"><div class="amount">${result.totalItems}</div><div class="label">Total Items to Register For</div></div>`;
  
  html += '<div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #f0f0f0">';
  html += '<div style="font-weight:600;font-size:0.9rem;margin-bottom:0.75rem;color:#333">📦 Gift Breakdown by Price Range</div>';
  html += '<ul class="breakdown-list">';
  
  if (result.priceBreakdown) {
    result.priceBreakdown.forEach(item => {
      html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>${item.range}</span><span class="value">${item.count} items <span class="pct">${item.pct}%</span></span></li>`;
      html += `<li class="breakdown-item" style="border:none;padding:2px 0 8px"><div class="breakdown-bar"><div class="breakdown-bar-fill" style="width:${item.pct}%"></div></div></li>`;
    });
  } else {
    html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Under $50</span><span class="value">${result.under50} items</span></li>`;
    html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>$50 - $150</span><span class="value">${result.midRange} items</span></li>`;
    html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>$150 - $300</span><span class="value">${result.highEnd} items</span></li>`;
    html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>$300+</span><span class="value">${result.premium} items</span></li>`;
  }
  
  html += '</ul></div>';
  
  if (result.homeStyle) {
    html += `<div style="text-align:center;margin-top:0.75rem;font-size:0.85rem;color:#737373;">Home style: <strong style="color:#b76e79">${result.homeStyle}</strong></div>`;
  }
  
  if (result.showAmazonProducts && result.amazonProducts && result.amazonProducts.length > 0) {
    html += '<div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid #f0f0f0">';
    html += '<div class="amazon-products no-print">';
    html += `<div class="amazon-products-header"><span class="amazon-icon">🛒</span> Recommended Amazon Registry Products <span class="amazon-disclosure">As an Amazon Associate, we earn from qualifying purchases.</span></div>`;
    html += '<div class="amazon-product-grid">';
    
    result.amazonProducts.forEach(p => {
      html += `<a href="${p.url}" target="_blank" rel="sponsored nofollow" class="amazon-product-card">`;
      html += `<div class="amazon-product-name">${p.name}</div>`;
      html += `<div class="amazon-product-price">$${p.price.toFixed(2)}</div>`;
      html += '<span class="amazon-cta">Add to Registry →</span>';
      html += '</a>';
    });
    
    html += '</div></div>';
    html += '</div>';
  }
  
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
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Total Servings</span><span class="value">${result.servings}</span></li>`;
  if (result.baseServings !== undefined) {
    html += `<li class="breakdown-item" style="border:none;padding:2px 0 8px"><div style="font-size:0.8rem;color:#737373;padding-left:1.25rem">Guest servings: ${result.baseServings} · 8% buffer: +${result.extraServings - result.baseServings} · Top tier: +${result.topTier}</div></li>`;
  }
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Cost Per Slice</span><span class="value">${engine.formatCurrency(result.costPerSlice)}</span></li>`;
  html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Tiers</span><span class="value">${result.tiers}</span></li>`;
  if (result.hasDessertBar && result.hasDessertBar !== 'No - Cake Only') {
    html += `<li class="breakdown-item"><span class="name"><span class="dot"></span>Dessert Bar</span><span class="value" style="font-size:0.85rem">${result.hasDessertBar.replace('Yes - ', '')}</span></li>`;
  }
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
  if (!result.items) return renderTotal(result, engine);
  let html = `<div class="result-total"><div class="amount">${engine.formatCurrency(result.total)}</div><div class="label">Average Quote</div></div>`;
  html += '<ul class="breakdown-list">';
  result.items.forEach(item => {
    const highlight = item.name === 'Average Quote' ? ' style="font-weight:600;color:#b76e79"' : '';
    html += `<li class="breakdown-item"${highlight}><span class="name"><span class="dot"></span>${item.name}</span><span class="value">${engine.formatCurrency(item.amount)}</span></li>`;
  });
  html += '</ul>';
  if (result.range !== undefined) {
    html += `<div style="text-align:center;margin-top:1rem;padding-top:1rem;border-top:1px solid #f0f0f0;font-size:0.85rem;color:#737373;">Quote range: <strong>${engine.formatCurrency(result.low)}</strong> — <strong>${engine.formatCurrency(result.high)}</strong> (${engine.formatCurrency(result.range)} spread)</div>`;
  }
  if (result.marketRef) {
    html += `<div style="text-align:center;margin-top:0.5rem;font-size:0.85rem;color:#737373;">Market typical: <strong>${engine.formatCurrency(result.marketRef.typical)}</strong> (range: ${engine.formatCurrency(result.marketRef.low)}–${engine.formatCurrency(result.marketRef.high)})</div>`;
  }
  return html;
}

function renderROI(result, engine) {
  return renderTotal(result, engine);
}

function renderTimeline(result, engine) {
  if (!result.events) return renderTotal(result, engine);
  let html = `<div class="result-total"><div class="amount">${result.total}</div><div class="label">Minutes of Wedding Day</div></div>`;
  html += '<div class="timeline-list">';
  result.events.forEach((evt, i) => {
    html += `<div class="breakdown-item" style="padding:0.5rem 0;display:flex;gap:0.75rem;align-items:flex-start">`;
    html += `<div style="min-width:80px;font-weight:600;font-size:0.85rem;color:#b76e79">${evt.time}</div>`;
    html += `<div><div style="font-weight:500;font-size:0.9rem">${evt.name}</div><div style="font-size:0.75rem;color:#737373">${evt.duration}</div></div>`;
    html += `</div>`;
  });
  html += '</div>';
  return html;
}

function renderChecklist(result, engine) {
  if (!result.checklist) return renderTotal(result, engine);
  let html = `<div class="result-total"><div class="amount">${result.total}</div><div class="label">Tasks on Your Checklist</div></div>`;
  html += '<div class="checklist-list">';
  result.checklist.forEach(phase => {
    html += `<div style="margin-bottom:1rem"><div style="font-weight:600;font-size:0.9rem;color:#b76e79;margin-bottom:0.4rem;padding:0.4rem 0;border-bottom:1px solid #f0f0f0">${phase.phase}</div>`;
    html += '<ul style="list-style:none;padding:0;margin:0">';
    phase.tasks.forEach(task => {
      html += `<li style="padding:0.25rem 0 0.25rem 1.5rem;position:relative;font-size:0.85rem"><span style="position:absolute;left:0;top:0.35rem;width:12px;height:12px;border:1.5px solid #b76e79;border-radius:2px;display:inline-block"></span>${task}</li>`;
    });
    html += '</ul></div>';
  });
  html += '</div>';
  return html;
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

function renderAmazonProducts(products, title = 'Recommended on Amazon') {
  if (!products || products.length === 0) return '';
  let html = '<div class="amazon-products no-print">';
  html += `<div class="amazon-products-header"><span class="amazon-icon">🛒</span> ${title} <span class="amazon-disclosure">As an Amazon Associate, we earn from qualifying purchases.</span></div>`;
  html += '<div class="amazon-product-grid">';
  products.forEach(p => {
    html += `<a href="${p.url}" target="_blank" rel="noopener sponsored nofollow" class="amazon-product-card">`;
    html += `<div class="amazon-product-name">${p.name}</div>`;
    html += `<div class="amazon-product-price">$${p.price.toFixed(2)}</div>`;
    html += '<span class="amazon-cta">View on Amazon →</span>';
    html += '</a>';
  });
  html += '</div></div>';
  return html;
}

function renderStateCostComparison(engine, currentState) {
  const mostExpensive = engine.getTop5MostExpensiveStates();
  const leastExpensive = engine.getTop5LeastExpensiveStates();
  const currentData = engine.getStateCostData(currentState);
  let html = '<div class="state-cost-comparison">';
  html += '<div class="state-cost-header"><span class="state-icon">📍</span> Wedding Cost by State</div>';
  if (currentState && currentState !== 'Other') {
    html += `<div class="current-state-card"><div class="cs-label">Your State: <strong>${currentState}</strong></div>`;
    html += `<div class="cs-avg">Average: ${engine.formatCurrency(currentData.avgCost)}</div>`;
    html += `<div class="cs-range">Range: ${engine.formatCurrency(currentData.low)} – ${engine.formatCurrency(currentData.high)}</div>`;
    html += `<div class="cs-pct ${currentData.pctAbove >= 0 ? 'above' : 'below'}">${currentData.pctAbove >= 0 ? '+' : ''}${currentData.pctAbove}% vs national average</div>`;
    html += '</div>';
  }
  html += '<div class="state-cols">';
  html += '<div class="state-col"><h4>Most Expensive States</h4><ul>';
  mostExpensive.forEach((s, i) => {
    html += `<li><span class="rank">${i + 1}</span><span class="state-name">${s.state}</span><span class="state-cost">${engine.formatCurrency(s.avgCost)}</span></li>`;
  });
  html += '</ul></div>';
  html += '<div class="state-col"><h4>Least Expensive States</h4><ul>';
  leastExpensive.forEach((s, i) => {
    html += `<li><span class="rank">${i + 1}</span><span class="state-name">${s.state}</span><span class="state-cost">${engine.formatCurrency(s.avgCost)}</span></li>`;
  });
  html += '</ul></div>';
  html += '</div></div>';
  return html;
}

// =================== BUDGET SAVE / LOAD (localStorage) ===================
function saveBudget() {
  const form = document.getElementById('calcForm');
  if (!form) return;
  const toolId = form.dataset.toolId;
  const values = {};
  form.querySelectorAll('input, select').forEach(field => {
    values[field.id] = field.value;
  });
  const key = `awc_budget_${toolId}`;
  const data = {
    values,
    savedAt: new Date().toISOString(),
    toolId
  };
  localStorage.setItem(key, JSON.stringify(data));
  showToast('Budget saved successfully!', 'success');
}

function loadBudget() {
  const form = document.getElementById('calcForm');
  if (!form) return;
  const toolId = form.dataset.toolId;
  const key = `awc_budget_${toolId}`;
  const saved = localStorage.getItem(key);
  if (!saved) {
    showToast('No saved budget found', '');
    return false;
  }
  try {
    const data = JSON.parse(saved);
    Object.entries(data.values).forEach(([id, value]) => {
      const field = document.getElementById(id);
      if (field) field.value = value;
    });
    if (form.checkValidity()) {
      const resultsPanel = document.getElementById('resultsPanel');
      const resultType = form.dataset.resultType;
      calculate(toolId, resultType, form, resultsPanel);
    }
    showToast('Budget loaded successfully!', 'success');
    return true;
  } catch (e) {
    showToast('Error loading budget', '');
    return false;
  }
}

function hasSavedBudget() {
  const form = document.getElementById('calcForm');
  if (!form) return false;
  const toolId = form.dataset.toolId;
  const key = `awc_budget_${toolId}`;
  return localStorage.getItem(key) !== null;
}

// =================== PDF / PRINT EXPORT ===================
function exportToPDF() {
  const resultsPanel = document.getElementById('resultsPanel');
  const form = document.getElementById('calcForm');
  if (!resultsPanel) return;
  const toolId = form?.dataset.toolId || 'budget';
  const title = toolId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Results';

  // Clone the results and remove Amazon/vendor sections for clean export
  const clone = resultsPanel.cloneNode(true);
  clone.querySelectorAll('.amazon-products, .vendor-recommendations, .result-actions').forEach(el => el.remove());
  const printContent = clone.innerHTML;
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    showToast('Please allow popups to export', '');
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>${title} | AI Wedding Calc</title>
      <style>
        body { font-family: 'Inter', -apple-system, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #262626; }
        h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.5rem; margin-bottom: 1rem; color: #b76e79; }
        h2 { font-size: 1.1rem; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .result-total { text-align: center; padding: 1.5rem 0; border-bottom: 1px solid #e5e5e5; margin-bottom: 1rem; }
        .result-total .amount { font-family: 'Playfair Display', Georgia, serif; font-size: 2.5rem; font-weight: 700; color: #b76e79; }
        .result-total .label { font-size: 0.85rem; color: #737373; margin-top: 0.25rem; }
        .breakdown-list { list-style: none; padding: 0; }
        .breakdown-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #f5f5f5; }
        .breakdown-item .name { font-size: 0.9rem; color: #525252; }
        .breakdown-item .value { font-size: 0.9rem; font-weight: 600; color: #262626; }
        .breakdown-item .pct { font-size: 0.75rem; color: #a3a3a3; margin-left: 0.25rem; }
        .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e5e5; font-size: 0.75rem; color: #a3a3a3; text-align: center; }
        .ai-suggestion { background: #fdf6f7; border: 1px solid rgba(183,110,121,0.15); border-radius: 8px; padding: 1rem; margin-top: 1rem; }
        .ai-suggestion ul { list-style: none; padding: 0; margin: 0; }
        .ai-suggestion li { font-size: 0.85rem; color: #525252; padding: 0.25rem 0; padding-left: 1.25rem; position: relative; }
        .ai-suggestion li::before { content: '💡'; position: absolute; left: 0; font-size: 0.75rem; }
        @media print { body { margin: 20px; } }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p style="font-size:0.8rem;color:#737373;margin-bottom:1.5rem;">Generated by AI Wedding Calc on ${new Date().toLocaleDateString()}</p>
      ${printContent}
      <div class="footer">
        Generated by AI Wedding Calc | aiweddingcalc.com<br>
        All estimates are for planning purposes only.
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

// =================== TOAST NOTIFICATIONS ===================
function showToast(message, type = '') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.className = 'toast ' + type;
  }, 2500);
}

// =================== VENDOR RECOMMENDATIONS ===================
const VENDOR_RECOMMENDATIONS = {
  'wedding-budget-calculator': [
    { name: 'Wedding Planner Pro', rating: '4.9 ★', location: 'Nationwide', cta: 'Get Free Quote', url: '#', category: 'planner' },
    { name: 'Budget Wedding Co.', rating: '4.8 ★', location: 'Online', cta: 'Book Consultation', url: '#', category: 'consulting' }
  ],
  'wedding-venue-cost-calculator': [
    { name: 'Elegant Venues', rating: '4.9 ★', location: 'Find Near You', cta: 'Compare Venues', url: '#', category: 'venue' },
    { name: 'All-Inclusive Weddings', rating: '4.7 ★', location: 'Multiple Cities', cta: 'View Packages', url: '#', category: 'venue' }
  ],
  'wedding-photography-budget-calculator': [
    { name: 'Capture Moments Photo', rating: '5.0 ★', location: 'Find Photographers', cta: 'Get Quotes', url: '#', category: 'photographer' },
    { name: 'Love Story Studio', rating: '4.9 ★', location: 'Nationwide Network', cta: 'View Portfolio', url: '#', category: 'photographer' }
  ],
  'wedding-catering-calculator': [
    { name: 'Gourmet Catering Co.', rating: '4.8 ★', location: 'Find Caterers', cta: 'Get Menu & Quote', url: '#', category: 'caterer' },
    { name: 'Farm to Table Events', rating: '4.9 ★', location: 'Multiple Regions', cta: 'View Menus', url: '#', category: 'caterer' }
  ],
  'wedding-flower-cost-calculator': [
    { name: 'Bloom Floral Design', rating: '4.9 ★', location: 'Find Florists', cta: 'Get Flower Quote', url: '#', category: 'florist' },
    { name: 'Petal & Vine', rating: '4.8 ★', location: 'Nationwide', cta: 'View Designs', url: '#', category: 'florist' }
  ],
  'wedding-dj-cost-calculator': [
    { name: 'Pro DJ Services', rating: '4.9 ★', location: 'Find DJs Near You', cta: 'Book a DJ', url: '#', category: 'dj' },
    { name: 'Beat Masters', rating: '4.8 ★', location: 'Multi-City', cta: 'View Packages', url: '#', category: 'dj' }
  ],
  'wedding-dress-budget-calculator': [
    { name: 'Bridal Boutique Collection', rating: '4.9 ★', location: 'Online + Stores', cta: 'Browse Dresses', url: '#', category: 'dress' },
    { name: 'Designer Bridal Outlet', rating: '4.7 ★', location: 'Online', cta: 'Shop Sale', url: '#', category: 'dress' }
  ]
};

function getVendorRecommendations(toolId) {
  return VENDOR_RECOMMENDATIONS[toolId] || [
    { name: 'Wedding Vendor Network', rating: '4.8 ★', location: 'Find Local Vendors', cta: 'Get Matched', url: '#', category: 'general' },
    { name: 'Premier Wedding Pros', rating: '4.9 ★', location: 'Nationwide', cta: 'View Profiles', url: '#', category: 'general' }
  ];
}

function renderVendorRecommendations(toolId) {
  const vendors = getVendorRecommendations(toolId);
  if (!vendors || vendors.length === 0) return '';
  let html = '<div class="vendor-recommendations">';
  html += '<div class="vendor-rec-header"><span class="vendor-icon">🏆</span> Recommended Vendors <span class="vendor-disclosure">Partner vendors. We may earn a commission at no extra cost to you.</span></div>';
  html += '<div class="vendor-card-grid">';
  vendors.forEach(v => {
    html += `<a href="${v.url}" class="vendor-card" target="_blank" rel="noopener sponsored nofollow">`;
    html += `<div class="vendor-card-name">${v.name}</div>`;
    html += `<div class="vendor-card-rating">${v.rating}</div>`;
    html += `<div class="vendor-card-location">${v.location}</div>`;
    html += `<span class="vendor-card-cta">${v.cta} →</span>`;
    html += '</a>';
  });
  html += '</div></div>';
  return html;
}

// =================== INIT RESULT ACTIONS ===================
function initResultActions() {
  const resultsPanel = document.getElementById('resultsPanel');
  const form = document.getElementById('calcForm');
  if (!resultsPanel || !form) return;

  const observer = new MutationObserver(() => {
    addResultActionsToPanel();
  });
  observer.observe(resultsPanel, { childList: true, subtree: true });

  function addResultActionsToPanel() {
    if (resultsPanel.querySelector('.result-actions')) return;
    const toolId = form.dataset.toolId;
    const actionsHtml = `
      <div class="result-actions">
        <button class="action-btn primary" onclick="exportToPDF()">📄 Export PDF</button>
        <button class="action-btn" onclick="saveBudget()">💾 Save Budget</button>
        ${hasSavedBudget() ? '<button class="action-btn" onclick="loadBudget()">📂 Load Saved</button>' : ''}
      </div>
    `;
    const aiSuggestion = resultsPanel.querySelector('.ai-suggestion');
    const amazonProducts = resultsPanel.querySelector('.amazon-products');
    if (amazonProducts) {
      amazonProducts.insertAdjacentHTML('afterend', actionsHtml);
    } else if (aiSuggestion) {
      aiSuggestion.insertAdjacentHTML('afterend', actionsHtml);
    } else {
      resultsPanel.insertAdjacentHTML('beforeend', actionsHtml);
    }
  }
}

// =================== NEWSLETTER ===================
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]')?.value;
      if (email) {
        showToast('Thanks for subscribing! Check your inbox.', 'success');
        form.reset();
      }
    });
  });
}
