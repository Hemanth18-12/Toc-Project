/**
 * NPDA Visual Simulator - Dual Mode Architecture
 * Supports Predefined and Custom Languages
 */

const EPSILON = 'ε';

const PDA_CONFIGS = {
    'anbn': {
        deterministic: {
            states: ['q0', 'q1', 'q_acc'], startState: 'q0', finalStates: ['q_acc'],
            transitions: [
                { from: 'q0', read: 'a', pop: 'Z', to: 'q0', push: 'AZ' },
                { from: 'q0', read: 'a', pop: 'A', to: 'q0', push: 'AA' },
                { from: 'q0', read: 'b', pop: 'A', to: 'q1', push: '' },
                { from: 'q1', read: 'b', pop: 'A', to: 'q1', push: '' },
                { from: 'q1', read: EPSILON, pop: 'Z', to: 'q_acc', push: 'Z' }
            ]
        },
        nondeterministic: {
            states: ['q0', 'q1', 'q2', 'q_acc'], startState: 'q0', finalStates: ['q_acc'],
            transitions: [
                { from: 'q0', read: 'a', pop: 'Z', to: 'q0', push: 'AZ' },
                { from: 'q0', read: 'a', pop: 'A', to: 'q0', push: 'AA' },
                { from: 'q0', read: EPSILON, pop: 'A', to: 'q2', push: 'A' }, 
                { from: 'q2', read: 'b', pop: 'A', to: 'q2', push: 'A' }, 
                { from: 'q0', read: 'b', pop: 'A', to: 'q1', push: '' },
                { from: 'q1', read: 'b', pop: 'A', to: 'q1', push: '' },
                { from: 'q1', read: EPSILON, pop: 'Z', to: 'q_acc', push: 'Z' }
            ]
        }
    },
    'parentheses': {
        deterministic: {
            states: ['q0', 'q_acc'], startState: 'q0', finalStates: ['q_acc'],
            transitions: [
                { from: 'q0', read: '(', pop: 'Z', to: 'q0', push: '(Z' },
                { from: 'q0', read: '(', pop: '(', to: 'q0', push: '((' },
                { from: 'q0', read: ')', pop: '(', to: 'q0', push: '' },
                { from: 'q0', read: EPSILON, pop: 'Z', to: 'q_acc', push: 'Z' }
            ]
        },
        nondeterministic: {
            states: ['q0', 'q_acc'], startState: 'q0', finalStates: ['q_acc'],
            transitions: [
                { from: 'q0', read: '(', pop: 'Z', to: 'q0', push: '(Z' },
                { from: 'q0', read: '(', pop: '(', to: 'q0', push: '((' },
                { from: 'q0', read: ')', pop: '(', to: 'q0', push: '' },
                { from: 'q0', read: EPSILON, pop: 'Z', to: 'q_acc', push: 'Z' }
            ]
        }
    },
    'palindrome': {
        deterministic: {
            states: ['q0', 'q1', 'q_acc'], startState: 'q0', finalStates: ['q_acc'],
            transitions: [
                { from: 'q0', read: 'a', pop: 'Z', to: 'q0', push: 'aZ' },
                { from: 'q0', read: 'b', pop: 'Z', to: 'q0', push: 'bZ' },
                { from: 'q0', read: 'a', pop: 'a', to: 'q0', push: 'aa' },
                { from: 'q0', read: 'a', pop: 'b', to: 'q0', push: 'ab' },
                { from: 'q0', read: 'b', pop: 'a', to: 'q0', push: 'ba' },
                { from: 'q0', read: 'b', pop: 'b', to: 'q0', push: 'bb' },
                { from: 'q0', read: 'c', pop: 'Z', to: 'q1', push: 'Z' },
                { from: 'q0', read: 'c', pop: 'a', to: 'q1', push: 'a' },
                { from: 'q0', read: 'c', pop: 'b', to: 'q1', push: 'b' },
                { from: 'q1', read: 'a', pop: 'a', to: 'q1', push: '' },
                { from: 'q1', read: 'b', pop: 'b', to: 'q1', push: '' },
                { from: 'q1', read: EPSILON, pop: 'Z', to: 'q_acc', push: 'Z' }
            ]
        },
        nondeterministic: {
            states: ['q0', 'q1', 'q_acc'], startState: 'q0', finalStates: ['q_acc'],
            transitions: [
                { from: 'q0', read: 'a', pop: 'Z', to: 'q0', push: 'aZ' },
                { from: 'q0', read: 'b', pop: 'Z', to: 'q0', push: 'bZ' },
                { from: 'q0', read: 'a', pop: 'a', to: 'q0', push: 'aa' },
                { from: 'q0', read: 'a', pop: 'b', to: 'q0', push: 'ab' },
                { from: 'q0', read: 'b', pop: 'a', to: 'q0', push: 'ba' },
                { from: 'q0', read: 'b', pop: 'b', to: 'q0', push: 'bb' },
                { from: 'q0', read: EPSILON, pop: 'Z', to: 'q1', push: 'Z' }, 
                { from: 'q0', read: EPSILON, pop: 'a', to: 'q1', push: 'a' }, 
                { from: 'q0', read: EPSILON, pop: 'b', to: 'q1', push: 'b' }, 
                { from: 'q1', read: 'a', pop: 'a', to: 'q1', push: '' },
                { from: 'q1', read: 'b', pop: 'b', to: 'q1', push: '' },
                { from: 'q1', read: EPSILON, pop: 'Z', to: 'q_acc', push: 'Z' }
            ]
        }
    }
};

