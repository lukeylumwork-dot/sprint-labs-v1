import { useEffect, useMemo, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Cat = "Economics" | "Health" | "Tech" | "Society" | "Environment";
type Arg = { t: string; c: number[] };
type Side = { label: string; args: Arg[] };
type Ep = {
  n: number;
  cat: Cat;
  q: string;
  dur: number;
  date: string;
  a: Side;
  b: Side;
  src: string[];
  votes: [number, number];
  ev: number;
};

const CATS: Cat[] = ["Economics", "Health", "Tech", "Society", "Environment"];

const EPS: Ep[] = [
  {
    n: 64,
    cat: "Society",
    q: "Should cities ban cars from their centres?",
    dur: 912,
    date: "27 Oct 2026",
    a: {
      label: "Yes: give the centre back to people",
      args: [
        {
          t: "Car-free cores cut roadside NO₂ by 25–40% within two years of closing to traffic.",
          c: [1],
        },
        {
          t: "Footfall on pedestrianised streets rose 17% on average, and retail spend followed.",
          c: [2, 3],
        },
        {
          t: "Road danger falls fastest where traffic is removed, not slowed: casualties down 42%.",
          c: [4],
        },
      ],
    },
    b: {
      label: "No: access has to come first",
      args: [
        {
          t: "Disabled residents and carers rely on door-to-door trips that buses don’t cover.",
          c: [5],
        },
        {
          t: "Trades and deliveries face longer routes, adding 6–9% to costs passed on to customers.",
          c: [3, 6],
        },
        {
          t: "Without transit investment first, traffic moves to ring roads rather than disappearing.",
          c: [1, 6],
        },
      ],
    },
    src: [
      "Urban air quality panel, 41 European cities, 2025",
      "High-street footfall study, 212 town centres, 2024",
      "Retail and logistics survey, 1,200 businesses, 2025",
      "Road casualty review, 18 low-traffic schemes, 2026",
      "Accessible travel diary study, 3,400 respondents, 2025",
      "Traffic displacement modelling, Northern Cities Lab, 2024",
    ],
    votes: [2104, 1611],
    ev: 58,
  },
  {
    n: 63,
    cat: "Economics",
    q: "Should the UK move to a four-day working week?",
    dur: 888,
    date: "20 Oct 2026",
    a: {
      label: "Yes: same output, healthier staff",
      args: [
        { t: "Across 61 trial firms, revenue held steady while sick days fell by 65%.", c: [1] },
        {
          t: "Staff turnover dropped 57%, cutting hiring costs most firms under-count.",
          c: [1, 2],
        },
        { t: "Output per hour has grown fastest in countries with shorter average weeks.", c: [3] },
      ],
    },
    b: {
      label: "No: it doesn’t fit most jobs",
      args: [
        {
          t: "Trial firms were self-selected, mostly office-based and already keen to try it.",
          c: [4],
        },
        {
          t: "Shift-based sectors like care and retail would need 20% more staff to cover.",
          c: [5],
        },
        { t: "Early gains faded for a third of firms by the end of the second year.", c: [6] },
      ],
    },
    src: [
      "Four-day week pilot results, 61 employers, 2023–25",
      "Cost of staff turnover survey, 900 HR leads, 2025",
      "Hours and productivity panel, 34 countries, 2024",
      "Selection bias in workplace trials, 2025",
      "Care and retail staffing model, 2026",
      "Follow-up survey of pilot firms, year three, 2026",
    ],
    votes: [1412, 1188],
    ev: 61,
  },
  {
    n: 62,
    cat: "Health",
    q: "Should sugar be taxed like tobacco?",
    dur: 931,
    date: "13 Oct 2026",
    a: {
      label: "Yes: price changes behaviour",
      args: [
        { t: "The soft-drinks levy cut sugar in drinks by 46% as makers reformulated.", c: [1] },
        { t: "Childhood obesity in the most deprived areas fell 8% after the levy.", c: [2] },
        { t: "Tobacco shows sustained price rises work best alongside clear labelling.", c: [3] },
      ],
    },
    b: {
      label: "No: it hits poorer homes hardest",
      args: [
        { t: "Low-income families spend three times more of their budget on food.", c: [4] },
        { t: "Shoppers switch to cheaper sugary products rather than cutting sugar.", c: [5] },
        { t: "Sugar isn’t harmful in moderation, so a tobacco-style regime overreaches.", c: [6] },
      ],
    },
    src: [
      "Soft-drink reformulation audit, 1,600 products, 2025",
      "Child measurement data, Year 6, 2019–2026",
      "Tobacco control evidence review, 2024",
      "Household spending survey, 2025",
      "Loyalty-card basket study, 2.1m baskets, 2025",
      "Dietary guidelines review, 2026",
    ],
    votes: [1630, 1102],
    ev: 64,
  },
  {
    n: 61,
    cat: "Tech",
    q: "Should social media be banned for under-16s?",
    dur: 904,
    date: "6 Oct 2026",
    a: {
      label: "Yes: protect developing minds",
      args: [
        { t: "Heavy use links to a doubling of anxiety symptoms in girls aged 13–15.", c: [1] },
        { t: "Phone-free schools report attention gains worth an extra week per term.", c: [2] },
        { t: "Age checks now work: a 2026 pilot verified 94% of users without ID upload.", c: [3] },
      ],
    },
    b: {
      label: "No: ban the harms, not the kids",
      args: [
        { t: "Correlation studies can’t separate cause from effect in teen wellbeing.", c: [4] },
        { t: "Isolated and LGBTQ+ teens describe online communities as key support.", c: [5] },
        { t: "Bans push use to unregulated platforms with weaker protections.", c: [6] },
      ],
    },
    src: [
      "Adolescent wellbeing cohort, 11,000 participants, 2025",
      "Phone-free schools evaluation, 214 schools, 2026",
      "Age-assurance pilot report, 2026",
      "Meta-analysis of screen-time studies, 2024",
      "Young people’s online support survey, 2025",
      "Platform displacement study, 2025",
    ],
    votes: [2210, 1495],
    ev: 52,
  },
  {
    n: 60,
    cat: "Environment",
    q: "Is nuclear power essential to reach net zero?",
    dur: 962,
    date: "29 Sep 2026",
    a: {
      label: "Yes: firm power we can’t replace",
      args: [
        { t: "Grids above 80% renewables need firm low-carbon power for windless weeks.", c: [1] },
        { t: "Nuclear has among the lowest lifecycle emissions: about 6g CO₂ per kWh.", c: [2] },
        { t: "Plants run for 60+ years, spreading high build costs across generations.", c: [3] },
      ],
    },
    b: {
      label: "No: too slow and too costly",
      args: [
        { t: "Recent European plants ran 9–14 years late and up to 3× over budget.", c: [4] },
        { t: "Storage and interconnector costs are falling by around 15% a year.", c: [5] },
        {
          t: "Each £1 on new nuclear buys roughly 3× less carbon cut this decade than wind.",
          c: [6],
        },
      ],
    },
    src: [
      "Grid balancing scenarios to 2050, 2025",
      "Lifecycle emissions comparison, 2024",
      "Plant lifetime extension review, 2025",
      "Major project delivery database, 2026",
      "Battery and interconnector cost tracker, 2026",
      "Abatement cost curves, 2025",
    ],
    votes: [1876, 1544],
    ev: 49,
  },
  {
    n: 59,
    cat: "Economics",
    q: "Would a universal basic income work?",
    dur: 920,
    date: "22 Sep 2026",
    a: {
      label: "Yes: simpler and fairer",
      args: [
        { t: "A two-year pilot found employment didn’t fall and wellbeing rose 12%.", c: [1] },
        { t: "Means-tested benefits leave one in five eligible people unclaimed.", c: [2] },
        { t: "Automation risk is highest in roles with the least retraining support.", c: [3] },
      ],
    },
    b: {
      label: "No: the sums don’t add up",
      args: [
        { t: "A meaningful UBI would cost around 13% of GDP before any savings.", c: [4] },
        { t: "Flat payments give millionaires the same as those most in need.", c: [5] },
        { t: "Pilots are short and small, so can’t show long-run labour effects.", c: [1, 6] },
      ],
    },
    src: [
      "Basic income pilot, 2,000 participants, 2024–26",
      "Benefit take-up estimates, 2025",
      "Occupational automation exposure index, 2025",
      "Fiscal costing of basic income models, 2026",
      "Distributional analysis of flat transfers, 2025",
      "Review of income experiments, 2024",
    ],
    votes: [1320, 1490],
    ev: 44,
  },
  {
    n: 58,
    cat: "Health",
    q: "Should GP appointments be mostly online?",
    dur: 876,
    date: "15 Sep 2026",
    a: {
      label: "Yes: faster access for most",
      args: [
        { t: "Video consultations cut the average wait from 13 days to 3.", c: [1] },
        { t: "Seven in ten routine issues were resolved without an in-person visit.", c: [2] },
        { t: "Online triage frees face-to-face slots for complex and older patients.", c: [3] },
      ],
    },
    b: {
      label: "No: some things need a room",
      args: [
        { t: "Missed diagnoses were 1.4× more likely in remote first contacts.", c: [4] },
        { t: "Over-75s are four times less likely to complete an online booking.", c: [5] },
        { t: "Seeing the same GP lowers hospital admissions by up to 30%.", c: [6] },
      ],
    },
    src: [
      "Practice access data, 1,100 surgeries, 2026",
      "Remote consultation outcomes audit, 2025",
      "Appointment mix evaluation, 2025",
      "Diagnostic safety review, 2026",
      "Digital exclusion survey, over-65s, 2025",
      "Continuity of care cohort study, 2024",
    ],
    votes: [980, 1340],
    ev: 41,
  },
  {
    n: 57,
    cat: "Tech",
    q: "Should AI-generated work carry a label?",
    dur: 915,
    date: "8 Sep 2026",
    a: {
      label: "Yes: people deserve to know",
      args: [
        { t: "68% of adults can’t reliably tell AI images from photos, and want labels.", c: [1] },
        { t: "Misleading posts with a synthetic label were shared 34% less.", c: [2] },
        { t: "Food and finance show that disclosure rules can work at scale.", c: [3] },
      ],
    },
    b: {
      label: "No: labels can’t keep up",
      args: [
        { t: "Most work now mixes human and AI input, so a yes/no label misleads.", c: [4] },
        { t: "Watermarks were stripped from 80% of test images in under a minute.", c: [5] },
        { t: "Unlabelled fakes may look more trustworthy once labels are the norm.", c: [6] },
      ],
    },
    src: [
      "Public attitudes to synthetic media, 4,000 adults, 2026",
      "Labelling field experiment, 2025",
      "Comparative disclosure regimes review, 2024",
      "Creative workflow survey, 1,800 professionals, 2026",
      "Watermark robustness tests, 2026",
      "Implied-truth effect study, 2025",
    ],
    votes: [2480, 905],
    ev: 57,
  },
  {
    n: 56,
    cat: "Society",
    q: "Should voting be compulsory?",
    dur: 892,
    date: "1 Sep 2026",
    a: {
      label: "Yes: a parliament for everyone",
      args: [
        { t: "Where voting is compulsory, turnout runs above 90% across all age groups.", c: [1] },
        { t: "The turnout gap between richest and poorest falls from 23 points to 4.", c: [2] },
        { t: "Campaigns shift from rallying a base to persuading the middle.", c: [3] },
      ],
    },
    b: {
      label: "No: a right includes not using it",
      args: [
        { t: "Fines for not voting fall hardest on people already disengaged.", c: [4] },
        { t: "Spoilt and random ballots rise, adding noise rather than signal.", c: [5] },
        { t: "Automatic registration lifts turnout 6–9 points without compulsion.", c: [6] },
      ],
    },
    src: [
      "Comparative turnout dataset, 27 democracies, 2025",
      "Turnout inequality analysis, 2024",
      "Campaign strategy content study, 2025",
      "Enforcement and fines review, 2025",
      "Informal voting patterns study, 2024",
      "Automatic registration evaluation, 2026",
    ],
    votes: [1150, 1360],
    ev: 47,
  },
  {
    n: 55,
    cat: "Environment",
    q: "Should rewilding take priority over farmland?",
    dur: 944,
    date: "25 Aug 2026",
    a: {
      label: "Yes: nature is infrastructure",
      args: [
        { t: "Restored peat and wetland store up to 10× more carbon per hectare.", c: [1] },
        { t: "Natural flood management cut peak river flows 15–20% downstream.", c: [2] },
        { t: "The least productive 10% of farmland grows under 1% of our calories.", c: [3] },
      ],
    },
    b: {
      label: "No: food security comes first",
      args: [
        { t: "Moving production abroad can export emissions and habitat loss.", c: [4] },
        { t: "Upland farming supports rural jobs that rewilding rarely replaces.", c: [5] },
        { t: "Nature-friendly farming delivers 70% of the biodiversity gain.", c: [6] },
      ],
    },
    src: [
      "Land carbon stock estimates, 2025",
      "Catchment flood modelling, 2024",
      "Agricultural land productivity map, 2026",
      "Leakage from land-use change review, 2025",
      "Rural employment survey, 2025",
      "Agri-environment scheme outcomes, 2026",
    ],
    votes: [1720, 1210],
    ev: 55,
  },
  {
    n: 54,
    cat: "Economics",
    q: "Should rent controls return to UK cities?",
    dur: 909,
    date: "18 Aug 2026",
    a: {
      label: "Yes: stability for renters",
      args: [
        { t: "Rent caps cut forced moves by 20%, keeping children in the same schools.", c: [1] },
        { t: "City rents have risen 2.5× faster than wages since 2015.", c: [2] },
        { t: "Newer controls exempt new builds, protecting future supply.", c: [3] },
      ],
    },
    b: {
      label: "No: fewer homes, worse homes",
      args: [
        { t: "Controlled cities saw rental supply shrink 15% as landlords sold up.", c: [4] },
        { t: "Maintenance spending drops when rents are capped below market.", c: [5] },
        { t: "The real shortage is homes: building 300k a year matters more.", c: [6] },
      ],
    },
    src: [
      "Tenant mobility study, 2025",
      "Rents and earnings index, 2026",
      "Rent regulation design review, 2024",
      "Rental supply after regulation, three cities, 2025",
      "Housing condition survey, 2025",
      "Housing need projections, 2026",
    ],
    votes: [1540, 1495],
    ev: 46,
  },
  {
    n: 53,
    cat: "Society",
    q: "Should homework be scrapped in primary schools?",
    dur: 898,
    date: "11 Aug 2026",
    a: {
      label: "Yes: little gain, real cost",
      args: [
        { t: "Homework shows close to zero attainment benefit before age 11.", c: [1] },
        { t: "Children with less support at home fall further behind.", c: [2] },
        { t: "Free play and sleep link more strongly to primary outcomes.", c: [3] },
      ],
    },
    b: {
      label: "No: reading at home still matters",
      args: [
        { t: "Daily reading at home adds about two months of progress a year.", c: [4] },
        { t: "Short tasks build routines that pay off at secondary school.", c: [5] },
        { t: "Parents value homework as a window into what’s being taught.", c: [6] },
      ],
    },
    src: [
      "Teaching and learning evidence summary, 2025",
      "Attainment gap analysis, 2024",
      "Child time-use study, 2025",
      "Home reading trial, 120 schools, 2026",
      "Transition to secondary cohort, 2025",
      "Parent survey, 6,000 families, 2026",
    ],
    votes: [1880, 990],
    ev: 53,
  },
  {
    n: 52,
    cat: "Health",
    q: "Should GPs charge for missed appointments?",
    dur: 903,
    date: "4 Aug 2026",
    a: {
      label: "Yes: a small fee changes habits",
      args: [
        { t: "A £10 charge cut no-shows by 30% in a 40-practice pilot.", c: [1] },
        { t: "Missed slots cost primary care an estimated £216m a year.", c: [2] },
        { t: "Fees with exemptions for under-18s and over-75s kept access fair.", c: [3] },
      ],
    },
    b: {
      label: "No: it deters people who need care",
      args: [
        { t: "No-shows are highest in deprived areas, where fees bite hardest.", c: [4] },
        { t: "Admin to collect fees costs more than half the money raised.", c: [5] },
        { t: "Text reminders alone cut no-shows by 25% at almost no cost.", c: [6] },
      ],
    },
    src: [
      "No-show charge pilot, 40 practices, 2025",
      "Primary care capacity report, 2026",
      "Fee exemption design review, 2025",
      "Deprivation and attendance analysis, 2024",
      "Fee collection cost model, 2025",
      "Appointment reminder trial, 2025",
    ],
    votes: [1105, 1290],
    ev: 48,
  },
  {
    n: 51,
    cat: "Tech",
    q: "Should schools teach coding from age five?",
    dur: 917,
    date: "28 Jul 2026",
    a: {
      label: "Yes: it’s the new literacy",
      args: [
        { t: "Early coding lifted problem-solving scores by 0.3 of a grade.", c: [1] },
        { t: "Digital roles make up 1 in 8 job adverts, up from 1 in 20.", c: [2] },
        { t: "Starting young narrows the later gender gap in computing.", c: [3] },
      ],
    },
    b: {
      label: "No: basics first",
      args: [
        { t: "Primary timetables are full; coding displaces reading and maths.", c: [4] },
        { t: "Only 1 in 3 primary teachers feel confident teaching it.", c: [5] },
        { t: "Skills taught at five are often outdated by sixteen.", c: [6] },
      ],
    },
    src: [
      "Early computing curriculum trial, 2025",
      "Job advert skills analysis, 2026",
      "Gender and computing pathways study, 2024",
      "Primary timetable survey, 2025",
      "Teacher confidence survey, 2026",
      "Skills half-life review, 2024",
    ],
    votes: [1640, 1180],
    ev: 54,
  },
  {
    n: 50,
    cat: "Environment",
    q: "Should frequent flyers pay a levy?",
    dur: 931,
    date: "21 Jul 2026",
    a: {
      label: "Yes: the few fly the most",
      args: [
        { t: "15% of people take 70% of all flights.", c: [1] },
        { t: "A rising levy cuts emissions without taxing the annual holiday.", c: [2] },
        { t: "Revenue could fund rail alternatives on short routes.", c: [3] },
      ],
    },
    b: {
      label: "No: it won’t move the needle",
      args: [
        { t: "Business travel would shift to hubs abroad, moving emissions.", c: [4] },
        { t: "Frequent flyers are the least price-sensitive travellers.", c: [5] },
        { t: "Clean fuel mandates cut more carbon per pound spent.", c: [6] },
      ],
    },
    src: [
      "Flight frequency survey, 2025",
      "Levy design modelling, 2026",
      "Short-haul rail substitution study, 2025",
      "Carbon leakage in aviation review, 2024",
      "Air travel price elasticity study, 2025",
      "Aviation decarbonisation cost curves, 2026",
    ],
    votes: [1980, 1010],
    ev: 57,
  },
  {
    n: 49,
    cat: "Economics",
    q: "Should the state pension age rise to 70?",
    dur: 926,
    date: "14 Jul 2026",
    a: {
      label: "Yes: we’re living longer",
      args: [
        { t: "Life expectancy at 65 has risen by five years since 1980.", c: [1] },
        { t: "Pension spending is set to grow from 5% to 8% of GDP.", c: [2] },
        { t: "Fewer workers per pensioner strains the system each decade.", c: [3] },
      ],
    },
    b: {
      label: "No: not everyone ages the same",
      args: [
        { t: "Healthy life expectancy varies by 19 years between areas.", c: [4] },
        { t: "Manual workers would lose years of retirement others keep.", c: [5] },
        { t: "Older workers already face longer spells of unemployment.", c: [6] },
      ],
    },
    src: [
      "Life expectancy tables, 2025",
      "Long-term fiscal projections, 2026",
      "Dependency ratio analysis, 2025",
      "Healthy life expectancy by area, 2024",
      "Retirement by occupation study, 2025",
      "Older workers labour market report, 2026",
    ],
    votes: [870, 1720],
    ev: 43,
  },
  {
    n: 48,
    cat: "Health",
    q: "Should alcohol carry cancer warnings?",
    dur: 884,
    date: "7 Jul 2026",
    a: {
      label: "Yes: most people don’t know",
      args: [
        { t: "Only 1 in 5 adults know alcohol is linked to breast cancer.", c: [1] },
        { t: "Labels in a trial cut purchases by 6.6% within months.", c: [2] },
        { t: "Tobacco-style warnings shifted norms over a decade.", c: [3] },
      ],
    },
    b: {
      label: "No: labels alone don’t change much",
      args: [
        { t: "Warning fatigue sets in within a year of new labels.", c: [4] },
        { t: "Heavy drinkers are the least responsive to labelling.", c: [5] },
        { t: "Minimum unit pricing showed larger, clearer effects.", c: [6] },
      ],
    },
    src: [
      "Public awareness survey, 3,000 adults, 2025",
      "Retail label trial, 2024",
      "Tobacco warning evaluation, 2023",
      "Label wear-out study, 2025",
      "Drinker segment response study, 2025",
      "Minimum pricing evaluation, 2026",
    ],
    votes: [1820, 960],
    ev: 56,
  },
  {
    n: 47,
    cat: "Tech",
    q: "Should self-driving cars be allowed on UK roads now?",
    dur: 948,
    date: "30 Jun 2026",
    a: {
      label: "Yes: humans are the risk",
      args: [
        { t: "Nine in ten crashes involve human error.", c: [1] },
        { t: "Robotaxi trials logged 80% fewer injury crashes per mile.", c: [2] },
        { t: "Older and disabled people gain independent travel.", c: [3] },
      ],
    },
    b: {
      label: "No: not ready for our roads",
      args: [
        { t: "Trials ran mostly in dry, wide, well-mapped city grids.", c: [4] },
        { t: "Liability law isn’t clear when no one is driving.", c: [5] },
        { t: "Edge cases like roadworks still cause stalls and near misses.", c: [6] },
      ],
    },
    src: [
      "Road collision factors report, 2025",
      "Autonomous vehicle safety data, 2026",
      "Accessible mobility study, 2025",
      "Trial conditions review, 2026",
      "Automated vehicles legal review, 2025",
      "Incident logs from city trials, 2026",
    ],
    votes: [1320, 1450],
    ev: 47,
  },
  {
    n: 46,
    cat: "Environment",
    q: "Should gas boilers be banned in new homes?",
    dur: 902,
    date: "23 Jun 2026",
    a: {
      label: "Yes: build it right first time",
      args: [
        { t: "Retrofitting a heat pump later costs 3× more than fitting it new.", c: [1] },
        { t: "Heat pumps in new builds cut heating emissions by 70%.", c: [2] },
        { t: "Running costs match gas in well-insulated new homes.", c: [3] },
      ],
    },
    b: {
      label: "No: let buyers choose",
      args: [
        { t: "Upfront build costs rise by around £4,000 a home.", c: [4] },
        { t: "Installer shortages could slow new housebuilding.", c: [5] },
        { t: "Grid upgrades in some areas lag years behind.", c: [6] },
      ],
    },
    src: [
      "Retrofit cost comparison, 2025",
      "New-build heating emissions study, 2024",
      "Running cost field trial, 2026",
      "Housebuilder cost survey, 2025",
      "Installer workforce census, 2026",
      "Local grid capacity map, 2025",
    ],
    votes: [1690, 1040],
    ev: 59,
  },
  {
    n: 45,
    cat: "Society",
    q: "Should national service return?",
    dur: 919,
    date: "16 Jun 2026",
    a: {
      label: "Yes: shared purpose, new skills",
      args: [
        { t: "Civic service schemes raised trust between groups by 12 points.", c: [1] },
        { t: "Participants were more likely to be in work two years on.", c: [2] },
        { t: "Volunteering roles could ease shortages in care.", c: [3] },
      ],
    },
    b: {
      label: "No: costly and coercive",
      args: [
        { t: "A full scheme would cost an estimated £2.5bn a year.", c: [4] },
        { t: "Compulsion breeds resentment and low-quality work.", c: [5] },
        { t: "Voluntary schemes reach similar outcomes at a tenth of the cost.", c: [6] },
      ],
    },
    src: [
      "Civic service evaluation, 2025",
      "Participant outcomes tracker, 2024",
      "Care workforce gap analysis, 2026",
      "Scheme costing, 2025",
      "Compulsory service review, 2024",
      "Voluntary youth programme study, 2025",
    ],
    votes: [1010, 1610],
    ev: 45,
  },
];

const CAT_TOTAL: Record<Cat, number> = {
  Economics: 14,
  Health: 12,
  Tech: 13,
  Society: 15,
  Environment: 10,
};

const CAT_TONE: Record<Cat, string> = {
  Economics: "#b98b5e",
  Health: "#c07a62",
  Tech: "#6f7f94",
  Society: "#8c7aa0",
  Environment: "#7f9a7a",
};

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const k = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
const comma = (n: number) => n.toLocaleString("en-GB");

function chapters(dur: number) {
  return [
    { id: "q", label: "The question", from: 0, to: 75 },
    { id: "a", label: "Side A", from: 75, to: 390 },
    { id: "b", label: "Side B", from: 390, to: 705 },
    { id: "e", label: "Evidence check", from: 705, to: dur - 60 },
    { id: "y", label: "Your call", from: dur - 60, to: dur },
  ];
}

/* Deterministic waveform heights */
const WAVE = Array.from({ length: 56 }, (_, i) =>
  Math.round(22 + 70 * Math.abs(Math.sin(i * 0.61) * Math.cos(i * 0.17 + 0.4))),
);

type View = "home" | "episodes" | "episode" | "format" | "about";

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const I = {
  play: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  pause: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="5" width="4.2" height="14" rx="1.2" fill="currentColor" />
      <rect x="13.8" y="5" width="4.2" height="14" rx="1.2" fill="currentColor" />
    </svg>
  ),
  head: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 15v-3a8 8 0 0 1 16 0v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="3" y="14" width="5" height="7" rx="2" fill="currentColor" />
      <rect x="16" y="14" width="5" height="7" rx="2" fill="currentColor" />
    </svg>
  ),
  chev: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  clock: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  left: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19 12H5m6-6-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  right: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  rss: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="6" cy="18" r="1.8" fill="currentColor" />
    </svg>
  ),
  globe: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  ),
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="2.5" width="12" height="19" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M10.5 18h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  back15: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12a8 8 0 1 0 2.4-5.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 3.5v4h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="15.4"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="700"
        fill="currentColor"
        fontFamily="Inter, sans-serif"
      >
        15
      </text>
    </svg>
  ),
  fwd15: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 12a8 8 0 1 1-2.4-5.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 3.5v4h-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="15.4"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="700"
        fill="currentColor"
        fontFamily="Inter, sans-serif"
      >
        15
      </text>
    </svg>
  ),
  book: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 20a2 2 0 0 0 2 2h13v-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 2a14 14 0 0 0 0 28Z" fill="#b98b5e" />
      <path d="M16 2a14 14 0 0 1 0 28Z" fill="#7f9a7a" />
      <rect x="15.2" y="0.5" width="1.6" height="31" rx="0.8" fill="#22201c" />
    </svg>
  );
}

