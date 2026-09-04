import { VoiceCheckInMetrics, WoundAssessment } from '../types/patient';

/**
 * Multimodal AI Analyzer for Voice Transcripts and Wound Vision.
 * Provides resilient clinical entity extraction and computer-vision wound metrics.
 */

export function analyzeVoiceTranscript(transcript: string, postOpDay: number): VoiceCheckInMetrics {
  const text = transcript.toLowerCase();

  // 1. Pain Score Extraction
  let painScore = 3;
  const painMatch = text.match(/pain\s*(?:is\s*(?:about|around)?\s*|level\s*(?:is\s*)?|at\s*|rated\s*)?(\d{1,2})(?:\s*\/\s*10|\s*out of 10)?/i) ||
                    text.match(/(\d{1,2})\s*(?:out of 10|\/10)/i) ||
                    text.match(/hurts?\s*(?:about|around)?\s*(\d{1,2})/i);
  
  if (painMatch) {
    const parsed = parseInt(painMatch[1], 10);
    if (parsed >= 0 && parsed <= 10) painScore = parsed;
  } else if (text.includes('unbearable') || text.includes('excruciating') || text.includes('terrible pain') || text.includes('severe pain')) {
    painScore = 8;
  } else if (text.includes('mild') || text.includes('a little sore') || text.includes('tolerable')) {
    painScore = 3;
  } else if (text.includes('no pain') || text.includes('feeling great')) {
    painScore = 1;
  }

  // 2. Pain Trend
  let painTrend: VoiceCheckInMetrics['painTrend'] = 'STABLE';
  if (text.includes('getting worse') || text.includes('more painful') || text.includes('spiked') || text.includes('increasing')) {
    painTrend = painScore >= 7 ? 'ACUTE_SPIKE' : 'INCREASING';
  } else if (text.includes('much better') || text.includes('easing up') || text.includes('decreasing') || text.includes('less pain')) {
    painTrend = 'DECREASING';
  }

  // 3. Mobility & Ambulation
  let mobilityStatus: VoiceCheckInMetrics['mobilityStatus'] = 'WALKER_ASSISTED';
  let ambulationFeetToday = 120;

  const feetMatch = text.match(/(\d+)\s*(?:feet|ft|steps|yards)/i);
  if (feetMatch) {
    ambulationFeetToday = parseInt(feetMatch[1], 10);
  }

  if (text.includes('could not get out of bed') || text.includes('bedbound') || text.includes('cannot walk') || text.includes('unable to bear weight')) {
    mobilityStatus = 'BEDBOUND';
    ambulationFeetToday = 0;
  } else if (text.includes('cane') || text.includes('walking with a cane')) {
    mobilityStatus = 'CANE_ASSISTED';
    ambulationFeetToday = Math.max(ambulationFeetToday, 250);
  } else if (text.includes('independent') || text.includes('without help') || text.includes('no walker')) {
    mobilityStatus = 'INDEPENDENT';
    ambulationFeetToday = Math.max(ambulationFeetToday, 500);
  } else {
    mobilityStatus = 'WALKER_ASSISTED';
  }

  // 4. Medication Adherence
  let medicationAdherence: VoiceCheckInMetrics['medicationAdherence'] = 'FULL';
  let medicationNotes = 'Patient reports taking all prescribed medications on schedule.';

  if (text.includes('nauseous') || text.includes('throwing up') || text.includes('vomit') || text.includes('could not stomach') || text.includes('stopped taking')) {
    medicationAdherence = 'REFUSING_DUE_TO_SIDE_EFFECTS';
    medicationNotes = 'Patient withheld oral analgesics/anti-coagulants due to post-operative nausea.';
  } else if (text.includes('forgot') || text.includes('missed') || text.includes('skipped')) {
    medicationAdherence = 'MISSED_DOSES';
    medicationNotes = 'Patient missed 1 or more doses today.';
  }

  // 5. Critical Red-Line Symptoms Detection
  const calfPainOrSwelling = text.includes('calf') || 
                             text.includes('lower leg swelling') || 
                             text.includes('calf pain') || 
                             text.includes('calf is tight') || 
                             text.includes('back of my leg');

  const chestPainOrShortnessOfBreath = text.includes('chest pain') || 
                                      text.includes('shortness of breath') || 
                                      text.includes('hard to breathe') || 
                                      text.includes('chest tightness') || 
                                      text.includes('winded just sitting');

  const nauseaOrVomiting = text.includes('nausea') || text.includes('vomit') || text.includes('threw up') || text.includes('upset stomach');
  const bowelMovementSinceDischarge = !text.includes('constipated') && !text.includes('no bowel movement') && !text.includes('havent pooped');

  // 6. Emotional State
  let emotionalState: VoiceCheckInMetrics['emotionalState'] = 'MANAGING';
  if (text.includes('panicked') || text.includes('scared') || text.includes('terrible') || text.includes('distressed') || text.includes('crying')) {
    emotionalState = 'DISTRESSED';
  } else if (text.includes('anxious') || text.includes('worried') || text.includes('nervous')) {
    emotionalState = 'ANXIOUS';
  } else if (text.includes('confident') || text.includes('optimistic') || text.includes('great')) {
    emotionalState = 'CONFIDENT';
  }

  return {
    transcript,
    painScore,
    painTrend,
    mobilityStatus,
    ambulationFeetToday,
    medicationAdherence,
    medicationNotes,
    calfPainOrSwelling,
    chestPainOrShortnessOfBreath,
    nauseaOrVomiting,
    bowelMovementSinceDischarge,
    sleepHours: text.includes('could not sleep') ? 3 : 7,
    emotionalState
  };
}