class PDASimulator {
    constructor(config) {
        this.config = config;
        this.reset();
    }
    reset() {
        this.configs = [{
            id: 1, state: this.config.startState, remainingInput: '', stack: ['Z'],
            trace: `Init: ( ${this.config.startState}, input, [Z] )`, alive: true, accept: false, parentId: null
        }];
        this.nextConfigId = 2;
        this.result = null; 
    }
    loadInput(inputStr) {
        this.reset();
        this.configs[0].remainingInput = inputStr;
        let disp = inputStr === '' ? EPSILON : inputStr;
        this.configs[0].trace = `Init: ( ${this.configs[0].state}, ${disp}, [Z] )`;
    }
    getTransitions(stateId, readChar, stackTop) {
        return this.config.transitions.filter(t => 
            t.from === stateId && (t.read === readChar || t.read === EPSILON || t.read === 'e' || t.read === '') && t.pop === stackTop
        );
    }
    step() {
        if (this.result) return false;
        let nextConfigs = [];
        let anyAlive = false;
        let anyAccepted = false;

        for (let config of this.configs) {
            if (!config.alive) { nextConfigs.push(config); continue; }

            let stackTop = config.stack.length > 0 ? config.stack[config.stack.length - 1] : null;
            let isAcceptState = this.config.finalStates.includes(config.state);
            let isEmptyStack = stackTop === null;
            
            if (config.remainingInput.length === 0 && (isAcceptState || isEmptyStack)) {
                config.accept = true;
                config.trace += isAcceptState ? " -> ACCEPTED (Final State)" : " -> ACCEPTED (Empty Stack)";
                nextConfigs.push(config);
                anyAccepted = true; anyAlive = true; continue;
            }

            if (!stackTop) {
                config.alive = false; config.trace += " -> REJECTED (Dead Stack)";
                nextConfigs.push(config); continue;
            }

            let nextChar = config.remainingInput.length > 0 ? config.remainingInput[0] : null;
            let validTransitions = [];

            if (nextChar) validTransitions.push(...this.getTransitions(config.state, nextChar, stackTop).filter(t => t.read === nextChar));
            let epsTransitions = this.getTransitions(config.state, EPSILON, stackTop).filter(t => t.read === EPSILON || t.read === 'e' || t.read === '');
            validTransitions.push(...epsTransitions);
            validTransitions = [...new Set(validTransitions)];

            if (validTransitions.length === 0) {
                config.alive = false; config.trace += " -> CRASH (No valid transition)";
                nextConfigs.push(config); continue;
            }

            for (let i = 0; i < validTransitions.length; i++) {
                let t = validTransitions[i];
                let newStack = [...config.stack];
                newStack.pop(); 
                
                const pushChars = t.push === EPSILON || t.push === 'e' || t.push === '' ? [] : t.push.split('');
                for (let j = pushChars.length - 1; j >= 0; j--) newStack.push(pushChars[j]);

                let isEps = (t.read === EPSILON || t.read === 'e' || t.read === '');
                let newRemainingInput = isEps ? config.remainingInput : config.remainingInput.substring(1);
                
                let stackStr = newStack.length > 0 ? `[${newStack.join('')}]` : '[]';
                let inputDisp = newRemainingInput || EPSILON;
                let pushDisp = pushChars.length === 0 ? EPSILON : t.push;
                let rDisp = isEps ? EPSILON : t.read;
                let newTrace = `(${t.from}, ${rDisp}, ${t.pop}→${pushDisp}) ⟹ ( ${t.to}, ${inputDisp}, ${stackStr} )`;
                
                nextConfigs.push({
                    id: this.nextConfigId++, state: t.to, remainingInput: newRemainingInput, stack: newStack,
                    trace: newTrace, alive: true, accept: false, parentId: config.id, lastTransition: t
                });
                anyAlive = true;
            }
        }
        if (anyAccepted) { this.configs = nextConfigs; this.result = 'accepted'; return false; }
        if (!anyAlive) { this.configs = nextConfigs; this.result = 'rejected'; return false; }
        this.configs = nextConfigs.filter(c => c.alive || c.accept);
        return true;
    }
}

