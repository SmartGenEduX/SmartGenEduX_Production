<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invigilation Duty Configuration & Management</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
        }
        .container {
            max-width: 900px;
            margin-top: 30px;
        }
        .card-header {
            background-color: #007bff;
            color: white;
            font-weight: bold;
        }
        .section-card {
            margin-bottom: 25px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .alert-fixed {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1050;
            min-width: 300px;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1 class="text-center mb-4 text-primary">🏫 Invigilation Management Dashboard</h1>

        <div id="notification-area" class="alert-fixed" style="display: none;"></div>
        
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="config-tab" data-bs-toggle="tab" data-bs-target="#config" type="button" role="tab">⚙️ Configuration</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="allocation-tab" data-bs-toggle="tab" data-bs-target="#allocation" type="button" role="tab">🔄 Auto Allocation</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="workflow-tab" data-bs-toggle="tab" data-bs-target="#workflow" type="button" role="tab">✅ Workflow & Export</button>
            </li>
        </ul>

        <div class="tab-content pt-3" id="myTabContent">

            <div class="tab-pane fade show active" id="config" role="tabpanel">
                <div class="card section-card">
                    <div class="card-header">System Configuration</div>
                    <div class="card-body">
                        <form id="config-form">
                            <div class="mb-3">
                                <label for="maxDuties" class="form-label">Maximum Duties Per Cycle</label>
                                <input type="number" class="form-control" id="maxDuties" name="maxDuties" required min="1" max="50">
                                <div class="form-text">Sets the soft limit for workload balancing (Total Duties Assigned - TDA).</div>
                            </div>

                            <div class="mb-3">
                                <label for="compensationRate" class="form-label">Compensation Rate (Per Duty)</label>
                                <div class="input-group">
                                    <span class="input-group-text">₹</span>
                                    <input type="number" class="form-control" id="compensationRate" name="compensationRate" required min="0" step="10">
                                </div>
                                <div class="form-text">Financial compensation/honorarium for each invigilation duty.</div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="exemptionPolicy" class="form-label">Exemption Policy</label>
                                <select class="form-select" id="exemptionPolicy" name="exemptionPolicy">
                                    <option value="none">No Exemptions</option>
                                    <option value="subject_match_once">Exempt Subject Teacher (e.g., Maths during Maths exam)</option>
                                    <option value="permanent">Permanent Exemption List</option>
                                </select>
                                <div class="form-text">Defines rules for teachers who cannot be assigned specific duties.</div>
                            </div>

                            <div class="form-check form-switch mb-4">
                                <input class="form-check-input" type="checkbox" role="switch" id="autoAllocation" name="autoAllocation">
                                <label class="form-check-label" for="autoAllocation">Enable Automatic Duty Allocation</label>
                            </div>

                            <button type="submit" class="btn btn-primary" id="saveConfigBtn">Save Configuration</button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div class="tab-pane fade" id="allocation" role="tabpanel">
                <div class="card section-card">
                    <div class="card-header">Duty Auto Allocation</div>
                    <div class="card-body">
                        <p class="alert alert-info">This process runs the core algorithm to generate a new invigilation chart based on current workload (TDA) and configurations.</p>
                        
                        <form id="auto-allocate-form">
                            <div class="mb-3">
                                <label for="examDate" class="form-label">Exam Date</label>
                                <input type="date" class="form-control" id="examDate" name="examDate" required>
                                <div class="form-text">The date for which duties need to be assigned.</div>
                            </div>

                            <div class="mb-3">
                                <label for="roomList" class="form-label">Rooms Requiring Invigilators (Comma Separated)</label>
                                <textarea class="form-control" id="roomList" name="roomList" rows="3" placeholder="e.g., Room 101, Room 102, Auditorium, Lab 3" required></textarea>
                                <div class="form-text">List of rooms that need an invigilator for the specified date.</div>
                            </div>

                            <button type="submit" class="btn btn-success" id="runAllocationBtn">Run Auto Allocation</button>
                        </form>

                        <h5 class="mt-4">Allocation Results</h5>
                        <div id="allocation-results" class="mt-2">
                            </div>
                    </div>
                </div>
            </div>

            <div class="tab-pane fade" id="workflow" role="tabpanel">
                <div class="card section-card">
                    <div class="card-header">Approval Workflow & Export</div>
                    <div class="card-body">
                        
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5>Current Chart Status: <span id="current-status" class="badge bg-secondary">Loading...</span></h5>
                        </div>

                        <div class="mb-4 d-grid gap-2 d-md-block">
                            <button type="button" class="btn btn-warning me-2" id="submitApprovalBtn">1. Submit to Principal (Admin Action)</button>
                            <button type="button" class="btn btn-success me-2" id="approveChartBtn">2. Approve Chart (Principal Action)</button>
                            <button type="button" class="btn btn-info" id="exportChartBtn" disabled>3. Export Printable Chart</button>
                        </div>
                        
                        <hr>

                        <h5>Printable Chart Data Preview</h5>
                        <div id="duty-chart-preview" class="table-responsive mt-3">
                            <p class="text-muted">Export data will appear here upon successful retrieval.</p>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        const API_BASE = ''; // Base path for the API, leave empty if running on same host/port

        /**
         * Helper function to show a temporary notification.
         */
        function showNotification(message, type = 'success') {
            const area = document.getElementById('notification-area');
            area.innerHTML = `
                <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            area.style.display = 'block';
            setTimeout(() => {
                area.style.display = 'none';
            }, 5000);
        }

        // --- Configuration Logic ---
        async function fetchConfig() {
            try {
                const response = await fetch(`${API_BASE}/config`);
                const data = await response.json();

                if (data.success) {
                    const settings = data.settings;
                    document.getElementById('maxDuties').value = settings.maxDutiesPerWeek || 8;
                    document.getElementById('compensationRate').value = settings.compensationRate || 200;
                    document.getElementById('exemptionPolicy').value = settings.exemptionPolicy || 'subject_match_once';
                    document.getElementById('autoAllocation').checked = settings.autoAllocation !== false;
                    
                    // Also check and update the workflow status
                    document.getElementById('current-status').textContent = settings.approval_status || 'Draft';
                    updateWorkflowButtons(settings.approval_status || 'Draft');

                } else {
                    showNotification(data.error || 'Failed to fetch configuration.', 'danger');
                }
            } catch (error) {
                console.error('Fetch Config Error:', error);
                // On real error, use the fallback values as a UI default
            }
        }

        document.getElementById('config-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                autoAllocation: document.getElementById('autoAllocation').checked,
                maxDuties: parseInt(document.getElementById('maxDuties').value, 10),
                exemptionPolicy: document.getElementById('exemptionPolicy').value,
                compensationRate: parseInt(document.getElementById('compensationRate').value, 10),
            };

            document.getElementById('saveConfigBtn').disabled = true;

            try {
                const response = await fetch(`${API_BASE}/config`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();

                if (data.success) {
                    showNotification(data.message);
                } else {
                    showNotification(data.error || 'Failed to update configuration.', 'danger');
                }
            } catch (error) {
                showNotification('Network error during configuration update.', 'danger');
            } finally {
                document.getElementById('saveConfigBtn').disabled = false;
            }
        });
        
        // --- Auto Allocation Logic ---
        document.getElementById('auto-allocate-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const examDate = document.getElementById('examDate').value;
            const roomListString = document.getElementById('roomList').value;
            const roomList = roomListString.split(',').map(r => r.trim()).filter(r => r.length > 0);
            
            const payload = { examDate, roomList };
            
            const btn = document.getElementById('runAllocationBtn');
            btn.disabled = true;
            btn.textContent = 'Running Allocation...';
            document.getElementById('allocation-results').innerHTML = '<div class="spinner-border text-primary" role="status"></div>';

            try {
                const response = await fetch(`${API_BASE}/auto-allocate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                
                if (data.success) {
                    showNotification(data.message, 'success');
                    displayAllocationResults(data.allocations);
                    // Refresh status after allocation
                    fetchConfig(); 
                } else {
                    showNotification(data.error || 'Allocation failed.', 'danger');
                    document.getElementById('allocation-results').innerHTML = `<p class="text-danger">${data.error || 'An unknown error occurred during allocation.'}</p>`;
                }
            } catch (error) {
                showNotification('Network error during allocation.', 'danger');
                document.getElementById('allocation-results').innerHTML = `<p class="text-danger">Failed to connect to the server for allocation.</p>`;
            } finally {
                btn.disabled = false;
                btn.textContent = 'Run Auto Allocation';
            }
        });

        function displayAllocationResults(allocations) {
            const resultsDiv = document.getElementById('allocation-results');
            if (allocations.length === 0) {
                resultsDiv.innerHTML = '<p class="text-warning">No duties were assigned (perhaps not enough teachers or rooms were listed).</p>';
                return;
            }

            let html = `<p class="text-success">Total ${allocations.length} duties assigned:</p><ul class="list-group">`;
            allocations.forEach(a => {
                html += `<li class="list-group-item"><strong>${a.teacherName}</strong> assigned to <strong>${a.room}</strong> (Duty ID: ${a.dutyId})</li>`;
            });
            html += '</ul>';
            resultsDiv.innerHTML = html;
        }

        // --- Workflow Logic ---
        
        /**
         * Updates button states based on the current chart status.
         */
        function updateWorkflowButtons(status) {
            const submitBtn = document.getElementById('submitApprovalBtn');
            const approveBtn = document.getElementById('approveChartBtn');
            const exportBtn = document.getElementById('exportChartBtn');

            // Reset all buttons
            submitBtn.disabled = false;
            approveBtn.disabled = false;
            exportBtn.disabled = true;

            if (status === 'Pending') {
                submitBtn.disabled = true; // Already submitted
                document.getElementById('current-status').className = 'badge bg-warning';
            } else if (status === 'Approved') {
                submitBtn.disabled = true;
                approveBtn.disabled = true;
                exportBtn.disabled = false; // Unlock export
                document.getElementById('current-status').className = 'badge bg-success';
            } else if (status === 'Draft') {
                approveBtn.disabled = true; // Cannot approve a draft
                document.getElementById('current-status').className = 'badge bg-secondary';
            }
        }

        // Submit for Approval Handler
        document.getElementById('submitApprovalBtn').addEventListener('click', async () => {
            await handleWorkflowAction('/submit-for-approval', 'Submitting...', 'submitApprovalBtn');
        });

        // Approve Chart Handler
        document.getElementById('approveChartBtn').addEventListener('click', async () => {
            await handleWorkflowAction('/approve-chart', 'Approving...', 'approveChartBtn');
        });

        // Export Chart Handler
        document.getElementById('exportChartBtn').addEventListener('click', async () => {
            await handleWorkflowAction('/export/duty-chart', 'Generating Export...', 'exportChartBtn', 'GET');
        });


        /**
         * Generic handler for workflow POST actions.
         */
        async function handleWorkflowAction(endpoint, loadingText, buttonId, method = 'POST') {
            const btn = document.getElementById(buttonId);
            btn.disabled = true;
            const originalText = btn.textContent;
            btn.textContent = loadingText;
            
            try {
                const response = await fetch(`${API_BASE}${endpoint}`, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    // Body is only needed for POST/PUT if data is sent
                    ...(method !== 'GET' ? { body: JSON.stringify({}) } : {})
                });
                const data = await response.json();

                if (data.success) {
                    showNotification(data.message, 'success');
                    // Refresh status and buttons
                    fetchConfig(); 

                    if (endpoint === '/export/duty-chart') {
                        displayDutyChart(data.chartData, data.dates);
                    }
                } else {
                    showNotification(data.error || 'Action failed.', 'danger');
                }
            } catch (error) {
                showNotification('Network error during workflow action.', 'danger');
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        }

        function displayDutyChart(chartData, dates) {
            const previewDiv = document.getElementById('duty-chart-preview');
            if (chartData.length === 0) {
                previewDiv.innerHTML = '<p class="text-warning">No invigilation duties found for export.</p>';
                return;
            }

            // Create table headers
            const headers = Object.keys(chartData[0]);
            let tableHtml = '<table class="table table-sm table-bordered table-hover">';
            tableHtml += '<thead class="table-light"><tr>';
            headers.forEach(h => {
                // Shorten date column names for better viewing
                const displayHeader = dates.includes(h) ? h.substring(5) : h; 
                tableHtml += `<th>${displayHeader}</th>`;
            });
            tableHtml += '</tr></thead><tbody>';

            // Create table rows
            chartData.forEach(row => {
                tableHtml += '<tr>';
                headers.forEach(h => {
                    tableHtml += `<td>${row[h]}</td>`;
                });
                tableHtml += '</tr>';
            });

            tableHtml += '</tbody></table>';
            previewDiv.innerHTML = tableHtml;
        }

        // --- Initialization ---
        document.addEventListener('DOMContentLoaded', fetchConfig);

    </script>
</body>
</html>
