// ──────────────────────────────────────────────────
//  StyleMate Quiz Questions — Male
// ──────────────────────────────────────────────────

export const QUIZ_QUESTIONS_MALE = [
  {
    id: "occasion",
    title: "What's the occasion?",
    subtitle: "Tell us where you're heading",
    type: "single",
    field: "occasion",
    options: [
      { id: "college", label: "Daily college wear",       icon: "🎒" },
      { id: "office",  label: "Office / corporate",       icon: "💼" },
      { id: "biz-casual", label: "Business casual",       icon: "👔" },
      { id: "date",    label: "Date night",               icon: "🌹" },
      { id: "wedding", label: "Wedding guest",            icon: "💍" },
      { id: "festive", label: "Festive (Diwali, Puja)",   icon: "🪔" },
      { id: "travel",  label: "Travel / airport",         icon: "✈️" },
      { id: "gym",     label: "Gym / active",             icon: "🏋️" },
      { id: "brunch",  label: "Brunch / café",            icon: "☕" },
      { id: "nightout",label: "Night out / club",         icon: "🎶" },
      { id: "family",  label: "Family function",          icon: "🏠" },
      { id: "interview",label: "Interview / professional",icon: "📋" },
    ],
  },
  {
    id: "style",
    title: "What's your style personality?",
    subtitle: "Pick up to 3 that describe you best",
    type: "multiple",
    maxSelect: 3,
    field: "stylePersonality",
    options: [
      { id: "minimalist",   label: "Minimalist",    icon: "⚪" },
      { id: "streetwear",   label: "Streetwear",    icon: "🧢" },
      { id: "classic",      label: "Classic / Tailored", icon: "🎩" },
      { id: "sporty",       label: "Sporty / Active", icon: "⚡" },
      { id: "grunge",       label: "Grunge / Rock", icon: "🎸" },
      { id: "edgy",         label: "Edgy",          icon: "🖤" },
      { id: "preppy",       label: "Preppy",        icon: "🏫" },
      { id: "vintage",      label: "Vintage",       icon: "📻" },
      { id: "luxury",       label: "Luxury",        icon: "💎" },
      { id: "smart-casual", label: "Smart casual",  icon: "👕" },
      { id: "rugged",       label: "Rugged / Outdoors", icon: "🌲" },
    ],
  },
  {
    id: "preferredFit",
    title: "What's your preferred fit?",
    subtitle: "How do you like your clothes to feel?",
    type: "single",
    field: "preferredFit",
    options: [
      { id: "slim",     label: "Slim / Fitted",   icon: "📏" },
      { id: "regular",  label: "Regular / Classic", icon: "👕" },
      { id: "loose",    label: "Loose / Relaxed", icon: "🧘‍♂️" },
      { id: "oversized",label: "Oversized / Baggy", icon: "🛹" },
    ],
  },
  {
    id: "footwear",
    title: "Sneakers vs Loafers?",
    subtitle: "What is your go-to footwear choice?",
    type: "single",
    field: "footwear",
    options: [
      { id: "sneakers", label: "Sneakers",        icon: "👟" },
      { id: "loafers",  label: "Loafers / Formal",icon: "👞" },
      { id: "boots",    label: "Boots",           icon: "👢" },
      { id: "sandals",  label: "Sandals / Sliders",icon: "🩴" },
    ],
  },
  {
    id: "bodyType",
    title: "What's your body type?",
    subtitle: "Helps us find the most flattering cuts for you",
    type: "single",
    field: "bodyType",
    options: [
      { id: "slim",      label: "Slim",      icon: "🪶" },
      { id: "athletic",  label: "Athletic",  icon: "🏃‍♂️" },
      { id: "average",   label: "Average",   icon: "🙂" },
      { id: "broad",     label: "Broad / Muscular", icon: "🏋️‍♂️" },
      { id: "husky",     label: "Husky / Plus-size", icon: "👕" },
      { id: "tall",      label: "Tall",      icon: "🗼" },
    ],
  },
  {
    id: "season",
    title: "What's the season / weather like?",
    subtitle: "We'll suggest fabrics and layers accordingly",
    type: "single",
    field: "season",
    options: [
      { id: "hot-summer",  label: "Hot summer",     icon: "☀️" },
      { id: "humid",       label: "Humid (coastal)", icon: "🌊" },
      { id: "rainy",       label: "Rainy",           icon: "🌧️" },
      { id: "mild-winter", label: "Mild winter",     icon: "🍂" },
      { id: "cold-winter", label: "Cold winter",     icon: "❄️" },
      { id: "all-season",  label: "All season",      icon: "🌈" },
    ],
  },
  {
    id: "budget",
    title: "What's your budget range?",
    subtitle: "We'll keep our suggestions within your comfort zone",
    type: "single",
    field: "budget",
    options: [
      { id: "under-1k",   label: "Under ₹1,000",       icon: "💚" },
      { id: "1k-3k",      label: "₹1,000 – ₹3,000",    icon: "💛" },
      { id: "3k-7k",      label: "₹3,000 – ₹7,000",    icon: "🧡" },
      { id: "7k-15k",     label: "₹7,000 – ₹15,000",   icon: "❤️" },
      { id: "luxury",     label: "Luxury (₹15,000+)",   icon: "💜" },
    ],
  },
];

// ── Initial state shape for React ──────────────────
export const INITIAL_QUIZ_STATE_MALE = QUIZ_QUESTIONS_MALE.reduce((acc, q) => {
  acc[q.id] = q.type === "multiple" ? [] : null;
  return acc;
}, {});
