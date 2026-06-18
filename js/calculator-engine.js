/**
 * AI Wedding Calc - Calculator Engine & AI Suggestions
 * All calculator logic runs client-side for Cloudflare Pages compatibility
 */

// =================== US WEDDING DATA ===================
const US_WEDDING_DATA = {
  avgBudget: 33000,
  avgGuests: 117,
  costPerGuest: { backyard: 75, casual: 120, semiFormal: 185, formal: 275, blackTie: 400, luxury: 600 },
  locationMultiplier: {
    'Northeast': 1.3, 'Southeast': 0.9, 'Midwest': 0.85,
    'Southwest': 0.95, 'West Coast': 1.35, 'Destination': 1.2
  },
  stateMultiplier: {
    'California': 1.35, 'New York': 1.4, 'Texas': 0.85, 'Florida': 1.0,
    'Illinois': 1.05, 'Pennsylvania': 1.0, 'Ohio': 0.85, 'Georgia': 0.95, 'Other': 1.0
  },
  seasonMultiplier: { 'Spring': 1.05, 'Summer': 1.15, 'Fall': 1.1, 'Winter': 0.85 },
  dayMultiplier: { 'Saturday': 1.2, 'Friday': 1.0, 'Sunday': 0.9, 'Weekday': 0.75 },
  styleMultiplier: { 'Casual': 0.7, 'Semi-Formal': 1.0, 'Formal': 1.3, 'Black Tie': 1.6, 'Luxury': 2.2 },
  cateringPP: { 'Plated Dinner': { Basic: 65, Standard: 95, Premium: 145 }, 'Buffet': { Basic: 50, Standard: 75, Premium: 110 }, 'Family Style': { Basic: 60, Standard: 85, Premium: 125 }, 'Food Stations': { Basic: 55, Standard: 80, Premium: 120 }, 'Cocktail Reception': { Basic: 35, Standard: 55, Premium: 85 } },
  alcoholPPH: { 'Full Open Bar': 18, 'Beer & Wine Only': 10, 'Signature Cocktails + Beer/Wine': 14, 'Cash Bar': 0 },
  barPackagePP: { 'Open Bar (per person)': 55, 'Consumption Bar': 45, 'BYOB': 20, 'Limited Bar': 35 },
  dressCost: { 'Simple/Minimalist': 800, 'Classic/A-Line': 1500, 'Ballgown': 2500, 'Designer/Luxury': 5000 },
  hairCost: { 'Updo': 200, 'Half-Up/Half-Down': 175, 'Blowout': 125, 'Braided Style': 225 },
  makeupCost: { 'Full Glam': 250, 'Natural': 175, 'Airbrush': 300 },
  bridesmaidHairMakeupPP: 175,
  motherHairMakeupPP: 165,
  trialHairCost: 150,
  trialMakeupCost: 150,
  photoBaseHours: { 'Budget': 6, 'Standard': 8, 'Premium': 10 },
  photoBaseCost: { 'Budget': 1800, 'Standard': 3000, 'Premium': 5000 },
  photoExtraHourPP: { 'Budget': 200, 'Standard': 300, 'Premium': 450 },
  secondShooterCost: { 'Budget': 400, 'Standard': 600, 'Premium': 900 },
  engagementShootCost: { 'Budget': 250, 'Standard': 400, 'Premium': 650 },
  photoAlbumCost: { 'Budget': 500, 'Standard': 800, 'Premium': 1500 },
  inviteInsertCost: { 'RSVP Card Only': 0.5, 'RSVP + Details': 1.0, 'RSVP + Details + Map': 1.5, 'Full Suite': 2.5 },
  envelopeLiningCost: 0.5,
  inviteAssemblyCost: 0.5,
  postageCost: 0.99,
  alterationsCost: { 'Simple/Minimalist': 200, 'Classic/A-Line': 300, 'Ballgown': 450, 'Designer/Luxury': 600 },
  dressAccessories: { veil: 200, shoes: 120, jewelry: 100, belt: 100, headpiece: 150 },
  suitAccessories: { shoes: 120, tie: 40, pocketSquare: 20, cufflinks: 40, vest: 80 },
  eventBudgetSplit: {
    'Corporate Conference': [{ name: 'Venue', pct: 0.25 }, { name: 'Catering', pct: 0.20 }, { name: 'AV & Technology', pct: 0.15 }, { name: 'Speakers/Entertainment', pct: 0.10 }, { name: 'Marketing', pct: 0.10 }, { name: 'Staff & Coordination', pct: 0.08 }, { name: 'Printed Materials', pct: 0.05 }, { name: 'Miscellaneous', pct: 0.07 }],
    'Gala/Fundraiser': [{ name: 'Venue', pct: 0.20 }, { name: 'Catering & Bar', pct: 0.30 }, { name: 'Entertainment', pct: 0.12 }, { name: 'Decor & Florals', pct: 0.10 }, { name: 'Marketing & Invitations', pct: 0.08 }, { name: 'Staff & Coordination', pct: 0.08 }, { name: 'Auction Items', pct: 0.07 }, { name: 'Miscellaneous', pct: 0.05 }],
    'Birthday Party': [{ name: 'Venue', pct: 0.20 }, { name: 'Catering & Drinks', pct: 0.30 }, { name: 'Entertainment', pct: 0.15 }, { name: 'Decor', pct: 0.10 }, { name: 'Cake & Desserts', pct: 0.08 }, { name: 'Invitations', pct: 0.05 }, { name: 'Party Favors', pct: 0.05 }, { name: 'Miscellaneous', pct: 0.07 }],
    'Anniversary Celebration': [{ name: 'Venue', pct: 0.22 }, { name: 'Catering & Bar', pct: 0.28 }, { name: 'Entertainment', pct: 0.12 }, { name: 'Decor & Florals', pct: 0.10 }, { name: 'Photography', pct: 0.08 }, { name: 'Invitations', pct: 0.05 }, { name: 'Gifts & Favors', pct: 0.07 }, { name: 'Miscellaneous', pct: 0.08 }],
    'Holiday Party': [{ name: 'Venue', pct: 0.22 }, { name: 'Catering & Bar', pct: 0.30 }, { name: 'Decor & Theme', pct: 0.12 }, { name: 'Entertainment', pct: 0.10 }, { name: 'Activities & Games', pct: 0.08 }, { name: 'Invitations', pct: 0.03 }, { name: 'Party Favors', pct: 0.05 }, { name: 'Miscellaneous', pct: 0.10 }],
    'Graduation Party': [{ name: 'Venue', pct: 0.18 }, { name: 'Catering', pct: 0.30 }, { name: 'Decor', pct: 0.12 }, { name: 'Entertainment', pct: 0.10 }, { name: 'Cake & Desserts', pct: 0.08 }, { name: 'Invitations', pct: 0.05 }, { name: 'Photo Area', pct: 0.07 }, { name: 'Miscellaneous', pct: 0.10 }]
  },
  eventCostPP: { 'Corporate Conference': 150, 'Gala/Fundraiser': 200, 'Birthday Party': 60, 'Anniversary Celebration': 120, 'Holiday Party': 80, 'Graduation Party': 45 },
  eventDurationMult: { '2-3 hours': 0.7, 'Half day': 0.9, 'Full day': 1.0, 'Multi-day': 1.6 },
  photoPackages: { 'Budget': 1800, 'Standard': 3000, 'Premium': 5000 },
  djPackages: { 'Basic (Music Only)': 800, 'Standard (MC + Music)': 1200, 'Premium (MC + Lighting + Effects)': 2200 },
  bandPP: { 'Solo/Duo': 400, 'Trio': 700, '4-5 Piece': 1200, '6-8 Piece': 2500, '9+ Piece': 4500 },
  flowerCosts: { bridalBouquet: { Simple: 150, Standard: 250, 'Lush/Cascading': 400 }, bridesmaidBouquet: 85, centerpieces: { 'Low Compact': 60, 'Medium Mixed': 120, 'Tall & Dramatic': 200, 'Non-Floral': 40 }, boutonniere: 20, corsage: 25 },
  venueCosts: { 'Hotel/Banquet Hall': 8000, 'Barn/Farm': 5500, 'Garden/Outdoor': 4000, 'Museum/Gallery': 9000, 'Restaurant': 6000, 'Religious Venue': 2000, 'Private Estate': 7000 },
  honeymoonCosts: { 'Caribbean / Mexico': { Budget: 2500, Moderate: 4500, Luxury: 8000 }, 'Europe': { Budget: 3500, Moderate: 6000, Luxury: 12000 }, 'Hawaii': { Budget: 3000, Moderate: 5500, Luxury: 9000 }, 'Southeast Asia': { Budget: 2000, Moderate: 3500, Luxury: 7000 }, 'Domestic (US)': { Budget: 1500, Moderate: 3000, Luxury: 5000 }, 'Cruise': { Budget: 2000, Moderate: 4000, Luxury: 7500 } },
  avgAttendanceRate: { local: 0.85, outOfTown: 0.65, international: 0.40, destination: 0.50 },
  tentSqftPerGuest: { 'Round Tables': 15, 'Long Tables': 12, 'Ceremony + Reception': 18 },
  tentCostPerSqft: { 'Frame Tent': 4, 'Pole Tent': 3, 'Clear-Span': 8, 'Sailcloth': 6 },
  venueSqftPP: { 'Theater Style': 8, 'Banquet Rounds': 14, 'Classroom': 12, 'Standing/Cocktail': 6 },
  cakePerSlice: { 'Simple': 3.5, 'Moderate': 6, 'Elaborate': 10 },
  dessertPP: { 'Cake Only': 4, 'Cake + Dessert Bar': 8, 'Dessert Bar Only': 7, 'Cupcake Tower': 5, 'Donut Wall': 4.5, 'Mixed Station': 9 },
  inviteCost: { 'Digital Print': 2.5, 'Thermography': 4.5, 'Letterpress': 8, 'Foil Stamp': 10, 'Engraving': 15 },
  lightingCost: { 'Basic (String Lights)': 400, 'Standard (Uplighting)': 1000, 'Premium (Full Design)': 2500, 'DIY Only': 150 },
  photoBoothCost: { 'Open-Air Booth': 500, 'Enclosed Booth': 700, '360 Booth': 1200, 'GIF/Mirror Booth': 900 },
  saveTheDateCost: { 'Postcard': 1.2, 'Standard Card': 1.8, 'Magnet': 2.5, 'Digital Only': 0.5, 'Video': 1.5 },
  programCost: { 'Single Card': 0.5, 'Bi-Fold': 1.2, 'Tri-Fold': 1.5, 'Booklet': 2.5, 'Fan': 2.0 },
  thankYouCost: { 'Standard Flat Card': 1.5, 'Folded Card': 2.5, 'Photo Card': 3.0, 'Custom Design': 4.0 },
  suitCosts: { 'Rent Tuxedo': 200, 'Buy Suit': 450, 'Buy Tuxedo': 800 },
  ringCosts: { 'Gold (Yellow)': 600, 'White Gold': 700, 'Rose Gold': 650, 'Platinum': 1200, 'Titanium': 200, 'Tungsten': 150 },
  transportationCosts: { 'Classic Limousine': 120, 'SUV Limousine': 150, 'Party Bus': 180, 'Vintage Car': 200, 'Luxury Sedan': 100, 'Guest Shuttle Bus': 80 },
  officiantCosts: { 'Religious (Church/Temple)': 300, 'Civil (Judge/JP)': 200, 'Professional Celebrant': 600, 'Friend/Family Member': 50 },
  plannerCosts: { 'Full-Service Planning': 0.12, 'Partial Planning': 0.06, 'Month-Of Coordination': 2500, 'Day-Of Coordination': 1500 },
  giftRanges: { 'Close Family': [150, 300], 'Extended Family': [100, 200], 'Close Friend': [100, 175], 'Friend': [50, 100], 'Coworker': [50, 75], 'Acquaintance': [25, 50] },
  registryItemsPerGuest: 2.5,
  seatingPerTable: { '6 (Round)': 6, '8 (Round)': 8, '10 (Round)': 10, '8 (Long)': 8, '10 (Long)': 10 },
  headTableGuests: { 'Sweetheart Table (2)': 2, 'Head Table (8-12)': 10, "King's Table (16+)": 16 }
};