const HOSTS = {
  a: { name: "Nadia Rahman", ini: "NR", bg: "linear-gradient(135deg,#c99d70,#8a6237)" },
  b: { name: "Owen Hartley", ini: "OH", bg: "linear-gradient(135deg,#97b092,#52694f)" },
};

function HostTag({ side, extra }: { side: "a" | "b"; extra?: string }) {
  const h = HOSTS[side];
  return (
    <div className="hostf">
      <span className="miniav" style={{ background: h.bg }}>
        {h.ini}
      </span>
      <span>
        Argued by <b>{h.name}</b>
      </span>
      <span className="hostf-x">{extra ?? "Side set by coin toss"}</span>
    </div>
  );
}

function Best({ e, side }: { e: Ep; side: "a" | "b" }) {
  const strong = side === "a" ? e.ev : 100 - e.ev;
  const bars = strong >= 55 ? 4 : strong >= 48 ? 3 : 2;
  const label = bars === 4 ? "Strong" : bars === 3 ? "Moderate" : "Mixed";
  const src = side === "a" ? 0 : 3;
  return (
    <>
      <div className="best">
        <div className="best-k">
          <span>Strongest source [{src + 1}]</span>
          <span className="grade">
            <i>
              {[0, 1, 2, 3].map((j) => (
                <u key={j} className={j < bars ? "f" : ""} />
              ))}
            </i>
            {label}
          </span>
        </div>
        <p>{e.src[src]}</p>
      </div>
      <HostTag side={side} extra={`${strong}% of evidence weight`} />
    </>
  );
}

