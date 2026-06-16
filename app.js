/* ============================================================
   Telco AI Director — Interactive Microsite
   Pure vanilla JS • No dependencies • file:// compatible
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // 1. SLIDE ENGINE
  // ----------------------------------------------------------
  let currentSlide = 0;
  const totalSlides = 6;

  const slides        = document.querySelectorAll('.slide');
  const dots          = document.querySelectorAll('.nav__dot');
  const prevBtn       = document.querySelector('.nav__arrow--prev');
  const nextBtn       = document.querySelector('.nav__arrow--next');

  function goToSlide(index) {
    if (index < 0 || index >= totalSlides || index === currentSlide) return;

    const outgoing = slides[currentSlide];
    const incoming = slides[index];

    // Remove active, add exit animation
    outgoing.classList.remove('active');
    outgoing.classList.add('exit-left');

    // Clean up exit class after transition
    setTimeout(function () {
      outgoing.classList.remove('exit-left');
    }, 600);

    // Small delay so CSS can pick up the transition
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        incoming.classList.add('active');
      });
    });

    // Update dots
    dots.forEach(function (d) { d.classList.remove('active'); });
    if (dots[index]) dots[index].classList.add('active');

    currentSlide = index;
    onSlideEnter(index);
  }

  // Arrow buttons
  if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(currentSlide - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(currentSlide + 1); });

  // Dot navigation
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var target = parseInt(this.getAttribute('data-target'), 10);
      if (!isNaN(target)) goToSlide(target);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    }
  });

  // Initial state
  slides.forEach(function (s) { s.classList.remove('active', 'exit-left'); });
  if (slides[0]) slides[0].classList.add('active');
  if (dots[0])   dots[0].classList.add('active');

  // ----------------------------------------------------------
  // 1b. HERO PILLAR CARDS — Click to expand briefing
  // ----------------------------------------------------------
  var pillarBriefs = {
    1: 'Voice, chat, ticketing \u2014 unified across legacy CRM/BSS stacks. Working demo: an intent-routing agent that triages inbound contacts (billing, outage, churn risk, technical fault) with live handoff to human agents via screen-pop. KPI baseline + expected improvement: AHT, first-contact resolution, CSAT, agent deflection rate.',
    2: 'From months to days \u2014 OSS stacks, CI/CD, code assistants, test automation. Proof-of-concept: AI-assisted code review pipeline integrated into existing GitLab/Jenkins \u2014 with measurable cycle-time delta before/after. Governance layer: IP ownership, hallucination risk in production code, model access tiers.',
    3: 'Proprietary data advantage \u00b7 Long-term differentiation \u00b7 Internal capability. Present 3 candidates for a custom-built AI product and justify which delivers the highest ROI when built internally. For the winning candidate: 12-month build roadmap, required data assets, estimated team size, and total cost of ownership vs. projected value.',
    4: 'Speed to value \u00b7 Commodity capability \u00b7 Avoid build cost. Evaluate 3 vendor options and justify which to buy/partner on. Procurement scorecard with weighted evaluation criteria. Negotiation framework: IP, data-sharing, and exit clauses to secure in contracts.'
  };

  var pillarCards = document.querySelectorAll('.hero__pillar-card');
  pillarCards.forEach(function (card) {
    var pillarNum = parseInt(card.getAttribute('data-pillar'), 10);
    var briefEl = card.querySelector('.hero__pillar-brief');
    if (briefEl && pillarBriefs[pillarNum]) {
      briefEl.textContent = pillarBriefs[pillarNum];
    }
    
    card.addEventListener('click', function () {
      goToSlide(pillarNum);
    });
  });

  // ----------------------------------------------------------
  // 2. HERO PARTICLES (Slide 0)
  // ----------------------------------------------------------
  var heroCanvas = document.getElementById('hero-canvas');
  var heroCtx    = heroCanvas ? heroCanvas.getContext('2d') : null;
  var particles  = [];
  var particleAnimId = null;

  function resizeHeroCanvas() {
    if (!heroCanvas) return;
    var parent = heroCanvas.parentElement;
    heroCanvas.width  = parent ? parent.clientWidth  : window.innerWidth;
    heroCanvas.height = parent ? parent.clientHeight : window.innerHeight;
  }

  function createParticles() {
    particles = [];
    var count = 60;
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * heroCanvas.width,
        y: Math.random() * heroCanvas.height,
        r: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }
  }

  function drawParticles() {
    if (!heroCtx) return;
    heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    var w = heroCanvas.width;
    var h = heroCanvas.height;

    // Draw connecting lines
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          var lineOpacity = (1 - dist / 120) * 0.25;
          heroCtx.beginPath();
          heroCtx.strokeStyle = 'rgba(0,166,81,' + lineOpacity + ')';
          heroCtx.lineWidth = 0.5;
          heroCtx.moveTo(particles[i].x, particles[i].y);
          heroCtx.lineTo(particles[j].x, particles[j].y);
          heroCtx.stroke();
        }
      }
    }

    // Draw particles
    for (var k = 0; k < particles.length; k++) {
      var p = particles[k];
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0)  p.x = w;
      if (p.x > w)  p.x = 0;
      if (p.y < 0)  p.y = h;
      if (p.y > h)  p.y = 0;

      heroCtx.beginPath();
      heroCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      heroCtx.fillStyle = 'rgba(0,166,81,' + p.opacity + ')';
      heroCtx.fill();
    }
  }

  function animateParticles() {
    if (currentSlide !== 0) {
      particleAnimId = null;
      return;
    }
    drawParticles();
    particleAnimId = requestAnimationFrame(animateParticles);
  }

  function startParticles() {
    resizeHeroCanvas();
    if (particles.length === 0) createParticles();
    if (!particleAnimId) animateParticles();
  }

  window.addEventListener('resize', function () {
    resizeHeroCanvas();
    if (particles.length > 0) {
      // Keep existing particles but clamp to new bounds
      for (var i = 0; i < particles.length; i++) {
        if (particles[i].x > heroCanvas.width)  particles[i].x = Math.random() * heroCanvas.width;
        if (particles[i].y > heroCanvas.height) particles[i].y = Math.random() * heroCanvas.height;
      }
    }
  });

  // ----------------------------------------------------------
  // 3. CHAT DEMO (Slide 1)
  // ----------------------------------------------------------
  var chatMessages  = document.getElementById('chat-messages');
  var chatInput     = document.getElementById('chat-input');
  var chatSendBtn   = document.getElementById('chat-send');
  var presetButtons = document.querySelectorAll('.chat__preset');

  var intentMap = {
    billing: {
      keywords: ['bill', 'billing', 'charge', 'payment', 'invoice', 'overcharge', 'refund', 'fee', 'subscription', 'plan', 'price', 'cost', 'expensive'],
      label: 'Billing & Payments',
      confidence: 0.94,
      response: 'I\'ve identified this as a billing inquiry. Let me analyze the account...',
      routing: 'Routing to Billing Specialist Team',
      agent: { name: 'Sarah M.', role: 'Senior Billing Specialist', avatar: '👩‍💼' },
      context: 'Customer has active billing concern. Account flagged for priority review. Last 3 billing cycles loaded.'
    },
    outage: {
      keywords: ['outage', 'down', 'offline', 'no signal', 'no service', 'not working', 'network', 'coverage', 'tower', 'signal', 'reception'],
      label: 'Network Outage',
      confidence: 0.97,
      response: 'Network issue detected. Checking real-time network status for your area...',
      routing: 'Routing to Network Operations Center',
      agent: { name: 'David K.', role: 'Network Operations Engineer', avatar: '👨‍🔧' },
      context: 'Potential network outage reported. Cell tower status and regional alerts pre-loaded. Customer location identified.'
    },
    churn: {
      keywords: ['cancel', 'leave', 'switch', 'terminate', 'quit', 'end contract', 'competitor', 'better deal', 'too expensive', 'unhappy', 'dissatisfied'],
      label: 'Churn Risk',
      confidence: 0.91,
      response: 'I understand your frustration. Let me pull up your account details and available retention offers...',
      routing: 'Routing to Retention & Loyalty Team',
      agent: { name: 'Maria L.', role: 'Customer Retention Manager', avatar: '👩‍💻' },
      context: 'High churn risk detected. Customer tenure: 3.2 years. CLV: €2,840. Retention offers and loyalty discounts pre-loaded.'
    },
    technical: {
      keywords: ['slow', 'speed', 'internet', 'wifi', 'lag', 'buffer', 'loading', 'disconnect', 'drops', 'unstable', 'technical', 'router', 'modem'],
      label: 'Technical Support',
      confidence: 0.89,
      response: 'Running remote diagnostics on your connection...',
      routing: 'Routing to Technical Support L2',
      agent: { name: 'Alex T.', role: 'Technical Support Specialist', avatar: '🧑‍🔧' },
      context: 'Technical issue reported. Remote diagnostic results ready. Line quality metrics and recent speed test data loaded.'
    },
    porting: {
      keywords: ['one', 'port', 'number', 'competitor', 'cheaper unlimited'],
      label: 'Competitor Win-Back (One)',
      confidence: 0.98,
      response: 'I see you\'ve been with Telco for 4 years. To keep you, I can instantly match One\'s price and give you 12 months of free 5G Max.',
      routing: 'Routing to Specialized Win-Back Team',
      agent: { name: 'Laszlo B.', role: 'Senior Win-Back Specialist', avatar: '🦸‍♂️' },
      context: 'High-value churn risk to competitor One. CLV: €3,200. Pre-approved counter-offer matched against One\'s current campaign.'
    }
  };

  var presetMessages = {
    billing:   'I was overcharged on my last bill. There\'s a charge I don\'t recognize.',
    outage:    'My phone has had no signal since this morning. Is there an outage in my area?',
    churn:     'I want to cancel my contract. I found a better deal with another provider.',
    technical: 'My internet has been really slow for the past few days. Pages take forever to load.',
    porting:   'I want to port my number to One. They offered me a cheaper unlimited data plan.'
  };

  function addMessage(text, type) {
    if (!chatMessages) return;

    var msg = document.createElement('div');
    msg.className = 'chat__message chat__message--' + type;

    if (type === 'ai') {
      // Show typing indicator first
      msg.innerHTML = '<span class="chat__typing">•••</span>';
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      setTimeout(function () {
        msg.innerHTML = text;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 800);
    } else {
      msg.innerHTML = text;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    return msg;
  }

  function classifyIntent(text) {
    var lowerText = text.toLowerCase();
    var bestIntent = null;
    var bestScore  = 0;

    for (var key in intentMap) {
      var score = 0;
      var keywords = intentMap[key].keywords;
      for (var i = 0; i < keywords.length; i++) {
        if (lowerText.indexOf(keywords[i]) !== -1) {
          score++;
        }
      }
      if (score > bestScore) {
        bestScore  = score;
        bestIntent = key;
      }
    }

    if (bestIntent && bestScore > 0) {
      var result = intentMap[bestIntent];
      result.intentKey = bestIntent;
      return result;
    }

    // Fallback for unrecognized intent
    return {
      intentKey: 'general',
      label: 'General Inquiry',
      confidence: 0.65,
      response: 'I\'ll analyze your request and connect you with the right team...',
      routing: 'Routing to General Support Queue',
      agent: { name: 'Jordan P.', role: 'Customer Support Agent', avatar: '🧑‍💻' },
      context: 'General inquiry detected. Full customer profile loaded. Previous interaction history available.'
    };
  }

  function handleUserMessage(text) {
    if (!text || !text.trim()) return;

    // Add user message
    addMessage(text, 'user');

    var intent = classifyIntent(text);

    // AI classification response after typing delay
    setTimeout(function () {
      var aiContent =
        '<div class="chat__intent-badge" data-intent="' + (intent.intentKey || 'general') + '">' + intent.label +
        ' <span class="chat__confidence">' + Math.round(intent.confidence * 100) + '% confidence</span></div>' +
        '<p>' + intent.response + '</p>' +
        '<div class="chat__routing">' + intent.routing + '</div>';
      addMessage(aiContent, 'ai');

      // Handoff card after another delay
      setTimeout(function () {
        var handoff =
          '<div class="chat__handoff">' +
            '<div class="chat__agent">' +
              '<span class="chat__agent-avatar">' + intent.agent.avatar + '</span>' +
              '<div class="chat__agent-info">' +
                '<strong>' + intent.agent.name + '</strong>' +
                '<span>' + intent.agent.role + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="chat__context">' +
              '<strong>Context Passed:</strong> ' + intent.context +
            '</div>' +
          '</div>';
        addMessage(handoff, 'system');
      }, 1400);
    }, 200);
  }

  function clearChatForPreset() {
    if (!chatMessages) return;
    // Remove all messages except any initial system message
    var messages = chatMessages.querySelectorAll('.chat__message');
    messages.forEach(function (m) { m.remove(); });
  }

  // Preset buttons
  presetButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var intent = this.getAttribute('data-intent');
      if (intent && presetMessages[intent]) {
        clearChatForPreset();
        handleUserMessage(presetMessages[intent]);
      }
    });
  });

  // Send button
  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', function () {
      if (!chatInput) return;
      var text = chatInput.value.trim();
      if (text) {
        handleUserMessage(text);
        chatInput.value = '';
      }
    });
  }

  // Enter key on input
  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var text = chatInput.value.trim();
        if (text) {
          handleUserMessage(text);
          chatInput.value = '';
        }
      }
    });
  }

  // ----------------------------------------------------------
  // 4. KPI SLIDERS (Slide 1)
  // ----------------------------------------------------------
  var sliderAdoption     = document.getElementById('slider-adoption');
  var sliderAdoptionVal  = document.getElementById('slider-adoption-value');
  var sliderAugmentation    = document.getElementById('slider-augmentation');
  var sliderAugmentationVal = document.getElementById('slider-augmentation-value');

  var kpiBaselines = {
    aht:        { baseline: 8.2,  unit: 'min', direction: 'decrease', maxImprovement: 0.30 },
    fcr:        { baseline: 68,   unit: '%',   direction: 'increase', maxImprovement: 0.15 },
    csat:       { baseline: 3.4,  unit: '/5',  direction: 'increase', maxImprovement: 0.15 },
    deflection: { baseline: 12,   unit: '%',   direction: 'increase', maxImprovement: 1.00 }
  };

  function updateKPIs() {
    var adoption     = sliderAdoption ? parseInt(sliderAdoption.value, 10) : 0;
    var augmentation = sliderAugmentation ? parseInt(sliderAugmentation.value, 10) : 0;

    if (sliderAdoptionVal)     sliderAdoptionVal.textContent     = adoption + '%';
    if (sliderAugmentationVal) sliderAugmentationVal.textContent = augmentation + '%';

    var factor = (adoption / 100) * (augmentation / 100);

    for (var key in kpiBaselines) {
      var kpi  = kpiBaselines[key];
      var card = document.querySelector('.kpi-card[data-kpi="' + key + '"]');
      if (!card) continue;

      var change = kpi.baseline * kpi.maxImprovement * factor;
      var projected;

      if (kpi.direction === 'decrease') {
        projected = kpi.baseline - change;
      } else {
        projected = kpi.baseline + change;
      }

      var delta = ((projected - kpi.baseline) / kpi.baseline) * 100;

      var projectedValueEl = card.querySelector('.kpi-card__projected-value');
      var deltaEl     = card.querySelector('.kpi-card__delta');

      if (projectedValueEl) {
        // Format the projected value
        var formatted;
        if (key === 'aht') {
          formatted = projected.toFixed(1) + ' ' + kpi.unit;
        } else if (key === 'csat') {
          formatted = projected.toFixed(1) + ' ' + kpi.unit;
        } else {
          formatted = Math.round(projected) + kpi.unit;
        }
        projectedValueEl.textContent = formatted;
      }

      if (deltaEl) {
        var sign = delta > 0 ? '+' : '';
        deltaEl.textContent = sign + delta.toFixed(1) + '%';
        // Color based on improvement direction
        var isGood = (kpi.direction === 'decrease' && delta < 0) ||
                     (kpi.direction === 'increase' && delta > 0);
        deltaEl.className = 'kpi-card__delta' + (factor > 0 ? (isGood ? ' positive' : ' negative') : '');
      }
    }
  }

  if (sliderAdoption)     sliderAdoption.addEventListener('input', updateKPIs);
  if (sliderAugmentation) sliderAugmentation.addEventListener('input', updateKPIs);

  // Initial KPI calculation
  updateKPIs();

  // ----------------------------------------------------------
  // 5. PIPELINE DEMO (Slide 2)
  // ----------------------------------------------------------
  var pipelineStages = document.querySelectorAll('.pipeline__stage');
  var pipelineDetail = document.getElementById('pipeline-detail');
  var pipelineDiff   = document.querySelector('.pipeline__code-diff');

  var stageData = {
    commit: {
      title: 'Code Commit',
      description: 'Developer pushes code to GitLab feature branch.',
      diff: '// New feature: customer usage analytics endpoint\n+ router.get(\'/api/analytics/usage\', async (req, res) => {\n+   const customerId = req.params.id;\n+   const data = await UsageService.getMetrics(customerId);\n+   res.json({ status: \'ok\', data });\n+ });',
      time: '0 min'
    },
    review: {
      title: 'AI Code Review',
      description: 'AI analyzes code quality, security, and best practices.',
      diff: '// AI Review Findings:\n// ⚠️ Missing input validation on customerId\n// ⚠️ No rate limiting on endpoint\n// ⚠️ Missing error handling\n// ✅ Correct async/await usage\n// ✅ Proper RESTful naming convention',
      time: '2 min'
    },
    suggest: {
      title: 'AI Suggestions',
      description: 'AI generates specific code improvement suggestions.',
      diff: '  router.get(\'/api/analytics/usage\', async (req, res) => {\n+   // AI Suggestion: Add input validation\n+   if (!req.params.id || !isValidUUID(req.params.id)) {\n+     return res.status(400).json({ error: \'Invalid customer ID\' });\n+   }\n+   \n+   // AI Suggestion: Add error handling\n+   try {\n      const data = await UsageService.getMetrics(customerId);\n      res.json({ status: \'ok\', data });\n+   } catch (err) {\n+     logger.error(\'Usage analytics failed\', { customerId, err });\n+     res.status(500).json({ error: \'Internal server error\' });\n+   }\n  });',
      time: '3 min'
    },
    fix: {
      title: 'Auto-Fix Applied',
      description: 'AI applies approved fixes automatically.',
      diff: '+ const rateLimit = require(\'express-rate-limit\');\n+ const { isValidUUID } = require(\'./utils/validation\');\n\n+ const limiter = rateLimit({ windowMs: 15*60*1000, max: 100 });\n+ router.get(\'/api/analytics/usage\', limiter, async (req, res) => {\n+   if (!req.params.id || !isValidUUID(req.params.id)) {\n+     return res.status(400).json({ error: \'Invalid customer ID\' });\n+   }\n+   try {\n+     const data = await UsageService.getMetrics(req.params.id);\n+     res.json({ status: \'ok\', data });\n+   } catch (err) {\n+     logger.error(\'Usage analytics failed\', { customerId: req.params.id, err });\n+     res.status(500).json({ error: \'Internal server error\' });\n+   }\n+ });',
      time: '5 min'
    },
    merge: {
      title: 'Merge & Deploy',
      description: 'Code passes CI pipeline and merges to main branch.',
      diff: '✅ All tests passing (147/147)\n✅ Code coverage: 89% (+2%)\n✅ Security scan: No vulnerabilities\n✅ AI review: All suggestions addressed\n✅ Merged to main by jenkins-bot\n✅ Deployed to staging environment',
      time: '18 min total'
    }
  };

  function renderDiff(diffText) {
    var lines = diffText.split('\n');
    var html = '';
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var escapedLine = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if (line.charAt(0) === '+') {
        html += '<span class="diff-add">' + escapedLine + '</span>\n';
      } else if (line.charAt(0) === '-') {
        html += '<span class="diff-remove">' + escapedLine + '</span>\n';
      } else if (line.indexOf('//') === 0 || line.indexOf('// ') === 0) {
        html += '<span class="diff-comment">' + escapedLine + '</span>\n';
      } else if (line.indexOf('✅') !== -1) {
        html += '<span class="diff-add">' + escapedLine + '</span>\n';
      } else if (line.indexOf('⚠️') !== -1) {
        html += '<span class="diff-warning">' + escapedLine + '</span>\n';
      } else {
        html += escapedLine + '\n';
      }
    }
    return html;
  }

  pipelineStages.forEach(function (stage) {
    stage.addEventListener('click', function () {
      var stageKey = this.getAttribute('data-stage');
      if (!stageKey || !stageData[stageKey]) return;

      var isActive = this.classList.contains('active');
      var isVisible = pipelineDetail && pipelineDetail.classList.contains('visible');

      if (isActive && isVisible) {
        pipelineDetail.classList.remove('visible');
        this.classList.remove('active');
        return;
      }

      // Update active stage
      pipelineStages.forEach(function (s) { s.classList.remove('active'); });
      this.classList.add('active');

      var data = stageData[stageKey];

      // Populate detail panel
      if (pipelineDetail) {
        pipelineDetail.innerHTML =
          '<h4>' + data.title + ' <span class="pipeline__time">' + data.time + '</span></h4>' +
          '<p>' + data.description + '</p>' +
          '<pre class="pipeline__code-diff">' + renderDiff(data.diff) + '</pre>';
        pipelineDetail.classList.add('visible');
      }
    });
  });

  // ----------------------------------------------------------
  // 6. GOVERNANCE MATRIX (Slide 2)
  // ----------------------------------------------------------
  var governanceData = {
    'intern-codegen':    'Blocked: Interns cannot use AI code generation without supervision. All AI-generated code must be reviewed by a senior engineer.',
    'intern-automerge':  'Blocked: No auto-merge privileges for intern-level contributors.',
    'intern-proddeploy': 'Blocked: Interns have no production deployment access.',
    'intern-modeltune':  'Blocked: Model fine-tuning restricted to ML team leads only.',
    'junior-codegen':    'Restricted: Can use AI suggestions but all output requires senior review before commit.',
    'junior-automerge':  'Blocked: Auto-merge disabled. Manual merge approval required from tech lead.',
    'junior-proddeploy': 'Blocked: No production deployment access for junior engineers.',
    'junior-modeltune':  'Blocked: Model fine-tuning restricted to ML team leads only.',
    'senior-codegen':    'Allowed: Full AI code generation access with automated quality checks.',
    'senior-automerge':  'Restricted: Auto-merge for non-critical paths only. Critical paths require lead approval.',
    'senior-proddeploy': 'Allowed: Can deploy to production with standard CI/CD safeguards.',
    'senior-modeltune':  'Restricted: Can fine-tune models in sandbox. Production model updates require lead sign-off.',
    'lead-codegen':      'Full: Unrestricted AI code generation with responsibility for team output quality.',
    'lead-automerge':    'Full: Auto-merge enabled for all paths with audit logging.',
    'lead-proddeploy':   'Full: Full production deployment rights with rollback authority.',
    'lead-modeltune':    'Full: Full model tuning access including production model updates.'
  };

  // Create a reusable tooltip element
  var govTooltip = document.createElement('div');
  govTooltip.className = 'governance__tooltip';
  govTooltip.style.display = 'none';
  document.body.appendChild(govTooltip);

  var govCells = document.querySelectorAll('.governance__cell');

  govCells.forEach(function (cell) {
    cell.addEventListener('click', function (e) {
      e.stopPropagation();

      var tier       = this.getAttribute('data-tier');
      var capability = this.getAttribute('data-capability');
      if (!tier || !capability) return;

      var key  = tier + '-' + capability;
      var text = governanceData[key];
      if (!text) return;

      govTooltip.textContent = text;
      govTooltip.style.display = 'block';

      // Position tooltip near the cell
      var rect = this.getBoundingClientRect();
      govTooltip.style.position = 'fixed';
      govTooltip.style.left = rect.left + 'px';
      govTooltip.style.top  = (rect.bottom + 8) + 'px';
      govTooltip.style.maxWidth = '320px';
      govTooltip.style.zIndex = '9999';

      // Ensure tooltip doesn't go off-screen
      requestAnimationFrame(function () {
        var tooltipRect = govTooltip.getBoundingClientRect();
        if (tooltipRect.right > window.innerWidth) {
          govTooltip.style.left = (window.innerWidth - tooltipRect.width - 16) + 'px';
        }
        if (tooltipRect.bottom > window.innerHeight) {
          govTooltip.style.top = (rect.top - tooltipRect.height - 8) + 'px';
        }
      });
    });
  });

  // Hide tooltip on click elsewhere
  document.addEventListener('click', function () {
    govTooltip.style.display = 'none';
  });

  // Panel toggle (governance collapsible panels)
  var panelHeaders = document.querySelectorAll('.governance__panel-header');
  panelHeaders.forEach(function (header) {
    header.addEventListener('click', function () {
      var panel = this.closest('.governance__panel');
      if (panel) panel.classList.toggle('open');
    });
  });

  // ----------------------------------------------------------
  // 7. ROADMAP (Slide 3)
  // ----------------------------------------------------------
  var roadmapPhases = document.querySelectorAll('.roadmap__phase');
  var roadmapDetail = document.getElementById('roadmap-detail');

  var roadmapData = {
    discovery: {
      title: 'Discovery & Planning',
      months: 'Month 1–2',
      team: '4 people: 1 Product Manager, 2 ML Engineers, 1 Data Engineer',
      data: 'Billing history, competitor pricing feeds, customer usage patterns',
      cost: '€180,000',
      deliverable: 'Data audit report, model architecture document, regulatory compliance review, vendor landscape analysis'
    },
    mvp: {
      title: 'MVP Development',
      months: 'Month 3–5',
      team: '7 people: +2 Backend Engineers, +1 Pricing Analyst',
      data: 'Price elasticity models, A/B testing framework, historical conversion data',
      cost: '€420,000',
      deliverable: 'Core pricing algorithm, REST API, internal pricing dashboard, model validation report'
    },
    pilot: {
      title: 'Controlled Pilot',
      months: 'Month 6–8',
      team: '8 people: +1 QA Engineer',
      data: 'Live traffic (5% of customer base), real-time conversion metrics',
      cost: '€380,000',
      deliverable: 'Pilot results analysis, revenue impact assessment, compliance sign-off, customer feedback synthesis'
    },
    scale: {
      title: 'Full Scale Rollout',
      months: 'Month 9–12',
      team: '6 people (reduced after stability achieved)',
      data: 'Full production traffic, all customer segments',
      cost: '€320,000',
      deliverable: 'Full production rollout, real-time monitoring dashboard, automated model retraining pipeline, operations runbook'
    }
  };

  roadmapPhases.forEach(function (phase) {
    phase.addEventListener('click', function () {
      var phaseKey = this.getAttribute('data-phase');
      if (!phaseKey || !roadmapData[phaseKey]) return;

      // Update active phase
      roadmapPhases.forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');

      var data = roadmapData[phaseKey];

      if (roadmapDetail) {
        roadmapDetail.innerHTML =
          '<h4>' + data.title + '</h4>' +
          '<div class="roadmap__detail-grid">' +
            '<div class="roadmap__detail-item">' +
              '<span class="roadmap__detail-label">Timeline</span>' +
              '<span class="roadmap__detail-value">' + data.months + '</span>' +
            '</div>' +
            '<div class="roadmap__detail-item">' +
              '<span class="roadmap__detail-label">Team</span>' +
              '<span class="roadmap__detail-value">' + data.team + '</span>' +
            '</div>' +
            '<div class="roadmap__detail-item">' +
              '<span class="roadmap__detail-label">Data Assets</span>' +
              '<span class="roadmap__detail-value">' + data.data + '</span>' +
            '</div>' +
            '<div class="roadmap__detail-item">' +
              '<span class="roadmap__detail-label">Estimated Cost</span>' +
              '<span class="roadmap__detail-value">' + data.cost + '</span>' +
            '</div>' +
            '<div class="roadmap__detail-item roadmap__detail-item--full">' +
              '<span class="roadmap__detail-label">Deliverables</span>' +
              '<span class="roadmap__detail-value">' + data.deliverable + '</span>' +
            '</div>' +
          '</div>';
        roadmapDetail.classList.add('visible');
      }
    });
  });



  // ----------------------------------------------------------
  // 8.5 VENDOR CARD ACCORDION (Slide 4)
  // ----------------------------------------------------------
  var vendorCards = document.querySelectorAll('.vendor-card');
  vendorCards.forEach(function (card) {
    card.addEventListener('click', function () {
      // Toggle accordion state
      this.classList.toggle('open');
    });
  });

  // ----------------------------------------------------------
  // 9. NEGOTIATION ACCORDION (Slide 4)
  // ----------------------------------------------------------
  var negotiationHeaders = document.querySelectorAll('.negotiation__header');
  negotiationHeaders.forEach(function (header) {
    header.addEventListener('click', function () {
      var item = this.closest('.negotiation__item');
      if (item) item.classList.toggle('open');
    });
  });

  // ----------------------------------------------------------
  // 10. ROI ANIMATION (Slide 5)
  // ----------------------------------------------------------
  var roiAnimated = false;

  function animateValue(element, start, end, duration, formatter) {
    if (!element) return;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease-out cubic
      var easedProgress = 1 - Math.pow(1 - progress, 3);
      var current = start + (end - start) * easedProgress;

      element.textContent = formatter(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function formatCurrency(value) {
    if (Math.abs(value) >= 1000000) {
      return '€' + (value / 1000000).toFixed(1) + 'M';
    }
    if (Math.abs(value) >= 1000) {
      return '€' + Math.round(value / 1000) + 'K';
    }
    return '€' + Math.round(value);
  }

  function formatMonths(value) {
    return value.toFixed(1) + ' months';
  }

  function formatPercent(value) {
    return Math.round(value) + '%';
  }

  function triggerROIAnimation() {
    if (roiAnimated) return;
    roiAnimated = true;

    // Animate elements with data-value attributes
    var roiElements = document.querySelectorAll('.roi-animate');
    roiElements.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-value'));
      if (isNaN(target)) return;

      var format = el.getAttribute('data-format');
      var formatter;

      if (format === 'months') {
        formatter = formatMonths;
      } else if (format === 'percent') {
        formatter = formatPercent;
      } else {
        formatter = formatCurrency;
      }

      animateValue(el, 0, target, 1500, formatter);
    });

    // Also animate specific value elements
    var investmentEls = document.querySelectorAll('.roi-card__investment');
    investmentEls.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-value'));
      if (!isNaN(target)) {
        animateValue(el, 0, target, 1500, formatCurrency);
      }
    });

    var annualValueEls = document.querySelectorAll('.roi-card__annual-value');
    annualValueEls.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-value'));
      if (!isNaN(target)) {
        animateValue(el, 0, target, 1500, formatCurrency);
      }
    });

    var paybackEls = document.querySelectorAll('.roi-card__payback');
    paybackEls.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-value'));
      if (!isNaN(target)) {
        animateValue(el, 0, target, 1500, formatMonths);
      }
    });
  }

  // ----------------------------------------------------------
  // 11. SLIDE ENTER DISPATCHER
  // ----------------------------------------------------------
  function onSlideEnter(slideIndex) {
    switch (slideIndex) {
      case 0:
        startParticles();
        break;

      case 5:
        roiAnimated = false; // Allow re-trigger on revisit
        setTimeout(function () {
          triggerROIAnimation();
        }, 300);
        break;
    }
  }

  // ----------------------------------------------------------
  // 12. MOBILE COMPACT TOGGLES
  // ----------------------------------------------------------
  var compactToggles = document.querySelectorAll('.compact-toggle-btn');
  compactToggles.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var container = btn.closest('.hero__pillar-card, .exec-summary-wrapper, .candidate-card, .roadmap, .vendor-card');
      if (!container) return;
      
      var content = container.querySelector('.compact-toggle-content');
      if (content) {
        var isExpanded = content.classList.contains('expanded');
        
        if (isExpanded) {
          content.classList.remove('expanded');
          container.classList.remove('expanded');
          btn.textContent = '+';
        } else {
          content.classList.add('expanded');
          container.classList.add('expanded');
          btn.textContent = '−';
        }
      }
    });
  });

  // Kick off initial slide
  onSlideEnter(0);

})();