// =================== CALCULATOR ENGINE ===================
class CalculatorEngine {
  constructor() {
    this.data = US_WEDDING_DATA;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  }

  formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
  }

  // Wedding Budget Calculator
  weddingBudget(values) {
    const { totalBudget, guestCount, location, style, season } = values;
    const locMult = this.data.locationMultiplier[location] || 1;
    const styleMult = this.data.styleMultiplier[style] || 1;
    const seasonMult = this.data.seasonMultiplier[season] || 1;

    const adjustedBudget = totalBudget * locMult * styleMult * seasonMult;
    const categories = [
      { name: 'Venue & Catering', pct: 0.38 },
      { name: 'Photography & Video', pct: 0.12 },
      { name: 'Attire & Beauty', pct: 0.08 },
      { name: 'Music & Entertainment', pct: 0.06 },
      { name: 'Flowers & Decor', pct: 0.06 },
      { name: 'Stationery', pct: 0.03 },
      { name: 'Favors & Gifts', pct: 0.03 },
      { name: 'Transportation', pct: 0.03 },
      { name: 'Miscellaneous & Emergency', pct: 0.05 }
    ];

    const breakdown = categories.map(c => ({
      name: c.name,
      amount: Math.round(adjustedBudget * c.pct),
      pct: Math.round(c.pct * 100)
    }));

    const perGuest = Math.round(adjustedBudget / guestCount);
    const suggestions = this.getBudgetSuggestions(totalBudget, guestCount, location, style);

    return { total: Math.round(adjustedBudget), breakdown, perGuest, suggestions };
  }

  // Wedding Cost Estimator
  weddingCostEstimator(values) {
    const { guestCount, location, style, hasRehearsal, hasHoneymoon } = values;
    const styleKeyMap = { 'Backyard': 'backyard', 'Casual': 'casual', 'Semi-Formal': 'semiFormal', 'Formal': 'formal', 'Black Tie': 'blackTie', 'Luxury': 'luxury' };
    const base = this.data.costPerGuest[styleKeyMap[style] || 'semiFormal'] || 185;
    const stateMult = this.data.stateMultiplier[location] || 1;
    let total = guestCount * base * stateMult;
    if (hasRehearsal === 'Yes') total += 2500;
    if (hasHoneymoon === 'Yes') total += 4500;
    const low = Math.round(total * 0.8);
    const high = Math.round(total * 1.25);
    return { total: Math.round(total), low, high, perGuest: Math.round(total / guestCount), suggestions: this.getCostEstimatorSuggestions(total, guestCount, style) };
  }

  // Wedding Savings Calculator
  weddingSavings(values) {
    const { targetBudget, currentSavings, monthsUntil, monthlyContribution } = values;
    const familyContrib = monthlyContribution || 0;
    const needed = targetBudget - currentSavings - familyContrib;
    const monthlySave = needed > 0 ? Math.ceil(needed / monthsUntil) : 0;
    const weeklySave = Math.ceil(monthlySave / 4.33);
    const biweeklySave = Math.ceil(monthlySave / 2);
    const surplus = currentSavings + familyContrib >= targetBudget;
    return {
      totalNeeded: Math.max(0, needed),
      monthlySavings: monthlySave,
      weeklySavings: weeklySave,
      biweeklySavings: biweeklySave,
      percentOfIncome: 0,
      isAffordable: surplus || monthlySave <= 2000,
      surplus,
      suggestions: this.getSavingsSuggestions(monthlySave, targetBudget, monthsUntil)
    };
  }

  // Honeymoon Budget Calculator
  honeymoonBudget(values) {
    const { destination, duration, travelStyle, travelers } = values;
    const base = this.data.honeymoonCosts[destination]?.[travelStyle] || 4500;
    const total = base * (travelers / 2) * (duration / 7);
    const categories = [
      { name: 'Flights', pct: 0.30 },
      { name: 'Accommodation', pct: 0.30 },
      { name: 'Food & Dining', pct: 0.20 },
      { name: 'Activities & Excursions', pct: 0.12 },
      { name: 'Transportation', pct: 0.05 },
      { name: 'Miscellaneous', pct: 0.03 }
    ];
    const breakdown = categories.map(c => ({ name: c.name, amount: Math.round(total * c.pct), pct: Math.round(c.pct * 100) }));
    return { total: Math.round(total), breakdown, daily: Math.round(total / duration), suggestions: this.getHoneymoonSuggestions(destination, travelStyle, total) };
  }

  // Wedding Emergency Fund Calculator
  weddingEmergencyFund(values) {
    const { totalBudget, vendorCount, outdoorWedding, destinationWedding } = values;
    let pct = 0.05;
    if (vendorCount > 8) pct += 0.02;
    if (outdoorWedding === 'Yes') pct += 0.03;
    if (destinationWedding === 'Yes') pct += 0.02;
    pct = Math.min(pct, 0.15);
    const fund = Math.round(totalBudget * pct);
    const items = [
      { name: 'Vendor overtime/extra fees', amount: Math.round(fund * 0.25) },
      { name: 'Weather backup plan', amount: Math.round(fund * 0.2) },
      { name: 'Last-minute alterations', amount: Math.round(fund * 0.15) },
      { name: 'Additional guests', amount: Math.round(fund * 0.15) },
      { name: 'Transportation changes', amount: Math.round(fund * 0.1) },
      { name: 'Unexpected rentals', amount: Math.round(fund * 0.15) }
    ];
    return { total: fund, pct: Math.round(pct * 100), items, suggestions: this.getEmergencyFundSuggestions(pct, outdoorWedding === 'Yes') };
  }

  // Guest List Calculator
  guestList(values) {
    const { budget, venueCapacity, brideFamilyCount, groomFamilyCount, friendsCount, coworkersCount } = values;
    const totalInvited = (brideFamilyCount || 0) + (groomFamilyCount || 0) + (friendsCount || 0) + (coworkersCount || 0);
    const costPP = 150;
    const budgetCapacity = Math.floor(budget / costPP);
    const actualCapacity = Math.min(venueCapacity, budgetCapacity);
    const expectedAttend = Math.round(totalInvited * 0.78);
    const overBudget = totalInvited > actualCapacity;
    const cutNeeded = overBudget ? totalInvited - actualCapacity : 0;
    return {
      totalInvited,
      expectedAttend,
      budgetCapacity,
      venueCapacity,
      actualCapacity,
      overBudget,
      cutNeeded,
      costPP,
      totalCost: totalInvited * costPP,
      suggestions: this.getGuestListSuggestions(totalInvited, actualCapacity, budget)
    };
  }

  // RSVP Calculator
  rsvpCalc(values) {
    const { totalInvited, localGuests, outOfTownGuests, internationalGuests, isDestination } = values;
    const localPct = (localGuests || 0) / 100;
    const ootPct = (outOfTownGuests || 0) / 100;
    const intlPct = (internationalGuests || 0) / 100;
    const destMult = isDestination === 'Yes' ? 0.7 : 1;
    const localAttend = Math.round(totalInvited * localPct * this.data.avgAttendanceRate.local * destMult);
    const ootAttend = Math.round(totalInvited * ootPct * this.data.avgAttendanceRate.outOfTown * destMult);
    const intlAttend = Math.round(totalInvited * intlPct * this.data.avgAttendanceRate.international * destMult);
    const totalAttend = localAttend + ootAttend + intlAttend;
    const declineRate = Math.round((1 - totalAttend / totalInvited) * 100);
    return { totalAttend, localAttend, ootAttend, intlAttend, declineRate, totalInvited, suggestions: this.getRSVPSuggestions(totalAttend, totalInvited, declineRate) };
  }

  // Plus-One Calculator
  plusOne(values) {
    const { singleGuests, costPerGuest, plusOnePolicy } = values;
    const policyMultiplier = { 'All singles get plus-ones': 0.8, 'Only serious relationships': 0.4, 'Wedding party only': 0.15, 'No plus-ones': 0 };
    const plusOnes = Math.round(singleGuests * (policyMultiplier[plusOnePolicy] || 0));
    const additionalCost = plusOnes * costPerGuest;
    return { plusOnes, additionalCost, totalGuests: singleGuests + plusOnes, suggestions: this.getPlusOneSuggestions(plusOnePolicy, plusOnes, additionalCost) };
  }

  // Seating Chart Planner
  seatingChart(values) {
    const { guestCount, tableSize, headTable, cakeTable } = values;
    const seatsPerTable = this.data.seatingPerTable[tableSize] || 8;
    const headTableGuests = this.data.headTableGuests[headTable] || 2;
    const regularGuests = guestCount - headTableGuests;
    const regularTables = Math.ceil(regularGuests / seatsPerTable);
    const extraTables = cakeTable === 'Yes' ? 2 : 0;
    const totalTables = regularTables + 1 + extraTables;
    return { totalTables, regularTables, seatsPerTable, headTableGuests, extraTables, totalSeats: regularTables * seatsPerTable + headTableGuests, suggestions: this.getSeatingSuggestions(guestCount, totalTables) };
  }

  // Table Size Calculator
  tableSize(values) {
    const { guestCount, venueSqft, tablePreference } = values;
    const sqftPP = 14;
    const tables = {};
    if (tablePreference === 'Round' || tablePreference === 'Mix of Both') {
      tables.round60 = { seats: 8, count: Math.ceil(guestCount / 8), diameter: '60"' };
      tables.round72 = { seats: 10, count: Math.ceil(guestCount / 10), diameter: '72"' };
    }
    if (tablePreference === 'Rectangular' || tablePreference === 'Mix of Both') {
      tables.rect6ft = { seats: 8, count: Math.ceil(guestCount / 8), length: '6 ft' };
      tables.rect8ft = { seats: 10, count: Math.ceil(guestCount / 10), length: '8 ft' };
    }
    const maxCapacity = Math.floor(venueSqft / sqftPP);
    return { tables, maxCapacity, fitsInVenue: guestCount <= maxCapacity, suggestions: this.getTableSizeSuggestions(guestCount, venueSqft) };
  }

  // Catering Calculator
  catering(values) {
    const { guestCount, serviceStyle, mealPlan } = values;
    const pp = this.data.cateringPP[serviceStyle]?.[mealPlan] || 95;
    const total = guestCount * pp;
    const categories = [
      { name: 'Main Course', pct: 0.40 },
      { name: 'Appetizers', pct: 0.15 },
      { name: 'Side Dishes', pct: 0.12 },
      { name: 'Dessert', pct: 0.10 },
      { name: 'Service Staff', pct: 0.13 },
      { name: 'Rentals & Equipment', pct: 0.07 },
      { name: 'Tax & Gratuity', pct: 0.03 }
    ];
    const breakdown = categories.map(c => ({ name: c.name, amount: Math.round(total * c.pct), pct: Math.round(c.pct * 100) }));
    return { total, perPerson: pp, breakdown, suggestions: this.getCateringSuggestions(serviceStyle, mealPlan, pp) };
  }

  // Alcohol Calculator
  alcohol(values) {
    const { guestCount, duration, drinkerPercent, barType } = values;
    const drinkers = Math.round(guestCount * (drinkerPercent / 100));
    const drinksPPH = 1.5;
    const totalDrinks = Math.round(drinkers * duration * drinksPPH);
    let beer, wine, cocktails;
    if (barType === 'Beer & Wine Only') { beer = Math.round(totalDrinks * 0.55); wine = Math.round(totalDrinks * 0.45); cocktails = 0; }
    else if (barType === 'Full Open Bar') { beer = Math.round(totalDrinks * 0.4); wine = Math.round(totalDrinks * 0.35); cocktails = Math.round(totalDrinks * 0.25); }
    else { beer = Math.round(totalDrinks * 0.35); wine = Math.round(totalDrinks * 0.35); cocktails = Math.round(totalDrinks * 0.30); }
    const bottles = { beer: Math.ceil(beer / 24) * 24, wineBottles: Math.ceil(wine / 5), liquorBottles: Math.ceil(cocktails / 18) };
    const costPP = this.data.alcoholPPH[barType] || 0;
    const totalCost = costPP * drinkers * duration;
    return { totalDrinks, beer, wine, cocktails, bottles, totalCost, costPP: costPP * duration, suggestions: this.getAlcoholSuggestions(barType, totalDrinks, drinkers) };
  }

  // Bar Cost Calculator
  barCost(values) {
    const { guestCount, duration, barPackage, premiumSpirits } = values;
    const ppCost = this.data.barPackagePP[barPackage] || 45;
    const premium = premiumSpirits === 'Yes' ? 1.3 : 1;
    const total = Math.round(guestCount * ppCost * (duration / 4) * premium);
    return { total, perPerson: Math.round(ppCost * premium), duration, suggestions: this.getBarCostSuggestions(barPackage, total, guestCount) };
  }

  // Cake Calculator
  cake(values) {
    const { guestCount, servingSize, tierCount, designComplexity } = values;
    const servingMultiplier = { 'Dessert Portion (larger)': 1.5, 'Wedding Portion (standard)': 1, 'Tasting Portion (mini)': 0.6 };
    const servings = Math.ceil(guestCount * (servingMultiplier[servingSize] || 1));
    const costPerSlice = this.data.cakePerSlice[designComplexity] || 6;
    const total = Math.round(servings * costPerSlice);
    const tiers = parseInt(tierCount) || 3;
    return { total, servings, costPerSlice, tiers, suggestions: this.getCakeSuggestions(servings, designComplexity, total) };
  }

  // Appetizer Calculator
  appetizer(values) {
    const { guestCount, cocktailDuration, followedByDinner, varietyLevel } = values;
    const base = followedByDinner === 'Yes' ? 6 : 12;
    const durationMult = cocktailDuration / 1.5;
    const pp = Math.round(base * durationMult);
    const total = guestCount * pp;
    const varieties = parseInt(varietyLevel) || 5;
    const perVariety = Math.ceil(total / varieties);
    return { total, perPerson: pp, varieties, perVariety, suggestions: this.getAppetizerSuggestions(followedByDinner, pp) };
  }

  // Dinner Cost Calculator
  dinnerCost(values) {
    const { guestCount, serviceStyle, entreeChoice, includeSalad, includeDessert } = values;
    const base = this.data.cateringPP[serviceStyle]?.Standard || 95;
    const entreeMult = { '1 Option': 1, '2 Options': 1.15, '3+ Options': 1.3 };
    let pp = base * (entreeMult[entreeChoice] || 1);
    if (includeSalad === 'Yes') pp += 12;
    if (includeDessert === 'Yes') pp += 15;
    const total = Math.round(guestCount * pp);
    return { total, perPerson: Math.round(pp), suggestions: this.getDinnerSuggestions(serviceStyle, pp) };
  }

  // Dessert Calculator
  dessert(values) {
    const { guestCount, dessertType, hasCake } = values;
    const pp = this.data.dessertPP[dessertType] || 6;
    const total = Math.round(guestCount * pp);
    const items = Math.ceil(guestCount * 2.5);
    return { total, perPerson: pp, items, hasCake: hasCake === 'Yes', suggestions: this.getDessertSuggestions(dessertType, guestCount) };
  }

  // Venue Cost Calculator
  venueCost(values) {
    const { venueType, guestCount, region, season, dayOfWeek } = values;
    const base = this.data.venueCosts[venueType] || 6000;
    const regMult = this.data.locationMultiplier[region] || 1;
    const seaMult = this.data.seasonMultiplier[season] || 1;
    const dayMult = this.data.dayMultiplier[dayOfWeek] || 1;
    const total = Math.round(base * regMult * seaMult * dayMult);
    const categories = [
      { name: 'Site Fee', pct: 0.40 },
      { name: 'Catering Minimum', pct: 0.35 },
      { name: 'Rentals', pct: 0.10 },
      { name: 'Service Charges', pct: 0.08 },
      { name: 'Insurance & Permits', pct: 0.04 },
      { name: 'Cleanup Fee', pct: 0.03 }
    ];
    const breakdown = categories.map(c => ({ name: c.name, amount: Math.round(total * c.pct), pct: Math.round(c.pct * 100) }));
    return { total, breakdown, suggestions: this.getVenueSuggestions(venueType, season, dayOfWeek) };
  }

  // Flower Cost Calculator
  flowerCost(values) {
    const { bridalBouquet, bridesmaidCount, centerpieces, tableCount, ceremonyArrangements } = values;
    const bridalCost = this.data.flowerCosts.bridalBouquet[bridalBouquet] || 250;
    const bmCost = (bridesmaidCount || 0) * this.data.flowerCosts.bridesmaidBouquet;
    const centerCost = (tableCount || 0) * (this.data.flowerCosts.centerpieces[centerpieces] || 120);
    const ceremonyCost = { 'Minimal (2-4 pieces)': 300, 'Moderate (5-8 pieces)': 700, 'Lavish (9+ pieces)': 1500 }[ceremonyArrangements] || 500;
    const boutonnieres = Math.round((bridesmaidCount || 0) * 1.5) * this.data.flowerCosts.boutonniere;
    const total = bridalCost + bmCost + centerCost + ceremonyCost + boutonnieres;
    const breakdown = [
      { name: "Bride's Bouquet", amount: bridalCost, pct: Math.round(bridalCost / total * 100) },
      { name: 'Bridesmaid Bouquets', amount: bmCost, pct: Math.round(bmCost / total * 100) },
      { name: 'Centerpieces', amount: centerCost, pct: Math.round(centerCost / total * 100) },
      { name: 'Ceremony Florals', amount: ceremonyCost, pct: Math.round(ceremonyCost / total * 100) },
      { name: 'Boutonnieres & Corsages', amount: boutonnieres, pct: Math.round(boutonnieres / total * 100) }
    ];
    return { total, breakdown, suggestions: this.getFlowerSuggestions(centerpieces, ceremonyArrangements) };
  }

  // Generic total-based calculator
  genericTotal(values, toolId) {
    const calculations = {
      'wedding-decoration-budget-calculator': () => {
        const styleMult = { Minimalist: 0.6, Classic: 1, Romantic: 1.2, Rustic: 0.8, Glamorous: 1.8 };
        const approachMult = { 'Full DIY': 0.4, 'Partial DIY': 0.7, 'Professional Decorator': 1.3, 'Venue Includes Decor': 0.3 };
        const base = (values.guestCount || 100) * 25;
        return Math.round(base * (styleMult[values.decorStyle] || 1) * (approachMult[values.approach] || 1));
      },
      'wedding-lighting-calculator': () => {
        const pkg = this.data.lightingCost[values.lightingPackage] || 400;
        const sizeMult = (values.venueSize || 3000) / 3000;
        return Math.round(pkg * sizeMult);
      },
      'wedding-emergency-fund-calculator': () => this.weddingEmergencyFund(values).total,
      'wedding-bar-cost-calculator': () => this.barCost(values).total,
      'wedding-dinner-cost-calculator': () => this.dinnerCost(values).total,
      'bridesmaid-proposal-cost-calculator': () => {
        const styleMult = { 'Simple (Card + 1-2 items)': 25, 'Standard (4-5 items)': 55, 'Deluxe (6+ items)': 95, 'DIY Only': 15 };
        const base = (styleMult[values.boxStyle] || 55) * (values.bridesmaidCount || 5);
        return values.includeApparel === 'Yes' ? base + (values.bridesmaidCount || 5) * 45 : base;
      },
      'wedding-accessories-budget-calculator': () => {
        let total = 0;
        const items = [];
        const veilCost = { 'Yes - Cathedral Veil': 350, 'Yes - Fingertip Veil': 200, 'Yes - Birdcage/Blusher': 120, 'Hair Piece Only': 150 };
        if (veilCost[values.needVeil]) { const c = veilCost[values.needVeil]; total += c; items.push({ name: 'Veil/Hair Piece', amount: c }); }
        const shoeCost = { 'Yes - Designer': 250, 'Yes - Standard': 120 };
        if (shoeCost[values.needShoes]) { const c = shoeCost[values.needShoes]; total += c; items.push({ name: 'Bridal Shoes', amount: c }); }
        const jewelryCost = { 'Yes - Full Set': 250, 'Yes - Earrings Only': 80, 'Yes - Necklace + Earrings': 180 };
        if (jewelryCost[values.needJewelry]) { const c = jewelryCost[values.needJewelry]; total += c; items.push({ name: 'Bridal Jewelry', amount: c }); }
        if (values.needBelt === 'Yes') { total += 120; items.push({ name: 'Dress Sash/Belt', amount: 120 }); }
        const breakdown = items.map(i => ({ ...i, pct: Math.round(i.amount / total * 100) }));
        return { total, breakdown, suggestions: this.getAccessoriesSuggestions(total) };
      },
      'wedding-videography-cost-calculator': () => {
        const pkgMult = { 'Highlight Reel (3-5 min)': 1500, 'Ceremony + Highlights': 2500, 'Full Documentary': 3500, 'Same-Day Edit': 4500 };
        let total = pkgMult[values.packageType] || 2500;
        total += Math.max(0, (values.duration - 8)) * 150;
        if (values.droneFootage === 'Yes') total += 400;
        if (values.rawFootage === 'Yes') total += 300;
        return total;
      },
      'wedding-photo-album-calculator': () => {
        const sizeMult = { '8x8 inches': 0.7, '10x10 inches': 1, '12x12 inches': 1.3, '11x14 inches': 1.5 };
        const coverMult = { 'Linen': 1, 'Leather': 1.2, 'Acrylic': 1.5, 'Metal': 1.8 };
        const base = 800 * (sizeMult[values.albumSize] || 1) * (coverMult[values.coverType] || 1);
        const pages = values.pageCount || 30;
        const extraPages = Math.max(0, pages - 20) * 25;
        const parentAlbums = (values.parentAlbums || 0) * 400;
        return Math.round(base + extraPages + parentAlbums);
      },
      'wedding-save-the-date-calculator': () => {
        const pp = this.data.saveTheDateCost[values.format] || 1.8;
        const count = values.guestCount || 80;
        return Math.round(count * pp + (count * 0.73));
      },
      'wedding-program-calculator': () => {
        const pp = this.data.programCost[values.format] || 1.2;
        const printMult = { 'Digital Print': 1, 'Letterpress': 2.5, 'Foil Stamp': 3 };
        const count = Math.ceil((values.guestCount || 100) * 0.8);
        return Math.round(count * pp * (printMult[values.printingMethod] || 1));
      },
      'wedding-thank-you-card-calculator': () => {
        const pp = this.data.thankYouCost[values.cardStyle] || 2;
        const count = Math.ceil((values.guestCount || 100) * 1.15);
        const stamps = values.includeStamps === 'Yes' ? count * 0.73 : 0;
        return Math.round(count * pp + stamps);
      },
      'wedding-band-cost-calculator': () => {
        const base = this.data.bandPP[values.bandSize] || 1200;
        const hours = values.duration || 4;
        const ceremony = values.ceremonyPerformance === 'Yes' ? 500 : 0;
        return Math.round(base * ((hours || 4) / 3)) + ceremony;
      },
      'wedding-entertainment-budget-calculator': () => {
        const items = { 'Photo Booth Only': 800, 'Photo Booth + Lawn Games': 1400, 'Photo Booth + Magician': 1800, 'Full Entertainment Package': 3000 };
        return (items[values.entertainmentItems] || 800) * ((values.totalBudget || 30000) / 30000);
      },
      'wedding-favor-cost-calculator': () => (values.guestCount || 100) * (values.costPerGuest || 5),
      'wedding-party-gift-calculator': () => {
        const levelMult = { 'Thoughtful ($25-50 each)': 35, 'Standard ($50-100 each)': 75, 'Premium ($100+ each)': 125 };
        const bridal = ((values.bridesmaidCount || 0) + (values.groomsmanCount || 0)) * (levelMult[values.giftLevel] || 75);
        const parentGifts = values.parentsGifts === 'Yes - Both Sets' ? 400 : values.parentsGifts === 'Yes - One Set' ? 200 : 0;
        return bridal + parentGifts;
      },
      'wedding-dj-cost-calculator': () => {
        const pkg = this.data.djPackages[values.packageLevel] || 1200;
        const ceremony = values.ceremonyMusic === 'Yes' ? 300 : 0;
        const soundRental = values.soundSystem === 'Need rental' ? 400 : 0;
        return Math.round(pkg * ((values.duration || 4) / 4)) + ceremony + soundRental;
      },
      'wedding-rings-budget-calculator': () => {
        const metal = this.data.ringCosts[values.metalPreference] || 600;
        const styleMult = { Plain: 0.7, 'Diamond Accent': 1.5, 'Eternity Band': 2.2, 'Custom Design': 2.8 };
        const basePerRing = metal * (styleMult[values.style] || 1);
        const twoRings = values.needTwoRings === 'Yes' ? 2 : 1;
        const total = basePerRing * twoRings;
        return { total: Math.round(total), brideBand: Math.round(basePerRing * 0.45), groomBand: Math.round(basePerRing * 0.55), engraving: Math.round(twoRings * 40), insurance: Math.round(total * 0.03) };
      },
      'wedding-officiant-cost-calculator': () => {
        const base = this.data.officiantCosts[values.officiantType] || 300;
        const ceremonyMult = { 'Traditional Religious': 1, 'Non-Denominational': 1.2, 'Civil Ceremony': 0.8, 'Custom/Personalized': 1.4 };
        const rehearsal = values.includeRehearsal === 'Yes' ? 150 : 0;
        const locMult = { 'Major City': 1.3, 'Suburban': 1.0, 'Rural': 0.8, 'Destination': 1.5 };
        return Math.round(base * (ceremonyMult[values.ceremonyType] || 1) * (locMult[values.location] || 1) + rehearsal);
      },
      'wedding-transportation-cost-calculator': () => {
        const pph = this.data.transportationCosts[values.vehicleType] || 120;
        const mainVehicle = pph * (values.duration || 4);
        const shuttle = values.needShuttle?.includes('Yes') ? Math.ceil((values.guestShuttleCount || 30) / 50) * 500 : 0;
        return mainVehicle + shuttle;
      },
      'wedding-planner-cost-calculator': () => {
        const budget = values.totalBudget || 30000;
        if (values.serviceLevel === 'Full-Service Planning') return Math.round(budget * 0.12);
        if (values.serviceLevel === 'Partial Planning') return Math.round(budget * 0.06);
        return this.data.plannerCosts[values.serviceLevel] || 2000;
      },
      'wedding-tax-tip-calculator': () => {
        const subtotal = (values.cateringCost || 0) + (values.venueCost || 0) + (values.barCost || 0) + (values.otherServices || 0);
        const taxRates = { 'California': 0.0825, 'New York': 0.08, 'Texas': 0.0625, 'Florida': 0.06, 'Illinois': 0.0625, 'Other': 0.07 };
        const tax = Math.round(subtotal * (taxRates[values.state] || 0.07));
        const serviceCharge = Math.round(subtotal * 0.22);
        const tips = Math.round(subtotal * 0.15);
        const other = Math.round(subtotal * 0.03);
        return { total: tax + serviceCharge + tips + other, tax, serviceCharge, tips, other, subtotal, suggestions: this.getTaxTipSuggestions(subtotal) };
      },
      'wedding-photobooth-cost-calculator': () => {
        const base = this.data.photoBoothCost[values.boothType] || 500;
        const hours = values.duration || 4;
        const props = values.includeProps === 'Yes' ? 150 : 0;
        const album = values.includeAlbum === 'Yes' ? 200 : 0;
        return base * (hours / 3) + props + album;
      },
      'wedding-dress-budget-calculator': () => {
        const dressCost = this.data.dressCost[values.dressStyle] || 1500;
        const alterations = values.includesAlterations === 'Yes' ? (this.data.alterationsCost[values.dressStyle] || 300) : 0;
        const accessories = values.includesAccessories === 'Yes' ? (this.data.dressAccessories.veil + this.data.dressAccessories.shoes + this.data.dressAccessories.jewelry) : 0;
        const total = dressCost + alterations + accessories;
        const budgetPct = Math.round((total / (values.totalBudget || 30000)) * 100);
        const breakdown = [
          { name: 'Wedding Dress', amount: dressCost, pct: Math.round(dressCost / total * 100) },
          { name: 'Alterations', amount: alterations, pct: Math.round(alterations / total * 100) },
          { name: 'Accessories (Veil, Shoes, Jewelry)', amount: accessories, pct: Math.round(accessories / total * 100) }
        ];
        return { total, breakdown, budgetPct, suggestions: this.getDressSuggestions(values.dressStyle, budgetPct) };
      },
      'wedding-suit-cost-calculator': () => {
        const groomCost = this.data.suitCosts[values.groomOption] || 450;
        const groomsmanCostPer = values.groomsmanOption === 'Rent Tuxedo' ? 200 : values.groomsmanOption === 'Buy Suit' ? 450 : 180;
        const groomsmanCount = values.groomsmanCount || 0;
        const totalGroomsmanCost = groomsmanCostPer * groomsmanCount;
        const groomAcc = this.data.suitAccessories.shoes + this.data.suitAccessories.tie + this.data.suitAccessories.pocketSquare;
        const groomsmanAcc = (this.data.suitAccessories.tie + this.data.suitAccessories.pocketSquare + this.data.suitAccessories.cufflinks) * groomsmanCount;
        const total = groomCost + totalGroomsmanCost + groomAcc + groomsmanAcc;
        const breakdown = [
          { name: "Groom's Attire", amount: groomCost, pct: Math.round(groomCost / total * 100) },
          { name: 'Groom Accessories', amount: groomAcc, pct: Math.round(groomAcc / total * 100) },
          { name: `Groomsmen Attire (${groomsmanCount})`, amount: totalGroomsmanCost, pct: Math.round(totalGroomsmanCost / total * 100) },
          { name: 'Groomsmen Accessories', amount: groomsmanAcc, pct: Math.round(groomsmanAcc / total * 100) }
        ];
        return { total, breakdown, suggestions: this.getSuitSuggestions(values.groomOption, groomsmanCount) };
      },
      'wedding-hair-makeup-calculator': () => {
        const brideHair = this.data.hairCost[values.brideHair] || 200;
        const brideMakeup = this.data.makeupCost[values.brideMakeup] || 200;
        const bridesmaidCount = values.bridesmaidCount || 0;
        const motherCount = values.motherCount || 0;
        const bridesmaidCost = bridesmaidCount * this.data.bridesmaidHairMakeupPP;
        const motherCost = motherCount * this.data.motherHairMakeupPP;
        const trialCost = values.trialIncluded === 'Yes' ? (this.data.trialHairCost + this.data.trialMakeupCost) : 0;
        const travelFee = 0;
        const total = brideHair + brideMakeup + bridesmaidCost + motherCost + trialCost;
        const breakdown = [
          { name: "Bride's Hair", amount: brideHair, pct: Math.round(brideHair / total * 100) },
          { name: "Bride's Makeup", amount: brideMakeup, pct: Math.round(brideMakeup / total * 100) },
          { name: `Bridesmaids (${bridesmaidCount})`, amount: bridesmaidCost, pct: Math.round(bridesmaidCost / total * 100) },
          { name: `Mothers (${motherCount})`, amount: motherCost, pct: Math.round(motherCost / total * 100) },
          { name: 'Trial Sessions', amount: trialCost, pct: Math.round(trialCost / total * 100) }
        ];
        return { total, breakdown, suggestions: this.getHairMakeupSuggestions(bridesmaidCount, values.trialIncluded) };
      },
      'wedding-photography-budget-calculator': () => {
        const pkgLevel = values.packageLevel || 'Standard';
        const baseCost = this.data.photoBaseCost[pkgLevel] || 3000;
        const baseHours = this.data.photoBaseHours[pkgLevel] || 8;
        const coverageHours = parseInt(values.coverageHours) || 8;
        const extraHours = Math.max(0, coverageHours - baseHours);
        const extraCost = extraHours * (this.data.photoExtraHourPP[pkgLevel] || 300);
        const secondShooter = values.secondShooter === 'Yes' ? (this.data.secondShooterCost[pkgLevel] || 600) : 0;
        const engagement = values.engagementShoot === 'Yes' ? (this.data.engagementShootCost[pkgLevel] || 400) : 0;
        const album = values.albumIncluded === 'Yes' ? (this.data.photoAlbumCost[pkgLevel] || 800) : 0;
        const total = baseCost + extraCost + secondShooter + engagement + album;
        const breakdown = [
          { name: `Base Package (${baseHours}h)`, amount: baseCost, pct: Math.round(baseCost / total * 100) },
          { name: `Extra Coverage (${extraHours}h)`, amount: extraCost, pct: Math.round(extraCost / total * 100) },
          { name: 'Second Shooter', amount: secondShooter, pct: Math.round(secondShooter / total * 100) },
          { name: 'Engagement Shoot', amount: engagement, pct: Math.round(engagement / total * 100) },
          { name: 'Wedding Album', amount: album, pct: Math.round(album / total * 100) }
        ];
        return { total, breakdown, suggestions: this.getPhotographySuggestions(pkgLevel, coverageHours, values.secondShooter) };
      },
      'wedding-invitation-cost-calculator': () => {
        const count = values.invitationCount || 100;
        const printCost = this.data.inviteCost[values.printingMethod] || 4.5;
        const insertCost = this.data.inviteInsertCost[values.inserts] || 0.5;
        const liningCost = values.envelopeLining === 'Yes' ? this.data.envelopeLiningCost : 0;
        const assemblyCost = this.data.inviteAssemblyCost;
        const postageCost = this.data.postageCost;
        const perInvite = printCost + insertCost + liningCost + assemblyCost + postageCost;
        const total = Math.round(count * perInvite);
        const breakdown = [
          { name: 'Printing & Paper', amount: Math.round(count * printCost), pct: Math.round(count * printCost / total * 100) },
          { name: 'Inserts', amount: Math.round(count * insertCost), pct: Math.round(count * insertCost / total * 100) },
          { name: 'Envelope Lining', amount: Math.round(count * liningCost), pct: Math.round(count * liningCost / total * 100) },
          { name: 'Assembly', amount: Math.round(count * assemblyCost), pct: Math.round(count * assemblyCost / total * 100) },
          { name: 'Postage', amount: Math.round(count * postageCost), pct: Math.round(count * postageCost / total * 100) }
        ];
        return { total, breakdown, perInvite: Math.round(perInvite * 100) / 100, suggestions: this.getInvitationSuggestions(values.printingMethod, count) };
      },
      'wedding-timeline-calculator': () => {
        const ceremonyHour = parseInt(values.ceremonyTime) || 16;
        const hasFirstLook = values.hasFirstLook === 'Yes';
        const partySize = values.bridalPartySize || 8;
        const receptionHrs = values.receptionDuration || 4;
        const prepStart = ceremonyHour - (hasFirstLook ? 3 : 2.5);
        const firstLookTime = hasFirstLook ? ceremonyHour - 1.5 : null;
        const ceremonyEnd = ceremonyHour + 1;
        const cocktailEnd = ceremonyEnd + 1;
        const dinnerStart = cocktailEnd;
        const dinnerEnd = dinnerStart + 1.5;
        const dancingStart = dinnerEnd;
        const receptionEnd = ceremonyEnd + receptionHrs;
        const cakeTime = dinnerEnd + (receptionHrs > 4 ? 1 : 0.5);
        const lastDance = receptionEnd;
        const fmt = (h) => { const hr = Math.floor(h); const min = Math.round((h - hr) * 60); const ampm = hr >= 12 ? 'PM' : 'AM'; const h12 = hr > 12 ? hr - 12 : hr; return `${h12}:${min.toString().padStart(2,'0')} ${ampm}`; };
        const events = [
          { time: fmt(prepStart), name: 'Hair & Makeup / Getting Ready', duration: '2-3 hrs' },
          { time: fmt(ceremonyHour - (hasFirstLook ? 2 : 1.5)), name: 'Bridal Party Photos', duration: hasFirstLook ? '30 min' : '1 hr' }
        ];
        if (hasFirstLook) events.push({ time: fmt(firstLookTime), name: 'First Look', duration: '30 min' });
        events.push({ time: fmt(ceremonyHour), name: 'Ceremony', duration: '~1 hr' });
        events.push({ time: fmt(ceremonyEnd), name: 'Cocktail Hour', duration: '1 hr' });
        events.push({ time: fmt(dinnerStart), name: 'Grand Entrance & Dinner', duration: '1.5 hrs' });
        events.push({ time: fmt(dinnerEnd), name: 'First Dance & Toasts', duration: '30 min' });
        events.push({ time: fmt(dancingStart + 0.5), name: 'Open Dancing', duration: 'Open' });
        events.push({ time: fmt(cakeTime), name: 'Cake Cutting', duration: '15 min' });
        events.push({ time: fmt(lastDance - 0.25), name: 'Last Dance', duration: '15 min' });
        events.push({ time: fmt(lastDance), name: 'Sparkler Send-Off', duration: '~15 min' });
        return { total: Math.round((lastDance - prepStart) * 60), events, suggestions: this.getTimelineSuggestions(hasFirstLook, partySize) };
      },
      'wedding-vendor-comparison-tool': () => {
        const q1 = values.quote1 || 0;
        const q2 = values.quote2 || 0;
        const q3 = values.quote3 || 0;
        const quotes = [q1, q2, q3].filter(q => q > 0);
        const avg = quotes.length > 0 ? Math.round(quotes.reduce((a,b) => a+b, 0) / quotes.length) : 0;
        const min = quotes.length > 0 ? Math.min(...quotes) : 0;
        const max = quotes.length > 0 ? Math.max(...quotes) : 0;
        const range = max - min;
        const vendorAverages = {
          'Photographer': { low: 2000, high: 5000, typical: 3000 },
          'Caterer': { low: 3000, high: 15000, typical: 8000 },
          'Florist': { low: 800, high: 4000, typical: 2000 },
          'DJ/Band': { low: 800, high: 5000, typical: 1500 },
          'Venue': { low: 3000, high: 15000, typical: 7000 },
          'Videographer': { low: 1500, high: 5000, typical: 2500 },
          'Planner': { low: 1500, high: 8000, typical: 3000 }
        };
        const marketRef = vendorAverages[values.vendorCategory] || { low: 1000, high: 10000, typical: 3000 };
        const items = [
          { name: 'Vendor A', amount: q1 },
          { name: 'Vendor B', amount: q2 },
          { name: 'Vendor C', amount: q3 },
          { name: 'Average Quote', amount: avg },
          { name: 'Market Typical', amount: marketRef.typical }
        ];
        return { total: avg, items, low: min, high: max, range, marketRef, suggestions: this.getVendorComparisonSuggestions(values.vendorCategory, min, max, avg, marketRef) };
      },
      'wedding-checklist-calculator': () => {
        const months = values.monthsUntil || 12;
        const budget = values.budget || 30000;
        const hasPlanner = values.hasPlanner || 'No - DIY';
        const checklist = [];
        if (months >= 12) checklist.push({ phase: '12+ Months Out', tasks: ['Set budget and priorities', 'Book venue', 'Hire planner (if using one)', 'Start guest list', 'Choose wedding party', 'Research vendors'] });
        if (months >= 9) checklist.push({ phase: '9-12 Months Out', tasks: ['Book photographer & videographer', 'Book caterer', 'Choose wedding dress', 'Book entertainment (DJ/Band)', 'Register for gifts'] });
        if (months >= 6) checklist.push({ phase: '6-9 Months Out', tasks: ['Book florist', 'Order invitations', 'Plan honeymoon', 'Book transportation', 'Schedule hair & makeup trial', 'Choose cake baker'] });
        if (months >= 4) checklist.push({ phase: '4-6 Months Out', tasks: ['Send save-the-dates', 'Book officiant', 'Plan rehearsal dinner', 'Order wedding favors', 'Finalize menu', 'Book hotel room blocks'] });
        if (months >= 2) checklist.push({ phase: '2-4 Months Out', tasks: ['Send invitations', 'Finalize seating chart', 'Get marriage license', 'Schedule final dress fitting', 'Write vows', 'Confirm all vendors'] });
        checklist.push({ phase: 'Final Weeks', tasks: ['Final headcount to caterer', 'Confirm timeline with vendors', 'Rehearsal & rehearsal dinner', 'Prepare tips & payments', 'Pack for honeymoon', 'Enjoy your day!'] });
        const priorityCount = checklist.reduce((sum, phase) => sum + phase.tasks.length, 0);
        return { total: priorityCount, checklist, suggestions: this.getChecklistSuggestions(months, hasPlanner) };
      },
      'event-budget-calculator': () => {
        const eventType = values.eventType || 'Corporate Conference';
        const attendees = values.attendeeCount || 100;
        const totalBudget = values.totalBudget || 10000;
        const durationMult = this.data.eventDurationMult[values.duration] || 1;
        const baseCostPP = this.data.eventCostPP[eventType] || 100;
        const estimatedCost = attendees * baseCostPP * durationMult;
        const split = this.data.eventBudgetSplit[eventType] || this.data.eventBudgetSplit['Corporate Conference'];
        const adjustedBudget = Math.max(totalBudget, estimatedCost);
        const breakdown = split.map(s => ({ name: s.name, amount: Math.round(adjustedBudget * s.pct), pct: Math.round(s.pct * 100) }));
        return { total: Math.round(adjustedBudget), breakdown, perGuest: Math.round(adjustedBudget / attendees), estimatedCost: Math.round(estimatedCost), suggestions: this.getEventSuggestions(eventType, attendees, adjustedBudget) };
      },
      'wedding-insurance-calculator': () => {
        const budget = values.totalBudget || 30000;
        const coverageMult = { 'Liability Only': 0.005, 'Cancellation + Liability': 0.015, 'Comprehensive (Full Coverage)': 0.025 };
        let rate = coverageMult[values.coverageType] || 0.015;
        if (values.hasOutdoor === 'Yes') rate += 0.005;
        if (values.hasAlcohol === 'Yes') rate += 0.003;
        if (values.guestCount > 200) rate += 0.002;
        rate = Math.min(rate, 0.04);
        const total = Math.round(budget * rate);
        const coverageAmount = Math.round(budget * (values.coverageType === 'Liability Only' ? 1 : values.coverageType === 'Cancellation + Liability' ? 1.5 : 2));
        const endorsements = Math.round(total * 0.1);
        const admin = Math.round(total * 0.05);
        const grandTotal = total + endorsements + admin;
        const breakdown = [
          { name: 'Policy Premium', amount: total, pct: Math.round(total / grandTotal * 100) },
          { name: 'Endorsements & Riders', amount: endorsements, pct: Math.round(endorsements / grandTotal * 100) },
          { name: 'Documentation & Admin', amount: admin, pct: Math.round(admin / grandTotal * 100) }
        ];
        return { total: grandTotal, breakdown, coverageAmount, rate: Math.round(rate * 10000) / 100, suggestions: this.getInsuranceSuggestions(values.coverageType, total, values.hasOutdoor) };
      },
      'wedding-rehearsal-dinner-calculator': () => {
        const guests = values.guestCount || 40;
        const styleCost = { 'Casual Restaurant': 45, 'Family Style': 55, 'Plated Dinner': 75, 'Buffet': 50, 'Cocktail/Appetizers Only': 35 };
        const alcoholCost = { 'Full Bar': 25, 'Beer & Wine Only': 15, 'No Alcohol': 0 };
        const locationMult = { 'Restaurant Private Room': 1.0, 'Home/Backyard': 0.6, 'Hotel Banquet': 1.3, 'Other Venue': 0.9 };
        const pp = (styleCost[values.diningStyle] || 55) + (alcoholCost[values.includesAlcohol] || 0);
        const locationM = locationMult[values.location] || 1;
        const catering = Math.round(guests * pp * locationM);
        const decorations = Math.round(catering * 0.08);
        const gratuities = Math.round(catering * 0.2);
        const total = catering + decorations + gratuities;
        const breakdown = [
          { name: 'Food & Drinks', amount: catering, pct: Math.round(catering / total * 100) },
          { name: 'Decorations', amount: decorations, pct: Math.round(decorations / total * 100) },
          { name: 'Gratuities (20%)', amount: gratuities, pct: Math.round(gratuities / total * 100) }
        ];
        return { total, breakdown, perGuest: Math.round(total / guests), suggestions: this.getRehearsalDinnerSuggestions(values.diningStyle, guests) };
      },
      'bridesmaid-dress-budget-calculator': () => {
        const count = values.bridesmaidCount || 5;
        const dressCost = { 'Budget ($80-150)': 115, 'Mid-Range ($150-250)': 200, 'Premium ($250-400)': 325, 'Designer ($400+)': 500 };
        const dressPP = dressCost[values.dressStyle] || 200;
        const dressTotal = count * dressPP;
        const alterations = count * 45;
        const shoes = values.includesShoes === 'Yes' ? count * 65 : 0;
        const jewelry = values.includesJewelry === 'Yes' ? count * 40 : 0;
        const total = dressTotal + alterations + shoes + jewelry;
        const breakdown = [
          { name: `Dresses (${count})`, amount: dressTotal, pct: Math.round(dressTotal / total * 100) },
          { name: 'Alterations', amount: alterations, pct: Math.round(alterations / total * 100) },
          { name: 'Matching Shoes', amount: shoes, pct: Math.round(shoes / total * 100) },
          { name: 'Jewelry Gifts', amount: jewelry, pct: Math.round(jewelry / total * 100) }
        ];
        return { total, breakdown, perBridesmaid: Math.round(total / count), suggestions: this.getBMDressSuggestions(values.dressStyle, count) };
      },
      'wedding-morning-prep-calculator': () => {
        const partySize = values.bridalPartySize || 6;
        const breakfast = { 'Yes - Catered': partySize * 25, 'Yes - DIY/Pickup': partySize * 12, 'No': 0 }[values.includeBreakfast] || 0;
        const champagne = values.includeChampagne === 'Yes' ? partySize * 12 : 0;
        const emergencyKit = { 'Yes - Pre-Made': 45, 'Yes - DIY': 25, 'No': 0 }[values.includeEmergencyKit] || 0;
        const robes = partySize * 30;
        const gettingReadyDecor = 50;
        const total = breakfast + champagne + emergencyKit + robes + gettingReadyDecor;
        const breakdown = [
          { name: 'Breakfast/Brunch', amount: breakfast, pct: Math.round(breakfast / total * 100) },
          { name: 'Champagne/Mimosas', amount: champagne, pct: Math.round(champagne / total * 100) },
          { name: 'Emergency Kit', amount: emergencyKit, pct: Math.round(emergencyKit / total * 100) },
          { name: 'Matching Robes', amount: robes, pct: Math.round(robes / total * 100) },
          { name: 'Getting Ready Decor', amount: gettingReadyDecor, pct: Math.round(gettingReadyDecor / total * 100) }
        ];
        return { total, breakdown, suggestions: this.getMorningPrepSuggestions(partySize) };
      },
      'wedding-sendoff-calculator': () => {
        const guests = values.guestCount || 100;
        const sendoffCosts = {
          'Sparkler Exit': { pp: 2.5, supplies: 25 },
          'Flower Petal Toss': { pp: 1.2, supplies: 15 },
          'Ribbon Wands': { pp: 0.8, supplies: 10 },
          'Bubbles': { pp: 0.5, supplies: 5 },
          'Lavender Toss': { pp: 1.5, supplies: 20 },
          'Biodegradable Confetti': { pp: 0.7, supplies: 10 }
        };
        const sendoff = sendoffCosts[values.sendoffType] || sendoffCosts['Bubbles'];
        const supplies = Math.round(guests * sendoff.pp) + sendoff.supplies;
        const signage = values.includesSignage === 'Yes' ? 35 : 0;
        const cleanup = values.sendoffType === 'Sparkler Exit' ? 50 : 25;
        const total = supplies + signage + cleanup;
        const breakdown = [
          { name: `${values.sendoffType} Supplies`, amount: supplies, pct: Math.round(supplies / total * 100) },
          { name: 'Signage', amount: signage, pct: Math.round(signage / total * 100) },
          { name: 'Cleanup', amount: cleanup, pct: Math.round(cleanup / total * 100) }
        ];
        return { total, breakdown, suggestions: this.getSendoffSuggestions(values.sendoffType, guests) };
      },
      'wedding-cake-serving-calculator': () => {
        const guests = values.guestCount || 120;
        const servingMult = { 'Standard Wedding Slice (1x2)': 1, 'Dessert Portion (Larger)': 1.5, 'Tasting Portion (Mini)': 0.6 };
        const dessertMult = { 'Yes - Full Dessert Bar': 0.7, 'Yes - Small Sweet Station': 0.85, 'No - Cake Only': 1 };
        const servings = Math.ceil(guests * (servingMult[values.servingSize] || 1) * (dessertMult[values.hasDessertBar] || 1));
        const extraServings = Math.ceil(servings * 1.08);
        const items = [
          { name: 'Guest Servings', amount: servings },
          { name: 'With 8% Buffer', amount: extraServings },
          { name: 'Top Tier (Keepsake)', amount: 1 }
        ];
        const totalServings = extraServings + 1;
        return { total: totalServings, items, servings, extraServings, suggestions: this.getCakeServingSuggestions(servings, values.hasDessertBar) };
      },
      'wedding-guest-transportation-calculator': () => {
        const guests = values.outOfTownGuests || 30;
        const shuttleCost = { 'Standard Shuttle Bus (25-35 pax)': 550, 'Mini Coach (20-25 pax)': 450, 'Luxury Coach (40-50 pax)': 850, 'Vintage Trolley': 750 };
        const tripCost = shuttleCost[values.shuttleType] || 550;
        const tripCount = { '1 (Ceremony to Reception)': 1, '2 (Hotel-Ceremony + Ceremony-Reception)': 2, '3 (Full loop including return)': 3 }[values.roundTripsNeeded] || 2;
        const shuttleTotal = tripCost * tripCount;
        const valet = values.includesValet === 'Yes' ? guests * 8 : 0;
        const tips = Math.round(shuttleTotal * 0.15);
        const total = shuttleTotal + valet + tips;
        const breakdown = [
          { name: `Shuttle (${tripCount} trip${tripCount > 1 ? 's' : ''})`, amount: shuttleTotal, pct: Math.round(shuttleTotal / total * 100) },
          { name: 'Valet Parking', amount: valet, pct: Math.round(valet / total * 100) },
          { name: 'Driver Tips (15%)', amount: tips, pct: Math.round(tips / total * 100) }
        ];
        return { total, breakdown, suggestions: this.getGuestTransportSuggestions(guests, tripCount) };
      }
    };

    const calc = calculations[toolId];
    if (calc) {
      const result = calc();
      if (typeof result === 'object' && result.total !== undefined) return result;
      return { total: Math.round(result) };
    }

    // Fallback generic calculation
    let total = 0;
    Object.values(values).forEach(v => {
      const num = parseFloat(v);
      if (!isNaN(num) && num > 0) total += num;
    });
    return { total: Math.round(total * 1.15) };
  }

  // Gift Calculator
  gift(values) {
    const range = this.data.giftRanges[values.relationship] || [50, 100];
    const attendMult = { 'Yes - Local': 1, 'Yes - Destination': 0.8, 'No': 0.7 };
    const formalMult = { Casual: 0.8, 'Semi-Formal': 1, Formal: 1.2, 'Black Tie': 1.4 };
    const mult = (attendMult[values.attendance] || 1) * (formalMult[values.weddingFormality] || 1);
    return {
      low: Math.round(range[0] * mult),
      recommended: Math.round(((range[0] + range[1]) / 2) * mult),
      high: Math.round(range[1] * mult),
      suggestions: this.getGiftSuggestions(values.relationship, values.attendance)
    };
  }

  // Registry Calculator
  registry(values) {
    const items = Math.round(values.guestCount * this.data.registryItemsPerGuest);
    const priceDist = { 'Budget ($10-50)': { under50: 0.5, mid: 0.35, high: 0.1, premium: 0.05 }, 'Moderate ($25-150)': { under50: 0.3, mid: 0.4, high: 0.2, premium: 0.1 }, 'Premium ($50-300)': { under50: 0.1, mid: 0.3, high: 0.35, premium: 0.25 }, 'Mixed Range': { under50: 0.3, mid: 0.4, high: 0.2, premium: 0.1 } };
    const dist = priceDist[values.priceRange] || priceDist['Mixed Range'];
    return {
      totalItems: items,
      under50: Math.round(items * dist.under50),
      midRange: Math.round(items * dist.mid),
      highEnd: Math.round(items * dist.high),
      premium: Math.round(items * dist.premium),
      suggestions: this.getRegistrySuggestions(values.livingSituation, items)
    };
  }

  // Venue Capacity Calculator
  venueCapacity(values) {
    const { venueSqft, setupType, hasDanceFloor, hasStage } = values;
    const sqftPP = this.data.venueSqftPP[setupType] || 14;
    let usableSqft = venueSqft;
    if (hasDanceFloor === 'Yes') usableSqft -= 400;
    if (hasStage === 'Yes') usableSqft -= 200;
    const capacity = Math.floor(usableSqft / sqftPP);
    return { capacity, usableSqft, sqftPP, suggestions: this.getCapacitySuggestions(capacity, setupType) };
  }

  // Tent Size Calculator
  tentSize(values) {
    const { guestCount, setup, extras, tentType } = values;
    const sqftPP = this.data.tentSqftPerGuest[setup] || 15;
    let extraSqft = 0;
    if (extras.includes('Dance Floor')) extraSqft += 400;
    if (extras.includes('Bar')) extraSqft += 150;
    if (extras.includes('Stage')) extraSqft += 200;
    const totalSqft = guestCount * sqftPP + extraSqft;
    const cost = Math.round(totalSqft * (this.data.tentCostPerSqft[tentType] || 4));
    // Find tent dimensions
    const side = Math.ceil(Math.sqrt(totalSqft / 2) / 10) * 10;
    return { totalSqft, dimensions: `${side}x${Math.ceil(totalSqft / side / 10) * 10}`, cost, suggestions: this.getTentSuggestions(guestCount, tentType) };
  }

  // =================== AI SUGGESTIONS ===================
  getBudgetSuggestions(budget, guests, location, style) {
    const tips = [];
    if (budget < 15000) tips.push('Consider a brunch or lunch reception — they\'re 30-40% cheaper than dinner');
    if (guests > 150) tips.push('With 150+ guests, negotiate group rates with your venue and caterer');
    if (location === 'West Coast' || location === 'Northeast') tips.push('Your region is pricier — consider a Friday or Sunday wedding for 15-25% savings');
    if (style === 'Luxury' || style === 'Black Tie') tips.push('Invest in photography — you\'ll want professional documentation of this level of detail');
    if (budget > 50000) tips.push('Consider hiring a wedding planner — they often save you money through vendor relationships');
    if (guests < 80) tips.push('A smaller guest list means you can afford a higher-end venue or dining experience');
    tips.push('Always add a 5-10% contingency to your budget for unexpected expenses');
    return tips.slice(0, 4);
  }

  getCostEstimatorSuggestions(total, guests, style) {
    const tips = [];
    const pp = total / guests;
    if (pp > 250) tips.push(`At $${Math.round(pp)}/person, consider trimming the guest list — every 10 fewer guests saves ~$${Math.round(pp * 10).toLocaleString()}`);
    if (pp < 100) tips.push('Your budget is tight — prioritize food and photography, and consider DIY decor');
    tips.push('Book vendors 9-12 months ahead for the best rates and availability');
    tips.push('Saturday nights are 20-30% more expensive than other days');
    return tips;
  }

  getSavingsSuggestions(monthly, target, months) {
    const tips = [];
    if (monthly > 2000) tips.push(`Saving $${monthly.toLocaleString()}/month is ambitious — consider extending your engagement to ${Math.ceil(target / 1500)} months`);
    tips.push('Set up a separate high-yield savings account for your wedding fund');
    if (months > 12) tips.push('With over a year to save, consider investing a portion in a short-term CD for better returns');
    tips.push('Look into cash-back credit cards and put rewards toward your wedding fund');
    return tips;
  }

  getHoneymoonSuggestions(dest, style, cost) {
    const tips = [];
    if (cost < 3000) tips.push('Use credit card points and miles to offset flights — many cards offer 50,000+ point sign-up bonuses');
    tips.push('Book your honeymoon 6-8 months in advance for the best rates');
    if (style === 'Luxury') tips.push('Consider a travel agent who specializes in honeymoons — they often get upgrades and perks');
    tips.push('Create a honeymoon registry so guests can contribute experiences instead of physical gifts');
    return tips;
  }

  getEmergencyFundSuggestions(pct, outdoor) {
    const tips = [];
    if (outdoor) tips.push('With an outdoor wedding, invest in a tent backup plan — weather is your biggest risk');
    if (pct > 0.1) tips.push('Your emergency fund is above 10% — that\'s smart given your risk factors');
    tips.push('Keep your emergency fund in a separate account so you\'re not tempted to spend it');
    return tips;
  }

  getGuestListSuggestions(invited, capacity, budget) {
    const tips = [];
    if (invited > capacity) tips.push(`You're ${invited - capacity} guests over capacity — consider an A/B list system`);
    tips.push('Expect about 75-80% of invited guests to attend');
    tips.push('Use a digital RSVP system to track responses in real-time');
    return tips;
  }

  getRSVPSuggestions(attend, invited, declineRate) {
    const tips = [];
    if (declineRate > 30) tips.push('A higher decline rate is normal for destination or holiday weekend weddings');
    tips.push('Send reminders 2 weeks before the RSVP deadline');
    tips.push('Order 5-10 extra meals for unexpected last-minute guests');
    return tips;
  }

  getPlusOneSuggestions(policy, plusOnes, cost) {
    const tips = [];
    if (policy === 'All singles get plus-ones') tips.push('This is the most generous policy — make sure your venue and budget can handle it');
    if (cost > 2000) tips.push(`Plus-ones add $${cost.toLocaleString()} to your budget — consider limiting to serious relationships only`);
    tips.push('Be consistent with your plus-one policy to avoid hurt feelings');
    return tips;
  }

  getSeatingSuggestions(guests, tables) {
    const tips = [];
    tips.push('Mix family and friends at tables — it creates a more social atmosphere');
    if (tables > 15) tips.push('With many tables, use a seating chart display at the entrance');
    tips.push('Seat elderly guests near exits and restrooms');
    return tips;
  }

  getTableSizeSuggestions(guests, sqft) {
    const tips = [];
    tips.push('Round tables create a more intimate conversation experience');
    tips.push('Leave at least 5 feet between table edges for comfortable movement');
    return tips;
  }

  getCateringSuggestions(style, meal, pp) {
    const tips = [];
    if (style === 'Plated Dinner' && pp > 120) tips.push('At this price point, ensure your caterer offers a tasting before you commit');
    if (style === 'Buffet') tips.push('Buffets need 15-20% more food than plated dinners — factor that into your budget');
    tips.push('Always confirm dietary accommodation options (vegan, gluten-free, allergies)');
    tips.push('Schedule a menu tasting 2-3 months before the wedding');
    return tips;
  }

  getAlcoholSuggestions(barType, drinks, drinkers) {
    const tips = [];
    if (barType === 'Full Open Bar') tips.push('An open bar is generous but can lead to overconsumption — consider drink tickets for premium liquors');
    tips.push('Always provide non-alcoholic options: mocktails, infused water, and soda');
    tips.push('Hire a licensed bartender — it\'s required in most states and helps manage consumption');
    return tips;
  }

  getBarCostSuggestions(pkg, total, guests) {
    const tips = [];
    const pp = total / guests;
    if (pp > 60) tips.push('Consider a consumption bar instead of per-person — it\'s often 20-30% cheaper for afternoon weddings');
    tips.push('End the open bar 30-60 minutes before the reception ends to wind things down safely');
    return tips;
  }

  getCakeSuggestions(servings, complexity, cost) {
    const tips = [];
    if (cost > 800) tips.push('Consider a small display cake for cutting + sheet cakes in the kitchen — saves 40-60%');
    tips.push('Schedule your cake tasting 3-4 months before the wedding');
    if (complexity === 'Elaborate') tips.push('Elaborate designs require skilled bakers — book 6+ months ahead for top cake artists');
    return tips;
  }

  getAppetizerSuggestions(hasDinner, pp) {
    const tips = [];
    if (hasDinner === 'No (Apps Only)') tips.push('With apps-only, increase to 12-15 per person and offer more substantial options');
    tips.push('Include at least 2 vegetarian/vegan appetizer options');
    tips.push('Pass appetizers rather than station-only for better guest interaction');
    return tips;
  }

  getDinnerSuggestions(style, pp) {
    const tips = [];
    tips.push('Always do a menu tasting before signing your catering contract');
    if (style === 'Family Style') tips.push('Family style creates a communal feel but requires larger tables');
    return tips;
  }

  getDessertSuggestions(type, guests) {
    const tips = [];
    tips.push('Mini desserts are more popular than full-sized — guests love variety');
    if (type.includes('Donut')) tips.push('Donut walls are trending and typically 30-40% cheaper than traditional cake');
    return tips;
  }

  getVenueSuggestions(type, season, day) {
    const tips = [];
    if (day === 'Saturday') tips.push('Saturday is the most expensive day — Friday or Sunday can save 15-25%');
    if (season === 'Summer') tips.push('Summer is peak season — a fall wedding can save 10-20%');
    tips.push('Always ask about hidden fees: service charges, cleanup, insurance requirements');
    return tips;
  }

  getFlowerSuggestions(centerpieces, ceremony) {
    const tips = [];
    tips.push('Repurpose ceremony flowers at the reception to save 20-30%');
    tips.push('Choose in-season blooms — they\'re fresher and 30-50% cheaper');
    if (centerpieces === 'Tall & Dramatic') tips.push('Tall centerpieces can block conversation — mix tall and low arrangements');
    return tips;
  }

  getGiftSuggestions(relationship, attendance) {
    const tips = [];
    tips.push('Cash or gift cards are the most appreciated gifts — 80% of couples prefer them');
    if (attendance === 'Yes - Destination') tips.push('For destination weddings, your travel costs are a gift in themselves');
    return tips;
  }

  getRegistrySuggestions(situation, items) {
    const tips = [];
    tips.push('Register for more items than you think you need — it gives guests options at all price points');
    if (situation === 'Starting Fresh') tips.push('Focus on kitchen essentials, bedding, and basics — you\'ll use these daily');
    tips.push('Include a mix of price points: 30% under $50, 40% $50-$150, 20% $150-$300, 10% $300+');
    return tips;
  }

  getCapacitySuggestions(capacity, setup) {
    const tips = [];
    tips.push('Never exceed the venue\'s stated capacity — it\'s a fire code issue');
    if (setup === 'Standing/Cocktail') tips.push('Standing events can fit more people but limit the duration to 2-3 hours');
    return tips;
  }

  getTentSuggestions(guests, type) {
    const tips = [];
    tips.push('Always get a tent 1-2 sizes larger than the minimum — extra space is never wasted');
    tips.push('Add sidewalls for weather protection, but budget an extra $500-$1,500');
    if (type === 'Sailcloth') tips.push('Sailcloth tents create a beautiful glow but cost 30-50% more than frame tents');
    return tips;
  }

  getTaxTipSuggestions(subtotal) {
    const tips = [];
    tips.push('A service charge (typically 20-25%) is NOT a tip — it goes to the venue, not the staff');
    tips.push('Budget for vendor tips separately: 15-20% for catering, $50-100 for delivery, 15-20% for hair/makeup');
    return tips;
  }

  getDressSuggestions(style, budgetPct) {
    const tips = [];
    if (budgetPct > 10) tips.push('Your dress budget exceeds 10% of total — consider allocating more to venue and catering');
    if (style === 'Designer/Luxury') tips.push('Designer gowns often have 6-8 month lead times — start shopping early');
    tips.push('Always budget for alterations — they typically cost $200-$600 and are rarely included');
    tips.push('Sample sales can save 40-70% on designer gowns if you wear a standard size');
    return tips;
  }

  getSuitSuggestions(option, count) {
    const tips = [];
    if (option === 'Buy Tuxedo') tips.push('A purchased tuxedo pays for itself after 3-4 events — great if you attend galas regularly');
    if (count > 6) tips.push('With a large wedding party, negotiate group rental discounts (typically 10-15% off)');
    tips.push('Schedule fittings 4-6 weeks before the wedding, with a final fitting 1-2 weeks out');
    return tips;
  }

  getHairMakeupSuggestions(count, trial) {
    const tips = [];
    if (count > 6) tips.push('For large bridal parties, book a second stylist to avoid a 5am start time');
    if (trial !== 'Yes') tips.push('We strongly recommend a trial run — it eliminates day-of surprises and saves time');
    tips.push('Book your beauty team 6-9 months in advance for peak season weddings');
    return tips;
  }

  getPhotographySuggestions(level, hours, secondShooter) {
    const tips = [];
    if (hours < 8) tips.push('Less than 8 hours of coverage means you may miss getting-ready or send-off moments');
    if (secondShooter !== 'Yes') tips.push('A second shooter captures angles your main photographer can\'t — highly recommended for 100+ guests');
    if (level === 'Premium') tips.push('Premium photographers often include engagement sessions — confirm what\'s in your package');
    tips.push('Create a shot list 2-3 weeks before the wedding so nothing is missed');
    return tips;
  }

  getInvitationSuggestions(method, count) {
    const tips = [];
    if (method === 'Engraving') tips.push('Engraving is the most formal and expensive option — consider letterpress for a similar look at 40% less');
    if (method === 'Digital Print') tips.push('Digital printing has improved dramatically — modern options can look nearly identical to thermography');
    tips.push('Order 10-15% extra invitations for last-minute guest additions and keepsakes');
    tips.push('Send invitations 6-8 weeks before the wedding (8-12 weeks for destination)');
    return tips;
  }

  getTimelineSuggestions(hasFirstLook, partySize) {
    const tips = [];
    if (!hasFirstLook) tips.push('Without a first look, schedule 60-90 minutes for post-ceremony photos — your guests will wait during cocktail hour');
    if (partySize > 12) tips.push('Large bridal parties need extra time for photos — add 15-20 minutes per 4 additional people');
    tips.push('Build in 15-30 minutes of buffer time between major transitions');
    tips.push('Share your timeline with all vendors 2 weeks before the wedding');
    return tips;
  }

  getVendorComparisonSuggestions(category, min, max, avg, marketRef) {
    const tips = [];
    if (max - min > marketRef.typical * 0.5) tips.push('Your quotes vary widely — ask each vendor for a detailed breakdown to compare apples to apples');
    if (avg < marketRef.low) tips.push('Quotes below market rate may indicate inexperience or limited services — verify portfolios and reviews');
    if (avg > marketRef.high) tips.push('Quotes above market rate should include premium services — confirm exactly what\'s included');
    tips.push('Always sign a detailed contract that specifies deliverables, timelines, and cancellation terms');
    return tips;
  }

  getChecklistSuggestions(months, hasPlanner) {
    const tips = [];
    if (months < 6) tips.push('With less than 6 months, prioritize venue, caterer, and photographer — they book up fastest');
    if (hasPlanner === 'No - DIY') tips.push('Without a planner, add 5-10 hours per week for wedding tasks in the final 3 months');
    if (hasPlanner.includes('Month-Of')) tips.push('Hand off your vendor contacts to your month-of coordinator 4-6 weeks before the wedding');
    tips.push('Set up a dedicated wedding email address to keep all vendor communication in one place');
    return tips;
  }

  getEventSuggestions(type, attendees, budget) {
    const tips = [];
    const pp = budget / attendees;
    if (type === 'Corporate Conference' && pp < 100) tips.push('Corporate events under $100/person may struggle with AV and catering quality — consider a hybrid format');
    if (type === 'Gala/Fundraiser') tips.push('Galas should aim for at least 3x ticket price in revenue — budget accordingly for a memorable experience');
    if (attendees > 200) tips.push('For large events, hire a dedicated event coordinator — logistics scale exponentially past 200 guests');
    tips.push('Always negotiate venue costs — ask about non-profit discounts, off-peak rates, and package deals');
    return tips;
  }

  getInsuranceSuggestions(coverage, cost, outdoor) {
    const tips = [];
    if (coverage === 'Liability Only') tips.push('Liability-only coverage does not protect your deposits — consider adding cancellation coverage');
    if (outdoor === 'Yes') tips.push('Outdoor weddings have higher weather risk — cancellation coverage is especially important');
    tips.push('Purchase insurance as soon as you start signing vendor contracts — most policies cover vendor bankruptcy');
    if (cost > 500) tips.push('For policies over $500, compare quotes from WedSafe, Protect My Wedding, and EventHelper');
    return tips;
  }

  getRehearsalDinnerSuggestions(style, guests) {
    const tips = [];
    if (guests > 50) tips.push('For larger rehearsal dinners, a buffet or family-style service is more cost-effective and social');
    if (style === 'Home/Backyard') tips.push('Home-hosted dinners save 30-50% but require more planning — hire a caterer to handle food and cleanup');
    tips.push('The rehearsal dinner sets the tone for the weekend — keep it relaxed and fun, not a mini-wedding');
    return tips;
  }

  getBMDressSuggestions(style, count) {
    const tips = [];
    if (count > 6) tips.push('With a large bridal party, choose mix-and-match dresses so each bridesmaid finds a flattering fit');
    tips.push('Order all dresses from the same retailer at the same time to ensure dye-lot consistency');
    if (style.includes('Designer')) tips.push('Designer bridesmaid dresses often go on sale — check Azazie, BHLDN, and Lulus for similar looks at lower prices');
    return tips;
  }

  getAccessoriesSuggestions(total) {
    const tips = [];
    if (total > 600) tips.push('With a high accessories budget, consider what will be visible in photos — invest in veil and jewelry, save on shoes');
    tips.push('Bring your dress photo when shopping for accessories — the neckline and style determine what works best');
    tips.push('Consider renting a veil or headpiece from sites like Rent the Runway to save 50-70%');
    return tips;
  }

  getMorningPrepSuggestions(partySize) {
    const tips = [];
    if (partySize > 8) tips.push('For large bridal parties, book hair and makeup stylists early — you may need a team of 2-3 stylists');
    tips.push('Set up a "getting ready" playlist and keep the room clutter-free for better photos');
    tips.push('Pack a separate "ceremony emergency" bag with mints, deodorant, and stain remover');
    return tips;
  }

  getSendoffSuggestions(type, guests) {
    const tips = [];
    if (type === 'Sparkler Exit') tips.push('Use 36-inch sparklers (not 20-inch) for a longer, more photogenic exit — they burn for 2-3 minutes');
    if (type === 'Bubbles') tips.push('Bubbles are venue-friendly and photo-friendly, but use premium bubble solution for longer-lasting bubbles');
    tips.push('Check with your venue before planning a send-off — some restrict sparklers, confetti, or petals');
    return tips;
  }

  getCakeServingSuggestions(servings, hasDessert) {
    const tips = [];
    if (servings > 150) tips.push('For 150+ servings, consider a smaller display cake plus kitchen sheet cakes — saves 30-50%');
    if (hasDessert.includes('Full')) tips.push('With a full dessert bar, most guests will take smaller cake portions — you can order 20-30% fewer servings');
    tips.push('Save the top tier for your first anniversary — wrap it well in plastic and foil, then freeze');
    return tips;
  }

  getGuestTransportSuggestions(guests, trips) {
    const tips = [];
    if (trips >= 2) tips.push('Multi-trip shuttles are more expensive but ensure no guest is left waiting — stagger departure times');
    if (guests > 50) tips.push('For 50+ out-of-town guests, negotiate a group rate with a shuttle company — typically 10-15% off');
    tips.push('Create a simple transport schedule card and include it in welcome bags for out-of-town guests');
    return tips;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CalculatorEngine, US_WEDDING_DATA };
}