function TopicPanel({ cat, list, onOpen }: { cat: Cat; list: Ep[]; onOpen: (n: number) => void }) {
  const va = list.reduce((n, e) => n + e.votes[0], 0);
  const vb = list.reduce((n, e) => n + e.votes[1], 0);
  const pa = Math.round((va / (va + vb)) * 100);
  const top = [...list].sort((x, y) => y.votes[0] + y.votes[1] - (x.votes[0] + x.votes[1]))[0];
  const total = CAT_TOTAL[cat];
  return (
    <div className="topic">
      <div className="topic-l">
        <span className="tag">
          <i style={{ background: CAT_TONE[cat] }} />
          {cat}
        </span>
        <b>{cat}, in numbers</b>
        <p>
          {total} debates, {Math.round((total * 15) / 6) / 10} hours of evidence and{" "}
          {comma(total * 18)} sources cited since the first episode.
        </p>
      </div>
      <div className="topic-s">
        <div>
          <span>Average verdict</span>
          <b>
            {pa} / {100 - pa}
          </b>
          <small>Side A / Side B</small>
        </div>
        <div>
          <span>Votes cast</span>
          <b>{comma(va + vb)}</b>
          <small>On these {list.length} debates</small>
        </div>
        <button type="button" className="topic-top" onClick={() => onOpen(top.n)}>
          <span>Most debated</span>
          <em>{top.q}</em>
          <small>
            Ep. {top.n} · {comma(top.votes[0] + top.votes[1])} votes
          </small>
        </button>
      </div>
      <div className="topic-r">
        <span className="topic-k">Verdict by episode</span>
        {list.map((e) => {
          const p = Math.round((e.votes[0] / (e.votes[0] + e.votes[1])) * 100);
          return (
            <div className="vrow" key={e.n}>
              <span className="mono">Ep. {e.n}</span>
              <span className="vtrack">
                <i style={{ width: `${p}%` }} />
                <i />
              </span>
              <span className="vnum">{p}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

const CSS = `
.mk-ss{--paper:#f4efe6;--card:#faf7f1;--paper2:#ece5d8;--ink:#22201c;--ink2:#4a453d;--muted:#7a7266;--line:#e0d6c6;--line2:#d2c6b3;
--sand:#b98b5e;--sand-d:#8a6237;--sand-t:#f0e4d4;--sand-t2:#e7d5bf;--sage:#7f9a7a;--sage-d:#52694f;--sage-t:#e3eadd;--sage-t2:#d2ddca;
--serif:Georgia,"Times New Roman",serif;
width:100%;height:100%;overflow:hidden;position:relative;background:var(--paper);color:var(--ink);
font-family:Inter,system-ui,sans-serif;font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;display:flex;flex-direction:column}
.mk-ss *{box-sizing:border-box}
.mk-ss h1,.mk-ss h2,.mk-ss h3,.mk-ss h4,.mk-ss p,.mk-ss ul,.mk-ss ol,.mk-ss li,.mk-ss figure{margin:0;padding:0;list-style:none;color:inherit;font-weight:inherit;letter-spacing:inherit;text-transform:none}
.mk-ss button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;text-align:inherit;letter-spacing:inherit;text-transform:none}
.mk-ss button:focus-visible{border-radius:inherit}
.mk-ss button:focus-visible{outline:2px solid var(--sand);outline-offset:2px}
.mk-ss .serif{font-family:var(--serif)}
.mk-ss .mono{font-family:"IBM Plex Mono",ui-monospace,monospace}

/* header */
.mk-ss .hd{height:68px;flex:none;display:flex;align-items:center;gap:40px;padding:0 48px;border-bottom:1px solid var(--line);position:relative;z-index:5;background:var(--paper)}
.mk-ss .brand{display:flex;align-items:center;gap:11px}
.mk-ss .brand b{font-family:var(--serif);font-weight:400;font-size:21px;letter-spacing:-.01em}
.mk-ss .brand b i{color:var(--sand-d);font-style:italic}
.mk-ss .links{display:flex;gap:4px}
.mk-ss .links button{padding:8px 14px;border-radius:999px;color:var(--ink2);font-size:14px;font-weight:500;transition:background .15s,color .15s}
.mk-ss .links button:hover{background:var(--paper2);color:var(--ink)}
.mk-ss .links button[aria-current="page"]{background:var(--ink);color:var(--paper)}
.mk-ss .hd-r{margin-left:auto;display:flex;align-items:center;gap:12px;position:relative}
.mk-ss .np{display:flex;align-items:center;gap:8px;height:36px;padding:0 12px 0 6px;border:1px solid var(--line2);border-radius:999px;font-size:12.5px;color:var(--ink2);background:var(--card)}
.mk-ss .np .pp{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:var(--ink);color:var(--paper)}
.mk-ss .np .t{font-variant-numeric:tabular-nums;color:var(--muted)}
.mk-ss .eq{display:inline-flex;gap:2px;align-items:flex-end;height:12px}
.mk-ss .eq i{width:3px;border-radius:2px;background:var(--sage);height:5px}
.mk-ss .eq i:nth-child(2){background:var(--sand);height:10px}
.mk-ss .eq i:nth-child(3){height:7px}
.mk-ss .listen{height:40px;padding:0 16px 0 14px;border-radius:999px;background:var(--ink);color:var(--paper);display:flex;align-items:center;gap:8px;font-weight:600;font-size:14px;box-shadow:0 1px 0 rgba(0,0,0,.08)}
.mk-ss .listen:hover{background:#38342d}
.mk-ss .listen[aria-expanded="true"] .cv{transform:rotate(180deg)}
.mk-ss .listen .cv{display:inline-flex;transition:transform .2s;opacity:.7}
.mk-ss .scrim{position:absolute;inset:0;z-index:20;cursor:default}
.mk-ss .menu{position:absolute;top:60px;right:48px;z-index:21;width:292px;background:#fcfaf6;border:1px solid var(--line2);border-radius:14px;box-shadow:0 18px 40px -12px rgba(52,40,24,.28),0 2px 6px rgba(52,40,24,.08);padding:8px}
.mk-ss .menu h4{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:600;padding:8px 10px 6px}
.mk-ss .menu button{display:flex;align-items:center;gap:12px;width:100%;padding:9px 10px;border-radius:10px}
.mk-ss .menu button:hover{background:var(--paper2)}
.mk-ss .menu .ic{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;flex:none}
.mk-ss .menu .ic.ts{background:var(--sand-t);color:var(--sand-d)}
.mk-ss .menu .ic.tg{background:var(--sage-t);color:var(--sage-d)}
.mk-ss .menu .ic.nn{background:var(--paper2);color:var(--ink2)}
.mk-ss .menu .mt{flex:1;min-width:0}
.mk-ss .menu .mt b{display:block;font-size:13.5px;font-weight:600}
.mk-ss .menu .mt span{display:block;font-size:12px;color:var(--muted)}
.mk-ss .menu .ok{font-size:12px;color:var(--sage-d);font-weight:600;display:flex;align-items:center;gap:4px}
.mk-ss .menu hr{border:0;border-top:1px solid var(--line);margin:6px 4px}

/* pages */
.mk-ss .pg{flex:1;min-height:0;overflow:auto;padding:30px 56px 32px;scrollbar-width:thin;scrollbar-color:var(--line2) transparent}
.mk-ss .kick{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--sand-d)}
.mk-ss .kick .dd{display:inline-flex;width:14px;height:8px;border-radius:4px;overflow:hidden}
.mk-ss .kick .dd i{flex:1;background:var(--sand)}
.mk-ss .kick .dd i+i{background:var(--sage)}
.mk-ss .spill{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:600}
.mk-ss .spill.is-a{background:var(--sand);color:#fff}
.mk-ss .spill.is-b{background:var(--sage);color:#fff}
.mk-ss .tag{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:500;color:var(--ink2)}
.mk-ss .tag i{width:7px;height:7px;border-radius:50%}

/* home */
.mk-ss .intro{display:grid;grid-template-columns:1fr 380px;gap:40px;align-items:end;margin-bottom:22px}
.mk-ss .intro h1{font-family:var(--serif);font-weight:400;font-size:42px;line-height:1.08;letter-spacing:-.015em;margin:10px 0 10px}
.mk-ss .intro h1 em{font-style:italic;background:linear-gradient(90deg,var(--sand-d) 0 46%,var(--sage-d) 54% 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.mk-ss .intro p{font-size:15px;color:var(--ink2);max-width:660px;line-height:1.55}
.mk-ss .stats{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);border-radius:14px;background:var(--card)}
.mk-ss .stats div{padding:14px 18px}
.mk-ss .stats div+div{border-left:1px solid var(--line)}
.mk-ss .stats b{display:block;font-family:var(--serif);font-weight:400;font-size:28px;line-height:1.1;letter-spacing:-.01em}
.mk-ss .stats span{font-size:12px;color:var(--muted)}
.mk-ss .stats-cap{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:12.5px;color:var(--muted)}
.mk-ss .stats-cap .livedot{width:7px;height:7px;border-radius:50%;background:var(--sage)}

.mk-ss .deb{display:grid;grid-template-columns:1fr 352px 1fr;border:1px solid var(--line2);border-radius:20px;overflow:hidden;background:var(--card);box-shadow:0 24px 50px -30px rgba(70,52,30,.35);height:470px}
.mk-ss .side{padding:26px 28px;display:flex;flex-direction:column;position:relative}
.mk-ss .side.is-a{background:linear-gradient(180deg,var(--sand-t),#f3eadf)}
.mk-ss .side.is-b{background:linear-gradient(180deg,var(--sage-t),#e9eee4)}
.mk-ss .side-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.mk-ss .side-h small{font-size:12px;color:var(--muted)}
.mk-ss .stance{font-family:var(--serif);font-size:21px;line-height:1.25;margin-bottom:18px;letter-spacing:-.005em}
.mk-ss .args{display:flex;flex-direction:column;gap:12px}
.mk-ss .arg{display:grid;grid-template-columns:26px 1fr;gap:12px;align-items:start;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.7)}
.mk-ss .arg .no{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700;font-family:"IBM Plex Mono",monospace}
.mk-ss .side.is-a .arg .no{background:var(--sand-t2);color:var(--sand-d)}
.mk-ss .side.is-b .arg .no{background:var(--sage-t2);color:var(--sage-d)}
.mk-ss .arg p{font-size:14px;line-height:1.5;color:var(--ink)}
.mk-ss .cite{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:18px;padding:0 5px;margin-left:4px;border-radius:5px;font-size:11px;font-weight:600;font-family:"IBM Plex Mono",monospace;vertical-align:2px;transition:background .15s,color .15s}
.mk-ss .is-a .cite{background:var(--sand-t2);color:var(--sand-d)}
.mk-ss .is-b .cite{background:var(--sage-t2);color:var(--sage-d)}
.mk-ss .is-a .cite:hover,.mk-ss .is-a .cite.is-on{background:var(--sand);color:#fff}
.mk-ss .is-b .cite:hover,.mk-ss .is-b .cite.is-on{background:var(--sage);color:#fff}
.mk-ss .mid{border-left:1px solid var(--line2);border-right:1px solid var(--line2);padding:24px 28px 22px;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;background:var(--card)}
.mk-ss .mid .meta{font-size:12px;color:var(--muted);margin-top:6px}
.mk-ss .mid h2{font-family:var(--serif);font-weight:400;font-size:28px;line-height:1.16;letter-spacing:-.01em;margin:12px 0 16px}
.mk-ss .bigplay{width:64px;height:64px;border-radius:50%;background:var(--ink);color:var(--paper);display:grid;place-items:center;position:relative;box-shadow:0 10px 24px -10px rgba(34,32,28,.6);transition:transform .15s}
.mk-ss .bigplay:hover{transform:scale(1.05)}
.mk-ss .bigplay::before{content:"";position:absolute;inset:-6px;border-radius:50%;border:1.5px solid var(--line2)}
.mk-ss .bigplay svg{margin-left:3px}
.mk-ss .bigplay.is-on svg{margin-left:0}
.mk-ss .pmeta{display:flex;align-items:center;gap:8px;margin-top:14px;font-size:13px;color:var(--ink2);font-variant-numeric:tabular-nums}
.mk-ss .pmeta .sep{width:3px;height:3px;border-radius:50%;background:var(--line2)}
.mk-ss .wave{display:flex;align-items:center;gap:2px;height:26px;width:100%;margin-top:10px}
.mk-ss .wave i{flex:1;border-radius:2px;background:var(--line2)}
.mk-ss .wave i.pa{background:var(--sand)}
.mk-ss .wave i.pb{background:var(--sage)}
.mk-ss .meter{width:100%;margin-top:auto;padding-top:12px;border-top:1px solid var(--line)}
.mk-ss .meter-h{display:flex;justify-content:space-between;align-items:baseline;font-size:12px;color:var(--muted);margin-bottom:8px}
.mk-ss .meter-h b{color:var(--ink);font-weight:600;font-size:12.5px}
.mk-ss .mbar{position:relative;height:10px;border-radius:999px;display:flex;overflow:hidden;background:var(--paper2)}
.mk-ss .mbar .is-x{background:var(--sand)}
.mk-ss .mbar .is-y{background:var(--sage)}
.mk-ss .mtick{position:absolute;left:50%;top:-3px;bottom:-3px;width:2px;background:var(--ink);border-radius:1px}
.mk-ss .meter-l{display:flex;justify-content:space-between;margin-top:7px;font-size:12px;font-weight:600}
.mk-ss .meter-l .is-x{color:var(--sand-d)}
.mk-ss .meter-l .is-y{color:var(--sage-d)}
.mk-ss .readbtn{margin-top:14px;display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--ink);padding:10px 16px;border-radius:999px;border:1px solid var(--line2);background:#fff9}
.mk-ss .readbtn:hover{background:#fff;border-color:var(--ink)}
.mk-ss .hostf{margin-top:auto;padding-top:14px;display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--muted)}
.mk-ss .hostf b{color:var(--ink);font-weight:600}
.mk-ss .hostf-x{margin-left:auto;font-size:12px}
.mk-ss .miniav{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:10.5px;font-weight:700;letter-spacing:.02em;flex:none}
.mk-ss .best{margin-top:18px;border-radius:12px;padding:12px 14px;background:rgba(255,255,255,.6);border:1px dashed rgba(34,32,28,.16)}
.mk-ss .best-k{display:flex;justify-content:space-between;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
.mk-ss .best p{font-family:var(--serif);font-size:15px;line-height:1.35}
.mk-ss .grade{display:inline-flex;align-items:center;gap:6px;letter-spacing:0;text-transform:none;font-size:12px;color:var(--ink2)}
.mk-ss .grade i{display:inline-flex;gap:2px}
.mk-ss .grade i u{width:6px;height:10px;border-radius:2px;background:var(--line2);text-decoration:none}
.mk-ss .is-a .grade i u.f{background:var(--sand)}
.mk-ss .is-b .grade i u.f{background:var(--sage)}
.mk-ss .sp-side-f .hostf{margin-top:0}

/* episodes */
.mk-ss .ph{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:18px}
.mk-ss .ph h2{font-family:var(--serif);font-weight:400;font-size:36px;line-height:1.1;letter-spacing:-.01em;margin-top:8px}
.mk-ss .ph p{font-size:14px;color:var(--muted);margin-top:4px}
.mk-ss .seg{display:inline-flex;padding:3px;border-radius:999px;background:var(--paper2);border:1px solid var(--line)}
.mk-ss .seg button{padding:6px 14px;border-radius:999px;font-size:13px;font-weight:500;color:var(--ink2)}
.mk-ss .seg button[aria-pressed="true"]{background:#fff;color:var(--ink);box-shadow:0 1px 2px rgba(0,0,0,.08)}
.mk-ss .chips{display:flex;gap:8px;margin-bottom:18px;align-items:center}
.mk-ss .chip{display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 14px;border-radius:999px;border:1px solid var(--line2);font-size:13.5px;font-weight:500;background:var(--card);transition:all .15s}
.mk-ss .chip:hover{border-color:var(--ink2)}
.mk-ss .chip i{width:8px;height:8px;border-radius:50%}
.mk-ss .chip span{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
.mk-ss .chip[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.mk-ss .chip[aria-pressed="true"] span{color:#c9c0b2}
.mk-ss .chips .cnt{margin-left:auto;font-size:12.5px;color:var(--muted)}
.mk-ss .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.mk-ss .ec{position:relative;display:flex;flex-direction:column;height:166px;padding:18px 18px 14px;border-radius:14px;border:1px solid var(--line);background:var(--card);overflow:hidden;transition:transform .18s,box-shadow .18s,border-color .18s}
.mk-ss .ec:hover{transform:translateY(-2px);border-color:var(--line2);box-shadow:0 14px 28px -18px rgba(70,52,30,.45)}
.mk-ss .ec .split{position:absolute;left:0;right:0;top:0;height:4px;display:flex}
.mk-ss .ec .split i{background:var(--sand)}
.mk-ss .ec .split i+i{background:var(--sage);flex:1}
.mk-ss .ec-t{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--muted)}
.mk-ss .ec h3{font-family:var(--serif);font-weight:400;font-size:18.5px;line-height:1.25;margin-top:10px;letter-spacing:-.005em}
.mk-ss .ec-f{margin-top:auto;display:flex;align-items:center;gap:12px;font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
.mk-ss .ec-f span{display:inline-flex;align-items:center;gap:5px}
.mk-ss .ec-f .vs{margin-left:auto;display:flex;gap:4px;font-weight:600}
.mk-ss .ec-f .vs .is-x{color:var(--sand-d)}
.mk-ss .ec-f .vs .is-y{color:var(--sage-d)}
.mk-ss .ec.new{border-color:var(--sand)}
.mk-ss .newb{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--sand-d);background:var(--sand-t);padding:2px 7px;border-radius:5px}
.mk-ss .topic{display:grid;grid-template-columns:260px 1fr 300px;gap:28px;margin-top:16px;padding:20px 22px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(90deg,var(--sand-t) 0,var(--card) 34%,var(--card) 66%,var(--sage-t) 100%)}
.mk-ss .topic-l b{display:block;font-family:var(--serif);font-weight:400;font-size:22px;margin:8px 0 6px;line-height:1.2}
.mk-ss .topic-l p{font-size:13px;color:var(--ink2);line-height:1.5}
.mk-ss .topic-s{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mk-ss .topic-s>div,.mk-ss .topic-top{background:rgba(255,255,255,.7);border:1px solid var(--line);border-radius:12px;padding:10px 14px}
.mk-ss .topic-s span{display:block;font-size:11.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.mk-ss .topic-s b{display:block;font-family:var(--serif);font-weight:400;font-size:24px;line-height:1.2;margin-top:2px}
.mk-ss .topic-s small{display:block;font-size:12px;color:var(--muted)}
.mk-ss .topic-top{grid-column:1/-1;text-align:left;transition:border-color .15s}
.mk-ss .topic-top:hover{border-color:var(--ink2)}
.mk-ss .topic-top em{display:block;font-family:var(--serif);font-style:normal;font-size:16px;margin:2px 0}
.mk-ss .topic-k{display:block;font-size:11.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
.mk-ss .vrow{display:grid;grid-template-columns:56px 1fr 36px;gap:10px;align-items:center;font-size:12px;color:var(--muted);padding:5px 0}
.mk-ss .vtrack{display:flex;height:10px;border-radius:999px;overflow:hidden;gap:2px}
.mk-ss .vtrack i{background:var(--sand)}
.mk-ss .vtrack i+i{flex:1;background:var(--sage)}
.mk-ss .vnum{text-align:right;font-weight:600;color:var(--sand-d);font-variant-numeric:tabular-nums}
.mk-ss .more{display:flex;justify-content:center;margin-top:18px}
.mk-ss .more button{font-size:13px;font-weight:600;padding:9px 16px;border-radius:999px;border:1px solid var(--line2);color:var(--ink2)}

/* detail */
.mk-ss .dt{display:grid;grid-template-columns:1fr 318px;gap:24px;height:100%}
.mk-ss .dt-main{display:flex;flex-direction:column;min-height:0}
.mk-ss .crumbs{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--muted)}
.mk-ss .back{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px 0 10px;border-radius:999px;border:1px solid var(--line2);font-size:13px;font-weight:500;color:var(--ink2);background:var(--card)}
.mk-ss .back:hover{border-color:var(--ink2);color:var(--ink)}
.mk-ss .dt h1{font-family:var(--serif);font-weight:400;font-size:33px;line-height:1.14;letter-spacing:-.012em;margin:14px 0 6px}
.mk-ss .dt-meta{display:flex;gap:14px;font-size:13px;color:var(--muted);margin-bottom:16px;align-items:center}
.mk-ss .dt-meta span{display:inline-flex;align-items:center;gap:5px}
.mk-ss .splitv{position:relative;display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line2);border-radius:18px;overflow:hidden;flex:1;min-height:0}
.mk-ss .splitv .side{padding:22px 24px}
.mk-ss .splitv .side.is-b{border-left:1px solid var(--line2)}
.mk-ss .vs-badge{position:absolute;left:50%;top:22px;transform:translateX(-50%);width:34px;height:34px;border-radius:50%;background:var(--card);border:1px solid var(--line2);display:grid;place-items:center;font-family:var(--serif);font-style:italic;font-size:14px;color:var(--ink2);z-index:2}
.mk-ss .splitv .stance{font-size:20px;margin-bottom:14px;padding-right:20px}
.mk-ss .splitv .side.is-b .stance{padding:0 0 0 20px}
.mk-ss .splitv .side.is-b .side-h{padding-left:20px}
.mk-ss .dargs{display:flex;flex-direction:column}
.mk-ss .darg{display:grid;grid-template-columns:38px 1fr;gap:10px;padding:13px 0;border-top:1px solid rgba(34,32,28,.08)}
.mk-ss .darg .num{font-family:var(--serif);font-size:24px;line-height:1;font-style:italic}
.mk-ss .side.is-a .darg .num{color:var(--sand)}
.mk-ss .side.is-b .darg .num{color:var(--sage)}
.mk-ss .darg p{font-size:14px;line-height:1.55}
.mk-ss .rail{display:flex;flex-direction:column;gap:14px;min-height:0;overflow:auto;scrollbar-width:none}
.mk-ss .card{border:1px solid var(--line);border-radius:16px;background:var(--card);padding:16px 18px}
.mk-ss .card h4{font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:600;margin-bottom:10px;display:flex;justify-content:space-between}
.mk-ss .player{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.mk-ss .player h4{color:#a69d8f}
.mk-ss .player .ttl{font-family:var(--serif);font-size:16px;line-height:1.3;margin-bottom:12px}
.mk-ss .prog{display:flex;gap:3px;height:6px}
.mk-ss .prog button{position:relative;height:6px;border-radius:3px;background:#4a453d;overflow:hidden}
.mk-ss .prog button i{position:absolute;left:0;top:0;bottom:0;border-radius:3px}
.mk-ss .prog button:hover{background:#5b554b}
.mk-ss .ptime{display:flex;justify-content:space-between;font-size:12px;color:#a69d8f;margin-top:7px;font-variant-numeric:tabular-nums}
.mk-ss .ptime b{color:var(--paper);font-weight:500}
.mk-ss .pctl{display:flex;align-items:center;justify-content:space-between;margin-top:10px}
.mk-ss .pctl .sm{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:#d8d0c3}
.mk-ss .pctl .sm:hover{background:#38342d;color:#fff}
.mk-ss .pctl .pl{width:50px;height:50px;border-radius:50%;background:var(--paper);color:var(--ink);display:grid;place-items:center}
.mk-ss .pctl .pl svg{margin-left:2px}
.mk-ss .pctl .pl.is-on svg{margin-left:0}
.mk-ss .pctl .spd{height:28px;min-width:44px;padding:0 8px;border-radius:8px;border:1px solid #4a453d;font-size:12px;font-weight:600;color:#d8d0c3;font-variant-numeric:tabular-nums}
.mk-ss .vote p.q{font-family:var(--serif);font-size:17px;line-height:1.3;margin-bottom:12px}
.mk-ss .vbtns{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.mk-ss .vbtn{height:44px;border-radius:11px;font-weight:600;font-size:13.5px;display:flex;align-items:center;justify-content:center;gap:8px;transition:transform .12s,background .15s}
.mk-ss .vbtn:active{transform:scale(.97)}
.mk-ss .vbtn.is-a{background:var(--sand-t);color:var(--sand-d);border:1px solid var(--sand-t2)}
.mk-ss .vbtn.is-a:hover{background:var(--sand);color:#fff}
.mk-ss .vbtn.is-b{background:var(--sage-t);color:var(--sage-d);border:1px solid var(--sage-t2)}
.mk-ss .vbtn.is-b:hover{background:var(--sage);color:#fff}
.mk-ss .vnote{font-size:12px;color:var(--muted);margin-top:10px}
.mk-ss .vres .vbar{display:flex;height:34px;border-radius:10px;overflow:hidden;font-size:13px;font-weight:700;color:#fff}
.mk-ss .vres .vbar div{display:flex;align-items:center;padding:0 10px;white-space:nowrap}
.mk-ss .vres .vbar .is-x{background:var(--sand)}
.mk-ss .vres .vbar .is-y{background:var(--sage);justify-content:flex-end}
.mk-ss .vres .vl{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-top:8px}
.mk-ss .vres .you{display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid var(--line);font-size:12.5px}
.mk-ss .vres .you b{display:inline-flex;align-items:center;gap:6px;font-weight:600}
.mk-ss .vres .you button{font-size:12.5px;color:var(--muted);text-decoration:underline;text-underline-offset:2px}
@media (prefers-reduced-motion:no-preference){
.mk-ss .vres .vbar div{animation:mk-ss-grow .6s cubic-bezier(.2,.8,.2,1) both}
.mk-ss .eq.is-on i{animation:mk-ss-eq .9s ease-in-out infinite alternate}
.mk-ss .eq.is-on i:nth-child(2){animation-delay:-.3s}
.mk-ss .eq.is-on i:nth-child(3){animation-delay:-.6s}
.mk-ss .fade{animation:mk-ss-in .35s ease both}
}
@keyframes mk-ss-grow{from{max-width:0}to{max-width:100%}}
@keyframes mk-ss-eq{from{height:3px}to{height:12px}}
@keyframes mk-ss-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.mk-ss .srcs li{display:grid;grid-template-columns:24px 1fr;gap:6px;padding:5px 6px;margin:0 -6px;border-radius:8px;font-size:12.5px;line-height:1.4;white-space:nowrap;color:var(--ink2);transition:background .2s}
.mk-ss .srcs li .nn{font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:600;color:var(--muted);padding-top:1px}
.mk-ss .srcs .st{overflow:hidden;text-overflow:ellipsis}
.mk-ss .srcs li.is-on{background:var(--paper2);color:var(--ink)}
.mk-ss .srcs li.is-on .nn{color:var(--ink)}

/* format */
.mk-ss .fmt-h{display:grid;grid-template-columns:1fr 380px;gap:48px;align-items:end;margin-bottom:24px}
.mk-ss .fmt-h h2{font-family:var(--serif);font-weight:400;font-size:40px;line-height:1.08;letter-spacing:-.015em;margin-top:10px}
.mk-ss .fmt-h p{font-size:15px;color:var(--ink2);line-height:1.55}
.mk-ss .flow{display:grid;grid-template-columns:1fr 56px 1fr 56px 1fr;align-items:stretch;margin-bottom:22px}
.mk-ss .step{border:1px solid var(--line);border-radius:18px;background:var(--card);padding:20px 22px;display:flex;flex-direction:column;gap:4px}
.mk-ss .step .art{height:84px;border-radius:12px;display:grid;place-items:center;margin-bottom:12px}
.mk-ss .step .sn{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--muted);font-weight:600}
.mk-ss .step h3{font-family:var(--serif);font-weight:400;font-size:23px;letter-spacing:-.005em}
.mk-ss .step p{font-size:13.5px;color:var(--ink2);line-height:1.5}
.mk-ss .conn{display:flex;align-items:center;justify-content:center;color:var(--line2)}
.mk-ss .anat{border:1px solid var(--line);border-radius:18px;background:var(--card);padding:18px 22px}
.mk-ss .anat-h{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px}
.mk-ss .anat-h b{font-family:var(--serif);font-weight:400;font-size:19px}
.mk-ss .anat-h span{font-size:12.5px;color:var(--muted)}
.mk-ss .seglist{display:flex;gap:4px}
.mk-ss .seglist button{height:44px;border-radius:9px;padding:0 12px;display:flex;flex-direction:column;justify-content:center;font-size:12.5px;font-weight:600;line-height:1.25;border:2px solid transparent;transition:filter .15s,border-color .15s;overflow:hidden;white-space:nowrap}
.mk-ss .seglist button span{font-weight:500;font-size:11px;opacity:.8;font-variant-numeric:tabular-nums}
.mk-ss .seglist button:hover{filter:brightness(.97)}
.mk-ss .seglist button[aria-pressed="true"]{border-color:var(--ink)}
.mk-ss .tl-d{display:flex;align-items:center;gap:14px;margin-top:12px;font-size:13.5px;color:var(--ink2);min-height:22px}
.mk-ss .tl-d b{color:var(--ink);font-weight:600}
.mk-ss .rrow{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:16px}
.mk-ss .rr{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border-radius:14px;border:1px solid var(--line)}
.mk-ss .rr b{display:block;font-size:13.5px;font-weight:600}
.mk-ss .rr p{font-size:12.5px;color:var(--muted);line-height:1.45;margin-top:2px}
.mk-ss .ri{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;background:var(--paper2);color:var(--ink2);flex:none}
.mk-ss .queue{margin-top:16px}
.mk-ss .qrow{display:flex;align-items:center;gap:14px;padding:10px 0;border-top:1px solid var(--line)}
.mk-ss .qrow:first-of-type{border-top:0;padding-top:2px}
.mk-ss .qrow p{flex:1;font-family:var(--serif);font-size:15.5px;line-height:1.3}
.mk-ss .qrow small{display:block;font-family:Inter,sans-serif;font-size:12px;color:var(--muted);margin-top:2px}
.mk-ss .up{display:flex;flex-direction:column;align-items:center;justify-content:center;width:52px;height:46px;border-radius:10px;border:1px solid var(--line2);font-size:12.5px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--ink2);transition:all .15s;flex:none;line-height:1.1}
.mk-ss .up:hover{border-color:var(--ink2)}
.mk-ss .up[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.mk-ss .stype{margin-top:4px}
.mk-ss .stbar{display:flex;height:12px;border-radius:999px;overflow:hidden;gap:2px;margin:4px 0 12px}
.mk-ss .stl{display:grid;grid-template-columns:1fr 1fr;gap:6px 16px}
.mk-ss .stl span{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ink2)}
.mk-ss .stl span i{width:8px;height:8px;border-radius:2px}
.mk-ss .stl span b{margin-left:auto;font-weight:600;font-variant-numeric:tabular-nums}
.mk-ss .tl-ax{display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-top:6px;font-variant-numeric:tabular-nums;font-family:"IBM Plex Mono",monospace}

/* about */
.mk-ss .ab{display:grid;grid-template-columns:1fr 420px;gap:44px}
.mk-ss .ab h2{font-family:var(--serif);font-weight:400;font-size:40px;line-height:1.08;letter-spacing:-.015em;margin:10px 0 14px}
.mk-ss .ab .lead{font-size:15.5px;color:var(--ink2);line-height:1.6;max-width:600px}
.mk-ss .hosts{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:22px}
.mk-ss .host{border:1px solid var(--line);border-radius:16px;padding:16px;background:var(--card);display:flex;gap:14px;align-items:flex-start}
.mk-ss .av{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;color:#fff;font-family:var(--serif);font-size:19px;flex:none}
.mk-ss .host b{display:block;font-size:14.5px;font-weight:600}
.mk-ss .host .role{display:block;font-size:12.5px;color:var(--muted);margin-bottom:6px}
.mk-ss .host p{font-size:13px;line-height:1.5;color:var(--ink2)}
.mk-ss .rules li{display:grid;grid-template-columns:28px 1fr;gap:10px;padding:11px 0;border-top:1px solid var(--line);font-size:13.5px;line-height:1.5;color:var(--ink2)}
.mk-ss .rules li:first-child{border-top:0;padding-top:0}
.mk-ss .rules li b{color:var(--ink);font-weight:600}
.mk-ss .rules .ri{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:var(--paper2);color:var(--ink2)}
.mk-ss .nums{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:16px;overflow:hidden;margin-bottom:16px}
.mk-ss .nums div{background:var(--card);padding:14px 16px}
.mk-ss .nums b{display:block;font-family:var(--serif);font-weight:400;font-size:28px;line-height:1.1}
.mk-ss .nums span{font-size:12px;color:var(--muted)}
`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const SPEEDS = [1, 1.25, 1.5, 2];

const QUEUE = [
  { q: "Should private schools pay VAT?", cat: "Economics", by: "Hannah, Leeds", n: 412 },
  { q: "Should we lower the voting age to 16?", cat: "Society", by: "Marcus, Cardiff", n: 368 },
  {
    q: "Are electric cars greener over their lifetime?",
    cat: "Environment",
    by: "Priya, Bristol",
    n: 297,
  },
];

const STYPES = [
  { l: "Peer-reviewed", v: 46, c: "#8a6237" },
  { l: "Official statistics", v: 28, c: "#b98b5e" },
  { l: "Independent reviews", v: 15, c: "#7f9a7a" },
  { l: "Large surveys", v: 11, c: "#52694f" },
];

export default function SandalwoodSageMockup() {
  const [view, setView] = useState<View>("home");
  const [epN, setEpN] = useState(64);
  const [cat, setCat] = useState<Cat | "All">("All");
  const [sort, setSort] = useState<"new" | "votes">("new");
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [player, setPlayer] = useState<{ n: number; t: number; on: boolean }>({
    n: 64,
    t: 0,
    on: false,
  });
  const [speed, setSpeed] = useState(1);
  const [votes, setVotes] = useState<Record<number, "a" | "b">>({});
  const [cite, setCite] = useState<number | null>(null);
  const [seg, setSeg] = useState("a");
  const [ups, setUps] = useState<Record<number, boolean>>({});

  const ep = EPS.find((e) => e.n === epN) ?? EPS[0];
  const pEp = EPS.find((e) => e.n === player.n) ?? EPS[0];

  useEffect(() => {
    if (!player.on) return;
    const id = setInterval(() => {
      setPlayer((p) => {
        const d = (EPS.find((e) => e.n === p.n) ?? EPS[0]).dur;
        const t = Math.min(d, p.t + speed);
        return { ...p, t, on: t < d };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [player.on, speed]);

  const toggle = (n: number) =>
    setPlayer((p) => (p.n === n ? { ...p, on: !p.on } : { n, t: 0, on: true }));
  const seek = (n: number, t: number) =>
    setPlayer((p) => ({
      n,
      t: Math.max(0, Math.min(t, (EPS.find((e) => e.n === n) ?? EPS[0]).dur)),
      on: p.n === n ? p.on : false,
    }));

  const open = (n: number) => {
    setEpN(n);
    setCite(null);
    setView("episode");
  };

  const list = useMemo(() => {
    const f = EPS.filter((e) => cat === "All" || e.cat === cat);
    return sort === "new"
      ? f
      : [...f].sort((x, y) => y.votes[0] + y.votes[1] - (x.votes[0] + x.votes[1]));
  }, [cat, sort]);

  const nav: [View, string][] = [
    ["home", "Home"],
    ["episodes", "Episodes"],
    ["format", "The format"],
    ["about", "About"],
  ];
  const navActive = view === "episode" ? "episodes" : view;

  const playingHere = (n: number) => player.n === n && player.on;

  /* --------------------------- views --------------------------- */

  const renderArgs = (side: Side, detailed: boolean) =>
    detailed ? (
      <ol className="dargs">
        {side.args.map((g, i) => (
          <li className="darg" key={i}>
            <span className="num">0{i + 1}</span>
            <p>
              {g.t}
              {g.c.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`cite${cite === c ? " is-on" : ""}`}
                  aria-label={`Source ${c}`}
                  aria-pressed={cite === c}
                  onClick={() => setCite(cite === c ? null : c)}
                >
                  {c}
                </button>
              ))}
            </p>
          </li>
        ))}
      </ol>
    ) : (
      <ol className="args">
        {side.args.map((g, i) => (
          <li className="arg" key={i}>
            <span className="no">{i + 1}</span>
            <p>
              {g.t}
              {g.c.map((c) => (
                <span key={c} className="cite">
                  {c}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ol>
    );

  const home = () => {
    const e = EPS[0];
    const on = playingHere(e.n);
    const t = player.n === e.n ? player.t : 0;
    const frac = t / e.dur;
    return (
      <div className="fade">
        <div className="intro">
          <div>
            <span className="kick">
              <span className="dd">
                <i />
                <i />
              </span>
              Short, structured debates
            </span>
            <h1>
              One question. <em>Two sides.</em>
              <br />
              Fifteen minutes.
            </h1>
            <p>
              Every episode takes a single question and builds the strongest case for each side,
              using evidence rather than opinion. We cite everything. You decide who made the better
              case.
            </p>
          </div>
          <div>
            <div className="stats">
              <div>
                <b>64</b>
                <span>Debates so far</span>
              </div>
              <div>
                <b>15 min</b>
                <span>Every episode</span>
              </div>
              <div>
                <b>1,140</b>
                <span>Sources cited</span>
              </div>
            </div>
            <div className="stats-cap">
              <span className="livedot" /> New debate every Tuesday at 6am
            </div>
          </div>
        </div>

        <article className="deb">
          <div className="side is-a">
            <div className="side-h">
              <span className="spill is-a">Side A</span>
              <small>3 arguments · {e.a.args.reduce((n, g) => n + g.c.length, 0)} citations</small>
            </div>
            <h3 className="stance">{e.a.label}</h3>
            {renderArgs(e.a, false)}
            <HostTag side="a" />
          </div>
          <div className="mid">
            <span className="kick">Latest debate</span>
            <div className="meta">
              Ep. {e.n} · {e.cat} · {e.date}
            </div>
            <h2>{e.q}</h2>
            <button
              type="button"
              className={`bigplay${on ? " is-on" : ""}`}
              aria-label={on ? "Pause episode" : "Play episode"}
              onClick={() => toggle(e.n)}
            >
              {on ? I.pause(24) : I.play(24)}
            </button>
            <div className="pmeta">
              {on || t > 0 ? (
                <>
                  <span className={`eq${on ? " is-on" : ""}`}>
                    <i />
                    <i />
                    <i />
                  </span>
                  {fmt(t)} / {fmt(e.dur)}
                </>
              ) : (
                <>
                  {I.clock} 15 min <span className="sep" /> {comma(e.votes[0] + e.votes[1])} votes
                </>
              )}
            </div>
            <div className="wave" aria-hidden="true">
              {WAVE.map((h, i) => {
                const played = i / WAVE.length < frac;
                return (
                  <i
                    key={i}
                    className={played ? (i < WAVE.length / 2 ? "pa" : "pb") : ""}
                    style={{ height: `${h}%` }}
                  />
                );
              })}
            </div>
            <div className="meter">
              <div className="meter-h">
                <b>Evidence meter</b>
                <span>{e.src.length + 11} sources weighed</span>
              </div>
              <div className="mbar">
                <div className="is-x" style={{ width: `${e.ev}%` }} />
                <div className="is-y" style={{ flex: 1 }} />
                <span className="mtick" />
              </div>
              <div className="meter-l">
                <span className="is-x">A · {e.ev}%</span>
                <span className="is-y">{100 - e.ev}% · B</span>
              </div>
            </div>
            <button type="button" className="readbtn" onClick={() => open(e.n)}>
              Read both sides and vote {I.right}
            </button>
          </div>
          <div className="side is-b">
            <div className="side-h">
              <span className="spill is-b">Side B</span>
              <small>3 arguments · {e.b.args.reduce((n, g) => n + g.c.length, 0)} citations</small>
            </div>
            <h3 className="stance">{e.b.label}</h3>
            {renderArgs(e.b, false)}
            <HostTag side="b" />
          </div>
        </article>
      </div>
    );
  };

  const episodes = () => (
    <div className="fade">
      <div className="ph">
        <div>
          <span className="kick">Archive</span>
          <h2>Every debate</h2>
          <p>64 episodes and 1,140 cited sources. Pick a topic, then pick a side.</p>
        </div>
        <div className="seg" role="group" aria-label="Sort episodes">
          <button type="button" aria-pressed={sort === "new"} onClick={() => setSort("new")}>
            Newest
          </button>
          <button type="button" aria-pressed={sort === "votes"} onClick={() => setSort("votes")}>
            Most voted
          </button>
        </div>
      </div>
      <div className="chips" role="group" aria-label="Filter by topic">
        <button
          type="button"
          className="chip"
          aria-pressed={cat === "All"}
          onClick={() => setCat("All")}
        >
          All topics <span>64</span>
        </button>
        {CATS.map((c) => (
          <button
            type="button"
            key={c}
            className="chip"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
          >
            <i style={{ background: CAT_TONE[c] }} />
            {c} <span>{CAT_TOTAL[c]}</span>
          </button>
        ))}
        <span className="cnt">
          Showing {list.length} of {cat === "All" ? 64 : CAT_TOTAL[cat]}
        </span>
      </div>
      <div className="grid">
        {list.map((e) => {
          const tot = e.votes[0] + e.votes[1];
          const pa = Math.round((e.votes[0] / tot) * 100);
          return (
            <button
              type="button"
              key={e.n}
              className={`ec${e.n === 64 ? " new" : ""}`}
              onClick={() => open(e.n)}
            >
              <span className="split" aria-hidden="true">
                <i style={{ width: `${pa}%` }} />
                <i />
              </span>
              <span className="ec-t">
                <span className="tag">
                  <i style={{ background: CAT_TONE[e.cat] }} />
                  {e.cat}
                </span>
                {e.n === 64 ? (
                  <span className="newb">New</span>
                ) : (
                  <span className="mono">Ep. {e.n}</span>
                )}
              </span>
              <h3>{e.q}</h3>
              <span className="ec-f">
                <span>
                  {I.clock}
                  {fmt(e.dur)}
                </span>
                <span>{e.date.replace(" 2026", "")}</span>
                <span className="vs">
                  <span className="is-x">A {pa}%</span>
                  <span className="is-y">B {100 - pa}%</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {cat !== "All" && <TopicPanel cat={cat} list={list} onOpen={open} />}
      <div className="more">
        <button type="button">Load older debates</button>
      </div>
    </div>
  );

  const detail = () => {
    const e = ep;
    const ch = chapters(e.dur);
    const mine = player.n === e.n;
    const t = mine ? player.t : 0;
    const on = mine && player.on;
    const curCh = ch.find((c) => t >= c.from && t < c.to) ?? ch[ch.length - 1];
    const v = votes[e.n];
    const va = e.votes[0] + (v === "a" ? 1 : 0);
    const vb = e.votes[1] + (v === "b" ? 1 : 0);
    const pa = Math.round((va / (va + vb)) * 100);
    const chColor: Record<string, string> = {
      q: "#d8d0c3",
      a: "#b98b5e",
      b: "#7f9a7a",
      e: "#c9b48f",
      y: "#d8d0c3",
    };
    return (
      <div className="dt fade" key={e.n}>
        <div className="dt-main">
          <div className="crumbs">
            <button type="button" className="back" onClick={() => setView("episodes")}>
              {I.left} All debates
            </button>
            <span>
              Episodes / {e.cat} / Ep. {e.n}
            </span>
          </div>
          <h1>{e.q}</h1>
          <div className="dt-meta">
            <span className="tag">
              <i style={{ background: CAT_TONE[e.cat] }} />
              {e.cat}
            </span>
            <span>
              {I.clock} {fmt(e.dur)}
            </span>
            <span>{e.date}</span>
            <span>
              {I.book} {e.src.length} sources
            </span>
          </div>
          <div className="splitv">
            <span className="vs-badge" aria-hidden="true">
              vs
            </span>
            <div className="side is-a">
              <div className="side-h">
                <span className="spill is-a">Side A · For</span>
              </div>
              <h3 className="stance">{e.a.label}</h3>
              {renderArgs(e.a, true)}
              <Best e={e} side="a" />
            </div>
            <div className="side is-b">
              <div className="side-h">
                <span className="spill is-b">Side B · Against</span>
              </div>
              <h3 className="stance">{e.b.label}</h3>
              {renderArgs(e.b, true)}
              <Best e={e} side="b" />
            </div>
          </div>
        </div>

        <aside className="rail">
          <div className="card player">
            <h4>
              <span>{on ? "Now playing" : "Listen"}</span>
              <span>Ep. {e.n}</span>
            </h4>
            <div className="ttl">{curCh.label}</div>
            <div className="prog">
              {ch.map((c) => {
                const w = c.to - c.from;
                const fill = Math.max(0, Math.min(1, (t - c.from) / w));
                return (
                  <button
                    type="button"
                    key={c.id}
                    style={{ flex: w }}
                    aria-label={`Jump to ${c.label}`}
                    onClick={() => seek(e.n, c.from)}
                  >
                    <i style={{ width: `${fill * 100}%`, background: chColor[c.id] }} />
                  </button>
                );
              })}
            </div>
            <div className="ptime">
              <b>{fmt(t)}</b>
              <span>-{fmt(e.dur - t)}</span>
            </div>
            <div className="pctl">
              <button
                type="button"
                className="spd"
                aria-label="Playback speed"
                onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
              >
                {speed}×
              </button>
              <button
                type="button"
                className="sm"
                aria-label="Back 15 seconds"
                onClick={() => seek(e.n, t - 15)}
              >
                {I.back15}
              </button>
              <button
                type="button"
                className={`pl${on ? " is-on" : ""}`}
                aria-label={on ? "Pause" : "Play"}
                onClick={() => toggle(e.n)}
              >
                {on ? I.pause(22) : I.play(22)}
              </button>
              <button
                type="button"
                className="sm"
                aria-label="Forward 15 seconds"
                onClick={() => seek(e.n, t + 15)}
              >
                {I.fwd15}
              </button>
              <span
                className={`eq${on ? " is-on" : ""}`}
                style={{ width: 44, justifyContent: "center" }}
              >
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>

          <div className="card vote">
            <h4>
              <span>Your verdict</span>
              <span>{comma(va + vb)} votes</span>
            </h4>
            <p className="q">Which side convinced you?</p>
            {!v ? (
              <>
                <div className="vbtns">
                  <button
                    type="button"
                    className="vbtn is-a"
                    onClick={() => setVotes({ ...votes, [e.n]: "a" })}
                  >
                    Side A
                  </button>
                  <button
                    type="button"
                    className="vbtn is-b"
                    onClick={() => setVotes({ ...votes, [e.n]: "b" })}
                  >
                    Side B
                  </button>
                </div>
                <p className="vnote">
                  Results appear after you vote. Judge the evidence, not the host.
                </p>
              </>
            ) : (
              <div className="vres">
                <div className="vbar">
                  <div className="is-x" style={{ width: `${pa}%` }}>
                    {pa}%
                  </div>
                  <div className="is-y" style={{ flex: 1 }}>
                    {100 - pa}%
                  </div>
                </div>
                <div className="vl">
                  <span>Side A · {comma(va)}</span>
                  <span>{comma(vb)} · Side B</span>
                </div>
                <div className="you">
                  <b style={{ color: v === "a" ? "var(--sand-d)" : "var(--sage-d)" }}>
                    {I.check} You sided with {v.toUpperCase()}
                  </b>
                  <button
                    type="button"
                    onClick={() => {
                      const nv = { ...votes };
                      delete nv[e.n];
                      setVotes(nv);
                    }}
                  >
                    Change vote
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h4>
              <span>Evidence</span>
              <span>Tap a number</span>
            </h4>
            <ol className="srcs">
              {e.src.map((s, i) => (
                <li key={i} className={cite === i + 1 ? "is-on" : ""}>
                  <span className="nn">[{i + 1}]</span>
                  <span className="st">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    );
  };

  const SEGS = [
    {
      id: "q",
      label: "The question",
      from: "0:00",
      to: "1:15",
      w: 75,
      bg: "#e6ded1",
      fg: "#22201c",
      d: "We frame the question, define the terms and say what would count as evidence either way.",
    },
    {
      id: "a",
      label: "Side A",
      from: "1:15",
      to: "6:30",
      w: 315,
      bg: "#b98b5e",
      fg: "#fff",
      d: "One host builds the strongest case for. Three arguments, every claim cited on screen and in the notes.",
    },
    {
      id: "b",
      label: "Side B",
      from: "6:30",
      to: "11:45",
      w: 315,
      bg: "#7f9a7a",
      fg: "#fff",
      d: "The other host makes the strongest case against, under exactly the same rules and the same clock.",
    },
    {
      id: "e",
      label: "Evidence check",
      from: "11:45",
      to: "14:00",
      w: 135,
      bg: "#e7d5bf",
      fg: "#5d4326",
      d: "We test each side’s best source: sample size, date, who funded it, and what it doesn’t show.",
    },
    {
      id: "y",
      label: "Your call",
      from: "14:00",
      to: "15:00",
      w: 60,
      bg: "#22201c",
      fg: "#f4efe6",
      d: "No winner is declared. The vote opens on the site and results are shared the following week.",
    },
  ];

  const format = () => {
    const s = SEGS.find((x) => x.id === seg) ?? SEGS[1];
    return (
      <div className="fade">
        <div className="fmt-h">
          <div>
            <span className="kick">
              <span className="dd">
                <i />
                <i />
              </span>
              The format
            </span>
            <h2>Built to be fair, in fifteen minutes.</h2>
          </div>
          <p>
            Same structure every week, so you always know where you are. Hosts are assigned a side
            by coin toss, and neither gets the last word.
          </p>
        </div>
        <div className="flow">
          <div className="step">
            <div className="art" style={{ background: "#ece5d8" }}>
              <svg width="88" height="72" viewBox="0 0 88 72" aria-hidden="true">
                <circle cx="44" cy="36" r="30" fill="#f4efe6" stroke="#22201c" strokeWidth="2" />
                <text
                  x="44"
                  y="48"
                  textAnchor="middle"
                  fontFamily="Georgia, serif"
                  fontSize="36"
                  fill="#22201c"
                >
                  ?
                </text>
              </svg>
            </div>
            <span className="sn">01</span>
            <h3>One question</h3>
            <p>A single, answerable yes-or-no question. No loaded wording, no straw men.</p>
          </div>
          <div className="conn" aria-hidden="true">
            <svg width="40" height="12" viewBox="0 0 40 12">
              <path
                d="M0 6h34m-5-5 5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="step">
            <div
              className="art"
              style={{ background: "linear-gradient(90deg,#f0e4d4 50%,#e3eadd 50%)" }}
            >
              <svg width="120" height="72" viewBox="0 0 120 72" aria-hidden="true">
                <rect x="10" y="16" width="38" height="40" rx="8" fill="#b98b5e" />
                <rect x="72" y="16" width="38" height="40" rx="8" fill="#7f9a7a" />
                <rect x="59" y="4" width="2" height="64" rx="1" fill="#22201c" />
                <text
                  x="29"
                  y="42"
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                  fontWeight="700"
                  fontSize="16"
                  fill="#fff"
                >
                  A
                </text>
                <text
                  x="91"
                  y="42"
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                  fontWeight="700"
                  fontSize="16"
                  fill="#fff"
                >
                  B
                </text>
              </svg>
            </div>
            <span className="sn">02</span>
            <h3>Two perspectives</h3>
            <p>
              The strongest case for each side, built only from evidence we can cite and you can
              check.
            </p>
          </div>
          <div className="conn" aria-hidden="true">
            <svg width="40" height="12" viewBox="0 0 40 12">
              <path
                d="M0 6h34m-5-5 5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="step">
            <div className="art" style={{ background: "#e3eadd" }}>
              <svg width="88" height="72" viewBox="0 0 88 72" aria-hidden="true">
                <circle cx="44" cy="36" r="28" fill="none" stroke="#d2ddca" strokeWidth="8" />
                <circle
                  cx="44"
                  cy="36"
                  r="28"
                  fill="none"
                  stroke="#52694f"
                  strokeWidth="8"
                  strokeDasharray="44 132"
                  strokeLinecap="round"
                  transform="rotate(-90 44 36)"
                />
                <text
                  x="44"
                  y="42"
                  textAnchor="middle"
                  fontFamily="Georgia, serif"
                  fontSize="18"
                  fill="#22201c"
                >
                  15
                </text>
              </svg>
            </div>
            <span className="sn">03</span>
            <h3>Fifteen minutes</h3>
            <p>Short enough for a commute, long enough to change your mind. Then you vote.</p>
          </div>
        </div>
        <div className="anat">
          <div className="anat-h">
            <b>Anatomy of an episode</b>
            <span>Select a segment</span>
          </div>
          <div className="seglist" role="group" aria-label="Episode segments">
            {SEGS.map((x) => (
              <button
                type="button"
                key={x.id}
                aria-pressed={seg === x.id}
                style={{ flex: x.w, background: x.bg, color: x.fg }}
                onClick={() => setSeg(x.id)}
              >
                {x.label}
                <span>
                  {x.from}–{x.to}
                </span>
              </button>
            ))}
          </div>
          <div className="tl-d">
            <b>{s.label}</b>
            <span>{s.d}</span>
          </div>
        </div>
        <div className="rrow">
          {[
            [I.book, "Every claim cited", "Sources on screen and in the show notes."],
            [I.clock, "Equal time", "Both sides get the same minutes, to the second."],
            [I.head, "Sides by coin toss", "Hosts often argue against their own view."],
            [I.check, "No verdict from us", "Listeners vote. We publish the split."],
          ].map(([ic, t, d]) => (
            <div className="rr" key={t as string}>
              <span className="ri">{ic}</span>
              <div>
                <b>{t}</b>
                <p>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const about = () => (
    <div className="ab fade">
      <div>
        <span className="kick">
          <span className="dd">
            <i />
            <i />
          </span>
          About the show
        </span>
        <h2>Two hosts, one coin toss, no winners.</h2>
        <p className="lead">
          Sandalwood &amp; Sage started in 2024 as an experiment: could two friends who disagree
          about almost everything make the best case for the other side? Every Tuesday we pick a
          question people argue about, split it down the middle and stick to what the evidence can
          actually support.
        </p>
        <div className="hosts">
          <div className="host">
            <span className="av" style={{ background: "linear-gradient(135deg,#c99d70,#8a6237)" }}>
              NR
            </span>
            <div>
              <b>Nadia Rahman</b>
              <span className="role">Co-host · former policy researcher</span>
              <p>
                Reads the footnotes so you don’t have to. Has argued both sides of rent control.
              </p>
            </div>
          </div>
          <div className="host">
            <span className="av" style={{ background: "linear-gradient(135deg,#97b092,#52694f)" }}>
              OH
            </span>
            <div>
              <b>Owen Hartley</b>
              <span className="role">Co-host · science journalist</span>
              <p>Keeps the clock. Lost the coin toss on nuclear power three times in a row.</p>
            </div>
          </div>
        </div>
        <div className="card queue">
          <h4>
            <span>Listener queue · what should we debate next?</span>
            <span>Vote to bump</span>
          </h4>
          {QUEUE.map((q, i) => {
            const on = !!ups[i];
            return (
              <div className="qrow" key={q.q}>
                <p>
                  {q.q}
                  <small>
                    {q.cat} · suggested by {q.by}
                  </small>
                </p>
                <button
                  type="button"
                  className="up"
                  aria-pressed={on}
                  aria-label={`Upvote: ${q.q}`}
                  onClick={() => setUps({ ...ups, [i]: !on })}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="m5 15 7-7 7 7"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {q.n + (on ? 1 : 0)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className="nums">
          <div>
            <b>64</b>
            <span>Debates published</span>
          </div>
          <div>
            <b>1,140</b>
            <span>Sources cited</span>
          </div>
          <div>
            <b>38k</b>
            <span>Monthly listens</span>
          </div>
          <div>
            <b>52 / 48</b>
            <span>Average vote split</span>
          </div>
        </div>
        <div className="card">
          <h4>
            <span>How we pick sources</span>
          </h4>
          <ul className="rules">
            <li>
              <span className="ri">{I.book}</span>
              <span>
                <b>Recent and checkable.</b> Published since 2019, and free to read wherever
                possible.
              </span>
            </li>
            <li>
              <span className="ri">{I.clock}</span>
              <span>
                <b>Size and funding stated.</b> We say who paid for a study and how many people it
                covered.
              </span>
            </li>
            <li>
              <span className="ri">{I.check}</span>
              <span>
                <b>Corrections in public.</b> Seven so far, each logged in the show notes.
              </span>
            </li>
          </ul>
        </div>
        <div className="card stype" style={{ marginTop: 14 }}>
          <h4>
            <span>Where our evidence comes from</span>
            <span>1,140 sources</span>
          </h4>
          <div className="stbar">
            {STYPES.map((t) => (
              <i key={t.l} style={{ flex: t.v, background: t.c }} />
            ))}
          </div>
          <div className="stl">
            {STYPES.map((t) => (
              <span key={t.l}>
                <i style={{ background: t.c }} />
                {t.l}
                <b>{t.v}%</b>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const listenItems: { k: string; ic: ReactNode; tone: string; t: string; s: string }[] = [
    {
      k: "app",
      ic: I.phone,
      tone: "ts",
      t: "Your podcast app",
      s: "Follow in any app that takes a feed",
    },
    {
      k: "web",
      ic: I.globe,
      tone: "tg",
      t: "Listen in the browser",
      s: "Play the latest debate here",
    },
    { k: "rss", ic: I.rss, tone: "nn", t: "Copy RSS feed", s: "feeds.sandsage.fm/debates.xml" },
  ];

  return (
    <div className="mk-ss">
      <style>{CSS}</style>
      <header className="hd">
        <button
          type="button"
          className="brand"
          onClick={() => setView("home")}
          aria-label="Sandalwood & Sage home"
        >
          <Logo />
          <b>
            Sandalwood <i>&amp;</i> Sage
          </b>
        </button>
        <nav className="links" aria-label="Main">
          {nav.map(([v, l]) => (
            <button
              type="button"
              key={v}
              aria-current={navActive === v ? "page" : undefined}
              onClick={() => setView(v)}
            >
              {l}
            </button>
          ))}
        </nav>
        <div className="hd-r">
          {(player.on || player.t > 0) && (
            <div className="np">
              <button
                type="button"
                className="pp"
                aria-label={player.on ? "Pause" : "Play"}
                onClick={() => toggle(player.n)}
              >
                {player.on ? I.pause(12) : I.play(12)}
              </button>
              <span className={`eq${player.on ? " is-on" : ""}`}>
                <i />
                <i />
                <i />
              </span>
              Ep. {pEp.n} <span className="t">{fmt(player.t)}</span>
            </div>
          )}
          <button
            type="button"
            className="listen"
            aria-expanded={menu}
            aria-haspopup="menu"
            onClick={() => setMenu(!menu)}
          >
            {I.head} Listen <span className="cv">{I.chev}</span>
          </button>
        </div>
      </header>
      {menu && (
        <>
          <button
            type="button"
            className="scrim"
            aria-label="Close menu"
            onClick={() => setMenu(false)}
          />
          <div className="menu" role="menu">
            <h4>Listen and follow</h4>
            {listenItems.map((m) => (
              <button
                type="button"
                role="menuitem"
                key={m.k}
                onClick={() => {
                  if (m.k === "rss") {
                    setCopied(true);
                    return;
                  }
                  if (m.k === "web") {
                    setPlayer((p) => (p.n === 64 ? { ...p, on: true } : { n: 64, t: 0, on: true }));
                  }
                  setMenu(false);
                }}
              >
                <span className={`ic ${m.tone}`}>{m.ic}</span>
                <span className="mt">
                  <b>{m.t}</b>
                  <span>{m.s}</span>
                </span>
                {m.k === "rss" && copied && <span className="ok">{I.check} Copied</span>}
              </button>
            ))}
            <hr />
            <button type="button" role="menuitem" onClick={() => setMenu(false)}>
              <span className="ic nn">{I.mail}</span>
              <span className="mt">
                <b>Tuesday email</b>
                <span>New debate plus sources, 4,900 readers</span>
              </span>
            </button>
          </div>
        </>
      )}
      <main className="pg">
        {view === "home" && home()}
        {view === "episodes" && episodes()}
        {view === "episode" && detail()}
        {view === "format" && format()}
        {view === "about" && about()}
      </main>
    </div>
  );
}
