/* ═══════════════════════════════════════════════════════════════════════════════
   DiagnosticsScanner - Simulates skin lesion & diabetic foot ulcer AI checkups
   ═══════════════════════════════════════════════════════════════════════════════ */

export class DiagnosticsScanner {
  constructor() {
    this.btnDerm = document.getElementById('btn-scan-derm');
    this.btnDfu = document.getElementById('btn-scan-dfu');
    this.scanLine = document.getElementById('scanner-line');
    
    // Viewport images
    this.imgPlaceholder = document.getElementById('scan-image-placeholder');
    this.imgDerm = document.getElementById('scan-image-derm');
    this.imgDfu = document.getElementById('scan-image-dfu');
    
    // Results
    this.statusEmpty = document.getElementById('result-status');
    this.resultContainer = document.getElementById('result-data');
    this.resModel = document.getElementById('res-model');
    this.resClass = document.getElementById('res-class');
    this.resConfBar = document.getElementById('res-conf-bar');
    this.resConfText = document.getElementById('res-conf-text');
    this.resTriage = document.getElementById('res-triage');
    this.resRec = document.getElementById('res-rec');
    
    this.isScanning = false;
    this.init();
  }

  init() {
    if (this.btnDerm) {
      this.btnDerm.addEventListener('click', () => this.runScan('derm'));
    }
    if (this.btnDfu) {
      this.btnDfu.addEventListener('click', () => this.runScan('dfu'));
    }
  }

  runScan(type) {
    if (this.isScanning) return;
    this.isScanning = true;
    
    this.btnDerm.disabled = true;
    this.btnDfu.disabled = true;
    
    // Reset view
    this.statusEmpty.innerText = 'Uploading clinical image to secure model...';
    this.statusEmpty.classList.remove('hidden');
    this.resultContainer.classList.add('hidden');
    
    this.imgPlaceholder.classList.add('hidden');
    this.imgDerm.classList.add('hidden');
    this.imgDfu.classList.add('hidden');
    
    // Show corresponding image
    if (type === 'derm') {
      this.imgDerm.classList.remove('hidden');
    } else {
      this.imgDfu.classList.remove('hidden');
    }
    
    // Activate scanline
    this.scanLine.classList.remove('hidden');
    
    setTimeout(() => {
      this.statusEmpty.innerText = 'Executing model forward pass (Inference)...';
      
      setTimeout(() => {
        // Stop scanning
        this.scanLine.classList.add('hidden');
        this.statusEmpty.classList.add('hidden');
        this.resultContainer.classList.remove('hidden');
        
        // Load mock result data
        this.displayResult(type);
        
        this.btnDerm.disabled = false;
        this.btnDfu.disabled = false;
        this.isScanning = false;
        
      }, 1500);
      
    }, 1500);
  }

  displayResult(type) {
    if (type === 'derm') {
      this.resModel.innerText = 'DermNet Lesion Classifier v2.1 (Deep)';
      this.resClass.innerText = 'Melanocytic Nevi (Common Mole)';
      
      const conf = 92;
      this.resConfBar.style.width = `${conf}%`;
      this.resConfText.innerText = `${conf}%`;
      
      this.resTriage.innerText = 'Low Priority';
      this.resTriage.className = 'badge badge-blue';
      
      this.resRec.innerText = 'Lesion classified as benign mole. Regular follow-up recommended in 6 months during scheduled nurse visits. Monitor for boundary asymmetry.';
    } else {
      this.resModel.innerText = 'DFUNet Foot Ulcer Classifier v1.4';
      this.resClass.innerText = 'Grade 2 Diabetic Foot Ulceration';
      
      const conf = 87;
      this.resConfBar.style.width = `${conf}%`;
      this.resConfText.innerText = `${conf}%`;
      
      this.resTriage.innerText = 'High Priority';
      this.resTriage.className = 'badge badge-green'; // styled green for clinic focus in our specs
      
      this.resRec.innerText = 'Model flags open wound lesion requiring dressing. Alerting matching service to schedule a Wound Care Nurse appointment within 24 hours.';
    }
  }
}