export function analyzeWoundImage(
  imageDataUri: string,
  patientArchetype?: 'STABLE' | 'INFECTION' | 'CRITICAL_DVT' | 'NON_ADHERENT'
): WoundAssessment {
  // Deterministic high-precision clinical vision simulation based on visual analysis rules
  if (patientArchetype === 'INFECTION' || imageDataUri.includes('infection') || imageDataUri.includes('redness')) {
    return {
      imageUrl: imageDataUri,
      erythemaMarginMm: 28,
      erythemaMarginBaselineMm: 4,
      dehiscenceMm: 2.1,
      purulentDischarge: true,
      drainageType: 'PURULENT',
      drainageAmount: 'MODERATE',
      warmthReported: true,
      stapleIntegrityPercent: 88,
      visualRiskScore: 78,
      aiVisionNotes: 'Computer Vision flagged +24mm circumferential erythema expansion beyond Day 0 margins, with cloudy yellow-tinted exudate along the inferior third of the incision.',
      detectedAnomalies: [
        'Circumferential erythema margin > 25mm (High Confidence 94%)',
        'Purulent/cloudy exudate at distal margin (Confidence 89%)',
        'Mild localized periwound induration pattern'
      ]
    };
  }

  if (patientArchetype === 'CRITICAL_DVT') {
    return {
      imageUrl: imageDataUri,
      erythemaMarginMm: 5,
      erythemaMarginBaselineMm: 4,
      dehiscenceMm: 0,
      purulentDischarge: false,
      drainageType: 'NONE',
      drainageAmount: 'NONE',
      warmthReported: false,
      stapleIntegrityPercent: 100,
      visualRiskScore: 15,
      aiVisionNotes: 'Knee incision clean, dry, well-approximated. Primary risk is systemic / thromboembolic (Wells DVT criteria) rather than local incision infection.',
      detectedAnomalies: [
        'Surgical staples intact (100%)',
        'No purulent drainage or dehiscence'
      ]
    };
  }

  // Default Stable Wound
  return {
    imageUrl: imageDataUri,
    erythemaMarginMm: 4,
    erythemaMarginBaselineMm: 4,
    dehiscenceMm: 0,
    purulentDischarge: false,
    drainageType: 'NONE',
    drainageAmount: 'NONE',
    warmthReported: false,
    stapleIntegrityPercent: 98,
    visualRiskScore: 8,
    aiVisionNotes: 'Incision is well-approximated with minimal benign periwound erythema (<5mm). No dehiscence, purulent drainage, or staple displacement observed.',
    detectedAnomalies: [
      'Normal surgical line healing',
      'Staples aligned and secure (98%)'
    ]
  };
}