class GraphLayout {
    static circular(statesArr, centerX = 400, centerY = 200, radius = 150) {
        let n = statesArr.length;
        if (n === 0) return [];
        if (n === 1) return [{ id: statesArr[0], x: centerX, y: centerY }];
        
        let angleStep = (2 * Math.PI) / n;
        let startAngle = Math.PI; 
        
        return statesArr.map((stateId, i) => {
            let a = startAngle + (i * angleStep);
            return { id: stateId, x: centerX + radius * Math.cos(a), y: centerY + radius * Math.sin(a) };
        });
    }
}

class AppController {
    constructor() {
        this.simulator = null;
        this.runInterval = null;
        this.speed = 800;
        
        this.dom = {
            langSelect: document.getElementById('language-select'),
            modeToggle: document.getElementById('mode-toggle'),
            modeContainer: document.querySelector('.toggle-switch').parentElement,
            inputStr: document.getElementById('input-string'),
            
            customDefPanel: document.getElementById('custom-def-panel'),
            defStates: document.getElementById('def-states'),
            defStart: document.getElementById('def-start'),
            defFinals: document.getElementById('def-finals'),
            rulesContainer: document.getElementById('transition-rules-container'),
            btnAddRule: document.getElementById('btn-add-rule'),
            btnBuildPda: document.getElementById('btn-build-pda'),
            ruleTemplate: document.getElementById('rule-row-template'),
            
            btnStart: document.getElementById('btn-start'),
            btnStep: document.getElementById('btn-step'),
            btnRun: document.getElementById('btn-run'),
            btnReset: document.getElementById('btn-reset'),
            speed: document.getElementById('speed-slider'),
            
            statusBanner: document.getElementById('status-display'),
            statusText: document.getElementById('status-text'),
            
            svgStates: document.getElementById('states-layer'),
            svgTrans: document.getElementById('transitions-layer'),
            svgLabels: document.getElementById('labels-layer'),
            
            stackContainer: document.getElementById('stack-container'),
            traceLog: document.getElementById('trace-log'),
            formalDefContent: document.getElementById('formal-def-content'),
            
            btnTheme: document.getElementById('btn-theme-toggle'),
            btnExport: document.getElementById('btn-export-pdf')
        };
        
        this.initEvents();
        this.loadSelectedConfig();
    }

