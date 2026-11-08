const PAID_HOURS = 2080;
const WORKDAYS = 260;
const MOON_MILES = 238900;
const MUSK_URL = 'https://cdn.jsdelivr.net/gh/komed3/rtb-api@main/api/profile/elon-musk/latest';

// 2026 federal brackets: [upper bound, rate]
const FED = {
    single: {
        std: 16100,
        brackets: [[12400, .10], [50400, .12], [105700, .22], [201775, .24], [256225, .32], [640600, .35], [Infinity, .37]]
    },
    mfj: {
        std: 32200,
        brackets: [[24800, .10], [100800, .12], [211400, .22], [403550, .24], [512450, .32], [768700, .35], [Infinity, .37]]
    },
    hoh: {
        std: 24150,
        brackets: [[17700, .10], [67450, .12], [105700, .22], [201750, .24], [256200, .32], [640600, .35], [Infinity, .37]]
    }
};

// Virginia: brackets are the same for every filing status.
const VA = {
    std: { single: 8750, mfj: 17500, hoh: 8750 },
    exemption: 930,
    brackets: [[3000, .02], [5000, .03], [17000, .05], [Infinity, .0575]]
};

const SS_RATE = .062;
const SS_WAGE_BASE = 184500;
const MEDICARE_RATE = .0145;

const $ = id => document.getElementById(id);
const payType = () => document.querySelector('input[name="type"]:checked').value;
const num = id => Math.max(0, parseFloat($(id).value) || 0);

