/* ═══════════════════════════════════════════════════════════════════════════════
   Matchmaker Component - Simulates real-time clinician dispatching & EGP pricing
   ═══════════════════════════════════════════════════════════════════════════════ */

export class Matchmaker {
  constructor() {
    // DOM Elements
    this.btnStart = document.getElementById('btn-start-match');
    this.btnReset = document.getElementById('btn-reset-match');
    this.selectService = document.getElementById('select-service');
    this.selectGender = document.getElementById('select-gender');
    this.logOutput = document.getElementById('matching-log-output');
    
    this.radarPanel = document.getElementById('radar-panel');
    this.offersBoard = document.getElementById('offers-board');
    this.offersList = document.getElementById('offers-list');
    this.successScreen = document.getElementById('booking-success');
    
    this.nurseNodes = document.querySelectorAll('.nurse-node');
    this.timerDisplay = document.getElementById('countdown-num');
    this.pinDisplay = document.getElementById('visit-pin-display');
    
    // Mock Provider Data
    this.nurses = [
      {
        id: 1,
        name: 'Sarah Ahmed',
        rating: 4.8,
        reviews: 64,
        experience: 6,
        completionRate: 98,
        avgResponse: 45, // seconds
        gender: 'female',
        distance: 3.2, // km
        specialties: ['wound_care', 'iv_therapy']
      },
      {
        id: 2,
        name: 'Mohamed Shawky',
        rating: 4.6,
        reviews: 42,
        experience: 8,
        completionRate: 95,
        avgResponse: 90,
        gender: 'male',
        distance: 5.8,
        specialties: ['wound_care', 'vital_check']
      },
      {
        id: 3,
        name: 'Annmarie Boutros',
        rating: 4.9,
        reviews: 78,
        experience: 5,
        completionRate: 99,
        avgResponse: 30,
        gender: 'female',
        distance: 2.1,
        specialties: ['wound_care', 'nebulizer', 'vital_check', 'iv_therapy']
      }
    ];

    this.timerInterval = null;
    this.countdown = 60;
    
    this.init();
  }

  init() {
    if (this.btnStart) {
      this.btnStart.addEventListener('click', () => this.startMatchingFlow());
    }
    if (this.btnReset) {
      this.btnReset.addEventListener('click', () => this.resetConsole());
    }
    
    // Clicking nodes on radar highlights them and prints details
    this.nurseNodes.forEach(node => {
      node.addEventListener('click', () => {
        const id = parseInt(node.getAttribute('data-id'));
        this.highlightNurseNode(id);
      });
    });
  }

  addLogEntry(text, type = 'system') {
    if (!this.logOutput) return;
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerText = `> ${text}`;
    this.logOutput.appendChild(entry);
    this.logOutput.scrollTop = this.logOutput.scrollHeight;
  }

  startMatchingFlow() {
    this.btnStart.disabled = true;
    this.selectService.disabled = true;
    this.selectGender.disabled = true;
    
    // Clear logs
    this.logOutput.innerHTML = '';
    this.addLogEntry('Client dispatched search request...', 'info');
    
    // Radar Scanning Animation
    this.radarPanel.classList.add('scanning');
    const instruction = this.radarPanel.querySelector('.radar-instruction p');
    if (instruction) instruction.innerText = 'Phase 1: Geospatial Filtering...';
    
    // Phase 1 - 1.5s
    setTimeout(() => {
      this.addLogEntry('Phase 1: Scanning radius 15km for online clinicians...', 'system');
      this.addLogEntry('Database returned 3 verified providers in Cairo.', 'success');
      
      // Filter based on gender & skills
      const genderPref = this.selectGender.value;
      const selectedOption = this.selectService.options[this.selectService.selectedIndex];
      const serviceCat = this.selectService.value;
      
      const filtered = this.nurses.filter(nurse => {
        const matchesGender = genderPref === 'any' || nurse.gender === genderPref;
        const matchesSkill = nurse.specialties.includes(serviceCat);
        return matchesGender && matchesSkill;
      });

      // Show nodes on radar
      this.nurseNodes.forEach(node => {
        const id = parseInt(node.getAttribute('data-id'));
        const isCandidate = filtered.some(n => n.id === id);
        if (isCandidate) {
          node.classList.add('visible');
        }
      });
      
      // Phase 2 - 3s
      setTimeout(() => {
        if (instruction) instruction.innerText = 'Phase 2: Weighted Multi-Factor Scoring...';
        this.addLogEntry('Phase 2: Calculating composite scores (Distance, Rating, Exp)...', 'system');
        
        filtered.forEach(nurse => {
          const score = this.calculateMatchScore(nurse);
          nurse.score = score;
          this.addLogEntry(`Scored ${nurse.name}: Match Index ${(score * 100).toFixed(1)}%`, 'info');
          const node = document.querySelector(`.nurse-node[data-id="${nurse.id}"]`);
          if (node) node.classList.add('highlighted');
        });
        
        // Phase 3 - 4.5s
        setTimeout(() => {
          if (instruction) instruction.innerText = 'Phase 3: Dispatching Offers (Socket.io)...';
          this.addLogEntry('Phase 3: Directing real-time offers to top candidate queues...', 'success');
          
          // Phase 4 - 6s (Transition to Offer Board)
          setTimeout(() => {
            this.showOffersBoard(filtered);
          }, 1500);
          
        }, 1500);

      }, 1500);

    }, 1500);
  }