    initEvents() {
        this.dom.langSelect.addEventListener('change', () => this.handleModeSwitch());
        this.dom.modeToggle.addEventListener('change', () => this.loadSelectedConfig());
        
        this.dom.btnAddRule.addEventListener('click', () => this.addCustomRuleRow());
        this.dom.btnBuildPda.addEventListener('click', () => this.buildCustomPDA());
        
        this.dom.rulesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('r-delete')) e.target.closest('.rule-row').remove();
        });
        
        this.dom.btnStart.addEventListener('click', () => this.startSim());
        this.dom.btnStep.addEventListener('click', () => this.stepSim());
        this.dom.btnRun.addEventListener('click', () => this.toggleRun());
        this.dom.btnReset.addEventListener('click', () => {
            this.resetSimState();
            this.updateVisuals();
        });
        
        this.dom.speed.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            if (this.runInterval) { clearInterval(this.runInterval); this.runInterval = setInterval(() => this.stepSim(), this.speed); }
        });
        
        if(this.dom.btnTheme) this.dom.btnTheme.addEventListener('click', () => document.body.classList.toggle('light-theme'));
        if(this.dom.btnExport) this.dom.btnExport.addEventListener('click', () => window.print());
    }

    handleModeSwitch() {
        let isCustom = this.dom.langSelect.value === 'custom';
        if (isCustom) {
            this.dom.customDefPanel.style.display = 'block';
            this.dom.modeContainer.style.display = 'none'; // NPDA determined dynamically by user rules
            this.dom.formalDefContent.innerHTML = `Mode: Custom PDA Builder\nPlease outline transitions, then click Build Graph.`;
            this.dom.btnStart.disabled = true;
            this.dom.svgStates.innerHTML = '';
            this.dom.svgTrans.innerHTML = '';
            this.dom.svgLabels.innerHTML = '';
            this.simulator = null;
        } else {
            this.dom.customDefPanel.style.display = 'none';
            this.dom.modeContainer.style.display = 'block';
            this.loadSelectedConfig();
        }
    }

    addCustomRuleRow(from='', read='', pop='Z', to='', push='') {
        let clone = this.dom.ruleTemplate.content.cloneNode(true);
        let inputs = clone.querySelectorAll('input');
        inputs[0].value = from; inputs[1].value = read; inputs[2].value = pop; 
        inputs[3].value = to; inputs[4].value = push;
        this.dom.rulesContainer.appendChild(clone);
        this.dom.rulesContainer.scrollTop = this.dom.rulesContainer.scrollHeight;
    }

    buildCustomPDA() {
        let rawStates = this.dom.defStates.value.split(',').map(s => s.trim()).filter(s => s);
        let start = this.dom.defStart.value.trim();
        let finals = this.dom.defFinals.value.split(',').map(s => s.trim()).filter(s => s);
        let transitions = [];
        
        this.dom.rulesContainer.querySelectorAll('.rule-row').forEach(row => {
            let inputs = row.querySelectorAll('input');
            let f = inputs[0].value.trim(), r = inputs[1].value.trim(), p = inputs[2].value.trim();
            let t = inputs[3].value.trim(), pu = inputs[4].value.trim();
            if (f && p && t) transitions.push({ from: f, read: r, pop: p, to: t, push: pu });
        });

        transitions.forEach(t => {
            if (!rawStates.includes(t.from)) rawStates.push(t.from);
            if (!rawStates.includes(t.to)) rawStates.push(t.to);
        });

        if (rawStates.length === 0) { alert('Please supply valid states.'); return; }
        if (!start) start = rawStates[0];

        this.pdaConfig = { states: rawStates, startState: start, finalStates: finals, transitions: transitions };
        this.simulator = new PDASimulator(this.pdaConfig);
        
        this.updateFormalDefOutput();
        this.layoutAndDrawGraph();
        this.resetSimState();
        this.setStatus('Custom Machine Ready.', '');
    }

    loadSelectedConfig() {
        if (this.dom.langSelect.value === 'custom') return;
        
        let lang = this.dom.langSelect.value;
        let mode = this.dom.modeToggle.checked ? 'nondeterministic' : 'deterministic';
        this.pdaConfig = PDA_CONFIGS[lang][mode];
        this.simulator = new PDASimulator(this.pdaConfig);
        
        this.updateFormalDefOutput();
        this.layoutAndDrawGraph();
        this.resetSimState();
    }

    updateFormalDefOutput() {
        let Q = `{ ${this.pdaConfig.states.join(', ')} }`;
        let q0 = this.pdaConfig.startState;
        let F = `{ ${this.pdaConfig.finalStates.join(', ')} }`;
        let deltaStr = this.pdaConfig.transitions.map(t => {
            let rDisp = t.read === '' || t.read === 'e' ? EPSILON : t.read;
            let pDisp = t.push === '' || t.push === 'e' ? EPSILON : t.push;
            return `δ(${t.from}, ${rDisp}, ${t.pop}) = { (${t.to}, ${pDisp}) }`
        }).join('\n');
        this.dom.formalDefContent.innerHTML = `M = (Q, Σ, Γ, δ, q0, Z0, F)\n\nQ = ${Q}\nq0 = ${q0}\nF = ${F}\n\nTransitions (δ):\n${deltaStr}`;
    }

    layoutAndDrawGraph() {
        let canvasW = document.querySelector('.canvas-container').clientWidth || 800;
        let canvasH = document.querySelector('.canvas-container').clientHeight || 400;
        let radius = Math.min(canvasW/2 - 60, canvasH/2 - 60);
        this.geometricStates = GraphLayout.circular(this.pdaConfig.states, canvasW/2, canvasH/2, radius>50 ? radius : 120);
        this.drawGraph();
    }

    drawGraph() {
        this.dom.svgStates.innerHTML = '';
        this.dom.svgTrans.innerHTML = '';
        this.dom.svgLabels.innerHTML = '';

        if(!this.pdaConfig) return;

        const pathMap = {};
        this.pdaConfig.transitions.forEach(t => {
            const key = `${t.from}-${t.to}`;
            if (!pathMap[key]) {
                pathMap[key] = { from: this.geometricStates.find(s => s.id === t.from), to: this.geometricStates.find(s => s.id === t.to), labels: [] };
            }
            let rd = t.read === '' || t.read === 'e' ? EPSILON : t.read;
            let pu = t.push === '' || t.push === 'e' ? EPSILON : t.push;
            pathMap[key].labels.push(`${rd}, ${t.pop} → ${pu}`);
        });

        Object.values(pathMap).forEach(group => { if(group.from && group.to) this.drawTransitionPath(group); });

        this.geometricStates.forEach(state => {
            let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', state.x); circle.setAttribute('cy', state.y); circle.setAttribute('r', '25');
            circle.setAttribute('class', 'state-circle'); circle.setAttribute('id', `state-${state.id}`);
            
            if (this.pdaConfig.finalStates.includes(state.id)) {
                let inner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                inner.setAttribute('cx', state.x); inner.setAttribute('cy', state.y); inner.setAttribute('r', '20');
                inner.setAttribute('class', 'state-circle'); g.appendChild(inner);
            }

            let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', state.x); text.setAttribute('y', state.y);
            text.setAttribute('class', 'state-label'); text.textContent = state.id;

            if (state.id === this.pdaConfig.startState) {
                let startArrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                startArrow.setAttribute('d', `M ${state.x - 60} ${state.y} L ${state.x - 30} ${state.y}`);
                startArrow.setAttribute('class', 'transition-path'); startArrow.setAttribute('marker-end', 'url(#arrow)');
                this.dom.svgTrans.appendChild(startArrow);
            }
            g.appendChild(circle); g.appendChild(text); this.dom.svgStates.appendChild(g);
        });
    }

    drawTransitionPath(group) {
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'transition-path'); path.setAttribute('id', `trans-${group.from.id}-${group.to.id}`);
        path.setAttribute('marker-end', 'url(#arrow)');

        let dx = group.to.x - group.from.x, dy = group.to.y - group.from.y;
        let dr = Math.sqrt(dx*dx + dy*dy), d = '', cx, cy; 
        
        if (group.from.id === group.to.id) {
            d = `M ${group.from.x} ${group.from.y - 25} C ${group.from.x - 40} ${group.from.y - 80}, ${group.from.x + 40} ${group.from.y - 80}, ${group.from.x} ${group.from.y - 25}`;
            cx = group.from.x; cy = group.from.y - 85; 
        } else {
            d = `M ${group.from.x} ${group.from.y} A ${dr} ${dr} 0 0 1 ${group.to.x} ${group.to.y}`;
            cx = group.from.x + dx/2; cy = group.from.y + dy/2 - dr/4; 
        }
        path.setAttribute('d', d); this.dom.svgTrans.appendChild(path);

        let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', cx); text.setAttribute('y', cy); text.setAttribute('class', 'transition-label');
        text.setAttribute('text-anchor', 'middle'); text.textContent = group.labels.join(' | ');
        this.dom.svgLabels.appendChild(text);
    }

    startSim() {
        if (!this.simulator) return;
        this.simulator.loadInput(this.dom.inputStr.value.trim()); 
        
        this.dom.inputStr.disabled = true; this.dom.langSelect.disabled = true;
        this.dom.modeToggle.disabled = true; this.dom.btnBuildPda.disabled = true;
        this.dom.btnStart.disabled = true; this.dom.btnStep.disabled = false; this.dom.btnRun.disabled = false;
        
        this.setStatus('Simulation Started', '');
        this.updateVisuals();
    }

    stepSim() {
        let hasNext = this.simulator.step();
        this.updateVisuals();
        if (!hasNext) this.finishSimulation();
    }

    toggleRun() {
        if (this.runInterval) {
            clearInterval(this.runInterval); this.runInterval = null;
            this.dom.btnRun.textContent = 'Auto-Run'; this.dom.btnRun.classList.remove('primary-btn');
        } else {
            this.runInterval = setInterval(() => this.stepSim(), this.speed);
            this.dom.btnRun.textContent = 'Pause'; this.dom.btnRun.classList.add('primary-btn');
        }
    }

    finishSimulation() {
        if (this.runInterval) { clearInterval(this.runInterval); this.runInterval = null; }
        this.dom.btnStep.disabled = true; this.dom.btnRun.disabled = true; this.dom.btnRun.textContent = 'Auto-Run';
        if (this.simulator.result === 'accepted') this.setStatus('String ACCEPTED! Validation OK.', 'accepted');
        else this.setStatus(`String REJECTED.`, 'rejected');
    }

    updateVisuals() {
        document.querySelectorAll('.state-circle').forEach(el => el.classList.remove('active', 'nondet-active'));
        document.querySelectorAll('.transition-path').forEach(el => {
            el.classList.remove('active'); el.setAttribute('marker-end', 'url(#arrow)');
        });

        let configs = [...this.simulator.configs]; 
        configs.forEach(config => {
            if (config.alive || config.accept) {
                let sEl = document.getElementById(`state-${config.state}`);
                if (sEl) sEl.classList.add('active');
                if (config.lastTransition) {
                    let transId = `trans-${config.lastTransition.from}-${config.lastTransition.to}`;
                    let tEl = document.getElementById(transId);
                    if (tEl) { tEl.classList.add('active'); tEl.setAttribute('marker-end', 'url(#arrow-active)'); }
                }
            }
        });

        let displayConfig = configs.find(c => c.accept) || configs.find(c => c.alive);
        this.renderStack(displayConfig ? displayConfig.stack : []);
        this.renderTraceLog(configs);
    }

    renderStack(stackArray) {
        this.dom.stackContainer.innerHTML = '';
        stackArray.forEach((item, index) => {
            let div = document.createElement('div'); div.className = 'stack-item'; div.textContent = item;
            div.style.animationDelay = `${(stackArray.length - index - 1) * 0.05}s`;
            this.dom.stackContainer.appendChild(div);
        });
    }

    renderTraceLog(configs) {
        this.dom.traceLog.innerHTML = '';
        if (configs.length === 0 || (!configs[0].lastTransition && !configs[0].accept && configs[0].trace.includes('Init'))) {
            this.dom.traceLog.innerHTML = '<div class="trace-empty">No active simulation.</div>';
            return;
        }
        let isMultiple = configs.length > 1;
        configs.forEach((cfg) => {
            let div = document.createElement('div'); div.className = 'trace-step';
            let statusClass = cfg.accept ? 'accept' : (cfg.alive ? (isMultiple ? 'branch' : 'trace-config') : 'dead');
            div.innerHTML = `<span class="${statusClass}">[Br ${cfg.id}] ${cfg.trace}</span>`;
            this.dom.traceLog.appendChild(div);
        });
        this.dom.traceLog.scrollTop = this.dom.traceLog.scrollHeight;
    }

    setStatus(text, type) {
        this.dom.statusText.textContent = text;
        this.dom.statusBanner.className = 'status-banner no-print'; 
        if (type) this.dom.statusBanner.classList.add(type);
    }

    resetSimState() {
        if (this.runInterval) { clearInterval(this.runInterval); this.runInterval = null; }
        if (this.simulator) this.simulator.reset();
        
        this.dom.inputStr.disabled = false; this.dom.langSelect.disabled = false; 
        this.dom.modeToggle.disabled = false; this.dom.btnBuildPda.disabled = false;
        
        this.dom.btnStart.disabled = this.simulator === null; 
        this.dom.btnStep.disabled = true; this.dom.btnRun.disabled = true;
        this.dom.btnRun.textContent = 'Auto-Run'; this.dom.btnRun.classList.remove('primary-btn');

        this.setStatus('Ready', '');
        document.querySelectorAll('.state-circle').forEach(el => el.classList.remove('active', 'nondet-active'));
        document.querySelectorAll('.transition-path').forEach(el => {
            el.classList.remove('active'); el.setAttribute('marker-end', 'url(#arrow)');
        });
        this.dom.stackContainer.innerHTML = '';
        this.dom.traceLog.innerHTML = '<div class="trace-empty">No active simulation.</div>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
    window.addEventListener('resize', () => { if(window.app && window.app.simulator) window.app.layoutAndDrawGraph(); });
});