const money = n => (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

function bracketTax(income, brackets) {
    let tax = 0;
    let prev = 0;

    for (const [limit, rate] of brackets) {
        if (income <= prev) break;
        tax += (Math.min(income, limit) - prev) * rate;
        prev = limit;
    }

    return tax;
}

function calc() {
    const filing = $('filing').value;
    const amount = num('amount');
    const base = payType() === 'hour' ? amount * PAID_HOURS : amount;

    const workdays = Math.max(0, WORKDAYS - num('pto'));
    const otHours = num('otHours') * workdays / 5;
    const overtime = otHours * (base / PAID_HOURS) * Math.max(num('otMult'), 1);
    const bonus = num('bonus');
    const gross = base + overtime + bonus;

    const k401Pct = Math.min(num('k401'), 100);
    const k401 = gross * k401Pct / 100;
    const match = gross * Math.min(k401Pct, num('matchCap')) / 100 * num('matchRate') / 100;
    const health = num('health') * 12;
    const postTax = num('postTax') * 12;

    const fica = Math.max(0, gross - health); // Section 125 premiums are FICA-exempt.
    const fedTaxable = Math.max(0, gross - k401 - health - FED[filing].std);
    const vaTaxable = Math.max(0, gross - k401 - health - VA.std[filing] - VA.exemption);

    const fed = bracketTax(fedTaxable, FED[filing].brackets);
    const ss = Math.min(fica, SS_WAGE_BASE) * SS_RATE;
    const medicare = fica * MEDICARE_RATE;
    const va = bracketTax(vaTaxable, VA.brackets);

    const afterTax = gross - k401 - health - postTax - fed - ss - medicare - va;

    const commuteDays = workdays * Math.min(num('days'), 5) / 5;
    const miles = commuteDays * num('miles') * 2;
    const gasCost = miles / Math.max(num('mpg'), 1) * num('gas');
    const tollCost = commuteDays * num('tolls');
    const wearCost = miles * num('wear');
    const lunchCost = commuteDays * num('lunch');
    const miscCost = num('misc');

    const real = afterTax - gasCost - tollCost - wearCost - lunchCost - miscCost;
    const commuteHours = commuteDays * num('minutes') * 2 / 60;

    return {
        base, overtime, bonus, otHours, match, gross, k401, health, postTax, fed, ss, medicare, va, afterTax,
        gasCost, tollCost, wearCost, lunchCost, miscCost, real,
        commuteDays, commuteHours, miles,
        effectiveHourly: real / (PAID_HOURS + otHours + commuteHours)
    };
}

function row(label, annual, cls = '', note = '') {
    const cells = [annual, annual / 12, annual / 26, annual / 52, annual / PAID_HOURS]
        .map(v => `<td>${money(v)}</td>`).join('');
    const small = note ? `<small>${note}</small>` : '';

    return `<tr class="${cls}"><td>${label}${small}</td>${cells}</tr>`;
}

function distance(miles) {
    if (miles <= 0) return '';

    const fmt = n => Math.round(n).toLocaleString('en-US');
    const moonPct = miles / MOON_MILES * 100;
    const pct = moonPct >= 1 ? moonPct.toFixed(1) : moonPct.toFixed(2);

    return `, driving roughly <strong>${fmt(miles)} miles</strong> or about ${pct}% of the way to the moon`;
}

function render() {
    const r = calc();
    const rows = [];
    const neg = (label, v, note) => v > 0 && rows.push(row(label, -v, 'neg', note));

    if (r.overtime > 0 || r.bonus > 0) {
        rows.push(row('Base pay', r.base));
        if (r.overtime > 0) rows.push(row('Overtime', r.overtime));
        if (r.bonus > 0) rows.push(row('Bonus', r.bonus));
        rows.push(row('Gross pay', r.gross, 'sub'));
    } else {
        rows.push(row('Gross pay', r.gross));
    }

    neg('Federal income tax', r.fed);
    neg('Social Security', r.ss);
    neg('Medicare', r.medicare);
    neg('Virginia income tax', r.va);
    neg('Health insurance', r.health);
    neg('401(k) / retirement', r.k401, 'Not lost, but not spendable!');
    neg('Other post-tax deductions', r.postTax);
    rows.push(row('Take-home pay', r.afterTax, 'sub'));
    neg('Gas', r.gasCost);
    neg('Tolls + parking', r.tollCost);
    neg('Vehicle wear &amp; tear', r.wearCost);
    neg('Lunch, coffee, etc.', r.lunchCost);
    neg('Clothes, dues, tools, etc.', r.miscCost);
    rows.push(row('Real take-home', r.real, 'total'));

    if (r.gross > 0) {
        const lost = r.gross - r.real;
        rows.push(row('Difference from gross', -lost, 'loss', `${(lost / r.gross * 100).toFixed(1)}% of your pay never reaches you.`));
    }

    if (r.k401 > 0 || r.match > 0) {
        rows.push(row('Retirement saved', r.k401 + r.match, 'info', `Your 401(k) plus ${money(r.match)}/yr employer match; not included above in take-home but worth knowing!`));
    }

    const eff = r.effectiveHourly;

    $('results').tBodies[0].innerHTML = rows.join('');

    const nominal = r.gross / (PAID_HOURS + r.otHours);
    const kept = r.gross > 0 ? r.real / r.gross * 100 : 0;

    $('summary-main').innerHTML = r.gross > 0
        ? `You're paid <strong>${money(nominal)}/hr</strong> on paper, but after everything you actually net <strong>${money(eff)}/hr</strong> (${kept.toFixed(1)}% of gross kept). You spend about <strong>${Math.round(r.commuteHours).toLocaleString('en-US')} hours a year</strong> commuting${distance(r.miles)}.`
        : 'Enter an amount to get started.';

    renderMusk(r.gross);
}

// Latest Forbes-derived net worth (in millions of USD) via komed3/rtb-api; null until/unless it loads.
let muskWorth = null;
let muskDate = '';

function renderMusk(gross) {
    const el = $('musk');

    if (! muskWorth || gross <= 0) {
        el.hidden = true;
        $('musk-note').hidden = true;
        return;
    }

    const worth = muskWorth * 1e6;
    const pct = gross / worth * 100;
    const digits = Math.min(12, Math.max(2, 1 - Math.floor(Math.log10(pct))));
    const oneIn = Math.round(worth / gross).toLocaleString('en-US');

    el.innerHTML = `A whole year of your work (${money(gross)}) is about <strong>${pct.toFixed(digits)}%</strong> of <a href="https://en.wikipedia.org/wiki/Wealth_tax" target="_blank">Elon Musk's net worth</a>, or roughly <sup>1</sup>&frasl;<sub>${oneIn}</sub>th of his $${(worth / 1e9).toFixed(1)} billion.`;
    el.hidden = false;
    $('musk-date').textContent = muskDate;
    $('musk-note').hidden = false;
}

fetch(MUSK_URL)
    .then(res => {
        if (! res.ok) throw new Error(`HTTP ${res.status} from ${MUSK_URL}`);
        return res.json();
    })
    .then(data => {
        if (typeof data?.networth !== 'number' || !isFinite(data.networth) || data.networth <= 0) {
            throw new Error(`Unexpected response shape (no usable "networth"): ${JSON.stringify(data)}`);
        }

        muskWorth = data.networth;
        muskDate = data.date;
        render();
    })
    .catch(err => console.error('[salaryme] Failed to load Elon Musk net worth; the comparison line is hidden.', err));

function syncType() {
    const hourly = payType() === 'hour';
    $('amount-label').textContent = hourly ? 'Hourly rate' : 'Yearly amount';
    $('amount-hint').textContent = hourly ? '$ per hour' : '$ per year';
}

function save() {
    try {
        const data = { type: payType() };
        document.querySelectorAll('#form input:not([type="radio"]), #form select').forEach(el => data[el.id] = el.value);
        localStorage.setItem('salaryme', JSON.stringify(data));
    } catch { }
}

function load() {
    try {
        const data = JSON.parse(localStorage.getItem('salaryme') || '{}');
        for (const [id, v] of Object.entries(data)) {
            if (id === 'type') {
                const radio = document.querySelector(`input[name="type"][value="${v}"]`);
                if (radio) radio.checked = true;
            } else if ($(id)) {
                $(id).value = v;
            }
        }
    } catch { }
}

// Convert the entered amount so switching modes keeps the same pay.
document.querySelectorAll('input[name="type"]').forEach(el => el.addEventListener('change', () => {
    const amount = num('amount');
    const hourly = payType() === 'hour';

    $('amount').value = +(hourly ? amount / PAID_HOURS : amount * PAID_HOURS).toFixed(2);
    syncType();
    save();
    render();
}));

$('form').addEventListener('input', () => {
    save();
    render();
});

$('form').addEventListener('submit', e => e.preventDefault());

load();
syncType();
render();