  calculateMatchScore(nurse) {
    // 35% Distance, 25% Rating, 15% Experience, 15% Completion Rate, 10% Response Time
    const maxRadius = 15;
    const distanceW = (1 - (nurse.distance / maxRadius)) * 0.35;
    const ratingW = (nurse.rating / 5) * 0.25;
    const experienceW = Math.min(nurse.experience / 10, 1) * 0.15;
    const completionW = (nurse.completionRate / 100) * 0.15;
    const responseW = (1 - Math.min(nurse.avgResponse / 600, 1)) * 0.10;
    
    return distanceW + ratingW + experienceW + completionW + responseW;
  }

  highlightNurseNode(id) {
    const nurse = this.nurses.find(n => n.id === id);
    if (!nurse) return;
    this.addLogEntry(`Clinician Info: ${nurse.name} | Rating: ${nurse.rating}★ | Dist: ${nurse.distance}km`, 'info');
  }

  showOffersBoard(filteredList) {
    // Hide radar, show board
    this.radarPanel.classList.add('hidden');
    this.radarPanel.classList.remove('active');
    this.offersBoard.classList.remove('hidden');
    
    // Sort descending by score
    filteredList.sort((a, b) => b.score - a.score);
    
    // Render list
    this.offersList.innerHTML = '';
    const selectedOption = this.selectService.options[this.selectService.selectedIndex];
    const servicePrice = parseInt(selectedOption.getAttribute('data-price'));
    const serviceName = selectedOption.getAttribute('data-name');
    
    if (filteredList.length === 0) {
      this.offersList.innerHTML = '<div class="log-entry warn text-center py-4">> No nurse matched your gender preference for this specialty in Cairo. Try changing constraints.</div>';
    } else {
      filteredList.forEach(nurse => {
        // Haversine Egypt pricing model formula: destinationFee = clamp(distanceKm * 3.5, min=15, max=200)
        const destFee = Math.max(15, Math.min(200, Math.round(nurse.distance * 3.5)));
        const total = servicePrice + destFee;
        
        const card = document.createElement('div');
        card.className = 'offer-card glass';
        card.innerHTML = `
          <div class="offer-avatar-wrapper">
            <div class="offer-img-placeholder">
              <i data-lucide="user"></i>
            </div>
            <span class="offer-badge-score">${Math.round(nurse.score * 100)}%</span>
          </div>
          <div class="offer-info">
            <div class="offer-name-row">
              <span class="offer-name">${nurse.name}</span>
              <span class="offer-rating-tag"><i data-lucide="star"></i>${nurse.rating}</span>
            </div>
            <div class="offer-meta">
              <span>${nurse.experience} yrs exp</span>
              <span>${nurse.distance} km away</span>
              <span>ETA: ${Math.max(5, Math.round(nurse.distance / 25 * 60))} mins</span>
            </div>
          </div>
          <div class="offer-pricing-col">
            <span class="offer-price">${total} EGP</span>
            <span class="offer-dist-breakdown">${servicePrice} base + ${destFee} travel</span>
            <button class="offer-btn-accept" data-nurse-id="${nurse.id}">Accept Offer</button>
          </div>
        `;
        
        // Add click listener to accept button
        const acceptBtn = card.querySelector('.offer-btn-accept');
        acceptBtn.addEventListener('click', () => this.confirmBooking(nurse));
        
        this.offersList.appendChild(card);
      });
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
    
    // Start countdown
    this.countdown = 60;
    this.timerDisplay.innerText = this.countdown;
    this.timerInterval = setInterval(() => {
      this.countdown--;
      this.timerDisplay.innerText = this.countdown;
      if (this.countdown <= 0) {
        clearInterval(this.timerInterval);
        this.addLogEntry('Matching offers expired. Booking request timed out.', 'warn');
        this.resetConsole();
      }
    }, 1000);
  }

  confirmBooking(nurse) {
    clearInterval(this.timerInterval);
    this.offersBoard.classList.add('hidden');
    this.successScreen.classList.remove('hidden');
    
    // Generate random 4-digit PIN code
    const pin = Math.floor(1000 + Math.random() * 9000);
    this.pinDisplay.innerText = pin;
    
    this.addLogEntry(`Booking confirmed with ${nurse.name}! Dispatching location navigation...`, 'success');
    this.addLogEntry(`Secret Visit PIN code generated: ${pin}`, 'info');
  }

  resetConsole() {
    clearInterval(this.timerInterval);
    this.countdown = 60;
    
    // Hide screens, show radar
    this.successScreen.classList.add('hidden');
    this.offersBoard.classList.add('hidden');
    this.radarPanel.classList.remove('hidden');
    this.radarPanel.classList.add('active');
    this.radarPanel.classList.remove('scanning');
    
    const instruction = this.radarPanel.querySelector('.radar-instruction p');
    if (instruction) instruction.innerText = 'Awaiting Dispatch Trigger';
    
    // Reset nodes
    this.nurseNodes.forEach(node => {
      node.className = 'nurse-node node-' + node.getAttribute('data-id');
    });
    
    // Re-enable controls
    this.btnStart.disabled = false;
    this.selectService.disabled = false;
    this.selectGender.disabled = false;
    
    this.logOutput.innerHTML = '';
    this.addLogEntry('System reset. Awaiting new dispatch parameters.', 'system');
  }
}
