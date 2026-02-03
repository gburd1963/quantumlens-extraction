import React, { useState } from 'react';

const ExtractionInterface = () => {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [organizedFiles, setOrganizedFiles] = useState({
    claimant: { report: [], excel: [], witness: [] },
    respondent: { report: [], excel: [], witness: [] },
    tribunal: { report: [], excel: [], witness: [] }
  });
  const [, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(null);
  const [witnessAudit, setWitnessAudit] = useState(null);
  const [excelAudit, setExcelAudit] = useState(null);
  const [auditsComplete, setAuditsComplete] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [citationReviews, setCitationReviews] = useState({});
  const [reviewNotification, setReviewNotification] = useState(null);
  const stepNames = ['Upload', 'Organize', 'Extract', 'Review', 'Witness Audit', 'Excel Audit'];

  // Demo fixtures for quick hackathon demos
  const demoCases = {
    lupaka: {
      claimant: {
        expert: 'Accuracy',
        scenario: '590t/day',
        damages: '$41.0M',
        wacc: '12.2%',
        productionLife: '10 years',
        valuationDate: '26 Aug 2019',
        alternative355: '$32.1M',
        citations: { damages: { para: '6.63(a)' }, wacc: { para: '6.38' }, scenario: { para: '6.39' } }
      },
      respondent: {
        expert: 'AlixPartners',
        scenario: '590t/day (revised)',
        damages: '$20.5M',
        wacc: '14.6%',
        productionLife: '7 years',
        valuationDate: '26 Aug 2019',
        alternative355: '$22.5M',
        citations: { damages: { para: 146 }, wacc: { para: 144 }, production: { para: '145(b)' } }
      }
    },
    sample: {
      claimant: {
        expert: 'Nova Analytics',
        scenario: '500t/day',
        damages: '$12.8M',
        wacc: '11.0%',
        productionLife: '8 years',
        valuationDate: '01 Jan 2020',
        alternative355: '$10.1M',
        citations: { damages: { para: 10 }, wacc: { para: 12 }, scenario: { para: 9 } }
      },
      respondent: {
        expert: 'Boundary Economics',
        scenario: '400t/day',
        damages: '$6.4M',
        wacc: '13.5%',
        productionLife: '6 years',
        valuationDate: '01 Jan 2020',
        alternative355: '$5.2M',
        citations: { damages: { para: 22 }, wacc: { para: 24 }, production: { para: 21 } }
      }
    }
  };

  const loadDemo = (key) => {
    if (!demoCases[key]) return;
    setExtractedData(demoCases[key]);
    setProgress(100);
    setExtracting(false);
    setStep(4);
    // Also load audit data for demo
    loadWitnessAuditData();
    loadExcelAuditData();
    setAuditsComplete(true);
  };

  const loadWitnessAuditData = () => {
    setWitnessAudit({
      claimant: {
        assumptions: [
          {
            assumption: 'Mine production capacity: 590t/day',
            expertReport: 'Second Report, Para 6.39',
            witnessStatement: 'Ricardo Mendoza Statement, Para 15',
            status: 'verified',
            confidence: 'high',
            citations: {
              expert: {
                para: '6.39',
                context: 'Based on the technical specifications provided by the Claimant and confirmed by the project engineering team, we have adopted the 590 tonnes per day production capacity for our primary valuation scenario. This figure represents the designed capacity of the Invicta processing plant as contemplated in the feasibility study and reflects the planned investment in crushing and milling equipment. The 590t/day scenario assumes implementation of the full Phase II expansion, which was authorized under the original environmental permits and would have been operationally achievable based on the proven and probable reserves available at the valuation date.'
              },
              witness: {
                para: '15',
                witness: 'Ricardo Mendoza (CEO)',
                context: 'The Invicta Gold Project processing plant was specifically designed and engineered for a throughput capacity of 590 tonnes per day. This capacity was based on detailed metallurgical testing conducted by SGS Laboratories in Lima and was consistent with the proven reserve base that we had demonstrated through our 2018 drilling program. The crushing circuit, ball mill, and flotation cells were all sized to handle this production rate, and we had secured firm purchase orders for the key equipment components before the regulatory issues arose in August 2019.'
              }
            }
          },
          {
            assumption: 'Production life: 10 years',
            expertReport: 'Second Report, Para 6.42',
            witnessStatement: 'Patricia Santillan Statement, Para 8',
            status: 'verified',
            confidence: 'medium',
            note: 'Range given (8-10 years), expert used upper bound',
            citations: {
              expert: {
                para: '6.42',
                context: 'Our mine life assumption of 10 years is based on the proven and probable mineral reserves as reported in the company\'s 2019 technical report, combined with the anticipated production rate of 590 tonnes per day. This timeframe assumes continuous mining operations and accounts for the ore grade distribution across the deposit. While Ms. Santillán\'s witness statement indicates a range of 8-10 years for reserve depletion, we have adopted the upper bound of this range as it aligns with the reserve calculations and processing capacity that form the basis of our DCF model.'
              },
              witness: {
                para: '8',
                witness: 'Patricia Santillan (CFO)',
                context: 'Based on our proven and probable reserves of approximately 1.8 million tonnes of ore and the planned production rate, we estimated that the Invicta mine would have an operational life in the range of 8 to 10 years. This estimate incorporated our understanding of the ore body geometry, expected recovery rates of approximately 92%, and the grade distribution within the deposit. The actual mine life would depend on gold prices, operating costs, and the economic cutoff grade, which could vary over time, but 8-10 years represented our best technical assessment as of mid-2019.'
              }
            }
          },
          {
            assumption: 'Gold price forecast: $1,400/oz average',
            expertReport: 'First Report, Para 5.12',
            witnessStatement: 'No witness support found',
            status: 'unsupported',
            confidence: 'high',
            note: 'Expert relies on market forecasts, not witness testimony',
            citations: {
              expert: {
                para: '5.12',
                context: 'For purposes of our valuation, we have adopted a long-term gold price forecast of US$1,400 per troy ounce, which represents the consensus forecast among major investment banks and mining analysts as of the valuation date in August 2019. This price assumption is based on published commodity price forecasts from institutions including Goldman Sachs, JP Morgan, and the World Bank, and reflects expectations for moderate gold price appreciation over the mine life. We note that actual gold prices at the valuation date were approximately US$1,520 per ounce, but we consider the US$1,400 long-term average to be a reasonable and defensible assumption for DCF modeling purposes.'
              }
            }
          }
        ],
        issues: 1
      },
      respondent: {
        assumptions: [
          {
            assumption: 'Revised production capacity: 590t/day',
            expertReport: 'Second Report, Para 145(b)',
            witnessStatement: 'Ricardo Mendoza Statement, Para 15',
            status: 'verified',
            confidence: 'high',
            citations: {
              expert: {
                para: '145(b)',
                context: 'We acknowledge that the Claimant\'s engineering plans contemplated a processing capacity of 590 tonnes per day, and we have revised our valuation to reflect this production scenario rather than the 355t/day capacity we initially considered. Based on our review of the technical documentation and witness testimony, including Mr. Mendoza\'s statement regarding the design specifications, we accept that 590t/day represents the intended production capacity. However, as discussed below, we differ from the Claimant\'s expert on other critical assumptions including mine life and discount rate.'
              },
              witness: {
                para: '15',
                witness: 'Ricardo Mendoza (CEO)',
                context: 'The Invicta Gold Project processing plant was specifically designed and engineered for a throughput capacity of 590 tonnes per day. This capacity was based on detailed metallurgical testing conducted by SGS Laboratories in Lima and was consistent with the proven reserve base that we had demonstrated through our 2018 drilling program. The crushing circuit, ball mill, and flotation cells were all sized to handle this production rate, and we had secured firm purchase orders for the key equipment components before the regulatory issues arose in August 2019.'
              }
            }
          },
          {
            assumption: 'Production life: 7 years (not 10)',
            expertReport: 'Second Report, Para 145(b)',
            witnessStatement: 'Patricia Santillan Statement, Para 8',
            status: 'conflict',
            confidence: 'high',
            note: 'Witness states 8-10 years, expert uses 7 years without explanation',
            citations: {
              expert: {
                para: '145(b)',
                context: 'After careful review of the reserve calculations and considering the regulatory uncertainties that existed at the valuation date, we have adopted a more conservative mine life assumption of 7 years for our valuation. While the Claimant projects a 10-year mine life, we believe this is overly optimistic given the permit instability and the likelihood that production would have been curtailed or suspended due to ongoing regulatory challenges. Our 7-year assumption reflects a realistic assessment of how long the mine could have operated before encountering insurmountable regulatory or operational obstacles, even if the technical reserve base could theoretically support longer operations.'
              },
              witness: {
                para: '8',
                witness: 'Patricia Santillan (CFO)',
                context: 'Based on our proven and probable reserves of approximately 1.8 million tonnes of ore and the planned production rate, we estimated that the Invicta mine would have an operational life in the range of 8 to 10 years. This estimate incorporated our understanding of the ore body geometry, expected recovery rates of approximately 92%, and the grade distribution within the deposit. The actual mine life would depend on gold prices, operating costs, and the economic cutoff grade, which could vary over time, but 8-10 years represented our best technical assessment as of mid-2019.'
              }
            }
          },
          {
            assumption: 'Additional risk premium due to regulatory uncertainty',
            expertReport: 'Second Report, Para 144',
            witnessStatement: 'Miguel Rodriguez Statement, Para 22',
            status: 'conflict',
            confidence: 'medium',
            note: 'Witness indicates stability; expert assumes heightened risk',
            citations: {
              expert: {
                para: '144',
                context: 'We have reassessed the appropriate discount rate for this project in light of the increased regulatory and operational risks that were apparent as of the valuation date. Our review of comparable gold mining projects in Latin America, combined with Peru-specific risk factors including permit stability concerns and community relations challenges, leads us to adopt a higher WACC than applied by the Claimant\'s expert. Specifically, we revise the discount rate to 14.6%, which includes an additional risk premium of 2.4% to account for project-specific uncertainties that were not adequately reflected in standard industry benchmarks. This discount rate is consistent with rates observed in similar mining projects facing comparable regulatory headwinds and reflects the heightened risk profile of the Invicta project in late 2019.'
              },
              witness: {
                para: '22',
                witness: 'Miguel Rodriguez (Government Relations)',
                context: 'Throughout 2018 and the first seven months of 2019, our environmental and operating permits remained stable and in good standing with all relevant Peruvian government authorities. We maintained regular communication with MINEM (Ministry of Energy and Mines) and conducted all required environmental monitoring and reporting in full compliance with applicable regulations. While there were some general discussions in the media about mining policy reforms, we had no indication from government officials that our specific permits were at risk or that any new regulatory restrictions would be imposed on the Invicta project. It was only in late August 2019 that the regulatory situation deteriorated suddenly and unexpectedly.'
              }
            }
          }
        ],
        issues: 2
      }
    });
  };

  const loadExcelAuditData = () => {
    setExcelAudit({
      claimant: {
        fileName: 'Accuracy_DCF_Model_v2.xlsx',
        issues: [
          {
            severity: 'high',
            category: 'Hardcoded Value',
            location: 'Cash Flow!C15',
            description: 'WACC hardcoded as 0.122 instead of referencing Assumptions!B8',
            impact: 'If WACC assumption changes, DCF calculation will not update',
            recommendation: 'Replace with formula: =Assumptions!B8'
          },
          {
            severity: 'medium',
            category: 'Inconsistency',
            location: 'Assumptions!B12',
            description: 'Production years set to 9 in Excel, but expert report states 10 years',
            impact: 'Damages may be understated by one year of cash flows',
            recommendation: 'Reconcile with Para 6.42 of Second Report'
          },
          {
            severity: 'low',
            category: 'Formula Risk',
            location: 'Cash Flow!E25:E35',
            description: 'Operating costs use absolute cell references ($B$10) making row insertion risky',
            impact: 'Adding rows may break calculations',
            recommendation: 'Use relative references or named ranges'
          }
        ],
        summary: {
          total: 3,
          high: 1,
          medium: 1,
          low: 1,
          verified: true
        }
      },
      respondent: {
        fileName: 'AlixPartners_Valuation_Model.xlsx',
        issues: [
          {
            severity: 'critical',
            category: 'Inconsistency',
            location: 'Inputs!C8',
            description: 'Production life hardcoded as 7 years, inconsistent with witness statement (8-10 years) and claimant expert (10 years)',
            impact: 'Significant undervaluation; 3 years of lost cash flows',
            recommendation: 'Justify 7-year assumption or align with witness testimony'
          },
          {
            severity: 'high',
            category: 'Hardcoded Value',
            location: 'WACC!D12',
            description: 'Risk-free rate hardcoded as 3.2% without source reference',
            impact: 'Cannot verify basis for WACC calculation',
            recommendation: 'Add source reference and link to Assumptions sheet'
          },
          {
            severity: 'high',
            category: 'Circular Reference',
            location: 'DCF!F45',
            description: 'Circular reference detected in terminal value calculation',
            impact: 'Excel iterative calculation enabled; may cause instability',
            recommendation: 'Restructure formula to eliminate circular reference'
          },
          {
            severity: 'medium',
            category: 'Hidden Rows',
            location: 'Sensitivity!Rows 15-30',
            description: '16 rows hidden in sensitivity analysis sheet',
            impact: 'Unable to verify complete sensitivity calculations',
            recommendation: 'Unhide for tribunal review'
          }
        ],
        summary: {
          total: 4,
          critical: 1,
          high: 2,
          medium: 1,
          low: 0,
          verified: true
        }
      }
    });
  };

  // Citation review handlers
  const handleCitationReview = (citationId, status) => {
    setCitationReviews(prev => ({
      ...prev,
      [citationId]: { status, timestamp: new Date().toISOString() }
    }));

    const message = status === 'correct' ? '✓ Marked as correct' : '⚠ Flagged for review';
    setReviewNotification(message);

    setTimeout(() => {
      setReviewNotification(null);
    }, 2000);
  };

  // File upload handler
  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles([...files, ...uploadedFiles]);
  };

  // Remove file
  const removeFile = (fileName) => {
    setFiles(files.filter(f => f.name !== fileName));
  };

  // Simulate extraction process
  const startExtraction = () => {
    setExtracting(true);
    setStep(3);
    
    // Simulate progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 15;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setExtracting(false);
        setStep(4);
        
        // Real Lupaka Gold v. Peru expert report data
        setExtractedData({
          claimant: {
            expert: 'Accuracy',
            scenario: '590t/day',
            damages: '$41.0M',
            wacc: '12.2%',
            terminalValue: 'Included in NPV',
            productionLife: '10 years',
            valuationDate: '26 Aug 2019',
            fmvBeforeDebt: '$41.0M',
            debtAdjustment: '$0 (modeled explicitly)',
            alternative355: '$32.1M',
            citations: {
              damages: { para: '6.63(a)', page: 59, report: '2nd' },
              wacc: { para: '6.38', page: 53, report: '2nd' },
              fmv: { para: '7.1', page: 55, report: '1st' },
              scenario: { para: '6.39', page: 53, report: '2nd' },
              production: { para: '6.42', page: 54, report: '2nd' }
            }
          },
          respondent: {
            expert: 'AlixPartners',
            scenario: '590t/day (revised)',
            damages: '$20.5M',
            wacc: '14.6%',
            terminalValue: 'Not specified',
            productionLife: '7 years (not 10)',
            valuationDate: '26 Aug 2019',
            adjustment: 'Additional risk premium',
            sensitivityRange: '$16.6M - $20.5M',
            alternative355: '$22.5M',
            citations: {
              damages: { para: 146, page: 43, report: '2nd' },
              wacc: { para: 144, page: 42, report: '2nd' },
              production: { para: '145(b)', page: 43, report: '2nd' },
              sensitivity: { para: 146, page: 43, report: '2nd' }
            }
          }
        });
      }
    }, 300);
  };

  // Step 1: Upload Screen
  const UploadScreen = () => (
    <div style={styles.container}>
      <h2 style={styles.header}>Upload Expert Reports & Supporting Files</h2>
      
      <div style={styles.dropZone}>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          style={styles.fileInput}
          id="fileUpload"
          accept=".pdf,.xlsx,.xls,.docx"
        />
        <label htmlFor="fileUpload" style={styles.dropZoneLabel}>
          <div style={styles.dropZoneIcon}>📄</div>
          <div>Drag and drop files here or click to browse</div>
          <div style={styles.acceptedFormats}>Accepted: PDF, XLSX, XLS, DOCX</div>
        </label>
      </div>

      <div style={styles.uploadedFilesContainer}>
        <h3>Uploaded Files ({files.length}):</h3>
        {files.length === 0 ? (
          <div style={styles.emptyState}>(empty - awaiting files)</div>
        ) : (
          <div style={styles.fileList}>
            {files.map((file, idx) => (
              <div key={idx} style={styles.fileItem}>
                <span>{file.type.includes('pdf') ? '📄' : '📊'} {file.name}</span>
                <button onClick={() => removeFile(file.name)} style={styles.removeBtn}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={() => setStep(2)}
          disabled={files.length === 0}
          style={{...styles.button, ...styles.primaryButton, opacity: files.length === 0 ? 0.5 : 1}}
        >
          Continue →
        </button>
      </div>
    </div>
  );

  // Step 2: Organize Screen
  const OrganizeScreen = () => {
    const [unassignedFiles, setUnassignedFiles] = useState([...files]);
    
    const assignFile = (file, party, type) => {
      setOrganizedFiles(prev => {
        const newOrg = { ...prev };
        if (type === 'report') {
          if (!newOrg[party].report) newOrg[party].report = [];
          newOrg[party].report.push(file);
        } else if (type === 'excel') {
          if (!newOrg[party].excel) newOrg[party].excel = [];
          newOrg[party].excel.push(file);
        } else if (type === 'witness') {
          if (!newOrg[party].witness) newOrg[party].witness = [];
          newOrg[party].witness.push(file);
        }
        return newOrg;
      });
      setUnassignedFiles(prev => prev.filter(f => f.name !== file.name));
    };
    
    const unassignFile = (file, party, type) => {
      setOrganizedFiles(prev => {
        const newOrg = { ...prev };
        if (type === 'report') {
          newOrg[party].report = newOrg[party].report.filter(f => f.name !== file.name);
        } else if (type === 'excel') {
          newOrg[party].excel = newOrg[party].excel.filter(f => f.name !== file.name);
        } else if (type === 'witness') {
          newOrg[party].witness = newOrg[party].witness.filter(f => f.name !== file.name);
        }
        return newOrg;
      });
      setUnassignedFiles(prev => [...prev, file]);
    };

    const PartySection = ({ party, title }) => (
      <div style={styles.partySection}>
        <h3 style={styles.partyHeader}>{title}</h3>
        
        <div style={styles.organizeBox}>
          <div style={styles.documentCategory}>
            <div style={styles.categoryHeader}>
              <span style={styles.categoryLabel}>📄 Expert Reports (Required)</span>
              {organizedFiles[party].report?.length > 0 && (
                <span style={styles.categoryCount}>{organizedFiles[party].report.length} {organizedFiles[party].report.length === 1 ? 'report' : 'reports'}</span>
              )}
            </div>
            <div style={styles.categoryHint}>
              Add all rounds of expert reports (First Report, Second Report, Rejoinder, etc.)
            </div>
            {organizedFiles[party].report?.map((file, idx) => (
              <div key={idx} style={styles.assignedFile}>
                <span style={styles.fileName}>
                  <span style={styles.fileNumber}>#{idx + 1}</span>
                  {file.name}
                </span>
                <button 
                  onClick={() => unassignFile(file, party, 'report')}
                  style={styles.removeBtn}
                >
                  ×
                </button>
              </div>
            ))}
            <div style={styles.dropZoneSmall}>
              <select
                onChange={(e) => {
                  const file = unassignedFiles.find(f => f.name === e.target.value);
                  if (file) assignFile(file, party, 'report');
                  e.target.value = '';
                }}
                style={styles.selectFileSmall}
                value=""
              >
                <option value="">+ Add expert report...</option>
                {unassignedFiles.filter(f => f.type.includes('pdf') || f.name.endsWith('.pdf')).map((file, idx) => (
                  <option key={idx} value={file.name}>{file.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.documentCategory}>
            <div style={styles.categoryHeader}>
              <span style={styles.categoryLabel}>📊 Supporting Excel Files</span>
              {organizedFiles[party].excel?.length > 0 && (
                <span style={styles.categoryCount}>{organizedFiles[party].excel.length} {organizedFiles[party].excel.length === 1 ? 'file' : 'files'}</span>
              )}
            </div>
            <div style={styles.categoryHint}>
              DCF models, WACC calculations, production schedules, etc.
            </div>
            {organizedFiles[party].excel?.map((file, idx) => (
              <div key={idx} style={styles.assignedFile}>
                <span style={styles.fileName}>{file.name}</span>
                <button 
                  onClick={() => unassignFile(file, party, 'excel')}
                  style={styles.removeBtn}
                >
                  ×
                </button>
              </div>
            ))}
            <div style={styles.dropZoneSmall}>
              <select
                onChange={(e) => {
                  const file = unassignedFiles.find(f => f.name === e.target.value);
                  if (file) assignFile(file, party, 'excel');
                  e.target.value = '';
                }}
                style={styles.selectFileSmall}
                value=""
              >
                <option value="">+ Add Excel file...</option>
                {unassignedFiles.filter(f => 
                  f.type.includes('spreadsheet') || 
                  f.name.endsWith('.xlsx') || 
                  f.name.endsWith('.xls')
                ).map((file, idx) => (
                  <option key={idx} value={file.name}>{file.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.documentCategory}>
            <div style={styles.categoryHeader}>
              <span style={styles.categoryLabel}>👤 Witness Statements</span>
              {organizedFiles[party].witness?.length > 0 && (
                <span style={styles.categoryCount}>{organizedFiles[party].witness.length} {organizedFiles[party].witness.length === 1 ? 'statement' : 'statements'}</span>
              )}
            </div>
            <div style={styles.categoryHint}>
              Fact witness statements supporting the expert's assumptions
            </div>
            {organizedFiles[party].witness?.map((file, idx) => (
              <div key={idx} style={styles.assignedFile}>
                <span style={styles.fileName}>{file.name}</span>
                <button 
                  onClick={() => unassignFile(file, party, 'witness')}
                  style={styles.removeBtn}
                >
                  ×
                </button>
              </div>
            ))}
            <div style={styles.dropZoneSmall}>
              <select
                onChange={(e) => {
                  const file = unassignedFiles.find(f => f.name === e.target.value);
                  if (file) assignFile(file, party, 'witness');
                  e.target.value = '';
                }}
                style={styles.selectFileSmall}
                value=""
              >
                <option value="">+ Add witness statement...</option>
                {unassignedFiles.filter(f => f.type.includes('pdf') || f.name.endsWith('.pdf')).map((file, idx) => (
                  <option key={idx} value={file.name}>{file.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div style={styles.container}>
        <h2 style={styles.header}>Organize Your Documents</h2>
        
        <div style={styles.instructionBox}>
          <span style={styles.instructionIcon}>ℹ️</span>
          <span style={styles.instructionText}>
            Classify your uploaded files by party and document type. Each party must have at least one expert report. You can add multiple reports if the expert filed several rounds (First Report, Second Report, Rejoinder, etc.).
          </span>
        </div>

        <PartySection party="claimant" title="Claimant's Documents" />
        <PartySection party="respondent" title="Respondent's Documents" />
        <PartySection party="tribunal" title="Tribunal-Appointed Expert (Optional)" />

        {unassignedFiles.length > 0 && (
          <div style={styles.unassignedSection}>
            <h3 style={styles.unassignedHeader}>
              📂 Unassigned Files ({unassignedFiles.length})
            </h3>
            <div style={styles.unassignedList}>
              {unassignedFiles.map((file, idx) => (
                <div key={idx} style={styles.unassignedFile}>
                  <span style={styles.fileName}>
                    {file.type.includes('pdf') ? '📄' : 
                     file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') ? '📊' : '📄'} 
                    {' '}{file.name}
                  </span>
                  <button 
                    onClick={() => removeFile(file.name)}
                    style={styles.removeBtn}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.buttonContainer}>
          <button onClick={() => setStep(1)} style={{...styles.button, ...styles.secondaryButton}}>
            ← Back
          </button>
          <button
            onClick={startExtraction}
            disabled={!organizedFiles.claimant.report?.length || !organizedFiles.respondent.report?.length}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              opacity: (!organizedFiles.claimant.report?.length || !organizedFiles.respondent.report?.length) ? 0.5 : 1
            }}
          >
            Extract Information →
          </button>
        </div>
      </div>
    );
  };

  // Step 3: Progress Screen
  const ProgressScreen = () => (
    <div style={styles.container}>
      <h2 style={styles.header}>Analyzing Expert Reports</h2>
      
      <div style={styles.progressContainer}>
        <div style={styles.progressLabel}>Progress: {progress}%</div>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${progress}%`}} />
        </div>
        
        <div style={styles.taskList}>
          <div style={styles.taskItem}>{progress > 10 ? '✓' : '⟳'} Extracting valuation date</div>
          <div style={styles.taskItem}>{progress > 25 ? '✓' : progress > 10 ? '⟳' : '○'} Identifying DCF methodology</div>
          <div style={styles.taskItem}>{progress > 50 ? '✓' : progress > 25 ? '⟳' : '○'} Extracting cash flow projections</div>
          <div style={styles.taskItem}>{progress > 75 ? '✓' : progress > 50 ? '⟳' : '○'} Analyzing WACC components</div>
          <div style={styles.taskItem}>{progress > 90 ? '✓' : progress > 75 ? '⟳' : '○'} Identifying key assumptions</div>
          <div style={styles.taskItem}>{progress >= 100 ? '✓' : progress > 90 ? '⟳' : '○'} Creating citation index</div>
        </div>
        
        <div style={styles.timeEstimate}>This typically takes 2-3 minutes...</div>
      </div>
    </div>
  );

  // Step 4: Review Screen
  const ReviewScreen = () => {
    const [selectedCitation, setSelectedCitation] = useState(null);

    return (
      <div style={styles.container}>
        <h2 style={styles.header}>Review Extraction</h2>
        
        <div style={styles.comparisonTable}>
          <div style={styles.caseInfo}>
            <strong>Case:</strong> Lupaka Gold Corp. v. Republic of Peru (ICSID ARB/20/46)<br/>
            <strong>Project:</strong> Invicta Gold Mine, Peru<br/>
            <strong>Valuation Date:</strong> 26 August 2019
          </div>
          
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}></th>
                <th style={styles.th}>Claimant (Accuracy)</th>
                <th style={styles.th}>Respondent (AlixPartners)</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>Valuation Date</td>
                <td style={styles.td}>{extractedData.claimant.valuationDate}</td>
                <td style={styles.td}>{extractedData.respondent.valuationDate}</td>
                <td style={styles.td}><span style={styles.agree}>✓</span></td>
              </tr>
              <tr>
                <td style={styles.td}>Damages Claimed</td>
                <td style={styles.td}>
                  {extractedData.claimant.damages}
                  <button 
                    onClick={() => setSelectedCitation({party: 'claimant', field: 'damages'})}
                    style={styles.citationBtn}
                  >
                    [Para {extractedData.claimant.citations.damages.para}]
                  </button>
                </td>
                <td style={styles.td}>
                  {extractedData.respondent.damages}
                  <button 
                    onClick={() => setSelectedCitation({party: 'respondent', field: 'damages'})}
                    style={styles.citationBtn}
                  >
                    [Para {extractedData.respondent.citations.damages.para}]
                  </button>
                </td>
                <td style={styles.td}><span style={styles.disagree}>!</span></td>
              </tr>
              <tr>
                <td style={styles.td}>Discount Rate (WACC)</td>
                <td style={styles.td}>
                  {extractedData.claimant.wacc}
                  <button 
                    onClick={() => setSelectedCitation({party: 'claimant', field: 'wacc'})}
                    style={styles.citationBtn}
                  >
                    [Para {extractedData.claimant.citations.wacc.para}]
                  </button>
                </td>
                <td style={styles.td}>
                  {extractedData.respondent.wacc}
                  <button 
                    onClick={() => setSelectedCitation({party: 'respondent', field: 'wacc'})}
                    style={styles.citationBtn}
                  >
                    [Para {extractedData.respondent.citations.wacc.para}]
                  </button>
                </td>
                <td style={styles.td}><span style={styles.disagree}>!</span></td>
              </tr>
              <tr>
                <td style={styles.td}>Production Life</td>
                <td style={styles.td}>
                  {extractedData.claimant.productionLife}
                  <button
                    onClick={() => setSelectedCitation({party: 'claimant', field: 'production'})}
                    style={styles.citationBtn}
                  >
                    [Para {extractedData.claimant.citations.production.para}]
                  </button>
                </td>
                <td style={styles.td}>
                  {extractedData.respondent.productionLife}
                  <button
                    onClick={() => setSelectedCitation({party: 'respondent', field: 'production'})}
                    style={styles.citationBtn}
                  >
                    [Para {extractedData.respondent.citations.production.para}]
                  </button>
                </td>
                <td style={styles.td}><span style={styles.disagree}>!</span></td>
              </tr>
              <tr>
                <td style={styles.td}>Production Scenario</td>
                <td style={styles.td}>{extractedData.claimant.scenario}</td>
                <td style={styles.td}>{extractedData.respondent.scenario}</td>
                <td style={styles.td}><span style={styles.disagree}>!</span></td>
              </tr>
              <tr style={styles.alternativeRow}>
                <td style={styles.td}><em>Alternative (355t/day)</em></td>
                <td style={styles.td}><em>{extractedData.claimant.alternative355}</em></td>
                <td style={styles.td}><em>{extractedData.respondent.alternative355}</em></td>
                <td style={styles.td}><span style={styles.disagree}>!</span></td>
              </tr>
            </tbody>
          </table>
          
          <div style={styles.quantumGap}>
            <strong>Quantum Gap:</strong> 2x difference ($41.0M vs $20.5M)<br/>
            <strong>Key Dispute:</strong> Discount rate reflects fundamentally different risk assessments
          </div>
        </div>

        <div style={styles.legend}>
          <span style={styles.agree}>✓</span> = Agreement &nbsp;&nbsp;
          <span style={styles.disagree}>!</span> = Material difference
        </div>

        {selectedCitation && (
          <div style={styles.citationModal}>
            <div style={styles.modalContent}>
              <button onClick={() => setSelectedCitation(null)} style={styles.closeBtn}>×</button>
              <h3>Citation Viewer</h3>
              <p><strong>Document:</strong> {selectedCitation.party === 'claimant' ? 'Second Expert Report of Accuracy' : 'Second Expert Report of AlixPartners'}</p>
              <p><strong>Location:</strong> Paragraph {extractedData[selectedCitation.party].citations[selectedCitation.field].para}</p>
              
              <div style={styles.pdfPreview}>
                <div style={styles.extractedContext}>
                  {selectedCitation.field === 'damages' && selectedCitation.party === 'claimant' && (
                    <>
                      <strong>6.63</strong> Following the updates to our damages assessment as described in this Second Report, and incorporating the revised production schedule and operating cost assumptions provided by the Claimant's technical team, we have recalculated the fair market value of the Invicta Gold Project as of the valuation date. Our revised DCF analysis yields the following damages estimates under the two production scenarios we have evaluated:<br/><br/>
                      <span style={styles.highlighted}>a) USD 41.0m in the 590t/day Scenario (our primary valuation)</span><br/>
                      b) USD 32.1m in the alternative 355t/day Scenario<br/><br/>
                      These figures represent the equity value of the project after accounting for all projected operating costs, capital expenditures, and tax obligations over the mine life.
                    </>
                  )}
                  {selectedCitation.field === 'wacc' && selectedCitation.party === 'claimant' && (
                    <>
                      <strong>6.38</strong> We have updated our weighted average cost of capital (WACC) analysis to reflect more recent market data and comparable mining projects in Peru. After reviewing sovereign risk premiums, industry beta coefficients, and current capital market conditions, <span style={styles.highlighted}>we now apply a discount rate of 12.2%</span> to the projected cash flows. This represents a decrease of 0.5% from our First Report, reflecting improved macroeconomic stability in Peru and reduced country risk perceptions among international investors. Our WACC calculation incorporates a risk-free rate of 2.8%, an equity risk premium of 6.5%, and a country risk premium of 2.1% for Peru.
                    </>
                  )}
                  {selectedCitation.field === 'damages' && selectedCitation.party === 'respondent' && (
                    <>
                      <strong>146.</strong> Based on our revised discounted cash flow analysis and incorporating the updates discussed in this Second Report, we have determined the fair market value of the Invicta Gold Project as of August 26, 2019. Our analysis reflects a more conservative view of the project's viability given the regulatory uncertainties and operational constraints that existed at the valuation date. The results of our valuation are summarized in the table below:<br/><br/>
                      <div style={{textAlign: 'center', margin: '10px 0', padding: '10px', backgroundColor: '#1e293b', borderRadius: '4px'}}>
                        <strong>Valuation Summary</strong><br/>
                        Production Scenario: 590t/day (revised)<br/>
                        <span style={styles.highlighted}>Damages (US$ millions): 20.5</span><br/>
                        Sensitivity Range: 16.6 - 20.5
                      </div>
                      This valuation incorporates our revised assessment of mine life (7 years), updated WACC (14.6%), and modified production assumptions based on the available technical evidence.
                    </>
                  )}
                  {selectedCitation.field === 'wacc' && selectedCitation.party === 'respondent' && (
                    <>
                      <strong>144.</strong> We have reassessed the appropriate discount rate for this project in light of the increased regulatory and operational risks that were apparent as of the valuation date. Our review of comparable gold mining projects in Latin America, combined with Peru-specific risk factors including permit stability concerns and community relations challenges, leads us to adopt a higher WACC than applied by the Claimant's expert. Specifically, <span style={styles.highlighted}>we revise the discount rate to 14.6%</span>, which includes an additional risk premium of 2.4% to account for project-specific uncertainties that were not adequately reflected in standard industry benchmarks. This discount rate is consistent with rates observed in similar mining projects facing comparable regulatory headwinds and reflects the heightened risk profile of the Invicta project in late 2019.
                    </>
                  )}
                  {selectedCitation.field === 'production' && selectedCitation.party === 'claimant' && (
                    <>
                      <strong>6.42</strong> Our mine life assumption of <span style={styles.highlighted}>10 years</span> is based on the proven and probable mineral reserves as reported in the company's 2019 technical report, combined with the anticipated production rate of 590 tonnes per day. This timeframe assumes continuous mining operations and accounts for the ore grade distribution across the deposit. While Ms. Santillán's witness statement indicates a range of 8-10 years for reserve depletion, we have adopted the upper bound of this range as it aligns with the reserve calculations and processing capacity that form the basis of our DCF model. The 10-year mine life reflects a reasonable extraction schedule given the ore body characteristics and planned processing capacity.
                    </>
                  )}
                  {selectedCitation.field === 'production' && selectedCitation.party === 'respondent' && (
                    <>
                      <strong>145(b).</strong> After careful review of the reserve calculations and considering the regulatory uncertainties that existed at the valuation date, we have adopted a more conservative mine life assumption of <span style={styles.highlighted}>7 years</span> for our valuation. While the Claimant projects a 10-year mine life, we believe this is overly optimistic given the permit instability and the likelihood that production would have been curtailed or suspended due to ongoing regulatory challenges. Our 7-year assumption reflects a realistic assessment of how long the mine could have operated before encountering insurmountable regulatory or operational obstacles, even if the technical reserve base could theoretically support longer operations. This shortened mine life significantly impacts the project valuation.
                    </>
                  )}
                </div>
              </div>
              
              <div style={styles.confidence}>Confidence: ●●●●● (Very High)</div>

              <div style={styles.modalActions}>
                <button
                  onClick={() => {
                    const citationId = `review-${selectedCitation.party}-${selectedCitation.field}`;
                    handleCitationReview(citationId, 'correct');
                    setSelectedCitation(null);
                  }}
                  style={{...styles.button, ...styles.successButton}}
                >
                  This looks correct
                </button>
                <button
                  onClick={() => {
                    const citationId = `review-${selectedCitation.party}-${selectedCitation.field}`;
                    handleCitationReview(citationId, 'flagged');
                    setSelectedCitation(null);
                  }}
                  style={{...styles.button, ...styles.warningButton}}
                >
                  Flag for review
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.buttonContainer}>
          <button onClick={() => setStep(2)} style={{...styles.button, ...styles.secondaryButton}}>← Back</button>
          <button onClick={() => setStep(5)} style={{...styles.button, ...styles.primaryButton}}>Audit Witnesses →</button>
        </div>
      </div>
    );
  };

  // Step 6: Excel Audit Screen
  const ExcelAuditScreen = () => {
    const [selectedParty, setSelectedParty] = useState('claimant');

    const renderIssue = (issue, idx) => {
      const severityColors = {
        critical: '#dc2626',
        high: '#ef4444',
        medium: '#f59e0b',
        low: '#94a3b8'
      };

      return (
        <div key={idx} style={styles.issueCard}>
          <div style={styles.issueHeader}>
            <div style={styles.issueHeaderLeft}>
              <span style={{...styles.severityBadge, backgroundColor: severityColors[issue.severity] + '20', color: severityColors[issue.severity]}}>
                {issue.severity.toUpperCase()}
              </span>
              <span style={styles.categoryBadge}>{issue.category}</span>
            </div>
            <span style={styles.locationBadge}>{issue.location}</span>
          </div>

          <div style={styles.issueBody}>
            <div style={styles.issueDescription}>{issue.description}</div>
            <div style={styles.issueImpact}>
              <strong>Impact:</strong> {issue.impact}
            </div>
            <div style={styles.issueRecommendation}>
              <strong>Recommendation:</strong> {issue.recommendation}
            </div>
          </div>
        </div>
      );
    };

    if (!excelAudit) return null;

    const currentPartyData = excelAudit[selectedParty];

    return (
      <div style={styles.container}>
        <h2 style={styles.header}>DCF Excel Model Audit</h2>

        <div style={styles.auditDescription}>
          <span style={styles.instructionIcon}>📊</span>
          <span style={styles.instructionText}>
            Analyzing Excel models for hardcoded values, formula errors, inconsistencies with expert reports, and structural issues.
          </span>
        </div>

        <div style={styles.partySelector}>
          <button
            onClick={() => setSelectedParty('claimant')}
            style={{
              ...styles.partySelectorBtn,
              ...(selectedParty === 'claimant' ? styles.partySelectorActive : {})
            }}
          >
            Claimant (Accuracy)
            <span style={styles.issueCountBadge}>
              {excelAudit.claimant.summary.total} issues
            </span>
          </button>
          <button
            onClick={() => setSelectedParty('respondent')}
            style={{
              ...styles.partySelectorBtn,
              ...(selectedParty === 'respondent' ? styles.partySelectorActive : {})
            }}
          >
            Respondent (AlixPartners)
            <span style={styles.issueCountBadge}>
              {excelAudit.respondent.summary.total} issues
            </span>
          </button>
        </div>

        <div style={styles.excelSummaryCard}>
          <div style={styles.excelFileName}>📄 {currentPartyData.fileName}</div>
          <div style={styles.excelStats}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Total Issues:</span>
              <span style={styles.statValue}>{currentPartyData.summary.total}</span>
            </div>
            {currentPartyData.summary.critical > 0 && (
              <div style={styles.statItem}>
                <span style={{...styles.statLabel, color: '#dc2626'}}>Critical:</span>
                <span style={{...styles.statValue, color: '#dc2626'}}>{currentPartyData.summary.critical}</span>
              </div>
            )}
            {currentPartyData.summary.high > 0 && (
              <div style={styles.statItem}>
                <span style={{...styles.statLabel, color: '#ef4444'}}>High:</span>
                <span style={{...styles.statValue, color: '#ef4444'}}>{currentPartyData.summary.high}</span>
              </div>
            )}
            {currentPartyData.summary.medium > 0 && (
              <div style={styles.statItem}>
                <span style={{...styles.statLabel, color: '#f59e0b'}}>Medium:</span>
                <span style={{...styles.statValue, color: '#f59e0b'}}>{currentPartyData.summary.medium}</span>
              </div>
            )}
            {currentPartyData.summary.low > 0 && (
              <div style={styles.statItem}>
                <span style={{...styles.statLabel, color: '#94a3b8'}}>Low:</span>
                <span style={{...styles.statValue, color: '#94a3b8'}}>{currentPartyData.summary.low}</span>
              </div>
            )}
          </div>
        </div>

        <div style={styles.issuesList}>
          {currentPartyData.issues.map((issue, idx) => renderIssue(issue, idx))}
        </div>

        <div style={styles.summaryBox}>
          <strong>Audit Complete:</strong> Identified {currentPartyData.summary.total} issue(s) in DCF model.
          {currentPartyData.summary.critical > 0 && ' Critical issues require immediate attention before relying on these calculations.'}
          {currentPartyData.summary.high > 0 && !currentPartyData.summary.critical && ' High-severity issues may significantly impact valuation accuracy.'}
        </div>

        <div style={styles.buttonContainer}>
          <button onClick={() => setStep(5)} style={{...styles.button, ...styles.secondaryButton}}>← Back</button>
          <button
            onClick={() => setAuditsComplete(true)}
            style={{...styles.button, ...styles.successButton}}
          >
            Export Report →
          </button>
        </div>
      </div>
    );
  };

  // Step 5: Witness Audit Screen
  const WitnessAuditScreen = () => {
    const [selectedParty, setSelectedParty] = useState('claimant');
    const [selectedCitation, setSelectedCitation] = useState(null);

    const renderAssumption = (assumption, idx) => {
      const statusColors = {
        verified: '#10b981',
        conflict: '#ef4444',
        unsupported: '#f59e0b'
      };
      const statusLabels = {
        verified: '✓ Verified',
        conflict: '⚠ Conflict',
        unsupported: '○ Unsupported'
      };

      return (
        <div key={idx} style={styles.assumptionCard}>
          <div style={styles.assumptionHeader}>
            <span style={styles.assumptionTitle}>{assumption.assumption}</span>
            <span style={{...styles.statusBadge, backgroundColor: statusColors[assumption.status] + '20', color: statusColors[assumption.status]}}>
              {statusLabels[assumption.status]}
            </span>
          </div>

          <div style={styles.assumptionBody}>
            <div style={styles.sourceRow}>
              <span style={styles.sourceLabel}>Expert Report:</span>
              <span style={styles.sourceText}>
                {assumption.expertReport.split('Para ')[0]}
                {assumption.citations?.expert && (
                  <span
                    onClick={() => setSelectedCitation({type: 'expert', assumptionIdx: idx})}
                    style={styles.citationLink}
                  >
                    Para {assumption.citations.expert.para}
                  </span>
                )}
              </span>
            </div>
            <div style={styles.sourceRow}>
              <span style={styles.sourceLabel}>Witness Statement:</span>
              <span style={styles.sourceText}>
                {assumption.witnessStatement === 'No witness support found' ? (
                  <span style={{color: '#94a3b8', fontStyle: 'italic'}}>No witness support found</span>
                ) : (
                  <>
                    {assumption.witnessStatement.split('Para ')[0]}
                    {assumption.citations?.witness && (
                      <span
                        onClick={() => setSelectedCitation({type: 'witness', assumptionIdx: idx})}
                        style={styles.citationLink}
                      >
                        Para {assumption.citations.witness.para}
                      </span>
                    )}
                  </>
                )}
              </span>
            </div>
            {assumption.note && (
              <div style={styles.noteBox}>
                <strong>Note:</strong> {assumption.note}
              </div>
            )}
          </div>

          <div style={styles.confidenceBar}>
            <span style={{fontSize: '11px', color: '#94a3b8'}}>Confidence: </span>
            <div style={{display: 'inline-flex', gap: '2px'}}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{color: i < (assumption.confidence === 'high' ? 5 : assumption.confidence === 'medium' ? 3 : 2) ? '#fbbf24' : '#334155'}}>●</span>
              ))}
            </div>
          </div>
        </div>
      );
    };

    if (!witnessAudit) return null;

    const currentPartyData = witnessAudit[selectedParty];

    return (
      <div style={styles.container}>
        <h2 style={styles.header}>Witness Statement Cross-Verification</h2>

        <div style={styles.auditDescription}>
          <span style={styles.instructionIcon}>🔍</span>
          <span style={styles.instructionText}>
            Verifying that expert report assumptions are supported by witness testimony and factual evidence.
          </span>
        </div>

        <div style={styles.partySelector}>
          <button
            onClick={() => setSelectedParty('claimant')}
            style={{
              ...styles.partySelectorBtn,
              ...(selectedParty === 'claimant' ? styles.partySelectorActive : {})
            }}
          >
            Claimant (Accuracy)
            {witnessAudit.claimant.issues > 0 && (
              <span style={styles.issueBadge}>{witnessAudit.claimant.issues}</span>
            )}
          </button>
          <button
            onClick={() => setSelectedParty('respondent')}
            style={{
              ...styles.partySelectorBtn,
              ...(selectedParty === 'respondent' ? styles.partySelectorActive : {})
            }}
          >
            Respondent (AlixPartners)
            {witnessAudit.respondent.issues > 0 && (
              <span style={styles.issueBadge}>{witnessAudit.respondent.issues}</span>
            )}
          </button>
        </div>

        <div style={styles.assumptionsList}>
          {currentPartyData.assumptions.map((assumption, idx) => renderAssumption(assumption, idx))}
        </div>

        {selectedCitation && (
          <div style={styles.citationModal}>
            <div style={styles.modalContent}>
              <button onClick={() => setSelectedCitation(null)} style={styles.closeBtn}>×</button>
              <h3>Citation Viewer</h3>
              <p><strong>Document:</strong> {selectedCitation.type === 'expert'
                ? (selectedParty === 'claimant' ? 'Expert Report of Accuracy' : 'Expert Report of AlixPartners')
                : `Witness Statement - ${currentPartyData.assumptions[selectedCitation.assumptionIdx].citations.witness.witness}`
              }</p>
              <p><strong>Location:</strong> Paragraph {
                selectedCitation.type === 'expert'
                  ? currentPartyData.assumptions[selectedCitation.assumptionIdx].citations.expert.para
                  : currentPartyData.assumptions[selectedCitation.assumptionIdx].citations.witness.para
              }</p>

              <div style={styles.pdfPreview}>
                <div style={styles.extractedContext}>
                  {selectedCitation.type === 'expert' ? (
                    <>
                      <strong>Para {currentPartyData.assumptions[selectedCitation.assumptionIdx].citations.expert.para}:</strong> {currentPartyData.assumptions[selectedCitation.assumptionIdx].citations.expert.context}
                    </>
                  ) : (
                    <>
                      <strong>Para {currentPartyData.assumptions[selectedCitation.assumptionIdx].citations.witness.para}:</strong> {currentPartyData.assumptions[selectedCitation.assumptionIdx].citations.witness.context}
                    </>
                  )}
                </div>
              </div>

              <div style={styles.confidence}>Confidence: ●●●●● (Very High)</div>

              <div style={styles.modalActions}>
                <button
                  onClick={() => {
                    const citationId = `witness-${selectedParty}-${selectedCitation.type}-${selectedCitation.assumptionIdx}`;
                    handleCitationReview(citationId, 'correct');
                    setSelectedCitation(null);
                  }}
                  style={{...styles.button, ...styles.successButton}}
                >
                  This looks correct
                </button>
                <button
                  onClick={() => {
                    const citationId = `witness-${selectedParty}-${selectedCitation.type}-${selectedCitation.assumptionIdx}`;
                    handleCitationReview(citationId, 'flagged');
                    setSelectedCitation(null);
                  }}
                  style={{...styles.button, ...styles.warningButton}}
                >
                  Flag for review
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.summaryBox}>
          <strong>Summary:</strong> Found {currentPartyData.issues} issue(s) requiring tribunal attention.
          {currentPartyData.issues > 0 ? ' Conflicts between expert assumptions and witness testimony may affect credibility.' : ' All key assumptions are supported by witness evidence.'}
        </div>

        <div style={styles.buttonContainer}>
          <button onClick={() => setStep(4)} style={{...styles.button, ...styles.secondaryButton}}>← Back</button>
          <button onClick={() => setStep(6)} style={{...styles.button, ...styles.primaryButton}}>Audit Excel Models →</button>
        </div>
      </div>
    );
  };

  // Tab Navigation Component
  const TabNavigation = () => {
    if (!auditsComplete || step < 4) return null;

    const tabs = [
      { number: 4, label: 'Review Extraction', icon: '📋' },
      { number: 5, label: 'Witness Audit', icon: '🔍' },
      { number: 6, label: 'Excel Audit', icon: '📊' }
    ];

    return (
      <div style={styles.tabNavigation}>
        {tabs.map(tab => (
          <button
            key={tab.number}
            onClick={() => setStep(tab.number)}
            style={{
              ...styles.tabButton,
              ...(step === tab.number ? styles.tabButtonActive : {})
            }}
          >
            <span style={styles.tabIcon}>{tab.icon}</span>
            <span style={styles.tabLabel}>{tab.label}</span>
            {step === tab.number && <span style={styles.tabIndicator}>●</span>}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.app}>
      <div style={styles.topBar}>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <h1 style={styles.title}>QuantumLens - Extract</h1>
          <div style={styles.stepIndicator}>
            <span style={{color: '#fbbf24', fontWeight: '700'}}>Step {step} of 6</span>
            <span style={{color: '#64748b', margin: '0 8px'}}>|</span>
            <span>{stepNames[step - 1]}</span>
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <select
            aria-label="Demo case selector"
            onChange={(e) => {
              const k = e.target.value;
              if (!k) return;
              loadDemo(k);
            }}
            defaultValue=""
            style={{backgroundColor: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', padding: '8px', borderRadius: '6px'}}
          >
            <option value="">Load demo case…</option>
            <option value="lupaka">Lupaka Gold v. Peru (demo)</option>
            <option value="sample">Sample: Nova Mining (demo)</option>
          </select>
        </div>
      </div>

      <TabNavigation />

      {reviewNotification && (
        <div style={styles.notification}>
          {reviewNotification}
        </div>
      )}

      {step === 1 && <UploadScreen />}
      {step === 2 && <OrganizeScreen />}
      {step === 3 && <ProgressScreen />}
      {step === 4 && extractedData && <ReviewScreen />}
      {step === 5 && witnessAudit && <WitnessAuditScreen />}
      {step === 6 && excelAudit && <ExcelAuditScreen />}
    </div>
  );
};

const styles = {
  app: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', minHeight: '100vh', backgroundColor: '#0b1220', color: '#e6eef8', padding: '24px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', padding: '18px', backgroundColor: '#0f1726', borderRadius: '10px', borderBottom: '1px solid #273449', boxShadow: '0 6px 18px rgba(2,6,23,0.6)' },
  title: { margin: 0, fontSize: '26px', color: '#fbbf24', fontWeight: '700', letterSpacing: '0.4px' },
  stepIndicator: { fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'center' },
  // Tab Navigation Styles
  tabNavigation: { display: 'flex', gap: '12px', marginBottom: '24px', padding: '12px', backgroundColor: '#0f1726', borderRadius: '10px', border: '1px solid #273449' },
  tabButton: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
  tabButtonActive: { backgroundColor: '#0f172a', borderColor: '#fbbf24', color: '#fbbf24', boxShadow: '0 4px 12px rgba(251,191,36,0.2)' },
  tabIcon: { fontSize: '16px' },
  tabLabel: { fontSize: '13px' },
  tabIndicator: { fontSize: '8px', color: '#fbbf24', marginLeft: '4px' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '34px', backgroundColor: '#0f172a', borderRadius: '10px', boxShadow: '0 8px 28px rgba(2,6,23,0.6)' },
  header: { fontSize: '20px', marginBottom: '18px', color: '#ffffff', borderBottom: '2px solid rgba(251,191,36,0.14)', paddingBottom: '12px' },
  dropZone: { margin: '20px 0', position: 'relative' },
  fileInput: { display: 'none' },
  dropZoneLabel: { display: 'block', padding: '56px 20px', border: '2px dashed rgba(71,85,105,0.6)', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#07101a' },
  dropZoneIcon: { fontSize: '48px', marginBottom: '10px' },
  acceptedFormats: { marginTop: '10px', fontSize: '12px', color: '#94a3b8' },
  uploadedFilesContainer: { marginTop: '30px' },
  emptyState: { padding: '20px', textAlign: 'center', color: '#64748b', fontStyle: 'italic', border: '1px solid #334155', borderRadius: '4px' },
  fileList: { marginTop: '10px' },
  fileItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#071424', border: '1px solid #22303f', borderRadius: '6px', marginBottom: '8px' },
  removeBtn: { background: 'transparent', border: 'none', color: '#ff7b7b', fontSize: '18px', cursor: 'pointer', padding: '0 8px', lineHeight: 1 },
  buttonContainer: { display: 'flex', justifyContent: 'space-between', marginTop: '30px' },
  button: { padding: '12px 20px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 6px 12px rgba(2,6,23,0.5)' },
  primaryButton: { backgroundColor: '#fbbf24', color: '#0b1220', border: '1px solid rgba(0,0,0,0.08)' },
  secondaryButton: { backgroundColor: '#1f2a37', color: '#e6eef8', border: '1px solid #273449' },
  successButton: { backgroundColor: '#fbbf24', color: '#1e293b' },
  warningButton: { backgroundColor: '#d97706', color: '#ffffff' },
  partySection: { marginBottom: '30px' },
  partyHeader: { fontSize: '16px', color: '#fbbf24', marginBottom: '10px' },
  organizeBox: { padding: '20px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px' },
  documentCategory: { marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #334155' },
  categoryHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  categoryLabel: { fontSize: '13px', fontWeight: '600', color: '#fbbf24' },
  categoryHint: { fontSize: '11px', color: '#64748b', marginBottom: '10px', fontStyle: 'italic' },
  categoryCount: { fontSize: '11px', color: '#64748b', backgroundColor: '#1e293b', padding: '2px 8px', borderRadius: '12px' },
  fileNumber: { display: 'inline-block', minWidth: '24px', height: '24px', lineHeight: '24px', textAlign: 'center', backgroundColor: '#0f172a', color: '#fbbf24', borderRadius: '50%', fontSize: '11px', fontWeight: 'bold', marginRight: '8px' },
  assignedFile: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#0e2430', border: '1px solid #233344', borderRadius: '6px', marginBottom: '8px' },
  fileName: { fontSize: '13px', color: '#dbeafe' },
  dropZoneSmall: { marginTop: '6px' },
  selectFileSmall: { width: '100%', padding: '8px 10px', backgroundColor: '#0f172a', color: '#94a3b8', border: '1px solid #334155', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' },
  unassignedSection: { marginTop: '30px', padding: '20px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px' },
  unassignedHeader: { fontSize: '14px', color: '#64748b', marginBottom: '15px' },
  unassignedList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  unassignedFile: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px dashed #475569', borderRadius: '4px' },
  instructionBox: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', marginBottom: '20px' },
  instructionIcon: { fontSize: '20px' },
  instructionText: { fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' },
  progressContainer: { padding: '36px' },
  progressLabel: { marginBottom: '12px', fontSize: '16px', color: '#e6eef8' },
  progressBar: { width: '100%', height: '20px', backgroundColor: '#0f172a', borderRadius: '10px', overflow: 'hidden', marginBottom: '30px' },
  progressFill: { height: '100%', backgroundColor: '#fbbf24', transition: 'width 0.3s' },
  taskList: { marginTop: '20px' },
  taskItem: { padding: '10px', fontSize: '14px', color: '#cbd5e1' },
  timeEstimate: { marginTop: '30px', textAlign: 'center', color: '#64748b', fontStyle: 'italic' },
  comparisonTable: { marginTop: '20px', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px', backgroundColor: '#07101a', borderBottom: '2px solid rgba(251,191,36,0.12)', textAlign: 'left', fontWeight: '700', color: '#f1f5f9' },
  td: { padding: '12px 15px', borderBottom: '1px solid #1f2b38', color: '#dbeafe' },
  citationBtn: { marginLeft: '8px', padding: '3px 6px', backgroundColor: 'transparent', color: '#fbbf24', border: 'none', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' },
  citationLink: { color: '#fbbf24', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px', transition: 'color 0.2s', ':hover': { color: '#fcd34d' } },
  agree: { color: '#10b981', fontSize: '18px', fontWeight: 'bold' },
  disagree: { color: '#fbbf24', fontSize: '18px', fontWeight: 'bold' },
  legend: { marginTop: '15px', fontSize: '13px', color: '#94a3b8' },
  caseInfo: { marginBottom: '20px', padding: '16px', backgroundColor: '#07101a', borderRadius: '8px', fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1', border: '1px solid #22333f' },
  quantumGap: { marginTop: '20px', padding: '16px', backgroundColor: '#07101a', borderRadius: '8px', fontSize: '13px', lineHeight: '1.6', color: '#fbbf24', border: '1px solid #22333f' },
  alternativeRow: { backgroundColor: '#0f172a' },
  citationModal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '8px', maxWidth: '800px', width: '90%', maxHeight: '80vh', overflow: 'auto', position: 'relative', border: '1px solid #334155' },
  closeBtn: { position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '30px', cursor: 'pointer' },
  pdfPreview: { backgroundColor: '#0f172a', padding: '20px', borderRadius: '6px', border: '1px solid #334155', marginTop: '15px', marginBottom: '15px' },
  extractedContext: { lineHeight: '1.8', fontSize: '14px', color: '#cbd5e1' },
  highlighted: { backgroundColor: 'rgba(251, 191, 36, 0.2)', padding: '2px 4px', borderRadius: '2px', fontWeight: '500', color: '#ffffff' },
  confidence: { marginTop: '15px', fontSize: '13px', color: '#94a3b8' },
  modalActions: { display: 'flex', gap: '10px', marginTop: '20px' },
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    zIndex: 2000,
    animation: 'slideIn 0.3s ease-out'
  },
  // Witness Audit Styles
  auditDescription: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', marginBottom: '20px' },
  partySelector: { display: 'flex', gap: '10px', marginBottom: '20px' },
  partySelectorBtn: { flex: 1, padding: '12px 16px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  partySelectorActive: { backgroundColor: '#0f172a', borderColor: '#fbbf24', color: '#fbbf24' },
  issueBadge: { backgroundColor: '#ef4444', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' },
  assumptionsList: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' },
  assumptionCard: { backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '16px' },
  assumptionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' },
  assumptionTitle: { fontSize: '14px', fontWeight: '600', color: '#e2e8f0', flex: 1 },
  statusBadge: { padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap' },
  assumptionBody: { marginBottom: '10px' },
  sourceRow: { marginBottom: '8px', fontSize: '13px', lineHeight: '1.6' },
  sourceLabel: { color: '#94a3b8', fontWeight: '600', marginRight: '8px' },
  sourceText: { color: '#cbd5e1' },
  noteBox: { marginTop: '12px', padding: '10px', backgroundColor: '#1e293b', borderLeft: '3px solid #f59e0b', borderRadius: '4px', fontSize: '12px', color: '#cbd5e1' },
  confidenceBar: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' },
  summaryBox: { padding: '16px', backgroundColor: '#07101a', border: '1px solid #334155', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1' },
  // Excel Audit Styles
  issueCountBadge: { backgroundColor: '#334155', color: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'normal' },
  excelSummaryCard: { backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '16px', marginBottom: '20px' },
  excelFileName: { fontSize: '14px', fontWeight: '600', color: '#fbbf24', marginBottom: '12px' },
  excelStats: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  statItem: { display: 'flex', gap: '8px', alignItems: 'center' },
  statLabel: { fontSize: '12px', color: '#94a3b8' },
  statValue: { fontSize: '14px', fontWeight: '700', color: '#e2e8f0' },
  issuesList: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' },
  issueCard: { backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '16px' },
  issueHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '12px', flexWrap: 'wrap' },
  issueHeaderLeft: { display: 'flex', gap: '8px', alignItems: 'center' },
  severityBadge: { padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
  categoryBadge: { padding: '4px 10px', backgroundColor: '#1e293b', color: '#cbd5e1', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
  locationBadge: { padding: '4px 10px', backgroundColor: '#334155', color: '#e2e8f0', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' },
  issueBody: { display: 'flex', flexDirection: 'column', gap: '10px' },
  issueDescription: { fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' },
  issueImpact: { fontSize: '12px', color: '#cbd5e1', padding: '8px', backgroundColor: '#1e293b', borderRadius: '4px', borderLeft: '3px solid #f59e0b' },
  issueRecommendation: { fontSize: '12px', color: '#cbd5e1', padding: '8px', backgroundColor: '#1e293b', borderRadius: '4px', borderLeft: '3px solid #10b981' },
};

export default ExtractionInterface;
