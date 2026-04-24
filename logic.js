// =======================================================================
// 1. INITIAL CHART CONFIGURATION (Base State)
// =======================================================================

const ctxFunnel = document.getElementById('funnelChart').getContext('2d');
window.funnelChart = new Chart(ctxFunnel, {
    type: 'bar',
    data: {
        labels: ['Home', 'Product List', 'Product Detail', 'Cart', 'Checkout', 'Purchase Completed'],
        datasets: [{
            label: 'Active Users',
            data: [15000, 11200, 8500, 4200, 1100, 850],
            backgroundColor: '#2563eb',
            borderRadius: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    afterLabel: function(context) {
                        if (context.dataIndex === 0) return '';
                        const prevValue = context.dataset.data[context.dataIndex - 1];
                        const currentValue = context.raw;
                        const drop = ((prevValue - currentValue) / prevValue * 100).toFixed(1);
                        return `Drop: -${drop}%`;
                    }
                }
            }
        }
    }
});

const ctxTime = document.getElementById('timeChart').getContext('2d');
window.timeChart = new Chart(ctxTime, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'User Sessions',
            data: [
                {x: 45, y: 1}, {x: 120, y: 3}, {x: 180, y: 5}, {x: 30, y: 0},
                {x: 210, y: 6}, {x: 55, y: 1}, {x: 300, y: 8}, {x: 90, y: 2}
            ],
            backgroundColor: '#ef4444'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: 'Time on page (seconds)' } },
            y: { title: { display: true, text: 'Form errors' } }
        }
    }
});

const ctxRage = document.getElementById('rageClickChart').getContext('2d');
window.rageChart = new Chart(ctxRage, {
    type: 'polarArea',
    data: {
        labels: ['Apply Coupon Button', 'Size Selector', 'Terms Checkbox', 'Image Carousel'],
        datasets: [{
            data: [450, 120, 890, 50],
            backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(239, 68, 68, 0.7)',
                'rgba(245, 158, 11, 0.7)'
            ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

// =======================================================================
// 2. DATA PROCESSING LOGIC (Core Engine)
// =======================================================================
const fileInput = document.getElementById('csvFileInput');

fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (!file) return;

    console.log("File detected, starting data extraction...");

    Papa.parse(file, {
        header: true, 
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            const rawData = results.data;
            
            console.log(`Data processed! Total valid rows: ${rawData.length}`);
            
            let funnelCounters = {
                'Home': 0, 'Product List': 0, 'Product Detail': 0,
                'Cart': 0, 'Checkout': 0, 'Purchase Completed': 0
            };

            let rageCounters = {
                'Apply Coupon Button': 0, 'Size Selector': 0,
                'Terms Checkbox': 0, 'Image Carousel': 0
            };

            rawData.forEach(row => {
                if (row && row.last_step) {
                    const step = row.last_step.trim(); 
                    if (funnelCounters[step] !== undefined) funnelCounters[step]++;
                    
                    if (row.frustration_element) {
                        const element = row.frustration_element.trim();
                        if (rageCounters[element] !== undefined) rageCounters[element]++;
                    }
                }
            });

            // Cumulative Logic
            const totalPurchase = funnelCounters['Purchase Completed'];
            const totalCheckout = totalPurchase + funnelCounters['Checkout'];
            const totalCart = totalCheckout + funnelCounters['Cart'];
            const totalDetail = totalCart + funnelCounters['Product Detail'];
            const totalList = totalDetail + funnelCounters['Product List'];
            const totalHome = totalList + funnelCounters['Home'];

            window.funnelChart.data.datasets[0].data = [totalHome, totalList, totalDetail, totalCart, totalCheckout, totalPurchase];
            window.funnelChart.update();

            const newRageData = [
                rageCounters['Apply Coupon Button'],
                rageCounters['Size Selector'],
                rageCounters['Terms Checkbox'],
                rageCounters['Image Carousel']
            ];
            window.rageChart.data.datasets[0].data = newRageData;
            window.rageChart.update();
            
            console.log("Dashboard and Rage Clicks updated successfully.");
        },
        error: function(error) {
            console.error("Technical error parsing CSV:", error);
        }
    });
});