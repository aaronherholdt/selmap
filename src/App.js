import React, { useState, useEffect } from 'react';
import './App.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [usStatesData, setUsStatesData] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [activeState, setActiveState] = useState(null);
  const MAX_SELECTIONS = 5;
  const [selectedOption, setSelectedOption] = useState({});
  const [showReflection, setShowReflection] = useState(false);
  const [reflections, setReflections] = useState({});
  const [scores, setScores] = useState({});
  const [currentDecisionState, setCurrentDecisionState] = useState(null);
  const [showDecisionView, setShowDecisionView] = useState(false);
  const [showFinalScores, setShowFinalScores] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [userScore, setUserScore] = useState(0);
  const [hoveredState, setHoveredState] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hideTimeout, setHideTimeout] = useState(null);
  const [statesConfirmed, setStatesConfirmed] = useState(false);
  const [stateCompletion, setStateCompletion] = useState({});

  // Only the 10 problem states
  const problemStates = {
    'California': {
      challenge: 'Economic Inequality',
      description: 'Rising costs of living and wage gaps are creating social division.'
    },
    'Texas': {
      challenge: 'Education Access',
      description: 'Rural areas lack adequate educational resources.'
    },
    'New York': {
      challenge: 'Environmental Issues',
      description: 'Urban pollution and climate change impacts affecting communities.'
    },
    'Florida': {
      challenge: 'Healthcare Access',
      description: 'Growing elderly population struggling with healthcare accessibility.'
    },
    'Illinois': {
      challenge: 'Public Transportation',
      description: 'Inadequate public transit systems affecting job accessibility.'
    },
    'Michigan': {
      challenge: 'Job Training',
      description: 'Workers need new skills for emerging industries.'
    },
    'Ohio': {
      challenge: 'Housing Crisis',
      description: 'Affordable housing shortage affecting families.'
    },
    'Georgia': {
      challenge: 'Digital Divide',
      description: 'Unequal access to internet and technology resources.'
    },
    'Washington': {
      challenge: 'Mental Health',
      description: 'Limited access to mental health services and support.'
    },
    'Colorado': {
      challenge: 'Water Resources',
      description: 'Managing water scarcity and distribution.'
    }
  };

  // Add decision options for all problem states
  const stateDecisions = {
    'California': {
      options: [
        {
          title: "Option 1",
          description: "Implement progressive taxation",
          stakeholders: {
            citizens: "Lower income families benefit from increased services",
            businesses: "May face higher tax burden",
            government: "Increased revenue for social programs"
          },
          outcome: "Reduced economic inequality but potential business resistance"
        },
        {
          title: "Option 2",
          description: "Focus on job training programs",
          stakeholders: {
            citizens: "Improved job prospects",
            businesses: "Access to skilled workforce",
            government: "Initial investment required"
          },
          outcome: "Long-term economic growth but delayed impact"
        },
        {
          title: "Option 3",
          description: "Public-private partnership",
          stakeholders: {
            citizens: "Mixed benefits depending on program success",
            businesses: "Tax incentives for participation",
            government: "Shared cost burden"
          },
          outcome: "Balanced approach with moderate impact"
        }
      ]
    },
    'Texas': {
      options: [
        {
          title: "Option 1",
          description: "Increase education funding",
          stakeholders: {
            citizens: "Better access to quality education",
            businesses: "Higher taxes to support funding",
            government: "Budget reallocation needed"
          },
          outcome: "Improved education access but increased costs"
        },
        {
          title: "Option 2",
          description: "Digital learning initiative",
          stakeholders: {
            citizens: "Flexible learning options",
            businesses: "New EdTech opportunities",
            government: "Infrastructure investment required"
          },
          outcome: "Modern education solution with technology challenges"
        },
        {
          title: "Option 3",
          description: "Public-private school partnerships",
          stakeholders: {
            citizens: "More school choices",
            businesses: "Investment opportunities",
            government: "Shared responsibility"
          },
          outcome: "Diverse education options with complex management"
        }
      ]
    },
    'Florida': {
      options: [
        {
          title: "Option 1",
          description: "Expand Medicare coverage",
          stakeholders: {
            citizens: "Better healthcare access",
            businesses: "Insurance cost impacts",
            government: "Increased healthcare spending"
          },
          outcome: "Improved healthcare access with budget implications"
        },
        {
          title: "Option 2",
          description: "Telemedicine expansion",
          stakeholders: {
            citizens: "Remote healthcare access",
            businesses: "New healthcare delivery options",
            government: "Digital infrastructure needs"
          },
          outcome: "Increased accessibility with technology adoption challenges"
        },
        {
          title: "Option 3",
          description: "Community health centers",
          stakeholders: {
            citizens: "Local healthcare options",
            businesses: "Local healthcare partnerships",
            government: "Distributed healthcare system"
          },
          outcome: "Better local access with implementation complexity"
        }
      ]
    },
    'New York': {
      options: [
        {
          title: "Option 1",
          description: "Green energy transition",
          stakeholders: {
            citizens: "Cleaner environment",
            businesses: "Adaptation costs",
            government: "Environmental policy changes"
          },
          outcome: "Environmental improvements with economic adjustments"
        },
        {
          title: "Option 2",
          description: "Public transport expansion",
          stakeholders: {
            citizens: "Better mobility",
            businesses: "Changed commuter patterns",
            government: "Infrastructure investment"
          },
          outcome: "Reduced emissions with high initial costs"
        },
        {
          title: "Option 3",
          description: "Building efficiency programs",
          stakeholders: {
            citizens: "Lower utility costs",
            businesses: "Renovation requirements",
            government: "Incentive program management"
          },
          outcome: "Energy savings with implementation challenges"
        }
      ]
    },
    'Illinois': {
      options: [
        {
          title: "Option 1",
          description: "Transit modernization",
          stakeholders: {
            citizens: "Improved commute times",
            businesses: "Better workforce access",
            government: "Major infrastructure investment"
          },
          outcome: "Better mobility with significant costs"
        },
        {
          title: "Option 2",
          description: "Regional transit integration",
          stakeholders: {
            citizens: "Seamless regional travel",
            businesses: "Expanded market access",
            government: "Complex coordination needed"
          },
          outcome: "Enhanced connectivity with administrative challenges"
        },
        {
          title: "Option 3",
          description: "Smart transit solutions",
          stakeholders: {
            citizens: "Real-time transit info",
            businesses: "Tech integration opportunities",
            government: "Digital infrastructure needs"
          },
          outcome: "Modern transit system with tech adoption challenges"
        }
      ]
    },
    'Michigan': {
      options: [
        {
          title: "Option 1",
          description: "Industry retraining program",
          stakeholders: {
            citizens: "New career opportunities",
            businesses: "Skilled workforce availability",
            government: "Training program costs"
          },
          outcome: "Improved employment prospects with initial investment period"
        },
        {
          title: "Option 2",
          description: "Technology sector incentives",
          stakeholders: {
            citizens: "High-tech job opportunities",
            businesses: "Tax benefits for new industries",
            government: "Revenue adjustments needed"
          },
          outcome: "Economic diversification but delayed returns"
        },
        {
          title: "Option 3",
          description: "Small business support",
          stakeholders: {
            citizens: "Local job creation",
            businesses: "Growth assistance",
            government: "Support program administration"
          },
          outcome: "Balanced local growth with moderate impact"
        }
      ]
    },
    'Ohio': {
      options: [
        {
          title: "Option 1",
          description: "Housing subsidy program",
          stakeholders: {
            citizens: "Increased housing accessibility",
            businesses: "Construction sector growth",
            government: "Subsidy program costs"
          },
          outcome: "Better housing access but budget impact"
        },
        {
          title: "Option 2",
          description: "Urban renewal initiative",
          stakeholders: {
            citizens: "Improved neighborhoods",
            businesses: "Development opportunities",
            government: "Infrastructure investment"
          },
          outcome: "Community improvement with long-term benefits"
        },
        {
          title: "Option 3",
          description: "Mixed-income development",
          stakeholders: {
            citizens: "Diverse housing options",
            businesses: "Retail opportunities",
            government: "Zoning management"
          },
          outcome: "Balanced community development"
        }
      ]
    },
    'Georgia': {
      options: [
        {
          title: "Option 1",
          description: "Rural broadband expansion",
          stakeholders: {
            citizens: "Better internet access",
            businesses: "Expanded market reach",
            government: "Infrastructure costs"
          },
          outcome: "Improved connectivity with significant investment"
        },
        {
          title: "Option 2",
          description: "Digital literacy programs",
          stakeholders: {
            citizens: "Enhanced tech skills",
            businesses: "Skilled workforce",
            government: "Program administration"
          },
          outcome: "Better digital inclusion but requires ongoing support"
        },
        {
          title: "Option 3",
          description: "Tech hub development",
          stakeholders: {
            citizens: "Job opportunities",
            businesses: "Innovation ecosystem",
            government: "Development coordination"
          },
          outcome: "Economic growth with urban-rural divide challenges"
        }
      ]
    },
    'Washington': {
      options: [
        {
          title: "Option 1",
          description: "Mental health facilities",
          stakeholders: {
            citizens: "Better care access",
            businesses: "Healthcare sector growth",
            government: "Facility management"
          },
          outcome: "Improved mental health services with ongoing costs"
        },
        {
          title: "Option 2",
          description: "Telehealth expansion",
          stakeholders: {
            citizens: "Remote care access",
            businesses: "Digital health opportunities",
            government: "Regulatory oversight"
          },
          outcome: "Wider service reach with technology adoption challenges"
        },
        {
          title: "Option 3",
          description: "Community care centers",
          stakeholders: {
            citizens: "Local support access",
            businesses: "Service partnerships",
            government: "Distributed care management"
          },
          outcome: "Better local support with coordination needs"
        }
      ]
    },
    'Colorado': {
      options: [
        {
          title: "Option 1",
          description: "Water conservation program",
          stakeholders: {
            citizens: "Sustainable water access",
            businesses: "Usage restrictions",
            government: "Program enforcement"
          },
          outcome: "Better resource management with adaptation period"
        },
        {
          title: "Option 2",
          description: "Infrastructure modernization",
          stakeholders: {
            citizens: "Improved water delivery",
            businesses: "Construction opportunities",
            government: "Major investment needed"
          },
          outcome: "Long-term efficiency with high initial costs"
        },
        {
          title: "Option 3",
          description: "Water rights reform",
          stakeholders: {
            citizens: "Fair access policies",
            businesses: "Usage adjustments",
            government: "Policy administration"
          },
          outcome: "Equitable distribution with stakeholder challenges"
        }
      ]
    }
  };

  const emotions = {
    stakeholders: [
      { emoji: "😡", label: "Angry", score: 1, description: "Strong negative reaction" },
      { emoji: "😤", label: "Frustrated", score: 2, description: "Feeling blocked or hindered" },
      { emoji: "😟", label: "Worried", score: 3, description: "Concerned about impacts" },
      { emoji: "😕", label: "Confused", score: 4, description: "Unsure about changes" },
      { emoji: "😐", label: "Neutral", score: 5, description: "Neither positive nor negative" },
      { emoji: "🤔", label: "Thoughtful", score: 6, description: "Considering implications" },
      { emoji: "🙂", label: "Optimistic", score: 7, description: "Positive about changes" },
      { emoji: "😊", label: "Happy", score: 8, description: "Pleased with decision" },
      { emoji: "🤝", label: "Cooperative", score: 9, description: "Ready to work together" },
      { emoji: "🌟", label: "Inspired", score: 10, description: "Excited about possibilities" }
    ],
    personal: [
      { emoji: "😰", label: "Overwhelmed", score: 1, description: "Finding decision too difficult" },
      { emoji: "😣", label: "Pressured", score: 2, description: "Feeling stressed about choice" },
      { emoji: "😬", label: "Uncertain", score: 3, description: "Not fully confident" },
      { emoji: "🤨", label: "Skeptical", score: 4, description: "Questioning impact" },
      { emoji: "😐", label: "Reserved", score: 5, description: "Taking neutral stance" },
      { emoji: "🤔", label: "Analytical", score: 6, description: "Thinking carefully" },
      { emoji: "🤗", label: "Caring", score: 7, description: "Considering others" },
      { emoji: "😌", label: "Confident", score: 8, description: "Sure about decision" },
      { emoji: "💪", label: "Empowered", score: 9, description: "Ready to act" },
      { emoji: "🦸", label: "Leadership", score: 10, description: "Taking responsibility" }
    ]
  };

  useEffect(() => {
    const stateFiles = [
      'alabama.json', 'alaska.json', 'arizona.json', 'arkansas.json',
      'california.json', 'colorado.json', 'connecticut.json', 'delaware.json',
      'florida.json', 'georgia.json', 'idaho.json',
      'illinois.json', 'indiana.json', 'iowa.json', 'kansas.json',
      'kentucky.json', 'louisiana.json', 'maine.json', 'maryland.json',
      'massachusetts.json', 'michigan.json', 'minnesota.json', 'mississippi.json',
      'missouri.json', 'montana.json', 'nebraska.json', 'nevada.json',
      'new_hampshire.json', 'new_jersey.json', 'new_mexico.json', 'new_york.json',
      'north_carolina.json', 'north_dakota.json', 'ohio.json', 'oklahoma.json',
      'oregon.json', 'pennsylvania.json', 'rhode_island.json', 'south_carolina.json',
      'south_dakota.json', 'tennessee.json', 'texas.json', 'utah.json',
      'vermont.json', 'virginia.json', 'washington.json', 'west_virginia.json',
      'wisconsin.json', 'wyoming.json'
    ];

    Promise.all(
      stateFiles.map(file =>
        fetch(`/geojson/usa/${file}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load ${file}`);
            }
            return response.json();
          })
          .then(data => {
            // Extract state name from filename
            const stateName = file.replace('.json', '')
                                .split('_')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');
            return {
              type: "Feature",
              properties: { name: stateName },
              geometry: data.geometry || data
            };
          })
          .catch(err => {
            console.error(`Error loading ${file}:`, err);
            return null;
          })
      )
    )
    .then(data => {
      const validData = data.filter(state => state !== null);
      console.log('Processed states:', validData); // Debug log
      setUsStatesData(validData);
    })
    .catch(err => {
      console.error('Error loading GeoJSON files:', err);
    });
  }, []);

  const getStateStyle = (feature) => {
    const stateName = feature.properties.name;
    
    // Only style problem states and selected states
    if (!problemStates[stateName]) {
      return {
        fillOpacity: 0,
        stroke: false,
        interactive: false
      };
    }
    
    if (selectedStates.includes(stateName)) {
      return {
        color: '#2563eb',
        weight: 3,
        fillColor: '#3b82f6',
        fillOpacity: 0.8,
        cursor: 'pointer'
      };
    }
    
    return {
      color: '#FF0000',
      weight: activeState === stateName ? 4 : 3,
      fillColor: '#FF9800',
      fillOpacity: activeState === stateName ? 0.8 : 0.6,
      cursor: 'pointer'
    };
  };

  const handleStateClick = (stateName) => {
    if (statesConfirmed) return; // Prevent changes after confirmation
    
    if (selectedStates.includes(stateName)) {
      setSelectedStates(prev => prev.filter(s => s !== stateName));
    } else if (selectedStates.length < MAX_SELECTIONS) {
      setSelectedStates(prev => [...prev, stateName]);
    }
    setHoveredState(null);
  };

  const handleSelectState = () => {
    if (activeState && selectedStates.length < MAX_SELECTIONS) {
      setSelectedStates(prev => [...prev, activeState]);
      setActiveState(null);
    }
  };

  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.name;
    
    // Only add interactions for problem states
    if (!problemStates[stateName]) {
      return;
    }
    
    layer.on({
      mouseover: (e) => {
        if (!selectedStates.includes(stateName)) {
          if (hideTimeout) clearTimeout(hideTimeout);
          const layer = e.target;
          layer.setStyle({
            fillOpacity: 0.8,
            weight: 4
          });
          setHoveredState(feature);
          setMousePosition({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
        }
      },
      mouseout: (e) => {
        if (!selectedStates.includes(stateName)) {
          const layer = e.target;
          layer.setStyle(getStateStyle(feature));
          const timeout = setTimeout(() => {
            setHoveredState(null);
          }, 300);
          setHideTimeout(timeout);
        }
      },
      click: () => {
        if (!selectedStates.includes(stateName)) {
          handleStateClick(stateName);
        }
      }
    });
  };

  const handleOptionSelect = (stateName, option) => {
    setSelectedOption({
      ...selectedOption,
      [stateName]: option
    });
    setShowReflection(true);
  };

  const calculateScore = (stateName) => {
    if (!reflections[stateName]) return 0;
    
    const stakeholderScores = ['citizens', 'businesses', 'government'].map(stakeholder => {
      const emotion = emotions.stakeholders.find(e => e.emoji === reflections[stateName][stakeholder]);
      return emotion ? emotion.score : 0;
    });

    const personalEmotion = emotions.personal.find(e => e.emoji === reflections[stateName].personal);
    const personalScore = personalEmotion ? personalEmotion.score : 0;

    // Average of stakeholder scores (60%) and personal reflection score (40%)
    const avgStakeholderScore = stakeholderScores.reduce((a, b) => a + b, 0) / stakeholderScores.length;
    const totalScore = (avgStakeholderScore * 0.6) + (personalScore * 0.4);

    return Math.round(totalScore);
  };

  const getScoreFeedback = (score) => {
    if (score >= 9) return "Excellent emotional intelligence! You're considering multiple perspectives deeply.";
    if (score >= 7) return "Good understanding of stakeholder emotions and impacts.";
    if (score >= 5) return "You're developing awareness of different viewpoints.";
    return "Consider how different groups might feel about this decision.";
  };

  // Add hint system
  const getHints = (stateName, score) => {
    const hints = {
      lowScore: {
        citizens: "Try considering how this decision affects families and communities in the long term.",
        businesses: "Think about both immediate and future economic impacts.",
        government: "Consider the broader policy implications and resource requirements.",
        personal: "Reflect on the responsibility of making decisions that affect many lives."
      },
      mediumScore: {
        citizens: "You're considering the public impact - what about specific community groups?",
        businesses: "Good economic thinking - also consider smaller businesses.",
        government: "Nice policy awareness - think about implementation challenges.",
        personal: "You're showing leadership - keep building on that empathy."
      }
    };

    if (score < 5) return hints.lowScore;
    if (score < 7) return hints.mediumScore;
    return null;
  };

  // Modify handleEmotionSelect to provide gentler feedback
  const handleEmotionSelect = (stateName, stakeholder, emotion) => {
    setReflections(prev => {
      const newReflections = {
        ...prev,
        [stateName]: {
          ...prev[stateName],
          [stakeholder]: emotion
        }
      };
      
      if (newReflections[stateName]?.citizens && 
          newReflections[stateName]?.businesses && 
          newReflections[stateName]?.government && 
          newReflections[stateName]?.personal) {
        const score = calculateScore(stateName);
        const hints = getHints(stateName, score);
        
        setScores(prev => ({
          ...prev,
          [stateName]: {
            score: score,
            hints: hints,
            attempts: (prev[stateName]?.attempts || 0) + 1
          }
        }));

        if (!scores[stateName]) {
          setUserScore(prev => prev + score);
        }

        // Show encouraging feedback based on attempts
        if (score < 7) {
          const feedback = scores[stateName]?.attempts > 1 
            ? "You're getting closer! Consider these aspects..."
            : "Good start! Here are some things to think about...";
          
          setStateCompletion(prev => ({
            ...prev,
            [stateName]: {
              completed: true,
              needsRevision: true,
              feedback: feedback
            }
          }));
        } else {
          setStateCompletion(prev => ({
            ...prev,
            [stateName]: {
              completed: true,
              needsRevision: false,
              feedback: "Excellent perspective-taking!"
            }
          }));
        }
      }
      
      return newReflections;
    });
  };

  // Modify ReflectionPanel to show gentle hints
  const ReflectionPanel = ({ stateName }) => (
    <div className="reflection-panel">
      <h3>Reflect on Your Decision</h3>
      
      <div className="reflection-section">
        <h4>How do you think each group feels about this decision?</h4>
        
        <div className="stakeholder-emotions">
          {['citizens', 'businesses', 'government'].map(stakeholder => (
            <div key={stakeholder} className="stakeholder-group">
              <h5>{stakeholder.charAt(0).toUpperCase() + stakeholder.slice(1)}</h5>
              <div className="emotion-buttons">
                {emotions.stakeholders.map(emotion => (
                  <button
                    key={emotion.label}
                    className={`emotion-btn ${reflections[stateName]?.[stakeholder] === emotion.emoji ? 'selected' : ''}`}
                    onClick={() => handleEmotionSelect(stateName, stakeholder, emotion.emoji)}
                    title={`${emotion.label}: ${emotion.description}`}
                  >
                    {emotion.emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="reflection-section">
        <h4>How do you feel about making this decision?</h4>
        <div className="emotion-buttons">
          {emotions.personal.map(emotion => (
            <button
              key={emotion.label}
              className={`emotion-btn ${reflections[stateName]?.personal === emotion.emoji ? 'selected' : ''}`}
              onClick={() => handleEmotionSelect(stateName, 'personal', emotion.emoji)}
              title={`${emotion.label}: ${emotion.description}`}
            >
              {emotion.emoji}
            </button>
          ))}
        </div>
      </div>

      {scores[stateName] && (
        <div className="score-feedback">
          <h4>Emotional Intelligence Score: {scores[stateName]}/10</h4>
          <p>{getScoreFeedback(scores[stateName])}</p>
        </div>
      )}

      {scores[stateName]?.hints && (
        <div className="hints-container">
          <p className="hint-header">{stateCompletion[stateName].feedback}</p>
          {Object.entries(scores[stateName].hints).map(([stakeholder, hint]) => (
            <div key={stakeholder} className="hint-item">
              <p>{hint}</p>
            </div>
          ))}
        </div>
      )}

      <button 
        className="continue-btn"
        onClick={() => setShowReflection(false)}
        disabled={!reflections[stateName]?.citizens || 
                 !reflections[stateName]?.businesses || 
                 !reflections[stateName]?.government || 
                 !reflections[stateName]?.personal}
      >
        Continue
      </button>
    </div>
  );

  const renderOptionCard = (option, index, stateName) => (
    <div key={index} className="option-card">
      <h4>{option.title}</h4>
      <p>{option.description}</p>
      <h5>Impact on Stakeholders:</h5>
      <ul>
        <li><strong>Citizens:</strong> {option.stakeholders.citizens}</li>
        <li><strong>Businesses:</strong> {option.stakeholders.businesses}</li>
        <li><strong>Government:</strong> {option.stakeholders.government}</li>
      </ul>
      <button 
        className="select-option-btn"
        onClick={() => handleOptionSelect(stateName, option)}
      >
        Choose This Option
      </button>
    </div>
  );

  const handleMakeDecision = (stateName) => {
    setCurrentDecisionState(stateName);
    setShowDecisionView(true);
  };

  const handleBack = () => {
    if (showReflection) {
      setShowReflection(false);
    } else if (currentDecisionState) {
      setCurrentDecisionState(null);
      setShowDecisionView(false);
    }
  };

  // Modify handleFinalize for gentler revision suggestions
  const handleFinalize = () => {
    if (areAllStatesComplete()) {
      const statesNeedingRevision = selectedStates.filter(
        state => stateCompletion[state].needsRevision
      );
      
      if (statesNeedingRevision.length > 0) {
        const message = statesNeedingRevision.length === 1
          ? "You're doing great! Just one more state to refine."
          : `You're making good progress! A few states could use another look.`;
        
        alert(`${message}\n\nTip: Take your time to consider different perspectives.`);
      } else {
        setShowFinalScores(true);
      }
    } else {
      alert("Keep going! You're making good decisions for each state.");
    }
  };

  const DecisionView = () => (
    <div className="decision-view">
      <div className="decision-header">
        <button className="back-btn" onClick={handleBack}>
          ← Back to States
        </button>
        <h2>{currentDecisionState}</h2>
      </div>

      {!showReflection ? (
        <div className="state-decision-container">
          <h3>{problemStates[currentDecisionState].challenge}</h3>
          <p>{problemStates[currentDecisionState].description}</p>
          <div className="options-container">
            {stateDecisions[currentDecisionState].options.map((option, index) => 
              renderOptionCard(option, index, currentDecisionState)
            )}
          </div>
        </div>
      ) : (
        <div className="reflection-container">
          <ReflectionPanel stateName={currentDecisionState} />
        </div>
      )}
    </div>
  );

  const FinalScoresView = () => (
    <div className="final-scores-view">
      <h2>Your Decision-Making Results</h2>
      <div className="scores-grid">
        {selectedStates.map(state => (
          <div key={state} className="state-score-card">
            <h3>{state}</h3>
            <p>Score: {scores[state]}/10</p>
            <p>{getScoreFeedback(scores[state])}</p>
          </div>
        ))}
      </div>
      <div className="overall-score">
        <h3>Overall Emotional Intelligence Score</h3>
        <p>{calculateOverallScore()}/10</p>
        <button className="revise-btn" onClick={() => setShowFinalScores(false)}>
          Revise Decisions
        </button>
      </div>
    </div>
  );

  const calculateOverallScore = () => {
    const stateScores = selectedStates.map(state => scores[state] || 0);
    const averageScore = stateScores.reduce((a, b) => a + b, 0) / stateScores.length;
    return Math.round(averageScore);
  };

  const IntroScreen = () => (
    <div className="intro-screen">
      <div className="intro-header">
        <div className="animated-title">
          <h1>
            <span className="emoji-bounce">🎓</span>
            Presidential Decision Maker
            <span className="emoji-bounce">🌟</span>
          </h1>
          <p className="subtitle">Your Journey to Becoming a Master Decision Maker!</p>
        </div>
      </div>

      <div className="intro-content">
        <div className="mission-card">
          <div className="card-header">
            <span className="emoji-pulse">��</span>
            <h2>Your Epic Mission</h2>
          </div>
          <p>
            Get ready to step into the shoes of a presidential advisor! 
            You'll tackle real challenges, make big decisions, and see how 
            your choices shape the future of different states.
          </p>
        </div>

        <div className="adventure-steps">
          <h2>Your Adventure Path <span className="emoji-walk">🚶‍♂️</span></h2>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <span className="emoji-float">🗺️</span>
              <h3>Choose Your States</h3>
              <p>Pick 5 states that need your help!</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <span className="emoji-float">🤔</span>
              <h3>Solve Challenges</h3>
              <p>Face exciting problems and find solutions!</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <span className="emoji-float">❤️</span>
              <h3>Show Empathy</h3>
              <p>Understand how people feel!</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <span className="emoji-float">🏆</span>
              <h3>Earn Points</h3>
              <p>Become an emotion expert!</p>
            </div>
          </div>
        </div>

        <div className="superpowers-section">
          <h2>Superpowers You'll Gain! <span className="emoji-pulse">💪</span></h2>
          <div className="superpowers-grid">
            <div className="superpower-card">
              <span className="emoji-spin">🤝</span>
              <h3>People Power</h3>
              <p>Understand different viewpoints</p>
            </div>
            <div className="superpower-card">
              <span className="emoji-spin">🧠</span>
              <h3>Smart Thinking</h3>
              <p>Solve tricky problems</p>
            </div>
            <div className="superpower-card">
              <span className="emoji-spin">❤️</span>
              <h3>Heart Skills</h3>
              <p>Feel what others feel</p>
            </div>
            <div className="superpower-card">
              <span className="emoji-spin">🎯</span>
              <h3>Decision Master</h3>
              <p>Make awesome choices</p>
            </div>
          </div>
        </div>

        <button 
          className="start-adventure-btn"
          onClick={() => setShowIntro(false)}
        >
          <span className="btn-text">Start Your Adventure!</span>
          <span className="emoji-bounce">🚀</span>
        </button>
      </div>
    </div>
  );

  const ScoreDisplay = () => (
    <div className="score-banner">
      <div className="stars">{'⭐'.repeat(Math.floor(userScore/20))}</div>
      <div className="score">Score: {userScore}</div>
    </div>
  );

  const canMakeDecisions = () => {
    return selectedStates.length >= 5;
  };

  // Add confirmation handler
  const handleConfirmStates = () => {
    if (selectedStates.length === MAX_SELECTIONS) {
      setStatesConfirmed(true);
    }
  };

  const areAllStatesComplete = () => {
    return selectedStates.every(state => stateCompletion[state]?.completed);
  };

  return (
    <div className="App">
      {showIntro ? (
        <IntroScreen />
      ) : (
        !showDecisionView && !showFinalScores && (
          <>
            <div className="header">
              <h1>Presidential Decision Making</h1>
              <div className="selection-counter" role="status" aria-live="polite">
                States Selected: {selectedStates.length} / {MAX_SELECTIONS}
              </div>
            </div>

            <div className="map-container">
              <MapContainer
                center={[39.8283, -98.5795]}
                zoom={4}
                style={{ height: "600px", width: "100%" }}
                scrollWheelZoom={false}
                maxBounds={new LatLngBounds(
                  [24.396308, -125.0],
                  [49.384358, -66.93457]
                )}
                maxBoundsViscosity={1.0}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {usStatesData.map((stateData, index) => (
                  <GeoJSON
                    key={`state-${index}`}
                    data={stateData}
                    style={getStateStyle}
                    onEachFeature={onEachFeature}
                  />
                ))}
              </MapContainer>

              <div className="map-legend">
                <h3>Legend</h3>
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#FF9800'}}></span>
                  <span>Available States</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#3b82f6'}}></span>
                  <span>Selected States</span>
                </div>
              </div>
            </div>

            {selectedStates.length > 0 && (
              <div className="selected-states-grid">
                {selectedStates.map(stateName => (
                  <div key={stateName} className="state-card">
                    <div className="state-card-header">
                      <h3>{stateName}</h3>
                      <div className="header-controls">
                        {stateCompletion[stateName]?.completed && (
                          <div className="completion-badge">
                            Score: {scores[stateName]}/10
                            {stateCompletion[stateName].needsRevision && 
                              <span className="revision-needed">Needs Revision</span>
                            }
                          </div>
                        )}
                        <button 
                          className="remove-state-btn"
                          onClick={() => handleStateClick(stateName)}
                          disabled={statesConfirmed}
                          aria-label={`Remove ${stateName}`}
                          style={{
                            opacity: statesConfirmed ? 0.5 : 1,
                            cursor: statesConfirmed ? 'not-allowed' : 'pointer'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <p>{problemStates[stateName].challenge}</p>
                    <button 
                      className="make-decision-btn"
                      onClick={() => handleMakeDecision(stateName)}
                      disabled={selectedStates.length < MAX_SELECTIONS && !stateCompletion[stateName]?.completed}
                    >
                      {stateCompletion[stateName]?.completed ? 
                        (stateCompletion[stateName].needsRevision ? 'Retry Decision' : 'Review Decision') : 
                        'Make Decision'
                      }
                    </button>
                  </div>
                ))}
                
                {selectedStates.length === MAX_SELECTIONS && !statesConfirmed && (
                  <div className="confirmation-container">
                    <button 
                      className="confirm-states-btn"
                      onClick={handleConfirmStates}
                      aria-label="Confirm selected states"
                    >
                      Confirm State Choices
                    </button>
                    <p className="confirmation-note">
                      Note: Once confirmed, you cannot change your state selections
                    </p>
                  </div>
                )}

                {statesConfirmed && (
                  <button 
                    className="finalize-btn"
                    onClick={handleFinalize}
                    aria-label="Review all decisions"
                  >
                    Review All Decisions
                  </button>
                )}
              </div>
            )}
          </>
        )
      )}

      {showDecisionView && <DecisionView />}
      {showFinalScores && <FinalScoresView />}

      {activeState && !selectedStates.includes(activeState) && (
        <div className="state-panel">
          <h2>{activeState}</h2>
          <h3>{problemStates[activeState].challenge}</h3>
          <p>{problemStates[activeState].description}</p>
          <button 
            onClick={handleSelectState}
            disabled={selectedStates.length >= MAX_SELECTIONS}
          >
            Select This State
          </button>
        </div>
      )}

      <ScoreDisplay />

      {hoveredState && (
        <div 
          className="state-popup"
          style={{
            position: 'fixed',
            left: `${mousePosition.x + 10}px`,
            top: `${mousePosition.y + 10}px`,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '10px',
            zIndex: 9999,
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={() => {
            if (hideTimeout) clearTimeout(hideTimeout);
          }}
          onMouseLeave={() => {
            setHoveredState(null);
          }}
        >
          <h4>{hoveredState.properties.name}</h4>
          {problemStates[hoveredState.properties.name] ? (
            <>
              <p><strong>{problemStates[hoveredState.properties.name].challenge}</strong></p>
              <p>{problemStates[hoveredState.properties.name].description}</p>
            </>
          ) : (
            <p>This state has no current challenges to address.</p>
          )}
        </div>
      )}

      {!canMakeDecisions() && (
        <div className="requirement-message">
          Please select at least 5 states to begin making decisions
        </div>
      )}

      {canMakeDecisions() && (
        <div className="decision-buttons">
          {/* Your decision-related buttons/components */}
        </div>
      )}
    </div>
  );
};

export default App; 